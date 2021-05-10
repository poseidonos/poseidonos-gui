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
	"encoding/json"
	"fmt"
	"pnconnector/src/routers/m9k/model"
	"pnconnector/src/util"
	"strconv"
	"strings"
)

// GetAIRData fetches AIR data from influx db based on time parameter and returns the values and fields
func GetAIRData(param interface{}, AggRPQ, DefaultRPQ, LastRecordQ, startingTime string, volumeIds string, arrayId string) ([][]interface{}, []string, int) {
	var query string
	paramStruct := param.(model.MAgentParam)
	if paramStruct.Time != "" {
		timeInterval := param.(model.MAgentParam).Time
		if _, found := TimeGroupsDefault[timeInterval]; !found {
			return nil, nil, errEndPointCode
		}
		if Contains(AggTime, timeInterval) {
			if volumeIds== "" {
				query = fmt.Sprintf(AggRPQ, DBName, AggRP, timeInterval, startingTime, arrayId)
			} else {
				query = fmt.Sprintf(AggRPQ, DBName, AggRP, timeInterval, startingTime, volumeIds, arrayId)
			}
		} else {
			if volumeIds == "" {
				query = fmt.Sprintf(DefaultRPQ, DBName, DefaultRP, timeInterval, arrayId, TimeGroupsDefault[timeInterval])
			} else {
				query = fmt.Sprintf(DefaultRPQ, DBName, DefaultRP, timeInterval, startingTime, volumeIds, arrayId, TimeGroupsDefault[timeInterval])
			}
		}

	} else {
		if volumeIds == "" {
			query = fmt.Sprintf(LastRecordQ, DBName, DefaultRP, arrayId)
		} else {
			query = fmt.Sprintf(LastRecordQ, DBName, DefaultRP, volumeIds, arrayId)
		}
	}
  fmt.Println("query ",query)
	result, err := ExecuteQuery(query)
	if err != nil {
		return nil, nil, errQueryCode
	}

	if len(result) == 0 || len(result[0].Series) == 0 {
		return nil, nil, 0
	}
	return result[0].Series[0].Values, result[0].Series[0].Columns, 0
}

// extractValues contains the parsing logic for extracting array level and volume level data
func extractValues(values [][]interface{}, columns []string, key, metrics, metricOps string) []map[string]interface{} {
	result := []map[string]interface{}{}
	for _, val := range values {
		currentValue := make(map[string]interface{})
		currentValue["time"] = val[0]
		if val[1] == nil {
			val[1] = json.Number(strconv.FormatInt(0, 10))
		}
		currentValue[key] = val[1].(json.Number)
		result = append(result, currentValue)
	}
	return result
}

func getVolumeCreationTime(volumeId string) string {
	volQuery := fmt.Sprintf(VolumeQuery, DBName, DefaultRP, volumeId)
	result, err := ExecuteQuery(volQuery)
	if err != nil || len(result) == 0 || len(result[0].Series) == 0 {
		return "0"
	}
	for index, column := range result[0].Series[0].Columns {
		if column == "time" {
			return string(result[0].Series[0].Values[index][0].(json.Number))
		}
	}
	return "0"
}
func parseIds(param interface{}) (string, string) {
  volumeIds := param.(model.MAgentParam).VolumeIds
  arrayIds := param.(model.MAgentParam).ArrayIds
  arrayIds = strings.ReplaceAll(arrayIds, ",", "|")
  arrayIds = "/"+arrayIds+"/"
  if volumeIds != "" {
    volumeIds = strings.ReplaceAll(volumeIds, ",", "|")
    volumeIds = "/"+volumeIds+"/"
  }
  return arrayIds, volumeIds

}
// GetReadBandwidth returns metrics related to Read Bandwidth
func GetReadBandwidth(param interface{}) (model.Response, error) {
	var result model.Response
	var values [][]interface{}
	var columns []string
	var statusCode int
  arrayIds, volumeIds := parseIds(param)
  startingTime := getVolumeCreationTime(volumeIds)
	if volumeIds == "" {
		values, columns, statusCode = GetAIRData(param, ReadBandwidthAggRPQArr, ReadBandwidthDefaultRPQArr, ReadBandwidthLastRecordQArr, startingTime, volumeIds, arrayIds)
	} else {
		values, columns, statusCode = GetAIRData(param, ReadBandwidthAggRPQVol, ReadBandwidthDefaultRPQVol, ReadBandwidthLastRecordQVol, startingTime, volumeIds, arrayIds)
	}
	result.Result.Status, _ = util.GetStatusInfo(statusCode)
	if statusCode != 0 {
		result.Result.Data = make([]string, 0)
		return result, nil
	}
	res := extractValues(values, columns, "bw", "bw", BWReadField)
	result.Result.Data = res
	return result, nil
}

