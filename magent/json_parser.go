package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"strconv"
)

//Parse function parses the byte array in JSON format to InfluxDB line protocol
func Parse(buf []byte, fields *map[string]interface{}, tags *map[string]string) error {
	buf = bytes.TrimSpace(buf)
	buf = bytes.TrimPrefix(buf, []byte("\xef\xbb\xbf"))
	var data interface{}
	err := json.Unmarshal(buf, &data)
	if err != nil {
		return err
	}
	switch v := data.(type) {
	case map[string]interface{}:
		return parseObject("", v, fields, tags)
	default:
		return errors.New("Must be an object or an array of objects")
	}
}

func parseObject(fieldname string, data interface{}, fields *map[string]interface{}, tags *map[string]string) error {
	switch t := data.(type) {
	case map[string]interface{}:
		for k, v := range t {
			fieldkey := k
			if fieldname != "" {
				fieldkey = fieldname + "_" + fieldkey
			}

			err := parseObject(fieldkey, v, fields, tags)
			if err != nil {
				return err
			}
		}
	case []interface{}:
		for i, v := range t {
			fieldkey := strconv.Itoa(i)
			if fieldname != "" {
				fieldkey = fieldname + "_" + fieldkey
			}
			err := parseObject(fieldkey, v, fields, tags)
			if err != nil {
				return nil
			}
		}
	case float64:
		(*fields)[fieldname] = t
	case string:
		(*fields)[fieldname] = data.(string)
	case bool:
		(*fields)[fieldname] = data.(bool)
	case nil:
		return nil
	default:
		return fmt.Errorf("JSON Flattener: got unexpected type %T with value %v (%s)",
			t, t, fieldname)
	}
	return nil
}
