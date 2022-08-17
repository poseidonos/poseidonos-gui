import pytest, sys, json, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../")))
import logger as logging
logger = logging.get_logger(__name__)

with open("../config/testcase_mapping.json") as f:
    testcase_config = json.load(f)


def test_sps_4250(setup):
    array_name = testcase_config['Functional']['SPS_4250']['array_name']
    raid_type = testcase_config['Functional']['SPS_4250']['raid_type']
    data_drive = testcase_config['Functional']['SPS_4250']['data_drive']

    assert setup.create_array_first(array_name=array_name, raid_type=raid_type, data_device=data_drive) == False
    logger.info("no array created as expected")