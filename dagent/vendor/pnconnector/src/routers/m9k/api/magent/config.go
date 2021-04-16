package magent

import "pnconnector/src/errors"

var DBName = "poseidon"
var DBAddress = "http://127.0.0.1:8086"
var AggTime = []string{"7d", "30d"}
var AggRP = "agg_rp"
var DefaultRP = "default_rp"
var TimeGroupsDefault = map[string]string{
	"1m":  "1s",
	"5m":  "1s",
	"15m": "1m",
	"1h":  "1m",
	"6h":  "1m",
	"12h": "5m",
	"24h": "10m",
	"7d":  "1h",
	"30d": "6h",
	"60d": "60d",
}

var (
	LatencyField   = "sid_arr_0_mean"
	BWReadField    = "bw_read"
	BWWriteField   = "bw_write"
	IOPSReadField  = "iops_read"
	IOPSWriteField = "iops_write"
	MeanFieldKey   = "mean"
	PerfFieldKey   = "perf"
	LatFieldKey    = "lat_"
)

var (
	errConnInfluxDB = errors.New("could not connect to Influxdb")
	errQuery        = errors.New("could not query to database")
	errQueryCode    = 21000
	errData         = errors.New("no data available")
	errDataCode     = 20313
	errEndPoint     = errors.New("use time from 1m,5m,15m,1h,6h,12h,24h,7d,30d")
	errEndPointCode = 21010
)

var VolumeQuery = "SELECT * from %s.%s.volumes where volid=%s order by time desc limit 1"

var netAggRPQ = "SELECT bytes_recv AS mean_bytes_recv , bytes_sent AS mean_bytes_sent, drop_in AS mean_drop_in, drop_out AS mean_drop_out, err_in AS mean_err_in, err_out AS mean_err_out, packets_recv AS mean_packets_recv, packets_sent AS mean_packets_sent  FROM %s.%s.mean_net WHERE time > now() - %s"
var netDefaultRPQ = "SELECT mean(bytes_recv) ,mean(bytes_sent), mean(drop_in), mean(drop_out), mean(err_in), mean(err_out), mean(packets_recv), mean(packets_sent)  FROM %s.%s.net WHERE time > now() - %s GROUP BY time(%s)"
var netLastRecordQ = "SELECT last(bytes_recv), last(bytes_sent), last(drop_in), last(drop_out), last(err_in), last(err_out), last(packets_recv), last(packets_sent)  FROM %s.%s.net LIMIT 1"
var netAddQ = "SELECT time, \"name\", address FROM %s.autogen.ethernet"
var netDriverQ = "SELECT time, \"name\", driver FROM %s.autogen.ethernet"
var cpuAggRPQ = "SELECT usage_user AS mean_usage_user FROM %s.%s.mean_cpu WHERE time > now() - %s"
var cpuDefaultRPQ = "SELECT mean(usage_user) AS mean_usage_user FROM %s.%s.cpu WHERE time > now() - %s GROUP BY time(%s)"
var cpuLastRecordQ = "SELECT last(usage_user) AS mean_usage_user FROM %s.%s.cpu LIMIT 1"
var diskAggRPQ = "SELECT used AS mean_used_bytes FROM %s.%s.mean_disk WHERE time > now() - %s"
var diskDefaultRPQ = "SELECT mean(used) AS mean_used_bytes FROM %s.%s.disk WHERE time > now() - %s GROUP BY time(%s)"
var diskLastRecordQ = "SELECT last(used) AS mean_used_bytes FROM %s.%s.disk LIMIT 1"
var memoryAggRPQ = "SELECT used_percent AS mean_used_percent FROM %s.%s.mean_mem WHERE time > now() - %s"
var memoryDefaultRPQ = "SELECT mean(used_percent) AS mean_used_percent FROM %s.%s.mem WHERE time > now() - %s GROUP BY time(%s)"
var memoryLastRecordQ = "SELECT last(used_percent) AS mean_used_percent FROM %s.%s.mem LIMIT 1"

var ReadBandwidthAggRPQVol = `SELECT read_bw as "bw" FROM "%s"."%s"."mean_air" WHERE time > now() - %s and time > %s FILL(null) and vol_id =~ %s and arr_id =~ %s`
var ReadBandwidthDefaultRPQVol = `SELECT mean(read_bw) as "bw", median(unixTimestamp) as timestamp FROM "%s"."%s"."air" WHERE time > now() - %s and time > %s and vol_id =~ %s and arr_id =~ %s GROUP BY time(%s) FILL(null)`
var ReadBandwidthLastRecordQVol = `SELECT read_bw as "bw", timestamp FROM "%s"."%s"."air" WHERE vol_id =~ %s and arr_id =~ %s order by time desc limit 1`

var ReadBandwidthAggRPQArr = `SELECT sum(read_bw) as "read_bw" FROM "%s"."%s"."mean_air" WHERE time > now() - %s and time > %s and arr_id =~ %s group by time(1s) FILL(null)`
var ReadBandwidthDefaultRPQArr = `SELECT mean(read_bw) FROM (SELECT sum(read_bw) as "read_bw" FROM "%s"."%s"."air" WHERE time > now() - %s and arr_id =~ %s group by time(1s) FILL(null)) group by time(%s)`
var ReadBandwidthLastRecordQArr = `SELECT read_bw FROM (SELECT sum(read_bw) as read_bw FROM "%s"."%s"."air" where time > now() - 5s and arr_id =~ %s group by time(1s)) order by time limit 1`

