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
	"time"
	// "io/ioutil"
	// "os"
	// "sync"
	// "sync/atomic"
	"testing"
	"k8s.io/klog"

	"github.com/container-storage-interface/spec/lib/go/csi"

	csicommon "github.com/poseidonos/pos-csi/pkg/csi-common"
)


func beforeEach() {
	fmt.Printf("Current Unix Time: %v\n", time.Now().Unix())

    time.Sleep(10 * time.Second)

    fmt.Printf("Current Unix Time: %v\n", time.Now().Unix())
}

//--------------Node Get Capabilities --------------
func TestNvmeNodeGetCapabilities(t *testing.T){
	beforeEach()
	cs, ns, _, volumeID := testCreateVolumeNodeServer(t)

	testNodeGetCapabilities(cs, ns, volumeID, t)

	testDeleteVolumeNodeServer(cs, volumeID, t)
}


//------------------Node Stage and Unstage Tests --------------
func TestNvmeNodeStageUnstageVolume(t *testing.T){
	beforeEach()
	cs, ns, resp, volumeID := testCreateVolumeNodeServer(t)

	testNodeStageVolume(cs, ns, resp, volumeID, t)
	testNodeUnstageVolume(cs, ns, resp, volumeID, t)

	testDeleteVolumeNodeServer(cs, volumeID, t)
}


func TestNvmeNodeStageUnstageVolumeBlock(t *testing.T){
	beforeEach()
	cs, ns, resp, volumeID := testCreateVolumeNodeServer(t)

	testNodeStageVolumeBlock(cs, ns, resp, volumeID, t)
	testNodeUnstageVolume(cs, ns, resp, volumeID, t)

	testDeleteVolumeNodeServer(cs, volumeID, t)
}


func TestNvmeNodeStageUnstageVolumeWithDifferentAccessModes(t *testing.T){
	beforeEach()
	cs, ns, resp, volumeID := testCreateVolumeNodeServer(t)

	testNodeStageVolumeWithDifferentAccessModes(cs, ns, resp, volumeID, t)
	testNodeUnstageVolume(cs, ns, resp, volumeID, t)

	testDeleteVolumeNodeServer(cs, volumeID, t)
}

func TestNvmeNodeStageVolumeWithoutVolumeCapabilities(t *testing.T){
	beforeEach()
	cs, ns, resp, volumeID := testCreateVolumeNodeServer(t)

	testNodeStageVolumeWithoutVolumeCapabilities(cs, ns, resp, volumeID, t)

	testDeleteVolumeNodeServer(cs, volumeID, t)
}

func TestNvmeNodeStageVolumeWithoutVolumeId(t *testing.T){
	beforeEach()
	cs, ns, resp, volumeID := testCreateVolumeNodeServer(t)

	testNodeStageVolumeWithoutVolumeId(cs, ns, resp, volumeID, t)

	testDeleteVolumeNodeServer(cs, volumeID, t)
}

func TestNvmeNodeStageVolumeWithoutStagingTargetPath(t *testing.T){
	beforeEach()
	cs, ns, resp, volumeID := testCreateVolumeNodeServer(t)

	testNodeStageVolumeWithoutStagingTargetPath(cs, ns, resp, volumeID, t)

	testDeleteVolumeNodeServer(cs, volumeID, t)
}

func TestNvmeNodeStageVolumeWithWrongStagingTargetPath(t *testing.T){
	beforeEach()
	cs, ns, resp, volumeID := testCreateVolumeNodeServer(t)

	testNodeStageVolumeWithWrongStagingTargetPath(cs, ns, resp, volumeID, t)

	testDeleteVolumeNodeServer(cs, volumeID, t)
}

func TestNvmeNodeStageVolumeWithoutVolumeContext(t *testing.T){
	beforeEach()
	cs, ns, resp, volumeID := testCreateVolumeNodeServer(t)

	testNodeStageVolumeWithoutVolumeContext(cs, ns, resp, volumeID, t)

	testDeleteVolumeNodeServer(cs, volumeID, t)
}

func TestNvmeNodeStageOnStagedVolume(t *testing.T){
	beforeEach()
	cs, ns, resp, volumeID := testCreateVolumeNodeServer(t)

	testNodeStageOnStagedVolume(cs, ns, resp, volumeID, t)
	testNodeUnstageVolume(cs, ns, resp, volumeID, t)

	testDeleteVolumeNodeServer(cs, volumeID, t)
}

func TestNvmeNodeUnstageVolumeWithoutVolumeId(t *testing.T){
	beforeEach()
	cs, ns, resp, volumeID := testCreateVolumeNodeServer(t)
	testNodeStageVolume(cs, ns, resp, volumeID, t)

	testNodeUnstageVolumeWithoutVolumeId(cs, ns, resp, volumeID, t)
	
	testNodeUnstageVolume(cs,ns,resp,volumeID, t)
	testDeleteVolumeNodeServer(cs, volumeID, t)
}

