package globals

import (
	"sync"
)

var Telemetry_config_path = "/usr/local/dagent/telemetry_config.yaml"
var TelemetryWriteLock sync.Mutex
