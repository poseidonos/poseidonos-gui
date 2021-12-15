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
package resttest

import (
	"bytes"
	"io/ioutil"
	"net/http"
	"resttest/mocks"
	"resttest/restclient"
	"testing"
	"time"
)

const (
	IP                  = "127.0.0.1"
	PORT                = "3000"
	LATEST_CPU          = "http://" + IP + ":" + PORT + "/api/metrics/v1/cpu"
	LATEST_DISK         = "http://" + IP + ":" + PORT + "/api/metrics/v1/disk"
	LATEST_MEMORY       = "http://" + IP + ":" + PORT + "/api/metrics/v1/memory"
	LATEST_NETWORK      = "http://" + IP + ":" + PORT + "/api/metrics/v1/network"
	CPU                 = "http://" + IP + ":" + PORT + "/api/metrics/v1/cpu/1m"
	DISK                = "http://" + IP + ":" + PORT + "/api/metrics/v1/disk/1m"
	MEMORY              = "http://" + IP + ":" + PORT + "/api/metrics/v1/memory/1m"
	NETWORK             = "http://" + IP + ":" + PORT + "/api/metrics/v1/network/1m"
	NETWORK_DRIVER      = "http://" + IP + ":" + PORT + "/api/metrics/v1/network/driver"
	NETWORK_HARDWARE    = "http://" + IP + ":" + PORT + "/api/metrics/v1/network/hardwareaddress"
	X_REQUEST_ID        = "X-request-Id"
	X_REQUEST_ID_VALUE  = "25154800-f145-42b9-8954-c50bada0ab5a"
	ACCEPT              = "Accept"
	ACCEPT_VALUE        = "application/json"
	AUTHORIZATION       = "Authorization"
	AUTHORIZATION_VALUE = "Samsung Rocks"
	TIMESTAMP           = "ts"
)

var header = http.Header{}

func init() {
	// If a mockclient is needed, you can uncomment this line
	// and the mock json output is used
	//restclient.Client = &mocks.MockClient{}
	header.Set(X_REQUEST_ID, X_REQUEST_ID_VALUE)
	header.Set(ACCEPT, ACCEPT_VALUE)
	header.Set(AUTHORIZATION, AUTHORIZATION_VALUE)
	header.Set(TIMESTAMP, string(time.Now().Unix()))
}

func TestCPUGetRequest(t *testing.T) {

	resjson := `{"cpu": "50"}`
	res := ioutil.NopCloser(bytes.NewReader([]byte(resjson)))
	//url := "cpu"
	url := CPU

	mocks.GetDoFunc = func(*http.Request) (*http.Response, error) {
		return &http.Response{
			StatusCode: 200,
			Body:       res,
		}, nil
	}

	resp, err := restclient.Get(url, header)

	if err != nil {
		panic(err)
	}

	if resp.StatusCode != 200 || resp.Body == nil {
		t.Error("HTTP Get request failed in TestCPUGetRequest")
	} else {
		t.Logf("TestCPUGetRequest Successful")
	}

}

func TestLatestCPUGetRequest(t *testing.T) {

	resjson := `{"cpu": "50"}`
	res := ioutil.NopCloser(bytes.NewReader([]byte(resjson)))
	//url := "cpu"
	url := LATEST_CPU

	mocks.GetDoFunc = func(*http.Request) (*http.Response, error) {
		return &http.Response{
			StatusCode: 200,
			Body:       res,
		}, nil
	}

	resp, err := restclient.Get(url, header)

	if err != nil {
		panic(err)
	}

	if resp.StatusCode != 200 || resp.Body == nil {
		t.Error("HTTP Get request failed in TestCPUGetRequest")
	} else {
		t.Logf("TestCPUGetRequest Successful")
	}

}

func TestNetworkGetRequest(t *testing.T) {

	resjson := `{"network": "50"}`
	res := ioutil.NopCloser(bytes.NewReader([]byte(resjson)))
	// url := "network"
	url := NETWORK

	mocks.GetDoFunc = func(*http.Request) (*http.Response, error) {
		return &http.Response{
			StatusCode: 200,
			Body:       res,
		}, nil
	}

	resp, err := restclient.Get(url, header)

	if err != nil {
		panic(err)
	}

	if resp.StatusCode != 200 || resp.Body == nil {
		t.Error("HTTP Get request failed in TestNetworkGetRequest")
	} else {
		t.Logf("TestNetworkGetRequest Successful")
	}

}

