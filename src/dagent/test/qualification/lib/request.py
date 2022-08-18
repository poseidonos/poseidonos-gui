import json
import time
from datetime import timedelta
import os,sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../lib")))
import json
import logger as logging
import requests
import uuid

logger = logging.get_logger(__name__)



class Request:
    def __init__(self):
        file = open("../config/topology.json")
        self.config = json.load(file)
        self.host = self.config["host_url"]
        self.first_array_name = self.config["first_array_name"]
        self.second_array_name = self.config["second_array_name"]
        self.volume_name = self.config["volume_name"]

        '''self.host = "107.111.150.105:3000"
        self.first_array_name = "POSArray1"
        self.second_array_name = "POSArray2"
        self.volume_name = "DUMMY_VOL"'''
        f = open("../config/header_map.json")
        self.config_dict = json.load(f)
    def send_request(self,request_method, url,headers,params = None):
        try:
            #GET request
            if request_method == "GET":
                response = requests.get(url,headers=headers)
                result = response.json()
                result = result['result']
                logger.info(result)
                if response.status_code in [200,202,207] :
                    logger.info("Request success with status code : {} ({})".format(response.status_code,  response.reason))
                    return True, result
                else:
                    raise Exception("Error")
            #Post request
            elif request_method == "POST":
                response = requests.post(url=url,headers=headers,data=json.dumps(params))
                result = response.json()
                result = result['result']
                logger.info(result)
                if response.status_code in [200,202,204]:
                    logger.info("Request success with status code : {} ({})".format(response.status_code,response.reason))
                    return True, result
                else:
                    raise Exception("Error")
            #Delete Request
            elif request_method == "DELETE":
                response = requests.delete(url=url,headers=headers,data=json.dumps(params))
                result = response.json()
                result = result['result']
                if response.status_code in [200,204]:
                    logger.info("Request success with status code : {} ({})".format(response.status_code,response.reason))
                    return True, result
                else:
                    raise Exception("Error")
            elif request_method == "PATCH":
                response = requests.patch(url=url,headers=headers,data=json.dumps(params))
                result = response.json()
                result = result['result']
                logger.info(result)
                if response.status_code in [200,204]:
                    logger.info("Request success with status code : {} ({})".format(response.status_code,response.reason))
                    return True, result
                else:
                    raise Exception("Error")
        except Exception:
            logger.error("Failed with Status code : {} ({})".format(response.status_code,response.reason))
            return False , result    #this statement

    def get_headers(content_type="application/json"):
        return {"X-Request-Id": str(uuid.uuid4())}

    #############################################SSYSTEMS###########################################################

    def run_ibofos(self):
        '''
        Method to run ibofos
        :return: bool
        '''
        try:
            url = self.config_dict["run_ibofos"]["url"]
            headers = self.get_headers()
            req_status, out = self.send_request(request_method="POST", url=url.format(self.host), headers=headers)
            if req_status == True:
                logger.info(out['status']['description'] + ':' + out['status']['posDescription'])
                return True
            else:
                raise Exception("Error")
        except Exception:
            logger.error(out['status']['description'] + ':' + out['status']['posDescription'])
            return False

    def ibofos_info(self):
        '''
        Method get ibofos info
        :return: Bool
        '''
        try:
            url = self.config_dict["ibofos_info"]["url"]
            headers = self.get_headers()
            req_status, out = self.send_request(request_method="GET", url=url.format(self.host), headers=headers)
            if req_status == True:
                logger.info(out['status']['description'] + ':' + out['status']['posDescription'])
                return True
            else:
                raise Exception("Error")
        except Exception:
            logger.error(out['status']['description'] + ':' + out['status']['posDescription'])
            return False

    def set_pos_property(self,pos_property=None):
        '''
        Method to set pos property
        :param pos_property: pos property
        :return: Bool
        '''
        try:
            url = self.config_dict["set_pos_property"]["url"]
            headers = self.get_headers()
            #params =
            req_status, out = self.send_request(request_method="POST", url=url.format(self.host), headers=headers)
            if req_status == True:
                logger.info(out['status']['description'] + ':' + out['status']['posDescription'])
                return True
            else:
                raise Exception("Error")
        except Exception:
            logger.error(out['status']['description'] + ':' + out['status']['posDescription'])
            return False

    def exit_ibofos(self):
        '''
        Method to exit ibofos
        :return: Bool
        '''
        try:
            url = self.config_dict["exit_ibofos"]["url"]
            headers = self.get_headers()
            req_status, out = self.send_request(request_method="DELETE", url=url.format(self.host), headers=headers)
            if req_status == True:
                logger.info(out['status']['description'] + ':' + out['status']['posDescription'])
                return True
            else:
                raise Exception("Error")

        except Exception:
            logger.error(out['status']['description'] + ':' + out['status']['posDescription'])
            return False
    #############################################DEVICES###########################################################

    def scan_device(self):
        """
        Method to scan devices
        :return: None
        """
        try:
            url = self.config_dict["scan_device"]["url"]
            headers = self.get_headers()
            req_status, out = self.send_request(request_method="GET",url = url.format(self.host),headers=headers)
            if req_status == True:
                logger.info(out['status']['description'] + ':' + out['status']['posDescription'])
                return True
            else:
                raise Exception("Error")
        except Exception :
            logger.error(out['status']['description'] + ':' + out['status']['posDescription'])
            return False

    def smart_log(self,device_name):
        """
        Method to get smart log of the device
        :param device_name: Device name
        :return: Bool
        """
        try:
            url = self.config_dict["smart_log"]["url"]
            headers = self.get_headers()
            req_status, out = self.send_request(request_method="GET",url =url.format(self.host,device_name), headers=headers)
            self.device_data = {}
            if req_status == True:
                logger.info(out['status']['description'] + ':' + out['status']['posDescription'])
                self.device_data = out['data']
                logger.info(self.device_data)
                return True
            else:
                raise Exception("Error")
        except Exception:
            logger.error(out['status']['description'] + ':' + out['status']['posDescription'])
            return False

    def list_devices(self):
        '''
            Method to list devices
        '''
        try:
            url = self.config_dict["list_devices"]["url"]
            headers = self.get_headers()
            self.devices = []
            self.device_map = {}
            self.dev_type = {"NVRAM": [], "SSD": []}
            req_status , out =  self.send_request(request_method="GET",url = url.format(self.host), headers = headers)
            if req_status == True :
                logger.info(out['status']['description']+':'+out['status']['posDescription'])
                if "data" in out:
                    dev = out["data"]["devicelist"]
                    for device in dev:
                        self.devices.append(device["name"])
                        dev_map = {
                            "name": device["name"],
                            "addr": device["address"],
                            "mn": device["modelNumber"],
                            "sn": device["serialNumber"],
                            "numa": device["numa"],
                            "size": device["size"],
                            "type": device["type"],
                        }
                        if dev_map["type"] in self.dev_type.keys():
                            self.dev_type[dev_map["type"]].append(dev_map["name"])
                            self.device_map.update({device["name"]: dev_map})
                    logger.info("List of devices : {}".format(self.devices))
                    logger.info("Device details : {}".format(self.device_map))
                return True
            else:
                raise Exception("Request failed")
        except Exception:
            logger.info(out['status']['description'] + ':' + out['status']['posDescription'])
            return False

    def create_device(self,device_name=None):
        try:
            url = self.config_dict["create_device"]["url"]
            headers = self.get_headers()
            params = {
                "param":{
                    "name": "uram0",
                    "numBlocks" : 16777216,
                    "blockSize" : 512,
                    "devType" : "uram",
                    "numa" : 0
            }
            }
            if device_name != None:
                params["param"]["name"]=device_name
            req_status,out  = self.send_request(request_method="POST",url = url.format(self.host) ,headers=headers,params=params)
            if req_status == True:
                logger.info(out['status']['description'] + ':' + out['status']['posDescription'])
                return True
            else:
                raise Exception("Failed")
        except Exception :
            logger.info(out['status']['description'] + ':' + out['status']['posDescription'])
            return False

