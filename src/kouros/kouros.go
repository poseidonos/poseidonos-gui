package main

import (
	"fmt"
	"errors"
	"kouros/ha"
	"kouros/pos"
)



func NewPOSManager(managerType string) (pos.POSManager, error) {
	switch managerType {
	case "grpc":
		return &pos.POSGRPCManager{}, nil
	default:
		return nil, errors.New("Invalid POS Manager type")
	}
}

func NewHAManager(managerType string) (ha.HAManager, error) {
	switch managerType {
	case "postgres":
		return &ha.PostgresHAManager{}, nil
	default:
		return nil, errors.New("Invalid HA Manager type")
	}
}

func main() {
	posManager, err := NewPOSManager("grpc")
	if err != nil {
		fmt.Println("GRPC method is not supported")
	}
	posManager.Init("127.0.0.1:50055")
	res, _ := posManager.ListDevices()
	fmt.Println(string(res))
}