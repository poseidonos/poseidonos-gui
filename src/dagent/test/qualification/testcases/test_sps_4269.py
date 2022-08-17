import pytest, sys, json, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../")))
import logger as logging
logger = logging.get_logger(__name__)

with open("../config/testcase_mapping.json") as f:
    testcase_config = json.load(f)

def test_sps_4269(setup):
    array_name = testcase_config['Functional']['SPS_4269']['array_name']
    raid_type = testcase_config['Functional']['SPS_4269']['raid_type']
    data_drive = testcase_config['Functional']['SPS_4269']['data_drive']
    vol_name = testcase_config['Functional']['SPS_4269']['vol_name']
    new_name = testcase_config['Functional']['SPS_4269']['new_name']
    subsystem = testcase_config['Functional']['SPS_4269']['subsystem']

    assert setup.create_array_first(array_name=array_name,raid_type=raid_type,data_device=data_drive) == True
    assert setup.array_mount_first(array_name=array_name) == True
    assert setup.create_volume(volume_name=vol_name,array_name=array_name) == True
    assert setup.mount_vol(array_name=array_name,volume_name=vol_name,subsystem=subsystem) == True
    assert setup.rename_volume(volume_name=vol_name, new_name=new_name, array_name=array_name) == True
    assert setup.unmount_vol(array_name = array_name,volume_name =new_name) == True
    assert setup.delete_volume(array_name=array_name,volume_name=new_name) == True


