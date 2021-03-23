package util

import (
	"bytes"
	"encoding/json"
	"fmt"
	"magent/src/models"
)

func FormatAIRJSON(buf []byte, points *[]models.AIRPoint) error {
	var airData map[string]interface{}
	buf = bytes.TrimSpace(buf)
	buf = bytes.TrimPrefix(buf, []byte("\xef\xbb\xbf"))
	err := json.Unmarshal(buf, &airData)
	if err != nil {
		return err
	}
	arrayId := "0"
	timestamp := airData["timestamp"]
	node := airData["group"].(map[string]interface{})["Mgmt"].(map[string]interface{})["node"].(map[string]interface{})
	writeLatency := node["LAT_BDEV_WRITE"].(map[string]interface{})["objs"].([]interface{})
	readLatency := node["LAT_BDEV_READ"].(map[string]interface{})["objs"].([]interface{})
	readBandwidth := node["PERF_VOLUME"].(map[string]interface{})["objs"].([]interface{})
	writeBandwidth := node["PERF_VOLUME"].(map[string]interface{})["objs"].([]interface{})
	readIOPS := node["PERF_VOLUME"].(map[string]interface{})["objs"].([]interface{})
	writeIOPS := node["PERF_VOLUME"].(map[string]interface{})["objs"].([]interface{})
	valMap := make(map[string]map[string]interface{})
	parseData(writeLatency, "mean", "write_latency", &valMap)
	parseData(readLatency, "mean", "read_latency", &valMap)
	parseData(writeBandwidth, "bw_write", "write_bw", &valMap)
	parseData(readBandwidth, "bw_read", "read_bw", &valMap)
	parseData(writeIOPS, "iops_write", "write_iops", &valMap)
	parseData(readIOPS, "iops_read", "read_iops", &valMap)
	for k, v := range valMap {
		airPoint := models.AIRPoint{}
		airPoint.Tags = map[string]string{
			"vol_id": k,
			"arr_id": arrayId,
		}
		airPoint.Timestamp = timestamp.(float64)
		airPoint.Fields = v
		*points = append(*points, airPoint)
	}
	return err
}

func parseData(data []interface{}, dataKey, mapKey string, valMap *map[string]map[string]interface{}) error {
	for i := 0; i < len(data); i++ {
		d := data[i].(map[string]interface{})
		volId := fmt.Sprintf("%.0f", d["app_id"])
		if val, ok := (*valMap)[volId]; ok {
			if _, valOK := val[mapKey]; valOK {
				(*valMap)[volId][mapKey] = (val[mapKey].(float64) + d[dataKey].(float64))
			} else {
				(*valMap)[volId][mapKey] = d[dataKey]
			}
		} else {
			(*valMap)[volId] = map[string]interface{}{}
			(*valMap)[volId][mapKey] = d[dataKey]
		}
	}
	return nil
}
