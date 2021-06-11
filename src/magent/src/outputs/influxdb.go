/*
 *   BSD LICENSE
 *   Copyright (c) 2021 Samsung Electronics Corporation
 *   All rights reserved.
 *
 *   Redistribution and use in source and binary forms, with or without
 *   modification, are permitted provided that the following conditions
 *   are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in
 *       the documentation and/or other materials provided with the
 *       distribution.
 *     * Neither the name of Intel Corporation nor the names of its
 *       contributors may be used to endorse or promote products derived
 *       from this software without specific prior written permission.
 *
 *   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 *   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 *   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 *   A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 *   OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 *   SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 *   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 *   DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 *   THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 *   OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
 package outputs

import (
	"bytes"
	"context"
	"fmt"
	client1 "github.com/influxdata/influxdb1-client"
	"log"
	"magent/src/config"
	"magent/src/models"
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
	CreateHTTPClient func(dbConfig *HTTPConfig) (*http.Client, error)
}

// HTTPConfig maintains the data for http connection
type HTTPConfig struct {
	URLString     string
	URL           *url.URL
	TransportType string
}

var dbConfig = &HTTPConfig{
	URLString:     "http://" + ip + ":8086",
	TransportType: "http",

	//URLString: url.Parse("unix:///var/run/influxdb.sock")
	//TransportType: "unix"
}

// Init initializes inlfuxdb dbConfiguration
func Init(mode string) *InfluxDB {
	if mode == "unix" {
		dbConfig.URLString = "unix:///var/run/influxdb.sock"
		dbConfig.TransportType = "unix"
	}
	if ip, ok = os.LookupEnv("INFLUX_HOST"); !ok {
		ip = "127.0.0.1"
	}
	return &InfluxDB{
		CreateHTTPClient: func(dbConfig *HTTPConfig) (*http.Client, error) {
			return NewHTTPClient(dbConfig)
		},
	}
}

// NewHTTPClient creates an HTTP client based on the dbConfiguration
func NewHTTPClient(dbConfig *HTTPConfig) (*http.Client, error) {
	var transport *http.Transport
	dbConfig.URL, _ = url.Parse(dbConfig.URLString)
	switch dbConfig.URL.Scheme {
	case "http":
		transport = &http.Transport{}
		dbConfig.URL.Path = path.Join(dbConfig.URL.Path, "write")
	case "unix":
		unixPath := dbConfig.URL.Path
		unixScheme := dbConfig.URL.Scheme
		transport = &http.Transport{
			Dial: func(_, _ string) (net.Conn, error) {
				return net.DialTimeout(
					unixScheme,
					unixPath,
					5*time.Second,
				)
			},
		}
		dbConfig.URL.Scheme = "http"
		dbConfig.URL.Host = ip
		dbConfig.URL.Path = "/write"
	default:
		return nil, fmt.Errorf("unsupported scheme %q", dbConfig.URL.Scheme)
	}

	client := &http.Client{
		Timeout:   20 * time.Second,
		Transport: transport,
	}
	return client, nil
}

func (i *InfluxDB) Write(ctx context.Context, client *http.Client, bp client1.BatchPoints, dbConfig *HTTPConfig) error {
	params := url.Values{}
	params.Set("db", config.MAgentDB)
	params.Set("rp", bp.RetentionPolicy)
	params.Set("consistency", "one")
	dbConfig.URL.RawQuery = params.Encode()
	urlStr := dbConfig.URL.String()
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
		log.Println("Data Write Error: ", resp.StatusCode)
		return fmt.Errorf("Data Write Error")
	}
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}

// WriteToDB writes the data it receives in dataChan to InfluxDB
func WriteToDB(ctx context.Context, mode string, dataChan chan models.ClientPoint) {
	// Create a new HTTPClient
	bufSize := 100
	influxdb := Init(mode)
	client, err := influxdb.CreateHTTPClient(dbConfig)
	if err != nil {
		log.Fatal("Cannot create connection")
	}
	writeToInfluxDB(ctx, dataChan, client, dbConfig, bufSize, influxdb)
}

func writeToInfluxDB(ctx context.Context, dataChan chan models.ClientPoint, client *http.Client, dbConfig *HTTPConfig, bufSize int, influxdb *InfluxDB) {
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
			point.Fields["unixTimestamp"] = pointTime.UnixNano()
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
				err := influxdb.Write(ctxBg, client, bp, dbConfig)
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
				err := influxdb.Write(ctxBg, client, bp, dbConfig)
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
				err := influxdb.Write(ctxBg, client, bp, dbConfig)
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
