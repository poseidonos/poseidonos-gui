// Package pos contains the code for executing commands on POS
package pos


// POManager defines the methods that any POS Manager should be implementing
type POSManager interface {

	// Init method is for initializing the Manager
	// The function takes 2 parameters
	// 1. client specifies the name of the client
	// 2. connectionInfo specifies the parameters for connection to POS
	Init(client string, connectionInfo interface{})

	// ListDevices method lists the devices in PoseidonOS
	// The function does not require any parameters
	// A successful ListDevices call returns response in JSON format 
	ListDevices() (response []byte, err error)

	// Create Array method creates an array in PoseidonOS
	// The function takes a command in JSON format as the parameter
	// A successful Create call returns response in JSON format
	CreateArray(createArrayCommand[]byte) (response []byte, err error)
}