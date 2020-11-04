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


DESCRIPTION: <Exporting all the action creators> *
@NAME : exportActionCreators.js
@AUTHORS: Jay Hitesh Sanghavi, Palak Kapoor
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
[07/08/2019] [Palak] : Prototyping..........////////////////////
*/
export { 
    updateTimestamp,
    asyncIsiBOFOSRunning,
} from "./headerActions";

export { 
    enableFetchingAlerts,
    fetchVolumes, 
    fetchAlerts,
    fetchPerformance,
    fetchStorage,
    fetchIpAndMac,
} from "./dashboardActions";
export {
    openAlertBox,
    setAlertsInfo,
    fetchAlertsInfo,
    fetchAlertsType,
} from "./alertManagementActions";

// export { 
//     changeLanguage
//  } from "./headerLanguageActions";

export { 
    changeEmailList,
    fetchEmailList,
    setAlertBox,
    changeSmtpServer,
    setSmtpServer,
    deleteConfiguredSmtpServer,
    setIbofOSTimeInterval,
 } from "./configurationsettingActions";

 export { 
    getIbofOsLogs,
    setLiveLogs,
 } from "./logManagementActions";

export {
    fetchDevices,
    fetchDeviceDetails,
    fetchArray,
    fetchArraySize,
    setNoArray,
    showStorageAlert,
    fetchStorageVolumes,
    startStorageLoader,
    stopStorageLoader,
    fetchMaxVolumeCount,
    toggleCreateVolumeButton,
    addVolumeDetails,
    clearVolumes,
} from "./storageActions";

export {
    // fetchDiskUsed,
    // fetchDiskWrite,
    fetchCpuUsage,
    fetchReadBandwidth,
    fetchWriteBandwidth,
    fetchReadIops,
    fetchWriteIops,
    fetchVolReadBandwidth,
    fetchVolWriteBandwidth,
    fetchVolReadIops,
    fetchVolWriteIops,
    fetchLatency,
    fetchVolLatency,
    // fetchInputPowerVariation
} from "./performanceActions";

export {
    changeCredentials,
    setIsLoggedIn,
    setLoginFailed,
    resetIsLoggedIn,
} from "./authenticationActions";

export {
    // setUsersInfo,
    fetchUsersInfo,
} from "./userManagementActions";

export {
    fetchServerInfo,
    fetchPowerInfo,
    fetchChassisFrontInfo,
    fetchChassisRearInfo,
} from "./hardwareOverviewActions";

export {
    fetchPowerSensorInfo,
    fetchFanSensorInfo,
    fetchTemperatureSensorInfo,
} from "./hardwareSensorActions";

export {
    fetchSoftwareDetails,
    fetchHardwareDetails,
    fetchNetworkDetails,
} from "./hardwareHealthActions";

export {
    fetchPowerSummary,
} from "./hardwarePowerManagementActions";

export {
    startLoader,
    stopLoader,
} from "./waitLoaderActions";

export {
    BMCChangeCredentials,
    BMCResetIsLoggedIn,
    BMCSetIsLoggedIn,
    BMCSetLoginFailed,
} from "./BMCAuthenticationActions";