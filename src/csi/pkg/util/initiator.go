/*
 *   BSD LICENSE
 *   Copyright (c) 2021 Samsung Electronics Corporation
 *   All rights reserved.
 *
 *   Redistribution and use in source and binary forms, with or without
 *   modification, are permitted provided that the following conditions
 *   are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in
 *       the documentation and/or other materials provided with the
 *       distribution.
 *     * Neither the name of Samsung Electronics Corporation nor the names of its
 *       contributors may be used to endorse or promote products derived
 *       from this software without specific prior written permission.
 *
 *   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 *   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 *   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 *   A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 *   OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 *   SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 *   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 *   DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 *   THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 *   OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
 
package util

import (
	"context"
	"fmt"
	//	"io/ioutil"
	"os/exec"
	"path/filepath"
	"strings"
	"time"

	"k8s.io/klog"
)

// POSCsiInitiator defines interface for NVMeoF/iSCSI initiator
//
// - Connect initiates target connection and returns local block device filename
//   e.g., /dev/disk/by-id/nvme-uuid.c3fe887f-2db7-4d15-8fa7-e56987e04839
// - Disconnect terminates target connection
//
// - Caller(node service) should serialize calls to same initiator
// - Implementation should be idempotent to duplicated requests
type POSCsiInitiator interface {
	Connect() (string, error)
	Disconnect() error
}

func NewPOSCsiInitiator(volumeContext map[string]string) (POSCsiInitiator, error) {
	targetType := strings.ToLower(volumeContext["targetType"])
	klog.Errorf("Volume Details")
	switch targetType {
	case "rdma", "tcp":
		return &initiatorNVMf{
			// see util/nvmf.go VolumeInfo()
			targetType: volumeContext["targetType"],
			targetAddr: volumeContext["targetAddr"],
			targetPort: volumeContext["targetPort"],
			nqn:        volumeContext["nqn"],
			model:      volumeContext["model"],
		}, nil
	default:
		return nil, fmt.Errorf("unknown initiator: %s", targetType)
	}
}

// NVMf initiator implementation
type initiatorNVMf struct {
	targetType string
	targetAddr string
	targetPort string
	nqn        string
	model      string
}

func (nvmf *initiatorNVMf) Connect() (string, error) {
	// nvme connect -t tcp -a 192.168.1.100 -s 4420 -n "nqn"
	cmd := exec.Command("nvme", "version")
	stdout, err := cmd.CombinedOutput()
	if err != nil {
		klog.Errorf("Command uname failed: %s", err)
	}
	klog.Infof("Command uname Succeeded: %s", stdout)
	err = execWithTimeout([]string{"uname", "-a"}, 20)
	if err != nil {
		// go on checking device status in case caused by duplicated request
		klog.Errorf("command modprobe nvme failed: %s", err)
	}
	err = execWithTimeout([]string{"modprobe", "nvme_tcp"}, 20)
	if err != nil {
		// go on checking device status in case caused by duplicated request
		klog.Errorf("command modprobe nvme_tcp failed: %s", err)
	}
	cmdLine := []string{"nvme", "connect", "-t", strings.ToLower(nvmf.targetType),
		"-a", nvmf.targetAddr, "-s", nvmf.targetPort, "-n", nvmf.nqn}
	err = execWithTimeout(cmdLine, 40)
	if err != nil {
		// go on checking device status in case caused by duplicated request
		klog.Errorf("command %v failed: %s", cmdLine, err)
	}

	deviceGlob := fmt.Sprintf("/dev/disk/by-id/*%s*", nvmf.model)
	devicePath, err := waitForDeviceReady(deviceGlob, 20)
	if err != nil {
		klog.Infof("Error in devicePath: %v", err)
		return "", err
	}
	return devicePath, nil
}

func (nvmf *initiatorNVMf) Disconnect() error {
	// nvme disconnect -n "nqn"
	cmdLine := []string{"nvme", "disconnect", "-n", nvmf.nqn}
	err := execWithTimeout(cmdLine, 40)
	if err != nil {
		// go on checking device status in case caused by duplicate request
		klog.Errorf("command %v failed: %s", cmdLine, err)
	}

	deviceGlob := fmt.Sprintf("/dev/disk/by-id/*%s*", nvmf.model)
	return waitForDeviceGone(deviceGlob, 20)
}


// wait for device file comes up or timeout
func waitForDeviceReady(deviceGlob string, seconds int) (string, error) {
	klog.Info("Waiting for Device Ready")
	for i := 0; i <= seconds; i++ {
		time.Sleep(time.Second)
		/*
			files, err := ioutil.ReadDir("/dev")
			if err != nil {
				klog.Infof("%v", err)
			}
			for _, f := range files {
				klog.Infof("%v", f.Name())
			}
		*/
		matches, err := filepath.Glob(deviceGlob)
		if err != nil {
			return "", err
		}
		// two symbol links under /dev/disk/by-id/ to same device
		if len(matches) >= 1 {
			return matches[0], nil
		}
	}
	return "", fmt.Errorf("timed out waiting device ready: %s", deviceGlob)
}

// wait for device file gone or timeout
func waitForDeviceGone(deviceGlob string, seconds int) error {
	for i := 0; i <= seconds; i++ {
		time.Sleep(time.Second)
		matches, err := filepath.Glob(deviceGlob)
		if err != nil {
			return err
		}
		if len(matches) == 0 {
			return nil
		}
	}
	return fmt.Errorf("timed out waiting device gone: %s", deviceGlob)
}

// exec shell command with timeout(in seconds)
func execWithTimeout(cmdLine []string, timeout int) error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(timeout)*time.Second)
	defer cancel()

	klog.Infof("running command: %v", cmdLine)
	cmd := exec.CommandContext(ctx, cmdLine[0], cmdLine[1:]...) // #nosec G204
	output, err := cmd.CombinedOutput()

	if ctx.Err() == context.DeadlineExceeded {
		return fmt.Errorf("timed out")
	}
	if output != nil {
		klog.Infof("command returned: %s", output)
	}
	return err
}
