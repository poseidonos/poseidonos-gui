'''
/*-------------------------------------------------------------------------------------/
                                                                                    /
/               COPYRIGHT (c) 2019 SAMSUNG ELECTRONICS CO., LTD.                      /
/                          ALL RIGHTS RESERVED                                        /
/                                                                                     /
/   Permission is hereby granted to licensees of Samsung Electronics Co., Ltd.        /
/   products to use or abstract this computer program for the sole purpose of         /
/   implementing a product based on Samsung Electronics Co., Ltd. products.           /
/   No other rights to reproduce, use, or disseminate this computer program,          /
/   whether in part or in whole, are granted.                                         /
/                                                                                     /
/   Samsung Electronics Co., Ltd. makes no representation or warranties with          /
/   respect to the performance of this computer program, and specifically disclaims   /
/   any responsibility for any damages, special or consequential, connected           /
/   with the use of this program.                                                     /
/                                                                                     /
/-------------------------------------------------------------------------------------/


DESCRIPTION: Files containing influxdb queries related to Performance data
@NAME : system_perf.py
@AUTHORS: Jay Hitesh Sanghavi
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
[11/06/2019] [Aswin] : Changed queries with respect to Volume level data from AIR
[12/06/2019] [Aswin] : Changed aggregation function to mean
[31/03/2020] [Palak] : Created a separate DB for M-Tool with retention policies
*/
'''

from util.db.influx import get_connection
from util.com.time_groups import time_groups_default
from util.macros.influxdb import mtool_db, infinite_rp, default_rp, agg_rp, agg_time
import re


def get_available():
    connection = get_connection()
    # query = 'SELECT mean("usage_idle") AS "mean_usage_idle" FROM "telegraf"."autogen"."cpu" WHERE time > now()-15m AND  GROUP BY time(1285ms)'
    query = 'SELECT mean("active") AS "mean_active" FROM "telegraf"."autogen"."mem" WHERE time > now()-5m GROUP BY time(428ms)'
    res = connection.query(query)
    connection.close()
    return res


def get_user_cpu_usage(time):
    connection = get_connection()
    if time in agg_time:
        query = 'SELECT "usage_user" AS "mean_usage_user" FROM "' + mtool_db + \
            '"."' + agg_rp + '"."mean_cpu" WHERE time > now() - {}'.format(time)
    else:
        query = 'SELECT mean("usage_user") AS "mean_usage_user" FROM "' + mtool_db + '"."' + default_rp + \
            '"."cpu" WHERE time > now() - {} GROUP BY time({})'.format(time, time_groups_default[time])
    print(query)
    res = connection.query(query)
    connection.close()
    return res


def get_diskio_mbps(time, level):
    connection = get_connection()
    if level == "array":
        query = 'SELECT non_negative_derivative(max("write_bytes"), 1s) / 1000000 AS "write_megabytes_per_second" FROM "telegraf".""."diskio" where time > now() - {} group by time({})'.format(
            time, time_groups_default[time])
    else:
        query = 'SELECT non_negative_derivative(max("write_bytes"), 1s) / 1000000 AS "write_megabytes_per_second" FROM "telegraf".""."diskio" where time > now() - {} AND "name"!=\'{}\' group by time({})'.format(
            time, level, time_groups_default[time])
    res = connection.query(query)
    connection.close()
    return res


def get_total_processes(time):
    connection = get_connection()
    query = 'SELECT mean("total") AS "total" FROM "telegraf".""."processes" where time > now() - {} group by time({})'.format(
        time, time_groups_default[time])
    res = connection.query(query)
    connection.close()
    return res


def get_total_disk_used_percent(time, level):
    connection = get_connection()
    query = 'SELECT mean("used_percent") AS "used_percent" FROM "telegraf".""."disk" where time > now() - {} group by time({})'.format(
            time, time_groups_default[time])
    res = connection.query(query)
    connection.close()
    return res

"""
def get_input_power_variation(time):
    try:
        res_dict = {}
        result = []
        connection = get_connection()
        query = 'SELECT last("count") AS "total_count" FROM "' + \
            mtool_db + '"."' + infinite_rp + '"."power"'
        response = connection.query(query)
        response = response.get_points()
        range_value = 0
        for data in list(response):
            range_value = int(data['total_count'])
        for i in range(0, range_value):
            query = 'SELECT mean("value") AS "mean_power_value" FROM "' + mtool_db + '"."' + infinite_rp + '"."power"' + ' where time > now() - ' + \
                time + ' AND "input_power"=' + '\'PSU' + str(i) + '\'' + ' GROUP BY time(' + time_groups_default[time] + ')'
            res = connection.query(query)
            res = res.get_points()
            for data in list(res):
                if data['mean_power_value'] is not None:
                    result.append({
                        'value': int(data['mean_power_value']),
                        'time': data['time']
                    })
        res_dict['res'] = result
        connection.close()
        return res_dict
    except Exception as e:
        print(e)
"""

