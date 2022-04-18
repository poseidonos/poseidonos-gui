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

func TestGetRebuildLogs(t *testing.T) {
	var tests = []struct {
		input    model.MAgentParam
		expected interface{}
		err      error
		status   int
	}{
		{
			input: model.MAgentParam{
				Time: "1h",
			},
			expected: LogsFields{
				{
					Time:  json.Number("1589872050483860738"),
					Value: "Log line 1",
				},
			},
			status: 0,
			err:    nil,
		},
		{
			// Error while Querying
			input: model.MAgentParam{
				Time: "2h",
			},
			expected: []string{},
			status:   21010,
			err:      nil,
		},
		{
			// Empty response
			input: model.MAgentParam{
				Time: "1d",
			},
			status:   21010,
			expected: []string{},
			err:      nil,
		},
	}

	IDBClient = mocks.MockInfluxClient{}
	for _, test := range tests {
		result, err := GetRebuildLogs(test.input)
		output := result.Result.Data
		status := result.Result.Status.Code
		if !reflect.DeepEqual(output, test.expected) || err != test.err || status != test.status {
			t.Errorf("Test Failed: %v inputted, %v expected, received: %v, received err: %v, status expected: %v, status received: %v", test.input, test.expected, output, err, test.status, status)
		}
	}

}
