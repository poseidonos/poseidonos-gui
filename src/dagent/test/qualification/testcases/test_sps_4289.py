import pytest, sys, json, os, time
from datetime import datetime

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../")))
from request import Request
import logger as logging

logger = logging.get_logger(__name__)
with open("../config/testcase_mapping.json") as f:
    testcase_config = json.load(f)
first_array_name =testcase_config["Functional"]["SPS_4289"]["first_array_name"]
second_array_name = testcase_config["Functional"]["SPS_4289"]["second_array_name"]
raid_type = testcase_config["Functional"]["SPS_4289"]["raid_type"]
array_data_devices = testcase_config["Functional"]["SPS_4289"]["data_devices"]
second_array_buffer = testcase_config["Functional"]["SPS_4289"]["second_array_buffer"]

def test_sps_4289(setup):
    assert setup.auto_create_array(array_name=first_array_name, raid_type=raid_type,
                                 num_data=array_data_devices) == True
    assert setup.auto_create_array(array_name=second_array_name, raid_type=raid_type,
                                 num_data=array_data_devices,buffer_device=second_array_buffer) == True
    assert setup.array_mount_first(array_name=first_array_name) == True
    assert setup.array_mount_second(array_name=second_array_name) == True
    assert setup.create_volume_multi(array_name=first_array_name, vol_count=256) == True
    time.sleep(180)
    assert setup.create_volume_multi(array_name=second_array_name,vol_count=256) == True