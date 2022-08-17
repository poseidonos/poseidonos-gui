import pytest, sys, json, os
from datetime import datetime
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../")))
from lib.request import Request
from lib.target_utils import TargetUtils
from lib.node import SSHclient
from lib.utils import Client

import logger as logging
logger = logging.get_logger(__name__)

f = open("../config/topology.json")
config_dict = json.load(f)
target_ip = config_dict["target_login"]["ip"]
target_user = config_dict["target_login"]["user"]
target_password = config_dict["target_login"]["password"]
pos_path = config_dict["target_login"]["path"]

initiator_ip = config_dict["initiator_login"]["ip"]
initiator_user = config_dict["initiator_login"]["user"]
initiator_password = config_dict["initiator_login"]["password"]
@pytest.fixture(scope="function")
def setup():
    req = Request()
    res =  req.ibofos_info()
    #if res == False:
        #assert req.run_ibofos() == True
    assert req.scan_device() == True
    assert req.list_devices() == True
    if req.array_list() == True:
        if len(req.arrays) > 0:
            for name,status in req.array_dict.items():
                if status == "Mounted":
                    assert req.array_unmount_first(array_name=name) == True
                    assert req.delete_array(array_name=name) == True
                else:
                    assert req.delete_array(array_name = name) == True
    else:
        assert req.array_reset() == True
    yield req

@pytest.fixture(scope="function")
def target_setup():
    ssh_obj = SSHclient(target_ip, target_user, target_password)
    target_utils = TargetUtils(ssh_obj,pos_path=pos_path)
    yield target_utils

@pytest.fixture(scope="function")
def client_setup():
    client_obj = Client(
        initiator_ip,
        initiator_user,
        initiator_password,
    )
    yield client_obj
