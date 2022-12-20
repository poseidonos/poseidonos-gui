package globals

import (
	"github.com/shettyh/tlock"
	"kouros/model"
	"sync"
	"time"
)

var Telemetry_config_path = "/usr/local/dagent/telemetry_config.yaml"
var TelemetryWriteLock sync.Mutex
var InitialTime = int64(0)
var Temptime int64
var InitialRes model.Response
var InitialErr error
var TimeLimit = int64(30)            //seconds
var LockTimeout = time.Duration(1800) //30 min 
var APILock tlock.Lock = tlock.New()
var APILockSkt tlock.Lock = tlock.New()