func TestLatestNetworkGetRequest(t *testing.T) {

	resjson := `{"network": "50"}`
	res := ioutil.NopCloser(bytes.NewReader([]byte(resjson)))
	// url := "network"
	url := LATEST_NETWORK

	mocks.GetDoFunc = func(*http.Request) (*http.Response, error) {
		return &http.Response{
			StatusCode: 200,
			Body:       res,
		}, nil
	}

	resp, err := restclient.Get(url, header)

	if err != nil {
		panic(err)
	}

	if resp.StatusCode != 200 || resp.Body == nil {
		t.Error("HTTP Get request failed in TestNetworkGetRequest")
	} else {
		t.Logf("TestNetworkGetRequest Successful")
	}

}

func TestNetworkDriverGetRequest(t *testing.T) {

	resjson := `{"network_driver": "50"}`
	res := ioutil.NopCloser(bytes.NewReader([]byte(resjson)))
	//url := "cpu"
	url := NETWORK_DRIVER

	mocks.GetDoFunc = func(*http.Request) (*http.Response, error) {
		return &http.Response{
			StatusCode: 200,
			Body:       res,
		}, nil
	}

	resp, err := restclient.Get(url, header)

	if err != nil {
		panic(err)
	}

	if resp.StatusCode != 200 || resp.Body == nil {
		t.Error("HTTP Get request failed in TestCPUGetRequest")
	} else {
		t.Logf("TestCPUGetRequest Successful")
	}

}
func TestNetworkHardwareGetRequest(t *testing.T) {

	resjson := `{"network_hardware": "50"}`
	res := ioutil.NopCloser(bytes.NewReader([]byte(resjson)))
	//url := "cpu"
	url := NETWORK_HARDWARE

	mocks.GetDoFunc = func(*http.Request) (*http.Response, error) {
		return &http.Response{
			StatusCode: 200,
			Body:       res,
		}, nil
	}

	resp, err := restclient.Get(url, header)

	if err != nil {
		panic(err)
	}

	if resp.StatusCode != 200 || resp.Body == nil {
		t.Error("HTTP Get request failed in TestCPUGetRequest")
	} else {
		t.Logf("TestCPUGetRequest Successful")
	}

}
func TestDiskGetRequest(t *testing.T) {

	resjson := `{"disk": "50"}`
	res := ioutil.NopCloser(bytes.NewReader([]byte(resjson)))
	url := DISK

	mocks.GetDoFunc = func(*http.Request) (*http.Response, error) {
		return &http.Response{
			StatusCode: 200,
			Body:       res,
		}, nil
	}

	resp, err := restclient.Get(url, header)

	if err != nil {
		panic(err)
	}

	if resp.StatusCode != 200 || resp.Body == nil {
		t.Error("HTTP Get request failed in TestMemoryGetRequest")
	} else {
		t.Logf("TestMemoryGetRequest Successful")
	}

}
func TestLatestDiskGetRequest(t *testing.T) {

	resjson := `{"disk": "50"}`
	res := ioutil.NopCloser(bytes.NewReader([]byte(resjson)))
	url := LATEST_DISK

	mocks.GetDoFunc = func(*http.Request) (*http.Response, error) {
		return &http.Response{
			StatusCode: 200,
			Body:       res,
		}, nil
	}

	resp, err := restclient.Get(url, header)

	if err != nil {
		panic(err)
	}

	if resp.StatusCode != 200 || resp.Body == nil {
		t.Error("HTTP Get request failed in TestMemoryGetRequest")
	} else {
		t.Logf("TestMemoryGetRequest Successful")
	}

}

func TestMemoryGetRequest(t *testing.T) {

	resjson := `{"memory": "50"}`
	res := ioutil.NopCloser(bytes.NewReader([]byte(resjson)))
	url := MEMORY

	mocks.GetDoFunc = func(*http.Request) (*http.Response, error) {
		return &http.Response{
			StatusCode: 200,
			Body:       res,
		}, nil
	}

	resp, err := restclient.Get(url, header)

	if err != nil {
		panic(err)
	}

	if resp.StatusCode != 200 || resp.Body == nil {
		t.Error("HTTP Get request failed in TestMemoryGetRequest")
	} else {
		t.Logf("TestMemoryGetRequest Successful")
	}

}

func TestLatestMemoryGetRequest(t *testing.T) {

	resjson := `{"memory": "50"}`
	res := ioutil.NopCloser(bytes.NewReader([]byte(resjson)))
	url := LATEST_MEMORY

	mocks.GetDoFunc = func(*http.Request) (*http.Response, error) {
		return &http.Response{
			StatusCode: 200,
			Body:       res,
		}, nil
	}

	resp, err := restclient.Get(url, header)

	if err != nil {
		panic(err)
	}

	if resp.StatusCode != 200 || resp.Body == nil {
		t.Error("HTTP Get request failed in TestMemoryGetRequest")
	} else {
		t.Logf("TestMemoryGetRequest Successful")
	}

}
