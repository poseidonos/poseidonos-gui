import pytest, sys, json, os
from datetime import datetime

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../lib")))
from lib.request import Request
import lib.logger as logging
from lib.utils import Client

logger = logging.get_logger(__name__)

with open("../config/testcase_mapping.json") as f:
    testcase_config = json.load(f)

first_array_name=testcase_config["Functional"]["SPS_4340"]["first_array_name"]
second_array_name=testcase_config["Functional"]["SPS_4340"]["second_array_name"]
first_array_raid = testcase_config["Functional"]["SPS_4340"]["raid_type_first"]
second_array_raid = testcase_config["Functional"]["SPS_4340"]["raid_type_second"]
first_array_data_devices = testcase_config["Functional"]["SPS_4340"]["data_devices_first"]
second_array_data_devices = testcase_config["Functional"]["SPS_4340"]["data_devices_second"]

def test_sps_4340(setup):
    assert setup.auto_create_array(array_name=first_array_name, raid_type=first_array_raid,num_data=first_array_data_devices) == True
    assert setup.create_array_second(array_name = second_array_name,raid_type=second_array_raid,data_device=second_array_data_devices) == True
    assert setup.array_mount_first(array_name=first_array_name,write_through_mode=True) == True
    assert setup.array_mount_second(array_name=second_array_name,write_through_mode=True) == True
    arrays = [first_array_name,second_array_name]
    assert setup.list_subsystem() == True
    for i in range(2):
        assert setup.create_volume(array_name=arrays[i]) == True
        assert setup.mount_vol(array_name=arrays[i],subsystem=setup.subsystems[i]) == True
    assert setup.array_unmount_first(array_name=first_array_name) == True
    assert setup.array_mount_first(array_name=first_array_name, write_through_mode=False) == True
    assert setup.array_unmount_second(array_name=second_array_name) == True
    assert setup.array_mount_second(array_name=second_array_name, write_through_mode=True) == True
