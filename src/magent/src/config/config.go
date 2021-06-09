package config

import (
	"magent/src/models"
)

const (
	// MAgentDB specifies the DB in InfluxDB
	MAgentDB = "poseidon"
	Username = ""
	Password = ""
)

var MAgentConfig = models.Config{
	Interval: 1000,
}
