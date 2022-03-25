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

package pos

import (
	"context"
	"fmt"
	"io/ioutil"
	"os"
	"sync"
	"sync/atomic"
	"testing"

	"github.com/container-storage-interface/spec/lib/go/csi"

	csicommon "github.com/poseidonos/pos-csi/pkg/csi-common"
)

//-------------Create & Delete Volume Tests--------------
func TestNvmeofVolume(t *testing.T) {
	testVolume("nvme-tcp", t)
}

func TestNvmeofIdempotency(t *testing.T) {
	testIdempotency("nvme-tcp", t)
}

func TestNvmeofConcurrency(t *testing.T) {
	testConcurrency("nvme-tcp", t)
}

func TestNvmeWithEmptyVolumeName(t *testing.T) {
	testEmptyVolumeName("nvme-tcp", t)
}

func TestNvmeWithoutVolumeCapabilities(t *testing.T) {
	testWithoutVolumeCapabilities("nvme-tcp", t)
}

func TestNvmeWithoutCapacityRange(t *testing.T) {
	testWithoutCapacityRange("nvme-tcp", t)
}

func TestNvmeWithoutVolumesize(t *testing.T) {
	testWithoutVolumesize("nvme-tcp", t)
}

func TestNvmeWithInfiniteVolumesize(t *testing.T) {
	testWithInfiniteVolumesize("nvme-tcp", t)
}

func TestNvmeWithWrongParams(t *testing.T) {
	testWithWrongParams("nvme-tcp", t)
}

func TestNvmeWithSameNameDiffSize(t *testing.T) {
	testWithSameNameDiffSize("nvme-tcp", t)
}

func TestNvmeDeleteWithoutVolumeID(t *testing.T) {
	testDeleteWithoutVolumeID("nvme-tcp", t)
}

func TestNvmeDeleteOnDeletedVolume(t *testing.T) {
	testDeleteOnDeletedVolume("nvme-tcp", t)
}

//--------------ValidateVolumeCapabilities Tests--------------
func TestNvmeValidateVolumeCapabilities(t *testing.T) {
	testValidateVolumeCapabilities("nvme-tcp", t)
}

func TestNvmeValidateVolumeCapabilitiesonDeletedVolume(t *testing.T) {
	testValidateVolumeCapabilitiesonDeletedVolume("nvme-tcp", t)
}

func TestNvmeValidateVolumeCapabilitiesWithoutVolumeId(t *testing.T) {
	testValidateVolumeCapabilitiesWithoutVolumeId("nvme-tcp", t)
}

func TestNvmeValidateVolumeCapabilitiesWithoutVolumeCapabilities(t *testing.T) {
	testValidateVolumeCapabilitiesWithoutVolumeCapabilities("nvme-tcp", t)
}

func testVolume(targetType string, t *testing.T) {
	cs, err := createTestController(targetType)
	if err != nil {
		t.Fatal(err)
	}

	const volumeName = "test-volume"
	const volumeSize = 256 * 1024 * 1024

	// create volume#1
	volumeID1, err := createTestVolume(cs, volumeName, volumeSize)
	if err != nil {
		t.Fatal(err)
	}
	// delete volume#1
	err = deleteTestVolume(cs, volumeID1)
	if err != nil {
		t.Fatal(err)
	}

	// create volume#2 with same name
	volumeID2, err := createTestVolume(cs, volumeName, volumeSize)
	if err != nil {
		t.Fatal(err)
	}
	// delete volume#2
	err = deleteTestVolume(cs, volumeID2)
	if err != nil {
		t.Fatal(err)
	}

	// make sure volumeID1 != volumeID2
	if volumeID1 == volumeID2 {
		t.Fatal("volume id should be different")
	}

}

func testIdempotency(targetType string, t *testing.T) {
	cs, err := createTestController(targetType)
	if err != nil {
		t.Fatal(err)
	}

	const volumeName = "test-volume-idem"
	const requestCount = idempotencyCount
	const volumeSize = 256 * 1024 * 1024

	volumeID, err := createSameVolumeInParallel(cs, volumeName, requestCount, volumeSize)
	if err != nil {
		t.Fatal(err)
	}
	err = deleteSameVolumeInParallel(cs, volumeID, requestCount)
	if err != nil {
		t.Fatal(err)
	}
}

