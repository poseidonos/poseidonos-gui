import pytest, sys, json, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../")))
import logger as logging
logger = logging.get_logger(__name__)

with open("../config/testcase_mapping.json") as f:
    testcase_config = json.load(f)

def test_sps_4248(setup):
    array_name1 = testcase_config['Functional']['SPS_4248']['array_name1']
    array_name2 = testcase_config['Functional']['SPS_4248']['array_name2']
    raid_type = testcase_config['Functional']['SPS_4248']['raid_type']
    data_drive = testcase_config['Functional']['SPS_4248']['data_drive']
    vol_name = testcase_config['Functional']['SPS_4248']['vol_name']
    max_bw = testcase_config['Functional']['SPS_4248']['max_bw']
    min_bw = testcase_config['Functional']['SPS_4248']['min_bw']
    max_iops = testcase_config['Functional']['SPS_4248']['max_iops']
    min_iops = testcase_config['Functional']['SPS_4248']['min_iops']
    subsystem1 = testcase_config['Functional']['SPS_4248']['subsystem1']
    subsystem2 = testcase_config['Functional']['SPS_4248']['subsystem2']

    #minbw and miniops not working in test build
    setup.create_subsystem(nqn_name=subsystem1)
    setup.create_subsystem(nqn_name=subsystem2)
    assert setup.create_array_first(array_name=array_name1,raid_type=raid_type,data_device=data_drive) == True
    assert setup.array_mount_first(array_name=array_name1) == True
    assert setup.create_array_second(array_name=array_name2, raid_type=raid_type, data_device=data_drive) == True
    assert setup.array_mount_second(array_name=array_name2) == True
    assert setup.create_volume(volume_name=vol_name,array_name=array_name1) == True
    assert setup.mount_vol(array_name=array_name1,volume_name=vol_name,subsystem=subsystem1) == True
    assert setup.create_volume(volume_name=vol_name, array_name=array_name2) == True
    assert setup.mount_vol(array_name=array_name2, volume_name=vol_name,subsystem=subsystem2) == True
    assert setup.qos_create_volume_policies(array_name=array_name1, volume_name=vol_name, max_bw = max_bw, max_iops = max_iops) == True
    assert setup.qos_create_volume_policies(array_name=array_name2, volume_name=vol_name, min_iops=min_iops, max_bw=max_bw,
                               max_iops=max_iops) == True
    assert setup.qos_list_volume_policies(array_name=array_name1, volume_name=vol_name) == True

    if setup.qos_list_volume_policies(array_name=array_name1, volume_name=vol_name) == True:
        if setup.qos_volume_list[0]['maxbw'] == max_bw and setup.qos_volume_list[0]['maxiops'] == max_iops:
            logger.info("volume maxbw {} and maxiops {}".format(setup.qos_volume_list[0]['maxbw'],setup.qos_volume_list[0]['maxiops']))

    if setup.qos_list_volume_policies(array_name=array_name2, volume_name=vol_name) == True:
        if setup.qos_volume_list[0]['maxbw'] == max_bw and setup.qos_volume_list[0]['maxiops'] == max_iops:
            logger.info("volume maxbw {} and maxiops {}".format(setup.qos_volume_list[0]['maxbw'],setup.qos_volume_list[0]['maxiops']))




