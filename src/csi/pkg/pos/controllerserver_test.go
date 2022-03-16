package pos

import (
	"context"
	"fmt"
	"io/ioutil"
	"os"
	"sync"
	"sync/atomic"
	"testing"
	// "k8s.io/klog"

	"github.com/container-storage-interface/spec/lib/go/csi"

	csicommon "github.com/poseidonos/pos-csi/pkg/csi-common"
)



func TestNvmeofVolume(t *testing.T) {
	testVolume("nvme-tcp", t)
}

func TestNvmeValidateVolumeCapabilities(t *testing.T) {
	testValidateVolumeCapabilities("nvme-tcp", t)
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

func TestNvmeWithWrongParams(t *testing.T) {
	testWithWrongParams("nvme-tcp", t)
}

func TestNvmeWithSameNameDiffSize(t *testing.T) {
	testWithSameNameDiffSize("nvme-tcp", t)
}
/*
func TestNvmeWithSameNameDiffSubsystem(t *testing.T) {
	testWithSameNameDiffSubsystem("nvme-tcp", t)
}
*/
func TestNvmeDeleteWithoutVolumeID(t *testing.T) {
	testDeleteWithoutVolumeID("nvme-tcp", t)
}

func TestNvmeDeleteOnDeletedVolume(t *testing.T) {
	testDeleteOnDeletedVolume("nvme-tcp", t)
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

func testValidateVolumeCapabilities(targetType string, t *testing.T){
	cs, err := createTestController(targetType)
	if err != nil {
		t.Fatal(err)
	}

	const volumeName = "test-volume"
	const volumeSize = 256 * 1024 * 1024

	//To Check Unsupported Validate Volume Capabilities
	reqCreate := csi.CreateVolumeRequest{
		Name:          volumeName,
		CapacityRange: &csi.CapacityRange{RequiredBytes: volumeSize},
		VolumeCapabilities: []*csi.VolumeCapability{},
		Parameters: volumeInfo,
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
	// klog.Infof("Node UnStage Response %v", respVal)

	// delete volume
	err = deleteTestVolume(cs, volumeID)
	if err != nil {
		t.Fatal(err)
	}



	//To Check Supported Validate Volume Capabilities
	reqCreate = csi.CreateVolumeRequest{
		Name:          "test-test-vol",
		CapacityRange: &csi.CapacityRange{RequiredBytes: volumeSize},
		VolumeCapabilities: []*csi.VolumeCapability{
			&csi.VolumeCapability{
				AccessMode: &csi.VolumeCapability_AccessMode{Mode: csi.VolumeCapability_AccessMode_SINGLE_NODE_WRITER},	
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

func testIdempotency(targetType string, t *testing.T) {
	cs, err := createTestController(targetType)
	if err != nil {
		t.Fatal(err)
	}

	const volumeName = "test-volume-idem"
	const requestCount = 2
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
	const volumeCount = 2
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
		Parameters: volumeInfo,
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
		Name:          volumeName,
		VolumeCapabilities: []*csi.VolumeCapability{},
		Parameters: volumeInfo,
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
	// const volumeSize = 256 * 1024 * 1024

	reqCreate := csi.CreateVolumeRequest{
		Name:          	volumeName,
		CapacityRange: 	&csi.CapacityRange{},
		VolumeCapabilities: []*csi.VolumeCapability{},
		Parameters: 	volumeInfo,	
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

func testWithWrongParams(targetType string, t *testing.T) {
	cs, err := createTestController(targetType)
	if err != nil {
		t.Fatal(err)
	}

	const volumeName = "test-volume"
	const volumeSize = 256 * 1024 * 1024

	reqCreate := csi.CreateVolumeRequest{
		Name:          	volumeName,
		CapacityRange: 	&csi.CapacityRange{RequiredBytes: volumeSize},
		VolumeCapabilities: []*csi.VolumeCapability{},
		Parameters: 	volumeInfoWithoutTransportTypeTargetAddressTransportServiceId,	
	}

	resp, err := cs.CreateVolume(context.TODO(), &reqCreate)
	
	//Without anyone of targetportType, targetAddress, transportServiceId nvmf PublishVolume should throw error
	if err == nil {
		volumeID := resp.GetVolume().GetVolumeId()
		if volumeID == "" {
			t.Fatal("empty volume id")
		}
		err = deleteTestVolume(cs, volumeID)
		if err != nil {
			t.Fatal(err)
		}
		t.Fatal("Volume Created with wrong Parameters")
	}
	
	reqCreate = csi.CreateVolumeRequest{
		Name:          	volumeName,
		CapacityRange: 	&csi.CapacityRange{RequiredBytes: volumeSize},
		VolumeCapabilities: []*csi.VolumeCapability{},
		Parameters: 	volumeInfoWithoutNqnNameArrayName,	
	}

	resp, err = cs.CreateVolume(context.TODO(), &reqCreate)
	
	//Without anyone of nqnName or arrayName, dagent provisioner should throw error
	if err == nil {
		volumeID := resp.GetVolume().GetVolumeId()
		if volumeID == "" {
			t.Fatal("empty volume id")
		}
		err = deleteTestVolume(cs, volumeID)
		if err != nil {
			t.Fatal(err)
		}
		t.Fatal("Volume Created with wrong Parameters")
	}

	// reqCreate = csi.CreateVolumeRequest{
	// 	Name:          	"vol'",
	// 	CapacityRange: 	&csi.CapacityRange{RequiredBytes: volumeSize},
	// 	VolumeCapabilities: []*csi.VolumeCapability{},
	// 	Parameters: 	volumeInfo,	
	// }

	// resp, err = cs.CreateVolume(context.TODO(), &reqCreate)
	
	// //Without anyone of nqnName or arrayName, dagent provisioner should throw error
	// if err == nil {
	// 	volumeID := resp.GetVolume().GetVolumeId()
	// 	if volumeID == "" {
	// 		t.Fatal("empty volume id")
	// 	}
	// 	err = deleteTestVolume(cs, volumeID)
	// 	if err != nil {
	// 		t.Fatal(err)
	// 	}
	// 	t.Fatal("Volume Created with wrong Parameters")
	// }
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

func testWithSameNameDiffSubsystem(targetType string, t *testing.T) {
	cs, err := createTestController(targetType)
	if err != nil {
		t.Fatal(err)
	}

	const volumeName = "test-volume"
	const volumeSize = 256 * 1024 * 1024

	reqCreate := csi.CreateVolumeRequest{
		Name:          	volumeName,
		CapacityRange: 	&csi.CapacityRange{RequiredBytes: volumeSize},
		VolumeCapabilities: []*csi.VolumeCapability{},
		Parameters: volumeInfoDiffSubsystem	,	
	}

	resp1, err := cs.CreateVolume(context.TODO(), &reqCreate)
	
	if err != nil {
		t.Fatal(err)
	}

	
	reqCreate2 := csi.CreateVolumeRequest{
		Name:          	volumeName,
		CapacityRange: 	&csi.CapacityRange{RequiredBytes: volumeSize},
		VolumeCapabilities: []*csi.VolumeCapability{},
		Parameters: 	volumeInfoDiffSubsystem,	
	}

	resp2, err := cs.CreateVolume(context.TODO(), &reqCreate2)
	
	if err != nil {
		t.Fatal(err)
	}

	volumeID1 := resp1.GetVolume().GetVolumeId()
	if volumeID1 == "" {
		t.Fatal("empty volume id")
	}
	
	volumeID2 := resp2.GetVolume().GetVolumeId()
	if volumeID2 == "" {
		t.Fatal("empty volume id")
	}

	if volumeID1 != volumeID2 {
		err = deleteTestVolume(cs, volumeID1)
		if err != nil {
			t.Fatal(err)
		}
		err = deleteTestVolume(cs, volumeID2)
		if err != nil {
			t.Fatal(err)
		}
		t.Fatal("Volumes are same volumeIds should be same")
	}

	err = deleteTestVolume(cs, volumeID1)
	if err != nil {
		t.Fatal(err)
	}
}

func testDeleteWithoutVolumeID(targetType string, t *testing.T) {
	cs, err := createTestController(targetType)
	if err != nil {
		t.Fatal(err)
	}
	const volumeID = ""

	err = deleteTestVolume(cs, volumeID);
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


func testValidateVolumeCapabilitiesonDeletedVolume(targetType string, t *testing.T){
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

func testValidateVolumeCapabilitiesWithoutVolumeId(targetType string, t *testing.T){
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
	// klog.Infof("Node UnStage Response %v", respVal)

	// delete volume
	err = deleteTestVolume(cs, volumeID)
	if err != nil {
		t.Fatal(err)
	}
}

func testValidateVolumeCapabilitiesWithoutVolumeCapabilities(targetType string, t *testing.T){
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
	// klog.Infof("Node UnStage Response %v", respVal)

	// delete volume
	err = deleteTestVolume(cs, volumeID)
	if err != nil {
		t.Fatal(err)
	}
}

func createTestController(targetType string) (cs *controllerServer, err error) {
	err = createConfigFiles(targetType)
	if err != nil {
		return nil, err
	}
	defer func() {
		os.Remove(os.Getenv("SPDKCSI_CONFIG"))
		os.Remove(os.Getenv("SPDKCSI_SECRET"))
	}()

	cd := csicommon.NewCSIDriver("test-driver", "test-version", "test-node")
	cs, err = newControllerServer(cd)
	if err != nil {
		return nil, err
	}

	return cs, nil
}

func createConfigFiles(targetType string) error {
	configFile, err := ioutil.TempFile("", "spdkcsi-config*.json")
	if err != nil {
		return err
	}
	defer configFile.Close()
	var config string
	switch targetType {
	case "nvme-tcp":
		config = nvmeTcpConfig

	}
	_, err = configFile.Write([]byte(config))
	if err != nil {
		os.Remove(configFile.Name())
		return err
	}
	os.Setenv("SPDKCSI_CONFIG", configFile.Name())

	secretFile, err := ioutil.TempFile("", "spdkcsi-secret*.json")
	if err != nil {
		os.Remove(configFile.Name())
		return err
	}
	defer secretFile.Close()
	// nolint:gosec // only for test
	secret := `
    {
      "rpcTokens": [
        {
          "name": "localhost",
          "username": "spdkcsiuser",
          "password": "spdkcsipass"
        }
      ]
	}`
	_, err = secretFile.Write([]byte(secret))
	if err != nil {
		os.Remove(configFile.Name())
		os.Remove(secretFile.Name())
		return err
	}
	os.Setenv("SPDKCSI_SECRET", secretFile.Name())

	return nil
}

func createTestVolume(cs *controllerServer, name string, size int64) (string, error) {
	reqCreate := csi.CreateVolumeRequest{
		Name:          name,
		CapacityRange: &csi.CapacityRange{RequiredBytes: size},
		VolumeCapabilities: []*csi.VolumeCapability{},
		Parameters: volumeInfo,
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
		Name:          name,
		VolumeCapabilities: []*csi.VolumeCapability{},
		Parameters: volumeInfo,
		CapacityRange: &csi.CapacityRange{RequiredBytes: size},
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
