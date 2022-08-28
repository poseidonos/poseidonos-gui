package pos

import (
	"log"
	"github.com/google/uuid"
	"google.golang.org/protobuf/encoding/protojson"
	"kouros/pos/grpc"
	pb "kouros/pos/grpc/api"
)

const dialTimeout = 10

type POSGRPCManager struct {
	connection grpc.POSGRPCConnection
}

func generateUUID() string {
	reqID, err := uuid.NewUUID()
	if err != nil {
		log.Print("Error in Generating UUID ", err.Error())
	}
	return reqID.String()
}

func (p *POSGRPCManager) Init(address interface{}) {
	p.connection = grpc.POSGRPCConnection{
		Address: address.(string),
	}
}

func (p *POSGRPCManager) ListDevices() ([]byte, error) {
	command := "LISTDEVICE"
	req := &pb.ListDeviceRequest{Command: command, Rid: generateUUID(), Requestor: "cli"}
	res, err := grpc.SendListDevice(p.connection, req)
	if err != nil {
		return nil, err
	}
	return protojson.Marshal(res)
}

func (p *POSGRPCManager) CreateArray(createArrayCommand []byte) ([]byte, error) {
	command := "CREATEARRAY"
	var createArrayPB pb.CreateArrayRequest_Param
	protojson.Unmarshal(createArrayCommand, &createArrayPB)
	req := &pb.CreateArrayRequest{Command: command, Rid: generateUUID(), Requestor: "cli", Param: &createArrayPB}
	res, err := grpc.SendCreateArray(p.connection, req)
	if err != nil {
		return nil, err
	}
	return protojson.Marshal(res)
}