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

from rest.rest_api.telemetry import telemetry
from rest.rest_api.dagent import ibofos
from util.macros.performance import *
import json
import io


def get_agg_volumes_perf(ip, port):
    read_bw = telemetry.get_agg_value(ip,port,READ_BPS_VOLUME)
    write_bw = telemetry.get_agg_value(ip,port,WRITE_BPS_VOLUME)
    read_iops = telemetry.get_agg_value(ip,port,READ_IOPS_VOLUME)
    write_iops = telemetry.get_agg_value(ip,port,WRITE_IOPS_VOLUME)
    read_latency = telemetry.get_agg_value(ip,port,READ_AVG_LAT_VOLUME)
    write_latency = telemetry.get_agg_value(ip,port,WRITE_AVG_LAT_VOLUME)

    res_dict = {}
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


def get_all_hardware_health(ip, port):
    res_dict = {
        DEVICES : [],
        ERRORINDEVICES : False,
        IPMI : [],
        ERRORINIPMI: False,
        ISIPMICHASSISPOWERON: False,
        TOTALNOMINALS: 0,
        TOTALWARNINGS: 0,
        TOTALCRITICALS: 0,
    }
    device_res = telemetry.get_device_metrics_values(ip, port, DEVICE_METRICS)
    if 'status' not in device_res or device_res['status'] != 'success':
        res_dict[ERRORINDEVICES] = True
    
    total_nominals = 0
    total_warnings = 0
    total_criticals = 0

    def update_state_count(state):
        nonlocal total_nominals, total_warnings, total_criticals
        total_nominals += 1 if state == NOMINAL else 0
        total_warnings += 1 if state == WARNING else 0
        total_criticals += 1 if state == CRITICAL else 0
    
    def update_field_state_count(state, field):
        field[NOMINAL_COUNT] += 1 if state == NOMINAL else 0
        field[WARNING_COUNT] += 1 if state == WARNING else 0
        field[CRITICAL_COUNT] += 1 if state == CRITICAL else 0

    devices= {}
    if res_dict[ERRORINDEVICES] == False:
        for field in device_res['data']['result']:
            if field['metric']['publisher_name'] != 'Disk_Monitoring':
                continue
            device_name = field['metric']['nvme_ctrl_id']
            metric_name = field['metric']['__name__']
            if device_name not in devices:
                devices[device_name] = {}
            if metric_name == AVAILABLESPARE:
                devices[device_name][AVAILABLESPARE] = field[VALUE][1]
            if metric_name == AVAILABLESPARETHRESOLD:
                devices[device_name][AVAILABLESPARETHRESOLD] = field[VALUE][1]
            if metric_name == TEMPERATURE:
                devices[device_name][TEMPERATURE] = field[VALUE][1]
            if metric_name == CRITICALTEMPERATURETIME:
                devices[device_name][CRITICALTEMPERATURETIME] = field[VALUE][1]
            if metric_name == WARNINGTEMPERATURETIME:
                devices[device_name][WARNINGTEMPERATURETIME] = field[VALUE][1]

    res_devices = []
    temperature_dict = {
        TYPE: TEMPERATURE_NAME,
        UNIT: DEVICE_UNITS[TEMPERATURE_NAME],
        METRICS: [],
        NOMINAL_COUNT: 0,
        WARNING_COUNT: 0,
        CRITICAL_COUNT: 0,
    }
    availablespare_dict = {
        TYPE: AVAILABLESPARE_NAME,
        UNIT: DEVICE_UNITS[AVAILABLESPARE_NAME],
        METRICS: [],
        NOMINAL_COUNT: 0,
        WARNING_COUNT: 0,
        CRITICAL_COUNT: 0,
    }
    for key in devices:
        value = devices[key]
        tstate = NOMINAL
        if value[WARNINGTEMPERATURETIME] != '0':
            tstate = WARNING
        if value[CRITICALTEMPERATURETIME] != '0':
            tstate = CRITICAL
        sstate = NOMINAL
        if value[AVAILABLESPARE] < value[AVAILABLESPARETHRESOLD]:
            sstate = WARNING
        if value[AVAILABLESPARE] == '0':
            sstate = CRITICAL
        temperature ={
            NAME: key,
            STATE: tstate,
            VALUE: value[TEMPERATURE]
        }
        availablespare = {
            NAME: key,
            STATE: sstate,
            VALUE: value[AVAILABLESPARE]
        }
        temperature_dict[METRICS].append(temperature)
        availablespare_dict[METRICS].append(availablespare)
        update_state_count(tstate)
        update_state_count(sstate)
        update_field_state_count(tstate, temperature_dict) 
        update_field_state_count(sstate, availablespare_dict) 
    res_devices.append(temperature_dict)
    res_devices.append(availablespare_dict)
    res_dict[DEVICES] = res_devices

    ipmi_res = telemetry.get_ipmi_metrics_values(ip, port, IPMI_METRICS)
    if 'status' not in ipmi_res or ipmi_res['status'] != 'success':
        res_dict[ERRORINIPMI] = True

    ipmi = {
        FAN_SPEED: {},
        POWER: {},
        SENSOR_VALUE: {},
        VOLTAGE: {},
        TEMPERATURE_NAME: {},
    }
    def fill_ipmi_fields(field, metric_type,value_type):
        if NAME not in field['metric']:
            return
        name = field['metric'][NAME]
        value= field[VALUE][1]
        if name not in ipmi[metric_type]:
            ipmi[metric_type][name] = {}
        if(value_type == STATE):
            ipmi[metric_type][name][STATE] = value
        if(value_type == VALUE):
            ipmi[metric_type][name][VALUE] = value

    if res_dict[ERRORINIPMI] == False:
        for field in ipmi_res['data']['result']:
            metric_name = field['metric']['__name__']
            if metric_name == IPMICHASSISPOWERSTATE and field[VALUE][1] == '1':
                res_dict[ISIPMICHASSISPOWERON] = True
            if metric_name == IPMIFANSPEEDSTATE:
                fill_ipmi_fields(field, FAN_SPEED, STATE)
            if metric_name == IPMIFANSPEEDRPM:
                fill_ipmi_fields(field, FAN_SPEED, VALUE)
            if metric_name == IPMISENSORSTATE:
                fill_ipmi_fields(field, SENSOR_VALUE, STATE)
            if metric_name == IPMISENSORVALUE:
                fill_ipmi_fields(field, SENSOR_VALUE, VALUE)
            if metric_name == IPMITEMPERATURESTATE:
                fill_ipmi_fields(field, TEMPERATURE_NAME, STATE)
            if metric_name == IPMITEMPERATURECELCIUS:
                fill_ipmi_fields(field, TEMPERATURE_NAME, VALUE)
            if metric_name == IPMIPOWERSTATE:
                fill_ipmi_fields(field, POWER, STATE)
            if metric_name == IPMIPOWERWATTS:
                fill_ipmi_fields(field, POWER, VALUE)
            if metric_name == IPMIVOLTAGESTATE:
                fill_ipmi_fields(field, VOLTAGE, STATE)
            if metric_name == IPMIVOLTAGEVOLTS:
                fill_ipmi_fields(field, VOLTAGE, VALUE)

    res_ipmi = []
    states_dict = {
        '0': NOMINAL,
        '1': WARNING,
        '2': CRITICAL
    }
    def add_ipmi_field(metric_type):
        metric_details = {
            TYPE: metric_type,
            UNIT: IPMI_UNITS[metric_type],
            METRICS: [],
            NOMINAL_COUNT: 0,
            WARNING_COUNT: 0,
            CRITICAL_COUNT: 0
            }
        for key in ipmi[metric_type]:
            value = ipmi[metric_type][key]
            metric_details[METRICS].append({
                NAME: key,
                STATE: states_dict[value[STATE]] if STATE in value else "",
                VALUE: value[VALUE] if VALUE in value else ""
            })
            if STATE in value:
                update_state_count(states_dict[value[STATE]])
                update_field_state_count(states_dict[value[STATE]], metric_details)
        res_ipmi.append(metric_details)

    add_ipmi_field(FAN_SPEED)
    add_ipmi_field(POWER)
    add_ipmi_field(SENSOR_VALUE)
    add_ipmi_field(VOLTAGE)
    add_ipmi_field(TEMPERATURE_NAME)
    res_dict[IPMI] = res_ipmi

    res_dict[TOTALNOMINALS] = total_nominals
    res_dict[TOTALWARNINGS] = total_warnings
    res_dict[TOTALCRITICALS] = total_criticals
    return res_dict

