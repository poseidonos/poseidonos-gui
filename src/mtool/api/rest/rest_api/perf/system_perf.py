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

def get_agg_volumes_perf(ip, port):
    READ_IOPS_VOLUME = 'read_iops_volume'
    WRITE_IOPS_VOLUME = 'write_iops_volume'
    READ_BPS_VOLUME = 'read_bps_volume'
    WRITE_BPS_VOLUME = 'write_bps_volume'
    READ_AVG_LAT_VOLUME = 'read_avg_lat_volume'
    WRITE_AVG_LAT_VOLUME = 'write_avg_lat_volume'

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
    metrics = [ TEMPERATURE, WARNINGTEMPERATURETIME, CRITICALTEMPERATURETIME,
        AVAILABLESPARE, AVAILABLESPARETHRESOLD, IPMIFANSPEEDSTATE, IPMIFANSPEEDRPM,
        IPMIPOWERSTATE, IPMIPOWERWATTS, IPMISENSORSTATE, IPMISENSORVALUE,
        IPMIVOLTAGESTATE, IPMIVOLTAGEVOLTS, IPMITEMPERATURESTATE,
        IPMITEMPERATURECELCIUS, IPMICHASSISPOWERSTATE ]
    res = telemetry.get_all_hardware_metrics_values(ip, port, metrics)
    res_dict = {}
    if res['status'] != 'success':
        return res
    devices = {}
    for field in res['data']['result']:
        if field['metric']['publisher_name'] == 'Disk_Monitoring':
            device_name = field['metric']['nvme_ctrl_id']
            if device_name not in devices:
                devices[device_name] = {}
            if field['metric']['__name__'] == AVAILABLESPARE:
                devices[device_name][AVAILABLESPARE] = field['value'][1]
            if field['metric']['__name__'] == AVAILABLESPARETHRESOLD:
                devices[device_name][AVAILABLESPARETHRESOLD] = field['value'][1]
            if field['metric']['__name__'] == TEMPERATURE:
                devices[device_name][TEMPERATURE] = field['value'][1]
            if field['metric']['__name__'] == CRITICALTEMPERATURETIME:
                devices[device_name][CRITICALTEMPERATURETIME] = field['value'][1]
            if field['metric']['__name__'] == WARNINGTEMPERATURETIME:
                devices[device_name][WARNINGTEMPERATURETIME] = field['value'][1]
    NOMINAL = "nominal"
    WARNING = "warning"
    CRITICAL = "critical"
    total_nominal = 0
    total_warning = 0
    total_critical = 0
    res_devices = [{}]
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
        res_device = {}
        res_device['name'] = key
        res_device['temperature'] = {
            'state': tstate,
            'value': value[TEMPERATURE]
        }
        res_device['available_spare'] = {
            'state': sstate,
            'value': value[AVAILABLESPARE]
        }
        res_devices.append(res_device)
        total_nominal += 1 if tstate == NOMINAL else 0
        total_warning += 1 if tstate == WARNING else 0
        total_critical += 1 if tstate == CRITICAL else 0
        total_nominal += 1 if sstate == NOMINAL else 0
        total_warning += 1 if sstate == WARNING else 0
        total_critical += 1 if sstate == CRITICAL else 0
    res_dict['devices'] = res_devices
    res_dict['bmc'] = [
        { 'name': "Ipmi Fan Speed", 'value': '5' +' rpm', 'state': WARNING},
        { 'name': "Ipmi Power", 'value': '20' +' watts', 'state': NOMINAL},
        { 'name': "Ipmi Sensor Value", 'value': '9' , 'state': WARNING},
        { 'name': "Ipmi Voltage", 'value': '200' + ' volts', 'state': NOMINAL},
        { 'name': "Ipmi Temperature Celcius", 'value': '58' +" digree", 'state': CRITICAL},
    ]
    total_warning += 2
    total_nominal += 2
    total_critical += 1
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
