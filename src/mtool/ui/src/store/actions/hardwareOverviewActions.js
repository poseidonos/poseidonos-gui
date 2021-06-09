/* -------------------------------------------------------------------------------------/
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

DESCRIPTION: <Contains actions for hardware container> *
@NAME : hardwareOverviewActions.js
@AUTHORS: Jay Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/11/2019] [Jay] : Prototyping..........////////////////////
*/

import * as actionTypes from './actionTypes';

export const fetchServerInfo = serverinfo => {
  return {
    type: actionTypes.HARDWARE_OVERVIEW_FETCH_SERVER_INFORMATION,
    serverinfo,
  };
};

export const fetchPowerInfo = powerinfo => {
  return {
    type: actionTypes.HARDWARE_OVERVIEW_FETCH_POWER_INFORMATION,
    powerinfo,
  };
};

export const fetchChassisFrontInfo = frontinfo => {
  return {
    type: actionTypes.HARDWARE_OVERVIEW_FETCH_CHASSIS_FRONT_INFORMATION,
    frontinfo,
  };
};

/*
export const fetchChassisRearInfo = rearinfo => {
  return {
    type: actionTypes.HARDWARE_OVERVIEW_FETCH_CHASSIS_REAR_INFORMATION,
    rearinfo,
  };
};
*/
