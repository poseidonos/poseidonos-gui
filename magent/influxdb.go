package main

import (
	"bytes"
	"context"
	"fmt"
	client1 "github.com/influxdata/influxdb1-client"
	"log"
	"net"
	"net/http"
	"net/url"
	"os"
	"path"
	"time"
)

var ip = "127.0.0.1"
var ok = false

// InfluxDB struct Maintain data related to InfluxDB connection
type InfluxDB struct {
	URL              string
	Database         string
	WriteConsistency string
	RetentionPolicy  string
	Client           *http.Client
	CreateHTTPClient func(config *HTTPConfig) (*http.Client, error)
}

// HTTPConfig maintains the data for http connection
type HTTPConfig struct {
	URLString     string
	URL           *url.URL
	TransportType string
}

var config = &HTTPConfig{
	URLString:     "http://" + ip + ":8086",
	TransportType: "http",

	//URLString: url.Parse("unix:///var/run/influxdb.sock")
	//TransportType: "unix"
}

// Init initializes inlfuxdb configuration
func Init(mode string) *InfluxDB {
	if mode == "unix" {
		config.URLString = "unix:///var/run/influxdb.sock"
		config.TransportType = "unix"
	}
	if ip, ok = os.LookupEnv("INFLUX_HOST"); !ok {
		ip = "127.0.0.1"
	}
	return &InfluxDB{
		CreateHTTPClient: func(config *HTTPConfig) (*http.Client, error) {
			config.URLString = "http://" + ip + ":8086"
			return NewHTTPClient(config)
		},
	}
}

// NewHTTPClient creates an HTTP client based on the configuration
func NewHTTPClient(config *HTTPConfig) (*http.Client, error) {
	var transport *http.Transport
	config.URL, _ = url.Parse(config.URLString)
	switch config.URL.Scheme {
	case "http":
		transport = &http.Transport{}
		config.URL.Path = path.Join(config.URL.Path, "write")
	case "unix":
		unixPath := config.URL.Path
		unixScheme := config.URL.Scheme
		transport = &http.Transport{
			Dial: func(_, _ string) (net.Conn, error) {
				return net.DialTimeout(
					unixScheme,
					unixPath,
					5*time.Second,
				)
			},
		}
		config.URL.Scheme = "http"
		config.URL.Host = ip
		config.URL.Path = "/write"
	default:
		return nil, fmt.Errorf("unsupported scheme %q", config.URL.Scheme)
	}

	client := &http.Client{
		Timeout:   5 * time.Second,
		Transport: transport,
	}
	return client, nil
}

func (i *InfluxDB) Write(ctx context.Context, client *http.Client, bp client1.BatchPoints, config *HTTPConfig) error {
	params := url.Values{}
	params.Set("db", MAgentDB)
	params.Set("rp", bp.RetentionPolicy)
	params.Set("consistency", "one")
	config.URL.RawQuery = params.Encode()
	urlStr := config.URL.String()
	var b bytes.Buffer
	for _, p := range bp.Points {
		err := checkPointTypes(p)
		if err != nil {
			log.Println("CheckPoint Error: ", err)
			return err
		}
		if p.Raw != "" {
			if _, err := b.WriteString(p.Raw); err != nil {
				log.Println("StringWriteError: ", err)
			}
		} else {
			for k, v := range bp.Tags {
				if p.Tags == nil {
					p.Tags = make(map[string]string, len(bp.Tags))
				}
				p.Tags[k] = v
			}

			if _, err := b.WriteString(p.MarshalString()); err != nil {
				log.Println("Non Raw StringWriteError: ", err)
			}
		}
		if err := b.WriteByte('\n'); err != nil {
			log.Println("ByteWriteError: ", err)
		}
	}
	req, _ := http.NewRequest("POST", urlStr, &b)
	req.Header.Set("Content-Type", "text/plain; charset=utf-8")
	resp, err := client.Do(req.WithContext(ctx))
	if resp != nil && resp.StatusCode != http.StatusOK && resp.StatusCode != 204 && resp.StatusCode != 200 {
		log.Println(bp.Points)
		log.Println(resp)
		return fmt.Errorf("Data Write Error")
	}
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}

// WriteToDB writes the data it receives in dataChan to InfluxDB
func WriteToDB(ctx context.Context, mode string, dataChan chan ClientPoint) {
	// Create a new HTTPClient
	bufSize := 1
	influxdb := Init(mode)
	client, err := influxdb.CreateHTTPClient(config)
	if err != nil {
		log.Fatal("Cannot create connection")
	}
	writeToInfluxDB(ctx, dataChan, client, config, bufSize, influxdb)
}

func writeToInfluxDB(ctx context.Context, dataChan chan ClientPoint, client *http.Client, config *HTTPConfig, bufSize int, influxdb *InfluxDB) {
	start := 0
	bp := client1.BatchPoints{
		Precision:        "ms",
		WriteConsistency: "one",
	}
	ctxBg := context.Background()
	ticker := time.NewTicker(1000 * time.Millisecond)
	for {
		select {
		case point := <-dataChan:
			pointTime := point.Timestamp
			if pointTime.IsZero() {
				pointTime = time.Now()
			}
			pt := client1.Point{
				Measurement: point.Measurement,
				Tags:        point.Tags,
				Fields:      point.Fields,
				Time:        pointTime}
			bp.Points = append(bp.Points, pt)
			bp.RetentionPolicy = point.RetentionPolicy
			start = start + 1
			if start >= bufSize {
				start = 0
				err := influxdb.Write(ctxBg, client, bp, config)
				if err != nil {
					log.Println(err)
				}
				bp = client1.BatchPoints{
					Precision:        "ms",
					WriteConsistency: "one",
					RetentionPolicy:  point.RetentionPolicy,
				}

			}
		case <-ticker.C:
			if len(bp.Points) > 0 {
				err := influxdb.Write(ctxBg, client, bp, config)
				if err != nil {
					log.Println(err)
				}
			}
			bp = client1.BatchPoints{
				Precision:        "ms",
				WriteConsistency: "one",
			}
			start = 0

		case <-ctx.Done():
			log.Println("Writing Data remaining in buffer to DB ...")
			if len(bp.Points) > 0 {
				err := influxdb.Write(ctxBg, client, bp, config)
				if err != nil {
					log.Println(err)
				}
			}
			return
		}
	}
}

func checkPointTypes(p client1.Point) error {
	for _, v := range p.Fields {
		switch v.(type) {
		case int, int8, int16, int32, int64, uint, uint8, uint16, uint32, uint64, float32, float64, bool, string, nil:
			return nil
		default:
			return fmt.Errorf("unsupported point type: %T", v)
		}
	}
	return nil
}
