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

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import io from "socket.io-client";
import { withStyles } from "@material-ui/styles";
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Tooltip, Typography, Zoom } from "@material-ui/core";
import { Info } from "@material-ui/icons";
import ArrayShow from "../../../components/ArrayManagement/ArrayShow";
import Legend from "../../../components/Legend";
import LightTooltip from "../../../components/LightTooltip";
import RebuildProgress from "../../../components/RebuildProgress";
import CreateVolume from "../../../components/VolumeManagement/CreateVolume";
import VolumeList from "../../../components/VolumeManagement/VolumeList";
import * as actionTypes from "../../../store/actions/actionTypes";
import { customTheme } from "../../../theme";
import { BYTE_FACTOR, CREATE_VOL_SOCKET_ENDPOINT } from "../../../utils/constants";
import formatBytes from "../../../utils/format-bytes";
import SelectSubsystem from "../../../components/SelectSubsystem";
import getSubsystemForArray from "../../../utils/subsystem";

const styles = (theme) => ({
    card: {
        marginTop: theme.spacing(1),
    },
    arrayInfoContainer: {
        position: "relative"
    },
    tooltip: {
        backgroundColor: "#f5f5f9",
        opacity: 1,
        color: "rgba(0, 0, 0, 1)",
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: "1px solid #dadde9",
        "& b": {
            fontWeight: theme.typography.fontWeightMedium,
        },
    },
    arrayInfoIcon: {
        position: "absolute",
        right: theme.spacing(2),
        top: theme.spacing(2),
        '&:hover': {
            cursor: 'pointer'
        }
    },
    arraySelectStatus: {
        padding: theme.spacing(0, 2),
        [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(0, 1),
        },
        [theme.breakpoints.down("xs")]: {
            justifyContent: "center",
        }
    },
    cardHeader: customTheme.card.header,
    statsWrapper: {
        display: "flex",
        flexWrap: "wrap",
        width: "100%",
        boxSizing: "border-box",
        zIndex: 100,
        flexBasis: "100%",
        height: "100%",
        alignContent: "center",
        padding: theme.spacing(0, 3),
        [theme.breakpoints.down("sm")]: {
            marginTop: theme.spacing(1),
        },
    },
    statsContainer: {
        margin: theme.spacing(1, 0, 2),
    },
    volumeStats: {
        width: "100%",
        border: "0px solid gray",
        height: 50,
    },
    arraySelect: {
        minWidth: 170,
        "&>div>p": {
            overflow: "hidden",
            textOverflow: "ellipsis"
        }
    },
    arraySelectGrid: {
        [theme.breakpoints.down("xs")]: {
            textAlign: "center",
            width: "100%"
        }
    },
    selectForm: {
        margin: theme.spacing(0.5, 2),
        width: "60%",
        minWidth: "170px",
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing(1, 0),
            width: "80%",
        },
    },
    statusText: {
        display: "flex",
        height: "100%",
        alignItems: "center",
        margin: theme.spacing(0.5, 2),
        width: "80%",
        minWidth: "170px",
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing(1, 0),
            display: "inline-flex",
        },
    },
    volumeStatsPaper: {
        height: "100%",
        display: "flex",
        position: "relative",
        flexDirection: "column"
    },
    legendContainer: {
        justifyContent: "flex-end"
    },
    rebuildButton: {
        cursor: "pointer",
        marginLeft: theme.spacing(1)
    },
    font18bold: {
        fontSize: 18
    }
})

const createVolSocket = io(CREATE_VOL_SOCKET_ENDPOINT, {
    transports: ["websocket"],
    query: {
        "x-access-token": localStorage.getItem("token"),
    },
});

