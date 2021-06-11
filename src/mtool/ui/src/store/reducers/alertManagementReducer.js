/*
 *   BSD LICENSE
 *   Copyright (c) 2021 Samsung Electronics Corporation
 *   All rights reserved.
 *
 *   Redistribution and use in source and binary forms, with or without
 *   modification, are permitted provided that the following conditions
 *   are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in
 *       the documentation and/or other materials provided with the
 *       distribution.
 *     * Neither the name of Intel Corporation nor the names of its
 *       contributors may be used to endorse or promote products derived
 *       from this software without specific prior written permission.
 *
 *   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 *   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 *   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 *   A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 *   OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 *   SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 *   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 *   DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 *   THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 *   OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
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
        // case actionTypes.ALERT_MANAGEMENT_SET_ALERTS:
        //     {
        //         const { type, i, j } = action.updatedAlerts;
        //         const value1 = i;
        //         const value2 = j;
        //         const alertClusters = state.alertClusters.map((cluster, Citr) => {
        //             return {
        //                 ...cluster,
        //                 alertSubCluster: cluster.alertSubCluster.map((subcluster, subCitr) => {
        //                     return {
        //                         ...subcluster,
        //                         alertTypes: subcluster.alertTypes.map(cip => {
        //                             if (type.type === cip.type && Citr === value1 && subCitr === value2) {
        //                                 return {
        //                                     ...cip,
        //                                     selected: !cip.selected,
        //                                 };
        //                             }
        //                             if (cip.selected === true && value1 === Citr && subCitr === value2) {
        //                                 return {
        //                                     ...cip,
        //                                 };
        //                             }
        //                             return {
        //                                 ...cip,
        //                                 selected: false,
        //                             };
        //                         }),
        //                     };
        //                 }),
        //             };
        //         });
        //         return {
        //             ...state,
        //             alertClusters,
        //         };
        //     }
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