func testConcurrency(targetType string, t *testing.T) {
	cs, err := createTestController(targetType)
	if err != nil {
		t.Fatal(err)
	}

	// count * size cannot exceed storage capacity
	const volumeNamePrefix = "test-volume-con-"
	const volumeCount = concurrencyCount
	const volumeSize = 16 * 1024 * 1024

	// create/delete multiple volumes in parallel
	var wg sync.WaitGroup
	var errCount int32
	for i := 0; i < volumeCount; i++ {
		volumeName := fmt.Sprintf("%s%d", volumeNamePrefix, i)
		wg.Add(1)
		go func(volumeNameLocal string) {
			defer wg.Done()

			volumeIDLocal, errLocal := createTestVolume(cs, volumeNameLocal, volumeSize)
			if errLocal != nil {
				t.Logf("createTestVolume failed: %s", errLocal)
				atomic.AddInt32(&errCount, 1)
			}

			errLocal = deleteTestVolume(cs, volumeIDLocal)
			if errLocal != nil {
				t.Logf("deleteTestVolume failed: %s", errLocal)
				atomic.AddInt32(&errCount, 1)
			}
		}(volumeName)
	}
	wg.Wait()
	if errCount != 0 {
		t.Fatal("concurrency test failed")
	}

}

func testEmptyVolumeName(targetType string, t *testing.T) {
	cs, err := createTestController(targetType)
	if err != nil {
		t.Fatal(err)
	}

	const volumeName = ""
	const volumeSize = 256 * 1024 * 1024

	volumeID, err := createTestVolume(cs, volumeName, volumeSize)

	//should get error
	if err == nil {
		err = deleteTestVolume(cs, volumeID)
		if err != nil {
			t.Fatal(err)
		}
		t.Fatal("Volume Created with Empty Name")
	}
}

func testWithoutVolumeCapabilities(targetType string, t *testing.T) {
	cs, err := createTestController(targetType)
	if err != nil {
		t.Fatal(err)
	}

	const volumeName = "test-volume-no-capabilities"
	const volumeSize = 256 * 1024 * 1024

	reqCreate := csi.CreateVolumeRequest{
		Name:          volumeName,
		CapacityRange: &csi.CapacityRange{RequiredBytes: volumeSize},
		Parameters:    volumeInfo,
	}

	resp, err := cs.CreateVolume(context.TODO(), &reqCreate)

	//should get error
	if err == nil {
		volumeID := resp.GetVolume().GetVolumeId()
		if volumeID == "" {
			t.Fatal("empty volume id")
		}
		err = deleteTestVolume(cs, volumeID)
		if err != nil {
			t.Fatal(err)
		}
		t.Fatal("Volume Created without Capabilities")
	}
}

func testWithoutCapacityRange(targetType string, t *testing.T) {
	cs, err := createTestController(targetType)
	if err != nil {
		t.Fatal(err)
	}

	const volumeName = "test-volume-without-capacity-range"
	const volumeSize = 256 * 1024 * 1024

	reqCreate := csi.CreateVolumeRequest{
		Name:               volumeName,
		VolumeCapabilities: []*csi.VolumeCapability{},
		Parameters:         volumeInfo,
	}

	resp, err := cs.CreateVolume(context.TODO(), &reqCreate)
	if err != nil {
		t.Fatal(err)
	}

	volumeID := resp.GetVolume().GetVolumeId()
	if volumeID == "" {
		t.Fatal("empty volume id")
	}
	err = deleteTestVolume(cs, volumeID)
	if err != nil {
		t.Fatal(err)
	}
}

func testWithoutVolumesize(targetType string, t *testing.T) {
	cs, err := createTestController(targetType)
	if err != nil {
		t.Fatal(err)
	}

	const volumeName = "test-volume"

	reqCreate := csi.CreateVolumeRequest{
		Name:               volumeName,
		CapacityRange:      &csi.CapacityRange{},
		VolumeCapabilities: []*csi.VolumeCapability{},
		Parameters:         volumeInfo,
	}

	resp, err := cs.CreateVolume(context.TODO(), &reqCreate)
	if err != nil {
		t.Fatal(err)
	}
	volumeID := resp.GetVolume().GetVolumeId()
	if volumeID == "" {
		t.Fatal("empty volume id")
	}
	err = deleteTestVolume(cs, volumeID)
	if err != nil {
		t.Fatal(err)
	}
}

