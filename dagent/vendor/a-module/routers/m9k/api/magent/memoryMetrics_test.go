package magent

import (
	"a-module/routers/m9k/api/magent/mocks"
	"a-module/routers/m9k/model"
	"encoding/json"
	"reflect"
	"testing"
)

func TestGetMemoryData(t *testing.T) {
	var tests = []struct {
		input    model.MAgentParam
		expected interface{}
		err      error
	}{
		{
			input: model.MAgentParam{},
			expected: MemoryFields{
				{
					UsageUser: json.Number("70"),
					Time:      "1589872050483860738",
				},
			},
			err: nil,
		},
		{
			input: model.MAgentParam{
				Time: "15m",
			},
			expected: MemoryFields{
				{
					UsageUser: json.Number("50"),
					Time:      "1589872050483860738",
				},
				{
					UsageUser: json.Number("40"),
					Time:      "1589872050483870738",
				},
			},
			err: nil,
		},
	}

	IDBClient = mocks.MockInfluxClient{}
	for _, test := range tests {
		result, err := GetMemoryData(test.input)
		output := result.Result.Data
		if !reflect.DeepEqual(output, test.expected) || err != test.err {
			t.Errorf("Test Failed: %v inputted, %v expected, received: %v, received err: %v", test.input, test.expected, output, err)
		}
	}

}