var WriteBandwidthAggRPQArr = `SELECT write_bw as "bw" FROM "%s"."%s"."mean_air" WHERE time > now() - %s and time > %s and arr_id =~ %s FILL(null)`
var WriteBandwidthDefaultRPQArr = `SELECT mean(write_bw) FROM (SELECT sum(write_bw) as "write_bw" FROM "%s"."%s"."air" WHERE time > now() - %s and arr_id =~ %s group by time(1s) FILL(null)) group by time(%s)`
var WriteBandwidthLastRecordQArr = `SELECT write_bw FROM (SELECT sum(write_bw) as write_bw FROM "%s"."%s"."air" where time > now() - 5s and arr_id =~ %s group by time(1s)) order by time limit 1`

var WriteBandwidthAggRPQVol = `SELECT write_bw as "bw" FROM "%s"."%s"."mean_air" WHERE time > now() - %s and time > %s FILL(null) and vol_id =~ %s and arr_id =~ %s`
var WriteBandwidthDefaultRPQVol = `SELECT mean(write_bw) as "bw", median(unixTimestamp) as timestamp FROM "%s"."%s"."air" WHERE time > now() - %s and time > %s and vol_id =~ %s and arr_id =~ %s GROUP BY time(%s) FILL(null)`
var WriteBandwidthLastRecordQVol = `SELECT write_bw as "bw", timestamp FROM "%s"."%s"."air" WHERE vol_id =~ %s and arr_id =~ %s order by time desc limit 1`

var ReadIOPSAggRPQArr = `SELECT read_iops as "iops" FROM "%s"."%s"."mean_air" WHERE time > now() - %s and time > %s and arr_id =~ %s FILL(null)`
var ReadIOPSDefaultRPQArr = `SELECT mean(read_iops) FROM (SELECT sum(read_iops) as "read_iops" FROM "%s"."%s"."air" WHERE time > now() - %s and arr_id =~ %s group by time(1s) FILL(null)) group by time(%s)`
var ReadIOPSLastRecordQArr = `SELECT read_iops FROM (SELECT sum(read_iops) as read_iops FROM "%s"."%s"."air" where time > now() - 5s and arr_id =~ %s group by time(1s)) order by time limit 1`

var ReadIOPSAggRPQVol = `SELECT read_iops as "iops" FROM "%s"."%s"."mean_air" WHERE time > now() - %s and time > %s FILL(null) and vol_id =~ %s and arr_id =~ %s`
var ReadIOPSDefaultRPQVol = `SELECT mean(read_iops) as "iops", median(unixTimestamp) as timestamp FROM "%s"."%s"."air" WHERE time > now() - %s and time > %s and vol_id =~ %s and arr_id =~ %s GROUP BY time(%s) FILL(null)`
var ReadIOPSLastRecordQVol = `SELECT read_iops as "iops", timestamp FROM "%s"."%s"."air" WHERE vol_id =~ %s and arr_id =~ %s order by time desc limit 1`

var WriteIOPSAggRPQArr = `SELECT write_iops as "iops" FROM "%s"."%s"."mean_air" WHERE time > now() - %s and time > %s and arr_id =~ %s FILL(null)`
var WriteIOPSDefaultRPQArr = `SELECT mean(write_iops) FROM (SELECT sum(write_iops) as "write_iops" FROM "%s"."%s"."air" WHERE time > now() - %s and arr_id =~ %s group by time(1s) FILL(null)) group by time(%s)`
var WriteIOPSLastRecordQArr = `SELECT write_iops FROM (SELECT sum(write_iops) as write_iops FROM "%s"."%s"."air" where time > now() - 5s and arr_id =~ %s group by time(1s)) order by time limit 1`

var WriteIOPSAggRPQVol = `SELECT write_iops as "iops" FROM "%s"."%s"."mean_air" WHERE time > now() - %s and time > %s FILL(null) and vol_id =~ %s and arr_id =~ %s`
var WriteIOPSDefaultRPQVol = `SELECT mean(write_iops) as "iops", median(unixTimestamp) as timestamp FROM "%s"."%s"."air" WHERE time > now() - %s and time > %s and vol_id =~ %s and arr_id =~ %s GROUP BY time(%s) FILL(null)`
var WriteIOPSLastRecordQVol = `SELECT write_iops as "iops", timestamp FROM "%s"."%s"."air" WHERE vol_id =~ %s and arr_id =~ %s order by time desc limit 1`

var LatencyAggRPQArr = `SELECT write_latency as "latency" FROM "%s"."%s"."mean_air" WHERE time > now() - %s and time > %s and arr_id =~ %s FILL(null)`
var LatencyDefaultRPQArr = `SELECT mean(write_latency) FROM (SELECT sum(write_latency) as "write_latency" FROM "%s"."%s"."air" WHERE time > now() - %s and arr_id =~ %s group by time(1s) FILL(null)) group by time(%s)`
var LatencyLastRecordQArr = `SELECT write_latency FROM (SELECT sum(write_latency) as write_latency FROM "%s"."%s"."air" where time > now() - 5s and arr_id =~ %s group by time(1s)) order by time limit 1`

var LatencyAggRPQVol = `SELECT write_latency as "latency" FROM "%s"."%s"."mean_air" WHERE time > now() - %s and time > %s FILL(null) and vol_id =~ %s and arr_id =~ %s`
var LatencyDefaultRPQVol = `SELECT mean(write_latency) as "latency", median(unixTimestamp) as timestamp FROM "%s"."%s"."air" WHERE time > now() - %s and time > %s and vol_id =~ %s and arr_id =~ %s GROUP BY time(%s) FILL(null)`
var LatencyLastRecordQVol = `SELECT write_latency as "latency", timestamp FROM "%s"."%s"."air" WHERE vol_id =~ %s and arr_id =~ %s order by time desc limit 1`
var RebuildingLogQ = `SELECT "value" FROM "%s"."autogen"."rebuilding_status" WHERE time > now() - %s`