func TestNvmeNodeUnstageVolumeWithoutStagingTargetPath(t *testing.T){
	beforeEach()
	cs, ns, resp, volumeID := testCreateVolumeNodeServer(t)
	testNodeStageVolume(cs, ns, resp, volumeID, t)
	
	testNodeUnstageVolumeWithoutStagingTargetPath(cs, ns, resp, volumeID, t)
	
	testNodeUnstageVolume(cs,ns,resp,volumeID, t)
	testDeleteVolumeNodeServer(cs, volumeID, t)
}

/*
func TestNvmeNodeUnstageVolumeWithWrongStagingTargetPath(t *testing.T){
	beforeEach()
	cs, ns, resp, volumeID := testCreateVolumeNodeServer(t)
	testNodeStageVolume(cs, ns, resp, volumeID, t)
	
	testNodeUnstageVolumeWithWrongStagingTargetPath(cs, ns, resp, volumeID, t)
	
	testNodeUnstageVolume(cs,ns,resp,volumeID, t)
	testDeleteVolumeNodeServer(cs, volumeID, t)
}
*/

func TestNvmeNodeUnstageVolumeOnDeletedVolume(t *testing.T){
	beforeEach()
	cs, ns, resp, volumeID := testCreateVolumeNodeServer(t)
	testDeleteVolumeNodeServer(cs, volumeID, t)
	
	testNodeUnstageVolumeOnDeletedVolume(cs, ns, resp, volumeID, t)
}

func TestNvmeNodeUnstageOnUnstagedVolume(t *testing.T){
	cs, ns, resp, volumeID := testCreateVolumeNodeServer(t)
	testNodeStageVolume(cs, ns, resp, volumeID, t)

	testNodeUnstageOnUnstagedVolume(cs, ns, resp, volumeID, t)

	testDeleteVolumeNodeServer(cs, volumeID, t)
}


func TestNvmeNodePublishUnpublishVolume(t *testing.T){
	beforeEach()
	cs, ns, resp, volumeID := testCreateVolumeNodeServer(t)
	testNodeStageVolume(cs, ns, resp, volumeID, t)
	
	testNodePublishVolume(cs, ns, resp, volumeID, t)
	testNodeUnpublishVolume(cs, ns, resp, volumeID, t)

	testNodeUnstageVolume(cs, ns, resp, volumeID, t)
	testDeleteVolumeNodeServer(cs, volumeID, t)
}
/*
func TestNvmeNodePublishUnpublishVolumeBlock(t *testing.T) {
	beforeEach()
	cs, ns, resp, volumeID := testCreateVolumeNodeServer(t)
	testNodeStageVolumeBlock(cs, ns, resp, volumeID, t)

	testNodePublishVolumeBlock(cs, ns, resp, volumeID, t)
	
	testNodeUnstageVolume(cs, ns, resp, volumeID, t)
	testDeleteVolumeNodeServer(cs, volumeID, t)
}
*/
func TestNvmeNodePublishVolumeWithoutTargetPath(t *testing.T){
	beforeEach()
	cs, ns, resp, volumeID := testCreateVolumeNodeServer(t)
	testNodeStageVolume(cs, ns, resp, volumeID, t)

	testNodePublishVolumeWithoutTargetPath(cs, ns, resp, volumeID, t)
	
	testNodeUnstageVolume(cs, ns, resp, volumeID, t)
	testDeleteVolumeNodeServer(cs, volumeID, t)
}

func TestNvmeNodePublishVolumeWithoutVolumeCapabilities(t *testing.T){
	beforeEach()
	cs, ns, resp, volumeID := testCreateVolumeNodeServer(t)
	testNodeStageVolume(cs, ns, resp, volumeID, t)

	testNodePublishVolumeWithoutVolumeCapabilities(cs, ns, resp, volumeID, t)
	
	testNodeUnstageVolume(cs, ns, resp, volumeID, t)
	testDeleteVolumeNodeServer(cs, volumeID, t)
}

func TestNvmeNodePublishVolumeWithoutVolumeId(t *testing.T){
	cs, ns, resp, volumeID := testCreateVolumeNodeServer(t)
	testNodeStageVolume(cs, ns, resp, volumeID, t)

	testNodePublishVolumeWithoutVolumeId(cs, ns, resp, volumeID, t)
	
	testNodeUnstageVolume(cs, ns, resp, volumeID, t)
	testDeleteVolumeNodeServer(cs, volumeID, t)
}

func TestNvmeNodePublishVolumeOnUnstagedVolume(t *testing.T){
	beforeEach()
	cs, ns, resp, volumeID := testCreateVolumeNodeServer(t)
	testNodeStageVolume(cs, ns, resp, volumeID, t)
	testNodeUnstageVolume(cs, ns, resp, volumeID, t)

	testNodePublishVolumeOnUnstagedVolume(cs, ns, resp, volumeID, t)

	testDeleteVolumeNodeServer(cs, volumeID, t)
}

func TestNvmeNodePublishVolumeOnPublishVolume(t *testing.T){
	beforeEach()
	cs, ns, resp, volumeID := testCreateVolumeNodeServer(t)
	testNodeStageVolume(cs, ns, resp, volumeID, t)	
	testNodePublishVolume(cs, ns, resp, volumeID, t)

	testNodePublishVolume(cs, ns, resp, volumeID, t)

	testNodeUnpublishVolume(cs, ns, resp, volumeID, t)
	testNodeUnstageVolume(cs, ns, resp, volumeID, t)
	testDeleteVolumeNodeServer(cs, volumeID, t)
}

