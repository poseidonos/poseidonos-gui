package magent

import (
	"a-module/src/routers/m9k/api/magent/mocks"
	"a-module/src/routers/m9k/model"
	"encoding/json"
	"reflect"
	"testing"
)

func TestGetReadBandwidth(t *testing.T) {
	var tests = []struct {
		input    model.MAgentParam
		expected interface{}
		err      error
	}{
		{
			input: model.MAgentParam{
				Level: "array",
			},
			expected: []map[string]interface{}{
				{"BW": json.Number("300"), "Time": "1589872050483860738"},
			},
			err: nil,
		},
		{
			input: model.MAgentParam{
				Time:  "15m",
				Level: "array",
			},
			expected: []map[string]interface{}{
				{"BW": json.Number("300"), "Time": "1589872050483860738"},
				{"BW": json.Number("700"), "Time": "1589872050483870738"},
			},
			err: nil,
		},
		{
			input: model.MAgentParam{
				Time:  "15m",
				Level: "0",
			},
			expected: []map[string]interface{}{
				{"BW": json.Number("100"), "Time": "1589872050483860738"},
				{"BW": json.Number("700"), "Time": "1589872050483870738"},
			},
			err: nil,
		},
		{
			input: model.MAgentParam{
				Time:  "30d",
				Level: "0",
			},
			expected: []map[string]interface{}{
				{"BW": json.Number("100"), "Time": "1589872050483860738"},
				{"BW": json.Number("700"), "Time": "1589872050483870738"},
			},
			err: nil,
		},
		{
			input: model.MAgentParam{
				Time:  "5m",
				Level: "0",
			},
			expected: nil,
			err:      nil,
		},
		{
			input: model.MAgentParam{
				Time:  "20m",
				Level: "0",
			},
			expected: nil,
			err:      nil,
		},
	}

	IDBClient = mocks.MockInfluxClient{}
	for _, test := range tests {
		result, err := GetReadBandwidth(test.input)
		output := result.Result.Data
		if !reflect.DeepEqual(output, test.expected) || err != test.err {
			t.Errorf("Test Failed: %v inputted, %v expected, received: %v, received err: %v", test.input, test.expected, output, err)
		}
	}
}

func TestGetWriteBandwidth(t *testing.T) {
	var tests = []struct {
		input    model.MAgentParam
		expected interface{}
		err      error
	}{
		{
			input: model.MAgentParam{
				Level: "array",
			},
			expected: []map[string]interface{}{
				{"BW": json.Number("300"), "Time": "1589872050483860738"},
			},
			err: nil,
		},
		{
			input: model.MAgentParam{
				Time:  "15m",
				Level: "array",
			},
			expected: []map[string]interface{}{
				{"BW": json.Number("300"), "Time": "1589872050483860738"},
				{"BW": json.Number("700"), "Time": "1589872050483870738"},
			},
			err: nil,
		},
		{
			input: model.MAgentParam{
				Time:  "15m",
				Level: "0",
			},
			expected: []map[string]interface{}{
				{"BW": json.Number("100"), "Time": "1589872050483860738"},
				{"BW": json.Number("700"), "Time": "1589872050483870738"},
			},
			err: nil,
		},

		{
			input: model.MAgentParam{
				Time:  "5m",
				Level: "0",
			},
			expected: nil,
			err:      nil,
		},
	}

	IDBClient = mocks.MockInfluxClient{}
	for _, test := range tests {
		result, err := GetWriteBandwidth(test.input)
		output := result.Result.Data
		if !reflect.DeepEqual(output, test.expected) || err != test.err {
			t.Errorf("Test Failed: %v inputted, %v expected, received: %v, received err: %v", test.input, test.expected, output, err)
		}
	}
}

