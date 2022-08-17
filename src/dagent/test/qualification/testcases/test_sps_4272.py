import pytest, sys, json, os
from datetime import datetime

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../")))
from request import Request
import logger as logging
logger = logging.get_logger(__name__)

with open("../config/testcase_mapping.json") as f:
    testcase_config = json.load(f)

first_array_name=testcase_config["Functional"]["SPS_4272"]["first_array_name"]
second_array_name=testcase_config["Functional"]["SPS_4272"]["second_array_name"]
first_array_raid = testcase_config["Functional"]["SPS_4272"]["raid_type_first"]
second_array_raid = testcase_config["Functional"]["SPS_4272"]["raid_type_second"]
first_array_data_devices = testcase_config["Functional"]["SPS_4272"]["data_devices_first"]
second_array_data_devices = testcase_config["Functional"]["SPS_4272"]["data_devices_second"]
buffer_device_second = testcase_config["Functional"]["SPS_4272"]["buffer_device_second"]

def test_sps_4273(setup):
    if setup.auto_create_array(array_name=first_array_name, raid_type=first_array_raid,num_data=first_array_data_devices) == True:
        logger.info("Autocreation of first array passed with even data devices")
    else:
        logger.info("Autocreation of array failed with even number of devices")
        assert False
    if setup.auto_create_array(array_name = second_array_name,raid_type=second_array_raid,num_data=second_array_data_devices,buffer_device=buffer_device_second) == True:
        logger.info("Autocreation of second array passed due even number of devices in RAID10")
    else:
        logger.info("Autocreation of second array failed with even number of devices")
        assert False
