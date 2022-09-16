'''
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
 '''

#from util.db.influx import get_connection
#from util.com.time_groups import time_groups_default
from rest.rest_api.dagent import metrics
#from util.macros.influxdb_config import mtool_db


def get_user_cpu_usage(time):
    return metrics.get_cpu_usage(time)

def get_user_memory_usage(time):
    return metrics.get_memory_usage(time)

def get_latency_usage(time):
    return metrics.get_latency(time, "0,1")

def get_disk_latency(time, arr_id, vol_id):
    if vol_id == "":
        return metrics.get_latency(time, arr_id)
    return metrics.get_vol_latency(time, arr_id, vol_id)
def get_disk_read_latency(time, arr_id, vol_id):
    if vol_id == "":
        return metrics.get_read_latency(time, arr_id)
    return metrics.get_vol_read_latency(time, arr_id, vol_id)

def get_disk_write_latency(time, arr_id, vol_id):
    if vol_id == "":
        return metrics.get_write_latency(time, arr_id)
    return metrics.get_vol_write_latency(time, arr_id, vol_id)

def get_disk_read_iops(time, arr_id, vol_id):
    if vol_id == "":
        return metrics.get_read_iops(time, arr_id)
    return metrics.get_vol_read_iops(time, arr_id, vol_id)

def get_disk_write_iops(time, arr_id, vol_id):
    if vol_id == "":
        return metrics.get_write_iops(time, arr_id)
    return metrics.get_vol_write_iops(time, arr_id, vol_id)

def get_disk_read_bw(time, arr_id, vol_id):
    if vol_id == "":
        return metrics.get_read_bw(time, arr_id)
    return metrics.get_vol_read_bw(time, arr_id, vol_id)

def get_disk_write_bw(time, arr_id, vol_id):
    if vol_id == "":
        return metrics.get_write_bw(time, arr_id)
    return metrics.get_vol_write_bw(time, arr_id, vol_id)
"""
def get_perf_from_influx(query):
    connection = get_connection()
    res = connection.query(query)
    connection.close()
    res = list(res.get_points())
    val = 0
    if len(res) != 0:
        for key, value in res[0].items():
            if key != "time" and value is not None:
                val += value
    return val
"""

def get_agg_value(response):
    value = 0
    if response is not None and "data" in response and "result" in response["data"] and len(response["data"]["result"]) > 0:
        for data in response["data"]["result"]:
            if "metric" in data and "job" in data["metric"] and data["metric"]["job"] == "pos" and "value" in data and len(data["value"]) == 2:
                value += int(data["value"][1])
    return value

def get_agg_volumes_perf(ip, port):
    metric_query_path = "http://{ip}:{port}/api/v1/query?query=".format(ip=ip, port=port)
    res_dict = {}
    read_bw_res = metrics.get_read_bw(metric_query_path)
    write_bw_res = metrics.get_write_bw(metric_query_path)
    read_iops_res = metrics.get_read_iops(metric_query_path)
    write_iops_res = metrics.get_write_iops(metric_query_path)
    read_latency_res = metrics.get_read_latency(metric_query_path)
    write_latency_res = metrics.get_write_latency(metric_query_path)
    read_bw = get_agg_value(read_bw_res)
    write_bw = get_agg_value(write_bw_res)
    read_iops = get_agg_value(read_iops_res)
    write_iops = get_agg_value(write_iops_res)
    read_latency = get_agg_value(read_latency_res)
    write_latency = get_agg_value(write_latency_res)

    res_dict['bw_total'] = read_bw + write_bw
    res_dict['bw_read'] = read_bw
    res_dict['bw_write'] = write_bw
    res_dict['iops_total'] = read_iops + write_iops
    res_dict['iops_read'] = read_iops
    res_dict['iops_write'] = write_iops
    res_dict['latency_total'] = read_latency + write_latency
    res_dict['latency_read'] = read_latency
    res_dict['latency_write'] = write_latency
    
    return res_dict

"""
def get_alerts():
    connection = get_connection()
    query = 'SELECT * FROM "' + mtool_db + '"."' + infinite_rp + \
        '"."alerts"'  # where "alertName"=\'PostRule\'
    res = connection.query(query)
    connection.close()
    return res
"""

"""
def get_series():
    connection = get_connection()
    # query = 'SELECT mean("usage_idle") AS "mean_usage_idle" FROM "telegraf"."autogen"."cpu" WHERE time > now()-15m AND  GROUP BY time(1285ms)'
    query = 'SHOW SERIES ON "' + mtool_db + '"'
    res = connection.query(query)
    connection.close()
    return list(res.get_points())


def get_alerts_from_influx():
    connection = get_connection('chronograf')
    # query = 'SELECT * FROM "chronograf' + '"."' + infinite_rp +
    # '"."alerts"'#where "alertName"=\'PostRule\'
    query = 'SELECT * FROM "alerts" ORDER BY DESC'
    res = connection.query(query)
    #print(res)
    connection.close()
    return res
"""

'''


SELECT mean("used") / 1073741824 AS "used", mean("available") / 1073741824 AS "available" FROM "telegraf".""."mem" where time > now() - 1h and "host" = '2030044765' group by time(1m)

"done SELECT mean("used_percent") AS "used_percent" FROM "telegraf".""."disk" where time > now() - 1h and "host" = '2030044765' group by time(1m),"path""

"SELECT non_negative_derivative(max("read_bytes"), 1s) / 1000000 AS "read_megabytes_per_second" FROM "telegraf".""."diskio" where time > now() - 1h and "host" = '2030044765' group by time(1m),"name""

"done SELECT mean("total") AS "total" FROM "telegraf".""."processes" where time > now() - 1h and "host" = '2030044765' group by time(1m)"

" done SELECT non_negative_derivative(max("write_bytes"), 1s) / 1000000 AS "write_megabytes_per_second" FROM "telegraf".""."diskio" where time > now() - 1h and "host" = '2030044765' group by time(1m),"name""

"SELECT 100 - mean("usage_idle") AS "usage" FROM "telegraf".""."cpu" where time > now() - 1h and "host" = '2030044765' group by time(1m)"

"SELECT mean("load1") AS "load" FROM "telegraf".""."system" where time > now() - 1h and "host" = '2030044765' group by time(1m)"
'''

if __name__ == '__main__':
    # print('sys perf')
    # print(get_load())
    pass
