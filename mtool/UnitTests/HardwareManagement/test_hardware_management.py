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
        auth='Basic QURNSU46QURNSU4=',
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
    kwargs["mock"].get(DAGENT_BMC_URL+MANAGER_URL, json={'@odata.context': '/redfish/v1/$metadata#ChassisCollection.ChassisCollection', '@odata.type': '#ChassisCollection.ChassisCollection', '@odata.id': '/redfish/v1/Chassis', 'Name': 'Chassis Collection', 'Members': [{'@odata.id': '/redfish/v1/Chassis/1'}, {'@odata.id': '/redfish/v1/Chassis/NVMeSSD.0.Group.0.StorageBackplane'}], 'Members@odata.count': 2}, status_code=200)
    kwargs["mock"].get(DAGENT_BMC_URL+ "/redfish/v1/Chassis/1", json={'@odata.context': '/redfish/v1/$metadata#Chassis.Chassis', '@odata.type': '#Chassis.v1_4_0.Chassis', '@odata.id': '/redfish/v1/Chassis/1', 'Id': '1', 'Name': 'Computer System Chassis', 'ChassisType': 'RackMount', 'Manufacturer': 'Supermicro', 'Model': 'X11DPU', 'SKU': '', 'SerialNumber': 'C219UAI02CH0077', 'PartNumber': 'CSE-219UB2TS-R1K62P-TN24', 'AssetTag': '', 'IndicatorLED': 'Off', 'Status': {'State': 'Enabled', 'Health': 'Critical', 'HealthRollup': 'Critical'}, 'PhysicalSecurity': {'IntrusionSensorNumber': 170, 'IntrusionSensor': 'HardwareIntrusion', 'IntrusionSensorReArm': 'Manual'}, 'Power': {'@odata.id': '/redfish/v1/Chassis/1/Power'}, 'Thermal': {'@odata.id': '/redfish/v1/Chassis/1/Thermal'}, 'Links': {'ComputerSystems': [{'@odata.id': '/redfish/v1/Systems/1'}], 'PCIeDevices': [{'@odata.id': '/redfish/v1/Systems/1/PCIeDevices/NIC1'}, {'@odata.id': '/redfish/v1/Systems/1/PCIeDevices/NIC2'}], 'ManagedBy': [{'@odata.id': '/redfish/v1/Managers/1'}]}, 'Oem': {'Supermicro': {'@odata.type': '#SmcChassisExtensions.v1_0_0.Chassis', 'BoardSerialNumber': 'OM196S007329', 'GUID': '34313031-4D53-AC1F-6BC1-675400000000', 'BoardID': '0x91c'}}}, status_code=200)
    kwargs["mock"].get(DAGENT_BMC_URL+"/redfish/v1/Managers/1/EthernetInterfaces", json=[{'@odata.context': '/redfish/v1/$metadata#EthernetInterface.EthernetInterface', '@odata.type': '#EthernetInterface.v1_0_0.EthernetInterface', '@odata.id': '/redfish/v1/Managers/1/EthernetInterfaces/1', 'Id': '1', 'Name': 'EthernetInterface', 'Description': 'Management Network Interface', 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'InterfaceEnabled': True, 'MACAddress': 'AC:1F:6B:C1:67:54', 'SpeedMbps': 1000, 'AutoNeg': True, 'FullDuplex': True, 'MTUSize': 1500, 'HostName': '', 'VLAN': {'VLANEnable': False, 'VLANId': 0}, 'IPv4Addresses': [{'Address': '107.108.214.139', 'SubnetMask': '255.255.255.0', 'AddressOrigin': 'DHCP', 'Gateway': '107.108.214.1'}], 'IPv6AddressPolicyTable': [{'Prefix': '::1/128', 'Precedence': 50, 'Label': 0}], 'IPv6Addresses': [{'Address': 'fe80::ae1f:6bff:fec1:6754', 'PrefixLength': 64, 'AddressOrigin': 'SLAAC', 'AddressState': 'Preferred'}], 'IPv6StaticAddresses': [{'Address': 'fe80::ae1f:6bff:fec1:6754', 'PrefixLength': 64}], 'IPv6DefaultGateway': 'fe80::ae1f:6bff:fec1:6754', 'NameServers': ['107.110.101.41']}], status_code=200)

    response = app.test_client().get('/api/v1.0/get_server_info/', headers={'x-access-token': json_token})
    print("response TC 2 ",response)
	#assert response.status_code == 200


