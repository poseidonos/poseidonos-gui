package magent

import "github.com/influxdata/influxdb/client/v2"

// Connecting to influxdb
func ConnectDB() (client.Client, error) {
	client, err := client.NewHTTPClient(client.HTTPConfig{
		Addr: DBAddress,
	})
	return client, err
}
