package magent

// Connecting to influxdb
func ConnectDB() (client.Client, error) {
	client, err := client.NewHTTPClient(client.HTTPConfig{
		Addr: DBAddress,
	})
	return client, err
}