@requests_mock.Mocker(kw="mock")
def test_getPowerInfo(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_BMC_URL+"/redfish/v1/Systems", json=[{'@odata.context': '/redfish/v1/$metadata#ComputerSystem.ComputerSystem', '@odata.type': '#ComputerSystem.v1_3_0.ComputerSystem', '@odata.id': '/redfish/v1/Systems/1', 'Id': '1', 'Name': 'System', 'Description': 'Description of server', 'Status': {'State': 'Enabled', 'Health': 'Critical'}, 'SerialNumber': 'A264025X9717128', 'PartNumber': 'SYS-2029U-TN24R4T', 'SystemType': 'Physical', 'BiosVersion': '3.1', 'Manufacturer': 'Supermicro', 'Model': 'SYS-2029U-TN24R4T', 'SKU': 'To be filled by O.E.M.', 'UUID': '00000000-0000-0000-0000-AC1F6BC5CB44', 'ProcessorSummary': {'Count': 2, 'Model': 'Intel(R) Xeon(R) processor', 'Status': {'State': 'Enabled', 'Health': 'OK'}}, 'MemorySummary': {'TotalSystemMemoryGiB': 448, 'Status': {'State': 'Enabled', 'Health': 'Warning'}}, 'IndicatorLED': 'Off', 'PowerState': 'On', 'Boot': {'BootSourceOverrideEnabled': 'Disabled', 'BootSourceOverrideTarget': 'None', 'BootSourceOverrideTarget@Redfish.AllowableValues': ['None', 'Pxe', 'Hdd', 'Diags', 'CD/DVD', 'BiosSetup', 'FloppyRemovableMedia', 'UsbKey', 'UsbHdd', 'UsbFloppy', 'UsbCd', 'UefiUsbKey', 'UefiCd', 'UefiHdd', 'UefiUsbHdd', 'UefiUsbCd']}, 'Processors': {'@odata.id': '/redfish/v1/Systems/1/Processors'}, 'Memory': {'@odata.id': '/redfish/v1/Systems/1/Memory'}, 'EthernetInterfaces': {'@odata.id': '/redfish/v1/Systems/1/EthernetInterfaces'}, 'SimpleStorage': {'@odata.id': '/redfish/v1/Systems/1/SimpleStorage'}, 'Storage': {'@odata.id': '/redfish/v1/Systems/1/Storage'}, 'LogServices': {'@odata.id': '/redfish/v1/Systems/1/LogServices'}, 'Bios': {'@odata.id': '/redfish/v1/Systems/1/Bios'}, 'PCIeDevices': [{'@odata.id': '/redfish/v1/Systems/1/PCIeDevices/NIC1'}, {'@odata.id': '/redfish/v1/Systems/1/PCIeDevices/NIC2'}], 'PCIeFunctions': [], 'Links': {'Chassis': [{'@odata.id': '/redfish/v1/Chassis/1'}], 'ManagedBy': [{'@odata.id': '/redfish/v1/Managers/1'}], 'Oem': {}}, 'Actions': {'Oem': {}, '#ComputerSystem.Reset': {'target': '/redfish/v1/Systems/1/Actions/ComputerSystem.Reset', '@Redfish.ActionInfo': '/redfish/v1/Systems/1/ResetActionInfo'}}, 'Oem': {'Supermicro': {'@odata.type': '#SmcSystemExtensions.v1_0_0.System', 'SmcNodeManager': {'@odata.id': '/redfish/v1/Systems/1/SmcNodeManager'}}}}], status_code=200)

    kwargs["mock"].get(DAGENT_BMC_URL+ "/redfish/v1/Chassis/1", json={'@odata.context': '/redfish/v1/$metadata#Chassis.Chassis', '@odata.type': '#Chassis.v1_4_0.Chassis', '@odata.id': '/redfish/v1/Chassis/1', 'Id': '1', 'Name': 'Computer System Chassis', 'ChassisType': 'RackMount', 'Manufacturer': 'Supermicro', 'Model': 'X11DPU', 'SKU': '', 'SerialNumber': 'C219UAI02CH0077', 'PartNumber': 'CSE-219UB2TS-R1K62P-TN24', 'AssetTag': '', 'IndicatorLED': 'Off', 'Status': {'State': 'Enabled', 'Health': 'Critical', 'HealthRollup': 'Critical'}, 'PhysicalSecurity': {'IntrusionSensorNumber': 170, 'IntrusionSensor': 'HardwareIntrusion', 'IntrusionSensorReArm': 'Manual'}, 'Power': {'@odata.id': '/redfish/v1/Chassis/1/Power'}, 'Thermal': {'@odata.id': '/redfish/v1/Chassis/1/Thermal'}, 'Links': {'ComputerSystems': [{'@odata.id': '/redfish/v1/Systems/1'}], 'PCIeDevices': [{'@odata.id': '/redfish/v1/Systems/1/PCIeDevices/NIC1'}, {'@odata.id': '/redfish/v1/Systems/1/PCIeDevices/NIC2'}], 'ManagedBy': [{'@odata.id': '/redfish/v1/Managers/1'}]}, 'Oem': {'Supermicro': {'@odata.type': '#SmcChassisExtensions.v1_0_0.Chassis', 'BoardSerialNumber': 'OM196S007329', 'GUID': '34313031-4D53-AC1F-6BC1-675400000000', 'BoardID': '0x91c'}}}, status_code=200)

    response = app.test_client().get('/api/v1.0/get_power_info/', headers={'x-access-token': json_token})
    print("response TC 3 ",response)
    assert response.status_code == 200