func testWithInfiniteVolumesize(targetType string, t *testing.T) {
	cs, err := createTestController(targetType)
	if err != nil {
		t.Fatal(err)
	}

	const volumeName = "test-volume"
	const volumeSize = infiniteVolumeSize

	volumeID, err := createTestVolume(cs, volumeName, volumeSize)
	if err == nil {
		localErr := deleteTestVolume(cs, volumeID)
		if localErr != nil {
			t.Fatal(err)
		}
		t.Fatal("Volume size should be exceeds")
	}
}

func testWithWrongParams(targetType string, t *testing.T) {
	cs, err := createTestController(targetType)
	if err != nil {
		t.Fatal(err)
	}

	var volumeName = "test-volume-without-params"
	const volumeSize = 256 * 1024 * 1024

	//Without Parameters
	var emptyVolumeInfo = map[string]string{}
	volumeID, err := createTestVolumeWithWrongParameters(cs, volumeName, volumeSize, emptyVolumeInfo)

	if err == nil {
		localErr := deleteTestVolume(cs, volumeID)
		if localErr != nil {
			t.Fatal(localErr)
		}
		t.Fatal("Volume Created without Parameters")
	}

	//Again without Parameters sameName To get POSVolume status creating
	volumeID, err = createTestVolumeWithWrongParameters(cs, volumeName, volumeSize, emptyVolumeInfo)

	if err == nil {
		localErr := deleteTestVolume(cs, volumeID)
		if localErr != nil {
			t.Fatal(localErr)
		}
		t.Fatal("Volume Created without Parameters")
	}

	//With wrong TargetAddress
	volumeName = "test-volume-without-targetaddress"
	var volumeInfoWithoutTargetAddress = map[string]string{
		"transportType":      volumeInfo["transportType"],
		"targetAddress":      "wrongaddress",
		"transportServiceId": volumeInfo["transportServiceId"],
		"nqnName":            volumeInfo["nqnName"],
		"arrayName":          volumeInfo["arrayName"],
		"provisionerIP":      volumeInfo["provisionerIP"],
		"provisionerPort":    volumeInfo["provisionerPort"],
	}
	volumeID, err = createTestVolumeWithWrongParameters(cs, volumeName, volumeSize, volumeInfoWithoutTargetAddress)

	if err == nil {
		err = deleteTestVolume(cs, volumeID)
		if err != nil {
			t.Fatal(err)
		}
		t.Fatal("Volume Created without targetAddress")
	}

	//With wrong ProvisionerIP
	volumeName = "test-volume-without-provisionerIP"
	var volumeInfoWithoutProvisionerIp = map[string]string{
		"transportType":      volumeInfo["transportType"],
		"targetAddress":      volumeInfo["targetAddress"],
		"transportServiceId": volumeInfo["transportServiceId"],
		"nqnName":            volumeInfo["nqnName"],
		"arrayName":          volumeInfo["arrayName"],
		"provisionerIP":      "999.999.999.999",
		"provisionerPort":    volumeInfo["provisionerPort"],
	}
	volumeID, err = createTestVolumeWithWrongParameters(cs, volumeName, volumeSize, volumeInfoWithoutProvisionerIp)

	if err == nil {
		err = deleteTestVolume(cs, volumeID)
		if err != nil {
			t.Fatal(err)
		}
		t.Fatal("Volume Created without provisionerIP")
	}

	//Without ProvisionerPORT
	volumeName = "test-volume-without-provisionerPort"
	var volumeInfoWithoutProvisionerPort = map[string]string{
		"transportType":      volumeInfo["transportType"],
		"targetAddress":      volumeInfo["targetAddress"],
		"transportServiceId": volumeInfo["transportServiceId"],
		"nqnName":            volumeInfo["nqnName"],
		"arrayName":          volumeInfo["arrayName"],
		"provisionerIP":      volumeInfo["provisionerIP"],
		"provisionerPort":    "",
	}
	volumeID, err = createTestVolumeWithWrongParameters(cs, volumeName, volumeSize, volumeInfoWithoutProvisionerPort)

	if err == nil {
		err = deleteTestVolume(cs, volumeID)
		if err != nil {
			t.Fatal(err)
		}
		t.Fatal("Volume Created without provisioner port")
	}

}