def set_telemetry_properties(properties):
    props = {}
    for prop in properties:
        for field in prop["fields"]:
            if field["isSet"]:
                props[field["field"]] = None
    params = {
        "param": {
            "metrics_to_publish": props
        }
    }
    return ibofos.set_telemetry_properties(params)

def get_telemetry_properties():
    f = io.open('util/telemetry/fields.json', 'r', encoding='utf-8')
    props = json.loads(f.read())
    status = False
    dagent_telemetry_properties = ibofos.get_telemetry_properties()
    try:
        if "result" in dagent_telemetry_properties and \
            "data" in dagent_telemetry_properties["result"]:
            if "metrics_to_publish" in dagent_telemetry_properties["result"]["data"]:
                metrics = dagent_telemetry_properties["result"]["data"]["metrics_to_publish"]
                for prop in props:
                    for field in prop["fields"]:
                        if field["field"] in metrics:
                            field["isSet"] = True
                        else:
                            field["isSet"] = False
            if "telemetryStatus" in dagent_telemetry_properties["result"]["data"] and \
                "status" in dagent_telemetry_properties["result"]["data"]["telemetryStatus"]:
                status = dagent_telemetry_properties["result"]["data"]["telemetryStatus"]["status"]
        return {
            "status": status,
            "properties": props
        }
    except Exception:
        return {
            "status": False,
            "properties": []
        }

if __name__ == '__main__':
    # print('sys perf')
    # print(get_load())
    pass