const ArrayManage = (props) => {
    const {
        classes,
        getDevices,
        // eslint-disable-next-line camelcase
        Get_Max_Volume_Count,
        // eslint-disable-next-line camelcase
        Get_Subsystems,
        // eslint-disable-next-line camelcase
        Set_Array,
        // eslint-disable-next-line camelcase
        Get_Volumes
    } = props;
    const selectedArray = props.arrayMap[props.arrayname];
    const totalVolSize = props.volumes.reduce((totalSize, volume) => totalSize + volume.size, 0);
    const volumeFilledStyle = {
        width: `${selectedArray && selectedArray.totalsize !== 0
            ? (100 * totalVolSize) / selectedArray.totalsize
            : 0
            }%`,
        height: "100%",
        backgroundColor: customTheme.palette.primary.main,
        float: "left",
        overflowY: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    };
    const volumeFreeStyle = {
        width: `${selectedArray && selectedArray.totalsize !== 0
            ? 100 - (100 * totalVolSize) / selectedArray.totalsize
            : 100
            }%`,
        height: "100%",
        color: "white",
        backgroundColor: customTheme.palette.secondary.light,
        float: "left",
        overflowY: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    };

    const [mountSubsystem, setMountSubsystem] = useState("");
    const [mountOpen, setMountOpen] = useState(false);
    const [volumeForMount, setVolumeForMount] = useState("");

    const rebuildArray = () => props.Rebuild_Array(props.arrayname);
    const deleteArray = () => props.Delete_Array({ arrayname: "" });
    const fetchVolumes = () => props.Get_Volumes({ array: props.arrayname });
    const closeMountPopup = () => setMountOpen(false);
    const changeMountSubsystem = (event) => setMountSubsystem(event.target.value);

    const deleteVolumes = (volumes) => {
        const vols = [];
        volumes.forEach((volume) => {
            vols.push({ name: volume.name, isMounted: volume.status === "Mounted" });
        });
        props.Delete_Volumes({ volumes: vols });
    }

    const changeArray = (event) => {
        const { value } = event.target;
        props.history.push(`/storage/array/manage?array=${value}`);
        props.Set_Array(value);
        props.Get_Volumes({ array: value });
    }

    const createVolume = (volume) => {
        props.Create_Volume({
            name: volume.volume_name,
            size: volume.volume_size,
            description: volume.volume_description,
            unit: volume.volume_units,
            maxbw: volume.maxbw,
            maxiops: volume.maxiops,
            minbw: volume.minbw,
            miniops: volume.miniops,
            count: volume.volume_count,
            subsystem: volume.subsystem,
            suffix: volume.volume_suffix,
            stop_on_error: volume.stop_on_error_checkbox,
            mount_vol: volume.mount_vol,
            max_available_size: selectedArray.totalsize - selectedArray.usedspace,
        });
    }

    const isSubsystemReserved = () => {
        for (let i = 0; i < props.subsystems.length; i += 1) {
            const subsystem = props.subsystems[i];
            const isSubsystemSelected = subsystem.subnqn === mountSubsystem;
            const isArrayFreeOrValid = !subsystem.array || subsystem.array === props.arrayname;
            if (isSubsystemSelected && isArrayFreeOrValid) {
                return false;
            }
        }
        return true;
    }

    const mountVolume = () => {
        if (isSubsystemReserved()) {
            props.Show_Storage_Alert({
                alertType: "alert",
                errorMsg: "Mount error",
                errorCode: "Selected Subsystem is used by another array",
                alertTitle: "Mounting Array"
            });
            return;
        }
        closeMountPopup();
        props.Change_Mount_Status({
            name: volumeForMount,
            array: props.arrayname,
            subsystem: mountSubsystem
        })
    }

    const mountConfirm = (payload) => {
        setMountSubsystem(getSubsystemForArray(props.subsystems, props.arrayname));
        setVolumeForMount(payload.name);
        setMountOpen(true);
    }

    const changeMountStatus = (payload) => {
        if (payload.status !== "Mounted") {
            mountConfirm(payload);
        } else {
            props.Change_Mount_Status(payload);
        }
    }

    useEffect(() => {
        if (window.location.href.indexOf('manage') > 0
            && window.location.href.indexOf(`array=${props.arrayname}`) < 0) {
            props.history.push(`/storage/array/manage?array=${props.arrayname}`);
            Get_Volumes({ array: props.arrayname })
        }
        // eslint-disable-next-line camelcase
    }, [Get_Volumes, props.history, props.arrayname])

    useEffect(() => {
        Get_Max_Volume_Count();
        // eslint-disable-next-line camelcase
    }, [Get_Max_Volume_Count])

    useEffect(() => {
        Get_Subsystems();
        // eslint-disable-next-line camelcase
    }, [Get_Subsystems])

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const array = urlParams.get("array");
        if (array) {
            Set_Array(array)
        }
        // eslint-disable-next-line camelcase
    }, [Set_Array])

    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Paper spacing={3}>
                        <Grid container className={classes.arrayInfoContainer} justifyContent="space-between">
                            <Tooltip
                                title={(
                                    <Typography data-testid="array-id-text">
                                        {`Array ID: ${selectedArray.uniqueId}`}
                                    </Typography>
                                )}
                                classes={{
                                    tooltip: classes.tooltip,
                                }}
                                interactive
                            >
                                <Info
                                    data-testid="array-info-icon"
                                    color="primary"
                                    className={classes.arrayInfoIcon}
                                />
                            </Tooltip>
                            <Grid container className={classes.arraySelectStatus}>
                                <Grid item xs={12} sm={6} lg={4} className={classes.arraySelectGrid}>
                                    <FormControl
                                        className={classes.selectForm}
                                        data-testid="arrayshow-form"
                                    >
                                        <InputLabel htmlFor="select-array">Select Array</InputLabel>
                                        <Select
                                            inputProps={{
                                                id: "select-array",
                                                "data-testid": "select-array-input",
                                            }}
                                            SelectDisplayProps={{
                                                style: {
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis"
                                                },
                                                "data-testid": "select-array",
                                            }}
                                            onChange={changeArray}
                                            value={props.arrayname}
                                            className={classes.arraySelect}
                                        >
                                            {props.arrays.map((array) => (
                                                <MenuItem key={array.arrayname} value={array.arrayname}>
                                                    <Typography color="secondary">{array.arrayname}</Typography>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} lg={4} className={classes.arraySelectGrid}>
                                    <Typography className={classes.statusText}>Status:
                                        <span
                                            style={{
                                                fontWeight: 600,
                                                color: selectedArray.status === "Mounted" ? "green" : "orange"
                                            }}
                                        >
                                            {selectedArray.status}
                                        </span>
                                        <Grid container alignItems="center">,
                                            <span data-testid="array-show-status">{selectedArray.situation}</span>
                                            {selectedArray.situation === "REBUILDING" ? (
                                                <LightTooltip
                                                    data-testid="Tooltip"
                                                    TransitionComponent={Zoom}
                                                    title={(
                                                        <RebuildProgress
                                                            arrayMap={props.arrayMap}
                                                            array={props.arrayname}
                                                            progress={selectedArray.rebuildProgress}
                                                            rebuildTime={selectedArray.rebuildTime}
                                                        />
                                                    )}
                                                    interactive
                                                >
                                                    <Info
                                                        color="primary"
                                                        data-testid="rebuild-popover-icon"
                                                    />
                                                </LightTooltip>
                                            ) : null
                                            }
                                            {selectedArray.status === "Mounted" &&
                                                selectedArray.situation === "DEGRADED" ? (
                                                <Tooltip
                                                    title="Rebuild Array"
                                                >
                                                    <Button
                                                        color="primary"
                                                        variant="contained"
                                                        data-testid="rebuild-icon"
                                                        id="rebuild-icon"
                                                        className={classes.rebuildButton}
                                                        onClick={rebuildArray}
                                                    >
                                                        Rebuild
                                                    </Button>
                                                </Tooltip>
                                            ) : null}
                                        </Grid>
                                    </Typography>
                                </Grid>
                            </Grid>
                            <ArrayShow
                                RAIDLevel={selectedArray.RAIDLevel}
                                slots={props.ssds}
                                arrayName={props.arrayname}
                                corrupted={selectedArray.corrupted}
                                storagedisks={selectedArray.storagedisks}
                                sparedisks={selectedArray.sparedisks}
                                metadiskpath={selectedArray.metadiskpath}
                                writebufferdisks={selectedArray.writebufferdisks}
                                deleteArray={deleteArray}
                                writeThrough={selectedArray.writeThroughEnabled}
                                diskDetails={props.diskDetails}
                                getDiskDetails={props.Get_Disk_Details}
                                isDevicesFetching={props.isDevicesFetching}
                                isArrayInfoFetching={props.isArrayInfoFetching}
                                addSpareDisk={props.Add_Spare_Disk}
                                removeSpareDisk={props.Remove_Spare_Disk}
                                replaceDevice={props.Replace_Device}
                                mountStatus={selectedArray.status}
                                handleUnmountPOS={props.Unmount_POS}
                                handleMountPOS={props.Mount_POS}
                                getArrayInfo={props.Get_Array_Info}
                                getDevices={getDevices}
                            />
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
            <Grid
                container
                spacing={1}
                className={classes.card}
                style={{
                    opacity: selectedArray.status !== "Mounted" ? 0.5 : 1,
                    pointerEvents:
                        selectedArray.status !== "Mounted"
                            ? "none"
                            : "initial",
                }}
            >
                <Grid item xs={12} md={6} className={classes.spaced}>
                    <CreateVolume
                        data-testid="createvolume"
                        createVolume={createVolume}
                        subsystems={props.subsystems}
                        array={props.arrayname}
                        maxVolumeCount={props.maxVolumeCount}
                        volCount={props.volumes.length}
                        maxAvailableSize={
                            selectedArray.totalsize - totalVolSize
                        }
                        createVolSocket={createVolSocket}
                        fetchVolumes={fetchVolumes}
                        fetchArray={props.Get_Array}
                        fetchSubsystems={props.Get_Subsystems}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper className={classes.volumeStatsPaper}>
                        <Typography className={classes.cardHeader} variant="h2">
                            Volume Statistics
                        </Typography>
                        <div className={classes.statsWrapper}>
                            <Grid item xs={12} container alignItems="center">
                                <Typography color="primary" variant="body1">
                                    Number of volumes:&nbsp;
                                </Typography>
                                <Typography className={classes.font18bold} color="secondary">
                                    {props.volumes.length}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} className={classes.statsContainer}>
                                <Box className={classes.volumeStats}>
                                    <div style={volumeFilledStyle} />
                                    <div style={volumeFreeStyle} />
                                </Box>
                                <Grid
                                    item
                                    container
                                    xs={12}
                                    wrap="wrap"
                                    className={classes.legendContainer}
                                >
                                    <Legend
                                        bgColor={customTheme.palette.primary.main}
                                        title="Used Space"
                                        value={
                                            formatBytes(totalVolSize).replace(' ', '')
                                        }
                                    />
                                    <Legend
                                        bgColor={customTheme.palette.secondary.light}
                                        title="Available for Volume Creation"
                                        value={
                                            formatBytes(
                                                selectedArray.totalsize - totalVolSize >= BYTE_FACTOR * BYTE_FACTOR ?
                                                    selectedArray.totalsize - totalVolSize :
                                                    0
                                            ).replace(' ', '')
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </div>
                    </Paper>
                </Grid>
            </Grid>
            <Grid
                container
                spacing={1}
                className={classes.card}
                style={{
                    opacity: selectedArray.status !== "Mounted" ? 0.5 : 1,
                    pointerEvents:
                        selectedArray.status !== "Mounted"
                            ? "none"
                            : "initial",
                }}
            >
                <Grid item xs={12}>
                    <VolumeList
                        volumes={props.volumes}
                        fetchingVolumes={props.fetchingVolumes}
                        deleteVolumes={deleteVolumes}
                        resetQoS={props.Reset_Volume_QoS}
                        editVolume={props.Edit_Volume}
                        changeField={props.Change_Volume_Field}
                        fetchVolumes={fetchVolumes}
                        saveVolume={props.Reset_And_Update_Volume}
                        changeMountStatus={changeMountStatus}
                        changeMinType={props.Change_Min_Type}
                        changeResetType={props.Change_Reset_Type}
                    />
                </Grid>
            </Grid>
            <SelectSubsystem
                title="Select a subsystem"
                open={mountOpen}
                subsystems={props.subsystems}
                handleChange={changeMountSubsystem}
                selectedSubsystem={mountSubsystem}
                handleClose={closeMountPopup}
                array={props.arrayname}
                volume={volumeForMount}
                mountVolume={mountVolume}
            />
        </>
    )
}


