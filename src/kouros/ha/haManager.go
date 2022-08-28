package ha

type HAManager interface {
	listNodes() ([]byte, error)
}