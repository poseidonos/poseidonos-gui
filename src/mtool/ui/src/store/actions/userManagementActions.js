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


DESCRIPTION: <Contains pure actions for User Management Container> *
@NAME : userManagementActions.js
@AUTHORS: Jay Hitesh Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
*/
import * as actionTypes from "./actionTypes"

// export const openUserBox = (userParam) => {
//     return {
//         type:actionTypes.USER_MANAGEMENT_OPEN_USER_BOX,
//         userParam,
//     };
// }

// export const setUsersInfo = (updatedUsers) => {
//     return {
//         type:actionTypes.USER_MANAGEMENT_SET_USERS,
//         updatedUsers,
//     };
// }

export const fetchUsersInfo = (users) => {
    return {
        type:actionTypes.USER_MANAGEMENT_FETCH_USERS,
        users,
    };
}

export default fetchUsersInfo;