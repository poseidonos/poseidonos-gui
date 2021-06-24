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
 *     * Neither the name of Intel Corporation nor the names of its
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
#import datetime

status_list = ["Good", "Fair", "Critical"]
# 008000:Green, #FFA500:Orange, #FF0000:Red
color_list = ["#008000", "#FFA500", "#FF0000"]
rules = {"cpu": [[0, 40], [40, 80], [80, 100]], "memory": [[0, 50], [50, 70], [
    70, 100]], "osDisk": [[0, 70], [70, 85], [85, 100]], "latency": [[0, 60], [60, 85], [85, 100]]}
time_interval = "1"
max_latency = 0
descriptions = {
    "cpu": [
        "{name} has been less than {value}% for the last {time} minutes",
        "{name} has been greater than {value}% for the last {time} minutes"],
    "memory": [
        "{name} has been less than {value}% for the last {time} minutes",
        "{name} has been greater than {value}% for the last {time} minutes"],
    "latency": [
        "{name} has been less than {value}% for the last {time} minutes",
        "{name} has been greater than {value}% for the last {time} minutes"]}


def get_json_result(usage_percent, timestamp, rule, _id, label):
    if rules[rule][0][0] <= usage_percent and usage_percent < rules[rule][0][1]:
        status = status_list[0]
        color = color_list[0]
        description = descriptions[rule][0].format(
            name=rule, value=rules[rule][0][1], time=time_interval)
        warn_value = rules[rule][1][0]
        critical_value = rules[rule][1][1]
        is_healthy = True
    elif rules[rule][1][0] <= usage_percent and usage_percent < rules[rule][1][1]:
        status = status_list[1]
        color = color_list[1]
        description = descriptions[rule][1].format(
            name=rule, value=rules[rule][1][0], time=time_interval)
        warn_value = rules[rule][1][0]
        critical_value = rules[rule][1][1]
        is_healthy = False
    elif rules[rule][2][0] <= usage_percent and usage_percent <= rules[rule][2][1]:
        status = status_list[2]
        color = color_list[2]
        description = descriptions[rule][1].format(
            name=rule, value=rules[rule][2][0], time=time_interval)
        warn_value = rules[rule][1][0]
        critical_value = rules[rule][1][1]
        is_healthy = False
    arcsArr = [(rules[rule][0][1] - rules[rule][0][0]) / 100,
               (rules[rule][1][1] - rules[rule][1][0]) / 100,
               (rules[rule][2][1] - rules[rule][2][0]) / 100]
    warn_time_in_seconds = int(time_interval) * 60
    critical_time_in_seconds = int(time_interval) * 60
    percentage = usage_percent/100
    percentage = round(percentage, 2)
    epoch_time = timestamp
    #utc_time = datetime.datetime.utcfromtimestamp(timestamp / 1000000000)
    response = {
        "name": rule,
        "id": _id,
        "status": status,
        "color": color,
        "description": description,
        "warnValue": warn_value,
        "warnTimeInSeconds": warn_time_in_seconds,
        "criticalValue": critical_value,
        "criticalTimeInSeconds": critical_time_in_seconds,
        "percentage": percentage,
        "epochTime": epoch_time,
        #"utcTime": utc_time,
        "isHealthy": is_healthy,
        "arcsArr": arcsArr,
        "label":label}
    return response


def get_avg(res, arr_len, field):
    sum_usage_percent = 0
    for i in range(0, arr_len):
        sum_usage_percent += res["result"]["data"][0][i][field]
    avg_usage_percent = sum_usage_percent / arr_len
    return avg_usage_percent

def get_last_result(res, arr_len, field):
    if arr_len > 0:
        return res["result"]["data"][0][arr_len-1][field]
    else:
        return 0

def set_max_latency(res, field):
    global max_latency
    max_usage_percent = 0
    arr_len = len(res["result"]["data"][0])
    if arr_len != 0:
        for i in range(0, arr_len):
            if res["result"]["data"][0][i][field] > max_usage_percent:
                max_usage_percent = res["result"]["data"][0][i][field]
    max_latency = max_usage_percent


def get_percentage(usage_percent):
    try:
        global max_latency
        if usage_percent > max_latency:
            return 100
        return (usage_percent * 100) / max_latency
    except BaseException:
        return 0


def process_response(res, rule, field, _id, label):
    try:
        result = {}
        arr_len = len(res["result"]["data"][0])
        if arr_len == 0:
            return result
        else:
            time = res["result"]["data"][0][arr_len - 1]["time"]
            if rule == "latency":
                #latency = get_avg(res, arr_len, field)
                latency = get_last_result(res, arr_len, field)
                usage_percent = get_percentage(latency)
                result = get_json_result(usage_percent, time, rule, _id, label)
                result["value"] = str(round(latency/1000000,2))
                result["unit"] = "ms"
            else:
                #usage_percent = get_avg(res, arr_len, field)
                usage_percent = get_last_result(res, arr_len, field)
                result = get_json_result(usage_percent, time, rule, _id, label)
                result["value"] = str(round(usage_percent, 2))
                result["unit"] = "%"
    except Exception as e:
        #print("In Exception: ", e)
        return result
    return result


def get_overall_health(results):
    if len(results) == 0:
        return False
    else:
        return all(results)

