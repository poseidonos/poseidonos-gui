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
 *     * Neither the name of Intel Corporation nor the names of its
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

package util

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
