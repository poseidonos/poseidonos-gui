/*In this code we are using gin framework and influxdb golang client libraries
Gin is a web framework written in Go (Golang). It features a martini-like API with performance that is up to 40 times faster than other frameworks


DESCRIPTION: This file contains the code for AIR related data from influxdb
NAME : airMetrics.go
@AUTHORS: Aswin K K
@Version : 1.0 *
@REVISION HISTORY
[6/26/2020] [aswin.kk] : Code for Bandwidth, IOPS and Latency Added

*/

package magent

import (
	"a-module/src/routers/m9k/model"
	"encoding/json"
	"fmt"
	"regexp"
	"strconv"
)

// GetAIRData fetches AIR data from influx db based on time parameter and returns the values and fields
func GetAIRData(param interface{}, AggRPQ, DefaultRPQ, LastRecordQ string) ([][]interface{}, []string, error) {
	var query string
	paramStruct := param.(model.MAgentParam)
	if paramStruct.Time != "" {
		timeInterval := param.(model.MAgentParam).Time
		if _, found := TimeGroupsDefault[timeInterval]; !found {
			return nil, nil, errEndPoint
		}
		if Contains(AggTime, timeInterval) {
			query = fmt.Sprintf(AggRPQ, AggRP, timeInterval)
		} else {
			query = fmt.Sprintf(DefaultRPQ, DefaultRP, timeInterval, TimeGroupsDefault[timeInterval])
		}

	} else {
		query = fmt.Sprintf(LastRecordQ, DefaultRP)
	}
	result, err := ExecuteQuery(query)
	if err != nil {
		return nil, nil, err
	}

	if len(result) == 0 || len(result[0].Series) == 0 {
		return nil, nil, errData
	}
	return result[0].Series[0].Values, result[0].Series[0].Columns, nil
}

// extractValues contains the parsing logic for extracting array level and volume level data
func extractValues(values [][]interface{}, columns []string, key, metrics, metricOps, level string) []map[string]interface{} {
	result := []map[string]interface{}{}
	valueIndexes := []int{}
	if level == "array" {
		for index, col := range columns {
			if match, _ := regexp.MatchString(".*aid$", col); !match && col != "time" {
				valueIndexes = append(valueIndexes, index)
			}
		}
		for _, val := range values {
			currentValue := make(map[string]interface{})
			currentValue["Time"] = val[0]
			sum := 0.0
			for _, valIndex := range valueIndexes {
				if val[valIndex] != nil {
					v, _ := val[valIndex].(json.Number).Float64()
					sum += v
				}
			}
			currentValue[key] = json.Number(strconv.FormatFloat(sum, 'f', -1, 64))
			result = append(result, currentValue)
		}
	} else {
		indexMap := make(map[string]int)
		aidArr := []string{}
		volID, err := strconv.Atoi(level)
		if err != nil {
			return result
		}
		for index, col := range columns {
			indexMap[col] = index
			if match, _ := regexp.MatchString(".*aid$", col); match {
				aidArr = append(aidArr, col)
			}
		}
		for _, val := range values {
			currentValue := make(map[string]interface{})
			currentValue["Time"] = val[0]
			sum := 0.0
			for _, aid := range aidArr {
				if _, ok := indexMap[aid]; ok && val[indexMap[aid]] != nil {
					if idx, err := val[indexMap[aid]].(json.Number).Int64(); err == nil && idx == int64(volID) {
						fieldKey := "mean" + aid[len(metrics):(len(aid)-len("aid"))] + metricOps
						if _, ok = indexMap[fieldKey]; ok && val[indexMap[fieldKey]] != nil {
							v, _ := val[indexMap[fieldKey]].(json.Number).Float64()
							sum += v
						}
					}
				}
			}
			currentValue[key] = json.Number(strconv.FormatFloat(sum, 'f', -1, 64))
			result = append(result, currentValue)
		}
	}
	return result
}

// GetReadBandwidth returns metrics related to Read Bandwidth
func GetReadBandwidth(param interface{}) (model.Response, error) {
	var result model.Response
	level := param.(model.MAgentParam).Level
	values, columns, err := GetAIRData(param, ReadBandwidthAggRPQ, ReadBandwidthDefaultRPQ, ReadBandwidthLastRecordQ)
	if err != nil {
		result.Result.Status.Description = err.Error()
		return result, nil
	}
	res := extractValues(values, columns, "BW", "bw", "bw_read", level)
	result.Result.Status.Code = 0
	result.Result.Status.Description = "DONE"
	result.Result.Data = res
	return result, nil
}

// GetWriteBandwidth returns the metrics related to Write Bandwidth
func GetWriteBandwidth(param interface{}) (model.Response, error) {
	var result model.Response
	level := param.(model.MAgentParam).Level
	values, columns, err := GetAIRData(param, WriteBandwidthAggRPQ, WriteBandwidthDefaultRPQ, WriteBandwidthLastRecordQ)
	if err != nil {
		result.Result.Status.Description = err.Error()
		return result, nil
	}
	res := extractValues(values, columns, "BW", "bw", "bw_write", level)
	result.Result.Status.Code = 0
	result.Result.Status.Description = "DONE"
	result.Result.Data = res
	return result, nil
}

// GetReadIOPS returns the metrics related to Read IOPS
func GetReadIOPS(param interface{}) (model.Response, error) {
	var result model.Response
	level := param.(model.MAgentParam).Level
	values, columns, err := GetAIRData(param, ReadIOPSAggRPQ, ReadIOPSDefaultRPQ, ReadIOPSLastRecordQ)
	if err != nil {
		result.Result.Status.Description = err.Error()
		return result, nil
	}
	res := extractValues(values, columns, "IOPS", "iops", "iops_read", level)
	result.Result.Status.Code = 0
	result.Result.Status.Description = "DONE"
	result.Result.Data = res
	return result, nil
}

// GetWriteIOPS returns the metrics related to Write IOPS
func GetWriteIOPS(param interface{}) (model.Response, error) {
	var result model.Response
	level := param.(model.MAgentParam).Level
	values, columns, err := GetAIRData(param, WriteIOPSAggRPQ, WriteIOPSDefaultRPQ, WriteIOPSLastRecordQ)
	if err != nil {
		result.Result.Status.Description = err.Error()
		return result, nil
	}
	res := extractValues(values, columns, "IOPS", "iops", "iops_write", level)
	result.Result.Status.Code = 0
	result.Result.Status.Description = "DONE"
	result.Result.Data = res
	return result, nil
}

// GetLatency collects the latency metrics from influxdb
func GetLatency(param interface{}) (model.Response, error) {
	var result model.Response
	level := param.(model.MAgentParam).Level
	values, columns, err := GetAIRData(param, LatencyAggRPQ, LatencyDefaultRPQ, LatencyLastRecordQ)
	if err != nil {
		result.Result.Status.Description = err.Error()
		return result, nil
	}
	res := extractValues(values, columns, "Latency", "latency", "timelag_arr_0_mean", level)
	result.Result.Status.Code = 0
	result.Result.Status.Description = "DONE"
	result.Result.Data = res
	return result, nil
}
