import pytest, sys, json, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../")))
import logger as logging
logger = logging.get_logger(__name__)

with open("../config/testcase_mapping.json") as f:
    testcase_config = json.load(f)

def test_sps_4228(setup):
    event_name1 = testcase_config['Functional']['SPS_4228']['event_name1']
    event_name2 = testcase_config['Functional']['SPS_4228']['event_name2']
    event_name3 = testcase_config['Functional']['SPS_4228']['event_name3']

    assert setup.update_event_wrr(event_name= event_name1) == True
    logger.info("update event {} successfully".format(event_name1))
    assert setup.update_event_wrr(event_name=event_name2) == True
    logger.info("update event {} successfully".format(event_name2))
    assert setup.update_event_wrr(event_name=event_name3) == True
    logger.info("update event {} successfully".format(event_name3))
