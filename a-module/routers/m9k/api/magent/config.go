package magent

var DBName = "mtool_db"
var DBAddress = "http://127.0.0.1:8086"
var AggTime = []string{"7d", "30d"}
var AggRP = "agg_rp"
var DefaultRP = "default_rp"
var ConnErrMsg = "Could not connect to Influxdb"
var QueryErrMsg = "Could not query to database"
var DataErrMsg = "No data available"
var EndPointErrMsg = "Use time from 1m,5m,15m,1h,6h,12h,24h,7d,30d"
var TimeGroupsDefault = map[string]string{
	"1m":  "1s",
	"5m":  "1s",
	"15m": "1m",
	"1h":  "1m",
	"6h":  "1m",
	"12h": "5m",
	"24h": "10m",
	"7d":  "1h",
	"30d": "6h"}