func TestNvmeNodeUnpublishVolumeWithoutTargetPath(t *testing.T){
	beforeEach()
	cs, ns, resp, volumeID := testCreateVolumeNodeServer(t)
	testNodeStageVolume(cs, ns, resp, volumeID, t)
	testNodePublishVolume(cs, ns, resp, volumeID, t)

	testNodeUnpublishVolumeWithoutTargetPath(cs, ns, resp, volumeID, t)
	
	testNodeUnpublishVolume(cs, ns, resp, volumeID, t)
	testNodeUnstageVolume(cs, ns, resp, volumeID, t)
	testDeleteVolumeNodeServer(cs, volumeID, t)
}

func TestNvmeNodeUnpublishVolumeWithoutVolumeId(t *testing.T){
	beforeEach()
	cs, ns, resp, volumeID := testCreateVolumeNodeServer(t)
	testNodeStageVolume(cs, ns, resp, volumeID, t)
	testNodePublishVolume(cs, ns, resp, volumeID, t)

	testNodeUnpublishVolumeWithoutVolumeId(cs, ns, resp, volumeID, t)
	
	testNodeUnpublishVolume(cs, ns, resp, volumeID, t)
	testNodeUnstageVolume(cs, ns, resp, volumeID, t)
	testDeleteVolumeNodeServer(cs, volumeID, t)
}

func TestNvmeNodeUnpublishVolumeOnUnstagedVolume(t *testing.T){
	beforeEach()
	cs, ns, resp, volumeID := testCreateVolumeNodeServer(t)
	testNodeStageVolume(cs, ns, resp, volumeID, t)
	testNodeUnstageVolume(cs, ns, resp, volumeID, t)

	testNodeUnpublishVolumeOnUnstagedVolume(cs, ns, resp, volumeID, t)

	testDeleteVolumeNodeServer(cs, volumeID, t)
}




func testNodeGetCapabilities(cs *controllerServer, ns *nodeServer, volumeID string,  t *testing.T){
	reqCap := csi.NodeGetCapabilitiesRequest{
		
	}
	klog.Infof("Req Cap %v", reqCap)

	respCap, err := ns.NodeGetCapabilities(context.TODO(), &reqCap)
	klog.Infof("Response Cap %v",respCap)
	if err != nil {
		testDeleteVolumeNodeServer(cs, volumeID, t)
		
		t.Fatal(err)
	}
	
}

func testNodeStageVolume(cs *controllerServer, ns *nodeServer, resp *csi.CreateVolumeResponse, volumeID string,  t *testing.T){
	reqStage := csi.NodeStageVolumeRequest{
		VolumeId:          volumeID,
		VolumeCapability:  &csi.VolumeCapability{
			AccessMode: &csi.VolumeCapability_AccessMode{Mode: csi.VolumeCapability_AccessMode_SINGLE_NODE_WRITER},
			AccessType: &csi.VolumeCapability_Mount{
				Mount: &csi.VolumeCapability_MountVolume{},
			},
		},
		VolumeContext:	   resp.GetVolume().GetVolumeContext(),
		StagingTargetPath: stagingTargetPath,
	}
	klog.Infof("Staging Path %s", stagingTargetPath)
	klog.Infof("ReqStage %v", reqStage.GetVolumeContext())

	respStage, err := ns.NodeStageVolume(context.TODO(), &reqStage)
	if err != nil {
		testDeleteVolumeNodeServer(cs, volumeID, t)
		
		t.Fatal(err)
	}
	klog.Infof("Resp Stage %v", respStage)

}

func testNodeUnstageVolume(cs *controllerServer, ns *nodeServer, resp *csi.CreateVolumeResponse, volumeID string,  t *testing.T){
	reqUnstage := csi.NodeUnstageVolumeRequest{
		VolumeId: volumeID,
		StagingTargetPath: stagingTargetPath,
	}

	respUnstage, err := ns.NodeUnstageVolume(context.TODO(), &reqUnstage)
	if err != nil {
		testDeleteVolumeNodeServer(cs, volumeID, t)
		
		t.Fatal(err)
	}
	klog.Infof("Node UnStage Response %v", respUnstage)
}

func testNodeStageVolumeBlock(cs *controllerServer, ns *nodeServer, resp *csi.CreateVolumeResponse, volumeID string,  t *testing.T){
	reqStage := csi.NodeStageVolumeRequest{
		VolumeId:          volumeID,
		VolumeCapability:  &csi.VolumeCapability{
			AccessMode: &csi.VolumeCapability_AccessMode{Mode: csi.VolumeCapability_AccessMode_SINGLE_NODE_WRITER},
			AccessType: &csi.VolumeCapability_Block{
				Block: &csi.VolumeCapability_BlockVolume{},
			},
		},
		VolumeContext:	   resp.GetVolume().GetVolumeContext(),
		StagingTargetPath: stagingTargetPath,
	}
	klog.Infof("Staging Path %s", stagingTargetPath)
	klog.Infof("ReqStage %v", reqStage.GetVolumeContext())

	respStage, err := ns.NodeStageVolume(context.TODO(), &reqStage)
	if err != nil {
		testDeleteVolumeNodeServer(cs, volumeID, t)
		
		t.Fatal(err)
	}
	klog.Infof("Resp Stage %v", respStage)

}

