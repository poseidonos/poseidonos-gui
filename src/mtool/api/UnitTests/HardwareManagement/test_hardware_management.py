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
"""
import os
import pytest
from rest.app import app
import requests_mock
import jwt
import datetime
from unittest import mock
from flask import json
import rest.rest_api.dagent.bmc as BMC_agent
import uuid
import time

json_token = jwt.encode({'_id': "test", 'exp': datetime.datetime.utcnow(
) + datetime.timedelta(minutes=60)}, app.config['SECRET_KEY'])
ip = os.environ.get('DAGENT_HOST', 'localhost')
DAGENT_URL = 'http://' + ip + ':3000'
INFLUXDB_URL = 'http://0.0.0.0:8086/write?db=poseidon&rp=autogen'
DAGENT_BMC_URL = 'http://localhost:3000'
CHASSIS_URL = '/redfish/v1/Chassis'
SYSTEM_URL = '/redfish/v1/Systems'
MANAGER_URL = '/redfish/v1/Managers'


def get_headers(
        auth='Basic cm9vdDowcGVuQm1j',
        content_type="application/json"):
    return {"X-Request-Id": str(uuid.uuid4()),
            "Accept": content_type,
            "Authorization": auth,
            "ts": str(int(time.time()))}

@pytest.fixture(scope='module')
@mock.patch("rest.app.connection_factory.match_username_from_db",
            return_value="admin", autospec=True)
def global_data(mock_match_username_from_db):
    login_response = app.test_client().post(
        '/api/v1.0/login/',
        data=json.dumps({'username': "admin", 'password': "admin"}),
        content_type='application/json',
    )
    login_data = json.loads(login_response.get_data(as_text=True))
    print("Token :",login_data['token'])

    return {'token': login_data['token']}

@requests_mock.Mocker(kw="mock")
#@mock.patch("rest.app.connection_factory.get_current_user", return_value="test", autospec=True)
#def test_bmc_login(mock_get_current_user, **kwargs):
def test_bmc_login(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_BMC_URL+SYSTEM_URL, text=None, status_code=200)
    response = app.test_client().post('/api/v1.0/bmc_login/',data='''{"username": "admin", "password": "admin"}''', headers={'x-access-token': json_token})
    print("response ",response)
    #data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
def test_getServerInfo(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_BMC_URL+MANAGER_URL, json={'@odata.context': '/redfish/v1/$metadata#ManagerCollection.ManagerCollection', '@odata.type': '#ManagerCollection.ManagerCollection', '@odata.id': '/redfish/v1/Managers', 'Name': 'Manager Collection', 'Description': 'Manager Collection', 'Members@odata.count': 1, 'Members': [{'@odata.id': '/redfish/v1/Managers/1'}]}, status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/v1/Managers/1', json= {'@odata.context': '/redfish/v1/$metadata#Manager.Manager', '@odata.type': '#Manager.v1_3_1.Manager', '@odata.id': '/redfish/v1/Managers/1', 'Id': '1', 'Name': 'Manager', 'Description': 'BMC', 'ManagerType': 'BMC', 'UUID': '00000000-0000-0000-0000-AC1F6BC16747', 'Model': 'ASPEED', 'FirmwareVersion': '1.69', 'DateTime': '2020-12-28T18:58:10+00:00', 'DateTimeLocalOffset': '+00:00', 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'GraphicalConsole': {'ServiceEnabled': True, 'MaxConcurrentSessions': 4, 'ConnectTypesSupported': ['KVMIP']}, 'SerialConsole': {'ServiceEnabled': True, 'MaxConcurrentSessions': 1, 'ConnectTypesSupported': ['SSH', 'IPMI']}, 'CommandShell': {'ServiceEnabled': True, 'MaxConcurrentSessions': 0, 'ConnectTypesSupported': ['SSH']}, 'EthernetInterfaces': {'@odata.id': '/redfish/v1/Managers/1/EthernetInterfaces'}, 'SerialInterfaces': {'@odata.id': '/redfish/v1/Managers/1/SerialInterfaces'}, 'NetworkProtocol': {'@odata.id': '/redfish/v1/Managers/1/NetworkProtocol'}, 'LogServices': {'@odata.id': '/redfish/v1/Managers/1/LogServices'}, 'VirtualMedia': {'@odata.id': '/redfish/v1/Managers/1/VM1'}, 'Links': {'ManagerForServers': [{'@odata.id': '/redfish/v1/Systems/1'}], 'ManagerForChassis': [{'@odata.id': '/redfish/v1/Chassis/1'}], 'Oem': {}}, 'Actions': {'Oem': {'#ManagerConfig.Reset': {'target': '/redfish/v1/Managers/1/Actions/Oem/ManagerConfig.Reset'}}, '#Manager.Reset': {'target': '/redfish/v1/Managers/1/Actions/Manager.Reset'}}, 'Oem': {'Supermicro': {'@odata.type': '#SmcManagerExtensions.v1_0_0.Manager', 'ActiveDirectory': {'@odata.id': '/redfish/v1/Managers/1/ActiveDirectory'}, 'SMTP': {'@odata.id': '/redfish/v1/Managers/1/SMTP'}, 'RADIUS': {'@odata.id': '/redfish/v1/Managers/1/RADIUS'}, 'MouseMode': {'@odata.id': '/redfish/v1/Managers/1/MouseMode'}, 'NTP': {'@odata.id': '/redfish/v1/Managers/1/NTP'}, 'LDAP': {'@odata.id': '/redfish/v1/Managers/1/LDAP'}, 'IPAccessControl': {'@odata.id': '/redfish/v1/Managers/1/IPAccessControl'}, 'SMCRAKP': {'@odata.id': '/redfish/v1/Managers/1/SMCRAKP'}, 'SNMP': {'@odata.id': '/redfish/v1/Managers/1/SNMP'}, 'Syslog': {'@odata.id': '/redfish/v1/Managers/1/Syslog'}, 'Snooping': {'@odata.id': '/redfish/v1/Managers/1/Snooping'}, 'FanMode': {'@odata.id': '/redfish/v1/Managers/1/FanMode'}, 'IKVM': {'@odata.id': '/redfish/v1/Managers/1/IKVM'}}}},status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/v1/Managers/1/EthernetInterfaces', json={'@odata.context': '/redfish/v1/$metadata#EthernetInterfaceCollection.EthernetInterfaceCollection', '@odata.type': '#EthernetInterfaceCollection.EthernetInterfaceCollection', '@odata.id': '/redfish/v1/Managers/1/EthernetInterfaces', 'Name': 'Ethernet Network Interface Collection', 'Description': 'Collection of EthernetInterfaces for this Manager', 'Members@odata.count': 1, 'Members': [{'@odata.id': '/redfish/v1/Managers/1/EthernetInterfaces/1'}]}
, status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/v1/Managers/1/EthernetInterfaces/1', json={'@odata.context': '/redfish/v1/$metadata#EthernetInterface.EthernetInterface', '@odata.type': '#EthernetInterface.v1_0_0.EthernetInterface', '@odata.id': '/redfish/v1/Managers/1/EthernetInterfaces/1', 'Id': '1', 'Name': 'EthernetInterface', 'Description': 'Management Network Interface', 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'InterfaceEnabled': True, 'MACAddress': 'AC:1F:6B:C1:67:47', 'SpeedMbps': 1000, 'AutoNeg': True, 'FullDuplex': True, 'MTUSize': 1500, 'HostName': '', 'VLAN': {'VLANEnable': False, 'VLANId': 0}, 'IPv4Addresses': [{'Address': '107.108.214.133', 'SubnetMask': '255.255.255.0', 'AddressOrigin': 'DHCP', 'Gateway': '107.108.214.1'}], 'IPv6AddressPolicyTable': [{'Prefix': '::1/128', 'Precedence': 50, 'Label': 0}], 'IPv6Addresses': [{'Address': 'fe80::ae1f:6bff:fec1:6747', 'PrefixLength': 64, 'AddressOrigin': 'SLAAC', 'AddressState': 'Preferred'}], 'IPv6StaticAddresses': [{'Address': 'fe80::ae1f:6bff:fec1:6747', 'PrefixLength': 64}], 'IPv6DefaultGateway': 'fe80::ae1f:6bff:fec1:6747', 'NameServers': ['107.110.101.41']}, status_code=200)


    response = app.test_client().get('/api/v1.0/get_server_info/', headers={'x-access-token': json_token})
    print("response TC 2 ",response)
    assert response.status_code == 200





@requests_mock.Mocker(kw="mock")
def test_getPowerInfo(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_BMC_URL+CHASSIS_URL, json={'@odata.context': '/redfish/v1/$metadata#ChassisCollection.ChassisCollection', '@odata.type': '#ChassisCollection.ChassisCollection', '@odata.id': '/redfish/v1/Chassis', 'Name': 'Chassis Collection', 'Members': [{'@odata.id': '/redfish/v1/Chassis/1'}, {'@odata.id': '/redfish/v1/Chassis/NVMeSSD.0.Group.0.StorageBackplane'}], 'Members@odata.count': 2},status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/temp', json={'Members@odata.count':1,'Members':[{'@odata.id':"/redfish/temp2"}]},status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/temp2', json={'Name':{'Power':12,'Input':10},'Reading':10},status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/v1/Chassis/1', json={'Sensors':{'@odata.id':'/redfish/temp'},'@odata.context': '/redfish/v1/$metadata#Chassis.Chassis', '@odata.type': '#Chassis.v1_4_0.Chassis', '@odata.id': '/redfish/v1/Chassis/1', 'Id': '1', 'Name': 'Computer System Chassis', 'ChassisType': 'RackMount', 'Manufacturer': 'Supermicro', 'Model': 'X11DPU', 'SKU': '', 'SerialNumber': 'C219UAI02CH0069', 'PartNumber': 'CSE-219UB2TS-R1K62P-TN24', 'AssetTag': '', 'IndicatorLED': 'Off', 'Status': {'State': 'Enabled', 'Health': 'Critical', 'HealthRollup': 'Critical'}, 'PhysicalSecurity': {'IntrusionSensorNumber': 170, 'IntrusionSensor': 'HardwareIntrusion', 'IntrusionSensorReArm': 'Manual'}, 'Power': {'@odata.id': '/redfish/v1/Chassis/1/Power'}, 'Thermal': {'@odata.id': '/redfish/v1/Chassis/1/Thermal'}, 'Links': {'ComputerSystems': [{'@odata.id': '/redfish/v1/Systems/1'}], 'PCIeDevices': [{'@odata.id': '/redfish/v1/Systems/1/PCIeDevices/NIC1'}, {'@odata.id': '/redfish/v1/Systems/1/PCIeDevices/NIC2'}], 'ManagedBy': [{'@odata.id': '/redfish/v1/Managers/1'}]}, 'Oem': {'Supermicro': {'@odata.type': '#SmcChassisExtensions.v1_0_0.Chassis', 'BoardSerialNumber': 'OM196S007316', 'GUID': '34313031-4D53-AC1F-6BC1-674700000000', 'BoardID': '0x91c'}}}, status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/v1/Chassis/NVMeSSD.0.Group.0.StorageBackplane', json= {'@odata.context': '/redfish/v1/$metadata#Chassis.Chassis', '@odata.type': '#Chassis.v1_2_0.Chassis', '@odata.id': '/redfish/v1/Chassis/NVMeSSD.0.Group.0.StorageBackplane', 'Id': 'NVMeSSD.0.Group.0.StorageBackplane', 'Name': 'Backplane', 'ChassisType': 'Enclosure', 'Model': 'Backplane', 'SerialNumber': '', 'PartNumber': '', 'Links': {'ManagedBy': [{'@odata.id': '/redfish/v1/Managers/1'}], 'Storage': [{'@odata.id': '/redfish/v1/Systems/1/Storage/NVMeSSD'}], 'Drives': [{'@odata.id': '/redfish/v1/Chassis/NVMeSSD.0.Group.0.StorageBackplane/Drives/Disk.Bay.0'}, {'@odata.id': '/redfish/v1/Chassis/NVMeSSD.0.Group.0.StorageBackplane/Drives/Disk.Bay.1'}, {'@odata.id': '/redfish/v1/Chassis/NVMeSSD.0.Group.0.StorageBackplane/Drives/Disk.Bay.2'}, {'@odata.id': '/redfish/v1/Chassis/NVMeSSD.0.Group.0.StorageBackplane/Drives/Disk.Bay.3'}, {'@odata.id': '/redfish/v1/Chassis/NVMeSSD.0.Group.0.StorageBackplane/Drives/Disk.Bay.11'}]}, 'Oem': {}},status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/v1/Systems', json={'@odata.context': '/redfish/v1/$metadata#ComputerSystemCollection.ComputerSystemCollection', '@odata.type': '#ComputerSystemCollection.ComputerSystemCollection', '@odata.id': '/redfish/v1/Systems', 'Name': 'Computer System Collection', 'Description': 'Computer System Collection', 'Members@odata.count': 1, 'Members': [{'@odata.id': '/redfish/v1/Systems/1'}]},status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/v1/Systems/1', json={'@odata.context': '/redfish/v1/$metadata#ComputerSystem.ComputerSystem', '@odata.type': '#ComputerSystem.v1_3_0.ComputerSystem', '@odata.id': '/redfish/v1/Systems/1', 'Id': '1', 'Name': 'System', 'Description': 'Description of server', 'Status': {'State': 'Enabled', 'Health': 'Critical'}, 'SerialNumber': 'A264025X9717129', 'PartNumber': 'SYS-2029U-TN24R4T', 'SystemType': 'Physical', 'BiosVersion': '3.1', 'Manufacturer': 'Supermicro', 'Model': 'SYS-2029U-TN24R4T', 'SKU': 'To be filled by O.E.M.', 'UUID': '00000000-0000-0000-0000-AC1F6BC5C8B8', 'ProcessorSummary': {'Count': 2, 'Model': 'Intel(R) Xeon(R) processor', 'Status': {'State': 'Enabled', 'Health': 'OK'}}, 'MemorySummary': {'TotalSystemMemoryGiB': 512, 'Status': {'State': 'Enabled', 'Health': 'OK'}}, 'IndicatorLED': 'Off', 'PowerState': 'On', 'Boot': {'BootSourceOverrideEnabled': 'Disabled', 'BootSourceOverrideTarget': 'None', 'BootSourceOverrideTarget@Redfish.AllowableValues': ['None', 'Pxe', 'Hdd', 'Diags', 'CD/DVD', 'BiosSetup', 'FloppyRemovableMedia', 'UsbKey', 'UsbHdd', 'UsbFloppy', 'UsbCd', 'UefiUsbKey', 'UefiCd', 'UefiHdd', 'UefiUsbHdd', 'UefiUsbCd']}, 'Processors': {'@odata.id': '/redfish/v1/Systems/1/Processors'}, 'Memory': {'@odata.id': '/redfish/v1/Systems/1/Memory'}, 'EthernetInterfaces': {'@odata.id': '/redfish/v1/Systems/1/EthernetInterfaces'}, 'SimpleStorage': {'@odata.id': '/redfish/v1/Systems/1/SimpleStorage'}, 'Storage': {'@odata.id': '/redfish/v1/Systems/1/Storage'}, 'LogServices': {'@odata.id': '/redfish/v1/Systems/1/LogServices'}, 'Bios': {'@odata.id': '/redfish/v1/Systems/1/Bios'}, 'PCIeDevices': [{'@odata.id': '/redfish/v1/Systems/1/PCIeDevices/NIC1'}, {'@odata.id': '/redfish/v1/Systems/1/PCIeDevices/NIC2'}], 'PCIeFunctions': [], 'Links': {'Chassis': [{'@odata.id': '/redfish/v1/Chassis/1'}], 'ManagedBy': [{'@odata.id': '/redfish/v1/Managers/1'}], 'Oem': {}}, 'Actions': {'Oem': {}, '#ComputerSystem.Reset': {'target': '/redfish/v1/Systems/1/Actions/ComputerSystem.Reset', '@Redfish.ActionInfo': '/redfish/v1/Systems/1/ResetActionInfo'}}, 'Oem': {'Supermicro': {'@odata.type': '#SmcSystemExtensions.v1_0_0.System', 'SmcNodeManager': {'@odata.id': '/redfish/v1/Systems/1/SmcNodeManager'}}}},status_code=200)

    response = app.test_client().get('/api/v1.0/get_power_info/', headers={'x-access-token': json_token})
    print("response TC 3 ",response)
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
def test_get_basic_redfish_url(**kwargs):
    auth='Basic cm9vdDowcGVuQm1j'
    req_headers = get_headers(auth)
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_BMC_URL+"/redfish/v1/", json={'@odata.context': '/redfish/v1/$metadata#ServiceRoot.ServiceRoot', '@odata.type': '#ServiceRoot.v1_1_0.ServiceRoot', '@odata.id': '/redfish/v1/', 'Id': 'RootService', 'Name': 'Root Service', 'RedfishVersion': '1.0.1', 'UUID': '00000000-0000-0000-0000-AC1F6BC16754', 'Systems': {'@odata.id': '/redfish/v1/Systems'}, 'Chassis': {'@odata.id': '/redfish/v1/Chassis'}, 'Managers': {'@odata.id': '/redfish/v1/Managers'}, 'Tasks': {'@odata.id': '/redfish/v1/TaskService'}, 'SessionService': {'@odata.id': '/redfish/v1/SessionService'}, 'AccountService': {'@odata.id': '/redfish/v1/AccountService'}, 'EventService': {'@odata.id': '/redfish/v1/EventService'}, 'UpdateService': {'@odata.id': '/redfish/v1/UpdateService'}, 'Registries': {'@odata.id': '/redfish/v1/Registries'}, 'JsonSchemas': {'@odata.id': '/redfish/v1/JsonSchemas'}, 'Links': {'Sessions': {'@odata.id': '/redfish/v1/SessionService/Sessions'}}, 'Oem': {}},headers = req_headers, status_code=200)
    output = BMC_agent.get_basic_redfish_url()
    print("output >>>>>>>>>>>>>>>>>>>>>>",output)

@requests_mock.Mocker(kw="mock")
def test_get_chassis_front_info(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_BMC_URL+SYSTEM_URL, json={'@odata.context': '/redfish/v1/$metadata#ComputerSystemCollection.ComputerSystemCollection', '@odata.type': '#ComputerSystemCollection.ComputerSystemCollection', '@odata.id': '/redfish/v1/Systems', 'Name': 'Computer System Collection', 'Description': 'Computer System Collection', 'Members@odata.count': 1, 'Members': [{'@odata.id': '/redfish/v1/Systems/1'}]},status_code=200) 

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/v1/Systems/1', json={'@odata.context': '/redfish/v1/$metadata#ComputerSystem.ComputerSystem', '@odata.type': '#ComputerSystem.v1_3_0.ComputerSystem', '@odata.id': '/redfish/v1/Systems/1', 'Id': '1', 'Name': 'System', 'Description': 'Description of server', 'Status': {'State': 'Enabled', 'Health': 'Critical'}, 'SerialNumber': 'A264025X9717129', 'PartNumber': 'SYS-2029U-TN24R4T', 'SystemType': 'Physical', 'BiosVersion': '3.1', 'Manufacturer': 'Supermicro', 'Model': 'SYS-2029U-TN24R4T', 'SKU': 'To be filled by O.E.M.', 'UUID': '00000000-0000-0000-0000-AC1F6BC5C8B8', 'ProcessorSummary': {'Count': 2, 'Model': 'Intel(R) Xeon(R) processor', 'Status': {'State': 'Enabled', 'Health': 'OK'}}, 'MemorySummary': {'TotalSystemMemoryGiB': 512, 'Status': {'State': 'Enabled', 'Health': 'OK'}}, 'IndicatorLED': 'Off', 'PowerState': 'On', 'Boot': {'BootSourceOverrideEnabled': 'Disabled', 'BootSourceOverrideTarget': 'None', 'BootSourceOverrideTarget@Redfish.AllowableValues': ['None', 'Pxe', 'Hdd', 'Diags', 'CD/DVD', 'BiosSetup', 'FloppyRemovableMedia', 'UsbKey', 'UsbHdd', 'UsbFloppy', 'UsbCd', 'UefiUsbKey', 'UefiCd', 'UefiHdd', 'UefiUsbHdd', 'UefiUsbCd']}, 'Processors': {'@odata.id': '/redfish/v1/Systems/1/Processors'}, 'Memory': {'@odata.id': '/redfish/v1/Systems/1/Memory'}, 'EthernetInterfaces': {'@odata.id': '/redfish/v1/Systems/1/EthernetInterfaces'}, 'SimpleStorage': {'@odata.id': '/redfish/v1/Systems/1/SimpleStorage'}, 'Storage': {'@odata.id': '/redfish/v1/Systems/1/Storage'}, 'LogServices': {'@odata.id': '/redfish/v1/Systems/1/LogServices'}, 'Bios': {'@odata.id': '/redfish/v1/Systems/1/Bios'}, 'PCIeDevices': [{'@odata.id': '/redfish/v1/Systems/1/PCIeDevices/NIC1'}, {'@odata.id': '/redfish/v1/Systems/1/PCIeDevices/NIC2'}], 'PCIeFunctions': [], 'Links': {'Chassis': [{'@odata.id': '/redfish/v1/Chassis/1'}], 'ManagedBy': [{'@odata.id': '/redfish/v1/Managers/1'}], 'Oem': {}}, 'Actions': {'Oem': {}, '#ComputerSystem.Reset': {'target': '/redfish/v1/Systems/1/Actions/ComputerSystem.Reset', '@Redfish.ActionInfo': '/redfish/v1/Systems/1/ResetActionInfo'}}, 'Oem': {'Supermicro': {'@odata.type': '#SmcSystemExtensions.v1_0_0.System', 'SmcNodeManager': {'@odata.id': '/redfish/v1/Systems/1/SmcNodeManager'}}}},status_code=200)  

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/v1/Systems/1/Storage', json={'@odata.context': '/redfish/v1/$metadata#StorageCollection.StorageCollection', '@odata.type': '#StorageCollection.StorageCollection', '@odata.id': '/redfish/v1/Systems/1/Storage', 'Name': 'Storage Collection', 'Members@odata.count': 1, 'Description': 'Storage Collection', 'Members': [{'@odata.id': '/redfish/v1/Systems/1/Storage/NVMeSSD'}]},status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/v1/Systems/1/Storage/NVMeSSD', json={'@odata.context': '/redfish/v1/$metadata#Storage.Storage', '@odata.type': '#Storage.v1_1_0.Storage', '@odata.id': '/redfish/v1/Systems/1/Storage/NVMeSSD', 'Id': 'NVMeSSD', 'Name': 'NVMe Storage System', 'StorageControllers': [{'@odata.id': '/redfish/v1/Systems/1/NVMeSSD#/StorageControllers/0', '@odata.type': '#Storage.v1_1_0.StorageController', 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'Identifiers': [{'DurableName': ''}], 'SupportedControllerProtocols': ['PCIe'], 'SupportedDeviceProtocols': ['NVMe']}], 'Drives': [{'@odata.id': '/redfish/v1/Chassis/NVMeSSD.0.Group.0.StorageBackplane/Drives/Disk.Bay.0'}], 'Volumes': {'@odata.id': '/redfish/v1/Systems/1/Storage/NVMeSSD/Volumes'}, 'Links': {'Enclosures': [{'@odata.id': '/redfish/v1/Chassis/NVMeSSD.0.Group.0.StorageBackplane'}]}, 'Oem': {}, 'Description': 'NVMe SSD', 'Status': {'State': 'Enabled', 'HealthRollup': 'OK', 'Health': 'OK'}},status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/v1/Chassis/NVMeSSD.0.Group.0.StorageBackplane/Drives/Disk.Bay.0', json={'drive':'one1'},status_code=200)
    
    response = app.test_client().get('/api/v1.0/get_chassis_front_info/', headers={'x-access-token': json_token})
    print("response TC 4 ",response)
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
def test_get_software_health(**kwargs):
    auth='Basic cm9vdDowcGVuQm1j'
    req_headers = get_headers(auth)
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    response = app.test_client().get('/api/v1.0/get_software_health/', headers={'x-access-token': json_token})
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
def test_get_network_health(**kwargs):
    auth='Basic cm9vdDowcGVuQm1j'
    req_headers = get_headers(auth)
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    response = app.test_client().get('/api/v1.0/get_network_health/', headers={'x-access-token': json_token})
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
def test_power_on_system(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_BMC_URL+SYSTEM_URL, json={'@odata.context': '/redfish/v1/$metadata#ComputerSystemCollection.ComputerSystemCollection', '@odata.type': '#ComputerSystemCollection.ComputerSystemCollection', '@odata.id': '/redfish/v1/Systems', 'Name': 'Computer System Collection', 'Description': 'Computer System Collection', 'Members@odata.count': 1, 'Members': [{'@odata.id': '/redfish/v1/Systems/1'}]},status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/v1/Systems/1', json={'@odata.context': '/redfish/v1/$metadata#ComputerSystem.ComputerSystem', '@odata.type': '#ComputerSystem.v1_3_0.ComputerSystem', '@odata.id': '/redfish/v1/Systems/1', 'Id': '1', 'Name': 'System', 'Description': 'Description of server', 'Status': {'State': 'Enabled', 'Health': 'Critical'}, 'SerialNumber': 'A264025X9717129', 'PartNumber': 'SYS-2029U-TN24R4T', 'SystemType': 'Physical', 'BiosVersion': '3.1', 'Manufacturer': 'Supermicro', 'Model': 'SYS-2029U-TN24R4T', 'SKU': 'To be filled by O.E.M.', 'UUID': '00000000-0000-0000-0000-AC1F6BC5C8B8', 'ProcessorSummary': {'Count': 2, 'Model': 'Intel(R) Xeon(R) processor', 'Status': {'State': 'Enabled', 'Health': 'OK'}}, 'MemorySummary': {'TotalSystemMemoryGiB': 512, 'Status': {'State': 'Enabled', 'Health': 'OK'}}, 'IndicatorLED': 'Off', 'PowerState': 'On', 'Boot': {'BootSourceOverrideEnabled': 'Disabled', 'BootSourceOverrideTarget': 'None', 'BootSourceOverrideTarget@Redfish.AllowableValues': ['None', 'Pxe', 'Hdd', 'Diags', 'CD/DVD', 'BiosSetup', 'FloppyRemovableMedia', 'UsbKey', 'UsbHdd', 'UsbFloppy', 'UsbCd', 'UefiUsbKey', 'UefiCd', 'UefiHdd', 'UefiUsbHdd', 'UefiUsbCd']}, 'Processors': {'@odata.id': '/redfish/v1/Systems/1/Processors'}, 'Memory': {'@odata.id': '/redfish/v1/Systems/1/Memory'}, 'EthernetInterfaces': {'@odata.id': '/redfish/v1/Systems/1/EthernetInterfaces'}, 'SimpleStorage': {'@odata.id': '/redfish/v1/Systems/1/SimpleStorage'}, 'Storage': {'@odata.id': '/redfish/v1/Systems/1/Storage'}, 'LogServices': {'@odata.id': '/redfish/v1/Systems/1/LogServices'}, 'Bios': {'@odata.id': '/redfish/v1/Systems/1/Bios'}, 'PCIeDevices': [{'@odata.id': '/redfish/v1/Systems/1/PCIeDevices/NIC1'}, {'@odata.id': '/redfish/v1/Systems/1/PCIeDevices/NIC2'}], 'PCIeFunctions': [], 'Links': {'Chassis': [{'@odata.id': '/redfish/v1/Chassis/1'}], 'ManagedBy': [{'@odata.id': '/redfish/v1/Managers/1'}], 'Oem': {}}, 'Actions': {'Oem': {}, '#ComputerSystem.Reset': {'target': '/redfish/v1/Systems/1/Actions/ComputerSystem.Reset', '@Redfish.ActionInfo': '/redfish/v1/Systems/1/ResetActionInfo'}}, 'Oem': {'Supermicro': {'@odata.type': '#SmcSystemExtensions.v1_0_0.System', 'SmcNodeManager': {'@odata.id': '/redfish/v1/Systems/1/SmcNodeManager'}}}},status_code=200)

    kwargs["mock"].post(DAGENT_BMC_URL+'/redfish/v1/Systems/1/Actions/ComputerSystem.Reset', json={'@Message.ExtendedInfo':[{'Message':"Success"}]},status_code=200)

    response = app.test_client().post('/api/v1.0/power_on_system/', headers={'x-access-token': json_token})
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
def test_reboot_system(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_BMC_URL+SYSTEM_URL, json={'@odata.context': '/redfish/v1/$metadata#ComputerSystemCollection.ComputerSystemCollection', '@odata.type': '#ComputerSystemCollection.ComputerSystemCollection', '@odata.id': '/redfish/v1/Systems', 'Name': 'Computer System Collection', 'Description': 'Computer System Collection', 'Members@odata.count': 1, 'Members': [{'@odata.id': '/redfish/v1/Systems/1'}]},status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/v1/Systems/1', json={'@odata.context': '/redfish/v1/$metadata#ComputerSystem.ComputerSystem', '@odata.type': '#ComputerSystem.v1_3_0.ComputerSystem', '@odata.id': '/redfish/v1/Systems/1', 'Id': '1', 'Name': 'System', 'Description': 'Description of server', 'Status': {'State': 'Enabled', 'Health': 'Critical'}, 'SerialNumber': 'A264025X9717129', 'PartNumber': 'SYS-2029U-TN24R4T', 'SystemType': 'Physical', 'BiosVersion': '3.1', 'Manufacturer': 'Supermicro', 'Model': 'SYS-2029U-TN24R4T', 'SKU': 'To be filled by O.E.M.', 'UUID': '00000000-0000-0000-0000-AC1F6BC5C8B8', 'ProcessorSummary': {'Count': 2, 'Model': 'Intel(R) Xeon(R) processor', 'Status': {'State': 'Enabled', 'Health': 'OK'}}, 'MemorySummary': {'TotalSystemMemoryGiB': 512, 'Status': {'State': 'Enabled', 'Health': 'OK'}}, 'IndicatorLED': 'Off', 'PowerState': 'On', 'Boot': {'BootSourceOverrideEnabled': 'Disabled', 'BootSourceOverrideTarget': 'None', 'BootSourceOverrideTarget@Redfish.AllowableValues': ['None', 'Pxe', 'Hdd', 'Diags', 'CD/DVD', 'BiosSetup', 'FloppyRemovableMedia', 'UsbKey', 'UsbHdd', 'UsbFloppy', 'UsbCd', 'UefiUsbKey', 'UefiCd', 'UefiHdd', 'UefiUsbHdd', 'UefiUsbCd']}, 'Processors': {'@odata.id': '/redfish/v1/Systems/1/Processors'}, 'Memory': {'@odata.id': '/redfish/v1/Systems/1/Memory'}, 'EthernetInterfaces': {'@odata.id': '/redfish/v1/Systems/1/EthernetInterfaces'}, 'SimpleStorage': {'@odata.id': '/redfish/v1/Systems/1/SimpleStorage'}, 'Storage': {'@odata.id': '/redfish/v1/Systems/1/Storage'}, 'LogServices': {'@odata.id': '/redfish/v1/Systems/1/LogServices'}, 'Bios': {'@odata.id': '/redfish/v1/Systems/1/Bios'}, 'PCIeDevices': [{'@odata.id': '/redfish/v1/Systems/1/PCIeDevices/NIC1'}, {'@odata.id': '/redfish/v1/Systems/1/PCIeDevices/NIC2'}], 'PCIeFunctions': [], 'Links': {'Chassis': [{'@odata.id': '/redfish/v1/Chassis/1'}], 'ManagedBy': [{'@odata.id': '/redfish/v1/Managers/1'}], 'Oem': {}}, 'Actions': {'Oem': {}, '#ComputerSystem.Reset': {'target': '/redfish/v1/Systems/1/Actions/ComputerSystem.Reset', '@Redfish.ActionInfo': '/redfish/v1/Systems/1/ResetActionInfo'}}, 'Oem': {'Supermicro': {'@odata.type': '#SmcSystemExtensions.v1_0_0.System', 'SmcNodeManager': {'@odata.id': '/redfish/v1/Systems/1/SmcNodeManager'}}}},status_code=200)

    kwargs["mock"].post(DAGENT_BMC_URL+'/redfish/v1/Systems/1/Actions/ComputerSystem.Reset', json={'@Message.ExtendedInfo':[{'Message':"Success"}]},status_code=200)

    response = app.test_client().post('/api/v1.0/reboot_system/', headers={'x-access-token': json_token})
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
def test_shutdown_system(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_BMC_URL+SYSTEM_URL, json={'@odata.context': '/redfish/v1/$metadata#ComputerSystemCollection.ComputerSystemCollection', '@odata.type': '#ComputerSystemCollection.ComputerSystemCollection', '@odata.id': '/redfish/v1/Systems', 'Name': 'Computer System Collection', 'Description': 'Computer System Collection', 'Members@odata.count': 1, 'Members': [{'@odata.id': '/redfish/v1/Systems/1'}]},status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/v1/Systems/1', json={'@odata.context': '/redfish/v1/$metadata#ComputerSystem.ComputerSystem', '@odata.type': '#ComputerSystem.v1_3_0.ComputerSystem', '@odata.id': '/redfish/v1/Systems/1', 'Id': '1', 'Name': 'System', 'Description': 'Description of server', 'Status': {'State': 'Enabled', 'Health': 'Critical'}, 'SerialNumber': 'A264025X9717129', 'PartNumber': 'SYS-2029U-TN24R4T', 'SystemType': 'Physical', 'BiosVersion': '3.1', 'Manufacturer': 'Supermicro', 'Model': 'SYS-2029U-TN24R4T', 'SKU': 'To be filled by O.E.M.', 'UUID': '00000000-0000-0000-0000-AC1F6BC5C8B8', 'ProcessorSummary': {'Count': 2, 'Model': 'Intel(R) Xeon(R) processor', 'Status': {'State': 'Enabled', 'Health': 'OK'}}, 'MemorySummary': {'TotalSystemMemoryGiB': 512, 'Status': {'State': 'Enabled', 'Health': 'OK'}}, 'IndicatorLED': 'Off', 'PowerState': 'On', 'Boot': {'BootSourceOverrideEnabled': 'Disabled', 'BootSourceOverrideTarget': 'None', 'BootSourceOverrideTarget@Redfish.AllowableValues': ['None', 'Pxe', 'Hdd', 'Diags', 'CD/DVD', 'BiosSetup', 'FloppyRemovableMedia', 'UsbKey', 'UsbHdd', 'UsbFloppy', 'UsbCd', 'UefiUsbKey', 'UefiCd', 'UefiHdd', 'UefiUsbHdd', 'UefiUsbCd']}, 'Processors': {'@odata.id': '/redfish/v1/Systems/1/Processors'}, 'Memory': {'@odata.id': '/redfish/v1/Systems/1/Memory'}, 'EthernetInterfaces': {'@odata.id': '/redfish/v1/Systems/1/EthernetInterfaces'}, 'SimpleStorage': {'@odata.id': '/redfish/v1/Systems/1/SimpleStorage'}, 'Storage': {'@odata.id': '/redfish/v1/Systems/1/Storage'}, 'LogServices': {'@odata.id': '/redfish/v1/Systems/1/LogServices'}, 'Bios': {'@odata.id': '/redfish/v1/Systems/1/Bios'}, 'PCIeDevices': [{'@odata.id': '/redfish/v1/Systems/1/PCIeDevices/NIC1'}, {'@odata.id': '/redfish/v1/Systems/1/PCIeDevices/NIC2'}], 'PCIeFunctions': [], 'Links': {'Chassis': [{'@odata.id': '/redfish/v1/Chassis/1'}], 'ManagedBy': [{'@odata.id': '/redfish/v1/Managers/1'}], 'Oem': {}}, 'Actions': {'Oem': {}, '#ComputerSystem.Reset': {'target': '/redfish/v1/Systems/1/Actions/ComputerSystem.Reset', '@Redfish.ActionInfo': '/redfish/v1/Systems/1/ResetActionInfo'}}, 'Oem': {'Supermicro': {'@odata.type': '#SmcSystemExtensions.v1_0_0.System', 'SmcNodeManager': {'@odata.id': '/redfish/v1/Systems/1/SmcNodeManager'}}}},status_code=200)

    kwargs["mock"].post(DAGENT_BMC_URL+'/redfish/v1/Systems/1/Actions/ComputerSystem.Reset', json={'@Message.ExtendedInfo':[{'Message':"Success"}]},status_code=200)

    response = app.test_client().post('/api/v1.0/shutdown_system/', headers={'x-access-token': json_token})
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
def test_force_shutdown_system(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_BMC_URL+SYSTEM_URL, json={'@odata.context': '/redfish/v1/$metadata#ComputerSystemCollection.ComputerSystemCollection', '@odata.type': '#ComputerSystemCollection.ComputerSystemCollection', '@odata.id': '/redfish/v1/Systems', 'Name': 'Computer System Collection', 'Description': 'Computer System Collection', 'Members@odata.count': 1, 'Members': [{'@odata.id': '/redfish/v1/Systems/1'}]},status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/v1/Systems/1', json={'@odata.context': '/redfish/v1/$metadata#ComputerSystem.ComputerSystem', '@odata.type': '#ComputerSystem.v1_3_0.ComputerSystem', '@odata.id': '/redfish/v1/Systems/1', 'Id': '1', 'Name': 'System', 'Description': 'Description of server', 'Status': {'State': 'Enabled', 'Health': 'Critical'}, 'SerialNumber': 'A264025X9717129', 'PartNumber': 'SYS-2029U-TN24R4T', 'SystemType': 'Physical', 'BiosVersion': '3.1', 'Manufacturer': 'Supermicro', 'Model': 'SYS-2029U-TN24R4T', 'SKU': 'To be filled by O.E.M.', 'UUID': '00000000-0000-0000-0000-AC1F6BC5C8B8', 'ProcessorSummary': {'Count': 2, 'Model': 'Intel(R) Xeon(R) processor', 'Status': {'State': 'Enabled', 'Health': 'OK'}}, 'MemorySummary': {'TotalSystemMemoryGiB': 512, 'Status': {'State': 'Enabled', 'Health': 'OK'}}, 'IndicatorLED': 'Off', 'PowerState': 'On', 'Boot': {'BootSourceOverrideEnabled': 'Disabled', 'BootSourceOverrideTarget': 'None', 'BootSourceOverrideTarget@Redfish.AllowableValues': ['None', 'Pxe', 'Hdd', 'Diags', 'CD/DVD', 'BiosSetup', 'FloppyRemovableMedia', 'UsbKey', 'UsbHdd', 'UsbFloppy', 'UsbCd', 'UefiUsbKey', 'UefiCd', 'UefiHdd', 'UefiUsbHdd', 'UefiUsbCd']}, 'Processors': {'@odata.id': '/redfish/v1/Systems/1/Processors'}, 'Memory': {'@odata.id': '/redfish/v1/Systems/1/Memory'}, 'EthernetInterfaces': {'@odata.id': '/redfish/v1/Systems/1/EthernetInterfaces'}, 'SimpleStorage': {'@odata.id': '/redfish/v1/Systems/1/SimpleStorage'}, 'Storage': {'@odata.id': '/redfish/v1/Systems/1/Storage'}, 'LogServices': {'@odata.id': '/redfish/v1/Systems/1/LogServices'}, 'Bios': {'@odata.id': '/redfish/v1/Systems/1/Bios'}, 'PCIeDevices': [{'@odata.id': '/redfish/v1/Systems/1/PCIeDevices/NIC1'}, {'@odata.id': '/redfish/v1/Systems/1/PCIeDevices/NIC2'}], 'PCIeFunctions': [], 'Links': {'Chassis': [{'@odata.id': '/redfish/v1/Chassis/1'}], 'ManagedBy': [{'@odata.id': '/redfish/v1/Managers/1'}], 'Oem': {}}, 'Actions': {'Oem': {}, '#ComputerSystem.Reset': {'target': '/redfish/v1/Systems/1/Actions/ComputerSystem.Reset', '@Redfish.ActionInfo': '/redfish/v1/Systems/1/ResetActionInfo'}}, 'Oem': {'Supermicro': {'@odata.type': '#SmcSystemExtensions.v1_0_0.System', 'SmcNodeManager': {'@odata.id': '/redfish/v1/Systems/1/SmcNodeManager'}}}},status_code=200)

    kwargs["mock"].post(DAGENT_BMC_URL+'/redfish/v1/Systems/1/Actions/ComputerSystem.Reset', json={'@Message.ExtendedInfo':[{'Message':"Success"}]},status_code=200)

    response = app.test_client().post('/api/v1.0/force_shutdown_system/', headers={'x-access-token': json_token})
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
def test_get_power_sensor_info(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/temp', json={'Members@odata.count':1,'Members':[{'@odata.id':"/redfish/temp2"}]},status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/temp2', json={'Name':{'Power':12,'Input':10},'Reading':10},status_code=200)
    
    kwargs["mock"].get(DAGENT_BMC_URL+CHASSIS_URL, json={'@odata.context': '/redfish/v1/$metadata#ChassisCollection.ChassisCollection', '@odata.type': '#ChassisCollection.ChassisCollection', '@odata.id': '/redfish/v1/Chassis', 'Name': 'Chassis Collection', 'Members': [{'@odata.id': '/redfish/v1/Chassis/1'}], 'Members@odata.count': 1},status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/v1/Chassis/1', json={'Sensors':{'@odata.id':'/redfish/temp'},'@odata.context': '/redfish/v1/$metadata#Chassis.Chassis', '@odata.type': '#Chassis.v1_4_0.Chassis', '@odata.id': '/redfish/v1/Chassis/1', 'Id': '1', 'Name': 'Computer System Chassis', 'ChassisType': 'RackMount', 'Manufacturer': 'Supermicro', 'Model': 'X11DPU', 'SKU': '', 'SerialNumber': 'C219UAI02CH0069', 'PartNumber': 'CSE-219UB2TS-R1K62P-TN24', 'AssetTag': '', 'IndicatorLED': 'Off', 'Status': {'State': 'Enabled', 'Health': 'Critical', 'HealthRollup': 'Critical'}, 'PhysicalSecurity': {'IntrusionSensorNumber': 170, 'IntrusionSensor': 'HardwareIntrusion', 'IntrusionSensorReArm': 'Manual'}, 'Power': {'@odata.id': '/redfish/v1/Chassis/1/Power'}, 'Thermal': {'@odata.id': '/redfish/v1/Chassis/1/Thermal'}, 'Links': {'ComputerSystems': [{'@odata.id': '/redfish/v1/Systems/1'}], 'PCIeDevices': [{'@odata.id': '/redfish/v1/Systems/1/PCIeDevices/NIC1'}, {'@odata.id': '/redfish/v1/Systems/1/PCIeDevices/NIC2'}], 'ManagedBy': [{'@odata.id': '/redfish/v1/Managers/1'}]}, 'Oem': {'Supermicro': {'@odata.type': '#SmcChassisExtensions.v1_0_0.Chassis', 'BoardSerialNumber': 'OM196S007316', 'GUID': '34313031-4D53-AC1F-6BC1-674700000000', 'BoardID': '0x91c'}}}, status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/v1/Chassis/1/Power', json= {'@odata.context': '/redfish/v1/$metadata#Power.Power', '@odata.type': '#Power.v1_1_0.Power', '@odata.id': '/redfish/v1/Chassis/1/Power', 'Id': 'Power', 'Name': 'Power', 'PowerControl': [{'@odata.id': '/redfish/v1/Chassis/1/Power#/PowerControl/0', '@odata.type': '#Power.v1_0_0.PowerControl', 'MemberId': '0', 'Name': 'System Power Control', 'PowerConsumedWatts': 559, 'PowerMetrics': {'IntervalInMin': 5, 'MinConsumedWatts': 559, 'MaxConsumedWatts': 561, 'AverageConsumedWatts': 560}, 'RelatedItem': [{'@odata.id': '/redfish/v1/Systems/1/Processors/1'}, {'@odata.id': '/redfish/v1/Systems/1/Processors/2'}], 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'Oem': {}}], 'Voltages': [{'@odata.id': '/redfish/v1/Chassis/1/Power#/Voltages/0', '@odata.type': '#Power.v1_0_0.Voltage', 'Name': '12V', 'MemberId': '0', 'SensorNumber': 48, 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'ReadingVolts': 12.305, 'UpperThresholdNonCritical': 12.915, 'UpperThresholdCritical': 13.281, 'UpperThresholdFatal': 13.403, 'LowerThresholdNonCritical': 10.78, 'LowerThresholdCritical': 10.536, 'LowerThresholdFatal': 10.17, 'MinReadingRange': 0.166, 'MaxReadingRange': 15.721, 'PhysicalContext': 'VoltageRegulator', 'RelatedItem': [{'@odata.id': '/redfish/v1/Chassis/1'}, {'@odata.id': '/redfish/v1/Systems/1'}]}, {'@odata.id': '/redfish/v1/Chassis/1/Power#/Voltages/1', '@odata.type': '#Power.v1_0_0.Voltage', 'Name': '5VCC', 'MemberId': '1', 'SensorNumber': 49, 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'ReadingVolts': 4.97, 'UpperThresholdNonCritical': 5.6, 'UpperThresholdCritical': 5.72, 'UpperThresholdFatal': 5.81, 'LowerThresholdNonCritical': 4.52, 'LowerThresholdCritical': 4.28, 'LowerThresholdFatal': 4.16, 'MinReadingRange': 0.08, 'MaxReadingRange': 7.73, 'PhysicalContext': 'VoltageRegulator', 'RelatedItem': [{'@odata.id': '/redfish/v1/Chassis/1'}, {'@odata.id': '/redfish/v1/Systems/1'}]}, {'@odata.id': '/redfish/v1/Chassis/1/Power#/Voltages/2', '@odata.type': '#Power.v1_0_0.Voltage', 'Name': '3.3VCC', 'MemberId': '2', 'SensorNumber': 50, 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'ReadingVolts': 3.35, 'UpperThresholdNonCritical': 3.707, 'UpperThresholdCritical': 3.775, 'UpperThresholdFatal': 3.843, 'LowerThresholdNonCritical': 2.976, 'LowerThresholdCritical': 2.823, 'LowerThresholdFatal': 2.738, 'MinReadingRange': 0.001, 'MaxReadingRange': 4.336, 'PhysicalContext': 'VoltageRegulator', 'RelatedItem': [{'@odata.id': '/redfish/v1/Chassis/1'}, {'@odata.id': '/redfish/v1/Systems/1'}]}, {'@odata.id': '/redfish/v1/Chassis/1/Power#/Voltages/3', '@odata.type': '#Power.v1_0_0.Voltage', 'Name': 'Vcpu1', 'MemberId': '3', 'SensorNumber': 52, 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'ReadingVolts': 1.737, 'UpperThresholdNonCritical': 1.944, 'UpperThresholdCritical': 1.998, 'UpperThresholdFatal': 2.097, 'LowerThresholdNonCritical': 1.494, 'LowerThresholdCritical': 1.395, 'LowerThresholdFatal': 1.296, 'MinReadingRange': 0.036, 'MaxReadingRange': 2.331, 'PhysicalContext': 'VoltageRegulator', 'RelatedItem': [{'@odata.id': '/redfish/v1/Systems/1/Processors/1'}]}, {'@odata.id': '/redfish/v1/Chassis/1/Power#/Voltages/4', '@odata.type': '#Power.v1_0_0.Voltage', 'Name': 'Vcpu2', 'MemberId': '4', 'SensorNumber': 53, 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'ReadingVolts': 1.728, 'UpperThresholdNonCritical': 1.944, 'UpperThresholdCritical': 1.998, 'UpperThresholdFatal': 2.097, 'LowerThresholdNonCritical': 1.494, 'LowerThresholdCritical': 1.395, 'LowerThresholdFatal': 1.296, 'MinReadingRange': 0.036, 'MaxReadingRange': 2.331, 'PhysicalContext': 'VoltageRegulator', 'RelatedItem': [{'@odata.id': '/redfish/v1/Systems/1/Processors/2'}]}, {'@odata.id': '/redfish/v1/Chassis/1/Power#/Voltages/5', '@odata.type': '#Power.v1_0_0.Voltage', 'Name': 'VDimmP1ABC', 'MemberId': '5', 'SensorNumber': 54, 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'ReadingVolts': 1.194, 'UpperThresholdNonCritical': 1.35, 'UpperThresholdCritical': 1.374, 'UpperThresholdFatal': 1.398, 'LowerThresholdNonCritical': 1.086, 'LowerThresholdCritical': 1.026, 'LowerThresholdFatal': 0.996, 'MinReadingRange': 0.15, 'MaxReadingRange': 1.68, 'PhysicalContext': 'VoltageRegulator', 'RelatedItem': [{'@odata.id': '/redfish/v1/Systems/1/Processors/1'}]}, {'@odata.id': '/redfish/v1/Chassis/1/Power#/Voltages/6', '@odata.type': '#Power.v1_0_0.Voltage', 'Name': 'VDimmP1DEF', 'MemberId': '6', 'SensorNumber': 55, 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'ReadingVolts': 1.194, 'UpperThresholdNonCritical': 1.35, 'UpperThresholdCritical': 1.374, 'UpperThresholdFatal': 1.398, 'LowerThresholdNonCritical': 1.086, 'LowerThresholdCritical': 1.026, 'LowerThresholdFatal': 0.996, 'MinReadingRange': 0.15, 'MaxReadingRange': 1.68, 'PhysicalContext': 'VoltageRegulator', 'RelatedItem': [{'@odata.id': '/redfish/v1/Systems/1/Processors/1'}]}, {'@odata.id': '/redfish/v1/Chassis/1/Power#/Voltages/7', '@odata.type': '#Power.v1_0_0.Voltage', 'Name': 'VDimmP2ABC', 'MemberId': '7', 'SensorNumber': 56, 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'ReadingVolts': 1.2, 'UpperThresholdNonCritical': 1.35, 'UpperThresholdCritical': 1.374, 'UpperThresholdFatal': 1.398, 'LowerThresholdNonCritical': 1.086, 'LowerThresholdCritical': 1.026, 'LowerThresholdFatal': 0.996, 'MinReadingRange': 0.15, 'MaxReadingRange': 1.68, 'PhysicalContext': 'VoltageRegulator', 'RelatedItem': [{'@odata.id': '/redfish/v1/Systems/1/Processors/2'}]}, {'@odata.id': '/redfish/v1/Chassis/1/Power#/Voltages/8', '@odata.type': '#Power.v1_0_0.Voltage', 'Name': 'VDimmP2DEF', 'MemberId': '8', 'SensorNumber': 57, 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'ReadingVolts': 1.2, 'UpperThresholdNonCritical': 1.35, 'UpperThresholdCritical': 1.374, 'UpperThresholdFatal': 1.398, 'LowerThresholdNonCritical': 1.086, 'LowerThresholdCritical': 1.026, 'LowerThresholdFatal': 0.996, 'MinReadingRange': 0.15, 'MaxReadingRange': 1.68, 'PhysicalContext': 'VoltageRegulator', 'RelatedItem': [{'@odata.id': '/redfish/v1/Systems/1/Processors/2'}]}, {'@odata.id': '/redfish/v1/Chassis/1/Power#/Voltages/9', '@odata.type': '#Power.v1_0_0.Voltage', 'Name': '12VSB', 'MemberId': '9', 'SensorNumber': 58, 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'ReadingVolts': 12.26, 'UpperThresholdNonCritical': 12.91, 'UpperThresholdCritical': 13.3, 'UpperThresholdFatal': 13.43, 'LowerThresholdNonCritical': 10.765, 'LowerThresholdCritical': 10.505, 'LowerThresholdFatal': 10.18, 'MinReadingRange': 0.105, 'MaxReadingRange': 16.68, 'PhysicalContext': 'VoltageRegulator', 'RelatedItem': [{'@odata.id': '/redfish/v1/Chassis/1'}, {'@odata.id': '/redfish/v1/Systems/1'}]}, {'@odata.id': '/redfish/v1/Chassis/1/Power#/Voltages/10', '@odata.type': '#Power.v1_0_0.Voltage', 'Name': '3.3VSB', 'MemberId': '10', 'SensorNumber': 59, 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'ReadingVolts': 3.395, 'UpperThresholdNonCritical': 3.699, 'UpperThresholdCritical': 3.763, 'UpperThresholdFatal': 3.843, 'LowerThresholdNonCritical': 2.979, 'LowerThresholdCritical': 2.819, 'LowerThresholdFatal': 2.739, 'MinReadingRange': 0.163, 'MaxReadingRange': 4.243, 'PhysicalContext': 'VoltageRegulator', 'RelatedItem': [{'@odata.id': '/redfish/v1/Chassis/1'}, {'@odata.id': '/redfish/v1/Systems/1'}]}, {'@odata.id': '/redfish/v1/Chassis/1/Power#/Voltages/11', '@odata.type': '#Power.v1_0_0.Voltage', 'Name': 'P1V8_PCH', 'MemberId': '11', 'SensorNumber': 60, 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'ReadingVolts': 1.728, 'UpperThresholdNonCritical': 2.025, 'UpperThresholdCritical': 2.061, 'UpperThresholdFatal': 2.097, 'LowerThresholdNonCritical': 1.629, 'LowerThresholdCritical': 1.539, 'LowerThresholdFatal': 1.494, 'MinReadingRange': 0.009, 'MaxReadingRange': 2.304, 'PhysicalContext': 'VoltageRegulator', 'RelatedItem': [{'@odata.id': '/redfish/v1/Chassis/1'}, {'@odata.id': '/redfish/v1/Systems/1'}]}, {'@odata.id': '/redfish/v1/Chassis/1/Power#/Voltages/12', '@odata.type': '#Power.v1_0_0.Voltage', 'Name': 'PVNN_PCH', 'MemberId': '12', 'SensorNumber': 61, 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'ReadingVolts': 1, 'UpperThresholdNonCritical': 1.12, 'UpperThresholdCritical': 1.144, 'UpperThresholdFatal': 1.162, 'LowerThresholdNonCritical': 0.904, 'LowerThresholdCritical': 0.856, 'LowerThresholdFatal': 0.832, 'MinReadingRange': 0.136, 'MaxReadingRange': 1.666, 'PhysicalContext': 'VoltageRegulator', 'RelatedItem': [{'@odata.id': '/redfish/v1/Chassis/1'}, {'@odata.id': '/redfish/v1/Systems/1'}]}, {'@odata.id': '/redfish/v1/Chassis/1/Power#/Voltages/13', '@odata.type': '#Power.v1_0_0.Voltage', 'Name': 'P1V05_PCH', 'MemberId': '13', 'SensorNumber': 62, 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'ReadingVolts': 1.044, 'UpperThresholdNonCritical': 1.176, 'UpperThresholdCritical': 1.2, 'UpperThresholdFatal': 1.224, 'LowerThresholdNonCritical': 0.948, 'LowerThresholdCritical': 0.9, 'LowerThresholdFatal': 0.87, 'MinReadingRange': 0.138, 'MaxReadingRange': 1.668, 'PhysicalContext': 'VoltageRegulator', 'RelatedItem': [{'@odata.id': '/redfish/v1/Chassis/1'}, {'@odata.id': '/redfish/v1/Systems/1'}]}], 'PowerSupplies': [{'@odata.id': '/redfish/v1/Chassis/1/Power#/PowerSupplies/0', '@odata.type': '#Power.v1_1_0.PowerSupply', 'MemberId': '0', 'Name': 'Power Supply Bay 1', 'SensorNumber': 196, 'Status': {'State': 'Enabled', 'Health': 'Critical'}, 'Oem': {}, 'PowerSupplyType': 'AC', 'LineInputVoltageType': 'ACMidLine', 'LineInputVoltage': 226, 'LastPowerOutputWatts': 199, 'PowerCapacityWatts': 1600, 'InputRanges': [{'InputType': 'AC', 'MinimumVoltage': 200, 'MaximumVoltage': 240, 'OutputWattage': 1600}], 'Model': 'PWS-1K62A-1R', 'FirmwareVersion': '1.2', 'SerialNumber': 'P1K6BCJ19OB2073', 'RelatedItem': [{'@odata.id': '/redfish/v1/Chassis/1'}], 'Redundancy': [{'@odata.id': '/redfish/v1/Chassis/1/Power#/Redundancy/0'}]}, {'@odata.id': '/redfish/v1/Chassis/1/Power#/PowerSupplies/1', '@odata.type': '#Power.v1_1_0.PowerSupply', 'MemberId': '1', 'Name': 'Power Supply Bay 2', 'SensorNumber': 197, 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'Oem': {}, 'PowerSupplyType': 'AC', 'LineInputVoltageType': 'ACMidLine', 'LineInputVoltage': 225, 'LastPowerOutputWatts': 369, 'PowerCapacityWatts': 1600, 'InputRanges': [{'InputType': 'AC', 'MinimumVoltage': 200, 'MaximumVoltage': 240, 'OutputWattage': 1600}], 'Model': 'PWS-1K62A-1R', 'FirmwareVersion': '1.2', 'SerialNumber': 'P1K6BCJ19OB2077', 'RelatedItem': [{'@odata.id': '/redfish/v1/Chassis/1'}], 'Redundancy': [{'@odata.id': '/redfish/v1/Chassis/1/Power#/Redundancy/0'}]}], 'Redundancy': [{'@odata.id': '/redfish/v1/Chassis/1/Power#/Redundancy/0', '@odata.type': '#Redundancy.v1_2_0.Redundancy', 'MemberId': '0', 'Name': 'PowerSupply Redundancy Group 1', 'Mode': 'Failover', 'MaxNumSupported': 4, 'MinNumNeeded': 1, 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'RedundancySet': [{'@odata.id': '/redfish/v1/Chassis/1/Power#/PowerSupplies/0'}, {'@odata.id': '/redfish/v1/Chassis/1/Power#/PowerSupplies/1'}]}], 'Oem': {'Supermicro': {'@odata.type': '#SmcPowerExtensions.v1_0_0.Power', 'Battery': {'SensorNumber': 51, 'Name': 'VBAT', 'Status': {'State': 'Enabled', 'Health': 'OK'}}}}}
,status_code=200)
    response = app.test_client().get('/api/v1.0/get_power_sensor_info/', headers={'x-access-token': json_token})
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
def test_get_fan_sensor_info(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_BMC_URL+CHASSIS_URL, json={'@odata.context': '/redfish/v1/$metadata#ChassisCollection.ChassisCollection', '@odata.type': '#ChassisCollection.ChassisCollection', '@odata.id': '/redfish/v1/Chassis', 'Name': 'Chassis Collection', 'Members': [{'@odata.id': '/redfish/v1/Chassis/1'}], 'Members@odata.count': 1},status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/v1/Chassis/1', json={'@odata.context': '/redfish/v1/$metadata#Chassis.Chassis', '@odata.type': '#Chassis.v1_4_0.Chassis', '@odata.id': '/redfish/v1/Chassis/1', 'Id': '1', 'Name': 'Computer System Chassis', 'ChassisType': 'RackMount', 'Manufacturer': 'Supermicro', 'Model': 'X11DPU', 'SKU': '', 'SerialNumber': 'C219UAI02CH0069', 'PartNumber': 'CSE-219UB2TS-R1K62P-TN24', 'AssetTag': '', 'IndicatorLED': 'Off', 'Status': {'State': 'Enabled', 'Health': 'Critical', 'HealthRollup': 'Critical'}, 'PhysicalSecurity': {'IntrusionSensorNumber': 170, 'IntrusionSensor': 'HardwareIntrusion', 'IntrusionSensorReArm': 'Manual'}, 'Power': {'@odata.id': '/redfish/v1/Chassis/1/Power'}, 'Thermal': {'@odata.id': '/redfish/v1/Chassis/1/Thermal'}, 'Links': {'ComputerSystems': [{'@odata.id': '/redfish/v1/Systems/1'}], 'PCIeDevices': [{'@odata.id': '/redfish/v1/Systems/1/PCIeDevices/NIC1'}, {'@odata.id': '/redfish/v1/Systems/1/PCIeDevices/NIC2'}], 'ManagedBy': [{'@odata.id': '/redfish/v1/Managers/1'}]}, 'Oem': {'Supermicro': {'@odata.type': '#SmcChassisExtensions.v1_0_0.Chassis', 'BoardSerialNumber': 'OM196S007316', 'GUID': '34313031-4D53-AC1F-6BC1-674700000000', 'BoardID': '0x91c'}}}, status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/v1/Chassis/1/Thermal', json={'Fans':['fan1']},status_code=200)
    response = app.test_client().get('/api/v1.0/get_fan_sensor_info/', headers={'x-access-token': json_token})
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
def test_get_temperature_sensor_info(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_BMC_URL+CHASSIS_URL, json={'@odata.context': '/redfish/v1/$metadata#ChassisCollection.ChassisCollection', '@odata.type': '#ChassisCollection.ChassisCollection', '@odata.id': '/redfish/v1/Chassis', 'Name': 'Chassis Collection', 'Members': [{'@odata.id': '/redfish/v1/Chassis/1'}], 'Members@odata.count': 1},status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/v1/Chassis/1', json={'@odata.context': '/redfish/v1/$metadata#Chassis.Chassis', '@odata.type': '#Chassis.v1_4_0.Chassis', '@odata.id': '/redfish/v1/Chassis/1', 'Id': '1', 'Name': 'Computer System Chassis', 'ChassisType': 'RackMount', 'Manufacturer': 'Supermicro', 'Model': 'X11DPU', 'SKU': '', 'SerialNumber': 'C219UAI02CH0069', 'PartNumber': 'CSE-219UB2TS-R1K62P-TN24', 'AssetTag': '', 'IndicatorLED': 'Off', 'Status': {'State': 'Enabled', 'Health': 'Critical', 'HealthRollup': 'Critical'}, 'PhysicalSecurity': {'IntrusionSensorNumber': 170, 'IntrusionSensor': 'HardwareIntrusion', 'IntrusionSensorReArm': 'Manual'}, 'Power': {'@odata.id': '/redfish/v1/Chassis/1/Power'}, 'Thermal': {'@odata.id': '/redfish/v1/Chassis/1/Thermal'}, 'Links': {'ComputerSystems': [{'@odata.id': '/redfish/v1/Systems/1'}], 'PCIeDevices': [{'@odata.id': '/redfish/v1/Systems/1/PCIeDevices/NIC1'}, {'@odata.id': '/redfish/v1/Systems/1/PCIeDevices/NIC2'}], 'ManagedBy': [{'@odata.id': '/redfish/v1/Managers/1'}]}, 'Oem': {'Supermicro': {'@odata.type': '#SmcChassisExtensions.v1_0_0.Chassis', 'BoardSerialNumber': 'OM196S007316', 'GUID': '34313031-4D53-AC1F-6BC1-674700000000', 'BoardID': '0x91c'}}}, status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/v1/Chassis/1/Thermal', json={'Temperatures':['20']},status_code=200)
    response = app.test_client().get('/api/v1.0/get_temperature_sensor_info/', headers={'x-access-token': json_token})
    assert response.status_code == 200
    
@requests_mock.Mocker(kw="mock")
def test_get_power_summary(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    response = app.test_client().get('/api/v1.0/get_power_summary/', headers={'x-access-token': json_token})
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
def test_set_current_power_mode(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_BMC_URL+CHASSIS_URL, json={'@odata.context': '/redfish/v1/$metadata#ChassisCollection.ChassisCollection', '@odata.type': '#ChassisCollection.ChassisCollection', '@odata.id': '/redfish/v1/Chassis', 'Name': 'Chassis Collection', 'Members': [{'@odata.id': '/redfish/v1/Chassis/1'}], 'Members@odata.count': 1},status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/v1/Chassis/1', json={'@odata.context': '/redfish/v1/$metadata#Chassis.Chassis', '@odata.type': '#Chassis.v1_4_0.Chassis', '@odata.id': '/redfish/v1/Chassis/1', 'Id': '1', 'Name': 'Computer System Chassis', 'ChassisType': 'RackMount', 'Manufacturer': 'Supermicro', 'Model': 'X11DPU', 'SKU': '', 'SerialNumber': 'C219UAI02CH0069', 'PartNumber': 'CSE-219UB2TS-R1K62P-TN24', 'AssetTag': '', 'IndicatorLED': 'Off', 'Status': {'State': 'Enabled', 'Health': 'Critical', 'HealthRollup': 'Critical'}, 'PhysicalSecurity': {'IntrusionSensorNumber': 170, 'IntrusionSensor': 'HardwareIntrusion', 'IntrusionSensorReArm': 'Manual'}, 'Power': {'@odata.id': '/redfish/v1/Chassis/1/Power'}, 'Thermal': {'@odata.id': '/redfish/v1/Chassis/1/Thermal'}, 'Links': {'ComputerSystems': [{'@odata.id': '/redfish/v1/Systems/1'}], 'PCIeDevices': [{'@odata.id': '/redfish/v1/Systems/1/PCIeDevices/NIC1'}, {'@odata.id': '/redfish/v1/Systems/1/PCIeDevices/NIC2'}], 'ManagedBy': [{'@odata.id': '/redfish/v1/Managers/1'}]}, 'Oem': {'Supermicro': {'@odata.type': '#SmcChassisExtensions.v1_0_0.Chassis', 'BoardSerialNumber': 'OM196S007316', 'GUID': '34313031-4D53-AC1F-6BC1-674700000000', 'BoardID': '0x91c'}}}, status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/v1/Chassis/1/Thermal', json={'Temperatures':['20']},status_code=200)
    response = app.test_client().post('/api/v1.0/set_current_power_mode/',data=json.dumps({'newpowermode': "manual"}), headers={'x-access-token': json_token})
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
def test_update_current_power_state(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_BMC_URL+SYSTEM_URL, json={'@odata.context': '/redfish/v1/$metadata#ComputerSystemCollection.ComputerSystemCollection', '@odata.type': '#ComputerSystemCollection.ComputerSystemCollection', '@odata.id': '/redfish/v1/Systems', 'Name': 'Computer System Collection', 'Description': 'Computer System Collection', 'Members@odata.count': 1, 'Members': [{'@odata.id': '/redfish/v1/Systems/1'}]},status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/v1/Systems/1', json={'@odata.context': '/redfish/v1/$metadata#ComputerSystem.ComputerSystem', '@odata.type': '#ComputerSystem.v1_3_0.ComputerSystem', '@odata.id': '/redfish/v1/Systems/1', 'Id': '1', 'Name': 'System', 'Description': 'Description of server', 'Status': {'State': 'Enabled', 'Health': 'Critical'}, 'SerialNumber': 'A264025X9717129', 'PartNumber': 'SYS-2029U-TN24R4T', 'SystemType': 'Physical', 'BiosVersion': '3.1', 'Manufacturer': 'Supermicro', 'Model': 'SYS-2029U-TN24R4T', 'SKU': 'To be filled by O.E.M.', 'UUID': '00000000-0000-0000-0000-AC1F6BC5C8B8', 'ProcessorSummary': {'Count': 2, 'Model': 'Intel(R) Xeon(R) processor', 'Status': {'State': 'Enabled', 'Health': 'OK'}}, 'MemorySummary': {'TotalSystemMemoryGiB': 512, 'Status': {'State': 'Enabled', 'Health': 'OK'}}, 'IndicatorLED': 'Off', 'PowerState': 'On', 'Boot': {'BootSourceOverrideEnabled': 'Disabled', 'BootSourceOverrideTarget': 'None', 'BootSourceOverrideTarget@Redfish.AllowableValues': ['None', 'Pxe', 'Hdd', 'Diags', 'CD/DVD', 'BiosSetup', 'FloppyRemovableMedia', 'UsbKey', 'UsbHdd', 'UsbFloppy', 'UsbCd', 'UefiUsbKey', 'UefiCd', 'UefiHdd', 'UefiUsbHdd', 'UefiUsbCd']}, 'Processors': {'@odata.id': '/redfish/v1/Systems/1/Processors'}, 'Memory': {'@odata.id': '/redfish/v1/Systems/1/Memory'}, 'EthernetInterfaces': {'@odata.id': '/redfish/v1/Systems/1/EthernetInterfaces'}, 'SimpleStorage': {'@odata.id': '/redfish/v1/Systems/1/SimpleStorage'}, 'Storage': {'@odata.id': '/redfish/v1/Systems/1/Storage'}, 'LogServices': {'@odata.id': '/redfish/v1/Systems/1/LogServices'}, 'Bios': {'@odata.id': '/redfish/v1/Systems/1/Bios'}, 'PCIeDevices': [{'@odata.id': '/redfish/v1/Systems/1/PCIeDevices/NIC1'}, {'@odata.id': '/redfish/v1/Systems/1/PCIeDevices/NIC2'}], 'PCIeFunctions': [], 'Links': {'Chassis': [{'@odata.id': '/redfish/v1/Chassis/1'}], 'ManagedBy': [{'@odata.id': '/redfish/v1/Managers/1'}], 'Oem': {}}, 'Actions': {'Oem': {}, '#ComputerSystem.Reset': {'target': '/redfish/v1/Systems/1/Actions/ComputerSystem.Reset', '@Redfish.ActionInfo': '/redfish/v1/Systems/1/ResetActionInfo'}}, 'Oem': {'Supermicro': {'@odata.type': '#SmcSystemExtensions.v1_0_0.System', 'SmcNodeManager': {'@odata.id': '/redfish/v1/Systems/1/SmcNodeManager'}}}},status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/v1/Systems/1/Storage', json={'@odata.context': '/redfish/v1/$metadata#StorageCollection.StorageCollection', '@odata.type': '#StorageCollection.StorageCollection', '@odata.id': '/redfish/v1/Systems/1/Storage', 'Name': 'Storage Collection', 'Members@odata.count': 1, 'Description': 'Storage Collection', 'Members': [{'@odata.id': '/redfish/v1/Systems/1/Storage/NVMeSSD'}]},status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/v1/Systems/1/Storage/NVMeSSD', json={'@odata.context': '/redfish/v1/$metadata#Storage.Storage', '@odata.type': '#Storage.v1_1_0.Storage', '@odata.id': '/redfish/v1/Systems/1/Storage/NVMeSSD', 'Id': 'NVMeSSD', 'Name': 'NVMe Storage System', 'StorageControllers': [{'@odata.id': '/redfish/v1/Systems/1/NVMeSSD#/StorageControllers/0', '@odata.type': '#Storage.v1_1_0.StorageController', 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'Identifiers': [{'DurableName': ''}], 'SupportedControllerProtocols': ['PCIe'], 'SupportedDeviceProtocols': ['NVMe']}], 'Drives': [{'@odata.id': '/redfish/v1/Chassis/NVMeSSD.0.Group.0.StorageBackplane/Drives/Disk.Bay.0'}], 'Volumes': {'@odata.id': '/redfish/v1/Systems/1/Storage/NVMeSSD/Volumes'}, 'Links': {'Enclosures': [{'@odata.id': '/redfish/v1/Chassis/NVMeSSD.0.Group.0.StorageBackplane'}]}, 'Oem': {}, 'Description': 'NVMe SSD', 'Status': {'State': 'Enabled', 'HealthRollup': 'OK', 'Health': 'OK'}},status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/v1/Chassis/NVMeSSD.0.Group.0.StorageBackplane/Drives/Disk.Bay.0', json={'Actions':{'Oem':{'#Drive.SetPowerState':{'target':'/redfish/temp'}}}},status_code=200)
    
    kwargs["mock"].post(DAGENT_BMC_URL+'/redfish/temp', json={'@Message.ExtendedInfo':[{'Message':"Success"}]},status_code=200)

    response = app.test_client().post('/api/v1.0/update_current_power_state/',data=json.dumps({'@odata.id': [1],'PowerState':1}), headers={'x-access-token': json_token})
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
def test_fetch_bmc_logs(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    
    kwargs["mock"].get(DAGENT_BMC_URL+SYSTEM_URL, json={'@odata.context': '/redfish/v1/$metadata#ComputerSystemCollection.ComputerSystemCollection', '@odata.type': '#ComputerSystemCollection.ComputerSystemCollection', '@odata.id': '/redfish/v1/Systems', 'Name': 'Computer System Collection', 'Description': 'Computer System Collection', 'Members@odata.count': 1, 'Members': [{'@odata.id': '/redfish/v1/Systems/1'}]},status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/v1/Systems/1', json={'@odata.context': '/redfish/v1/$metadata#ComputerSystem.ComputerSystem', '@odata.type': '#ComputerSystem.v1_3_0.ComputerSystem', '@odata.id': '/redfish/v1/Systems/1', 'Id': '1', 'Name': 'System', 'Description': 'Description of server', 'Status': {'State': 'Enabled', 'Health': 'Critical'}, 'SerialNumber': 'A264025X9717129', 'PartNumber': 'SYS-2029U-TN24R4T', 'SystemType': 'Physical', 'BiosVersion': '3.1', 'Manufacturer': 'Supermicro', 'Model': 'SYS-2029U-TN24R4T', 'SKU': 'To be filled by O.E.M.', 'UUID': '00000000-0000-0000-0000-AC1F6BC5C8B8', 'ProcessorSummary': {'Count': 2, 'Model': 'Intel(R) Xeon(R) processor', 'Status': {'State': 'Enabled', 'Health': 'OK'}}, 'MemorySummary': {'TotalSystemMemoryGiB': 512, 'Status': {'State': 'Enabled', 'Health': 'OK'}}, 'IndicatorLED': 'Off', 'PowerState': 'On', 'Boot': {'BootSourceOverrideEnabled': 'Disabled', 'BootSourceOverrideTarget': 'None', 'BootSourceOverrideTarget@Redfish.AllowableValues': ['None', 'Pxe', 'Hdd', 'Diags', 'CD/DVD', 'BiosSetup', 'FloppyRemovableMedia', 'UsbKey', 'UsbHdd', 'UsbFloppy', 'UsbCd', 'UefiUsbKey', 'UefiCd', 'UefiHdd', 'UefiUsbHdd', 'UefiUsbCd']}, 'Processors': {'@odata.id': '/redfish/v1/Systems/1/Processors'}, 'Memory': {'@odata.id': '/redfish/v1/Systems/1/Memory'}, 'EthernetInterfaces': {'@odata.id': '/redfish/v1/Systems/1/EthernetInterfaces'}, 'SimpleStorage': {'@odata.id': '/redfish/v1/Systems/1/SimpleStorage'}, 'Storage': {'@odata.id': '/redfish/v1/Systems/1/Storage'}, 'LogServices': {'@odata.id': '/redfish/v1/Systems/1/LogServices'}, 'Bios': {'@odata.id': '/redfish/v1/Systems/1/Bios'}, 'PCIeDevices': [{'@odata.id': '/redfish/v1/Systems/1/PCIeDevices/NIC1'}, {'@odata.id': '/redfish/v1/Systems/1/PCIeDevices/NIC2'}], 'PCIeFunctions': [], 'Links': {'Chassis': [{'@odata.id': '/redfish/v1/Chassis/1'}], 'ManagedBy': [{'@odata.id': '/redfish/v1/Managers/1'}], 'Oem': {}}, 'Actions': {'Oem': {}, '#ComputerSystem.Reset': {'target': '/redfish/v1/Systems/1/Actions/ComputerSystem.Reset', '@Redfish.ActionInfo': '/redfish/v1/Systems/1/ResetActionInfo'}}, 'Oem': {'Supermicro': {'@odata.type': '#SmcSystemExtensions.v1_0_0.System', 'SmcNodeManager': {'@odata.id': '/redfish/v1/Systems/1/SmcNodeManager'}}}},status_code=200)
   
    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/v1/Systems/1/LogServices/EventLog/Entries', json={'Members@odata.count': 1,'Members':[{'Created':"Sat Oct 11 17:13:46 UTC 2003",'Name':"event1",'EntryType':"type1",'Severity':"critical",'Message':"msg"}]},status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/v1/Systems/1/LogServices/Crashdump/Entries', json={'Members@odata.count': 1,'Members':[{'Created':"Sat Oct 11 17:13:46 UTC 2003",'Name':"event1",'EntryType':"type1",'Severity':"critical",'Message':"msg"}]},status_code=200)
 
    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/v1/Managers/1/LogServices/Journal/Entries', json={'Members@odata.count': 1001,'Members':[{'Created':"Sat Oct 11 17:13:46 UTC 2003",'Name':"event1",'EntryType':"type1",'Severity':"critical",'Message':"msg"}]},status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/v1/Managers/1/LogServices/Journal/Entries?$skip=1000', json={'Members@odata.count': 1001,'Members':[{'Created':"Sat Oct 11 17:13:46 UTC 2003",'Name':"event1",'EntryType':"type1",'Severity':"critical",'Message':"msg"}]},status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+MANAGER_URL, json={'@odata.context': '/redfish/v1/$metadata#ManagerCollection.ManagerCollection', '@odata.type': '#ManagerCollection.ManagerCollection', '@odata.id': '/redfish/v1/Managers', 'Name': 'Manager Collection', 'Description': 'Manager Collection', 'Members@odata.count': 1, 'Members': [{'@odata.id': '/redfish/v1/Managers/1'}]}, status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/v1/Managers/1', json= {'@odata.context': '/redfish/v1/$metadata#Manager.Manager', '@odata.type': '#Manager.v1_3_1.Manager', '@odata.id': '/redfish/v1/Managers/1', 'Id': '1', 'Name': 'Manager', 'Description': 'BMC', 'ManagerType': 'BMC', 'UUID': '00000000-0000-0000-0000-AC1F6BC16747', 'Model': 'ASPEED', 'FirmwareVersion': '1.69', 'DateTime': '2020-12-28T18:58:10+00:00', 'DateTimeLocalOffset': '+00:00', 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'GraphicalConsole': {'ServiceEnabled': True, 'MaxConcurrentSessions': 4, 'ConnectTypesSupported': ['KVMIP']}, 'SerialConsole': {'ServiceEnabled': True, 'MaxConcurrentSessions': 1, 'ConnectTypesSupported': ['SSH', 'IPMI']}, 'CommandShell': {'ServiceEnabled': True, 'MaxConcurrentSessions': 0, 'ConnectTypesSupported': ['SSH']}, 'EthernetInterfaces': {'@odata.id': '/redfish/v1/Managers/1/EthernetInterfaces'}, 'SerialInterfaces': {'@odata.id': '/redfish/v1/Managers/1/SerialInterfaces'}, 'NetworkProtocol': {'@odata.id': '/redfish/v1/Managers/1/NetworkProtocol'}, 'LogServices': {'@odata.id': '/redfish/v1/Managers/1/LogServices'}, 'VirtualMedia': {'@odata.id': '/redfish/v1/Managers/1/VM1'}, 'Links': {'ManagerForServers': [{'@odata.id': '/redfish/v1/Systems/1'}], 'ManagerForChassis': [{'@odata.id': '/redfish/v1/Chassis/1'}], 'Oem': {}}, 'Actions': {'Oem': {'#ManagerConfig.Reset': {'target': '/redfish/v1/Managers/1/Actions/Oem/ManagerConfig.Reset'}}, '#Manager.Reset': {'target': '/redfish/v1/Managers/1/Actions/Manager.Reset'}}, 'Oem': {'Supermicro': {'@odata.type': '#SmcManagerExtensions.v1_0_0.Manager', 'ActiveDirectory': {'@odata.id': '/redfish/v1/Managers/1/ActiveDirectory'}, 'SMTP': {'@odata.id': '/redfish/v1/Managers/1/SMTP'}, 'RADIUS': {'@odata.id': '/redfish/v1/Managers/1/RADIUS'}, 'MouseMode': {'@odata.id': '/redfish/v1/Managers/1/MouseMode'}, 'NTP': {'@odata.id': '/redfish/v1/Managers/1/NTP'}, 'LDAP': {'@odata.id': '/redfish/v1/Managers/1/LDAP'}, 'IPAccessControl': {'@odata.id': '/redfish/v1/Managers/1/IPAccessControl'}, 'SMCRAKP': {'@odata.id': '/redfish/v1/Managers/1/SMCRAKP'}, 'SNMP': {'@odata.id': '/redfish/v1/Managers/1/SNMP'}, 'Syslog': {'@odata.id': '/redfish/v1/Managers/1/Syslog'}, 'Snooping': {'@odata.id': '/redfish/v1/Managers/1/Snooping'}, 'FanMode': {'@odata.id': '/redfish/v1/Managers/1/FanMode'}, 'IKVM': {'@odata.id': '/redfish/v1/Managers/1/IKVM'}}}},status_code=200)

    BMC_agent.fetch_bmc_logs()


@requests_mock.Mocker(kw="mock")
def test_getHardwareHealth(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/temp', json={'Members@odata.count':1,'Members':[{'@odata.id':"/redfish/temp2"}]},status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/temp2', json={'Name':{'Power':12,'Input':10},'Reading':10},status_code=200)
    
    kwargs["mock"].get(DAGENT_BMC_URL+CHASSIS_URL, json={'@odata.context': '/redfish/v1/$metadata#ChassisCollection.ChassisCollection', '@odata.type': '#ChassisCollection.ChassisCollection', '@odata.id': '/redfish/v1/Chassis', 'Name': 'Chassis Collection', 'Members': [{'@odata.id': '/redfish/v1/Chassis/1'}], 'Members@odata.count': 1},status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/v1/Chassis/1', json={'Sensors':{'@odata.id':'/redfish/temp'},'@odata.context': '/redfish/v1/$metadata#Chassis.Chassis', '@odata.type': '#Chassis.v1_4_0.Chassis', '@odata.id': '/redfish/v1/Chassis/1', 'Id': '1', 'Name': 'Computer System Chassis', 'ChassisType': 'RackMount', 'Manufacturer': 'Supermicro', 'Model': 'X11DPU', 'SKU': '', 'SerialNumber': 'C219UAI02CH0069', 'PartNumber': 'CSE-219UB2TS-R1K62P-TN24', 'AssetTag': '', 'IndicatorLED': 'Off', 'Status': {'State': 'Enabled', 'Health': 'Critical', 'HealthRollup': 'Critical'}, 'PhysicalSecurity': {'IntrusionSensorNumber': 170, 'IntrusionSensor': 'HardwareIntrusion', 'IntrusionSensorReArm': 'Manual'}, 'Power': {'@odata.id': '/redfish/v1/Chassis/1/Power'}, 'Thermal': {'@odata.id': '/redfish/v1/Chassis/1/Thermal'}, 'Links': {'ComputerSystems': [{'@odata.id': '/redfish/v1/Systems/1'}], 'PCIeDevices': [{'@odata.id': '/redfish/v1/Systems/1/PCIeDevices/NIC1'}, {'@odata.id': '/redfish/v1/Systems/1/PCIeDevices/NIC2'}], 'ManagedBy': [{'@odata.id': '/redfish/v1/Managers/1'}]}, 'Oem': {'Supermicro': {'@odata.type': '#SmcChassisExtensions.v1_0_0.Chassis', 'BoardSerialNumber': 'OM196S007316', 'GUID': '34313031-4D53-AC1F-6BC1-674700000000', 'BoardID': '0x91c'}}}, status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/v1/Chassis/1/Power', json= {'@odata.context': '/redfish/v1/$metadata#Power.Power', '@odata.type': '#Power.v1_1_0.Power', '@odata.id': '/redfish/v1/Chassis/1/Power', 'Id': 'Power', 'Name': 'Power', 'PowerControl': [{'@odata.id': '/redfish/v1/Chassis/1/Power#/PowerControl/0', '@odata.type': '#Power.v1_0_0.PowerControl', 'MemberId': '0', 'Name': 'System Power Control', 'PowerConsumedWatts': 559, 'PowerMetrics': {'IntervalInMin': 5, 'MinConsumedWatts': 559, 'MaxConsumedWatts': 561, 'AverageConsumedWatts': 560}, 'RelatedItem': [{'@odata.id': '/redfish/v1/Systems/1/Processors/1'}, {'@odata.id': '/redfish/v1/Systems/1/Processors/2'}], 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'Oem': {}}], 'Voltages': [{'@odata.id': '/redfish/v1/Chassis/1/Power#/Voltages/0', '@odata.type': '#Power.v1_0_0.Voltage', 'Name': '12V', 'MemberId': '0', 'SensorNumber': 48, 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'ReadingVolts': 12.305, 'UpperThresholdNonCritical': 12.915, 'UpperThresholdCritical': 13.281, 'UpperThresholdFatal': 13.403, 'LowerThresholdNonCritical': 10.78, 'LowerThresholdCritical': 10.536, 'LowerThresholdFatal': 10.17, 'MinReadingRange': 0.166, 'MaxReadingRange': 15.721, 'PhysicalContext': 'VoltageRegulator', 'RelatedItem': [{'@odata.id': '/redfish/v1/Chassis/1'}, {'@odata.id': '/redfish/v1/Systems/1'}]}, {'@odata.id': '/redfish/v1/Chassis/1/Power#/Voltages/1', '@odata.type': '#Power.v1_0_0.Voltage', 'Name': '5VCC', 'MemberId': '1', 'SensorNumber': 49, 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'ReadingVolts': 4.97, 'UpperThresholdNonCritical': 5.6, 'UpperThresholdCritical': 5.72, 'UpperThresholdFatal': 5.81, 'LowerThresholdNonCritical': 4.52, 'LowerThresholdCritical': 4.28, 'LowerThresholdFatal': 4.16, 'MinReadingRange': 0.08, 'MaxReadingRange': 7.73, 'PhysicalContext': 'VoltageRegulator', 'RelatedItem': [{'@odata.id': '/redfish/v1/Chassis/1'}, {'@odata.id': '/redfish/v1/Systems/1'}]}, {'@odata.id': '/redfish/v1/Chassis/1/Power#/Voltages/2', '@odata.type': '#Power.v1_0_0.Voltage', 'Name': '3.3VCC', 'MemberId': '2', 'SensorNumber': 50, 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'ReadingVolts': 3.35, 'UpperThresholdNonCritical': 3.707, 'UpperThresholdCritical': 3.775, 'UpperThresholdFatal': 3.843, 'LowerThresholdNonCritical': 2.976, 'LowerThresholdCritical': 2.823, 'LowerThresholdFatal': 2.738, 'MinReadingRange': 0.001, 'MaxReadingRange': 4.336, 'PhysicalContext': 'VoltageRegulator', 'RelatedItem': [{'@odata.id': '/redfish/v1/Chassis/1'}, {'@odata.id': '/redfish/v1/Systems/1'}]}, {'@odata.id': '/redfish/v1/Chassis/1/Power#/Voltages/3', '@odata.type': '#Power.v1_0_0.Voltage', 'Name': 'Vcpu1', 'MemberId': '3', 'SensorNumber': 52, 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'ReadingVolts': 1.737, 'UpperThresholdNonCritical': 1.944, 'UpperThresholdCritical': 1.998, 'UpperThresholdFatal': 2.097, 'LowerThresholdNonCritical': 1.494, 'LowerThresholdCritical': 1.395, 'LowerThresholdFatal': 1.296, 'MinReadingRange': 0.036, 'MaxReadingRange': 2.331, 'PhysicalContext': 'VoltageRegulator', 'RelatedItem': [{'@odata.id': '/redfish/v1/Systems/1/Processors/1'}]}, {'@odata.id': '/redfish/v1/Chassis/1/Power#/Voltages/4', '@odata.type': '#Power.v1_0_0.Voltage', 'Name': 'Vcpu2', 'MemberId': '4', 'SensorNumber': 53, 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'ReadingVolts': 1.728, 'UpperThresholdNonCritical': 1.944, 'UpperThresholdCritical': 1.998, 'UpperThresholdFatal': 2.097, 'LowerThresholdNonCritical': 1.494, 'LowerThresholdCritical': 1.395, 'LowerThresholdFatal': 1.296, 'MinReadingRange': 0.036, 'MaxReadingRange': 2.331, 'PhysicalContext': 'VoltageRegulator', 'RelatedItem': [{'@odata.id': '/redfish/v1/Systems/1/Processors/2'}]}, {'@odata.id': '/redfish/v1/Chassis/1/Power#/Voltages/5', '@odata.type': '#Power.v1_0_0.Voltage', 'Name': 'VDimmP1ABC', 'MemberId': '5', 'SensorNumber': 54, 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'ReadingVolts': 1.194, 'UpperThresholdNonCritical': 1.35, 'UpperThresholdCritical': 1.374, 'UpperThresholdFatal': 1.398, 'LowerThresholdNonCritical': 1.086, 'LowerThresholdCritical': 1.026, 'LowerThresholdFatal': 0.996, 'MinReadingRange': 0.15, 'MaxReadingRange': 1.68, 'PhysicalContext': 'VoltageRegulator', 'RelatedItem': [{'@odata.id': '/redfish/v1/Systems/1/Processors/1'}]}, {'@odata.id': '/redfish/v1/Chassis/1/Power#/Voltages/6', '@odata.type': '#Power.v1_0_0.Voltage', 'Name': 'VDimmP1DEF', 'MemberId': '6', 'SensorNumber': 55, 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'ReadingVolts': 1.194, 'UpperThresholdNonCritical': 1.35, 'UpperThresholdCritical': 1.374, 'UpperThresholdFatal': 1.398, 'LowerThresholdNonCritical': 1.086, 'LowerThresholdCritical': 1.026, 'LowerThresholdFatal': 0.996, 'MinReadingRange': 0.15, 'MaxReadingRange': 1.68, 'PhysicalContext': 'VoltageRegulator', 'RelatedItem': [{'@odata.id': '/redfish/v1/Systems/1/Processors/1'}]}, {'@odata.id': '/redfish/v1/Chassis/1/Power#/Voltages/7', '@odata.type': '#Power.v1_0_0.Voltage', 'Name': 'VDimmP2ABC', 'MemberId': '7', 'SensorNumber': 56, 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'ReadingVolts': 1.2, 'UpperThresholdNonCritical': 1.35, 'UpperThresholdCritical': 1.374, 'UpperThresholdFatal': 1.398, 'LowerThresholdNonCritical': 1.086, 'LowerThresholdCritical': 1.026, 'LowerThresholdFatal': 0.996, 'MinReadingRange': 0.15, 'MaxReadingRange': 1.68, 'PhysicalContext': 'VoltageRegulator', 'RelatedItem': [{'@odata.id': '/redfish/v1/Systems/1/Processors/2'}]}, {'@odata.id': '/redfish/v1/Chassis/1/Power#/Voltages/8', '@odata.type': '#Power.v1_0_0.Voltage', 'Name': 'VDimmP2DEF', 'MemberId': '8', 'SensorNumber': 57, 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'ReadingVolts': 1.2, 'UpperThresholdNonCritical': 1.35, 'UpperThresholdCritical': 1.374, 'UpperThresholdFatal': 1.398, 'LowerThresholdNonCritical': 1.086, 'LowerThresholdCritical': 1.026, 'LowerThresholdFatal': 0.996, 'MinReadingRange': 0.15, 'MaxReadingRange': 1.68, 'PhysicalContext': 'VoltageRegulator', 'RelatedItem': [{'@odata.id': '/redfish/v1/Systems/1/Processors/2'}]}, {'@odata.id': '/redfish/v1/Chassis/1/Power#/Voltages/9', '@odata.type': '#Power.v1_0_0.Voltage', 'Name': '12VSB', 'MemberId': '9', 'SensorNumber': 58, 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'ReadingVolts': 12.26, 'UpperThresholdNonCritical': 12.91, 'UpperThresholdCritical': 13.3, 'UpperThresholdFatal': 13.43, 'LowerThresholdNonCritical': 10.765, 'LowerThresholdCritical': 10.505, 'LowerThresholdFatal': 10.18, 'MinReadingRange': 0.105, 'MaxReadingRange': 16.68, 'PhysicalContext': 'VoltageRegulator', 'RelatedItem': [{'@odata.id': '/redfish/v1/Chassis/1'}, {'@odata.id': '/redfish/v1/Systems/1'}]}, {'@odata.id': '/redfish/v1/Chassis/1/Power#/Voltages/10', '@odata.type': '#Power.v1_0_0.Voltage', 'Name': '3.3VSB', 'MemberId': '10', 'SensorNumber': 59, 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'ReadingVolts': 3.395, 'UpperThresholdNonCritical': 3.699, 'UpperThresholdCritical': 3.763, 'UpperThresholdFatal': 3.843, 'LowerThresholdNonCritical': 2.979, 'LowerThresholdCritical': 2.819, 'LowerThresholdFatal': 2.739, 'MinReadingRange': 0.163, 'MaxReadingRange': 4.243, 'PhysicalContext': 'VoltageRegulator', 'RelatedItem': [{'@odata.id': '/redfish/v1/Chassis/1'}, {'@odata.id': '/redfish/v1/Systems/1'}]}, {'@odata.id': '/redfish/v1/Chassis/1/Power#/Voltages/11', '@odata.type': '#Power.v1_0_0.Voltage', 'Name': 'P1V8_PCH', 'MemberId': '11', 'SensorNumber': 60, 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'ReadingVolts': 1.728, 'UpperThresholdNonCritical': 2.025, 'UpperThresholdCritical': 2.061, 'UpperThresholdFatal': 2.097, 'LowerThresholdNonCritical': 1.629, 'LowerThresholdCritical': 1.539, 'LowerThresholdFatal': 1.494, 'MinReadingRange': 0.009, 'MaxReadingRange': 2.304, 'PhysicalContext': 'VoltageRegulator', 'RelatedItem': [{'@odata.id': '/redfish/v1/Chassis/1'}, {'@odata.id': '/redfish/v1/Systems/1'}]}, {'@odata.id': '/redfish/v1/Chassis/1/Power#/Voltages/12', '@odata.type': '#Power.v1_0_0.Voltage', 'Name': 'PVNN_PCH', 'MemberId': '12', 'SensorNumber': 61, 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'ReadingVolts': 1, 'UpperThresholdNonCritical': 1.12, 'UpperThresholdCritical': 1.144, 'UpperThresholdFatal': 1.162, 'LowerThresholdNonCritical': 0.904, 'LowerThresholdCritical': 0.856, 'LowerThresholdFatal': 0.832, 'MinReadingRange': 0.136, 'MaxReadingRange': 1.666, 'PhysicalContext': 'VoltageRegulator', 'RelatedItem': [{'@odata.id': '/redfish/v1/Chassis/1'}, {'@odata.id': '/redfish/v1/Systems/1'}]}, {'@odata.id': '/redfish/v1/Chassis/1/Power#/Voltages/13', '@odata.type': '#Power.v1_0_0.Voltage', 'Name': 'P1V05_PCH', 'MemberId': '13', 'SensorNumber': 62, 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'ReadingVolts': 1.044, 'UpperThresholdNonCritical': 1.176, 'UpperThresholdCritical': 1.2, 'UpperThresholdFatal': 1.224, 'LowerThresholdNonCritical': 0.948, 'LowerThresholdCritical': 0.9, 'LowerThresholdFatal': 0.87, 'MinReadingRange': 0.138, 'MaxReadingRange': 1.668, 'PhysicalContext': 'VoltageRegulator', 'RelatedItem': [{'@odata.id': '/redfish/v1/Chassis/1'}, {'@odata.id': '/redfish/v1/Systems/1'}]}], 'PowerSupplies': [{'@odata.id': '/redfish/v1/Chassis/1/Power#/PowerSupplies/0', '@odata.type': '#Power.v1_1_0.PowerSupply', 'MemberId': '0', 'Name': 'Power Supply Bay 1', 'SensorNumber': 196, 'Status': {'State': 'Enabled', 'Health': 'Critical'}, 'Oem': {}, 'PowerSupplyType': 'AC', 'LineInputVoltageType': 'ACMidLine', 'LineInputVoltage': 226, 'LastPowerOutputWatts': 199, 'PowerCapacityWatts': 1600, 'InputRanges': [{'InputType': 'AC', 'MinimumVoltage': 200, 'MaximumVoltage': 240, 'OutputWattage': 1600}], 'Model': 'PWS-1K62A-1R', 'FirmwareVersion': '1.2', 'SerialNumber': 'P1K6BCJ19OB2073', 'RelatedItem': [{'@odata.id': '/redfish/v1/Chassis/1'}], 'Redundancy': [{'@odata.id': '/redfish/v1/Chassis/1/Power#/Redundancy/0'}]}, {'@odata.id': '/redfish/v1/Chassis/1/Power#/PowerSupplies/1', '@odata.type': '#Power.v1_1_0.PowerSupply', 'MemberId': '1', 'Name': 'Power Supply Bay 2', 'SensorNumber': 197, 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'Oem': {}, 'PowerSupplyType': 'AC', 'LineInputVoltageType': 'ACMidLine', 'LineInputVoltage': 225, 'LastPowerOutputWatts': 369, 'PowerCapacityWatts': 1600, 'InputRanges': [{'InputType': 'AC', 'MinimumVoltage': 200, 'MaximumVoltage': 240, 'OutputWattage': 1600}], 'Model': 'PWS-1K62A-1R', 'FirmwareVersion': '1.2', 'SerialNumber': 'P1K6BCJ19OB2077', 'RelatedItem': [{'@odata.id': '/redfish/v1/Chassis/1'}], 'Redundancy': [{'@odata.id': '/redfish/v1/Chassis/1/Power#/Redundancy/0'}]}], 'Redundancy': [{'@odata.id': '/redfish/v1/Chassis/1/Power#/Redundancy/0', '@odata.type': '#Redundancy.v1_2_0.Redundancy', 'MemberId': '0', 'Name': 'PowerSupply Redundancy Group 1', 'Mode': 'Failover', 'MaxNumSupported': 4, 'MinNumNeeded': 1, 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'RedundancySet': [{'@odata.id': '/redfish/v1/Chassis/1/Power#/PowerSupplies/0'}, {'@odata.id': '/redfish/v1/Chassis/1/Power#/PowerSupplies/1'}]}], 'Oem': {'Supermicro': {'@odata.type': '#SmcPowerExtensions.v1_0_0.Power', 'Battery': {'SensorNumber': 51, 'Name': 'VBAT', 'Status': {'State': 'Enabled', 'Health': 'OK'}}}}}
,status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+'/redfish/v1/Chassis/1/Thermal', json={'Temperatures':[{'Status':{'Health':"NOT_OK"}}],'Fans':[{'Status':{'Health':"NOT_OK"}}]},status_code=200)
    response = app.test_client().get('/api/v1.0/get_hardware_health/', headers={'x-access-token': json_token})
    assert response.status_code == 200
       

@requests_mock.Mocker(kw="mock")
def test_getServerInfoException(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_BMC_URL+MANAGER_URL, status_code=200)

    response = app.test_client().get('/api/v1.0/get_server_info/', headers={'x-access-token': json_token})
    
    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
def test_getServerInfoHttpException(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_BMC_URL+MANAGER_URL, status_code=401)

    response = app.test_client().get('/api/v1.0/get_server_info/', headers={'x-access-token': json_token})

    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
def test_getPowerInfoException(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_BMC_URL+CHASSIS_URL, status_code=200)

    response = app.test_client().get('/api/v1.0/get_power_info/', headers={'x-access-token': json_token})

    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
def test_getChassisFrontInfoException(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_BMC_URL+SYSTEM_URL, status_code=200)

    response = app.test_client().get('/api/v1.0/get_chassis_front_info/', headers={'x-access-token': json_token})

    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
def test_powerOnSystemException(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_BMC_URL+SYSTEM_URL, status_code=200)

    response = app.test_client().post('/api/v1.0/power_on_system/', headers={'x-access-token': json_token})

    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
def test_rebootSystemException(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_BMC_URL+SYSTEM_URL, status_code=200)

    response = app.test_client().post('/api/v1.0/reboot_system/', headers={'x-access-token': json_token})

    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
def test_shutdownSystemException(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_BMC_URL+SYSTEM_URL, status_code=200)

    response = app.test_client().post('/api/v1.0/shutdown_system/', headers={'x-access-token': json_token})

    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
def test_forceShutdownSystemException(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_BMC_URL+SYSTEM_URL, status_code=200)

    response = app.test_client().post('/api/v1.0/force_shutdown_system/', headers={'x-access-token': json_token})

    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
def test_getFanSensorInfoException(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_BMC_URL+CHASSIS_URL, status_code=200)

    response = app.test_client().get('/api/v1.0/get_fan_sensor_info/', headers={'x-access-token': json_token})

    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
def test_getTemperatureSensorInfoException(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_BMC_URL+CHASSIS_URL, status_code=200)

    response = app.test_client().get('/api/v1.0/get_temperature_sensor_info/', headers={'x-access-token': json_token})

    assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
def test_setCurrentPowerModeException(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_BMC_URL+CHASSIS_URL, status_code=200)

    response = app.test_client().post('/api/v1.0/set_current_power_mode/', headers={'x-access-token': json_token})

    assert response.status_code == 500


@requests_mock.Mocker(kw="mock")
def test_changeCurrentPowerStateException(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_BMC_URL+SYSTEM_URL, status_code=200)
    response = app.test_client().post('/api/v1.0/update_current_power_state/', headers={'x-access-token': json_token})
    assert response.status_code == 500


@requests_mock.Mocker(kw="mock")
def test_getBmcLogsException(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_BMC_URL+SYSTEM_URL, status_code=200)
    BMC_agent.fetch_bmc_logs()


@requests_mock.Mocker(kw="mock")
def test_getBmcLogs(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_BMC_URL+CHASSIS_URL, status_code=200)

    response = app.test_client().get('/api/v1.0/get_Bmc_Logs/', headers={'x-access-token': json_token})
"""