#######################################ARRAY MANAGMENT#####################################################

    def array_reset(self):
        """
        Method to do array reset
        force delete all arrays
        :return: None
        """
        try:
            url = self.config_dict["array_reset"]["url"]
            headers = self.get_headers()
            req_status, out = self.send_request(request_method="GET", url=url.format(self.host),headers=headers)
            if req_status == True:
                logger.info(out['status']['description'] + ':' + out['status']['posDescription'])
                return True
            else:
                raise Exception("Failed")
        except Exception:
            logger.info(out['status']['description'] + ':' + out['status']['posDescription'])
            return False

    def create_array_first(self,array_name=None,raid_type="RAID5",data_device=3,spare_device=None,buffer_device=None):
        """
        Method to create array
        :param array_name: array name
        :return: Bool
        """
        try:
            url = self.config_dict["create_array_first"]["url"]
            headers = self.get_headers()
            params = {
              "param": {
                "name": "POSArray",
                "raidtype": "RAID5",
                "buffer": [
                  {
                    "deviceName": "uram0"
                  }
                ],
                "data": [
                ],
                "spare": [
                ]
              }
            }
            device ={
                    "deviceName": ""
                  }
            if self.list_devices():
                device_list = list(self.dev_type["SSD"])
                logger.info(device_list)
                if len(device_list) > 0:
                    for i in range(int(data_device)):
                        logger.info(i)
                        device_copy = device.copy()
                        device_copy["deviceName"] = device_list[i]
                        device_list.remove(device_list[i])
                        params["param"]["data"].append(device_copy)
                    if spare_device != None:
                        for dev in range(int(spare_device)):
                            device_copy = device.copy()
                            device_copy["deviceName"] = device_list[dev]
                            params["param"]["spare"].append(device_copy)
            if array_name == None:
                array_name = self.first_array_name
            params["param"]["name"] = array_name
            params["param"]["raidtype"] = raid_type
            if buffer_device != None:
                params["param"]["buffer"] = buffer_device
            logger.info(params)
            req_status, out = self.send_request(request_method="POST", url=url.format(self.host), headers=headers,params=params)
            if req_status == True:
                logger.info(out['status']['description'] + ':' + out['status']['posDescription'])
                return True
            else:
                raise Exception(out['status']['description'] + ':' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            return False

    def create_array_second(self,array_name=None,raid_type="RAID5",data_device=3,spare_device=None,buffer_device="uram1"):
        """
        Method to create second array
        :param array_name: array name
        :return: Bool
        """
        try:
            url = self.config_dict["create_array_second"]["url"]
            headers = self.get_headers()
            params = {
              "param": {
                "name": "POSArray",
                "raidtype": "RAID5",
                "buffer": [
                  {
                    "deviceName": "uram1"
                  }
                ],
                "data": [],
                "spare": []
              }
            }

            assert self.list_devices() == True
            devices = self.dev_type["SSD"]
            uram_devices = self.dev_type["NVRAM"]
            assert self.array_list() == True
            assert self.array_info(array_name=self.arrays[0]) == True
            used_devices = self.data_dev + self.spare_dev
            available_devices = list(set(devices) ^ set(used_devices))
            available_uram = list(set(uram_devices) ^ set(self.buffer_dev))
            logger.info("Available devices : {}".format(available_devices))
            logger.info("Available Uram : {}".format(available_uram))
            device = {
                "deviceName": ""
            }

            if len(available_devices) > 0:
                for dev in range(int(data_device)):
                    device_copy = device.copy()
                    device_copy["deviceName"] = available_devices[dev]
                    available_devices.remove(available_devices[dev])
                    params["param"]["data"].append(device_copy)
                if spare_device != None:
                    for dev in range(int(spare_device)):
                        device_copy = device.copy()
                        device_copy["deviceName"] = available_devices[dev]
                        params["param"]["spare"].append(device_copy)
            logger.info(params)
            if array_name == None:
                array_name = self.second_array_name
            params["param"]["name"] = array_name
            params["param"]["raidtype"] = raid_type
            params["param"]["buffer"][0]["deviceName"] = available_uram[0]

            if buffer_device != None:
                params["param"]["buffer"][0]["deviceName"] = buffer_device
            logger.info("not in buffer device also")
            req_status, out = self.send_request(request_method="POST", url=url.format(self.host), headers=headers,params=params)
            if req_status == True:
                logger.info(out['status']['description'] + ':' + out['status']['posDescription'])
                return True
            else:
                raise Exception(out['status']['description'] + ':' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            return False

    def auto_create_array(self,array_name=None ,num_data = 3,num_spare =0,raid_type="RAID5",buffer_device=None):
        """
        Method to auto create array
        :param array_name: array name
        :return: bool
        """
        try:
            url = self.config_dict["auto_create_array"]["url"]
            headers = self.get_headers()
            params = {
                "param": {
                    "name": "",
                    "raidtype": "",
                    "buffer": [{"deviceName": "uram0"}],
                    "numData" : 2,
                }
            }
            if array_name == None:
                array_name = self.first_array_name
            if buffer_device != None:
                params["param"]["buffer"][0]["deviceName"] = buffer_device
            params["param"]["numData"] = num_data
            if num_spare > 0:
                params["param"]["numSpare"] = num_spare
            params["param"]["raidtype"] = raid_type
            params["param"]["name"] = array_name
            logger.info(params)
            req_status, out = self.send_request(request_method="POST",url =url.format(self.host),headers=headers,params=params)
            logger.info(req_status, out)
            if req_status == True:
                logger.info(out['status']['description'] + ':' + out['status']['posDescription'])
                return True
            else:
                raise Exception("Error!")
        except Exception :
            logger.error(out['status']['description'] + ':' + out['status']['posDescription'])
            return False

    def array_mount_first(self,array_name=None,write_through_mode=False):
        """
        Method to mount first array
        :param array_name: array name
        :return: Bool
        """
        try:
            url = self.config_dict["array_mount_first"]["url"]
            headers = self.get_headers()
            params = {
              "param": {
                "array": "",
                "enable_write_through": False
              }
            }
            if write_through_mode != False:
                params["enable_write_through"] = write_through_mode
            logger.info(params)
            if array_name == None:
                array_name = self.first_array_name
            params["param"]["array"] = array_name
            req_status,out = self.send_request(request_method="POST",url = url.format(self.host,array_name),headers = headers,params=params)
            if req_status == True:
                logger.info(out['status']['description'] + ':' + out['status']['posDescription'])
                return True
            else:
                raise Exception("Error!")
        except Exception:
            logger.error(out['status']['description'] + ':' + out['status']['posDescription'])
            return False

    def array_unmount_first(self,array_name=None):
        """
        Method to unmount array first
        :param array_name: Array name
        :return: Bool
        """
        try:
            url = self.config_dict["array_unmount_first"]["url"]
            headers = self.get_headers()
            params = {
                "param": {
                    "array": ""
                }
            }
            if array_name == None:
                array_name = self.first_array_name
            #params["param"]["array"] = array_name
            req_status, out = self.send_request(request_method="DELETE", url=url.format(self.host,array_name), headers=headers,
                                                   params=params)
            if req_status == True:
                logger.info(out['status']['description'] + ':' + out['status']['posDescription'])
                return True
            else:
                raise Exception("Error!")
        except Exception:
            logger.error(out['status']['description'] + ':' + out['status']['posDescription'])
            return False

    def array_mount_second(self,array_name=None,write_through_mode=False):
        """
        Method to mount second array
        :param array_name: array name
        :return: Bool
        """
        try:
            url = self.config_dict["array_mount_second"]["url"]
            headers = self.get_headers()
            params = {
              "param": {
                "array": ""
              }
            }
            if write_through_mode != False:
                params["enable_write_through"] = write_through_mode
            if array_name == None:
                array_name = self.second_array_name
            params["param"]["array"] = array_name


            req_status,out = self.send_request(request_method="POST",url = url.format(self.host,array_name),headers = headers,params=params)
            if req_status == True:
                logger.info(out['status']['description'] + ':' + out['status']['posDescription'])
                return True
            else:
                raise Exception("Error!")
        except Exception:
            logger.error(out['status']['description'] + ':' + out['status']['posDescription'])
            return False

    def array_unmount_second(self,array_name=None):
        """
        Method to unmount array first
        :param array_name: Array name
        :return: Bool
        """
        try:
            url = self.config_dict["array_unmount_second"]["url"]
            headers = self.get_headers()
            params = {
                "param": {
                    "array": ""
                }
            }
            if array_name == None:
                array_name = self.second_array_name
            req_status, out = self.send_request(request_method="DELETE", url=url.format(self.host,array_name), headers=headers,
                                                   params=params)
            if req_status == True:
                logger.info(out['status']['description'] + ':' + out['status']['posDescription'])
                return True
            else:
                raise Exception("Error!")
        except Exception:
            logger.error(out['status']['description'] + ':' + out['status']['posDescription'])
            return False

    def array_info(self, array_name=None):
        """
        Method to get array information
        """
        try:
            url = self.config_dict["array_info"]["url"]
            headers = self.get_headers()
            self.spare_dev = []
            self.data_dev = []
            self.buffer_dev = []
            self.array_info_out = {}
            if array_name == None:
                array_name = self.first_array_name
            req_status , out = self.send_request(request_method="GET", url=url.format(self.host,array_name), headers=headers)
            if req_status == True:
                logger.info(out['status']['description'] + ':' + out['status']['posDescription'])
                self.array_info_out = out["data"]
                self.array_state = out["data"]["state"]
                self.array_situation = out["data"]["situation"]
                #self.raid_type = out["data"]["raidtype"]
                for dev in out["data"]["devicelist"]:
                    if dev["type"] == "DATA":
                        self.data_dev.append(dev["name"])
                    elif dev["type"] == "SPARE":
                        self.spare_dev.append(dev["name"])
                    elif dev["type"] == "BUFFER":
                        self.buffer_dev.append(dev["name"])
                    else:
                        logger.error("Disk type is unknown")
                logger.info("Array state : {}".format(self.array_state))
                logger.info("Array situation : {}".format(self.array_situation))
                return True
            else:
                raise Exception(out['status']['description'] + ':' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            return False

    def add_device(self,array_name=None,device_name=None):
        """
        Method to add device into the array
        :param array_name: Array name
        :param device_name: Device name
        :return: Bool
        """
        try:
            url = self.config_dict["add_device"]["url"]
            headers = self.get_headers()
            params = {
              "param": {
                "spare": [
                  {
                    "deviceName": ""
                  }
                ]
              }
            }
            if device_name == None:
                self.list_devices()

            params['param']['spare'][0]['deviceName'] = device_name
            req_status, out  = self.send_request(request_method="POST",url=url.format(self.host,array_name),headers=headers,params=params)
            if req_status == True:
                logger.info(out['status']['description'] + ':' + out['status']['posDescription'])
                return True
            else:
                raise Exception("Error")
        except Exception :
            logger.error(out['status']['description'] + ':' + out['status']['posDescription'])
            return False

    def remove_device(self,array_name = None,device_name=None):
        '''
        Method to remove device from the array
        :param device_name: name of the device to be removed
        :return: Bool
        '''
        try:
            url = self.config_dict["remove_device"]["url"]
            headers = self.get_headers()
            if array_name == None:
                array_name = self.first_array_name
            if device_name == None:
                device_name = "unvme-ns-3"
            req_status, out = self.send_request(request_method="DELETE", url=url.format(self.host, array_name,device_name),
                                                   headers=headers)
            if req_status == True:
                logger.info(out['status']['description'] + ':' + out['status']['posDescription'])
                return True
            else:
                raise Exception("Error")
        except Exception:
            logger.error(out['status']['description'] + ':' + out['status']['posDescription'])
            return False

    def delete_array(self,array_name = None):
        '''
        Method to delete array
        :param array_name: Array name
        :return: Bool
        '''
        try:
            url = self.config_dict["delete_array"]["url"]
            headers = self.get_headers()
            params ={
              "param": {
                "array": "POSArray",
                "vol": [
                  {
                    "volumeName": "volume-0"
                  }
                ],
                "maxbw": 40,
                "maxiops": 30
              }
            }
            if array_name == None:
                params["param"]["array"] = self.first_array_name
                array_name = self.first_array_name
            req_status, out = self.send_request(request_method="DELETE",
                                                   url=url.format(self.host,array_name),
                                                   headers=headers,params=params)
            if req_status == True:
                logger.info(out['status']['description'] + ':' + out['status']['posDescription'])
                return True
            else:
                raise Exception("Error")

        except Exception:
            logger.error(out['status']['description'] + ':' + out['status']['posDescription'])
            return False
    def list_array_devices(self,array_name=None):
        '''
        Method to list array devices
        :param array_name:
        :return: bool
        '''
        self.spare_dev = []
        self.data_dev = []
        self.buffer_dev = []
        try:
            url = "http://"+self.host+"/api/ibofos/v1/"+"array/"+"{}/"+"devices"
            headers = self.get_headers()
            if array_name == None:
                array_name = self.first_array_name
            req_status, out = self.send_request(request_method="GET", url=url.format(array_name), headers=headers)
            if req_status == True:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                for dev in out["data"]["devicelist"]:
                    if dev["type"] == "DATA":
                        self.data_dev.append(dev["name"])
                    elif dev["type"] == "SPARE":
                        self.spare_dev.append(dev["name"])
                    elif dev["type"] == "BUFFER":
                        self.buffer_dev.append(dev["name"])
                    else:
                        raise Exception("Disk type is unknown")
                logger.info("Data devices of {} : {}".format(array_name,self.data_dev))
                logger.info("Spare devices of {} : {}".format(array_name,self.spare_dev))
                logger.info("Buffer devices of {} : {}".format(array_name,self.buffer_dev))
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            return False

    def array_list(self):
        """
        Method to list arrays
        """
        try:
            url = self.config_dict["array_list"]["url"]
            headers = self.get_headers()
            self.array_dict = {}
            req_status , out = self.send_request(request_method="GET", url=url.format(self.host), headers=headers)
            if req_status == False and 'status' in out and out['status']['code'] == 1225:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                self.arrays = []
                return True
            if req_status == True:
                    if out['data']['arrayList'] is 'There is no array' :
                        logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                        logger.info(out["data"])
                    else:
                        logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                        for i in out["data"]["arrayList"]:
                            a_name = i["name"]
                            a_status = i["status"]
                            self.array_dict[a_name] = a_status
                        self.arrays = list(self.array_dict.keys())
                        logger.info(self.array_dict)
                        logger.info("Arrays : {}".format(self.arrays))
                    return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            return False

############################################ VOLUME MANAGMENT ######################################################

    def create_volume(self,volume_name=None,array_name=None,size=None,minbw=0,miniops=0,maxbw=0,maxiops=0,subsystem='nqn.2019-04.ibof:subsystem1'):
        """
        Method to create volume
        :param array_name: array name
        :return: bool
        """
        try:
            url = self.config_dict["create_volume"]["url"]
            headers = self.get_headers()
            params = {
              "param": {
                "array": "",
                "name": "vol01",
                "size": 5242880,
                "maxbw": 0,
                "maxiops": 0,
                "subnqn": "nqn.2019-04.ibof:subsystem1",
                "iswalvol": False
              }
            }
            if array_name == None:
                params["param"]["array"] = self.first_array_name
            else:
                params["param"]["array"] = array_name
            if volume_name == None:
                params["param"]["name"] = self.volume_name
            else:
                params["param"]["name"] = volume_name
            if size != None:
                params["param"]["size"] = size
            '''params["param"]["minbw"] =minbw
            params["param"]["miniops"]=miniops'''
            params["param"]['maxbw'] = maxbw
            params["param"]['maxiops'] = maxiops
            params["param"]["subnqn"] = subsystem
            req_status, out = self.send_request(request_method="POST",url=url.format(self.host), headers=headers,params=params)
            if req_status == True:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                return True
            else:
                raise Exception("Error")
        except Exception:
            logger.error(out['status']['description'] + ':' + out['status']['posDescription'])
            return False

    def create_volume_multi(self,array_name=None, vol_count=5, volume_name=None,size=5242880,minbw=0,miniops=0,maxbw=0,maxiops=0,subsystem='nqn.2019-04.ibof:subsystem1'):
        """
        Method to create multiple volumes
        :param array_name: array name
        :param vol_count: number of volumes
        :return: bool
        """
        try:
            url = self.config_dict["create_volume_multi"]["url"]
            headers = self.get_headers()
            params = {
              "param": {
                "array": "POSArray",
                "name": "volume-",
                "size": 5242880,
                "maxbw": 0,
                "maxiops": 0,
                "totalcount": 5,
                "stoponerror": False,
                "namesuffix": 0,
                "mountall": True,
                "subnqn": "nqn.2019-04.ibof:subsystem1"
              }
            }
            if array_name == None:
                params["param"]["array"] = self.first_array_name
            else:
                params["param"]["array"] = array_name
            if vol_count != None:
                params["param"]["totalcount"] = vol_count
            if volume_name != None:
                params["param"]["name"] = volume_name
            params["param"]["size"] = size
            params["param"]["minbw"] = minbw
            params["param"]["miniops"] = miniops
            params["param"]['maxbw'] = maxbw
            params["param"]['maxiops'] = maxiops
            params["param"]["subnqn"] = subsystem
            params["param"]["array"]=array_name
            params["param"]["totalcount"] = vol_count
            req_status, out = self.send_request(request_method="POST", url=url.format(self.host), headers=headers, params=params)
            time.sleep(100)
            if req_status == True:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                return True
            else:
                raise Exception("Error")
        except Exception:
            logger.error(out['status']['description'] + ':' + out['status']['posDescription'])
            return False

    def list_volume(self,array_name=None):
        '''
        Method to list volume
        :return:
        '''
        try:
            url = self.config_dict["list_volume"]["url"]
            headers = self.get_headers()
            self.vol_dict = {}
            self.volumes = []
            if array_name == None:
                array_name=self.first_array_name
            req_status,out = self.send_request(request_method="GET",url = url.format(self.host,array_name), headers=headers)
            if req_status == True:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                if len(out["data"]["volumes"]) == 0:
                    raise Exception(out['status']['description'])
                for vol in out["data"]["volumes"]:
                    self.vol_dict[vol["name"]] = {
                        "total": vol["total"],
                        "status": vol["status"],
                        "max_iops": vol["maxiops"],
                        "maxbw": vol["maxbw"]
                    }
                logger.info(self.vol_dict)
                logger.info("Listing volumes : \n {}".format(self.vol_dict))
                self.volumes = list(self.vol_dict.keys())
                logger.info("Volume list : {}".format(self.volumes))
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            return False

    def volume_info(self,volume_name=None,array_name=None):
        '''
        Method to check volume info
        :param volume_name: Volume name
        :param array_name: Array Name
        :return: Bool
        '''
        try:
            url = self.config_dict["volume_info"]["url"]
            headers = self.get_headers()
            params = {
                "param": {
                    "array": "POSArray",
                    "vol": [
                        {
                            "volumeName": "volume-0"
                        }
                    ]
                }
            }
            if array_name != None:
                params["param"]["array"] = array_name
            else:
                params["param"]["array"] = self.first_array_name
            if array_name != None:
                params["param"]["vol"][0]["volumeName"] = volume_name
            else:
                params["param"]["vol"][0]["volumeName"] = self.volume_name
            self.volume_dict = {}
            req_status, out = self.send_request(request_method="GET", url=url.format(self.host,array_name,volume_name), headers=headers)
            if req_status == True:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                self.volume_dict = out["data"]
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            return False

    def qos_create_volume_policies(self,array_name=None, volume_name=None, min_bw = None, min_iops = None ,max_bw=None, max_iops=None):
        """
        Method to create volume policies
        :param array_name: array name
        :param volume_name: volume name
        :param min_bw : min bandwidth
        :param min_iops : min iops
        :param max_bw: max bandwidth
        :param max_iops: max iops
        :return: Bool
        """
        try:
            url = self.config_dict["qos_create_volume_policies"]["url"]
            headers = self.get_headers()
            params = {
              "param": {
                "array": "POSArray1",
                "vol": [
                  {
                    "volumeName": "volume-0"
                  }
                ],
                "maxbw": 50,
                "maxiops": 50
              }
            }
            if array_name == None:
                params["param"]["array"]=self.first_array_name
            else:
                params["param"]["array"] = array_name
            if volume_name != None:
                params["param"]["vol"][0]["volumeName"] = volume_name
            else:
                params["param"]["vol"][0]["volumeName"] = self.volume_name
            if max_bw != None:
                params["param"]["maxbw"] = max_bw
            if max_iops != None:
                params["param"]["maxiops"] = max_iops
            if min_bw != None:
                params["param"]["minbw"] = min_bw
            if min_iops != None:
                params["param"]["miniops"] = min_iops
            req_status, out = self.send_request(request_method="POST",url=url.format(self.host),headers=headers,params=params)
            if req_status == True:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            return False

    def qos_reset_volume(self,volume_name=None,array_name=None):
        '''
        Method delete reset volume
        :param volume_name: Volume name
        :param array_name: Array name
        :return: bool
        '''
        try:
            url = self.config_dict["qos_reset_volume"]["url"]
            headers = self.get_headers()
            params = {
              "param": {
                "array": "POSArray",
                "vol": [
                  {
                    "volumeName": "volume-0"
                  }
                ]
              }
            }
            if array_name != None:
                params["param"]["array"] = array_name
            else:
                params["param"]["array"] = self.first_array_name
            if volume_name != None:
                params["param"]["vol"][0]["volumeName"] = volume_name
            else:
                params["param"]["vol"][0]["volumeName"] = self.volume_name
            req_status, out = self.send_request(request_method="POST", url=url.format(self.host), headers=headers,
                                                params=params)
            if req_status == True:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            return False

    def qos_list_volume_policies(self,array_name=None,volume_name=None):
        '''
        Method to list qos volume policies
        :param array_name: array name
        :param volume_name: volume name
        :return: bool
        '''
        try:
            url = self.config_dict["qos_list_volume_policies"]["url"]
            headers = self.get_headers()
            params = {
              "param": {
                "array": "POSArray",
                "vol": [
                  {
                    "volumeName": "volume-0"
                  }
                ]
              }
            }
            self.qos_volume_list = []
            if array_name != None:
                params["param"]["array"] = array_name
            else:
                params["param"]["array"] = self.first_array_name
            if volume_name != None:
                params["param"]["vol"][0]["volumeName"] = volume_name
            else:
                params["param"]["vol"][0]["volumeName"] = self.volume_name
            req_status, out = self.send_request(request_method="POST", url=url.format(self.host), headers=headers,
                                                params=params)

            if req_status == True:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                self.qos_volume_list = out["data"]["volumePolicies"]
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            return False

    def mount_vol(self,array_name=None,volume_name=None,subsystem=None):
        '''
        Method to mount vol
        :param array_name: array name
        :param volume_name: volume name
        :param subsystem: subsystem
        :return: Bool
        '''
        try:
            url = self.config_dict["mount_vol"]["url"]
            headers = self.get_headers()
            params = {
              "param": {
                "array": "POSArray",
                "name": "vol0",
                "subnqn": "nqn.2019-04.pos:subsystem1"
              }
            }
            if array_name != None:
                params["param"]["array"] = array_name
            else:
                params["param"]["array"] = self.first_array_name
            if volume_name != None:
                params["param"]["name"] = volume_name
            else:
                params["param"]["name"] = self.volume_name
                volume_name = self.volume_name
            if subsystem != None:
                params["param"]["subnqn"] = subsystem
            req_status, out = self.send_request(request_method="POST", url=url.format(self.host,volume_name), headers=headers,
                                                params=params)
            if req_status == True:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            return False

    def mount_vol_with_subsystem(self,volume_name=None,subsystem="nqn.2019-04.ibof:subsystem1"):
        '''
        Method to mount the volume with subsystem
        :param volume_name: Volume name
        :param subsystem: Subsystem name
        :return: Bool
        '''
        url = self.config_dict["mount_vol_with_subsystem"]["url"]
        headers = self.get_headers()
        if volume_name == None:
            volume_name = self.volume_name
        else:
            volume_name = volume_name
        params = {
            "param": {
                "array": "{{arrayName}}",
                "subnqn": "",
                "transport_type":"tcp",
                "target_address":"107.108.221.146",
                "transport_service_id":"1158"
            }
        }
        if subsystem == None:
            params["params"]["subnqn"] = subsystem
        try:
            req_status, out = self.send_request(request_method="POST", url=url.format(self.host,volume_name), headers=headers,
                                                    params=params)
            if req_status == True:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            return False


    def unmount_vol(self,array_name =None,volume_name =None):
        '''
        Method to unmount volume
        :param array_name: array name
        :param volume_name: volume  name
        :return: Bool
        '''
        try:
            url = self.config_dict["unmount_vol"]["url"]
            headers = self.get_headers()
            params = {
              "param": {
                "array": "POSArray"
              }
            }
            if array_name != None:
                params["param"]["array"] = array_name
            else:
                params["param"]["array"] = self.first_array_name
            if volume_name == None:
                volume_name = self.volume_name
            else:
                volume_name = volume_name
            req_status, out = self.send_request(request_method="DELETE", url=url.format(self.host,volume_name), headers=headers,
                                                params=params)
            if req_status == True:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            return False

    def delete_volume(self,array_name=None,volume_name=None):
        '''
        Method to delete volume from array
        :param array_name: array name
        :param volume_name:volume name
        :return: Bool
        '''
        try:
            url = self.config_dict["delete_volume"]["url"]
            headers = self.get_headers()
            params = {
              "param": {
                "array": "POSArray"
              }
            }
            if array_name != None:
                params["param"]["array"] = array_name
            else:
                params["param"]["array"] = self.first_array_name
            if volume_name == None:
                volume_name = self.volume_name
            else:
                volume_name = volume_name
            req_status, out = self.send_request(request_method="DELETE", url=url.format(self.host,volume_name), headers=headers,
                                                params=params)
            if req_status == True:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            return False

    def rename_volume(self,volume_name,new_name=None,array_name=None):
        '''
        Method to rename volume
        :param volume_name: Target volume
        :param new_name: New name for the volume
        :return: Bool
        '''
        try:
            url = self.config_dict["rename_volume"]["url"]
            headers = self.get_headers()
            params = {
              "param": {
                "array": "POSArray",
                "newname": "newvol01"
              }
            }
            if array_name != None:
                params["param"]["array"] = array_name
            else:
                params["param"]["array"] = self.first_array_name
            if new_name != None:
                params["param"]["newname"] = new_name
            else:
                params["param"]["newname"] = "New_volume"
            if volume_name == None:
                volume_name = self.volume_name
            req_status, out = self.send_request(request_method="PATCH",url = url.format(self.host,volume_name),headers = headers,params = params)
            if req_status == True:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                return True
            else:
                raise Exception("Error")
        except Exception as e:
            logger.error(out['status']['description'] + ' : ' + out['status']['posDescription'])
            return False

    def get_max_volume_count(self):
        """
        Method to get Max volume
        :return: Bool
        """
        try:
            url = self.config_dict["get_max_volume_count"]["url"]
            headers = self.get_headers()
            req_status, out = self.send_request(request_method="GET",url =url.format(self.host), headers=headers)
            if req_status == True:
                self.max_array_count = out["data"]["current array count"]
                self.max_vol_per_array = out["data"]["max volume count per Array"]
                self.max_vol_count = out["data"]["total max volume count"]
                logger.info("Current Array Count : {}".format(self.max_array_count))
                logger.info("Max volume count per array : {}".format(self.max_vol_per_array))
                logger.info("Max total volume count : {}".format(self.max_vol_count))
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            return False
############################################ SUBSYTEM ######################################################

    def create_transport(self,transport=None):
        '''
        Method to create transport
        :param transport: Transport type
        :return: Bool
        '''
        try:
            url = self.config_dict["create_transport"]["url"]
            headers = self.get_headers()
            params = {
                "param": {
                    "transport_type": "tcp",
                    "buf_cache_size": 64,
                    "num_shared_buf": 4096
            }
            }
            if transport != None:
                params["param"]["transport_type"] = transport
            req_status, out = self.send_request(request_method="POST", url=url.format(self.host), headers=headers,
                                                params=params)
            if req_status == True:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            return False

    def create_subsystem(self,nqn_name=None):
        '''
        Method to create subsystem
        :param nqn_name: Nqn name
        :return: Bool
        '''
        try:
            url = self.config_dict["create_subsystem"]["url"]
            headers = self.get_headers()
            params = {
                "param": {
                    "name":"nqn.2019-04.ibof:subsystem1",
                    "sn": "POS0000000003",
                    "mn": "IBOF_VOLUME_EEEXTENSION",
                    "max_namespaces": 256,
                    "allow_any_host": True
                }
            }

            if nqn_name != None:
                params["param"]["name"] = nqn_name
            req_status, out = self.send_request(request_method="POST", url=url.format(self.host), headers=headers,
                                                params=params)
            if req_status == True:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            return False
    def list_subsystem(self):
        '''
        Method to list susbystems
        :return: Bool
        '''
        try:
            url = self.config_dict["list_subsystem"]["url"]
            headers = self.get_headers()
            self.subsystems = []
            req_status, out = self.send_request(request_method="GET", url=url.format(self.host), headers=headers)
            if req_status == True:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                for data in out["data"]["subsystemlist"]:
                    self.subsystems.append(data["subnqn"])
                self.subsystems.remove("nqn.2014-08.org.nvmexpress.discovery")
                logger.info("Available subsystems : {}".format(self.subsystems))
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            return False

    def add_listner(self,subsystem=None,transport_type=None,target_ip=None):
        '''
        Method to add listner
        :param subsystem: subsystem name
        :param transport_type: transport type
        :param target_ip: target ip
        :return:
        '''
        try:
            url = self.config_dict["add_listner"]["url"]
            headers = self.get_headers()
            params = {
                "param": {
                    "name":"nqn.2019-04.pos:subsystem1",
                    "transport_type":"tcp",
                    "target_address":"10.0.0.69",
                    "transport_service_id":"1158"
            }
            }
            if subsystem != None:
                params["param"]["name"] = subsystem
            if transport_type != None:    
                params["param"]["transport_type"] = transport_type
            if target_ip != None:    
                params["param"]["target_address"] = target_ip
            req_status, out = self.send_request(request_method="POST", url=url.format(self.host), headers=headers,
                                                params=params)
            if req_status == True:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            return False
######################################################METRIC###########################################################

    def cpu(self):
        '''
        Method to get cpu usage
        '''
        try:
            url = self.config_dict["cpu"]["url"]
            headers = self.get_headers()
            req_status , out = self.send_request(request_method = "GET", url = url.format(self.host),headers=headers)
            if req_status == True:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                logger.info(out['data'])
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])

        except Exception as e:
            logger.error(e)
            logger.error(out['status']['problem'] + ' : ' + out['status']['solution'])
            return False

    def cpu_with_period(self,period = '15m'):
        '''
            Method to get cpu usage
        '''
        try:
            url = self.config_dict["cpu_with_period"]["url"]
            headers = self.get_headers()
            req_status, out = self.send_request(request_method="GET", url=url.format(self.host,period), headers=headers)
            if req_status == True and len(out['data']) != 0:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                logger.info(out['data'])
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])

        except Exception as e:
            logger.error(e)
            logger.error(out['status']['problem'] + ' : ' + out['status']['solution'])
            return False

    def memory(self):
        '''
        Method to get memmory
        :return: Bool
        '''
        try:
            url = self.config_dict["memory"]["url"]
            headers = self.get_headers()
            req_status, out = self.send_request(request_method="GET", url=url.format(self.host), headers=headers)
            if req_status == True and len(out['data']) != 0:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                logger.info(out['data'])
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])

        except Exception as e:
            logger.error(e)
            logger.error(out['status']['problem'] + ' : ' + out['status']['solution'])
            return False

    def memory_with_period(self,period = '15m'):
        '''
            Method to get cpu usage
        '''
        try:
            url = self.config_dict["cpu_with_period"]["url"]
            headers = self.get_headers()
            req_status, out = self.send_request(request_method="GET", url=url.format(self.host,period), headers=headers)
            if req_status == True and len(out['data']) != 0:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                logger.info(out['data'])
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])

        except Exception as e:
            logger.error(e)
            logger.error(out['status']['problem'] + ' : ' + out['status']['solution'])
            return False

    def network(self):
        '''
        Method to get network usage details
        :return: Bool
        '''
        try:
            url = self.config_dict["network"]["url"]
            headers = self.get_headers()
            req_status, out = self.send_request(request_method="GET", url=url.format(self.host), headers=headers)
            if req_status == True and len(out['data']) != 0:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                logger.info(out['data'])
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            logger.error(out['status']['problem'] + ' : ' + out['status']['solution'])
            return False

    def network_with_period(self,period = '15m'):
        '''
            Method to get NETWORK WITH PERIOD
        '''
        try:
            url = self.config_dict["cpu_with_period"]["url"]
            headers = self.get_headers()
            req_status, out = self.send_request(request_method="GET", url=url.format(self.host,period), headers=headers)
            if req_status == True and len(out['data']) != 0:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                logger.info(out['data'])
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])

        except Exception as e:
            logger.error(e)
            logger.error(out['status']['problem'] + ' : ' + out['status']['solution'])
            return False

    def read_bw(self):
        '''
        Method to read bw value
        :return: Bool
        '''
        try:
            url = self.config_dict["read_bw"]["url"]
            headers = self.get_headers()
            self.read_bw = []
            req_status, out = self.send_request(request_method="GET", url=url.format(self.host), headers=headers)
            if req_status == True and len(out['data']) != 0:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                logger.info(out['data'])
                for data in out["data"][0]:
                    self.read_bw.append(data["bw"])
                logger.info("Read iops : {}".format(self.read_bw))
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            logger.error(out['status']['problem'] + ' : ' + out['status']['solution'])
            return False

    def read_bw_with_period(self,period = "5m"):
        '''
        Method to read bw with period
        :param period:
        :return:
        '''
        try:
            url = self.config_dict["read_bw_with_period"]["url"]
            headers = self.get_headers()
            self.read_bw_with_period=[]
            req_status, out = self.send_request(request_method="GET", url=url.format(self.host,period), headers=headers)
            if req_status == True and len(out['data']) != 0:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                logger.info(out['data'])
                for data in out["data"][0]:
                    self.read_bw_with_period.append(data["bw"])
                logger.info("Read bw : {}".format(self.read_bw_with_period))
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            logger.error(out['status']['problem'] + ' : ' + out['status']['solution'])
            return False
    def write_bw(self):
        '''
        Method to get write bw value
        :return: Bool
        '''
        try:
            url = self.config_dict["write_bw"]["url"]
            headers = self.get_headers()
            self.write_bw = []
            req_status, out = self.send_request(request_method="GET", url=url.format(self.host), headers=headers)
            if req_status == True and len(out['data']) != 0:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                logger.info(out['data'])
                for data in out["data"][0]:
                    self.write_bw.append(data["bw"])
                logger.info("Write bw : {}".format(self.write_bw))
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            logger.error(out['status']['problem'] + ' : ' + out['status']['solution'])
            return False
        
    def write_bw_with_period(self,period = "5m"):
        '''
        Method to read bw with period
        :param period:
        :return:
        '''
        try:
            url = self.config_dict["write_bw_with_period"]["url"]
            headers = self.get_headers()
            self.write_bw_with_period=[]
            req_status, out = self.send_request(request_method="GET", url=url.format(self.host,period), headers=headers)
            if req_status == True and len(out['data']) != 0:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                logger.info(out['data'])
                for data in out["data"][0]:
                    self.write_bw_with_period.append(data["bw"])
                logger.info("Read bw : {}".format(self.write_bw_with_period))
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            logger.error(out['status']['problem'] + ' : ' + out['status']['solution'])

    def vol_write_bw(self):
        '''
        Method to get vol write bw
        :return: Bool
        '''
        try:
            url = self.config_dict["vol_write_bw"]["url"]
            headers = self.get_headers()
            self.vol_write_bw = []
            req_status, out = self.send_request(request_method="GET", url=url.format(self.host), headers=headers)
            if req_status == True and len(out['data']) != 0:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                logger.info(out['data'])
                for data in out["data"][0]:
                    self.vol_write_bw.append(data["iops"])
                logger.info("Read iops : {}".format(self.vol_write_bw))
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            logger.error(out['status']['problem'] + ' : ' + out['status']['solution'])
            return False

    def vol_write_bw_with_period(self,period = "5m"):
        '''
        Method to vol write bw
        :param period: time period
        :return: Bool
        '''
        try:
            url = self.config_dict["write_bw_with_period"]["url"]
            headers = self.get_headers()
            self.vol_write_bw_with_period=[]
            req_status, out = self.send_request(request_method="GET", url=url.format(self.host,period), headers=headers)
            if req_status == True and len(out['data']) != 0:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                logger.info(out['data'])
                for data in out["data"][0]:
                    self.vol_write_bw_with_period.append(data["bw"])
                logger.info("Read bw : {}".format(self.vol_write_bw_with_period))
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            logger.error(out['status']['problem'] + ' : ' + out['status']['solution'])
            return False

    def vol_read_iops(self):
        '''
        Method to get vol read iops
        :return: Bool
        '''
        try:
            url = self.config_dict["vol_read_iops"]["url"]
            headers = self.get_headers()
            self.vol_read_iops = []
            req_status, out = self.send_request(request_method="GET", url=url.format(self.host), headers=headers)
            if req_status == True and len(out['data']) != 0:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                logger.info(out['data'])
                for data in out["data"][0]:
                    self.vol_read_iops.append(data["iops"])
                logger.info("Vol read iops : {}".format(self.vol_read_iops))
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            logger.error(out['status']['problem'] + ' : ' + out['status']['solution'])
            return False

    def vol_read_iops_with_period(self,period = "5m"):
        '''
        Method to vol write bw
        :param period: time period
        :return: Bool
        '''
        try:
            url = self.config_dict["vol_read_iops_with_period"]["url"]
            headers = self.get_headers()
            self.vol_read_iops_with_period=[]
            req_status, out = self.send_request(request_method="GET", url=url.format(self.host,period), headers=headers)
            if req_status == True and len(out['data']) != 0:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                logger.info(out['data'])
                for data in out["data"][0]:
                    self.vol_read_iops_with_period.append(data["bw"])
                logger.info("Read bw : {}".format(self.vol_read_iops_with_period))
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            logger.error(out['status']['problem'] + ' : ' + out['status']['solution'])
            return False

    def vol_write_iops(self):
        '''
        Method to get vol write iops
        :return: Bool
        '''
        try:
            url = self.config_dict["vol_write_iops"]["url"]
            headers = self.get_headers()
            self.vol_write_iops = []
            req_status, out = self.send_request(request_method="GET", url=url.format(self.host), headers=headers)
            if req_status == True and len(out['data']) != 0:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                logger.info(out['data'])
                for data in out["data"][0]:
                    self.vol_write_iops.append(data["iops"])
                logger.info("Vol read iops : {}".format(self.vol_write_iops))
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            logger.error(out['status']['problem'] + ' : ' + out['status']['solution'])
            return False

    def vol_write_iops_with_period(self, period="5m"):
        '''
        Method to vol write bw
        :param period: time period
        :return: Bool
        '''
        try:
            url = self.config_dict["vol_write_iops_with_period"]["url"]
            headers = self.get_headers()
            self.vol_write_iops_with_period = []
            req_status, out = self.send_request(request_method="GET", url=url.format(self.host, period),
                                                headers=headers)
            if req_status == True and len(out['data']) != 0:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                logger.info(out['data'])
                for data in out["data"][0]:
                    self.vol_write_iops_with_period.append(data["bw"])
                logger.info("Read bw : {}".format(self.vol_write_iops_with_period))
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            logger.error(out['status']['problem'] + ' : ' + out['status']['solution'])
            return False
    
    def read_iops(self):
        '''
        Method to read iops value
        :return: Bool
        '''
        try:
            url = self.config_dict["read_iops"]["url"]
            headers = self.get_headers()
            self.read_iops=[]
            req_status, out = self.send_request(request_method="GET", url=url.format(self.host), headers=headers)
            if req_status == True and len(out['data']) != 0:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                logger.info(out['data'])
                for data in out["data"][0]:
                    self.read_iops.append(data["iops"])
                logger.info("Read iops : {}".format(self.read_iops))
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            logger.error(out['status']['problem'] + ' : ' + out['status']['solution'])
            return False


    def read_iops_with_period(self,period = "5m"):
        '''
        Method to read iops with period
        :param period:
        :return:
        '''
        try:
            url = self.config_dict["read_iops_with_period"]["url"]
            headers = self.get_headers()
            self.read_iops_with_period=[]
            req_status, out = self.send_request(request_method="GET", url=url.format(self.host,period), headers=headers)
            if req_status == True and len(out['data']) != 0:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                logger.info(out['data'])
                for data in out["data"][0]:
                    self.read_iops_with_period.append(data["iops"])
                logger.info("Read iops : {}".format(self.read_iops_with_period))
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            logger.error(out['status']['problem'] + ' : ' + out['status']['solution'])
            return False
    def write_iops(self):
        '''
        Method to get write iops value 
        '''
        try:
            url = self.config_dict["write_iops"]["url"]
            headers = self.get_headers()
            self.write_iops = []
            req_status, out = self.send_request(request_method="GET", url=url.format(self.host), headers=headers)
            if req_status == True and len(out['data']) != 0:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                logger.info(out['data'])
                for data in out["data"][0]:
                    self.write_iops.append(data["iops"])
                logger.info("write iops : {}".format(self.write_iops))
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            logger.error(out['status']['problem'] + ' : ' + out['status']['solution'])
            return False

    def write_iops_with_period(self, period="5m"):
        '''
        Method to write iops with period
        :param period:
        :return:
        '''
        try:
            url = self.config_dict["write_iops_with_period"]["url"]
            headers = self.get_headers()
            self.write_iops_with_period = []
            req_status, out = self.send_request(request_method="GET", url=url.format(self.host, period),
                                                headers=headers)
            if req_status == True and len(out['data']) != 0:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                logger.info(out['data'])
                for data in out["data"][0]:
                    self.write_iops_with_period.append(data["iops"])
                logger.info("write iops : {}".format(self.write_iops_with_period))
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            logger.error(out['status']['problem'] + ' : ' + out['status']['solution'])
            return False
    def write_latency(self):
        '''
        Method to get write iops value 
        '''
        try:
            url = self.config_dict["write_latency"]["url"]
            headers = self.get_headers()
            self.write_iops = []
            req_status, out = self.send_request(request_method="GET", url=url.format(self.host), headers=headers)
            if req_status == True and len(out['data']) != 0:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                logger.info(out['data'])
                for data in out["data"][0]:
                    self.write_iops.append(data["latency"])
                logger.info("write latency : {}".format(self.write_iops))
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            logger.error(out['status']['problem'] + ' : ' + out['status']['solution'])
            return False

    def write_latency_with_period(self, period="5m"):
        '''
        Method to write latency with period
        :param period:
        :return:
        '''
        try:
            url = self.config_dict["write_latency_with_period"]["url"]
            headers = self.get_headers()
            self.write_latency_with_period = []
            req_status, out = self.send_request(request_method="GET", url=url.format(self.host, period),
                                                headers=headers)
            if req_status == True and len(out['data']) != 0:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                logger.info(out['data'])
                for data in out["data"][0]:
                    self.write_latency_with_period.append(data["latency"])
                logger.info("write latency : {}".format(self.write_latency_with_period))
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            logger.error(out['status']['problem'] + ' : ' + out['status']['solution'])
            return False
    
    def vol_write_latency(self):
        '''
        Method to get vol write latency
        :return: Bool
        '''
        try:
            url = self.config_dict["vol_write_latency"]["url"]
            headers = self.get_headers()
            self.vol_write_latency = []
            req_status, out = self.send_request(request_method="GET", url=url.format(self.host), headers=headers)
            if req_status == True and len(out['data']) != 0:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                logger.info(out['data'])
                for data in out["data"][0]:
                    self.vol_write_latency.append(data["iops"])
                logger.info("Vol read iops : {}".format(self.vol_write_latency))
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            logger.error(out['status']['problem'] + ' : ' + out['status']['solution'])
            return False

    def vol_write_latency_with_period(self, period="5m"):
        '''
        Method to vol write latency with period 
        :param period: time period
        :return: Bool
        '''
        try:
            url = self.config_dict["vol_write_latency_with_latency"]["url"]
            headers = self.get_headers()
            self.vol_write_latency_with_latency = []
            req_status, out = self.send_request(request_method="GET", url=url.format(self.host, period),
                                                headers=headers)
            if req_status == True and len(out['data']) != 0:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                logger.info(out['data'])
                for data in out["data"][0]:
                    self.vol_write_latency_with_latency.append(data["bw"])
                logger.info("Read bw : {}".format(self.vol_write_latency_with_latency))
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            logger.error(out['status']['problem'] + ' : ' + out['status']['solution'])
            return False
    def read_latency(self):
        '''
        Method to get read iops value 
        '''
        try:
            url = self.config_dict["read_latency"]["url"]
            headers = self.get_headers()
            self.read_iops = []
            req_status, out = self.send_request(request_method="GET", url=url.format(self.host), headers=headers)
            if req_status == True and len(out['data']) != 0:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                logger.info(out['data'])
                for data in out["data"][0]:
                    self.read_iops.append(data["latency"])
                logger.info("read latency : {}".format(self.read_iops))
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            logger.error(out['status']['problem'] + ' : ' + out['status']['solution'])
            return False

    def read_latency_with_period(self, period="5m"):
        '''
        Method to read latency with period
        :param period:
        :return:
        '''
        try:
            url = self.config_dict["read_latency_with_period"]["url"]
            headers = self.get_headers()
            self.read_latency_with_period = []
            req_status, out = self.send_request(request_method="GET", url=url.format(self.host, period),
                                                headers=headers)
            if req_status == True and len(out['data']) != 0:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                logger.info(out['data'])
                for data in out["data"][0]:
                    self.read_latency_with_period.append(data["latency"])
                logger.info("read latency : {}".format(self.read_latency_with_period))
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            logger.error(out['status']['problem'] + ' : ' + out['status']['solution'])
            return False

    def vol_read_latency(self):
        '''
        Method to get vol read latency
        :return: Bool
        '''
        try:
            url = self.config_dict["vol_read_latency"]["url"]
            headers = self.get_headers()
            self.vol_read_latency = []
            req_status, out = self.send_request(request_method="GET", url=url.format(self.host), headers=headers)
            if req_status == True and len(out['data']) != 0:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                logger.info(out['data'])
                for data in out["data"][0]:
                    self.vol_read_latency.append(data["iops"])
                logger.info("Vol read iops : {}".format(self.vol_read_latency))
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            logger.error(out['status']['problem'] + ' : ' + out['status']['solution'])
            return False

    def vol_read_latency_with_period(self, period="5m"):
        '''
        Method to vol read latency with period 
        :param period: time period
        :return: Bool
        '''
        try:
            url = self.config_dict["vol_read_latency_with_period"]["url"]
            headers = self.get_headers()
            self.vol_read_latency_with_period = []
            req_status, out = self.send_request(request_method="GET", url=url.format(self.host, period),
                                                headers=headers)
            if req_status == True and len(out['data']) != 0:
                logger.info(out['status']['description'] + ' : ' + out['status']['posDescription'])
                logger.info(out['data'])
                for data in out["data"][0]:
                    self.vol_read_latency_with_period.append(data["bw"])
                logger.info("Read bw : {}".format(self.vol_read_latency_with_period))
                return True
            else:
                raise Exception(out['status']['description'] + ' : ' + out['status']['posDescription'])
        except Exception as e:
            logger.error(e)
            logger.error(out['status']['problem'] + ' : ' + out['status']['solution'])
            return False
