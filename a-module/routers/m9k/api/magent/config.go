package magent

import "a-module/errors"

var DBName = "mtool_db"
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
}

var (
	errConnInfluxDB = errors.New("could not connect to Influxdb")
	errQuery        = errors.New("could not query to database")
	errData         = errors.New("no data available")
	errEndPoint     = errors.New("use time from 1m,5m,15m,1h,6h,12h,24h,7d,30d")
)

var netAggRPQ = "SELECT mean(bytes_recv) ,mean(bytes_sent), mean(drop_in), mean(drop_out), mean(err_in), mean(err_out), mean(packets_recv), mean(packets_sent)  FROM " + DBName + ".%s.mean_net WHERE time > now() - %s"
var netDefaultRPQ = "SELECT mean(bytes_recv) ,mean(bytes_sent), mean(drop_in), mean(drop_out), mean(err_in), mean(err_out), mean(packets_recv), mean(packets_sent)  FROM " + DBName + ".%s.net WHERE time > now() - %s GROUP BY time(%s)"
var netLastRecordQ = "SELECT mean(bytes_recv), mean(bytes_sent), mean(drop_in), mean(drop_out), mean(err_in), mean(err_out), mean(packets_recv), mean(packets_sent)  FROM " + DBName + ".%s.net LIMIT 1"
var netAddQ = "SELECT time, \"name\", address FROM " + DBName + ".autogen.ethernet"
var netDriverQ = "SELECT time,\"name\" ,driver FROM " + DBName + ".autogen.ethernet"
var cpuAggRPQ = "SELECT usage_user AS mean_usage_user FROM " + DBName + ".%s.mean_cpu WHERE time > now() - %s"
var cpuDefaultRPQ = "SELECT mean(usage_user) AS mean_usage_user FROM " + DBName + ".%s.cpu WHERE time > now() - %s GROUP BY time(%s)"
var cpuLastRecordQ = "SELECT last(usage_user) AS mean_usage_user FROM " + DBName + ".%s.cpu LIMIT 1"
var diskAggRPQ = "SELECT used AS mean_used_bytes FROM " + DBName + ".%s.mean_disk WHERE time > now() - %s"
var diskDefaultRPQ = "SELECT mean(used) AS mean_used_bytes FROM " + DBName + ".%s.disk WHERE time > now() - %s GROUP BY time(%s)"
var diskLastRecordQ = "SELECT last(used) AS mean_used_bytes FROM " + DBName + ".%s.disk LIMIT 1"
var memoryAggRPQ = "SELECT used_percent AS mean_used_percent FROM " + DBName + ".%s.mean_mem WHERE time > now() - %s"
var memoryDefaultRPQ = "SELECT mean(used_percent) AS mean_used_percent FROM " + DBName + ".%s.mem WHERE time > now() - %s GROUP BY time(%s)"
var memoryLastRecordQ = "SELECT last(used_percent) AS mean_used_percent FROM " + DBName + ".%s.mem LIMIT 1"
