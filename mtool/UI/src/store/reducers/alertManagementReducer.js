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


DESCRIPTION: <Contains reducer function for Alert Management Container> *
@NAME : alertManagementReducer.js
@AUTHORS: Jay Hitesh Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
*/

import * as actionTypes from "../actions/actionTypes"

const initialState = {
    selected: false,
    edit: false,
    alerts: [], // For Alert Table
    alertClusters: [
        {
            // For Alert Types
            _id: '1',
            name: 'CPU',
            alertSubCluster: [
                {
                    _id: '1',
                    name: 'cpu-host',
                    alertTypes: [
                        {
                            type: 'cpu-idle',
                        },
                        {
                            type: 'cpu-idle2',
                        },
                        {
                            type: 'cpu-affinity',
                        },
                    ],
                },
                {
                    _id: '2',
                    name: 'cpu-host2',
                    alertTypes: [
                        {
                            type: 'cpu-idle',
                        },
                        {
                            type: 'cpu-affinity',
                        },
                        {
                            type: 'cpu-time',
                        },
                    ],
                },
            ],
            alertFields: ["usage_idle","usage_system"],
        },
        {
            _id: '2',
            name: 'Array',
            alertSubCluster: [
                {
                    name: 'array-disk0',
                    alertTypes: [
                        {
                            type: 'array-name',
                        },
                        {
                            type: 'array-size',
                        },
                    ],
                },
            ],
        },
    ],
    istypealert: false,
    alerttype: '',
    alertOpen: false,
    addDeleteSend: '',
    alerttitle: '',
    alertdescription: '',
}


const alertManagementReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ALERT_MANAGEMENT_OPEN_ALERT_BOX:
            {
                return{
                    ...state,
                    ...action.alertParam
                }
            }
        case actionTypes.ALERT_MANAGEMENT_SET_ALERTS:
            {
                const { type, i, j } = action.updatedAlerts;
                const value1 = i;
                const value2 = j;
                const alertClusters = state.alertClusters.map((cluster, Citr) => {
                    return {
                        ...cluster,
                        alertSubCluster: cluster.alertSubCluster.map((subcluster, subCitr) => {
                            return {
                                ...subcluster,
                                alertTypes: subcluster.alertTypes.map(cip => {
                                    if (type.type === cip.type && Citr === value1 && subCitr === value2) {
                                        return {
                                            ...cip,
                                            selected: !cip.selected,
                                        };
                                    }
                                    if (cip.selected === true && value1 === Citr && subCitr === value2) {
                                        return {
                                            ...cip,
                                        };
                                    }
                                    return {
                                        ...cip,
                                        selected: false,
                                    };
                                }),
                            };
                        }),
                    };
                });
                return {
                    ...state,
                    alertClusters,
                };
            }
        case actionTypes.ALERT_MANAGEMENT_FETCH_ALERTS:
            {
                const alerts = [];
                action.alerts.forEach(alert => {
                    alerts.push({
                        ...alert,
                        selected: false,
                        edit: false,
                    });
                });
                return {
                    ...state,
                    alerts,
                };
            }

        case actionTypes.ALERT_MANAGEMENT_FETCH_ALERTS_TYPE:
            {
                // const alertTypesArray = [];
                // for (let i = 0; i < action.alertTypes.length; i += 1) {
                //     if (action.alertTypes[i].name === 'cpu') {
                //         action.alertTypes[i].alertFields = [
                //             // 'usage_idle',
                //             'usage_user',
                //             // 'usage_system',
                //         ];
                //         for (
                //             let j = 0;
                //             j < action.alertTypes[i].alertSubCluster.length;
                //             j += 1
                //         ) {
                //             if (action.alertTypes[i].alertSubCluster[j].name === 'cpu') {
                //                 action.alertTypes[i].alertSubCluster = action.alertTypes[
                //                     i
                //                 ].alertSubCluster.filter(item => item.name === 'cpu');
                //                 action.alertTypes[i].alertSubCluster[
                //                     j
                //                 ].alertTypes = action.alertTypes[i].alertSubCluster[
                //                     j
                //                 ].alertTypes.filter(item => item.type === 'cpu-total');
                //                 action.alertTypes[i].alertSubCluster[j].name = 'cpu ';
                //             }
                //         }
                //         alertTypesArray.push(action.alertTypes[i]);
                //      }           
                //      else if (action.alertTypes[i].name === 'mem' || action.alertTypes[i].name === 'net' || action.alertTypes[i].name === 'disk' || action.alertTypes[i].name === 'air' || action.alertTypes[i].name === 'ethernet') {
                //         alertTypesArray.push(action.alertTypes[i]);
                //     //     for (
                //     //         let j = 0;
                //     //         j < action.alertTypes[i].alertSubCluster.length;
                //     //         j += 1
                //     //     ) {
                //     //         if (action.alertTypes[i].alertSubCluster[j].name !== 'device') {
                //     //             action.alertTypes[i].alertSubCluster = action.alertTypes[
                //     //                 i
                //     //             ].alertSubCluster.filter(item => item.name === 'device');
                //     //         } else {
                //     //             action.alertTypes[i].alertSubCluster[
                //     //                 j
                //     //             ].alertTypes = action.alertTypes[i].alertSubCluster[
                //     //                 j
                //     //             ].alertTypes.slice(0, 1);
                //     //             action.alertTypes[i].alertSubCluster[j].alertTypes.map(
                //     //                 (item) => {
                //     //                     const resItem = { ...item }
                //     //                     resItem.type = 'NA';
                //     //                     return resItem;
                //     //                 }
                //     //             );
                //     //         }
                //     //     }
                //     //     action.alertTypes[i].alertFields = ['NA'];
                //     //     alertTypesArray.push(action.alertTypes[i]);
                //     }
                // }
                
                return {
                    ...state,
                    alertClusters: action.alertTypes
                };
            }
        default:
            return state;
    }
};

export default alertManagementReducer;
