import pytest, sys, json, os
from datetime import datetime

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../lib")))
from lib.request import Request
import lib.logger as logging
from lib.utils import Client
logger = logging.get_logger(__name__)

with open("../config/testcase_mapping.json") as f:
    testcase_config = json.load(f)

array_name = testcase_config["Functional"]["SPS_4286"]["array_name"]
raid_type = testcase_config["Functional"]["SPS_4286"]["raid_type"]
data_devices = testcase_config["Functional"]["SPS_4288"]["data_devices"]
def test_sps_4286(setup):
    res = setup.auto_create_array(array_name=array_name, raid_type=raid_type,num_data=data_devices)
    if res == False:
        logger.info("Create array failed because creation of NO-RAID array with 2 devices will fail")
    else:
        logger.error("Create array passed with NO-RAID and 2 devices")