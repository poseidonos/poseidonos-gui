// Package pos contains the code for executing commands on POS
package pos

import (
	pb "kouros/api"
)

type POSInterface int64

const (
	GRPC POSInterface = iota
)

// POManager defines the methods that any POS Manager should be implementing
type POSManager interface {

	// Init method is for initializing the Manager
	// The function takes 2 parameters
	// 1. client specifies the name of the client
	// 2. connectionInfo specifies the parameters for connection to POS
	Init(client string, connectionInfo interface{}) error

	// StartPoseidonOS starts the PoseidonOS
	// The function takes a command in JSON format as the parameter
	// A successful Create call returns response in JSON format
	StartPoseidonOS() (response []byte, err error)

	// StopPoseidonos method the running PoseidonOS
	// The function does not require any parameters
	// A successful Create call returns response in the Protobuf format of StopSystemResponse
	StopPoseidonOS() (response *pb.StopSystemResponse, err error)

	// GetSystemInfo method the running PoseidonOS
	// The function does not require any parameters
	// A successful Create call returns response in the Protobuf format of SystemInfoResponse
	GetSystemInfo() (response *pb.SystemInfoResponse, err error)

	// GetSystemProperty method the running PoseidonOS
	// The function does not require any parameters
	// A successful Create call returns response in the Protobuf format of GetSystemPropertyResponse
	GetSystemProperty() (response *pb.GetSystemPropertyResponse, err error)

	// SetSystemProperty method creates an array in PoseidonOS
	// The function takes a command in Protobuf format of SetSystemPropertyRequest_Param as the parameter
	// A successful Create call returns response in the Protobuf format of SetSystemPropertyResponse
	SetSystemProperty(param *pb.SetSystemPropertyRequest_Param) (response *pb.SetSystemPropertyResponse, err error)

	// CreateDevice method creates an array in PoseidonOS
	// The function takes a command in Protobuf format of CreateDeviceRequest_Param as the parameter
	// A successful Create call returns response in the Protobuf format of CreateDeviceResponse
	CreateDevice(param *pb.CreateDeviceRequest_Param) (response *pb.CreateDeviceResponse, err error)

	// ScanDevice method creates an array in PoseidonOS
	// The function takes a command in Protobuf format of ScanDeviceRequest_Param as the parameter
	// A successful Create call returns response in the Protobuf format of ScanDeviceResponse
	ScanDevice() (reponse *pb.ScanDeviceResponse, err error)

	// GetDeviceSmartLog method creates an array in PoseidonOS
	// The function takes a command in Protobuf format of GetSmartLogRequest_Param as the parameter
	// A successful Create call returns response in the Protobuf format of GetSmartLogResponse
	GetDeviceSmartLog(param *pb.GetSmartLogRequest_Param) (response *pb.GetSmartLogResponse, err error)

	// ListDevices method lists the devices in PoseidonOS
	// The function does not require any parameters
	// A successful ListDevices call returns response in protobuf format
	ListDevices() (*pb.ListDeviceResponse, error)

	// Create Array method creates an array in PoseidonOS
	// The function takes a command in protobuf format as the parameter
	// A successful Create call returns response in protobuf format
	CreateArray(param *pb.CreateArrayRequest_Param) (*pb.CreateArrayResponse, error)

	// Add device command add spare device in PoseidonOS Array
	// The function takes a protobuf format as parameter and returns response in protobuf format
	AddDevice(param *pb.AddSpareRequest_Param) (*pb.AddSpareResponse, error)

	// Remove device command removes spare device from PoseidonOS Array
	// The function takes a protobuf format as parameter and returns response in protobuf format
	RemoveDevice(param *pb.RemoveSpareRequest_Param) (*pb.RemoveSpareResponse, error)

	// Automatically create an array for PoseidonOS with the number of devices the user specifies.
	// The function takes a protobuf format as parameter and returns response in protobuf format
	AutoCreateArray(param *pb.AutocreateArrayRequest_Param) (*pb.AutocreateArrayResponse, error)

	// Delete an array from PoseidonOS. After executing this command, the data and volumes in the array will be deleted too.
	// The function takes a protobuf format as parameter and returns response in protobuf format
	DeleteArray(param *pb.DeleteArrayRequest_Param) (*pb.DeleteArrayResponse, error)

	// ArrayInfo command will display detailed information of an array.
	// The function takes a protobuf format as parameter and returns response in protobuf format
	ArrayInfo(param *pb.ArrayInfoRequest_Param) (*pb.ArrayInfoResponse, error)

	// ListArray command will display detailed information of all existing arrays.
	// The function takes a protobuf format as parameter and returns response in protobuf format
	ListArray() (*pb.ListArrayResponse, error)

	// MountArray command will mount the array, You can create a volume from an array only when the array is mounted.
	// The function takes a protobuf format as parameter and returns response in protobuf format
	MountArray(param *pb.MountArrayRequest_Param) (*pb.MountArrayResponse, error)

	// UnmountArray command will unmount the array, all the volumes in the array will be unmounted
	// The function takes a protobuf format as parameter and returns response in protobuf format
	UnmountArray(param *pb.UnmountArrayRequest_Param) (*pb.UnmountArrayResponse, error)

	// Replace a data device with an available spare device in array. Use this command when you expect a possible problem of a data device. If there is no available spare device, this command will fail.
	// The function takes a protobuf format as parameter and returns response in protobuf format
	ReplaceArrayDevice(param *pb.ReplaceArrayDeviceRequest_Param) (*pb.ReplaceArrayDeviceResponse, error)

	// Reset the weights for backend events such as Flush, Rebuild, and GC to the default values.
	// The function takes a protobuf format as parameter and returns response in protobuf format
	ResetEventWRRPolicy() (*pb.ResetEventWrrResponse, error)

	// Reset MBR information of PoseidonOS. Use this command when you need to remove the all the arrays and reset the states of the devices.
	// The function takes a protobuf format as parameter and returns response in protobuf format
	ResetMBR() (*pb.ResetMbrResponse, error)

	StopRebuilding(param *pb.StopRebuildingRequest_Param) (*pb.StopRebuildingResponse, error)

	UpdateEventWRRPolicy(param *pb.UpdateEventWrrRequest_Param) (*pb.UpdateEventWrrResponse, error)

	// Apply a filtering policy to logger.
	// The function takes a protobuf format as parameter and returns response in protobuf format
	ApplyLogFilter() (*pb.ApplyLogFilterResponse, error)

	GetLogLevel() (*pb.GetLogLevelResponse, error)

	// Display the current preference of logger
	// The function takes a protobuf format as parameter and returns response in protobuf format
	LoggerInfo() (*pb.LoggerInfoResponse, error)

	SetLogLevel(param *pb.SetLogLevelRequest_Param) (*pb.SetLogLevelResponse, error)

	// Set the preferences (e.g., format) of logger.
	// The function takes a protobuf format as parameter and returns response in protobuf format
	SetLogPreference(param *pb.SetLogPreferenceRequest_Param) (*pb.SetLogPreferenceResponse, error)

	// Add a listener to an NVMe-oF subsystem
	// The function takes a protobuf format as parameter and returns response in protobuf format
	AddListener(param *pb.AddListenerRequest_Param) (*pb.AddListenerResponse, error)

	// Create an NVMe-oF subsystem to PoseidonOS.
	// The function takes a protobuf format as parameter and returns response in protobuf format
	CreateSubsystem(param *pb.CreateSubsystemRequest_Param) (*pb.CreateSubsystemResponse, error)

	// Create NVMf transport to PoseidonOS
	// The function takes a protobuf format as parameter and returns response in protobuf format
	CreateTransport(param *pb.CreateTransportRequest_Param) (*pb.CreateTransportResponse, error)

	// Delete a subsystem from PoseidonOS
	// The function takes a protobuf format as parameter and returns response in protobuf format
	DeleteSubsystem(param *pb.DeleteSubsystemRequest_Param) (*pb.DeleteSubsystemResponse, error)

	SubsystemInfo(param *pb.SubsystemInfoRequest_Param) (*pb.SubsystemInfoResponse, error)

	ListSubsystem() (*pb.ListSubsystemResponse, error)

	// Start the collection of telemetry data in PoseidonOS
	// The function takes a protobuf format as parameter and returns response in protobuf format
	StartTelemetry() (*pb.StartTelemetryResponse, error)

	// Stop the collection of telemetry data in PoseidonOS
	// The function takes a protobuf format as parameter and returns response in protobuf format
	StopTelemetry() (*pb.StopTelemetryResponse, error)

	// Create the volume in PoseidonOS Array
	// The function takes a protobuf format as parameter and returns response in protobuf format
	CreateVolume(param *pb.CreateVolumeRequest_Param) (*pb.CreateVolumeResponse, error)

	// Set property in telemetry
	// The function takes a protobuf format as parameter and returns response in protobuf format
	SetTelemetryProperty(param *pb.SetTelemetryPropertyRequest_Param) (*pb.SetTelemetryPropertyResponse, error)

    // Get the property of telemetry configuration
    // The function returns response in protobuf format
    GetTelemetryProperty() (*pb.GetTelemetryPropertyResponse, error)

	RebuildArray(param *pb.RebuildArrayRequest_Param) (*pb.RebuildArrayResponse, error)

	VolumeProperty(param *pb.SetVolumePropertyRequest_Param) (*pb.SetVolumePropertyResponse, error)
}