@requests_mock.Mocker(kw="mock")
def test_get_basic_redfish_url(**kwargs):
    auth='Basic QURNSU46QURNSU4='
    req_headers = get_headers(auth)
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_BMC_URL+"/redfish/v1/", json={'@odata.context': '/redfish/v1/$metadata#ServiceRoot.ServiceRoot', '@odata.type': '#ServiceRoot.v1_1_0.ServiceRoot', '@odata.id': '/redfish/v1/', 'Id': 'RootService', 'Name': 'Root Service', 'RedfishVersion': '1.0.1', 'UUID': '00000000-0000-0000-0000-AC1F6BC16754', 'Systems': {'@odata.id': '/redfish/v1/Systems'}, 'Chassis': {'@odata.id': '/redfish/v1/Chassis'}, 'Managers': {'@odata.id': '/redfish/v1/Managers'}, 'Tasks': {'@odata.id': '/redfish/v1/TaskService'}, 'SessionService': {'@odata.id': '/redfish/v1/SessionService'}, 'AccountService': {'@odata.id': '/redfish/v1/AccountService'}, 'EventService': {'@odata.id': '/redfish/v1/EventService'}, 'UpdateService': {'@odata.id': '/redfish/v1/UpdateService'}, 'Registries': {'@odata.id': '/redfish/v1/Registries'}, 'JsonSchemas': {'@odata.id': '/redfish/v1/JsonSchemas'}, 'Links': {'Sessions': {'@odata.id': '/redfish/v1/SessionService/Sessions'}}, 'Oem': {}},headers = req_headers, status_code=200)
    output = BMC_agent.get_basic_redfish_url()
    print("output >>>>>>>>>>>>>>>>>>>>>>",output)

