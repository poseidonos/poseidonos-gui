import pytest, sys, json, os
from datetime import datetime
sys.path.insert(0, '../')
from lib.request import Request
#rom lib import logger as logging
#logger = logging.get_logger(__name__)

with open("../config/testcase_mapping.json") as f:
    testcase_config = json.load(f)
        
raid_type = testcase_config["Functional"]["SPS_4292"]["raid_type"]
data_devices =  testcase_config["Functional"]["SPS_4292"]["data_devices"]

def test_sps_4292(setup):
    assert setup.create_array_first(raid_type=raid_type,data_device=data_devices) == True
    assert setup.array_info() == True
    assert setup.array_mount_first() == True
    assert setup.array_unmount_first() == True
    assert setup.array_list() == True
    assert setup.delete_array(array_name=setup.arrays[0]) == True