func testNodeStageVolumeWithDifferentAccessModes(cs *controllerServer, ns *nodeServer, resp *csi.CreateVolumeResponse, volumeID string,  t *testing.T){
	reqStage := csi.NodeStageVolumeRequest{
		VolumeId:          volumeID,
		VolumeCapability:  &csi.VolumeCapability{
			AccessMode: &csi.VolumeCapability_AccessMode{Mode: csi.VolumeCapability_AccessMode_MULTI_NODE_READER_ONLY},
			AccessType: &csi.VolumeCapability_Block{
				Block: &csi.VolumeCapability_BlockVolume{},
			},
		},
		VolumeContext:	   resp.GetVolume().GetVolumeContext(),
		StagingTargetPath: stagingTargetPath,
	}
	klog.Infof("Staging Path %s", stagingTargetPath)
	klog.Infof("ReqStage %v", reqStage.GetVolumeContext())

	respStage, err := ns.NodeStageVolume(context.TODO(), &reqStage)
	if err != nil {
		testDeleteVolumeNodeServer(cs, volumeID, t)
		
		t.Fatal(err)
	}
	klog.Infof("Resp Stage %v", respStage)

	testNodeUnstageVolume(cs, ns, resp, volumeID, t)

	reqStage = csi.NodeStageVolumeRequest{
		VolumeId:          volumeID,
		VolumeCapability:  &csi.VolumeCapability{
			AccessMode: &csi.VolumeCapability_AccessMode{Mode: csi.VolumeCapability_AccessMode_MULTI_NODE_MULTI_WRITER},
			AccessType: &csi.VolumeCapability_Block{
				Block: &csi.VolumeCapability_BlockVolume{},
			},
		},
		VolumeContext:	   resp.GetVolume().GetVolumeContext(),
		StagingTargetPath: stagingTargetPath,
	}
	klog.Infof("Staging Path %s", stagingTargetPath)
	klog.Infof("ReqStage %v", reqStage.GetVolumeContext())

	respStage, err = ns.NodeStageVolume(context.TODO(), &reqStage)
	if err == nil {
		testNodeUnstageVolume(cs, ns, resp, volumeID, t)
		testDeleteVolumeNodeServer(cs, volumeID, t)
		
		t.Fatal("MULTI NODE MULTI READER IS NOT SUPPORTED")
	}
	klog.Infof("Resp Stage %v", respStage)
}

func testNodeStageVolumeWithoutVolumeCapabilities(cs *controllerServer, ns *nodeServer, resp *csi.CreateVolumeResponse, volumeID string,  t *testing.T){
	reqStage := csi.NodeStageVolumeRequest{
		VolumeId:          volumeID,
		VolumeContext:	   resp.GetVolume().GetVolumeContext(),
		StagingTargetPath: stagingTargetPath,
	}
	klog.Infof("Staging Path %s", stagingTargetPath)
	klog.Infof("ReqStage %v", reqStage.GetVolumeContext())

	respStage, err := ns.NodeStageVolume(context.TODO(), &reqStage)
	if err == nil {
		testNodeUnstageVolume(cs, ns, resp, volumeID, t)
		testDeleteVolumeNodeServer(cs, volumeID, t)
		
		t.Fatal("Without Volume Capabilities Volume should not be staged")
	}
	klog.Infof("Resp Stage %v", respStage)
}

func testNodeStageVolumeWithoutVolumeId(cs *controllerServer, ns *nodeServer, resp *csi.CreateVolumeResponse, volumeID string,  t *testing.T){
	reqStage := csi.NodeStageVolumeRequest{
		VolumeCapability:  &csi.VolumeCapability{
			AccessMode: &csi.VolumeCapability_AccessMode{Mode: csi.VolumeCapability_AccessMode_SINGLE_NODE_WRITER},
			AccessType: &csi.VolumeCapability_Mount{
				Mount: &csi.VolumeCapability_MountVolume{},
			},
		},
		VolumeContext:	   resp.GetVolume().GetVolumeContext(),
		StagingTargetPath: stagingTargetPath,
	}
	klog.Infof("Staging Path %s", stagingTargetPath)
	klog.Infof("ReqStage %v", reqStage.GetVolumeContext())

	respStage, err := ns.NodeStageVolume(context.TODO(), &reqStage)
	if err == nil {
		testNodeUnstageVolume(cs, ns, resp, volumeID, t)
		testDeleteVolumeNodeServer(cs, volumeID, t)
		
		t.Fatal("Without Volume Id Volume should not be staged")
	}
	klog.Infof("Resp Stage %v", respStage)
}

