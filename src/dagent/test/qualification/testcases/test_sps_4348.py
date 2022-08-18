import pytest, sys, json, os
from datetime import datetime
sys.path.insert(0, '../')
from lib.request import Request
#rom lib import logger as logging
#logger = logging.get_logger(__name__)

with open("../config/testcase_mapping.json") as f:
    testcase_config = json.load(f)

array_raid = testcase_config["Functional"]["SPS_4348"]["raid_type"]
data_devices = testcase_config["Functional"]["SPS_4348"]["data_devices"]


def test_sps_4348(setup):
    assert setup.create_array_first(raid_type=array_raid,data_device=data_devices) == True
    assert setup.array_mount_first(write_through_mode=True) == True
    assert setup.create_volume() == True
    assert setup.mount_vol() == True
    assert setup.array_unmount_first() == True
    assert setup.array_mount_first(write_through_mode=False) == True
    assert setup.array_unmount_first() == True
    assert setup.array_mount_first(write_through_mode=True) == True