def extract_values(res, level, time, metrics, metricOp, factor):
    result = []
    if level == 'array':
        for data in list(res):
            val = 0
            try:
                # Take sum of all values except aid and time in case of array
                for key in data.keys():
                    if key != 'time' and (
                            re.match(
                                r'.*aid$',
                                key) is None) and (
                            data[key] is not None):
                        val = val + data[key]
                result.append({
                    'value': val / factor,
                    'time': data['time']
                })
            except Exception as e:
                print(e)
    else:
        for data in list(res):
            val = 0

            if (time == '1m' or (time in agg_time)):
                # If time interval is 1m, aggregation is not there.
                for key in data.keys():
                    new_key = key[0:(len(key) - len(metricOp))] + 'aid'
                    if new_key in data and data[new_key] == int(level):
                        val = val + data[key]
            else:
                try:
                    for key in data.keys():
                        new_key = metrics + \
                            key[4:len(key) - len(metricOp)] + 'aid'
                        if (new_key in data) and (data[new_key] == int(level)):
                            val = val + data[key]
                except Exception as e:
                    print(e)
            result.append({
                'value': val / factor,
                'time': data['time']
            })
    return result


def get_disk_latency(time, level):
    try:
        res_dict = {}
        connection = get_connection()

        if time in agg_time:
            query = 'SELECT /^mean_lat_data_0_tid_arr_[\S]_aid_arr_[\S]_timelag_arr_0_mean$/, /^mean_lat_data_0_tid_arr_[\S]_aid_arr_[\S]_aid$/ as "latency" FROM "poseidon"."agg_rp"."mean_air" WHERE time > now() - {} FILL(null)'.format(
                time)

        elif(time == '1m'):
            query = 'SELECT /^lat_data_0_tid_arr_[\S]_aid_arr_[\S]_timelag_arr_0_mean$/, /^lat_data_0_tid_arr_[\S]_aid_arr_[\S]_aid$/ as "latency" FROM "poseidon"."default_rp"."air" WHERE time > now() - {} FILL(null)'.format(
                time)

        else:
            query = 'SELECT mean(/^lat_data_0_tid_arr_[\S]_aid_arr_[\S]_timelag_arr_0_mean$/), mean(/^lat_data_0_tid_arr_[\S]_aid_arr_[\S]_aid$/) as "latency" FROM "poseidon"."default_rp"."air" WHERE time > now() - {} GROUP BY time({}) FILL(null)'.format(
                time, time_groups_default[time])

        res = connection.query(query)
        res_dict['res'] = extract_values(
            res.get_points(),
            level,
            time,
            'latency',
            'timelag_arr_0_mean',
            1)
        connection.close()
        return res_dict
    except Exception as e:
        print(e)


def get_disk_read_iops(time, level):
    try:
        res_dict = {}
        connection = get_connection()

        if time in agg_time:
            query = r'SELECT /^mean_perf_data_0_tid_arr_[\S]_aid_arr_[\S]_iops_read$/, /^mean_perf_data_0_tid_arr_[\S]_aid_arr_[\S]_aid$/ as "iops" FROM "poseidon"."agg_rp"."mean_air" WHERE time > now() - {} FILL(null)'.format(time)

        elif(time == '1m'):
            query = r'SELECT /^perf_data_0_tid_arr_[\S]_aid_arr_[\S]_iops_read$/, /^perf_data_0_tid_arr_[\S]_aid_arr_[\S]_aid$/ as "iops" FROM "poseidon"."default_rp"."air" WHERE time > now() - {} FILL(null)'.format(time)

        else:
            query = 'SELECT mean(/^perf_data_0_tid_arr_[\S]_aid_arr_[\S]_iops_read$/), mean(/^perf_data_0_tid_arr_[\S]_aid_arr_[\S]_aid$/) as "iops" FROM "poseidon"."default_rp"."air" WHERE time > now() - {} GROUP BY time({}) FILL(null)'.format(
                time, time_groups_default[time])

        res = connection.query(query)
        res_dict['res'] = extract_values(
            res.get_points(), level, time, 'iops', 'iops_read', 1000)
        connection.close()
        return res_dict
    except Exception as e:
        print(e)


