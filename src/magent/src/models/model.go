package models

import (
	"time"
)

// ClientPoint has the fields that should be passed to be written to DB
type ClientPoint struct {
	Fields          map[string]interface{}
	Tags            map[string]string
	Measurement     string
	RetentionPolicy string
	Timestamp       time.Time
}

// Config has the configurable parameters in MAgent
type Config struct {
	Interval int //Time in MilliSeconds
}

type tailFields struct {
	test string
}

type AIRPoint struct {
	Timestamp float64
	Tags      map[string]string
	Fields    map[string]interface{}
}
