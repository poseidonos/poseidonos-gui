package pos

import (
	"encoding/json"
	"errors"
	pb "kouros/api"
	"kouros/pos/grpc"
	"kouros/utils"
	"os"
	"os/exec"
	"path/filepath"
)

const dialTimeout = 10

type POSGRPCManager struct {
	connection grpc.POSGRPCConnection
	requestor  string
}

func (p *POSGRPCManager) Init(client string, address interface{}) error {
	if grpcAddress, ok := address.(string); !ok {
		return errors.New("Please provide an address of type string")
	} else {
		p.connection = grpc.POSGRPCConnection{
			Address: grpcAddress,
		}
		p.requestor = client
	}
	return nil
}

func (p *POSGRPCManager) GetSystemProperty() (response *pb.GetSystemPropertyResponse, err error) {
	command := "GETSYSTEMPROPERTY"
	req := &pb.GetSystemPropertyRequest{Command: command, Rid: utils.GenerateUUID(), Requestor: p.requestor}
	return grpc.SendGetSystemProperty(p.connection, req)
}

func (p *POSGRPCManager) SetSystemProperty(param *pb.SetSystemPropertyRequest_Param) (response *pb.SetSystemPropertyResponse, err error) {
	command := "SETSYSTEMPROPERTY"
	req := &pb.SetSystemPropertyRequest{Command: command, Rid: utils.GenerateUUID(), Requestor: p.requestor, Param: &param}
	return grpc.SendSetSystemProperty(p.connection, req)
}

func (p *POSGRPCManager) StartPoseidonOS() ([]byte, error) {
	startScriptPath, _ := filepath.Abs(filepath.Dir(os.Args[0]))
	startScriptPath += "/../script/start_poseidonos.sh"
	err := exec.Command("/bin/sh", "-c", "sudo "+startScriptPath).Run()
	resJSON := ""
	uuid := utils.GenerateUUID()
	if err != nil {
		resJSON = `{"command":"STARTPOS","rid":"` + uuid + `"` + `,"result":{"status":{"code":11000,` +
			`"description":"PoseidonOS has failed to start with error code: 11000"}}}`
	} else {
		resJSON = `{"command":"STARTPOS","rid":"` + uuid + `","result":{"status":{"code":0,` +
			`"description":"Done! PoseidonOS has started!"}}}`
	}
	res, err := json.Marshal(resJSON)
	return res, err
}

func (p *POSGRPCManager) StopPoseidonOS() (response *StopSystemResponse, err error) {
	command := "STOPSYSTEM"
	req := &pb.StopSystemRequest{Command: command, Rid: utils.GenerateUUID(), Requestor: p.requestor}
	return grpc.SendStopSystem(p.connection, req)
}

func (p *POSGRPCManager) GetSystemInfo() (response *pb.SystemInfoResponse, err error) {
	command := "SYSTEMINFO"
	req := &pb.SystemInfoRequest{Command: command, Rid: utils.GenerateUUID(), Requestor: p.requestor}
	return grpc.SendSystemInfo(p.connection, req)
}

func (p *POSGRPCManager) CreateDevice(param *pb.CreateDeviceRequest_Param) (*pb.CreateDeviceResponse, error) {
	command := "CREATEDEVICE"
	req := &pb.CreateDeviceRequest{Command: command, Rid: utils.GenerateUUID(), Requestor: p.requestor, Param: param}
	return grpc.SendCreateDevice(p.connection, req)
}

func (p *POSGRPCManager) ScanDevice() (*pb.ScanDeviceResponse, error) {
	command := "SCANDEVICE"
	req := &pb.ScanDeviceRequest{Command: command, Rid: utils.GenerateUUID(), Requestor: p.requestor}
	return grpc.SendScanDevice(p.connection, req)
}