def get_disk_write_iops(time, level):
    res_dict = {}
    connection = get_connection()

    if time in agg_time:
        query = r'SELECT /^mean_perf_data_0_tid_arr_[\S]_aid_arr_[\S]_iops_write$/, /^mean_perf_data_0_tid_arr_[\S]_aid_arr_[\S]_aid$/ as "iops" FROM "poseidon"."agg_rp"."mean_air" WHERE time > now() - {} FILL(null)'.format(time)

    elif(time == '1m'):
        query = 'SELECT /^perf_data_0_tid_arr_[\S]_aid_arr_[\S]_iops_write$/, /^perf_data_0_tid_arr_[\S]_aid_arr_[\S]_aid$/ as "iops" FROM "poseidon"."default_rp"."air" WHERE time > now() - {} FILL(null)'.format(
            time)
    else:
        query = 'SELECT mean(/^perf_data_0_tid_arr_[\S]_aid_arr_[\S]_iops_write$/), mean(/^perf_data_0_tid_arr_[\S]_aid_arr_[\S]_aid$/) as "iops" FROM "poseidon"."default_rp"."air" WHERE time > now() - {} GROUP BY time({}) FILL(null)'.format(
            time, time_groups_default[time])

    res = connection.query(query)
    res_dict['res'] = extract_values(
        res.get_points(),
        level,
        time,
        'iops',
        'iops_write',
        1000)
    connection.close()
    return res_dict


def get_disk_read_bw(time, level):
    res_dict = {}
    connection = get_connection()

    if time in agg_time:
        query = 'SELECT /^mean_perf_data_0_tid_arr_[\S]_aid_arr_[\S]_bw_read$/, /^mean_perf_data_0_tid_arr_[\S]_aid_arr_[\S]_aid$/ as "bw" FROM "poseidon"."agg_rp"."mean_air" WHERE time > now() - {} FILL(null)'.format(
            time)

    elif(time == '1m'):
        query = 'SELECT /^perf_data_0_tid_arr_[\S]_aid_arr_[\S]_bw_read$/, /^perf_data_0_tid_arr_[\S]_aid_arr_[\S]_aid$/ as "bw" FROM "poseidon"."default_rp"."air" WHERE time > now() - {} FILL(null)'.format(
            time)
    else:
        query = 'SELECT mean(/^perf_data_0_tid_arr_[\S]_aid_arr_[\S]_bw_read$/), mean(/^perf_data_0_tid_arr_[\S]_aid_arr_[\S]_aid$/) as "bw" FROM "poseidon"."default_rp"."air" WHERE time > now() - {} GROUP BY time({}) FILL(null)'.format(
            time, time_groups_default[time])

    res = connection.query(query)
    res_dict['res'] = extract_values(
        res.get_points(),
        level,
        time,
        'bw',
        'bw_read',
        1024 * 1024)
    connection.close()
    return res_dict


def get_disk_write_bw(time, level):

    res_dict = {}
    connection = get_connection()

    if time in agg_time:
        query = 'SELECT /^mean_perf_data_0_tid_arr_[\S]_aid_arr_[\S]_bw_write$/, /^mean_perf_data_0_tid_arr_[\S]_aid_arr_[\S]_aid$/ as "bw" FROM "poseidon"."agg_rp"."mean_air" WHERE time > now() - {} FILL(null)'.format(
            time)

    elif(time == '1m'):
        query = 'SELECT /^perf_data_0_tid_arr_[\S]_aid_arr_[\S]_bw_write$/, /^perf_data_0_tid_arr_[\S]_aid_arr_[\S]_aid$/ as "bw" FROM "poseidon"."default_rp"."air" WHERE time > now() - {} FILL(null)'.format(
            time)
    else:
        query = 'SELECT mean(/^perf_data_0_tid_arr_[\S]_aid_arr_[\S]_bw_write$/), mean(/^perf_data_0_tid_arr_[\S]_aid_arr_[\S]_aid$/) as "bw" FROM "poseidon"."default_rp"."air" WHERE time > now() - {} GROUP BY time({}) FILL(null)'.format(
            time, time_groups_default[time])

    res = connection.query(query)
    res_dict['res'] = extract_values(
        res.get_points(),
        level,
        time,
        'bw',
        'bw_write',
        1024 * 1024)
    connection.close()
    return res_dict

