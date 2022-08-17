import pytest, sys, json, os
from datetime import datetime
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../lib")))
import logger as logging
logger = logging.get_logger(__name__)

with open("../config/testcase_mapping.json") as f:
    testcase_config = json.load(f)

def test_sps_4263(setup):
    array_name1 = testcase_config['Functional']['SPS_4263']['array_name1']
    array_name2 = testcase_config['Functional']['SPS_4263']['array_name2']
    raid_type = testcase_config['Functional']['SPS_4263']['raid_type']
    data_drive = testcase_config['Functional']['SPS_4263']['data_drive']

    assert setup.create_array_first(array_name=array_name1, raid_type=raid_type, data_device=data_drive) == True
    assert setup.create_array_second(array_name=array_name2, raid_type=raid_type, data_device=data_drive) == True
    assert setup.array_mount_first(array_name=array_name1) == True
    assert setup.array_mount_second(array_name=array_name2) == True
    assert setup.array_unmount_first(array_name=array_name1) == True
    if setup.array_info(array_name=array_name2) == True:
        if setup.array_state == "NORMAL":
            logger.info("no impact on second array")
    assert setup.array_mount_first(array_name=array_name1) == True