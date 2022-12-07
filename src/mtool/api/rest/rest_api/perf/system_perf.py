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
import json
import io

READ_IOPS_VOLUME = 'read_iops_volume'
WRITE_IOPS_VOLUME = 'write_iops_volume'
READ_BPS_VOLUME = 'read_bps_volume'
WRITE_BPS_VOLUME = 'write_bps_volume'
READ_AVG_LAT_VOLUME = 'read_avg_lat_volume'
WRITE_AVG_LAT_VOLUME = 'write_avg_lat_volume'
TEMPERATURE = 'temperature'
WARNINGTEMPERATURETIME = 'warning_temperature_time'
CRITICALTEMPERATURETIME = 'critical_temperature_time'
AVAILABLESPARE = 'available_spare'
AVAILABLESPARETHRESOLD = 'available_spare_threshold'
IPMIFANSPEEDSTATE = 'ipmi_fan_speed_state'
IPMIFANSPEEDRPM = 'ipmi_fan_speed_rpm'
IPMIPOWERSTATE = 'ipmi_power_state'
IPMIPOWERWATTS = 'ipmi_power_watts'
IPMISENSORSTATE = 'ipmi_sensor_state'
IPMISENSORVALUE = 'ipmi_sensor_value'
IPMIVOLTAGESTATE = 'ipmi_voltage_state'
IPMIVOLTAGEVOLTS = 'ipmi_voltage_volts'
IPMITEMPERATURESTATE = 'ipmi_temperature_state'
IPMITEMPERATURECELCIUS = 'ipmi_temperature_celsius'
IPMICHASSISPOWERSTATE = 'ipmi_chassis_power_state'
NOMINAL = "nominal"
WARNING = "warning"
CRITICAL = "critical"
NOMINAL_COUNT = "nominal_count"
WARNING_COUNT = "warning_count"
CRITICAL_COUNT = "critical_count"
FAN_SPEED = "Fan Speed"
POWER = "Power"
SENSOR_VALUE = "Sensor Value"
VOLTAGE = "Voltage"
TEMPERATURE_NAME = "Temperature"
AVAILABLESPARE_NAME= "Available Spare"

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
    device_metrics = [ TEMPERATURE, WARNINGTEMPERATURETIME, 
        CRITICALTEMPERATURETIME, AVAILABLESPARE, AVAILABLESPARETHRESOLD]
    bmc_metrics = [ IPMIFANSPEEDSTATE, IPMIFANSPEEDRPM,
        IPMIPOWERSTATE, IPMIPOWERWATTS, IPMISENSORSTATE, 
        IPMISENSORVALUE, IPMIVOLTAGESTATE, IPMIVOLTAGEVOLTS, 
        IPMITEMPERATURESTATE, IPMITEMPERATURECELCIUS, IPMICHASSISPOWERSTATE ]
    device_res = telemetry.get_device_metrics_values(ip, port, device_metrics)
    if device_res['status'] != 'success':
        return device_res
    
    total_nominal = 0
    total_warning = 0
    total_critical = 0

    def update_state_count(state):
        nonlocal total_nominal, total_warning, total_critical
        total_nominal += 1 if state == NOMINAL else 0
        total_warning += 1 if state == WARNING else 0
        total_critical += 1 if state == CRITICAL else 0
    
    def update_field_state_count(state, field):
        field[NOMINAL_COUNT] += 1 if state == NOMINAL else 0
        field[WARNING_COUNT] += 1 if state == WARNING else 0
        field[CRITICAL_COUNT] += 1 if state == CRITICAL else 0

    devices= {}
    for field in device_res['data']['result']:
        if field['metric']['publisher_name'] != 'Disk_Monitoring':
            continue
        device_name = field['metric']['nvme_ctrl_id']
        metric_name = field['metric']['__name__']
        if device_name not in devices:
            devices[device_name] = {}
        if metric_name == AVAILABLESPARE:
            devices[device_name][AVAILABLESPARE] = field['value'][1]
        if metric_name == AVAILABLESPARETHRESOLD:
            devices[device_name][AVAILABLESPARETHRESOLD] = field['value'][1]
        if metric_name == TEMPERATURE:
            devices[device_name][TEMPERATURE] = field['value'][1]
        if metric_name == CRITICALTEMPERATURETIME:
            devices[device_name][CRITICALTEMPERATURETIME] = field['value'][1]
        if metric_name == WARNINGTEMPERATURETIME:
            devices[device_name][WARNINGTEMPERATURETIME] = field['value'][1]
    
    res_devices = []
    temperature_dict = {
        'type': TEMPERATURE_NAME,
        'metrics': [],
        NOMINAL_COUNT: 0,
        WARNING_COUNT: 0,
        CRITICAL_COUNT: 0,
    }
    availablespare_dict = {
        'type': AVAILABLESPARE_NAME,
        'metrics': [],
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
            'name': key,
            'state': tstate,
            'value': value[TEMPERATURE]
        }
        availablespare = {
            'name': key,
            'state': sstate,
            'value': value[AVAILABLESPARE]
        }
        temperature_dict['metrics'].append(temperature)
        availablespare_dict['metrics'].append(availablespare)
        update_state_count(tstate)
        update_state_count(sstate)
        update_field_state_count(tstate, temperature_dict) 
        update_field_state_count(sstate, availablespare_dict) 
    res_devices.append(temperature_dict)
    res_devices.append(availablespare_dict)

    bmc_res = telemetry.get_bmc_metrics_values(ip, port, bmc_metrics)
    if bmc_res['status'] != 'success':
        return bmc_res
     
    bmcs = {
        FAN_SPEED: {},
        POWER: {},
        SENSOR_VALUE: {},
        VOLTAGE: {},
        TEMPERATURE_NAME: {},
    }
    def fill_bmc_fields(field, metric_type,value_type):
        if 'name' not in field['metric']:
            return
        name = field['metric']['name']
        value= field['value'][1]
        if name not in bmcs[metric_type]:
            bmcs[metric_type][name] = {}
        if(value_type == 'state'):
            bmcs[metric_type][name]['state'] = value
        if(value_type == 'value'):
            bmcs[metric_type][name]['value'] = value

    for field in bmc_res['data']['result']:
        metric_name = field['metric']['__name__']
        if metric_name == IPMIFANSPEEDSTATE:
            fill_bmc_fields(field, FAN_SPEED, 'state')
        if metric_name == IPMIFANSPEEDRPM:
            fill_bmc_fields(field, FAN_SPEED, 'value')
        if metric_name == IPMISENSORSTATE:
            fill_bmc_fields(field, SENSOR_VALUE, 'state')
        if metric_name == IPMISENSORVALUE:
            fill_bmc_fields(field, SENSOR_VALUE, 'value')
        if metric_name == IPMITEMPERATURESTATE:
            fill_bmc_fields(field, TEMPERATURE_NAME, 'state')
        if metric_name == IPMITEMPERATURECELCIUS:
            fill_bmc_fields(field, TEMPERATURE_NAME, 'value')
        if metric_name == IPMIPOWERSTATE:
            fill_bmc_fields(field, POWER, 'state')
        if metric_name == IPMIPOWERWATTS:
            fill_bmc_fields(field, POWER, 'value')
        if metric_name == IPMIVOLTAGESTATE:
            fill_bmc_fields(field, VOLTAGE, 'state')
        if metric_name == IPMIVOLTAGEVOLTS:
            fill_bmc_fields(field, VOLTAGE, 'value')

    res_bmcs = []
    states_dict = {
        '0': NOMINAL,
        '1': WARNING,
        '2': CRITICAL
    }
    def add_bmc_field(metric_type):
        metric_details = {
            'type': metric_type,
            'metrics': [],
            NOMINAL_COUNT: 0,
            WARNING_COUNT: 0,
            CRITICAL_COUNT: 0,
            }
        for key in bmcs[metric_type]:
            value = bmcs[metric_type][key]
            metric_details['metrics'].append({
                'name': key,
                'state': states_dict[value['state']],
                'value': value['value']
            })
            update_state_count(states_dict[value['state']])
            update_field_state_count(states_dict[value['state']], metric_details)
        res_bmcs.append(metric_details)

    add_bmc_field(FAN_SPEED)
    add_bmc_field(POWER)
    add_bmc_field(SENSOR_VALUE)
    add_bmc_field(VOLTAGE)
    add_bmc_field(TEMPERATURE_NAME)

    res_dict = {}
    res_dict['devices'] = res_devices
    res_dict['bmc'] = res_bmcs
    res_dict['ipmi_chassis_power_state'] = 1
    res_dict['total_nominal'] = total_nominal
    res_dict['total_warning'] = total_warning
    res_dict['total_critical'] = total_critical
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
