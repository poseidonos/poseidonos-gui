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
