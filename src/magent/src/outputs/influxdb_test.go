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
 *     * Neither the name of Samsung Electronics Corporation nor the names of its
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
	"context"
	"fmt"
	client1 "github.com/influxdata/influxdb1-client"
	"github.com/stretchr/testify/require"
	"io/ioutil"
	"magent/src/models"
	"net"
	"net/http"
	"net/http/httptest"
	"net/url"
	"os"
	"path"
	"testing"
	"time"
)

//Should not raise an error if the data to be written to DB is valid
//This function calls the checkPointTypes function
//It verifies that there is no error produced if the data passed to the function is valid
func TestCheckPointTypes(t *testing.T) {
	pt := client1.Point{
		Measurement: "air",
		Tags:        map[string]string{},
		Fields: map[string]interface{}{
			"cpu": 2,
		},
		Time: time.Now()}
	err := checkPointTypes(pt)
	require.NoError(t, err)
	ptNil := client1.Point{
		Measurement: "air",
		Tags:        map[string]string{},
		Fields:      map[string]interface{}{},
		Time:        time.Now()}
	err = checkPointTypes(ptNil)
	require.NoError(t, err)

}

//Should return error when data to be written to DB is invalid
//This function calls the checkPointTypes function
//It verifies that an error is produced if the data passed to the function is not valid
func TestCheckPointTypesError(t *testing.T) {
	p := client1.Point{}
	pt := client1.Point{
		Measurement: "air",
		Tags:        map[string]string{},
		Fields: map[string]interface{}{
			"cpu": p,
		},
		Time: time.Now()}
	err := checkPointTypes(pt)
	require.Error(t, err)
}

//Should write to DB using HTTP protocol
//This function calls the NewHTTPClient and then calls the InfluxDB.Write
//It verifies that there is no error produced if the datais send to DB using HTTP protocol
func TestWriteToDBHTTP(t *testing.T) {
	httpHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case "/":
			w.WriteHeader(http.StatusOK)
			return
		default:
			w.WriteHeader(http.StatusNotFound)
			return
		}
	})
	ts := httptest.NewServer(httpHandler)
	defer ts.Close()
	u, err := url.Parse(fmt.Sprintf("http://%s", ts.Listener.Addr().String()))
	require.NoError(t, err)
	newPoint := client1.Point{
		Fields: map[string]interface{}{
			"cpu": 10,
		},
		Tags:        map[string]string{},
		Measurement: "cpu_magent",
		Time:        time.Now(),
	}
	bp := client1.BatchPoints{
		Precision:        "ms",
		WriteConsistency: "one",
		RetentionPolicy:  "autogen",
	}
	bp.Points = append(bp.Points, newPoint)
	ctx := context.Background()
	client, err := NewHTTPClient(dbConfig)
	require.NoError(t, err)
	influxdb := Init("http")
	dbConfig.URL = u

	//Should send an http request using http protocol with the points in the channel
	clientPoint := models.ClientPoint{
		Fields: map[string]interface{}{
			"cpu": 10,
		},
		Tags: map[string]string{
			"cpu_name": "cpu0",
		},
		Measurement:     "cpu_magent",
		RetentionPolicy: "autogen",
	}
	ctx, cancel := context.WithCancel(context.Background())
	dataChan := make(chan models.ClientPoint, 100)
	dataChan <- clientPoint
	go func() {
		time.Sleep(1 * time.Second)
		cancel()
	}()
	dbConfig.URLString = u.String()
	WriteToDB(ctx, "http", dataChan)

	ctx, cancel = context.WithCancel(context.Background())
	dataChan <- clientPoint
	go func() {
		time.Sleep(500 * time.Millisecond)
		cancel()
	}()
	writeToInfluxDB(ctx, dataChan, client, dbConfig, 10, influxdb)

	//Should send an http request when the time interval for flushing is exceeded
	ctx, cancel = context.WithCancel(context.Background())
	dataChan <- clientPoint
	go func() {
		time.Sleep(2 * time.Second)
		cancel()
	}()
	writeToInfluxDB(ctx, dataChan, client, dbConfig, 10, influxdb)

	//Should raise an error when the request returns error
	dbConfig.URL, _ = url.Parse(fmt.Sprintf("http://%s/test", ts.Listener.Addr().String()))
	err = influxdb.Write(ctx, client, bp, dbConfig)
	require.Error(t, err)

	//Should not send request using  http protocol if data is invalid
	point := client1.Point{
		Fields: map[string]interface{}{
			"cpu": []int{10},
		},
		Tags:        map[string]string{},
		Measurement: "cpu_magent",
		Time:        time.Now(),
	}
	bp.Points = append(bp.Points, point)
	bp.Tags = map[string]string{
		"test": "Test",
	}
	err = influxdb.Write(ctx, client, bp, dbConfig)
	require.Error(t, err)
}