func (p *POSGRPCManager) GetDeviceSmartLog(param *pb.GetSmartLogRequest_Param) (*pb.GetSmartLogResponse, error) {
	command := "SMARTLOG"
	req := &pb.GetSmartLogRequest{Command: command, Rid: utils.GenerateUUID(), Requestor: p.requestor, Param: param}
	return grpc.SendGetSmartLog(p.connection, req)
}

// ListDevices method lists the devices in PoseidonOS
// The function does not require any parameters
// A successful ListDevices call returns response in protobuf format with the following fields
// rid: Request ID of the function (string)
// command: PoseidonOS Command name (string)
// result: Result object which contains the below fields
//   1. status: Status object which contains the below fields
//     - code: Status code of response (int32)
//     - event_name: Event Name (string)
//     - description: Description about  (string)
//     - cause: Cause of the error occured, if any (string)
//     - solution: Solution of the problem occured, if any (string)
//   2. data: Data object contains the below fileds
//    - devicelist: A list of devices. Each device contains the following fields
//        1. name: Name of the device (string)
//        2. type: Type of the device (eg. "SSD", "URAM") (string)
//        3. address: PCIe address of the device (string)
//        4. class: Class of device eg. "Array", "System" (string)
//        5. modelNumber: Model number of the device (string)
//        6. numa: NUMA value associated with the device (string)
//        7. size: Size of the device in bytes (int64)
//        8. serialNumber: Serial number of the device (string)
// info: info object contains the following fields
//    1. version: PoseidonOS version (string)
func (p *POSGRPCManager) ListDevices() (*pb.ListDeviceResponse, error) {
	command := "LISTDEVICE"
	req := &pb.ListDeviceRequest{Command: command, Rid: utils.GenerateUUID(), Requestor: p.requestor}
	return grpc.SendListDevice(p.connection, req)
}

// Create Array method creates an array in PoseidonOS
// The function takes a byte array in protobuf format as parameter with the following fields
// param: param object contains the following fields
//   - name: Name of the array (string)
//   - raidtype: RAID type of the array
//   - data: A list of data devices. Each device contains the following fields
//      1. deviceName: name of the device (string)
//   - buffer: A list of buffer devices. Each device contains the following fields
//      1. deviceName: name of the device (string)
//   - spare: A list of spare devices. Each device contains the following fields
//      1. deviceName: name of the device (string)
// A successful Create call returns response in protobuf format with the following fields
// rid: Request ID of the function (string)
// command: PoseidonOS Command name (string)
// result: Result object which contains the below fields
//   1. status: Status object which contains the below fields
//     - code: Status code of response (int32)
//     - event_name: Event Name (string)
//     - description: Description about  (string)
//     - cause: Cause of the error occured, if any (string)
//     - solution: Solution of the problem occured, if any (string)
// info: info object contains the following fields
//    1. version: PoseidonOS version (string)
func (p *POSGRPCManager) CreateArray(param *pb.CreateArrayRequest_Param) (*pb.CreateArrayResponse, error) {
	command := "CREATEARRAY"
	req := &pb.CreateArrayRequest{Command: command, Rid: utils.GenerateUUID(), Requestor: p.requestor, Param: param}
	return grpc.SendCreateArray(p.connection, req)
}

// Add device command add spare device in PoseidonOS Array
// The function takes a protobuf format as parameter and returns response in protobuf format
func (p *POSGRPCManager) AddDevice(param *pb.AddSpareRequest_Param) (*pb.AddSpareResponse, error) {
	command := "ADDDEVICE"
	req := &pb.AddSpareRequest{Command: command, Rid: utils.GenerateUUID(), Requestor: p.requestor, Param: param}
	return grpc.SendAddSpare(p.connection, req)
}

// Remove device command removes spare device from PoseidonOS Array
// The function takes a protobuf format as parameter and returns response in protobuf format
func (p *POSGRPCManager) RemoveDevice(param *pb.RemoveSpareRequest_Param) (*pb.RemoveSpareResponse, error) {
	command := "REMOVEDEVICE"
	req := &pb.RemoveSpareRequest{Command: command, Rid: utils.GenerateUUID(), Requestor: p.requestor, Param: param}
	return grpc.SendRemoveSpare(p.connection, req)
}