func testNodeStageVolumeWithoutStagingTargetPath(cs *controllerServer, ns *nodeServer, resp *csi.CreateVolumeResponse, volumeID string,  t *testing.T){
	reqStage := csi.NodeStageVolumeRequest{
		VolumeId:          volumeID,
		VolumeCapability:  &csi.VolumeCapability{
			AccessMode: &csi.VolumeCapability_AccessMode{Mode: csi.VolumeCapability_AccessMode_SINGLE_NODE_WRITER},
			AccessType: &csi.VolumeCapability_Mount{
				Mount: &csi.VolumeCapability_MountVolume{},
			},
		},
		VolumeContext:	   resp.GetVolume().GetVolumeContext(),
	}
	klog.Infof("ReqStage %v", reqStage.GetVolumeContext())

	respStage, err := ns.NodeStageVolume(context.TODO(), &reqStage)
	if err == nil {
		testNodeUnstageVolume(cs, ns, resp, volumeID, t)
		testDeleteVolumeNodeServer(cs, volumeID, t)
		
		t.Fatal("Without Staging Target Path Volume should not be staged")
	}
	klog.Infof("Resp Stage %v", respStage)
}


func testNodeStageVolumeWithWrongStagingTargetPath(cs *controllerServer, ns *nodeServer, resp *csi.CreateVolumeResponse, volumeID string,  t *testing.T){
	reqStage := csi.NodeStageVolumeRequest{
		VolumeId:          volumeID,
		VolumeCapability:  &csi.VolumeCapability{
			AccessMode: &csi.VolumeCapability_AccessMode{Mode: csi.VolumeCapability_AccessMode_SINGLE_NODE_WRITER},
			AccessType: &csi.VolumeCapability_Mount{
				Mount: &csi.VolumeCapability_MountVolume{},
			},
		},
		VolumeContext:	   resp.GetVolume().GetVolumeContext(),
		
		StagingTargetPath: wrongStagingTargetPath,
	}
	klog.Infof("ReqStage %v", reqStage.GetVolumeContext())

	respStage, err := ns.NodeStageVolume(context.TODO(), &reqStage)
	if err == nil {
		testNodeUnstageVolume(cs, ns, resp, volumeID, t)
		testDeleteVolumeNodeServer(cs, volumeID, t)
		
		t.Fatal("Without Staging Target Path Volume should not be staged")
	}
	klog.Infof("Resp Stage %v", respStage)
}

func testNodeStageVolumeWithoutVolumeContext(cs *controllerServer, ns *nodeServer, resp *csi.CreateVolumeResponse, volumeID string,  t *testing.T){
	reqStage := csi.NodeStageVolumeRequest{
		VolumeId:          volumeID,
		VolumeCapability:  &csi.VolumeCapability{
			AccessMode: &csi.VolumeCapability_AccessMode{Mode: csi.VolumeCapability_AccessMode_SINGLE_NODE_WRITER},
			AccessType: &csi.VolumeCapability_Mount{
				Mount: &csi.VolumeCapability_MountVolume{},
			},
		},
		StagingTargetPath: stagingTargetPath,
	}
	klog.Infof("Staging Path %s", stagingTargetPath)
	klog.Infof("ReqStage %v", reqStage.GetVolumeContext())

	respStage, err := ns.NodeStageVolume(context.TODO(), &reqStage)
	if err == nil {
		testNodeUnstageVolume(cs, ns, resp, volumeID, t)
		testDeleteVolumeNodeServer(cs, volumeID, t)
		
		t.Fatal("Without Volume Context Volume should not be staged")
	}
	klog.Infof("Resp Stage %v", respStage)
}

func testNodeStageOnStagedVolume(cs *controllerServer, ns *nodeServer, resp *csi.CreateVolumeResponse, volumeID string,  t *testing.T){
	reqStage := csi.NodeStageVolumeRequest{
		VolumeId:          volumeID,
		VolumeCapability:  &csi.VolumeCapability{
			AccessMode: &csi.VolumeCapability_AccessMode{Mode: csi.VolumeCapability_AccessMode_SINGLE_NODE_WRITER},
			AccessType: &csi.VolumeCapability_Mount{
				Mount: &csi.VolumeCapability_MountVolume{},
			},
		},
		VolumeContext:	   resp.GetVolume().GetVolumeContext(),
		StagingTargetPath: stagingTargetPath,
	}
	klog.Infof("Staging Path %s", stagingTargetPath)
	klog.Infof("ReqStage %v", reqStage.GetVolumeContext())

	respStage1, err := ns.NodeStageVolume(context.TODO(), &reqStage)
	if err != nil {
		testDeleteVolumeNodeServer(cs, volumeID, t)
		
		t.Fatal(err)
	}
	klog.Infof("Resp Stage 1 %v", respStage1)

	respStage2, err := ns.NodeStageVolume(context.TODO(), &reqStage)
	if err != nil {
		testDeleteVolumeNodeServer(cs, volumeID, t)
		
		t.Fatal(err)
	}
	klog.Infof("Resp Stage 2 %v", respStage2)
}

func testNodeUnstageVolumeWithoutVolumeId(cs *controllerServer, ns *nodeServer, resp *csi.CreateVolumeResponse, volumeID string,  t *testing.T){
	reqUnstage := csi.NodeUnstageVolumeRequest{
		StagingTargetPath: stagingTargetPath,
	}

	respUnstage, err := ns.NodeUnstageVolume(context.TODO(), &reqUnstage)
	if err == nil {
		testNodeUnstageVolume(cs, ns, resp, volumeID, t);
		testDeleteVolumeNodeServer(cs, volumeID, t)
		
		t.Fatal("Without Volume ID Node volume cannot be unstaged")
	}
	klog.Infof("Node UnStage Response %v", respUnstage)
}