//Should write to DB using Unix Protocol
//This function calls the NewHTTPClient and then calls the InfluxDB.Write
//It verifies that there is no error produced if the data is sent to DB using Unix socket
func TestWriteToDBUnix(t *testing.T) {
	tmpdir, err := ioutil.TempDir("", "telegraf-test")
	if err != nil {
		require.NoError(t, err)
	}
	defer os.RemoveAll(tmpdir)

	sock := path.Join(tmpdir, "test.sock")
	listener, err := net.Listen("unix", sock)
	require.NoError(t, err)

	ts := httptest.NewUnstartedServer(http.NotFoundHandler())
	ts.Listener = listener
	ts.Start()
	defer ts.Close()
	newPoint := client1.Point{
		Fields: map[string]interface{}{
			"cpu": 10,
		},
		Tags:        map[string]string{},
		Measurement: "cpu_magent",
		Time:        time.Now(),
	}
	bp := client1.BatchPoints{
		Precision:        "ms",
		WriteConsistency: "one",
		RetentionPolicy:  "autogen",
	}
	bp.Points = append(bp.Points, newPoint)
	ts.Config.Handler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case "/write":
			w.WriteHeader(http.StatusOK)
			return
		default:
			w.WriteHeader(http.StatusNotFound)
			return
		}
	})
	ctx := context.Background()
	influxdb := Init("unix")
	dbConfig.URL = &url.URL{Scheme: "unix", Path: sock}
	dbConfig.URLString = dbConfig.URL.String()
	client, err := NewHTTPClient(dbConfig)
	require.NoError(t, err)

	//Should send an http request using unix socket protocol with the points in the channel
	err = influxdb.Write(ctx, client, bp, dbConfig)
	require.NoError(t, err)

	//Should raise an error when the response status is not OK
	dbConfig.URL.Path = "/test"
	err = influxdb.Write(ctx, client, bp, dbConfig)
	require.Error(t, err)

	//Should not send request using  unix socket protocol if data is invalid
	point := client1.Point{
		Fields: map[string]interface{}{
			"cpu": []int{10},
		},
		Tags:        map[string]string{},
		Measurement: "cpu_magent",
		Time:        time.Now(),
	}
	bp.Points = append(bp.Points, point)
	err = influxdb.Write(ctx, client, bp, dbConfig)
	require.Error(t, err)

	// Should send request if poitns contain Raw field
	nbp := client1.BatchPoints{
		Precision:        "ms",
		WriteConsistency: "one",
		RetentionPolicy:  "autogen",
	}
	npoint := client1.Point{
		Fields: map[string]interface{}{
			"cpu": 25,
		},
		Tags:        nil,
		Measurement: "cpu_magent",
		Time:        time.Now(),
		Raw:         "test",
	}
	fmt.Println("Printing Point")
	fmt.Println(npoint)
	nbp.Points = append(nbp.Points, npoint)
	nbp.Tags = map[string]string{
		"test": "test",
	}
	fmt.Println(nbp.Points)
	err = influxdb.Write(ctx, client, nbp, dbConfig)
	require.Error(t, err)
}

func TestNewHttpConfig(t *testing.T) {
	dbConfig = &HTTPConfig{
		URLString:     "udp://test:8086",
		TransportType: "udp",
	}
	_, err := NewHTTPClient(dbConfig)
	require.Error(t, err)
	/*
		        ctx, _ := context.WithCancel(context.Background())
		        dataChan := make(chan models.ClientPoint, 100)
			WriteToDB(ctx, "udp", dataChan)
	*/
}