"""
def get_queue_depth(time):
    connection = get_connection()
    if time == "5m" or time == "1m":
        query = 'SELECT "queue_data_0_depth_avg" as "depth" FROM "telegraf".""."air" WHERE time > now() - {} FILL(0)'.format(time)
    else:
        query = 'SELECT mean("queue_data_0_depth_avg") as "depth" FROM "telegraf".""."air" WHERE time > now() - {} GROUP BY time({}) FILL(0)'.format(
            time, time_groups_default[time])
    res = connection.query(query)
    connection.close()
    return res


def get_queue_size(time):
    connection = get_connection()
    if time == "5m" or time == "1m":
        query = 'SELECT "queue_data_0_size" as "queue_size" FROM "telegraf".""."air" WHERE time > now() - {} FILL(0)'.format(time)
    else:
        query = 'SELECT mean("queue_data_0_size") as "queue_size" FROM "telegraf".""."air" WHERE time > now() - {} GROUP BY time({}) FILL(0)'.format(
            time, time_groups_default[time])
    res = connection.query(query)
    connection.close()
    return res
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


def get_disk_current_perf():
    res_dict = {}
    connection = get_connection()
    bw_total_query = r'SELECT mean(/^perf_data_0_tid_arr_[\S]_aid_arr_[\S]_bw_total$/) as "bw" FROM "poseidon".""."air" WHERE time > now() - 5s GROUP BY time(0s)'
    res = get_perf_from_influx(bw_total_query)
    res_dict['bw_total'] = res
    iops_total_query = r'SELECT mean(/^perf_data_0_tid_arr_[\S]_aid_arr_[\S]_iops_total$/) as "bw" FROM "poseidon".""."air" WHERE time > now() - 5s GROUP BY time(0s)'
    res = get_perf_from_influx(iops_total_query)
    res_dict['iops_total'] = res
    bw_read_query = r'SELECT mean(/^perf_data_0_tid_arr_[\S]_aid_arr_[\S]_bw_read$/) as "bw" FROM "poseidon".""."air" WHERE time > now() - 5s GROUP BY time(0s)'
    res = get_perf_from_influx(bw_read_query)
    res_dict['bw_read'] = res
    iops_read_query = r'SELECT mean(/^perf_data_0_tid_arr_[\S]_aid_arr_[\S]_iops_read$/) as "bw" FROM "poseidon".""."air" WHERE time > now() - 5s GROUP BY time(0s)'
    res = get_perf_from_influx(iops_read_query)
    res_dict['iops_read'] = res
    bw_write_query = r'SELECT mean(/^perf_data_0_tid_arr_[\S]_aid_arr_[\S]_bw_write$/) as "bw" FROM "poseidon".""."air" WHERE time > now() - 5s GROUP BY time(0s)'
    res = get_perf_from_influx(bw_write_query)
    res_dict['bw_write'] = res
    iops_write_query = r'SELECT mean(/^perf_data_0_tid_arr_[\S]_aid_arr_[\S]_iops_write$/) as "bw" FROM "poseidon".""."air" WHERE time > now() - 5s GROUP BY time(0s)'
    res = get_perf_from_influx(iops_write_query)
    res_dict['iops_write'] = res
    latency_query = r'SELECT mean(/^lat_data_0_tid_arr_[\S]_aid_arr_[\S]_timelag_arr_0_mean$/) as "latency" FROM "poseidon".""."air" WHERE time > now() - 5s GROUP BY time(0s)'
    res = get_perf_from_influx(latency_query)
    res_dict['latency'] = res
    return res_dict


def get_alerts():
    connection = get_connection()
    query = 'SELECT * FROM "' + mtool_db + '"."' + infinite_rp + \
        '"."alerts"'  # where "alertName"=\'PostRule\'
    res = connection.query(query)
    connection.close()
    return res

"""
def get_series():
    connection = get_connection()
    # query = 'SELECT mean("usage_idle") AS "mean_usage_idle" FROM "telegraf"."autogen"."cpu" WHERE time > now()-15m AND  GROUP BY time(1285ms)'
    query = 'SHOW SERIES ON "' + mtool_db + '"'
    res = connection.query(query)
    connection.close()
    return list(res.get_points())
"""

def get_alerts_from_influx():
    connection = get_connection('chronograf')
    # query = 'SELECT * FROM "chronograf' + '"."' + infinite_rp +
    # '"."alerts"'#where "alertName"=\'PostRule\'
    query = 'SELECT * FROM "alerts" ORDER BY DESC'
    res = connection.query(query)
    print(res)
    connection.close()
    return res


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