func TestGetReadIOPS(t *testing.T) {
	var tests = []struct {
		input    model.MAgentParam
		expected interface{}
		err      error
	}{
		{
			input: model.MAgentParam{
				Level: "array",
			},
			expected: []map[string]interface{}{
				{"IOPS": json.Number("300"), "Time": "1589872050483860738"},
			},
			err: nil,
		},
		{
			input: model.MAgentParam{
				Time:  "15m",
				Level: "array",
			},
			expected: []map[string]interface{}{
				{"IOPS": json.Number("300"), "Time": "1589872050483860738"},
				{"IOPS": json.Number("700"), "Time": "1589872050483870738"},
			},
			err: nil,
		},
		{
			input: model.MAgentParam{
				Time:  "15m",
				Level: "0",
			},
			expected: []map[string]interface{}{
				{"IOPS": json.Number("100"), "Time": "1589872050483860738"},
				{"IOPS": json.Number("700"), "Time": "1589872050483870738"},
			},
			err: nil,
		},

		{
			input: model.MAgentParam{
				Time:  "5m",
				Level: "0",
			},
			expected: nil,
			err:      nil,
		},
	}

	IDBClient = mocks.MockInfluxClient{}
	for _, test := range tests {
		result, err := GetReadIOPS(test.input)
		output := result.Result.Data
		if !reflect.DeepEqual(output, test.expected) || err != test.err {
			t.Errorf("Test Failed: %v inputted, %v expected, received: %v, received err: %v", test.input, test.expected, output, err)
		}
	}
}

func TestGetWriteIOPS(t *testing.T) {
	var tests = []struct {
		input    model.MAgentParam
		expected interface{}
		err      error
	}{
		{
			input: model.MAgentParam{
				Level: "array",
			},
			expected: []map[string]interface{}{
				{"IOPS": json.Number("300"), "Time": "1589872050483860738"},
			},
			err: nil,
		},
		{
			input: model.MAgentParam{
				Time:  "15m",
				Level: "array",
			},
			expected: []map[string]interface{}{
				{"IOPS": json.Number("300"), "Time": "1589872050483860738"},
				{"IOPS": json.Number("700"), "Time": "1589872050483870738"},
			},
			err: nil,
		},
		{
			input: model.MAgentParam{
				Time:  "15m",
				Level: "0",
			},
			expected: []map[string]interface{}{
				{"IOPS": json.Number("100"), "Time": "1589872050483860738"},
				{"IOPS": json.Number("700"), "Time": "1589872050483870738"},
			},
			err: nil,
		},

		{
			input: model.MAgentParam{
				Time:  "5m",
				Level: "0",
			},
			expected: nil,
			err:      nil,
		},
	}

	IDBClient = mocks.MockInfluxClient{}
	for _, test := range tests {
		result, err := GetWriteIOPS(test.input)
		output := result.Result.Data
		if !reflect.DeepEqual(output, test.expected) || err != test.err {
			t.Errorf("Test Failed: %v inputted, %v expected, received: %v, received err: %v", test.input, test.expected, output, err)
		}
	}
}

func TestGetLatency(t *testing.T) {
	var tests = []struct {
		input    model.MAgentParam
		expected interface{}
		err      error
	}{
		{
			input: model.MAgentParam{
				Level: "array",
			},
			expected: []map[string]interface{}{
				{"Latency": json.Number("300"), "Time": "1589872050483860738"},
			},
			err: nil,
		},
		{
			input: model.MAgentParam{
				Time:  "15m",
				Level: "array",
			},
			expected: []map[string]interface{}{
				{"Latency": json.Number("300"), "Time": "1589872050483860738"},
				{"Latency": json.Number("700"), "Time": "1589872050483870738"},
			},
			err: nil,
		},
		{
			input: model.MAgentParam{
				Time:  "15m",
				Level: "0",
			},
			expected: []map[string]interface{}{
				{"Latency": json.Number("100"), "Time": "1589872050483860738"},
				{"Latency": json.Number("700"), "Time": "1589872050483870738"},
			},
			err: nil,
		},

		{
			input: model.MAgentParam{
				Time: "5m",
			},
			expected: nil,
			err:      nil,
		},
	}

	IDBClient = mocks.MockInfluxClient{}
	for _, test := range tests {
		result, err := GetLatency(test.input)
		output := result.Result.Data
		if !reflect.DeepEqual(output, test.expected) || err != test.err {
			t.Errorf("Test Failed: %v inputted, %v expected, received: %v, received err: %v", test.input, test.expected, output, err)
		}
	}
}