#################################################DEVELOPER#####################################################
    def update_event_wrr(self,event_name=None):
        '''
        Method to update event wrr
        :return: Bool
        '''
        try:
            url = self.config_dict["update_event_wrr"]["url"]
            headers = self.get_headers()
            params = {
                "param": {
                    "name": "flush",
                    "weight": 1
                }
            }
            if event_name != None:
                params["param"]["name"] = event_name

            req_status, out = self.send_request(request_method="POST", url=url.format(self.host),
                                                    headers=headers,params = params)
            if req_status == True:
                logger.info(out['status']['description'] + ':' + out['status']['posDescription'])
                return True
            else:
                raise Exception("Failed")
        except Exception:
            logger.info(out['status']['description'] + ':' + out['status']['posDescription'])
            return False

    def reset_event_wrr(self):
        '''
        Method to reset event wrr
        :return: Bool
        '''
        try:
            url = self.config_dict["reset_event_wrr"]["url"]
            headers = self.get_headers()
            #params={}
            req_status, out = self.send_request(request_method="POST", url=url.format(self.host),
                                                    headers=headers)
            if req_status == True:
                logger.info(out['status']['description'] + ':' + out['status']['posDescription'])
                return True
            else:
                raise Exception("Failed")
        except Exception:
            logger.info(out['status']['description'] + ':' + out['status']['posDescription'])
            return False

    def stop_rebuilding(self):
        '''
        Method to stop rebuilding
        :return: Bool
        '''
        try:
            url = self.config_dict["stop_rebuilding"]["url"]
            headers = self.get_headers()
            params={}
            req_status, out = self.send_request(request_method="DELETE", url=url.format(self.host),
                                                    headers=headers,params = params)
            if req_status == True:
                logger.info(out['status']['description'] + ':' + out['status']['posDescription'])
                return True
            else:
                raise Exception("Failed")
        except Exception:
            logger.info(out['status']['description'] + ':' + out['status']['posDescription'])
            return False
