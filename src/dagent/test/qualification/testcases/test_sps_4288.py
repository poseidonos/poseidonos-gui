import pytest, sys, json, os
from datetime import datetime

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../lib")))
from lib.request import Request
import lib.logger as logging
from lib.utils import Client

logger = logging.get_logger(__name__)

with open("../config/testcase_mapping.json") as f:
    testcase_config = json.load(f)

array_name = testcase_config["Functional"]["SPS_4288"]["array_name"]
raid_type = testcase_config["Functional"]["SPS_4288"]["raid_type"]
data_devices = testcase_config["Functional"]["SPS_4288"]["data_devices"]
new_volume_name = testcase_config["Functional"]["SPS_4288"]["new_name"]

def test_sps_4288(setup):
    assert setup.auto_create_array(array_name=array_name, raid_type=raid_type,num_data=data_devices) == True
    assert setup.array_mount_first(array_name = array_name,write_through_mode=True) == True
    assert setup.create_volume(array_name=array_name) == True
    assert setup.mount_vol(array_name=array_name) == True
    assert setup.list_volume(array_name=array_name) == True
    assert setup.array_list() == True
    assert setup.rename_volume(volume_name=setup.volumes[0],new_name=new_volume_name,array_name=setup.arrays[0]) == True
    assert setup.unmount_vol(volume_name=new_volume_name,array_name=setup.arrays[0]) == True
    assert setup.delete_volume(volume_name=new_volume_name,array_name=setup.arrays[0]) == True

