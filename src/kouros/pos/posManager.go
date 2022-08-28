package pos

type POSManager interface {
	Init(interface{})
	ListDevices() ([]byte, error)
	CreateArray([]byte) ([]byte, error)
}