const mapStateToProps = (state) => {
    return {
        ssds: state.storageReducer.ssds,
        arrayMap: state.storageReducer.arrayMap,
        arrayname: state.storageReducer.arrayname,
        arrays: state.storageReducer.arrays,
        isDevicesFetching: state.storageReducer.isDevicesFetching,
        isArrayInfoFetching: state.storageReducer.isArrayInfoFetching,
        subsystems: state.subsystemReducer.subsystems,
        maxVolumeCount: state.storageReducer.maxVolumeCount,
        volumes: state.storageReducer.volumes,
        fetchingVolumes: state.storageReducer.fetchingVolumes,
        diskDetails: state.storageReducer.diskDetails,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        Get_Max_Volume_Count: () => dispatch({ type: actionTypes.SAGA_FETCH_MAX_VOLUME_COUNT }),
        Set_Array: (payload) => dispatch({ type: actionTypes.SET_ARRAY, payload }),
        Rebuild_Array: (payload) => dispatch({ type: actionTypes.SAGA_REBUILD_ARRAY, payload }),
        Delete_Array: (payload) => dispatch({ type: actionTypes.SAGA_DELETE_ARRAY, payload }),
        Add_Spare_Disk: (payload) => dispatch({ type: actionTypes.SAGA_ADD_SPARE_DISK, payload }),
        Remove_Spare_Disk: (payload) => dispatch({ type: actionTypes.SAGA_REMOVE_SPARE_DISK, payload }),
        Replace_Device: (payload) => dispatch({ type: actionTypes.SAGA_REPLACE_DEVICE, payload }),
        Unmount_POS: () => dispatch({ type: actionTypes.SAGA_UNMOUNT_POS }),
        Mount_POS: (payload) => dispatch({ type: actionTypes.SAGA_MOUNT_POS, payload }),
        Get_Array_Info: (payload) => dispatch({ type: actionTypes.SAGA_GET_ARRAY_INFO, payload }),
        Create_Volume: (payload) => dispatch({ type: actionTypes.SAGA_SAVE_VOLUME, payload }),
        Get_Array: () => dispatch({ type: actionTypes.SAGA_FETCH_ARRAY }),
        Reset_Volume_QoS: (payload) => dispatch({ type: actionTypes.SAGA_RESET_VOLUME_QOS, payload }),
        Edit_Volume: (payload) => dispatch({ type: actionTypes.EDIT_VOLUME, payload }),
        Change_Volume_Field: (payload) => dispatch({ type: actionTypes.CHANGE_VOLUME_FIELD, payload }),
        Reset_And_Update_Volume: (payload) => dispatch({ type: actionTypes.SAGA_RESET_AND_UPDATE_VOLUME, payload }),
        Change_Min_Type: (payload) => dispatch({ type: actionTypes.CHANGE_MIN_TYPE, payload }),
        Change_Reset_Type: (payload) => dispatch({ type: actionTypes.CHANGE_RESET_TYPE, payload }),
        Get_Subsystems: () => dispatch({ type: actionTypes.SAGA_FETCH_SUBSYSTEMS }),
        Delete_Volumes: (payload) => dispatch({ type: actionTypes.SAGA_DELETE_VOLUMES, payload }),
        Get_Volumes: (payload) => dispatch({ type: actionTypes.SAGA_FETCH_VOLUMES, payload }),
        Change_Mount_Status: (payload) => dispatch({ type: actionTypes.SAGA_VOLUME_MOUNT_CHANGE, payload }),
        Get_Disk_Details: (payload) => dispatch({ type: actionTypes.SAGA_FETCH_DEVICE_DETAILS, payload }),
        Show_Storage_Alert: (payload) => dispatch({ type: actionTypes.STORAGE_SHOW_ALERT, payload }),
    };
};

export default withStyles(styles)(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(withRouter(ArrayManage))
);