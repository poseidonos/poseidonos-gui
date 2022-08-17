import pytest, sys, json, os,time
from datetime import datetime
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from lib.request import Request
#rom lib import logger as logging
#logger = logging.get_logger(__name__)
with open("../config/testcase_mapping.json") as f:
    testcase_config = json.load(f)
first_array_name =testcase_config["Functional"]["SPS_4274"]["first_array_name"]
second_array_name = testcase_config["Functional"]["SPS_4274"]["second_array_name"]
raid_type = testcase_config["Functional"]["SPS_4274"]["raid_type"]
array_data_devices = testcase_config["Functional"]["SPS_4274"]["data_devices"]
volume_name = testcase_config["Functional"]["SPS_4274"]["volume_name"]

def test_sps_4274(setup):
    assert setup.create_array_first(array_name=first_array_name, raid_type=raid_type,
                                  data_device=array_data_devices) == True
    assert setup.create_array_second(array_name=second_array_name, raid_type=raid_type,
                                   data_device=array_data_devices) == True
    assert setup.array_mount_first(array_name=first_array_name) == True
    assert setup.array_mount_second(array_name=second_array_name) == True
    assert setup.create_volume_multi(array_name=first_array_name, volume_name=volume_name,vol_count=256) == True
    time.sleep(180)
    assert setup.create_volume_multi(array_name=second_array_name, volume_name=volume_name,vol_count=256) == True