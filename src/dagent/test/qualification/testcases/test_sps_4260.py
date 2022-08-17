import pytest, sys, json, os
from datetime import datetime
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../lib")))
import logger as logging
logger = logging.get_logger(__name__)

with open("../config/testcase_mapping.json") as f:
    testcase_config = json.load(f)

def test_sps_4260(setup):
    array_name = testcase_config['Functional']['SPS_4260']['array_name']
    raid_type = testcase_config['Functional']['SPS_4260']['raid_type']
    data_drive = testcase_config['Functional']['SPS_4260']['data_drive']

    assert setup.create_array_first(array_name=array_name,raid_type=raid_type,data_device=data_drive) == True
    assert setup.array_mount_first(array_name=array_name) == True

    assert setup.list_devices() == True
    devices = setup.dev_type["SSD"]
    assert setup.array_list() == True
    assert setup.array_info(array_name=setup.arrays[0]) == True
    used_devices = setup.data_dev + setup.spare_dev
    available_devices = list(set(devices) ^ set(used_devices))
    logger.info("available devices in the system {}".format(available_devices))

    assert setup.add_device(array_name=array_name, device_name=available_devices[0]) == False
    logger.info("failed to add spare device as expected")