func testWithSameNameDiffSize(targetType string, t *testing.T) {
	cs, err := createTestController(targetType)
	if err != nil {
		t.Fatal(err)
	}

	const volumeName = "test-volume"
	const volumeSize1 = 256 * 1024 * 1024
	const volumeSize2 = 16 * 1024 * 1024

	// create volume#1
	volumeID1, err1 := createTestVolume(cs, volumeName, volumeSize1)
	if err1 != nil {
		t.Fatal(err1)
	}

	// create volume#2 with same name diff size
	volumeID2, err2 := createTestVolume(cs, volumeName, volumeSize2)

	// delete volume#1
	err = deleteTestVolume(cs, volumeID1)
	if err != nil {
		t.Fatal(err)
	}

	//should get error#2
	if err2 == nil {
		// delete volume#2
		err = deleteTestVolume(cs, volumeID2)
		if err != nil {
			t.Fatal(err)
		}

		t.Fatal("Volume should not be created with same name different size")
	}

}

func testDeleteWithoutVolumeID(targetType string, t *testing.T) {
	cs, err := createTestController(targetType)
	if err != nil {
		t.Fatal(err)
	}
	const volumeID = ""

	err = deleteTestVolume(cs, volumeID)
	//should get err
	if err == nil {
		t.Fatal("VolumeId Is missing")
	}
}

func testDeleteOnDeletedVolume(targetType string, t *testing.T) {
	cs, err := createTestController(targetType)
	if err != nil {
		t.Fatal(err)
	}

	const volumeName = "test-volume"
	const volumeSize = 256 * 1024 * 1024

	// create volume
	volumeID, err := createTestVolume(cs, volumeName, volumeSize)
	if err != nil {
		t.Fatal(err)
	}
	// delete volume
	err = deleteTestVolume(cs, volumeID)
	if err != nil {
		t.Fatal(err)
	}

	//delete deleted volume which is handled in controllerserver.go file
	err = deleteTestVolume(cs, volumeID)
	if err != nil {
		t.Fatal(err)
	}

}

func testValidateVolumeCapabilities(targetType string, t *testing.T) {
	cd := csicommon.NewCSIDriver("test-driver", "test-version", "test-node")
	cs, err := newControllerServer(cd)
	if err != nil {
		t.Fatal(err)
	}

	const volumeName = "test-volume"
	const volumeSize = 256 * 1024 * 1024

	//To Check Unsupported Validate Volume Capabilities
	reqCreate := csi.CreateVolumeRequest{
		Name:               volumeName,
		CapacityRange:      &csi.CapacityRange{RequiredBytes: volumeSize},
		VolumeCapabilities: []*csi.VolumeCapability{},
		Parameters:         volumeInfo,
	}

	resp, err := cs.CreateVolume(context.TODO(), &reqCreate)
	if err != nil {
		t.Fatal(err)
	}
	// create volume
	volumeID := resp.GetVolume().GetVolumeId()
	if volumeID == "" {
		t.Fatal("Empty Volume ID")
	}

	reqVal := csi.ValidateVolumeCapabilitiesRequest{
		VolumeId: volumeID,
		VolumeCapabilities: []*csi.VolumeCapability{
			&csi.VolumeCapability{
				AccessMode: &csi.VolumeCapability_AccessMode{Mode: csi.VolumeCapability_AccessMode_SINGLE_NODE_WRITER},
			},
		},
	}

	_, err = cs.ValidateVolumeCapabilities(context.TODO(), &reqVal)
	if err != nil {
		t.Fatal(err)
	}

	// delete volume
	err = deleteTestVolume(cs, volumeID)
	if err != nil {
		t.Fatal(err)
	}

	//To Check Supported Validate Volume Capabilities
	volumeModes := []csi.VolumeCapability_AccessMode_Mode{
		csi.VolumeCapability_AccessMode_SINGLE_NODE_WRITER,
	}
	cd.AddVolumeCapabilityAccessModes(volumeModes)

	reqCreate = csi.CreateVolumeRequest{
		Name:          "test-test-vol",
		CapacityRange: &csi.CapacityRange{RequiredBytes: volumeSize},
		VolumeCapabilities: []*csi.VolumeCapability{
			&csi.VolumeCapability{
				AccessMode: &csi.VolumeCapability_AccessMode{Mode: csi.VolumeCapability_AccessMode_SINGLE_NODE_WRITER},
				AccessType: &csi.VolumeCapability_Mount{
					Mount: &csi.VolumeCapability_MountVolume{},
				},
			},
		},
		Parameters: volumeInfo,
	}

	resp, err = cs.CreateVolume(context.TODO(), &reqCreate)
	if err != nil {
		t.Fatal(err)
	}
	// create volume
	volumeID = resp.GetVolume().GetVolumeId()
	if volumeID == "" {
		t.Fatal("Empty Volume ID")
	}

	reqVal = csi.ValidateVolumeCapabilitiesRequest{
		VolumeId: volumeID,
		VolumeCapabilities: []*csi.VolumeCapability{
			&csi.VolumeCapability{
				AccessMode: &csi.VolumeCapability_AccessMode{Mode: csi.VolumeCapability_AccessMode_SINGLE_NODE_WRITER},
				AccessType: &csi.VolumeCapability_Mount{
					Mount: &csi.VolumeCapability_MountVolume{},
				},
			},
		},
	}

	_, err = cs.ValidateVolumeCapabilities(context.TODO(), &reqVal)
	if err != nil {
		t.Fatal(err)
	}

	// delete volume
	err = deleteTestVolume(cs, volumeID)
	if err != nil {
		t.Fatal(err)
	}
}

