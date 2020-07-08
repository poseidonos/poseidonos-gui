package magent

import (
	"a-module/src/routers/m9k/api/magent/mocks"
	"a-module/src/routers/m9k/model"
	"encoding/json"
	"reflect"
	"testing"
)

func TestGetDiskData(t *testing.T) {
	var tests = []struct {
		input    model.MAgentParam
		expected interface{}
		err      error
	}{
		{
			input: model.MAgentParam{},
			expected: DiskFields{
				{
					UsageUserBytes: json.Number("200000"),
					Time:           json.Number("1589872050483860738"),
				},
			},
			err: nil,
		},
		{
			input: model.MAgentParam{
				Time: "15m",
			},
			expected: DiskFields{
				{
					UsageUserBytes: json.Number("100000"),
					Time:           json.Number("1589872050483860738"),
				},
				{
					UsageUserBytes: json.Number("200000"),
					Time:           json.Number("1589872050483870738"),
				},
			},
			err: nil,
		},
	}

	IDBClient = mocks.MockInfluxClient{}
	for _, test := range tests {
		result, err := GetDiskData(test.input)
		output := result.Result.Data
		if !reflect.DeepEqual(output, test.expected) || err != test.err {
			t.Errorf("Test Failed: %v inputted, %v expected, received: %v, received err: %v", test.input, test.expected, output, err)
		}
	}

}

func TestGetDiskDataError(t *testing.T) {
	var tests = []struct {
		input    model.MAgentParam
		expected int
		err      error
	}{
		{
			input: model.MAgentParam{
				Time: "115m", //incorrect param
			},
			expected: 500,
			err:      nil,
		},
		{
			input: model.MAgentParam{
				Time: "60d", //no data
			},
			expected: 500,
			err:      nil,
		},
	}

	IDBClient = mocks.MockInfluxClient{}
	for _, test := range tests {
		result, err := GetDiskData(test.input)
		output := result.Result.Status.Code
		if !reflect.DeepEqual(output, test.expected) || err != test.err {
			t.Errorf("Test Failed: %v inputted, %v expected, received: %v, received err: %v", test.input, test.expected, output, err)
		}
	}
}
