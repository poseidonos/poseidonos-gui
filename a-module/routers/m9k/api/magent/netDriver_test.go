package magent

import (
	"a-module/routers/m9k/api/magent/mocks"
	"a-module/routers/m9k/model"
	"reflect"
	"testing"
)

func TestGetNetDriver(t *testing.T) {
	var tests = []struct {
		input    model.MAgentParam
		expected interface{}
		err      error
	}{
		{
			input: model.MAgentParam{},
			expected: NetDriverFields{
				{
					Interface: "interface",
					Driver:    "driver",
				},
			},
			err: nil,
		},
	}

	IDBClient = mocks.MockInfluxClient{}
	for _, test := range tests {
		result, err := GetNetDriver(test.input)
		output := result.Result.Data
		if !reflect.DeepEqual(output, test.expected) || err != test.err {
			t.Errorf("Test Failed: %v inputted, %v expected, received: %v, received err: %v", test.input, test.expected, output, err)
		}
	}

}