func testNodeUnstageVolumeWithoutStagingTargetPath(cs *controllerServer, ns *nodeServer, resp *csi.CreateVolumeResponse, volumeID string,  t *testing.T){
	reqUnstage := csi.NodeUnstageVolumeRequest{
		VolumeId: volumeID,
	}
	klog.Infof("ReqUnstage %v", reqUnstage)
	respUnstage, err := ns.NodeUnstageVolume(context.TODO(), &reqUnstage)
	if err == nil {
		testNodeUnstageVolume(cs, ns, resp, volumeID, t);
		testDeleteVolumeNodeServer(cs, volumeID, t)
		
		t.Fatal("Without Staging Target Path Node volume cannot be unstaged")
	}
	klog.Infof("Node UnStage Response %v", respUnstage)
}

func testNodeUnstageVolumeWithWrongStagingTargetPath(cs *controllerServer, ns *nodeServer, resp *csi.CreateVolumeResponse, volumeID string,  t *testing.T){
	reqUnstage := csi.NodeUnstageVolumeRequest{
		VolumeId: volumeID,
		StagingTargetPath: "blabla",
	}
	klog.Infof("ReqUnstage %s", reqUnstage.GetStagingTargetPath())
	respUnstage, err := ns.NodeUnstageVolume(context.TODO(), &reqUnstage)
	if err == nil {
		testNodeUnstageVolume(cs, ns, resp, volumeID, t);
		testDeleteVolumeNodeServer(cs, volumeID, t)
		
		t.Fatal("Without Staging Target Path Node volume cannot be unstaged")
	}
	klog.Infof("Node UnStage Response %v", respUnstage)
}

func testNodeUnstageVolumeOnDeletedVolume(cs *controllerServer, ns *nodeServer, resp *csi.CreateVolumeResponse, volumeID string,  t *testing.T){
	reqUnstage := csi.NodeUnstageVolumeRequest{
		VolumeId: volumeID,
		StagingTargetPath: stagingTargetPath,
	}

	respUnstage, err := ns.NodeUnstageVolume(context.TODO(), &reqUnstage)
	if err != nil {
		testDeleteVolumeNodeServer(cs, volumeID, t)
		
		t.Fatal(err)
	}
	klog.Infof("Node UnStage Response %v", respUnstage)
}

func testNodeUnstageOnUnstagedVolume(cs *controllerServer, ns *nodeServer, resp *csi.CreateVolumeResponse, volumeID string,  t *testing.T){
	reqUnstage := csi.NodeUnstageVolumeRequest{
		VolumeId: volumeID,
		StagingTargetPath: stagingTargetPath,
	}

	respUnstage1, err := ns.NodeUnstageVolume(context.TODO(), &reqUnstage)
	if err != nil {
		testDeleteVolumeNodeServer(cs, volumeID, t)
		
		t.Fatal(err)
	}
	klog.Infof("Node UnStage Response 1 %v", respUnstage1)

	respUnstage2, err := ns.NodeUnstageVolume(context.TODO(), &reqUnstage)
	if err != nil {
		testDeleteVolumeNodeServer(cs, volumeID, t)
		
		t.Fatal(err)
	}
	klog.Infof("Node UnStage Response 2 %v", respUnstage2)
}


func testNodePublishVolume(cs *controllerServer, ns *nodeServer, resp *csi.CreateVolumeResponse, volumeID string,  t *testing.T){
	reqPublish := csi.NodePublishVolumeRequest{
		VolumeId:          volumeID,
		VolumeCapability:  &csi.VolumeCapability{
			AccessMode: &csi.VolumeCapability_AccessMode{Mode: csi.VolumeCapability_AccessMode_SINGLE_NODE_WRITER},
			AccessType: &csi.VolumeCapability_Mount{
				Mount: &csi.VolumeCapability_MountVolume{},
			},
		},
		VolumeContext:	   resp.GetVolume().GetVolumeContext(),
		TargetPath: targetPath,
		Readonly: false,
	}
	klog.Infof("Target Path %s", targetPath)
	klog.Infof("ReqPublish %v", reqPublish.GetVolumeContext())

	respPublish, err := ns.NodePublishVolume(context.TODO(), &reqPublish)
	if err != nil {
		testDeleteVolumeNodeServer(cs, volumeID, t)
		
		t.Fatal(err)
	}
	klog.Infof("Response Publish %v",respPublish)	
}

func testNodeUnpublishVolume(cs *controllerServer, ns *nodeServer, resp *csi.CreateVolumeResponse, volumeID string,  t *testing.T){	
	reqUnpublish := csi.NodeUnpublishVolumeRequest{
		VolumeId: volumeID,
		TargetPath: targetPath,
	}

	respUnpublish, err := ns.NodeUnpublishVolume(context.TODO(), &reqUnpublish)
	if err != nil {
		testNodeUnstageVolume(cs, ns, resp, volumeID, t)
		testDeleteVolumeNodeServer(cs, volumeID, t)
		
		t.Fatal(err)
	}
	klog.Infof("Node Unpublish Response %v", respUnpublish)

}