##############################################LOGGER#######################################################
    def get_log_info(self):
        '''
        Method to get log info
        :return: Bool
        '''
        try:
            url = self.config_dict["get_log_info"]["url"]
            headers = self.get_headers()
            req_status, out = self.send_request(request_method="GET", url=url.format(self.host),
                                                headers=headers)
            if req_status == True:
                logger.info(out['status']['description'] + ':' + out['status']['posDescription'])
                return True
            else:
                raise Exception("Failed")
        except Exception:
            logger.info(out['status']['description'] + ':' + out['status']['posDescription'])
            return False
    def set_log_level(self):
        '''
        Method to set log level
        :return:
        '''
        try:
            url = self.config_dict["set_log_level"]["url"]
            headers = self.get_headers()
            params = {}
            req_status, out = self.send_request(request_method="POST", url=url.format(self.host),
                                                headers=headers,params = params)
            if req_status == True:
                logger.info(out['status']['description'] + ':' + out['status']['posDescription'])
                return True
            else:
                raise Exception("Failed")
        except Exception:
            logger.info(out['status']['description'] + ':' + out['status']['posDescription'])
            return False
    def apply_logger_filter(self):
        '''
        Method to apply logger filter
        :return: Bool
        '''
        try:
            url = self.config_dict["apply_logger_filter"]["url"]
            headers = self.get_headers()
            params = {}
            req_status, out = self.send_request(request_method="POST", url=url.format(self.host),
                                                headers=headers,params = params)
            if req_status == True:
                logger.info(out['status']['description'] + ':' + out['status']['posDescription'])
                return True
            else:
                raise Exception("Failed")
        except Exception:
            logger.info(out['status']['description'] + ':' + out['status']['posDescription'])
            return False

