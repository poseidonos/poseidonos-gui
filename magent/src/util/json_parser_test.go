package util

import (
	"fmt"
	"testing"
)

var jsonData = "{\"group\": {\"GC\": {\"group_id\": 3, \"node\": {\"PERF_COPY\": {\"build\": false, \"node_id\": 9, \"objs\": [], \"run\": false, \"type\": \"performance\"}}}, \"MFS\": {\"group_id\": 1, \"node\": {\"PERF_METAFS_IO\": {\"build\": false, \"node_id\": 3, \"objs\": [], \"run\": false, \"type\": \"performance\"}}}, \"Mgmt\": {\"group_id\": 0, \"node\": {\"LAT_BDEV_READ\": {\"build\": true, \"node_id\": 1, \"objs\": [], \"run\": true, \"type\": \"latency\"}, \"LAT_BDEV_WRITE\": {\"build\": true, \"node_id\": 2, \"objs\": [{\"app_id\": 10, \"bucket_cnt\": 5, \"low_qt\": 685573, \"max\": 5262695, \"mean\": 1624023, \"median\": 1531668, \"min\": 203399, \"sample_cnt\": 141, \"target_id\": null, \"target_name\": \"0-1\", \"total_low_qt\": 685573, \"total_max\": 5262695, \"total_mean\": 1624023, \"total_median\": 1531668, \"total_min\": 203399, \"total_sample_cnt\": 141, \"total_up_qt\": 2618187, \"up_qt\": 2618187}], \"run\": true, \"type\": \"latency\"}, \"PERF_VOLUME\": {\"build\": true, \"node_id\": 0, \"objs\": [{\"app_id\": 10, \"bw_read\": 0, \"bw_read_avg\": 0, \"bw_total\": 7970304, \"bw_write\": 7970304, \"bw_write_avg\": 7970304, \"cnt_1\": \"512(sz)-15567(cnt)\", \"iops_read\": 0, \"iops_read_avg\": 0, \"iops_total\": 15567, \"iops_write\": 15567, \"iops_write_avg\": 15567, \"target_id\": 63179, \"target_name\": \"reactor_0\"}], \"run\": true, \"type\": \"performance\"}}}, \"POS_Q\": {\"group_id\": 2, \"node\": {\"Q_AIO\": {\"build\": false, \"node_id\": 4, \"objs\": [], \"run\": false, \"type\": \"queue\"}, \"Q_EVENT\": {\"build\": false, \"node_id\": 7, \"objs\": [], \"run\": false, \"type\": \"queue\"}, \"Q_IO\": {\"build\": false, \"node_id\": 8, \"objs\": [], \"run\": false, \"type\": \"queue\"}, \"Q_NVRAM\": {\"build\": false, \"node_id\": 5, \"objs\": [], \"run\": false, \"type\": \"queue\"}, \"Q_SSD\": {\"build\": false, \"node_id\": 6, \"objs\": [], \"run\": false, \"type\": \"queue\"}}}}, \"interval\": 1, \"play\": true, \"timestamp\": 1615814097}\n"

func TestJSONParse(t *testing.T) {
	fields := map[string]interface{}{}
	tags := map[string]string{}
	Parse([]byte(jsonData), &fields, &tags)
	invalidJSON := `{"group": }`
	Parse([]byte(invalidJSON), &fields, &tags)
	err := Parse([]byte(`"Just a string"`), &fields, &tags)
	fmt.Println(err)
	err = Parse([]byte(`{"test": 0xFF}`), &fields, &tags)
	fmt.Println(err)
}
