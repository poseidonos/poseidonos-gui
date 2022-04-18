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

package magent

import (
	"encoding/json"
	"pnconnector/src/routers/m9k/api/magent/mocks"
	"pnconnector/src/routers/m9k/model"
	"reflect"
	"testing"
)

func TestGetNetData(t *testing.T) {
	var tests = []struct {
		input    model.MAgentParam
		expected interface{}
		err      error
	}{
		{
			input: model.MAgentParam{},
			expected: NetFields{
				{
					Time:        json.Number("1589872050483860738"),
					BytesRecv:   json.Number("10"),
					BytesSent:   json.Number("20"),
					DropIn:      json.Number("30"),
					DropOut:     json.Number("40"),
					ErrIn:       json.Number("50"),
					ErrOut:      json.Number("60"),
					PacketsRecv: json.Number("70"),
					PacketsSent: json.Number("80"),
				},
			},
			err: nil,
		},
		{
			input: model.MAgentParam{
				Time: "15m",
			},
			expected: NetFields{
				{
					Time:        json.Number("1589872050483860738"),
					BytesRecv:   json.Number("10"),
					BytesSent:   json.Number("20"),
					DropIn:      json.Number("30"),
					DropOut:     json.Number("40"),
					ErrIn:       json.Number("50"),
					ErrOut:      json.Number("60"),
					PacketsRecv: json.Number("70"),
					PacketsSent: json.Number("80"),
				},
				{
					Time:        json.Number("1589872050483870738"),
					BytesRecv:   json.Number("50"),
					BytesSent:   json.Number("60"),
					DropIn:      json.Number("30"),
					DropOut:     json.Number("40"),
					ErrIn:       json.Number("90"),
					ErrOut:      json.Number("60"),
					PacketsRecv: json.Number("70"),
					PacketsSent: json.Number("80"),
				},
			},
			err: nil,
		},
	}

	IDBClient = mocks.MockInfluxClient{}
	for _, test := range tests {
		result, err := GetNetData(test.input)
		output := result.Result.Data
		if !reflect.DeepEqual(output, test.expected) || err != test.err {
			t.Errorf("Test Failed: %v inputted, %v expected, received: %v, received err: %v", test.input, test.expected, output, err)
		}
	}

}

func TestGetNetDataError(t *testing.T) {
	var tests = []struct {
		input    model.MAgentParam
		expected int
		err      error
	}{
		{
			input: model.MAgentParam{
				Time: "115m", //incorrect param
			},
			expected: 21010,
			err:      nil,
		},
		{
			input: model.MAgentParam{
				Time: "60d", //no data
			},
			expected: 0,
			err:      nil,
		},
	}

	IDBClient = mocks.MockInfluxClient{}
	for _, test := range tests {
		result, err := GetNetData(test.input)
		output := result.Result.Status.Code
		if !reflect.DeepEqual(output, test.expected) || err != test.err {
			t.Errorf("Test Failed: %v inputted, %v expected, received: %v, received err: %v", test.input, test.expected, output, err)
		}
	}
}
