'''
/*-------------------------------------------------------------------------------------/
                                                                                    /
/               COPYRIGHT (c) 2019 SAMSUNG ELECTRONICS CO., LTD.                      /
/                          ALL RIGHTS RESERVED                                        /
/                                                                                     /
/   Permission is hereby granted to licensees of Samsung Electronics Co., Ltd.        /
/   products to use or abstract this computer program for the sole purpose of         /
/   implementing a product based on Samsung Electronics Co., Ltd. products.           /
/   No other rights to reproduce, use, or disseminate this computer program,          /
/   whether in part or in whole, are granted.                                         /
/                                                                                     /
/   Samsung Electronics Co., Ltd. makes no representation or warranties with          /
/   respect to the performance of this computer program, and specifically disclaims   /
/   any responsibility for any damages, special or consequential, connected           /
/   with the use of this program.                                                     /
/                                                                                     /
/-------------------------------------------------------------------------------------/


DESCRIPTION: <File description> *
@NAME : configure.py
@AUTHORS: Jay Hitesh Sanghavi
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
*/
'''

###############################################################################
#                                                                             #
#             COPYRIGHT 2009-2020 SAMSUNG ELECTRONICS CO., LTD.               #
#                           ALL RIGHTS RESERVED                               #
#                                                                             #
#  Permission is hereby granted to licensees of Samsung Electronics Co., Ltd. #
#  products to use or abstract this computer program only in  accordance with #
#  the terms of the NAND FLASH MEMORY SOFTWARE LICENSE AGREEMENT for the sole #
#  purpose of implementing  a product based  on Samsung Electronics Co., Ltd. #
#  products. No other rights to  reproduce, use, or disseminate this computer #
#  program, whether in part or in whole, are granted.                         #
#                                                                             #
#  Samsung Electronics Co., Ltd. makes no  representation or warranties  with #
#  respect to  the performance  of  this computer  program,  and specifically #
#  disclaims any  responsibility for  any damages,  special or consequential, #
#  connected with the use of this program.                                    #
#                                                                             #
###############################################################################

##
# @ Hui Qi (hui81.qi@samsung.com)

##
# \addtogroup Doxygen Group
# @{

##
# ! \file configuration.py
#  \brief Parse FA server configuration file.

# ! /usr/bin/python

import configparser
import os

SCHEDULER_PERF_DICT = {'volume_info_collections_msec': 0.2,
                       'volume_info_collections_sec': 1,
                       'volume_info_collections_min': 60,
                       'volume_info_collections_hour': 3600,
                       'volume_info_collections_day': 86400
                       }

SCHEDULER_ALARM_DICT = {'volume_capacity_monitor': 60,
                        'system_resource_monitor': 60
                        }

SCHEDULER_OTHERS_DICT = {'user_online_push': 1,
                         # 'synchronize_config':1
                         }


class Configuration(object):
    __instance = None

    
    def __new__(cls):
        # singleton
        if Configuration.__instance is None:
            Configuration.__instance = object.__new__(cls)
        return Configuration.__instance

    def __init__(self):
        self.cfg = configparser.ConfigParser()
        self.cfg.read(self.get_default_cfg_path())

    
    def get_root_dir(self):
        current_dir = os.path.abspath(os.path.dirname(__file__))
        root_dir = '%s/..' % (current_dir)
        return root_dir
    """
    def get_cfg_path(self):
        # Load config file (default or specified)
        if len(sys.argv) is 1:
            cfg_path = self.get_default_cfg_path()
        elif len(sys.argv) is 2:
            # it has 1 argument and should be config file path
            if os.path.exists(sys.argv[1]):
                cfg_path = sys.argv[1]
                ####### check if it's a valid configuration file #########
                ####### more code here #########
            else:
                print(
                    "ERROR: The configuration file %s does not exist" %
                    sys.argv[1])
                return None
        else:
            print("ERROR: The server options are not recognized")
            return None

        return cfg_path
    """


    def get_default_cfg_path(self):
        root_dir = self.get_root_dir()
        default_cfg_path = '%s/config/server.conf' % (root_dir)
        return default_cfg_path
    """
    def get_cfg_content(self, cfg_path):
        self.cfg.read(cfg_path)
        return
    """

    """
    def get_all_sections(self):
        return self.cfg.sections()
    """

    """
    def get_all(self):
        cfg_dict = {}
        try:
            sections = self.cfg.sections()
            for sec in sections:
                sect_dict = {}
                options = self.cfg.options(sec)
                for opt in options:
                    sect_dict[opt] = self.cfg.get(sec, opt)

                cfg_dict[sec] = sect_dict
        except BaseException:
            print("Exception: " + traceback.format_exc())
        finally:
            return cfg_dict
    """
    """
    def get_section_content(self, section):
        sect_dict = {}
        try:
            if self.cfg.has_section(section):
                options = self.cfg.options(section)
                for opt in options:
                    sect_dict[opt] = self.cfg.get(section, opt)
        except BaseException:
            print("Exception: " + traceback.format_exc())
        finally:
            return sect_dict
    """

    """
    def get_option_content(self, section, option):
        value = None
        try:
            value = self.cfg.get(section, option)
        except BaseException:
            print("There is no section: such section")
        finally:
            return value
    """ 
    """
    def get_valid_metrics(self):
        metrics_dict = {}

        try:
            sections = self.cfg.sections()
            print(sections)
            for sec in sections:
                sect_dict = {}
                options = self.cfg.options(sec)
                if 'enabled' in options and self.cfg.get(
                        sec, 'enabled') == "1":
                    for opt in options:
                        sect_dict[opt] = self.cfg.get(sec, opt)
                    metrics_dict[sec] = sect_dict
        except BaseException:
            print("Exception: " + traceback.format_exc())
        finally:
       
       return metrics_dict
    """

    """
    def get_log_dir(self):
        log_dir = self.get_option_content('server', 'log_dir')
        return log_dir

    def get_tgtserver_path(self):
        tgtserver_path = self.get_option_content('server', 'server')
        return tgtserver_path

    def get_tgtclient_path(self):
        tgtclient_path = self.get_option_content('server', 'client')
        return tgtclient_path

    def tgtadm_verify(self):
        is_tgtserver_valid = False
        is_tgtclient_valid = False

        tgtserver_path = self.get_option_content('server', 'server')
        tgtclient_path = self.get_option_content('server', 'client')

        if os.path.exists(tgtserver_path):
            is_tgtserver_valid = True
        if os.path.exists(tgtclient_path):
            is_tgtclient_valid = True
        return is_tgtserver_valid, is_tgtclient_valid, tgtserver_path, tgtclient_path
     """
    
config = Configuration()

if __name__ == '__main__':
    # print(config.get_root_dir())
    pass
