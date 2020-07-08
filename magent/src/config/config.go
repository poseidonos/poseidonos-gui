package config

import (
	"magent/src/models"
)


const (
        // MAgentDB specifies the DB in InfluxDB
        MAgentDB = "mtool_db"
        Username = ""
        Password = ""
)

var MAgentConfig = models.Config{
        Interval: 1000,
}

