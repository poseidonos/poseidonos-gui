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
 *     * Neither the name of Samsung Electronics Corporation nor the names of its
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

import React, { useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Grid, Paper, Typography } from "@material-ui/core";
import CreateArray from "../../../components/ArrayManagement/CreateArray";
import AutoCreate from "../../../components/ArrayManagement/AutoCreate";
import * as actionTypes from "../../../store/actions/actionTypes";


const ArrayCreate = (props) => {
    // eslint-disable-next-line camelcase
    const { Get_Config } = props;

    useEffect(() => {
        Get_Config();
        // eslint-disable-next-line camelcase
    }, [Get_Config])

    const createArray = (array) => {
        props.Create_Array(array);
    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Paper spacing={3}>
                    <Grid container justifyContent="space-between">
                        <CreateArray
                            createArray={createArray}
                            config={props.config}
                            selectedRaid={props.selectedRaid}
                            selectRaid={props.Select_Raid}
                            disks={props.ssds}
                            data-testid="arraycreate"
                            metadisks={props.metadisks}
                            diskDetails={props.diskDetails}
                            getDiskDetails={props.Get_Disk_Details}
                        />
                    </Grid>
                </Paper>
                <AutoCreate
                    disks={props.ssds}
                    metadisks={props.metadisks}
                    autoCreateArray={props.Auto_Create_Array}
                    config={props.config}
                />
                {(props.posMountStatus === "EXIST_NORMAL") ? (
                    <Typography style={{ color: "#b11b1b" }} variant="h5" align="center">Poseidon OS is not Mounted !!!</Typography>
                ) : null}
            </Grid>
        </Grid>
    )
}


const mapStateToProps = (state) => {
    return {
        ssds: state.storageReducer.ssds,
        config: state.storageReducer.config,
        selectedRaid: state.storageReducer.selectedRaid,
        metadisks: state.storageReducer.metadisks,
        diskDetails: state.storageReducer.diskDetails,
        posMountStatus: state.headerReducer.state
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        Create_Array: (payload) => dispatch({ type: actionTypes.SAGA_CREATE_ARRAY, payload }),
        Get_Disk_Details: (payload) => dispatch({ type: actionTypes.SAGA_FETCH_DEVICE_DETAILS, payload }),
        Get_Config: () => dispatch({ type: actionTypes.SAGA_FETCH_CONFIG }),
        Select_Raid: (payload) => dispatch({ type: actionTypes.SELECT_RAID, payload }),
        Auto_Create_Array: (payload) => dispatch({ type: actionTypes.SAGA_AUTO_CREATE_ARRAY, payload }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    withRouter(ArrayCreate));