// Automatically create an array for PoseidonOS with the number of devices the user specifies.
// The function takes a protobuf format as parameter and returns response in protobuf format
func (p *POSGRPCManager) AutoCreateArray(param *pb.AutocreateArrayRequest_Param) (*pb.AutocreateArrayResponse, error) {
	command := "AUTOCREATEARRAY"
	req := &pb.AutocreateArrayRequest{Command: command, Rid: utils.GenerateUUID(), Requestor: p.requestor, Param: param}
	return grpc.SendAutocreateArray(p.connection, req)
}

// Delete an array from PoseidonOS. After executing this command, the data and volumes in the array will be deleted too.
// The function takes a protobuf format as parameter and returns response in protobuf format
func (p *POSGRPCManager) DeleteArray(param *pb.DeleteArrayRequest_Param) (*pb.DeleteArrayResponse, error) {
	command := "DELETEARRAY"
	req := &pb.DeleteArrayRequest{Command: command, Rid: utils.GenerateUUID(), Requestor: p.requestor, Param: param}
	return grpc.SendDeleteArray(p.connection, req)
}

// ArrayInfo command will display detailed information of an array.
// The function takes a protobuf format as parameter and returns response in protobuf format
func (p *POSGRPCManager) ArrayInfo(param *pb.ArrayInfoRequest_Param) (*pb.ArrayInfoResponse, error) {
	command := "ARRAYINFO"
	req := &pb.ArrayInfoRequest{Command: command, Rid: utils.GenerateUUID(), Requestor: p.requestor, Param: param}
	return grpc.SendArrayInfo(p.connection, req)
}

// ListArray command will display detailed information of all existing arrays.
// The function takes a protobuf format as parameter and returns response in protobuf format
func (p *POSGRPCManager) ListArray() (*pb.ListArrayResponse, error) {
	command := "LISTARRAY"
	req := &pb.ListArrayRequest{Command: command, Rid: utils.GenerateUUID(), Requestor: p.requestor}
	return grpc.SendListArray(p.connection, req)
}

// MountArray command will mount the array, You can create a volume from an array only when the array is mounted.
// The function takes a protobuf format as parameter and returns response in protobuf format
func (p *POSGRPCManager) MountArray(param *pb.MountArrayRequest_Param) (*pb.MountArrayResponse, error) {
	command := "MOUNTARRAY"
	req := &pb.MountArrayRequest{Command: command, Rid: utils.GenerateUUID(), Requestor: p.requestor, Param: param}
	return grpc.SendMountArray(p.connection, req)
}

// UnmountArray command will unmount the array, all the volumes in the array will be unmounted
// The function takes a protobuf format as parameter and returns response in protobuf format
func (p *POSGRPCManager) UnmountArray(param *pb.UnmountArrayRequest_Param) (*pb.UnmountArrayResponse, error) {
	command := "UNMOUNTARRAY"
	req := &pb.UnmountArrayRequest{Command: command, Rid: utils.GenerateUUID(), Requestor: p.requestor, Param: param}
	return grpc.SendUnmountArray(p.connection, req)
}

// Replace a data device with an available spare device in array. Use this command when you expect a possible problem of a data device. If there is no available spare device, this command will fail.
// The function takes a protobuf format as parameter and returns response in protobuf format
func (p *POSGRPCManager) ReplaceArrayDevice(param *pb.ReplaceArrayDeviceRequest_Param) (*pb.ReplaceArrayDeviceResponse, error) {
	command := "REPLACEARRAYDEVICE"
	req := &pb.ReplaceArrayDeviceRequest{Command: command, Rid: utils.GenerateUUID(), Requestor: p.requestor, Param: param}
	return grpc.SendReplaceArrayDevice(p.connection, req)
}

