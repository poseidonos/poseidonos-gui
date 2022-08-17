import pytest, sys, json, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../")))
import logger as logging
logger = logging.get_logger(__name__)

with open("../config/testcase_mapping.json") as f:
    testcase_config = json.load(f)

def test_sps_4245(setup):
    array_name1 = testcase_config['Functional']['SPS_4245']['array_name1']
    array_name2 = testcase_config['Functional']['SPS_4245']['array_name2']
    raid_type = testcase_config['Functional']['SPS_4245']['raid_type']
    data_drive = testcase_config['Functional']['SPS_4245']['data_drive']
    #performed with 3 data drives each 
    assert setup.create_array_first(array_name=array_name1, raid_type=raid_type, data_device=data_drive) == True
    assert setup.create_array_second(array_name=array_name2, raid_type=raid_type, data_device=data_drive) == True
    assert setup.array_mount_first(array_name=array_name1) == True
    assert setup.array_mount_second(array_name=array_name2) == True
    assert setup.array_list() == True
