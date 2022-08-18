import pytest, sys, json, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../")))
import logger as logging
logger = logging.get_logger(__name__)

with open("../config/testcase_mapping.json") as f:
    testcase_config = json.load(f)

def test_sps_4266(setup):
    array_name1 = testcase_config['Functional']['SPS_4266']['array_name1']
    array_name2 = testcase_config['Functional']['SPS_4266']['array_name2']
    raid_type = testcase_config['Functional']['SPS_4266']['raid_type']
    data_drive = testcase_config['Functional']['SPS_4266']['data_drive']
    vol_count = testcase_config['Functional']['SPS_4266']['vol_count']
    minbw = testcase_config['Functional']['SPS_4266']['minbw']
    maxbw = testcase_config['Functional']['SPS_4266']['maxbw']
    maxiops = testcase_config['Functional']['SPS_4266']['maxiops']
    subsystem1 = testcase_config['Functional']['SPS_4266']['subsystem1']
    subsystem2 = testcase_config['Functional']['SPS_4266']['subsystem2']

    assert setup.create_array_first(array_name=array_name1, raid_type=raid_type, data_device=data_drive) == True
    assert setup.create_array_second(array_name=array_name2, raid_type=raid_type, data_device=data_drive) == True
    assert setup.array_mount_first(array_name=array_name1) == True
    assert setup.array_mount_second(array_name=array_name2) == True
    assert setup.create_volume_multi(array_name=array_name1, vol_count=vol_count, minbw=minbw,maxbw=maxbw, maxiops=maxiops,
                                                               subsystem=subsystem1) == True
    assert setup.create_volume_multi(array_name=array_name2, vol_count=vol_count, minbw=minbw,maxbw=maxbw, maxiops=maxiops,
                                                                    subsystem=subsystem2) == True
    if setup.list_volume(array_name=array_name1) == True:
        if len(setup.volumes) == vol_count:
            logger.info("array1 volumes list: {}".format(setup.volumes))

    if setup.list_volume(array_name=array_name2) == True:
        if len(setup.volumes) == vol_count:
            logger.info("array2 volumes list: {}".format(setup.volumes))