func testValidateVolumeCapabilitiesonDeletedVolume(targetType string, t *testing.T) {
	cs, err := createTestController(targetType)
	if err != nil {
		t.Fatal(err)
	}

	const volumeName = "test-volume"
	const volumeSize = 256 * 1024 * 1024

	// create volume
	volumeID, err := createTestVolume(cs, volumeName, volumeSize)
	if err != nil {
		t.Fatal(err)
	}

	// delete volume
	err = deleteTestVolume(cs, volumeID)
	if err != nil {
		t.Fatal(err)
	}

	reqVal := csi.ValidateVolumeCapabilitiesRequest{
		VolumeId: volumeID,
		VolumeCapabilities: []*csi.VolumeCapability{
			&csi.VolumeCapability{
				AccessMode: &csi.VolumeCapability_AccessMode{Mode: csi.VolumeCapability_AccessMode_SINGLE_NODE_WRITER},
			},
		},
	}

	_, err = cs.ValidateVolumeCapabilities(context.TODO(), &reqVal)
	if err == nil {
		localErr := deleteTestVolume(cs, volumeID)
		if localErr != nil {
			t.Fatal(localErr)
		}
		t.Fatal("Volume is deleted")
	}
}

func testValidateVolumeCapabilitiesWithoutVolumeId(targetType string, t *testing.T) {
	cs, err := createTestController(targetType)
	if err != nil {
		t.Fatal(err)
	}

	const volumeName = "test-volume"
	const volumeSize = 256 * 1024 * 1024

	// create volume
	volumeID, err := createTestVolume(cs, volumeName, volumeSize)
	if err != nil {
		t.Fatal(err)
	}

	reqVal := csi.ValidateVolumeCapabilitiesRequest{
		VolumeCapabilities: []*csi.VolumeCapability{
			&csi.VolumeCapability{
				AccessMode: &csi.VolumeCapability_AccessMode{Mode: csi.VolumeCapability_AccessMode_SINGLE_NODE_WRITER},
			},
		},
	}

	_, err = cs.ValidateVolumeCapabilities(context.TODO(), &reqVal)
	if err == nil {
		localErr := deleteTestVolume(cs, volumeID)
		if localErr != nil {
			t.Fatal(localErr)
		}
		t.Fatal("VolumeID is required to validate volumeCapabilities")
	}

	// delete volume
	err = deleteTestVolume(cs, volumeID)
	if err != nil {
		t.Fatal(err)
	}
}

func testValidateVolumeCapabilitiesWithoutVolumeCapabilities(targetType string, t *testing.T) {
	cs, err := createTestController(targetType)
	if err != nil {
		t.Fatal(err)
	}

	const volumeName = "test-volume"
	const volumeSize = 256 * 1024 * 1024

	// create volume
	volumeID, err := createTestVolume(cs, volumeName, volumeSize)
	if err != nil {
		t.Fatal(err)
	}

	reqVal := csi.ValidateVolumeCapabilitiesRequest{
		VolumeId: volumeID,
	}

	_, err = cs.ValidateVolumeCapabilities(context.TODO(), &reqVal)
	if err == nil {
		localErr := deleteTestVolume(cs, volumeID)
		if localErr != nil {
			t.Fatal(localErr)
		}
		t.Fatal("VolumeCapablities is required to validate volume capablities")
	}

	// delete volume
	err = deleteTestVolume(cs, volumeID)
	if err != nil {
		t.Fatal(err)
	}
}

