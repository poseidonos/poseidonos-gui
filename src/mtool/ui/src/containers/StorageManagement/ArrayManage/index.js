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
import { customTheme } from "../../../theme";
import LightTooltip from "../../../components/LightTooltip";
import RebuildProgress from "../../../components/RebuildProgress";
import ArrayShow from "../../../components/ArrayManagement/ArrayShow";
import * as actionTypes from "../../../store/actions/actionTypes";
import CreateVolume from "../../../components/VolumeManagement/CreateVolume";
import VolumeList from "../../../components/VolumeManagement/VolumeList";
import formatBytes from "../../../utils/format-bytes";
import Legend from "../../../components/Legend";
import { BYTE_FACTOR } from "../../../utils/constants";

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
    }
})

// namespace to connect to the websocket for multi-volume creation
const createVolSocketEndPoint = ":5000/create_vol";

const ArrayManage = (props) => {
    const {
        classes,
        changeArray,
        selectedArray,
        ssds,
        diskDetails,
        getDiskDetails,
        getDevices,
        mountConfirm
    } = props;
    const [totalVolSize, setTotalVolSize] = useState(0);
    const createVolSocket = io(createVolSocketEndPoint, {
        transports: ["websocket"],
        query: {
            "x-access-token": localStorage.getItem("token"),
        },
    });
    const volumeFilledStyle = {
        width: `${props.arrayMap[selectedArray] && props.arrayMap[selectedArray].totalsize !== 0
            ? (100 * totalVolSize) / props.arrayMap[selectedArray].totalsize
            : 0
            }%`,
        height: "100%",
        backgroundColor: "rgba(51, 158, 255,0.6)",
        float: "left",
        overflowY: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    };
    const volumeFreeStyle = {
        width: `${props.arrayMap[selectedArray] && props.arrayMap[selectedArray].totalsize !== 0
            ? 100 - (100 * totalVolSize) / props.arrayMap[selectedArray].totalsize
            : 100
            }%`,
        height: "100%",
        color: "white",
        backgroundColor: "rgba(0, 186, 0, 0.6)",
        float: "left",
        overflowY: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    };

    const rebuildArray = () => {
        props.Rebuild_Array(selectedArray);
    }
    const deleteArray = () => {
        props.Delete_Array({ arrayname: "" });
    }
    const fetchVolumes = () => {
        props.Get_Volumes({ array: selectedArray });
    }
    const changeMountStatus = (payload) => {
        if (payload.status !== "Mounted") {
            mountConfirm(payload);
        } else {
            props.Change_Mount_Status(payload);
        }
    }

    const deleteVolumes = (volumes) => {
        const vols = [];
        volumes.forEach((volume) => {
            vols.push({ name: volume.name, isMounted: volume.status === "Mounted" });
        });
        props.Delete_Volumes({ volumes: vols });
    }
    useEffect(() => {
        if (window.location.href.indexOf('manage') > 0
            && window.location.href.indexOf(`array=${selectedArray}`) < 0) {
            props.history.push(`/storage/array/manage?array=${selectedArray}`);
            fetchVolumes();
        }
    })

    useEffect(() => {
        let volSize = 0;
        for (let i = 0; i < props.volumes.length; i += 1) {
            volSize += props.volumes[i].size;
        }
        setTotalVolSize(volSize)
    }, [props.volumes])

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
            max_available_size: props.arrayMap[selectedArray].totalsize - props.arrayMap[selectedArray].usedspace,
        });
    }

    return (
        <>
            <Grid container spacing={1} className={classes.card}>
                <Grid item xs={12}>
                    <Paper spacing={3}>
                        <Grid container className={classes.arrayInfoContainer} justifyContent="space-between">
                            <Tooltip
                                title={(
                                    <Typography data-testid="array-id-text">
                                        {`Array ID: ${props.arrayMap[props.selectedArray].uniqueId}`}
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
                                            value={selectedArray}
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
                                                color: props.arrayMap[selectedArray].status === "Mounted" ? "green" : "orange"
                                            }}
                                        >
                                            {props.arrayMap[selectedArray].status}
                                        </span>
                                        <Grid container alignItems="center">,
                                            <span data-testid="array-show-status">{props.arrayMap[selectedArray].situation}</span>
                                            {props.arrayMap[selectedArray].situation === "REBUILDING" ? (
                                                <LightTooltip
                                                    data-testid="Tooltip"
                                                    TransitionComponent={Zoom}
                                                    title={(
                                                        <RebuildProgress
                                                            arrayMap={props.arrayMap}
                                                            array={selectedArray}
                                                            progress={props.arrayMap[selectedArray].rebuildProgress}
                                                            rebuildTime={props.arrayMap[selectedArray].rebuildTime}
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
                                            {props.arrayMap[selectedArray].status === "Mounted" &&
                                                props.arrayMap[selectedArray].situation === "DEGRADED" ? (
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
                                RAIDLevel={props.arrayMap[selectedArray].RAIDLevel}
                                slots={ssds}
                                arrayName={selectedArray}
                                corrupted={props.arrayMap[selectedArray].corrupted}
                                storagedisks={props.arrayMap[selectedArray].storagedisks}
                                sparedisks={props.arrayMap[selectedArray].sparedisks}
                                metadiskpath={props.arrayMap[selectedArray].metadiskpath}
                                writebufferdisks={props.arrayMap[selectedArray].writebufferdisks}
                                deleteArray={deleteArray}
                                writeThrough={props.arrayMap[selectedArray].writeThroughEnabled}
                                diskDetails={diskDetails}
                                getDiskDetails={getDiskDetails}
                                isDevicesFetching={props.isDevicesFetching}
                                isArrayInfoFetching={props.isArrayInfoFetching}
                                addSpareDisk={props.Add_Spare_Disk}
                                removeSpareDisk={props.Remove_Spare_Disk}
                                replaceDevice={props.Replace_Device}
                                mountStatus={props.arrayMap[selectedArray].status}
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
                    opacity: props.arrayMap[selectedArray].status !== "Mounted" ? 0.5 : 1,
                    pointerEvents:
                        props.arrayMap[selectedArray].status !== "Mounted"
                            ? "none"
                            : "initial",
                }}
            >
                <Grid item xs={12} md={6} className={classes.spaced}>
                    <CreateVolume
                        data-testid="createvolume"
                        createVolume={createVolume}
                        subsystems={props.subsystems}
                        array={selectedArray}
                        maxVolumeCount={props.maxVolumeCount}
                        volCount={props.volumes.length}
                        maxAvailableSize={
                            props.arrayMap[selectedArray].totalsize - totalVolSize
                        }
                        createVolSocket={createVolSocket}
                        fetchVolumes={fetchVolumes}
                        fetchArray={props.Get_Array}
                        fetchSubsystems={props.Get_Subsystems}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper className={classes.volumeStatsPaper}>
                        <Typography className={classes.cardHeader}>
                            Volume Statistics
                        </Typography>
                        <div className={classes.statsWrapper}>
                            <Grid item xs={12}>
                                <Typography color="secondary">
                                    Number of volumes: {props.volumes.length}
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
                                        bgColor="rgba(51, 158, 255,0.6)"
                                        title={`
                          Used Space :
                          ${formatBytes(totalVolSize)}
                        `}
                                    />
                                    <Legend
                                        bgColor="rgba(0, 186, 0, 0.6)"
                                        title={`
                          Available for Volume Creation :
                          ${formatBytes(
                                            props.arrayMap[selectedArray].totalsize - totalVolSize >= BYTE_FACTOR * BYTE_FACTOR ?
                                                props.arrayMap[selectedArray].totalsize - totalVolSize :
                                                0
                                        )}
                        `}
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
                    opacity: props.arrayMap[selectedArray].status !== "Mounted" ? 0.5 : 1,
                    pointerEvents:
                        props.arrayMap[selectedArray].status !== "Mounted"
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
        </>
    )
}


const mapStateToProps = (state) => {
    return {
        arrayMap: state.storageReducer.arrayMap,
        selectedArray: state.storageReducer.arrayname,
        arrays: state.storageReducer.arrays,
        isDevicesFetching: state.storageReducer.isDevicesFetching,
        isArrayInfoFetching: state.storageReducer.isArrayInfoFetching,
        subsystems: state.subsystemReducer.subsystems,
        maxVolumeCount: state.storageReducer.maxVolumeCount,
        volumes: state.storageReducer.volumes,
        fetchingVolumes: state.storageReducer.fetchingVolumes,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
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
    };
};

export default withStyles(styles)(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(withRouter(ArrayManage))
);