// Reset the weights for backend events such as Flush, Rebuild, and GC to the default values.
// The function takes a protobuf format as parameter and returns response in protobuf format
func (p *POSGRPCManager) ResetEventWRRPolicy() (*pb.ResetEventWrrResponse, error) {
	command := "RESETEVENTWRRPOLICY"
	req := &pb.ResetEventWrrRequest{Command: command, Rid: utils.GenerateUUID(), Requestor: p.requestor}
	return grpc.SendResetEventWrrPolicyRpc(p.connection, req)
}

// Reset MBR information of PoseidonOS. Use this command when you need to remove the all the arrays and reset the states of the devices.
// The function takes a protobuf format as parameter and returns response in protobuf format
func (p *POSGRPCManager) ResetMBR() (*pb.ResetMbrResponse, error) {
	command := "RESETMBR"
	req := &pb.ResetMbrRequest{Command: command, Rid: utils.GenerateUUID(), Requestor: p.requestor}
	return grpc.SendResetMbrRpc(p.connection, req)
}

func (p *POSGRPCManager) StopRebuilding(param *pb.StopRebuildingRequest_Param) (*pb.StopRebuildingResponse, error) {
	command := "STOPREBUILDING"
	req := &pb.StopRebuildingRequest{Command: command, Rid: utils.GenerateUUID(), Requestor: p.requestor, Param: param}
	return grpc.SendStopRebuildingRpc(p.connection, req)
}

func (p *POSGRPCManager) UpdateEventWRRPolicy(param *pb.UpdateEventWrrRequest_Param) (*pb.UpdateEventWrrResponse, error) {
	command := "UPDATEEVENTWRRPOLICY"
	req := &pb.UpdateEventWrrRequest{Command: command, Rid: utils.GenerateUUID(), Requestor: p.requestor, Param: param}
	return grpc.SendUpdatEventWrr(p.connection, req)
}

// Apply a filtering policy to logger.
//Filtering file: when executing this command, PoseidonOS reads a filtering policy stored in a file. You can set the file path of the filter in the PoseidonOS configuration (the default path is /etc/conf/filter). If the file does not exist, you can create one.
// The function takes a protobuf format as parameter and returns response in protobuf format
func (p *POSGRPCManager) ApplyLogFilter() (*pb.ApplyLogFilterResponse, error) {
	command := "APPLYLOGFILTER"
	req := &pb.ApplyLogFilterRequest{Command: command, Rid: utils.GenerateUUID(), Requestor: p.requestor}
	return grpc.SendApplyLogFilter(p.connection, req)
}

func (p *POSGRPCManager) GetLogLevel() (*pb.GetLogLevelResponse, error) {
	command := "GETLOGLEVEL"
	req := &pb.GetLogLevelRequest{Command: command, Rid: utils.GenerateUUID(), Requestor: p.requestor}
	return grpc.SendGetLogLevel(p.connection, req)
}

// Display the current preference of logger
// The function takes a protobuf format as parameter and returns response in protobuf format
func (p *POSGRPCManager) LoggerInfo() (*pb.LoggerInfoResponse, error) {
	command := "LOGGERINFO"
	req := &pb.LoggerInfoRequest{Command: command, Rid: utils.GenerateUUID(), Requestor: p.requestor}
	return grpc.SendLoggerInfo(p.connection, req)
}

func (p *POSGRPCManager) SetLogLevel(param *pb.SetLogLevelRequest_Param) (*pb.SetLogLevelResponse, error) {
	command := "SETLOGLEVEL"
	req := &pb.SetLogLevelRequest{Command: command, Rid: utils.GenerateUUID(), Requestor: p.requestor, Param: param}
	return grpc.SendSetLogLevel(p.connection, req)
}

// Set the preferences (e.g., format) of logger.
// The function takes a protobuf format as parameter and returns response in protobuf format
func (p *POSGRPCManager) SetLogPreference(param *pb.SetLogPreferenceRequest_Param) (*pb.SetLogPreferenceResponse, error) {
	command := "SETLOGPREFERENCE"
	req := &pb.SetLogPreferenceRequest{Command: command, Rid: utils.GenerateUUID(), Requestor: p.requestor, Param: param}
	return grpc.SendSetLogPreference(p.connection, req)
}