func createTestController(targetType string) (cs *controllerServer, err error) {
	cd := csicommon.NewCSIDriver("test-driver", "test-version", "test-node")
	cs, err = newControllerServer(cd)
	if err != nil {
		return nil, err
	}

	return cs, nil
}

func createTestVolume(cs *controllerServer, name string, size int64) (string, error) {
	reqCreate := csi.CreateVolumeRequest{
		Name:               name,
		CapacityRange:      &csi.CapacityRange{RequiredBytes: size},
		VolumeCapabilities: []*csi.VolumeCapability{},
		Parameters:         volumeInfo,
	}

	resp, err := cs.CreateVolume(context.TODO(), &reqCreate)
	if err != nil {
		return "", err
	}

	volumeID := resp.GetVolume().GetVolumeId()
	if volumeID == "" {
		return "", fmt.Errorf("empty volume id")
	}

	return volumeID, nil
}

func createTestVolumeWithWrongParameters(cs *controllerServer, name string, size int64, parameters map[string]string) (string, error) {
	reqCreate := csi.CreateVolumeRequest{
		Name:               name,
		CapacityRange:      &csi.CapacityRange{RequiredBytes: size},
		VolumeCapabilities: []*csi.VolumeCapability{},
		Parameters:         parameters,
	}

	resp, err := cs.CreateVolume(context.TODO(), &reqCreate)
	if err != nil {
		return "", err
	}

	volumeID := resp.GetVolume().GetVolumeId()
	if volumeID == "" {
		return "", fmt.Errorf("empty volume id")
	}

	return volumeID, nil
}

func deleteTestVolume(cs *controllerServer, volumeID string) error {
	reqDelete := csi.DeleteVolumeRequest{VolumeId: volumeID}
	_, err := cs.DeleteVolume(context.TODO(), &reqDelete)
	return err
}

func createSameVolumeInParallel(cs *controllerServer, name string, count int, size int64) (string, error) {
	var wg sync.WaitGroup
	var errCount int32

	// issue multiple create requests to create *same* volume in parallel
	volumeID := make([]string, count)
	reqCreate := csi.CreateVolumeRequest{
		Name:               name,
		VolumeCapabilities: []*csi.VolumeCapability{},
		Parameters:         volumeInfo,
		CapacityRange:      &csi.CapacityRange{RequiredBytes: size},
	}
	for i := 0; i < count; i++ {
		wg.Add(1)
		go func(i int, wg *sync.WaitGroup) {
			defer wg.Done()
			for {
				resp, errLocal := cs.CreateVolume(context.TODO(), &reqCreate)
				if errLocal == errVolumeInCreation {
					continue
				}
				if errLocal != nil {
					atomic.AddInt32(&errCount, 1)
				}
				volumeID[i] = resp.GetVolume().GetVolumeId()
				break
			}
		}(i, &wg)
	}
	wg.Wait()

	if atomic.LoadInt32(&errCount) != 0 {
		return "", fmt.Errorf("some cs.CreateVolume failed")
	}

	// verify all returned volume ids are not empty and identical
	if volumeID[0] == "" {
		return "", fmt.Errorf("empty volume id")
	}
	for i := 1; i < count; i++ {
		if volumeID[i] != volumeID[0] {
			return "", fmt.Errorf("volume id mismatch")
		}
	}

	return volumeID[0], nil
}

func deleteSameVolumeInParallel(cs *controllerServer, volumeID string, count int) error {
	var wg sync.WaitGroup
	var errCount int32

	// issue delete requests to *same* volume in parallel
	reqDelete := csi.DeleteVolumeRequest{VolumeId: volumeID}
	for i := 0; i < count; i++ {
		wg.Add(1)
		go func(wg *sync.WaitGroup) {
			defer wg.Done()
			_, err := cs.DeleteVolume(context.TODO(), &reqDelete)
			if err != nil {
				atomic.AddInt32(&errCount, 1)
			}
		}(&wg)
	}
	wg.Wait()

	if atomic.LoadInt32(&errCount) != 0 {
		return fmt.Errorf("some cs.DeleteVolume failed")
	}
	return nil
}