@requests_mock.Mocker(kw="mock")
def test_get_chassis_front_info(**kwargs):
    kwargs["mock"].post(INFLUXDB_URL, text='Success', status_code=204)
    kwargs["mock"].get(DAGENT_BMC_URL+"/redfish/v1/Systems/1/Storage", json=[{'@odata.context': '/redfish/v1/$metadata#Storage.Storage', '@odata.type': '#Storage.v1_1_0.Storage', '@odata.id': '/redfish/v1/Systems/1/Storage/NVMeSSD', 'Id': 'NVMeSSD', 'Name': 'NVMe Storage System', 'StorageControllers': [{'@odata.id': '/redfish/v1/Systems/1/NVMeSSD#/StorageControllers/0', '@odata.type': '#Storage.v1_1_0.StorageController', 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'Identifiers': [{'DurableName': ''}], 'SupportedControllerProtocols': ['PCIe'], 'SupportedDeviceProtocols': ['NVMe']}], 'Drives': [{'@odata.id': '/redfish/v1/Chassis/NVMeSSD.0.Group.0.StorageBackplane/Drives/Disk.Bay.0'}, {'@odata.id': '/redfish/v1/Chassis/NVMeSSD.0.Group.0.StorageBackplane/Drives/Disk.Bay.1'}, {'@odata.id': '/redfish/v1/Chassis/NVMeSSD.0.Group.0.StorageBackplane/Drives/Disk.Bay.2'}, {'@odata.id': '/redfish/v1/Chassis/NVMeSSD.0.Group.0.StorageBackplane/Drives/Disk.Bay.3'}, {'@odata.id': '/redfish/v1/Chassis/NVMeSSD.0.Group.0.StorageBackplane/Drives/Disk.Bay.11'}], 'Volumes': {'@odata.id': '/redfish/v1/Systems/1/Storage/NVMeSSD/Volumes'}, 'Links': {'Enclosures': [{'@odata.id': '/redfish/v1/Chassis/NVMeSSD.0.Group.0.StorageBackplane'}]}, 'Oem': {}, 'Description': 'NVMe SSD', 'Status': {'State': 'Enabled', 'HealthRollup': 'OK', 'Health': 'OK'}}],status_code=200)
    kwargs["mock"].get(DAGENT_BMC_URL+"/redfish/v1/Chassis/NVMeSSD.0.Group.0.StorageBackplane/Drives/Disk.Bay.0", json={'@odata.context': '/redfish/v1/$metadata#Drive.Drive', '@odata.type': '#Drive.v1_1_0.Drive', '@odata.id': '/redfish/v1/Chassis/NVMeSSD.0.Group.0.StorageBackplane/Drives/Disk.Bay.0', 'Name': 'Disk.Bay.0', 'Id': '0', 'Manufacturer': 'Samsung', 'SerialNumber': 'S4C9NF0M500058', 'Model': 'SAMSUNG MZWLL1T6HAJQ-00005', 'StatusIndicator': 'OK', 'FailurePredicted': False, 'CapableSpeedGbs': 31.5, 'Oem': {'Supermicro': {'@odata.type': '#SmcDriveExtensions.v1_0_0.Drive', 'Temperature': 43}}, 'IndicatorLED': 'Off', 'Status': {'State': 'Enabled', 'Health': 'OK'}, 'Links': {'Volumes': []}},status_code=200)
    kwargs["mock"].get(DAGENT_BMC_URL+"/redfish/v1/Systems", json=[{'@odata.context': '/redfish/v1/$metadata#ComputerSystem.ComputerSystem', '@odata.type': '#ComputerSystem.v1_3_0.ComputerSystem', '@odata.id': '/redfish/v1/Systems/1', 'Id': '1', 'Name': 'System', 'Description': 'Description of server', 'Status': {'State': 'Enabled', 'Health': 'Critical'}, 'SerialNumber': 'A264025X9717128', 'PartNumber': 'SYS-2029U-TN24R4T', 'SystemType': 'Physical', 'BiosVersion': '3.1', 'Manufacturer': 'Supermicro', 'Model': 'SYS-2029U-TN24R4T', 'SKU': 'To be filled by O.E.M.', 'UUID': '00000000-0000-0000-0000-AC1F6BC5CB44', 'ProcessorSummary': {'Count': 2, 'Model': 'Intel(R) Xeon(R) processor', 'Status': {'State': 'Enabled', 'Health': 'OK'}}, 'MemorySummary': {'TotalSystemMemoryGiB': 448, 'Status': {'State': 'Enabled', 'Health': 'Warning'}}, 'IndicatorLED': 'Off', 'PowerState': 'On', 'Boot': {'BootSourceOverrideEnabled': 'Disabled', 'BootSourceOverrideTarget': 'None', 'BootSourceOverrideTarget@Redfish.AllowableValues': ['None', 'Pxe', 'Hdd', 'Diags', 'CD/DVD', 'BiosSetup', 'FloppyRemovableMedia', 'UsbKey', 'UsbHdd', 'UsbFloppy', 'UsbCd', 'UefiUsbKey', 'UefiCd', 'UefiHdd', 'UefiUsbHdd', 'UefiUsbCd']}, 'Processors': {'@odata.id': '/redfish/v1/Systems/1/Processors'}, 'Memory': {'@odata.id': '/redfish/v1/Systems/1/Memory'}, 'EthernetInterfaces': {'@odata.id': '/redfish/v1/Systems/1/EthernetInterfaces'}, 'SimpleStorage': {'@odata.id': '/redfish/v1/Systems/1/SimpleStorage'}, 'Storage': {'@odata.id': '/redfish/v1/Systems/1/Storage'}, 'LogServices': {'@odata.id': '/redfish/v1/Systems/1/LogServices'}, 'Bios': {'@odata.id': '/redfish/v1/Systems/1/Bios'}, 'PCIeDevices': [{'@odata.id': '/redfish/v1/Systems/1/PCIeDevices/NIC1'}, {'@odata.id': '/redfish/v1/Systems/1/PCIeDevices/NIC2'}], 'PCIeFunctions': [], 'Links': {'Chassis': [{'@odata.id': '/redfish/v1/Chassis/1'}], 'ManagedBy': [{'@odata.id': '/redfish/v1/Managers/1'}], 'Oem': {}}, 'Actions': {'Oem': {}, '#ComputerSystem.Reset': {'target': '/redfish/v1/Systems/1/Actions/ComputerSystem.Reset', '@Redfish.ActionInfo': '/redfish/v1/Systems/1/ResetActionInfo'}}, 'Oem': {'Supermicro': {'@odata.type': '#SmcSystemExtensions.v1_0_0.System', 'SmcNodeManager': {'@odata.id': '/redfish/v1/Systems/1/SmcNodeManager'}}}}], status_code=200)


    response = app.test_client().get('/api/v1.0/get_chassis_front_info/', headers={'x-access-token': json_token})
    print("response TC 4 ",response)
    assert response.status_code == 200