// Add a listener to an NVMe-oF subsystem
// The function takes a protobuf format as parameter and returns response in protobuf format
func (p *POSGRPCManager) AddListener(param *pb.AddListenerRequest_Param) (*pb.AddListenerResponse, error) {
	command := "ADDLISTENER"
	req := &pb.AddListenerRequest{Command: command, Rid: utils.GenerateUUID(), Requestor: p.requestor, Param: param}
	return grpc.SendAddListener(p.connection, req)
}

// Create an NVMe-oF subsystem to PoseidonOS.
// The function takes a protobuf format as parameter and returns response in protobuf format
func (p *POSGRPCManager) CreateSubsystem(param *pb.CreateSubsystemRequest_Param) (*pb.CreateSubsystemResponse, error) {
	command := "CREATESUBSYSTEM"
	req := &pb.CreateSubsystemRequest{Command: command, Rid: utils.GenerateUUID(), Requestor: p.requestor, Param: param}
	return grpc.SendCreateSubsystem(p.connection, req)
}

// Create NVMf transport to PoseidonOS
// The function takes a protobuf format as parameter and returns response in protobuf format
func (p *POSGRPCManager) CreateTransport(param *pb.CreateTransportRequest_Param) (*pb.CreateTransportResponse, error) {
	command := "CREATETRANSPORT"
	req := &pb.CreateTransportRequest{Command: command, Rid: utils.GenerateUUID(), Requestor: p.requestor, Param: param}
	return grpc.SendCreateTransport(p.connection, req)
}

// Delete a subsystem from PoseidonOS
// The function takes a protobuf format as parameter and returns response in protobuf format
func (p *POSGRPCManager) DeleteSubsystem(param *pb.DeleteSubsystemRequest_Param) (*pb.DeleteSubsystemResponse, error) {
	command := "DELETESUBSYSTEM"
	req := &pb.DeleteSubsystemRequest{Command: command, Rid: utils.GenerateUUID(), Requestor: p.requestor, Param: param}
	return grpc.SendDeleteSubsystem(p.connection, req)
}

func (p *POSGRPCManager) SubsystemInfo(param *pb.SubsystemInfoRequest_Param) (*pb.SubsystemInfoResponse, error) {
	command := "SUBSYSTEMINFO"
	req := &pb.SubsystemInfoRequest{Command: command, Rid: utils.GenerateUUID(), Requestor: p.requestor, Param: param}
	return grpc.SendSubsystemInfo(p.connection, req)
}

func (p *POSGRPCManager) ListSubsystem() (*pb.ListSubsystemResponse, error) {
	command := "LISTSUBSYSTEM"
	req := &pb.ListSubsystemRequest{Command: command, Rid: utils.GenerateUUID(), Requestor: p.requestor}
	return grpc.SendListSubsystem(p.connection, req)
}

// Start the collection of telemetry data in PoseidonOS
// The function takes a protobuf format as parameter and returns response in protobuf format
func (p *POSGRPCManager) StartTelemetry() (*pb.StartTelemetryResponse, error) {
	command := "STARTTELEMETRY"
	req := &pb.StartTelemetryRequest{Command: command, Rid: utils.GenerateUUID(), Requestor: p.requestor}
	return grpc.SendStartTelemetryRpc(p.connection, req)
}

// Stop the collection of telemetry data in PoseidonOS
// The function takes a protobuf format as parameter and returns response in protobuf format
func (p *POSGRPCManager) StopTelemetry() (*pb.StopTelemetryResponse, error) {
	command := "STOPTELEMETRY"
	req := &pb.StopTelemetryRequest{Command: command, Rid: utils.GenerateUUID(), Requestor: p.requestor}
	return grpc.SendStopTelemetryRpc(p.connection, req)
}