func testNodePublishVolumeBlock(cs *controllerServer, ns *nodeServer, resp *csi.CreateVolumeResponse, volumeID string,  t *testing.T){
	reqPublish := csi.NodePublishVolumeRequest{
		VolumeId:          volumeID,
		VolumeCapability:  &csi.VolumeCapability{
			AccessMode: &csi.VolumeCapability_AccessMode{Mode: csi.VolumeCapability_AccessMode_SINGLE_NODE_WRITER},
			AccessType: &csi.VolumeCapability_Block{
				Block: &csi.VolumeCapability_BlockVolume{},
			},
		},
		VolumeContext:	   resp.GetVolume().GetVolumeContext(),
		TargetPath: targetPath,
		Readonly: false,
	}
	klog.Infof("Target Path %s", targetPath)
	klog.Infof("ReqPublish %v", reqPublish.GetVolumeContext())

	respPublish, err := ns.NodePublishVolume(context.TODO(), &reqPublish)
	if err != nil {
		testNodeUnpublishVolume(cs, ns, resp, volumeID, t)
		testNodeUnstageVolume(cs, ns, resp, volumeID, t)
		testDeleteVolumeNodeServer(cs, volumeID, t)
		
		t.Fatal(err)
	}
	klog.Infof("Response Publish %v",respPublish)	
}

func testNodePublishVolumeWithoutTargetPath(cs *controllerServer, ns *nodeServer, resp *csi.CreateVolumeResponse, volumeID string,  t *testing.T){
	reqPublish := csi.NodePublishVolumeRequest{
		VolumeId:          volumeID,
		VolumeCapability:  &csi.VolumeCapability{
			AccessMode: &csi.VolumeCapability_AccessMode{Mode: csi.VolumeCapability_AccessMode_SINGLE_NODE_WRITER},
			AccessType: &csi.VolumeCapability_Mount{
				Mount: &csi.VolumeCapability_MountVolume{},
			},
		},
		VolumeContext:	   resp.GetVolume().GetVolumeContext(),
		Readonly: false,
	}
	klog.Infof("Target Path %s", targetPath)
	klog.Infof("ReqPublish %v", reqPublish.GetVolumeContext())

	respPublish, err := ns.NodePublishVolume(context.TODO(), &reqPublish)
	if err == nil {
		testNodeUnpublishVolume(cs, ns, resp, volumeID, t)
		testNodeUnstageVolume(cs, ns, resp, volumeID, t)
		testDeleteVolumeNodeServer(cs, volumeID, t)
		
		t.Fatal("Without TargetPath Node volume published")
	}
	klog.Infof("Response Publish %v",respPublish)	
}


func testNodePublishVolumeWithoutVolumeCapabilities(cs *controllerServer, ns *nodeServer, resp *csi.CreateVolumeResponse, volumeID string,  t *testing.T){
	reqPublish := csi.NodePublishVolumeRequest{
		VolumeId:          volumeID,
		VolumeContext:	   resp.GetVolume().GetVolumeContext(),
		TargetPath: targetPath,
		Readonly: false,
	}
	klog.Infof("Target Path %s", targetPath)
	klog.Infof("ReqPublish %v", reqPublish.GetVolumeContext())

	respPublish, err := ns.NodePublishVolume(context.TODO(), &reqPublish)
	if err == nil {
		testNodeUnpublishVolume(cs, ns, resp, volumeID, t)
		testNodeUnstageVolume(cs, ns, resp, volumeID, t)
		testDeleteVolumeNodeServer(cs, volumeID, t)
		
		t.Fatal("Without Volume Capabilities Node volume published")
	}
	klog.Infof("Response Publish %v",respPublish)	
}

func testNodePublishVolumeWithoutVolumeId(cs *controllerServer, ns *nodeServer, resp *csi.CreateVolumeResponse, volumeID string,  t *testing.T){
	reqPublish := csi.NodePublishVolumeRequest{
		VolumeCapability:  &csi.VolumeCapability{
			AccessMode: &csi.VolumeCapability_AccessMode{Mode: csi.VolumeCapability_AccessMode_SINGLE_NODE_WRITER},
			AccessType: &csi.VolumeCapability_Mount{
				Mount: &csi.VolumeCapability_MountVolume{},
			},
		},
		VolumeContext:	   resp.GetVolume().GetVolumeContext(),
		TargetPath: targetPath,
		Readonly: false,
	}
	klog.Infof("Target Path %s", targetPath)
	klog.Infof("ReqPublish %v", reqPublish.GetVolumeContext())

	respPublish, err := ns.NodePublishVolume(context.TODO(), &reqPublish)
	if err == nil {
		testNodeUnpublishVolume(cs, ns, resp, volumeID, t)
		testNodeUnstageVolume(cs, ns, resp, volumeID, t)
		testDeleteVolumeNodeServer(cs, volumeID, t)
		
		t.Fatal("Without Volume Id Node volume published")
	}
	klog.Infof("Response Publish %v",respPublish)	
}

