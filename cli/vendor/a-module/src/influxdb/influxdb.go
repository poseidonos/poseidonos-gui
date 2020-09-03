package influxdb

import (
	"a-module/src/errors"
	"context"
	"fmt"
	"github.com/influxdata/influxdb-client-go/v2"
	"time"
)

var (
	CreateErr = errors.New("Influx Create fail")
	DeleteErr = errors.New("Influx Delete fail")
)

func Test() {
	// Create a new client using an InfluxDB server base URL and an authentication token
	client := influxdb2.NewClient("http://localhost:9999", "my-token")
	// Use blocking write client for writes to desired bucket
	writeAPI := client.WriteAPIBlocking("my-org", "my-bucket")
	// Create point using full params constructor
	p := influxdb2.NewPoint("stat",
		map[string]string{"unit": "temperature"},
		map[string]interface{}{"avg": 24.5, "max": 45},
		time.Now())
	// write point immediately
	writeAPI.WritePoint(context.Background(), p)
	// Create point using fluent style
	p = influxdb2.NewPointWithMeasurement("stat").
		AddTag("unit", "temperature").
		AddField("avg", 23.2).
		AddField("max", 45).
		SetTime(time.Now())
	writeAPI.WritePoint(context.Background(), p)

	// Or write directly line protocol
	line := fmt.Sprintf("stat,unit=temperature avg=%f,max=%f", 23.5, 45.0)
	writeAPI.WriteRecord(context.Background(), line)
}

func CreateVolume() error {
	fmt.Println("Create Volume !!!!")

	//return CreateErr
	return nil
}

func DeleteVolume() error {
	fmt.Println("Delete Volume !!!!")

	//return DeleteErr
	return nil
}