if __name__ == "__main__":
    req_obj = Request()
    res = req_obj.scan_device()
    if res == True:
        print("scan device passed")
    res = req_obj.list_devices()
    if res == True:
        print("list device passed")
    else:
        print("Failed")
    res = req_obj.create_array_second(raid_type="RAID5",buffer_device="uram1")
    if res:
        logger.info("Creation of second array sucess")
    else:
        logger.error("creation of second array failed")
    '''req_obj.get_max_volume_count()
    #req_obj.create_device(device_name="uram0")'''
    '''res = req_obj.create_array_first()
    if res:
        print("Array creation successful")
    else:
        print("Array creation Failed")'''

    '''res = req_obj.array_list()
    array = req_obj.arrays[0]
    if res:
        req_obj.array_info(array_name=array)
    else:
        print("list array failed")
    res = req_obj.array_mount_first(array_name=array)
    if res:
        print("Array mount passed")
    else:
        print("Array mount Failed")'''
    '''if req_obj.list_array_devices(array_name = array):
        print("List array successful")
    res = req_obj.array_unmount_first(array_name=array)
    if res:
        print("Array unmount successfull")
    else:
        print("Array unmount failed")
    res = req_obj.delete_array(array_name=array)
    if res :
        print("Array delete successful")
    else:
        print("Array delete Failed")
    res = req_obj.create_array_first()
    if res :
        print("Array creation successful")
    else:
        print("Array creation Failed")
    res = req_obj.array_mount_first()
    if res:
        print("Array mount passed")
    else:
        print("Array mount Failed")
    res = req_obj.create_volume(array_name="POSArray1")
    if res :
        print("Create volume passed")
    else:
        print("Creat volume failed")'''
    '''res = req_obj.list_volume(array_name="POSArray1")
    if res:
        print("List volume passed")
    else:
        print("List volume failed")
    req_obj.create_subsystem(nqn_name="nqn.2019-04.ibof:subsystem10")
    req_obj.mount_vol(volume_name=req_obj.volumes[0], array_name="POSArray1")
    req_obj.unmount_vol(volume_name=req_obj.volumes[0])
    req_obj.delete_volume(volume_name=req_obj.volumes[0])
    req_obj.create_volume_multi(array_name="POSArray1",volume_name="Scoob-",vol_count=7)
    req_obj.list_volume(array_name = "POSArray1")'''
    '''for vol in req_obj.volumes:
        req_obj.mount_vol(volume_name=vol)'''
    #print(req_obj.volumes)
    '''if req_obj.rename_volume(volume_name=req_obj.volumes[0],new_name="Ratish"):
        print("rename successfull")'''
    '''if req_obj.create_transport():
        print("cretae transport passed")
    else:
        print("Create transport failed")
    if req_obj.add_listner():
        print("Add listner success")
    else:
        print("add listner failed")'''
    #req_obj.list_subsystem() --> need to fix
    '''vol = req_obj.volumes[4]
    req_obj.qos_create_volume_policies(volume_name=vol,array_name="POSArray1")
    req_obj.qos_list_volume_policies(volume_name=vol)
    req_obj.qos_reset_volume(volume_name=vol)
    req_obj.ibofos_info()
    req_obj.run_ibofos()
    req_obj.exit_ibofos()'''
    '''req_obj.cpu()
    req_obj.cpu_with_period()
    req_obj.cpu_with_period(period='39h')
    req_obj.network_with_period()
    req_obj.network()
    req_obj.read_iops()
    req_obj.read_iops_with_period()
    req_obj.write_bw()
    req_obj.write_bw_with_period()
    req_obj.read_bw()
    req_obj.read_bw_with_period()
    req_obj.write_iops()
    req_obj.write_iops_with_period()
    req_obj.write_latency()
    req_obj.write_latency_with_period()
    req_obj.read_latency()
    req_obj.read_latency_with_period()'''