func testNodePublishVolumeOnUnstagedVolume(cs *controllerServer, ns *nodeServer, resp *csi.CreateVolumeResponse, volumeID string,  t *testing.T){
	reqPublish := csi.NodePublishVolumeRequest{
		VolumeId:          volumeID,
		VolumeCapability:  &csi.VolumeCapability{
			AccessMode: &csi.VolumeCapability_AccessMode{Mode: csi.VolumeCapability_AccessMode_SINGLE_NODE_WRITER},
			AccessType: &csi.VolumeCapability_Mount{
				Mount: &csi.VolumeCapability_MountVolume{},
			},
		},
		VolumeContext:	   resp.GetVolume().GetVolumeContext(),
		TargetPath: targetPath,
		Readonly: false,
	}
	klog.Infof("Target Path %s", targetPath)
	klog.Infof("ReqPublish %v", reqPublish.GetVolumeContext())

	respPublish, err := ns.NodePublishVolume(context.TODO(), &reqPublish)
	if err == nil {
		testNodeUnpublishVolume(cs, ns, resp, volumeID, t)
		testNodeUnstageVolume(cs, ns, resp, volumeID, t)
		testDeleteVolumeNodeServer(cs, volumeID, t)
		
		t.Fatal("Node Published volume on unstaged volume")
	}
	klog.Infof("Response Publish %v",respPublish)	
}

func testNodeUnpublishVolumeWithoutTargetPath(cs *controllerServer, ns *nodeServer, resp *csi.CreateVolumeResponse, volumeID string,  t *testing.T){
	reqUnpublish := csi.NodeUnpublishVolumeRequest{
		VolumeId: volumeID,
	}

	respUnpublish, err := ns.NodeUnpublishVolume(context.TODO(), &reqUnpublish)
	if err == nil {
		testNodeUnpublishVolume(cs, ns, resp, volumeID, t)
		testNodeUnstageVolume(cs, ns, resp, volumeID, t)
		testDeleteVolumeNodeServer(cs, volumeID, t)
		
		t.Fatal(err)
	}
	klog.Infof("Node Unpublish Response %v", respUnpublish)
}

func testNodeUnpublishVolumeWithoutVolumeId(cs *controllerServer, ns *nodeServer, resp *csi.CreateVolumeResponse, volumeID string,  t *testing.T){
	reqUnpublish := csi.NodeUnpublishVolumeRequest{
		TargetPath: targetPath,
	}

	respUnpublish, err := ns.NodeUnpublishVolume(context.TODO(), &reqUnpublish)
	if err == nil {
		testNodeUnpublishVolume(cs, ns, resp, volumeID, t)
		testNodeUnstageVolume(cs, ns, resp, volumeID, t)
		testDeleteVolumeNodeServer(cs, volumeID, t)
		
		t.Fatal(err)
	}
	klog.Infof("Node Unpublish Response %v", respUnpublish)
}

func testNodeUnpublishVolumeOnUnstagedVolume(cs *controllerServer, ns *nodeServer, resp *csi.CreateVolumeResponse, volumeID string,  t *testing.T){
	reqUnpublish := csi.NodeUnpublishVolumeRequest{
		VolumeId: volumeID,
		TargetPath: targetPath,
	}
	klog.Infof("Node reqpublish %v", reqUnpublish)
	respUnpublish, err := ns.NodeUnpublishVolume(context.TODO(), &reqUnpublish)
	if err != nil {
		// testNodeUnpublishVolume(cs, ns, resp, volumeID, t)
		// testNodeUnstageVolume(cs, ns, resp, volumeID, t)
		testDeleteVolumeNodeServer(cs, volumeID, t)
		
		t.Fatal(err)
	}
	klog.Infof("Node Unpublish Response %v", respUnpublish)
}

func testCreateVolumeNodeServer(  t *testing.T)(cs *controllerServer, ns *nodeServer, resp *csi.CreateVolumeResponse, volumeID string) {
	cd := csicommon.NewCSIDriver("test-driver", "test-version", "test-node")
	cs, err := newControllerServer(cd)
	if err != nil {
		t.Fatal(err)
	}

	klog.Infof("Controller Server %v", *cs)
	
	const volumeName = nodeVolumeName
	const volumeSize = 256 * 1024 * 1024

	reqCreate := csi.CreateVolumeRequest{
		Name:          volumeName,
		CapacityRange: &csi.CapacityRange{RequiredBytes: volumeSize},
		VolumeCapabilities: []*csi.VolumeCapability{},
		Parameters: volumeInfo,
	}

	resp, err = cs.CreateVolume(context.TODO(), &reqCreate)
	if err != nil {
		t.Fatal(err)
	}

	volumeID = resp.GetVolume().GetVolumeId()

	if volumeID == "" {
		t.Fatal("Empty Volume Id")
	}

	ns = newNodeServer(cd)
	klog.Infof("Node Server %v", *ns)
	if err != nil {
		t.Fatal(err)
	}
	klog.Infof("Controller Server %v", *cs)
	return cs, ns, resp, volumeID
}

func testDeleteVolumeNodeServer(cs *controllerServer, volumeID string,  t *testing.T){
	err := deleteTestVolume(cs, volumeID)
	if err != nil {
		t.Fatal(err)
	}
}
