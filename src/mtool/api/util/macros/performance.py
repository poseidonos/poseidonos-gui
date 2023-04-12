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
DEVICE_METRICS = [ TEMPERATURE, WARNINGTEMPERATURETIME,
        CRITICALTEMPERATURETIME, AVAILABLESPARE, AVAILABLESPARETHRESOLD ]
TEMPERATURE_NAME = "Temperatures"
AVAILABLESPARE_NAME= "Spares"
DEVICE_UNITS={
    TEMPERATURE_NAME: "kelvin",
    AVAILABLESPARE_NAME: "available %"
}
NOMINAL = "nominal"
WARNING = "warning"
CRITICAL = "critical"
NOMINAL_COUNT = "nominals"
WARNING_COUNT = "warnings"
CRITICAL_COUNT = "criticals"
DEVICES = "devices"
ERRORINDEVICES = "errorInDevices"
TOTALNOMINALS = "totalNominals"
TOTALWARNINGS = "totalWarnings"
TOTALCRITICALS = "totalCriticals"
TYPE = "type"
UNIT = "unit"
METRICS = "metrics"
NAME = "name"
STATE = "state"
VALUE = "value"
