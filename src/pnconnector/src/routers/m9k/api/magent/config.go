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
 *     * Neither the name of Samsung Electronics Corporation nor the names of its
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

package magent

import "pnconnector/src/errors"

var DBName = "poseidon"
var DBAddress = "http://127.0.0.1:8086"
var AggTime = []string{"7d", "30d"}
var AggRP = "agg_rp"
var DefaultRP = "default_rp"
var TimeGroupsDefault = map[string]string{
	"1m":  "3s",
	"5m":  "3s",
	"15m": "1m",
	"1h":  "1m",
	"6h":  "1m",
	"12h": "5m",
	"24h": "10m",
	"7d":  "1h",
	"30d": "6h",
	"60d": "60d",
}
var TimeSecondsMap = map[string]int64{
	"1m":  60000000000,
	"5m":  300000000000,
	"15m": 900000000000,
	"1h":  3600000000000,
	"6h":  21600000000000,
	"12h": 43200000000000,
	"24h": 86400000000000,
	"7d":  604800000000000,
	"30d": 2592000000000000,
	"60d": 5184000000000000,
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
var netLastRecordQ = "select sum(*) from (SELECT last(bytes_recv) as bytes_recv,last(bytes_sent) as bytes_sent, last(drop_in) as drop_in, last(drop_out) as drop_out, last(err_in) as err_in, last(err_out) as err_out, last(packets_recv) as packets_recv, last(packets_sent) as packets_sent, last(unixTimestamp) as unixTimestamp  FROM %s.%s.net where time >= now() - 1m group by interface)"
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

var ReadBandwidthAggRPQVol = `SELECT read_bw as "bw" FROM "%s"."%s"."mean_air" WHERE time > now() - %s and time > %s and vol_id =~ %s and arr_id =~ %s GROUP BY vol_id FILL(null)`
var ReadBandwidthDefaultRPQVol = `SELECT mean(read_bw) as "bw", median(unixTimestamp) as timestamp FROM "%s"."%s"."air" WHERE time > now() - %s and time > %s and vol_id =~ %s and arr_id =~ %s GROUP BY vol_id,time(%s) FILL(null)`
var ReadBandwidthLastRecordQVol = `SELECT read_bw FROM (SELECT sum(read_bw) as read_bw FROM "%s"."%s"."air" where time > now() - 5s and vol_id =~ %s and arr_id =~ %s group by time(1s)) order by time limit 1`

var ReadBandwidthAggRPQArr = `SELECT read_bw as "bw" FROM "%s"."%s"."mean_air" WHERE time > now() - %s and time > %s and arr_id =~ %s FILL(null)`
var ReadBandwidthDefaultRPQArr = `SELECT mean(read_bw) FROM (SELECT sum(read_bw) as "read_bw" FROM "%s"."%s"."air" WHERE time > now() - %s and arr_id =~ %s group by time(1s) FILL(null)) group by time(%s)`
var ReadBandwidthLastRecordQArr = `SELECT read_bw FROM (SELECT sum(read_bw) as read_bw FROM "%s"."%s"."air" where time > now() - 5s and arr_id =~ %s group by time(1s)) order by time limit 1`

var WriteBandwidthAggRPQArr = `SELECT write_bw as "bw" FROM "%s"."%s"."mean_air" WHERE time > now() - %s and time > %s and arr_id =~ %s FILL(null)`
var WriteBandwidthDefaultRPQArr = `SELECT mean(write_bw) FROM (SELECT sum(write_bw) as "write_bw" FROM "%s"."%s"."air" WHERE time > now() - %s and arr_id =~ %s group by time(1s) FILL(null)) group by time(%s)`
var WriteBandwidthLastRecordQArr = `SELECT write_bw FROM (SELECT sum(write_bw) as write_bw FROM "%s"."%s"."air" where time > now() - 5s and arr_id =~ %s group by time(1s)) order by time limit 1`

var WriteBandwidthAggRPQVol = `SELECT write_bw as "bw" FROM "%s"."%s"."mean_air" WHERE time > now() - %s and time > %s and vol_id =~ %s and arr_id =~ %s GROUP BY vol_id FILL(null)`
var WriteBandwidthDefaultRPQVol = `SELECT mean(write_bw) as "bw", median(unixTimestamp) as timestamp FROM "%s"."%s"."air" WHERE time > now() - %s and time > %s and vol_id =~ %s and arr_id =~ %s GROUP BY vol_id, time(%s) FILL(null)`
var WriteBandwidthLastRecordQVol = `SELECT write_bw FROM (SELECT sum(write_bw) as write_bw FROM "%s"."%s"."air" where time > now() - 5s and vol_id =~ %s and arr_id =~ %s group by time(1s)) order by time limit 1`

var ReadIOPSAggRPQArr = `SELECT read_iops as "iops" FROM "%s"."%s"."mean_air" WHERE time > now() - %s and time > %s and arr_id =~ %s FILL(null)`
var ReadIOPSDefaultRPQArr = `SELECT mean(read_iops) FROM (SELECT sum(read_iops) as "read_iops" FROM "%s"."%s"."air" WHERE time > now() - %s and arr_id =~ %s group by time(1s) FILL(null)) group by time(%s)`
var ReadIOPSLastRecordQArr = `SELECT read_iops FROM (SELECT sum(read_iops) as read_iops FROM "%s"."%s"."air" where time > now() - 5s and arr_id =~ %s group by time(1s)) order by time limit 1`

var ReadIOPSAggRPQVol = `SELECT read_iops as "iops" FROM "%s"."%s"."mean_air" WHERE time > now() - %s and time > %s and vol_id =~ %s and arr_id =~ %s GROUP BY vol_id FILL(null)`
var ReadIOPSDefaultRPQVol = `SELECT mean(read_iops) as "iops", median(unixTimestamp) as timestamp FROM "%s"."%s"."air" WHERE time > now() - %s and time > %s and vol_id =~ %s and arr_id =~ %s GROUP BY vol_id, time(%s) FILL(null)`
var ReadIOPSLastRecordQVol = `SELECT read_iops FROM (SELECT sum(read_iops) as read_iops FROM "%s"."%s"."air" where time > now() - 5s and vol_id =~ %s and arr_id =~ %s group by time(1s)) order by time limit 1`

var WriteIOPSAggRPQArr = `SELECT write_iops as "iops" FROM "%s"."%s"."mean_air" WHERE time > now() - %s and time > %s and arr_id =~ %s FILL(null)`
var WriteIOPSDefaultRPQArr = `SELECT mean(write_iops) FROM (SELECT sum(write_iops) as "write_iops" FROM "%s"."%s"."air" WHERE time > now() - %s and arr_id =~ %s group by time(1s) FILL(null)) group by time(%s)`

var WriteIOPSLastRecordQArr = `SELECT write_iops FROM (SELECT sum(write_iops) as write_iops FROM "%s"."%s"."air" where time > now() - 5s and arr_id =~ %s group by time(1s)) order by time limit 1`

var WriteIOPSAggRPQVol = `SELECT write_iops as "iops" FROM "%s"."%s"."mean_air" WHERE time > now() - %s and time > %s and vol_id =~ %s and arr_id =~ %s GROUP BY vol_id FILL(null)`
var WriteIOPSDefaultRPQVol = `SELECT mean(write_iops) as "iops", median(unixTimestamp) as timestamp FROM "%s"."%s"."air" WHERE time > now() - %s and time > %s and vol_id =~ %s and arr_id =~ %s GROUP BY vol_id, time(%s) FILL(null)`
var WriteIOPSLastRecordQVol = `SELECT write_iops FROM (SELECT sum(write_iops) as write_iops FROM "%s"."%s"."air" where time > now() - 5s and vol_id =~ %s and arr_id =~ %s group by time(1s)) order by time limit 1`

var WriteLatencyAggRPQArr = `SELECT write_latency as "latency" FROM "%s"."%s"."mean_air" WHERE time > now() - %s and time > %s and arr_id =~ %s FILL(null)`
var WriteLatencyDefaultRPQArr = `SELECT mean(write_latency) FROM (SELECT sum(write_latency) as "write_latency" FROM "%s"."%s"."air" WHERE time > now() - %s and arr_id =~ %s group by time(1s) FILL(null)) group by time(%s)`
var WriteLatencyLastRecordQArr = `SELECT write_latency FROM (SELECT sum(write_latency) as write_latency FROM "%s"."%s"."air" where time > now() - 5s and arr_id =~ %s group by time(1s)) order by time limit 1`

var WriteLatencyAggRPQVol = `SELECT write_latency as "latency" FROM "%s"."%s"."mean_air" WHERE time > now() - %s and time > %s and vol_id =~ %s and arr_id =~ %s GROUP BY vol_id FILL(null)`
var WriteLatencyDefaultRPQVol = `SELECT mean(write_latency) as "latency", median(unixTimestamp) as timestamp FROM "%s"."%s"."air" WHERE time > now() - %s and time > %s and vol_id =~ %s and arr_id =~ %s GROUP BY vol_id, time(%s) FILL(null)`
var WriteLatencyLastRecordQVol = `SELECT write_latency FROM (SELECT sum(write_latency) as write_latency FROM "%s"."%s"."air" where time > now() - 5s and vol_id =~ %s and arr_id =~ %s group by time(1s)) order by time limit 1`

var ReadLatencyAggRPQArr = `SELECT read_latency as "latency" FROM "%s"."%s"."mean_air" WHERE time > now() - %s and time > %s and arr_id =~ %s FILL(null)`
var ReadLatencyDefaultRPQArr = `SELECT mean(read_latency) FROM (SELECT sum(read_latency) as "read_latency" FROM "%s"."%s"."air" WHERE time > now() - %s and arr_id =~ %s group by time(1s) FILL(null)) group by time(%s)`
var ReadLatencyLastRecordQArr = `SELECT read_latency FROM (SELECT sum(read_latency) as read_latency FROM "%s"."%s"."air" where time > now() - 5s and arr_id =~ %s group by time(1s)) order by time limit 1`

var ReadLatencyAggRPQVol = `SELECT read_latency as "latency" FROM "%s"."%s"."mean_air" WHERE time > now() - %s and time > %s and vol_id =~ %s and arr_id =~ %s GROUP BY vol_id FILL(null)`
var ReadLatencyDefaultRPQVol = `SELECT mean(read_latency) as "latency", median(unixTimestamp) as timestamp FROM "%s"."%s"."air" WHERE time > now() - %s and time > %s and vol_id =~ %s and arr_id =~ %s GROUP BY vol_id, time(%s) FILL(null)`
var ReadLatencyLastRecordQVol = `SELECT read_latency FROM (SELECT sum(read_latency) as read_latency FROM "%s"."%s"."air" where time > now() - 5s and vol_id =~ %s and arr_id =~ %s group by time(1s)) order by time limit 1`

var RebuildingLogQ = `SELECT "value" FROM "%s"."autogen"."rebuilding_status" WHERE time > now() - %s`
