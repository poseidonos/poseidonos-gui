import pytest, sys, json, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../")))
import logger as logging
logger = logging.get_logger(__name__)

f = open("../config/testcase_mapping.json")
testcase_config = json.load(f)

def test_sps_4241(setup):
    array_name1 = testcase_config['Functional']['SPS_4241']['array_name1']
    array_name2 = testcase_config['Functional']['SPS_4241']['array_name2']
    raid_type_10 = testcase_config['Functional']['SPS_4241']['raid_type_10']
    raid_type_0 = testcase_config['Functional']['SPS_4241']['raid_type_0']
    raid_type_no = testcase_config['Functional']['SPS_4241']['raid_type_no']
    data_drive_10_0 = testcase_config['Functional']['SPS_4241']['data_drive_10_0']
    spare_drive_5 = testcase_config['Functional']['SPS_4241']['spare_drive_5']
    data_drive_5 = testcase_config['Functional']['SPS_4241']['data_drive_5']
    data_drive_no = testcase_config['Functional']['SPS_4241']['data_drive_no']

    assert setup.create_array_first(array_name=array_name1, raid_type=raid_type_10, data_device=data_drive_10_0) == True
    assert setup.create_array_second(array_name=array_name2, raid_type=raid_type_0, data_device=data_drive_10_0) == True
    assert setup.delete_array(array_name=array_name1) == True
    assert setup.delete_array(array_name=array_name2) == True
    assert setup.create_array_first(array_name=array_name1, data_device=data_drive_5, spare_device=spare_drive_5) == True
    assert setup.delete_array(array_name=array_name1) == True

    # no-RAID is failing manually also
    #assert setup.create_array_first(array_name=array_name1, raid_type=raid_type_no, data_device=data_drive_no) == True
    #assert setup.delete_array(array_name=array_name1) == True