// GetWriteBandwidth returns the metrics related to Write Bandwidth
func GetWriteBandwidth(param interface{}) (model.Response, error) {
	var result model.Response
	var values [][]interface{}
	var columns []string
	var statusCode int
  arrayIds, volumeIds := parseIds(param)
	startingTime := getVolumeCreationTime(volumeIds)
	if volumeIds == "" {
		values, columns, statusCode = GetAIRData(param, WriteBandwidthAggRPQArr, WriteBandwidthDefaultRPQArr, WriteBandwidthLastRecordQArr, startingTime, volumeIds, arrayIds)
	} else {
		values, columns, statusCode = GetAIRData(param, WriteBandwidthAggRPQVol, WriteBandwidthDefaultRPQVol, WriteBandwidthLastRecordQVol, startingTime, volumeIds, arrayIds)
	}
	result.Result.Status, _ = util.GetStatusInfo(statusCode)
	if statusCode != 0 {
		result.Result.Data = make([]string, 0)
		return result, nil
	}
	res := extractValues(values, columns, "bw", "bw", BWWriteField)
	result.Result.Data = res
	return result, nil
}

// GetReadIOPS returns the metrics related to Read IOPS
func GetReadIOPS(param interface{}) (model.Response, error) {
	var result model.Response
	var values [][]interface{}
	var columns []string
	var statusCode int
  arrayIds, volumeIds := parseIds(param)
	startingTime := getVolumeCreationTime(volumeIds)
	if volumeIds == "" {
		values, columns, statusCode = GetAIRData(param, ReadIOPSAggRPQArr, ReadIOPSDefaultRPQArr, ReadIOPSLastRecordQArr, startingTime, volumeIds, arrayIds)
	} else {
		values, columns, statusCode = GetAIRData(param, ReadIOPSAggRPQVol, ReadIOPSDefaultRPQVol, ReadIOPSLastRecordQVol, startingTime, volumeIds, arrayIds)
	}
	result.Result.Status, _ = util.GetStatusInfo(statusCode)
	if statusCode != 0 {
		result.Result.Data = make([]string, 0)
		return result, nil
	}
	res := extractValues(values, columns, "iops", "iops", IOPSReadField)
	result.Result.Data = res
	return result, nil
}

// GetWriteIOPS returns the metrics related to Write IOPS
func GetWriteIOPS(param interface{}) (model.Response, error) {
	var result model.Response
	var values [][]interface{}
	var columns []string
	var statusCode int
  arrayIds, volumeIds := parseIds(param)
	startingTime := getVolumeCreationTime(volumeIds)
	if volumeIds == "" {
		values, columns, statusCode = GetAIRData(param, WriteIOPSAggRPQArr, WriteIOPSDefaultRPQArr, WriteIOPSLastRecordQArr, startingTime, volumeIds, arrayIds)
	} else {
		values, columns, statusCode = GetAIRData(param, WriteIOPSAggRPQVol, WriteIOPSDefaultRPQVol, WriteIOPSLastRecordQVol, startingTime, volumeIds, arrayIds)
	}
	result.Result.Status, _ = util.GetStatusInfo(statusCode)
	if statusCode != 0 {
		result.Result.Data = make([]string, 0)
		result.Result.Status, _ = util.GetStatusInfo(statusCode)
		return result, nil
	}
	res := extractValues(values, columns, "iops", "iops", IOPSWriteField)
	result.Result.Data = res
	return result, nil
}

// GetLatency collects the latency metrics from influxdb
func GetLatency(param interface{}) (model.Response, error) {
	var result model.Response
	var values [][]interface{}
	var columns []string
	var statusCode int
  arrayIds, volumeIds := parseIds(param)
	startingTime := getVolumeCreationTime(volumeIds)
	if volumeIds == "" {
		values, columns, statusCode = GetAIRData(param, LatencyAggRPQArr, LatencyDefaultRPQArr, LatencyLastRecordQArr, startingTime, volumeIds, arrayIds)
	} else {
		values, columns, statusCode = GetAIRData(param, LatencyAggRPQVol, LatencyDefaultRPQVol, LatencyLastRecordQVol, startingTime, volumeIds, arrayIds)
	}
	result.Result.Status, _ = util.GetStatusInfo(statusCode)
	if statusCode != 0 {
		result.Result.Data = make([]string, 0)
		return result, nil
	}
	res := extractValues(values, columns, "latency", "latency", LatencyField)
	result.Result.Data = res
	return result, nil
}
