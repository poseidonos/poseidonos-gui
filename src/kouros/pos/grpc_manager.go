package pos

import (
	pb "kouros/api"
	"kouros/pos/grpc"
	"kouros/utils"
)

const dialTimeout = 10

type POSGRPCManager struct {
	connection grpc.POSGRPCConnection
	requestor  string
}

func (p *POSGRPCManager) Init(client string, address interface{}) {
	p.connection = grpc.POSGRPCConnection{
		Address: address.(string),
	}
	p.requestor = client
}

// ListDevices method lists the devices in PoseidonOS
// The function does not require any parameters
// A successful ListDevices call returns response in JSON format with the following fields
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
	req := &pb.ListDeviceRequest{Command: command, Rid: utils.GenerateUUID(), Requestor: "cli"}
	return grpc.SendListDevice(p.connection, req)
}

// Create Array method creates an array in PoseidonOS
// The function takes a byte array in JSON format as parameter with the following fields
// param: param object contains the following fields
//   - name: Name of the array (string)
//   - raidtype: RAID type of the array
//   - data: A list of data devices. Each device contains the following fields
//      1. deviceName: name of the device (string)
//   - buffer: A list of buffer devices. Each device contains the following fields
//      1. deviceName: name of the device (string)
//   - spare: A list of spare devices. Each device contains the following fields
//      1. deviceName: name of the device (string)
// A successful Create call returns response in JSON format with the following fields
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
func (p *POSGRPCManager) CreateArray(param pb.CreateArrayRequest_Param) (*pb.CreateArrayResponse, error) {
	command := "CREATEARRAY"
	req := &pb.CreateArrayRequest{Command: command, Rid: utils.GenerateUUID(), Requestor: "cli", Param: &createArrayPB}
	return grpc.SendCreateArray(p.connection, req)
}
