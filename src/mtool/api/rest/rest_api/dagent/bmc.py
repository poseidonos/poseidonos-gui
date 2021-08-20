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
 
'''
import requests
import uuid
import time
import datetime
import json
import logging
import dateutil.parser as dp
from logging.handlers import RotatingFileHandler
from flask import jsonify
from util.db.influx import get_connection
from util.macros.influxdb_config import mtool_db
DAGENT_BMC_URL = 'http://localhost:3000'
CHASSIS_URL = '/redfish/v1/Chassis'
SYSTEM_URL = '/redfish/v1/Systems'
MANAGER_URL = '/redfish/v1/Managers'
AUTH = 'Basic cm9vdDowcGVuQm1j'



class BreakLoopsException(Exception):
    pass


def get_headers(
        auth=AUTH,
        content_type="application/json"):
    return {"X-Request-Id": str(uuid.uuid4()),
            "Accept": content_type,
            "Authorization": auth,
            "ts": str(int(time.time()))}


def send_command_to_bmc(req_type, url, headers, timeout=None, data=None):
    retry_count = 0
    response = None
    try:
        while(1):
            if(req_type == "GET"):
                response = requests.get(
                    url=url, headers=headers, timeout=timeout)
            elif(req_type == "POST"):
                response = requests.post(
                    url=url, headers=headers, timeout=timeout, data=data)
            retry_count = retry_count + 1
            if(response['result'] and response['result']['status'] and response['result']['status']['code'] and response['result']['status']['code'] != '12000'):
                return response
            if(retry_count >= 5):
                return response
    except Exception as err:
        print("Exception in send_command_to_bmc ",err)
        return response


def check_bmc_login(auth):
    req_headers = get_headers(auth)
    logger = logging.getLogger(__name__)
    logger.info('%s', 'fetch all bmc logs...')
    try:
        response = send_command_to_bmc(
            "GET",
            url=DAGENT_BMC_URL +
            SYSTEM_URL,
            headers=req_headers,
            timeout=(
                10,
                10))
        if(response.status_code != 200):
            return False
        return True
    except Exception as err:
        print(f'Other error occurred: {err}')
        return False


def get_chassis_info(redfish_url=CHASSIS_URL, auth=AUTH):
    req_headers = get_headers(auth)
    logger = logging.getLogger(__name__)
    logger.info('%s', 'parse data members...')
    try:
        res = send_command_to_bmc(
            "GET",
            url=DAGENT_BMC_URL +
            redfish_url,
            headers=req_headers,
            timeout=(
                30,
                30))
        chassis_info = []
        res = res.json()
        for chassis_id in range(0, res["Members@odata.count"]):
            KTNF_response = send_command_to_bmc(
                "GET",
                url=DAGENT_BMC_URL + str(
                    res['Members'][chassis_id]['@odata.id']),
                headers=req_headers,
                timeout=(
                    30,
                    30))
            KTNF_response = KTNF_response.json()
            chassis_info.append(KTNF_response)
        return chassis_info
    except Exception as err:
        print(f'Other error occurred: {err}')
    return {"result": "could not parse redfish response", "return": -1}


def get_server_info(auth=AUTH):
    #req_headers = get_headers(auth)
    logger = logging.getLogger(__name__)
    logger.info('%s', 'parse server info...')
    try:
        model, manufacturer, firmwareversion, serialno, ip, mac, host = 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA'
        bmc_info = get_chassis_info(MANAGER_URL)
        try:
            for i in range(0, len(bmc_info)):
                if "FirmwareVersion" in bmc_info[i] and "EthernetInterfaces" in bmc_info[i]:
                    firmwareversion = bmc_info[i]['FirmwareVersion']
                    if "@odata.id" in bmc_info[i]['EthernetInterfaces']:
                        ethernet_info = get_chassis_info(
                            str(bmc_info[i]['EthernetInterfaces']['@odata.id']))
                        for j in range(0, len(ethernet_info)):
                            if "IPv4Addresses" in ethernet_info[j] and "MACAddress" in ethernet_info[j]:
                                mac = ethernet_info[j]['MACAddress']
                                for k in range(
                                    0, len(
                                        ethernet_info[j]['IPv4Addresses'])):
                                    # print('here',ethernet_info[j]['IPv4Addresses']);
                                    if "Address" in ethernet_info[j]['IPv4Addresses'][k]:
                                        ip = ethernet_info[j]['IPv4Addresses'][k]['Address']
                                        raise BreakLoopsException
        except BreakLoopsException:
            pass
        return jsonify({"model": model,
                        "manufacturer": manufacturer,
                        "firmwareversion": firmwareversion,
                        "serialno": serialno,
                        "ip": ip,
                        "mac": mac,
                        "host": host})
    except Exception as err:
        print(f'Other error occurred: {err}')
    return {"result": "could not get the system state", "return": -1}

"""
def get_power_info_old(auth='Basic QURNSU46QURNSU4='):
    req_headers = get_headers(auth)
    logger = logging.getLogger(__name__)
    logger.info('%s', 'parse power info...')
    try:
        chassis_info = get_chassis_info()
        response = send_command_to_bmc(
            "GET",
            url=DAGENT_BMC_URL +
            chassis_info[0]['Power']['@odata.id'],
            headers=req_headers,
            timeout=(
                20,
                20))
        response = response.json()
        power_arr = response['PowerSupplies']
        total_power_consumption = '0'
        for i in range(0, len(power_arr)):
            total_power_consumption = str(
                int(total_power_consumption) + int(power_arr[i]['PowerInputWatts']))
        response = send_command_to_bmc(
            "GET",
            url=DAGENT_BMC_URL +
            '/redfish/v1/Systems/system',
            headers=req_headers,
            timeout=(
                20,
                20))
        response = response.json()
        powerstatus = str(response['PowerState'])
        return jsonify({"powerconsumption": total_power_consumption,
                        "powercap": "NA", "powerstatus": powerstatus})
    except Exception as err:
        print(f'Other error occurred: {err}')
    return {"result": "could not get the power info", "return": -1}
"""

def get_power_info(auth=AUTH):
        #req_headers = get_headers(auth)
        logger = logging.getLogger(__name__)
        logger.info('%s', 'parse power info...')
        total_power_consumption = 0
        powerstatus = 'Off'
        chassis_info = get_chassis_info()
        try:
            for i in range(0, len(chassis_info)):
                if "Sensors" in chassis_info[i]:
                    if "@odata.id" in chassis_info[i]['Sensors']:
                        sensors_info = get_chassis_info(
                            chassis_info[i]['Sensors']['@odata.id'])
                        for j in range(0, len(sensors_info)):
                            if "Name" in sensors_info[j] and "Reading" in sensors_info[
                                    j] and "Power" in sensors_info[j]['Name'] and "Input" in sensors_info[j]['Name']:
                                total_power_consumption = total_power_consumption + \
                                    int(sensors_info[j]['Reading'])
            systems_info = get_chassis_info(SYSTEM_URL)
            for i in range(0, len(systems_info)):
                if "PowerState" in systems_info[i]:
                    powerstatus = str(systems_info[i]['PowerState'])
        except BaseException:
            pass
        return jsonify({"powerconsumption": total_power_consumption,
                        "powercap": "NA", "powerstatus": powerstatus})


def get_basic_redfish_url(auth=AUTH):
    req_headers = get_headers(auth)
    logger = logging.getLogger(__name__)
    logger.info('%s', 'get generic url info...')
    try:
        print("once")
        response = send_command_to_bmc(
            "GET",
            url=DAGENT_BMC_URL +
            '/redfish/v1/',
            headers=req_headers,
            timeout=(
                20,
                20))
        response = response.json()
        #SYSTEM_URL = response['Systems']['@odata.id']
        #CHASSIS_URL = response['Chassis']['@odata.id']
        #MANAGER_URL = response['Managers']['@odata.id']
        return jsonify({'response': 'success'})
    except Exception as err:
        print(f'Other error occurred: {err}')
    return {"result": "could not get generic url info", "return": -1}


def get_chassis_front_info(auth=AUTH):
        req_headers = get_headers(auth)
        logger = logging.getLogger(__name__)
        logger.info('%s', 'parse drives info...')
        drives_arr = []
        drives = []
        systems_info = get_chassis_info(SYSTEM_URL)
        try:
            for i in range(0, len(systems_info)):
                if "Storage" in systems_info[i]:
                    if "@odata.id" in systems_info[i]['Storage']:
                        storage_info = get_chassis_info(
                            systems_info[i]['Storage']['@odata.id'])
                        for j in range(0, len(storage_info)):
                            if "Drives" in storage_info[j]:
                                drives = storage_info[i]['Drives']
                                for k in range(0, len(drives)):
                                    if "@odata.id" in drives[k]:
                                        response = send_command_to_bmc(
                                            "GET",
                                            url=DAGENT_BMC_URL +
                                            drives[k]['@odata.id'],
                                            headers=req_headers,
                                            timeout=(
                                                20,
                                                20))
                                        response = response.json()
                                        drives_arr.append(response)
        except BaseException:
            pass
        return jsonify({"front_info": drives_arr})

"""
def get_chassis_rear_info(auth='Basic QURNSU46QURNSU4='):
    req_headers = get_headers(auth)
    logger = logging.getLogger(__name__)
    logger.info('%s', 'parse drives info...')
    try:
        chassis_info = get_chassis_info()
        response = send_command_to_bmc(
            "GET",
            url=DAGENT_BMC_URL +
            chassis_info[0]['Drives']['@odata.id'],
            headers=req_headers,
            timeout=(
                20,
                20))
        response = response.json()
        drive_info = str(response['Drive'])
        return jsonify({"front_info": drive_info})
    except Exception as err:
        print(f'Other error occurred: {err}')
    return {"result": "could not get the chassis rear info", "return": -1}
"""

def process_chassis_info(systems_info, request_body, req_headers, status):
	try:
		for i in range(0, len(systems_info)):
			if "Actions" in systems_info[i] and "#ComputerSystem.Reset" in systems_info[i][
					'Actions'] and "target" in systems_info[i]['Actions']['#ComputerSystem.Reset']:

				response = send_command_to_bmc(
					"POST",
					url=DAGENT_BMC_URL +
					systems_info[i]['Actions']['#ComputerSystem.Reset']['target'],
					headers=req_headers,
					timeout=(
						20,
						20),
					data=request_body)
				response = response.json()
				if "@Message.ExtendedInfo" in response:
					for j in range(0,
								   len(response['@Message.ExtendedInfo'])):
						if "Message" in response['@Message.ExtendedInfo'][j] and "Success" in response['@Message.ExtendedInfo'][j]['Message']:
							return jsonify({status: 'success'})
						else:
							return response
	except BaseException:
		pass
def power_on_system(auth=AUTH):
    req_headers = get_headers(auth)
    logger = logging.getLogger(__name__)
    logger.info('%s', 'power on bmc...')
    try:
        # To  Do
        systems_info = get_chassis_info(SYSTEM_URL)
        request_body = {"ResetType": 'On'}
        request_body = json.dumps(request_body)
        response = process_chassis_info(systems_info, request_body, req_headers,"poweron")
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return {"result": "could not power on", "return": -1}


def reboot_system(auth=AUTH):
    req_headers = get_headers(auth)
    logger = logging.getLogger(__name__)
    logger.info('%s', 'reboot bmc...')
    try:
        # To  Do
        systems_info = get_chassis_info(SYSTEM_URL)
        request_body = {"ResetType": 'ForceRestart'}
        request_body = json.dumps(request_body)
        response = process_chassis_info(systems_info, request_body, req_headers,"reboot")
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return {"result": "could not reboot", "return": -1}


def shutdown_system(auth=AUTH):
    req_headers = get_headers(auth)
    logger = logging.getLogger(__name__)
    logger.info('%s', 'graceful shutdown...')
    try:
        # To  Do
        systems_info = get_chassis_info(SYSTEM_URL)
        request_body = {"ResetType": 'GracefulShutdown'}
        request_body = json.dumps(request_body)
        response = process_chassis_info(systems_info, request_body, req_headers,"shutdown")
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return {"result": "could not shutdown", "return": -1}


def force_shutdown_system(auth=AUTH):
    req_headers = get_headers(auth)
    logger = logging.getLogger(__name__)
    logger.info('%s', 'force off system...')
    try:
        # To  Do
        systems_info = get_chassis_info(SYSTEM_URL)
        request_body = {"ResetType": 'ForceOff'}
        request_body = json.dumps(request_body)
        response = process_chassis_info(systems_info, request_body, req_headers,"ForceOff")
        return response
    except Exception as err:
        print(f'Other error occurred: {err}')
    return {"result": "could not force power off", "return": -1}


def get_power_sensor_info(auth=AUTH):
        req_headers = get_headers(auth)
        logger = logging.getLogger(__name__)
        logger.info('%s', 'parse sensor info...')
        # To  Do
        power_info_arr = []
        #volatage_arr = []
        chassis_info = get_chassis_info()
        try:
            for i in range(0, len(chassis_info)):
                if "Sensors" in chassis_info[i] and "@odata.id" in chassis_info[i]['Sensors']:
                    sensors_info = get_chassis_info(
                        chassis_info[i]['Sensors']['@odata.id'])
                    for j in range(0, len(sensors_info)):
                        if ("Name" in sensors_info[j] and "Power" in sensors_info[j]['Name'] and "Input" in sensors_info[j]['Name']) or (
                                "Name" in sensors_info[j] and "Power" in sensors_info[j]['Name'] and "Output" in sensors_info[j]['Name']):
                            power_info_arr.append(sensors_info[j])
                if "Power" in chassis_info[i] and "@odata.id" in chassis_info[i]['Power']:
                    response = send_command_to_bmc(
                        "GET",
                        url=DAGENT_BMC_URL +
                        chassis_info[i]['Power']['@odata.id'],
                        headers=req_headers,
                        timeout=(
                            20,
                            20))
                    response = response.json()
                    if "Voltages" in response:
                        voltage_arr = response['Voltages']
                        for j in range(0, len(voltage_arr)):
                            if j < len(
                                    power_info_arr) and "Name" in power_info_arr[j] and "Reading" in power_info_arr[j]:
                                # print("Insert");
                                voltage_arr[j]['PowerInputWatts'] = power_info_arr[j]['Reading']
                                #print("Insert Yeah")
                                connection = get_connection()
                                connection.write(['power,input_power=' +
                                                  str(power_info_arr[j]['Name']).split(' ', 1)[0] +
                                                  ' value=' +
                                                  str(power_info_arr[j]['Reading']) +
                                                  ',count=' +
                                                  str(len(power_info_arr))], {'db': mtool_db}, 204, 'line')
                                connection.close()
                            else:
                                voltage_arr[j]['PowerInputWatts'] = 'NA'
        except BaseException:
            pass
        return jsonify({"power_sensor_info": voltage_arr})


def get_fan_sensor_info(auth=AUTH):
        req_headers = get_headers(auth)
        logger = logging.getLogger(__name__)
        logger.info('%s', 'parse sensor info...')
        fan_arr = []
        chassis_info = get_chassis_info()
        try:
            for i in range(0, len(chassis_info)):
                if "Thermal" in chassis_info[i] and "@odata.id" in chassis_info[i]['Thermal']:
                    response = send_command_to_bmc(
                        "GET",
                        url=DAGENT_BMC_URL +
                        chassis_info[i]['Thermal']['@odata.id'],
                        headers=req_headers,
                        timeout=(
                            30,
                            30))
                    response = response.json()
                    if "Fans" in response:
                        fan_arr = response['Fans']
        except BaseException:
            pass
        return jsonify({"fan_sensor_info": fan_arr})


def get_temperature_sensor_info(auth=AUTH):
        req_headers = get_headers(auth)
        logger = logging.getLogger(__name__)
        logger.info('%s', 'parse sensor info...')
        temperature_arr = []
        chassis_info = get_chassis_info()
        try:
            for i in range(0, len(chassis_info)):
                if "Thermal" in chassis_info[i] and "@odata.id" in chassis_info[i]['Thermal']:
                    response = send_command_to_bmc(
                        "GET",
                        url=DAGENT_BMC_URL +
                        chassis_info[i]['Thermal']['@odata.id'],
                        headers=req_headers,
                        timeout=(
                            30,
                            30))
                    response = response.json()
                    if "Temperatures" in response:
                        temperature_arr = response['Temperatures']
        except BaseException:
            pass
        return jsonify({"temperature_sensor_info": temperature_arr})


def getPowerSummary(auth=AUTH):  # GetCurrentPowerMode
    #req_headers = get_headers(auth)
        logger = logging.getLogger(__name__)
        logger.info('%s', 'get power summary...')
        #chassis_info = get_chassis_info();
        #response = send_command_to_bmc("GET",url=DAGENT_BMC_URL + chassis_info[0]['Thermal']['@odata.id'],headers=req_headers, timeout=(20,20))
        #response = response.json();
        #temperature_arr = response['Temperatures'];
        return jsonify({"currentpowermode": 'Manual'})


def setCurrentPowerMode(auth=AUTH):
        req_headers = get_headers(auth)
        logger = logging.getLogger(__name__)
        logger.info('%s', 'set current power mode...')
        chassis_info = get_chassis_info()
        response = send_command_to_bmc(
            "GET",
            url=DAGENT_BMC_URL +
            chassis_info[0]['Thermal']['@odata.id'],
            headers=req_headers,
            timeout=(
                20,
                20))
        response = response.json()
        temperature_arr = response['Temperatures']
        return jsonify({"temperature_sensor_info": temperature_arr})


def changeCurrentPowerState(
        DriveIndex,
        PowerState,
        auth=AUTH):
    req_headers = get_headers(auth)
    logger = logging.getLogger(__name__)
    logger.info('%s', 'update current power state...')
    try:
        drives = []
        systems_info = get_chassis_info(SYSTEM_URL)
        try:
            for i in range(0, len(systems_info)):
                if "Storage" in systems_info[i] and "@odata.id" in systems_info[i]['Storage']:
                    storage_info = get_chassis_info(
                        systems_info[i]['Storage']['@odata.id'])
                    for j in range(0, len(storage_info)):
                        drives = storage_info[j]['Drives']
                        for k in range(0, len(drives)):
                            if "@odata.id" in drives[k]:
                                response = send_command_to_bmc(
                                    "GET",
                                    url=DAGENT_BMC_URL +
                                    drives[k]['@odata.id'],
                                    headers=req_headers,
                                    timeout=(
                                        20,
                                        20))
                                response = response.json()
                                if "Id" in response and str(
                                        DriveIndex) in response['Id']:
                                    raise BreakLoopsException
        except BreakLoopsException:
            pass
        request_body = {
            "Index": int(DriveIndex),
            "PowerState": int(PowerState)}
        request_body = json.dumps(request_body)
        try:
            if "Actions" in response and "Oem" in response['Actions'] and "#Drive.SetPowerState" in response[
                    'Actions']['Oem'] and "target" in response['Actions']['Oem']['#Drive.SetPowerState']:

                response = send_command_to_bmc(
                    "POST",
                    url=DAGENT_BMC_URL + str(
                        response['Actions']['Oem']['#Drive.SetPowerState']['target']),
                    headers=req_headers,
                    timeout=(
                        20,
                        20),
                    data=request_body)
                response = response.json()
                if "@Message.ExtendedInfo" in response:
                    for i in range(0, len(response['@Message.ExtendedInfo'])):
                        if "Message" in response['@Message.ExtendedInfo'][i] and "Success" in response['@Message.ExtendedInfo'][i]['Message']:
                            return jsonify({"response": response})
                        else:
                            return response
        except BaseException:
            pass
    except Exception as err:
        print(f'Other error occurred: {err}')
    return {"result": "could not update power state", "return": -1}

def write_log_into_db(influx_local_time, Name, EntryType, Severity, Description, t_data):
	connection = get_connection()
	connection.write(['bmc_logs Timestamp=' +
					  "\"" +
					  influx_local_time +
					  "\"" +
					  ',Source=' +
					  "\"" +
					  Name +
					  "\"" +
					  ',EntryType=' +
					  "\"" +
					  EntryType +
					  "\"" +
					  ',Severity=' +
					  "\"" +
					  Severity +
					  "\"" +
					  ',Description=' +
					  "\"" +
					  Description +
					  "\"" +
					  ' ' +
					  str(t_data)], {'db': mtool_db}, 204, 'line')
	connection.close()
def process_response(response, log_entries):
	response = response.json()
	if "Members" in response and 'Members@odata.count' in response:
		log_entries = response['Members']
		for j in range(0, response['Members@odata.count']):
			if "Created" in log_entries[j] and "Name" in log_entries[j] and "EntryType" in log_entries[
					j] and "Severity" in log_entries[j] and "Message" in log_entries[j]:
				t_data = log_entries[j]['Created']
				parsed_t = dp.parse(t_data)
				t_data = parsed_t.strftime('%s')
				c_tz = datetime.datetime.now(datetime.timezone(
					datetime.timedelta(0))).astimezone().tzinfo
				influx_local_time = str(
					parsed_t.astimezone(c_tz)) + ' ' + str(c_tz)
				t_now = datetime.datetime.utcnow().replace(
					tzinfo=datetime.timezone.utc, microsecond=0).isoformat()
				parsed_t = dp.parse(t_now)
				t_now = parsed_t.strftime('%s')
				if ((int(t_now) - int(t_data)) >= -
						5 and (int(t_now) - int(t_data)) <= 10):
					write_log_into_db(influx_local_time, log_entries[j]['Name'], log_entries[j]['EntryType'], log_entries[j]['Severity'], log_entries[j]['Message'], t_data)
				else:
					continue
		 #    break;
			#i -= 1;


def fetch_event_logs(auth=AUTH):
    req_headers = get_headers(auth)
    logger = logging.getLogger(__name__)
    logger.info('%s', 'fetch all bmc logs...')
    try:
        log_entries = []
        systems_info = get_chassis_info(SYSTEM_URL)
        try:
            for i in range(0, len(systems_info)):
                if "@odata.id" in systems_info[i]:
                    response = send_command_to_bmc(
                        "GET",
                        url=DAGENT_BMC_URL +
                        systems_info[i]['@odata.id'] +
                        '/LogServices/EventLog/Entries',
                        headers=req_headers,
                        timeout=(
                            20,
                            20))
                    process_response(response, log_entries)
        except BaseException:
            pass
    except Exception as err:
        print(f'Other error occurred: {err}')
    return {"result": "could not fetch logs", "return": -1}


def fetch_crashdump_logs(auth=AUTH):
    req_headers = get_headers(auth)
    logger = logging.getLogger(__name__)
    logger.info('%s', 'fetch all bmc logs...')
    try:
        log_entries = []
        systems_info = get_chassis_info(SYSTEM_URL)
        try:
            for i in range(0, len(systems_info)):
                if "@odata.id" in systems_info[i]:
                    response = send_command_to_bmc(
                        "GET",
                        url=DAGENT_BMC_URL +
                        systems_info[i]['@odata.id'] +
                        '/LogServices/Crashdump/Entries',
                        headers=req_headers,
                        timeout=(
                            20,
                            20))
                    process_response(response, log_entries)
        except BaseException:
            pass
    except Exception as err:
        print(f'Other error occurred: {err}')
    return {"result": "could not fetch logs", "return": -1}


def fetch_journal_logs(auth=AUTH):
    req_headers = get_headers(auth)
    logger = logging.getLogger(__name__)
    logger.info('%s', 'fetch all bmc logs...')
    try:
        log_entries = []
        managers_info = get_chassis_info(MANAGER_URL)
        try:
            for i in range(0, len(managers_info)):
                if "@odata.id" in managers_info[i]:
                    response = send_command_to_bmc(
                        "GET",
                        url=DAGENT_BMC_URL +
                        managers_info[i]['@odata.id'] +
                        '/LogServices/Journal/Entries',
                        headers=req_headers,
                        timeout=(
                            20,
                            20))
                    response = response.json()
                    if "Members@odata.count" in response and "Members" in response and int(
                            response['Members@odata.count']) > 1000:
                        data_count = int(
                            int(response['Members@odata.count']) / 1000)
                        data_count = data_count * 1000
                        response = send_command_to_bmc(
                            "GET",
                            url=DAGENT_BMC_URL +
                            managers_info[i]['@odata.id'] +
                            '/LogServices/Journal/Entries?$skip=' +
                            str(data_count),
                            headers=req_headers,
                            timeout=(
                                20,
                                20))
                        response = response.json()
                        log_entries = response['Members']
                        j = len(log_entries) - 1  # ['Members@odata.count']-1
                        while j >= 0:
                            if "Created" in log_entries[j] and "Name" in log_entries[j] and "EntryType" in log_entries[
                                    j] and "Severity" in log_entries[j] and "Message" in log_entries[j]:
                                t_data = log_entries[j]['Created']
                                parsed_t = dp.parse(t_data)
                                t_data = parsed_t.strftime('%s')
                                c_tz = datetime.datetime.now(datetime.timezone(
                                    datetime.timedelta(0))).astimezone().tzinfo
                                influx_local_time = str(
                                    parsed_t.astimezone(c_tz)) + ' ' + str(c_tz)
                                t_now = datetime.datetime.utcnow().replace(
                                    tzinfo=datetime.timezone.utc, microsecond=0).isoformat()
                                parsed_t = dp.parse(t_now)
                                t_now = parsed_t.strftime('%s')
                                print("difference")
                                print(int(t_now) - int(t_data))
                                if ((int(t_now) - int(t_data)) >= - \
                                    5 and (int(t_now) - int(t_data)) <= 10):
                                    write_log_into_db(influx_local_time, log_entries[j]['Name'], log_entries[j]['EntryType'], log_entries[j]['Severity'], log_entries[j]['Message'], t_data)
                                else:
                                    #print("in else")
                                    break
                            j -= 1
        except BaseException:
            pass
    except Exception as err:
        print(f'Other error occurred: {err}')
    return {"result": "could not fetch logs", "return": -1}


def fetch_bmc_logs(auth=AUTH):
    #req_headers = get_headers(auth)
    logger = logging.getLogger(__name__)
    logger.info('%s', 'fetch all bmc logs...')
    try:
        fetch_event_logs()
        fetch_crashdump_logs()
        fetch_journal_logs()
        return jsonify({"logs_fetched": "ok"})
    except Exception as err:
        print(f'Other error occurred: {err}')
    return {"result": "could not fetch logs", "return": -1}


handler = RotatingFileHandler(
    'log/ibof.log',
    maxBytes=1024 * 1024,
    backupCount=3)
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
logger.addHandler(handler)
'''
