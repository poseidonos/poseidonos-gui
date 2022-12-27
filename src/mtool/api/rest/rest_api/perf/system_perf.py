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
import util.macros.performance as constants
import json
import io


def get_agg_volumes_perf(ip, port):
    read_bw = telemetry.get_agg_value(ip,port,constants.READ_BPS_VOLUME)
    write_bw = telemetry.get_agg_value(ip,port,constants.WRITE_BPS_VOLUME)
    read_iops = telemetry.get_agg_value(ip,port,constants.READ_IOPS_VOLUME)
    write_iops = telemetry.get_agg_value(ip,port,constants.WRITE_IOPS_VOLUME)
    read_latency = telemetry.get_agg_value(ip,port,constants.READ_AVG_LAT_VOLUME)
    write_latency = telemetry.get_agg_value(ip,port,constants.WRITE_AVG_LAT_VOLUME)

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
        constants.DEVICES : [],
        constants.ERRORINDEVICES : False,
        constants.IPMI : [],
        constants.ERRORINIPMI: False,
        constants.ISIPMICHASSISPOWERON: False,
        constants.TOTALNOMINALS: 0,
        constants.TOTALWARNINGS: 0,
        constants.TOTALCRITICALS: 0,
    }
    device_res = telemetry.get_device_metrics_values(ip, port, constants.DEVICE_METRICS)
    if 'status' not in device_res or device_res['status'] != 'success':
        res_dict[constants.ERRORINDEVICES] = True
    
    total_nominals = 0
    total_warnings = 0
    total_criticals = 0

    def update_state_count(state):
        nonlocal total_nominals, total_warnings, total_criticals
        total_nominals += 1 if state == constants.NOMINAL else 0
        total_warnings += 1 if state == constants.WARNING else 0
        total_criticals += 1 if state == constants.CRITICAL else 0
    
    def update_field_state_count(state, field):
        field[constants.NOMINAL_COUNT] += 1 if state == constants.NOMINAL else 0
        field[constants.WARNING_COUNT] += 1 if state == constants.WARNING else 0
        field[constants.CRITICAL_COUNT] += 1 if state == constants.CRITICAL else 0

    devices= {}
    if res_dict[constants.ERRORINDEVICES] == False:
        for field in device_res['data']['result']:
            if field['metric']['publisher_name'] != 'Disk_Monitoring':
                continue
            device_name = field['metric']['nvme_ctrl_id']
            metric_name = field['metric']['__name__']
            if device_name not in devices:
                devices[device_name] = {}
            if metric_name == constants.AVAILABLESPARE:
                devices[device_name][constants.AVAILABLESPARE] = field[constants.VALUE][1]
            if metric_name == constants.AVAILABLESPARETHRESOLD:
                devices[device_name][constants.AVAILABLESPARETHRESOLD] = field[constants.VALUE][1]
            if metric_name == constants.TEMPERATURE:
                devices[device_name][constants.TEMPERATURE] = field[constants.VALUE][1]
            if metric_name == constants.CRITICALTEMPERATURETIME:
                devices[device_name][constants.CRITICALTEMPERATURETIME] = field[constants.VALUE][1]
            if metric_name == constants.WARNINGTEMPERATURETIME:
                devices[device_name][constants.WARNINGTEMPERATURETIME] = field[constants.VALUE][1]

    res_devices = []
    temperature_dict = {
        constants.TYPE: constants.TEMPERATURE_NAME,
        constants.UNIT: constants.DEVICE_UNITS[constants.TEMPERATURE_NAME],
        constants.METRICS: [],
        constants.NOMINAL_COUNT: 0,
        constants.WARNING_COUNT: 0,
        constants.CRITICAL_COUNT: 0,
    }
    availablespare_dict = {
        constants.TYPE: constants.AVAILABLESPARE_NAME,
        constants.UNIT: constants.DEVICE_UNITS[constants.AVAILABLESPARE_NAME],
        constants.METRICS: [],
        constants.NOMINAL_COUNT: 0,
        constants.WARNING_COUNT: 0,
        constants.CRITICAL_COUNT: 0,
    }
    for key in devices:
        value = devices[key]
        tstate = constants.NOMINAL
        if value[constants.WARNINGTEMPERATURETIME] != '0':
            tstate = constants.WARNING
        if value[constants.CRITICALTEMPERATURETIME] != '0':
            tstate = constants.CRITICAL
        sstate = constants.NOMINAL
        if value[constants.AVAILABLESPARE] < value[constants.AVAILABLESPARETHRESOLD]:
            sstate = constants.WARNING
        if value[constants.AVAILABLESPARE] == '0':
            sstate = constants.CRITICAL
        temperature ={
            constants.NAME: key,
            constants.STATE: tstate,
            constants.VALUE: value[constants.TEMPERATURE]
        }
        availablespare = {
            constants.NAME: key,
            constants.STATE: sstate,
            constants.VALUE: value[constants.AVAILABLESPARE]
        }
        temperature_dict[constants.METRICS].append(temperature)
        availablespare_dict[constants.METRICS].append(availablespare)
        update_state_count(tstate)
        update_state_count(sstate)
        update_field_state_count(tstate, temperature_dict) 
        update_field_state_count(sstate, availablespare_dict) 
    res_devices.append(temperature_dict)
    res_devices.append(availablespare_dict)
    res_dict[constants.DEVICES] = res_devices

    ipmi_res = telemetry.get_ipmi_metrics_values(ip, port, constants.IPMI_METRICS)
    if 'status' not in ipmi_res or ipmi_res['status'] != 'success':
        res_dict[constants.ERRORINIPMI] = True

    ipmi = {
        constants.FAN_SPEED: {},
        constants.POWER: {},
        constants.SENSOR_VALUE: {},
        constants.VOLTAGE: {},
        constants.TEMPERATURE_NAME: {},
    }
    def fill_ipmi_fields(field, metric_type,value_type):
        if constants.NAME not in field['metric']:
            return
        name = field['metric'][constants.NAME]
        value= field[constants.VALUE][1]
        if name not in ipmi[metric_type]:
            ipmi[metric_type][name] = {}
        if(value_type == constants.STATE):
            ipmi[metric_type][name][constants.STATE] = value
        if(value_type == constants.VALUE):
            ipmi[metric_type][name][constants.VALUE] = value

    if res_dict[constants.ERRORINIPMI] == False:
        for field in ipmi_res['data']['result']:
            metric_name = field['metric']['__name__']
            if metric_name == constants.IPMICHASSISPOWERSTATE and field[constants.VALUE][1] == '1':
                res_dict[constants.ISIPMICHASSISPOWERON] = True
            if metric_name == constants.IPMIFANSPEEDSTATE:
                fill_ipmi_fields(field, constants.FAN_SPEED, constants.STATE)
            if metric_name == constants.IPMIFANSPEEDRPM:
                fill_ipmi_fields(field, constants.FAN_SPEED, constants.VALUE)
            if metric_name == constants.IPMISENSORSTATE:
                fill_ipmi_fields(field, constants.SENSOR_VALUE, constants.STATE)
            if metric_name == constants.IPMISENSORVALUE:
                fill_ipmi_fields(field, constants.SENSOR_VALUE, constants.VALUE)
            if metric_name == constants.IPMITEMPERATURESTATE:
                fill_ipmi_fields(field, constants.TEMPERATURE_NAME, constants.STATE)
            if metric_name == constants.IPMITEMPERATURECELCIUS:
                fill_ipmi_fields(field, constants.TEMPERATURE_NAME, constants.VALUE)
            if metric_name == constants.IPMIPOWERSTATE:
                fill_ipmi_fields(field, constants.POWER, constants.STATE)
            if metric_name == constants.IPMIPOWERWATTS:
                fill_ipmi_fields(field, constants.POWER, constants.VALUE)
            if metric_name == constants.IPMIVOLTAGESTATE:
                fill_ipmi_fields(field, constants.VOLTAGE, constants.STATE)
            if metric_name == constants.IPMIVOLTAGEVOLTS:
                fill_ipmi_fields(field, constants.VOLTAGE, constants.VALUE)

    res_ipmi = []
    states_dict = {
        '0': constants.NOMINAL,
        '1': constants.WARNING,
        '2': constants.CRITICAL
    }
    def add_ipmi_field(metric_type):
        metric_details = {
            constants.TYPE: metric_type,
            constants.UNIT: constants.IPMI_UNITS[metric_type],
            constants.METRICS: [],
            constants.NOMINAL_COUNT: 0,
            constants.WARNING_COUNT: 0,
            constants.CRITICAL_COUNT: 0
            }
        for key in ipmi[metric_type]:
            value = ipmi[metric_type][key]
            metric_details[constants.METRICS].append({
                constants.NAME: key,
                constants.STATE: states_dict[value[constants.STATE]] if constants.STATE in value else "",
                constants.VALUE: value[constants.VALUE] if constants.VALUE in value else ""
            })
            if constants.STATE in value:
                update_state_count(states_dict[value[constants.STATE]])
                update_field_state_count(states_dict[value[constants.STATE]], metric_details)
        res_ipmi.append(metric_details)

    add_ipmi_field(constants.FAN_SPEED)
    add_ipmi_field(constants.POWER)
    add_ipmi_field(constants.SENSOR_VALUE)
    add_ipmi_field(constants.VOLTAGE)
    add_ipmi_field(constants.TEMPERATURE_NAME)
    res_dict[constants.IPMI] = res_ipmi

    res_dict[constants.TOTALNOMINALS] = total_nominals
    res_dict[constants.TOTALWARNINGS] = total_warnings
    res_dict[constants.TOTALCRITICALS] = total_criticals
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

