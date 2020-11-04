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


DESCRIPTION: <Contains pure actions for Dashboard Page> *
@NAME : dashboardActions.js
@AUTHORS: Jay Hitesh Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
*/
import * as actionTypes from "./actionTypes";

export const enableFetchingAlerts = (flag) => {
  return {
    type: actionTypes.ENABLE_FETCHING_ALERTS,
    fetchingAlerts: flag,
  };
};
export const fetchVolumes = (volumes) => {
  return {
    type: actionTypes.FETCH_VOLUME_INFO,
    volumes,
  };
};

export const fetchAlerts = (alerts) => {
  return {
    type: actionTypes.FETCH_ALERTS_INFO,
    alerts,
  };
};

export const fetchPerformance = (
  readIOPS,
  writeIOPS,
  readBW,
  writeBW,
  latency
) => {
  return {
    type: actionTypes.FETCH_PERFORMANCE_INFO,
    readIOPS,
    writeIOPS,
    readBW,
    writeBW,
    latency,
  };
};



export const fetchStorage = (unusedSpace, used, unused, arraySize) => {
  return {
    type: actionTypes.FETCH_STORAGE_INFO,
    unusedSpace,
    used,
    unused,
    arraySize,
  };
};

export const fetchIpAndMac = (ip, mac, host) => {
  return {
    type: actionTypes.FETCH_IPANDMAC_INFO,
    ip,
    mac,
    host,
  };
};
