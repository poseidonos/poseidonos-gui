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
from rest.rest_api.dagent import metrics
from rest.rest_api.dagent import ibofos
import json

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
    f = open('util/telemetry/fields.json')
    props = json.loads(f.read())
    status = False
    dagent_telemetry_properties = ibofos.get_telemetry_properties()
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

if __name__ == '__main__':
    # print('sys perf')
    # print(get_load())
    pass
