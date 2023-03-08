/* eslint-disable react/no-multi-comp */
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

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import MaterialTable from "@material-table/core";
import { Box, FormControl, Grid, InputLabel, Link, MenuItem, Paper, Select, Tab, Tabs, Typography, Zoom } from "@material-ui/core";
import { ThemeProvider, withStyles } from "@material-ui/styles";
import { ArrowUpward, ChevronLeft, ChevronRight, FirstPage, LastPage, Remove } from "@material-ui/icons";

import VolumeIconSelected from '../../../assets/images/Volume-Icon-SEL.png';
import ArraysIconSelected from '../../../assets/images/Arrays-SEL.png';
import Legend from "../../../components/Legend";
import { customTheme, PageTheme } from "../../../theme";
import { BYTE_FACTOR } from "../../../utils/constants";
import formatBytes from "../../../utils/format-bytes";
import * as actionTypes from "../../../store/actions/actionTypes";
import LightTooltip from "../../../components/LightTooltip";

const styles = (theme) => ({
    storageDetailsPaper: {
        height: "fit-content",
        padding: theme.spacing(1, 2)
    },
    cardHeader: {
        ...customTheme.card.header,
        marginLeft: 0,
        marginBottom: 0,
        paddingTop: 0
    },
    storageSummary: {
        position: "relative",
        height: 79,
        [theme.breakpoints.up("xl")]: {
            height: 165,
        },
        [theme.breakpoints.down("md")]: {
            height: 121,
        },
    },
    storageGraph: {
        position: "absolute",
        height: "100%",
        top: 0,
        left: 0,
    },
    dashboardSizeLabelContainer: {
        width: "100%",
        display: "flex",
        alignItems: "flex-end"
    },
    dashboardMinLabel: {
        fontSize: 14,
        float: "left",
        display: "block",
        textAlign: "left",
        whiteSpace: "nowrap",
    },
    dashboardMaxLabel: {
        fontSize: 14,
        float: "right",
        display: "block",
        textAlign: "right",
        whiteSpace: "nowrap",
    },
    storageDetailContainer: {
        border: "1px solid lightgray",
        width: "100%",
        margin: "auto 8px",
        height: 14,
        overflow: "hidden",
        position: "relative",
        [theme.breakpoints.up("xl")]: {
            height: 24
        },
    },
    tabs: {
        backgroundColor: "#F1F0F5"
    },
    tabIcon: {
        marginRight: theme.spacing(1)
    },
    arrayTabIcon: {
        marginRight: theme.spacing(.5)
    },
    tableTitle: {
        height: '46px',
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: theme.spacing(0, 2),
    },
    volName: {
        display: "inline-block",
        width: "inherit",
        overflow: "hidden",
        textOverflow: "ellipsis",
        [theme.breakpoints.down("md")]: {
            maxWidth: 150,
        },
        [theme.breakpoints.down(1150)]: {
            maxWidth: 100,
        },
    },
    arraySelect: {
        textAlign: "center",
        minWidth: 100
    },
    borderSolid: {
        border: "1px solid #0001",
    },
});


const ARRAYTAB = "arrayTab";
const VOLUMETAB = "volumeTab";

const getUsedSpace = (total, remain) => {
    if (Number.isNaN(remain)) {
        return formatBytes(0);
    }
    return formatBytes(total - remain);
}

/* eslint-disable react/no-multi-comp */
const icons = {
    FirstPage: () => <FirstPage id="Dashboard-icon-vol-firstpage" />,
    LastPage: () => <LastPage id="Dashboard-icon-vol-lastpage" />,
    NextPage: () => <ChevronRight id="Dashboard-icon-vol-nextpage" />,
    PreviousPage: () => <ChevronLeft id="Dashboard-icon-vol-previouspage" />,
    ThirdStateCheck: Remove,
    DetailPanel: ChevronRight,
    SortArrow: ArrowUpward,
};

const StorageDetails = (props) => {
    const { classes, volumes, arraySize, fetchVolumes, fetchArrays } = props;
    const [selectedTab, setSelectedTab] = useState(ARRAYTAB);
    const [volSpace, setVolSpace] = useState(0);
    const [volUsedSpace, setVolUsedSpace] = useState(0);
    const volFilledStyle = {
        width: `${(volSpace * 100) / arraySize}%`,
        height: "100%",
        backgroundColor: customTheme.palette.secondary.light,
        float: "left",
    };
    const volUsedStyle = {
        width: `${(volUsedSpace * 100) / volSpace}%`,
        height: "100%",
        backgroundColor: customTheme.palette.secondary.dark,
        float: "left",
    };
    const storageFreeStyle = {
        width: `${100 - (volSpace * 100) / arraySize}%`,
        height: "100%",
        color: "black",
        marginLeft: "0px",
        float: "left",
        overflowY: "auto",
        display: "inline-block",
        textAlign: "center",
        position: "relative",
        backgroundColor: "#fff",
    };
    const localCellStyle = {
        paddingTop: 8,
        paddingBottom: 8,
    };

    useEffect(() => {
        fetchVolumes();
        fetchArrays();
    }, [fetchVolumes, fetchArrays])

    useEffect(() => {
        let space = 0;
        let usedSpace = 0;
        volumes.forEach((vol) => {
            usedSpace += Number(vol.total) - (
                vol.remain === undefined ? Number(vol.total) : Number(vol.remain)
            );
            space += Number(vol.total);
        });
        setVolSpace(space);
        setVolUsedSpace(usedSpace);
    }, [volumes, arraySize, setVolSpace, setVolUsedSpace])

    const arrayTableColumns = [
        {
            title: "Name",
            field: "arrayname",
            cellStyle: localCellStyle,
            render: (rowData) => (
                <Link className={classes.volName} href={`/storage/array/manage?array=${rowData.arrayname}`}>{rowData.arrayname}</Link>
            )
        },
        {
            title: "RAID",
            field: "RAIDLevel",
            cellStyle: localCellStyle
        },
        {
            title: "TotalSpace",
            cellStyle: localCellStyle,
            render: (rowData) => formatBytes(rowData.totalsize),
            customSort: (a, b) => (a.totalsize - b.totalsize)
        },
        {
            title: "Volumes",
            cellStyle: localCellStyle,
            render: (rowData) => props.arrayVolCount[rowData.arrayname] ? props.arrayVolCount[rowData.arrayname] : 0,
            customSort: (a, b) => (props.arrayVolCount[a.arrayname] - props.arrayVolCount[b.arrayname])
        }
    ];
    const volumeTableColumns = [
        {
            title: "Name",
            cellStyle: localCellStyle,
            render: (rowData) => (
                <LightTooltip interactive title={rowData.name} TransitionComponent={Zoom}>
                    <Typography className={classes.volName}>{rowData.name}</Typography>
                </LightTooltip>
            ),
            customSort: (a, b) => (a.name.localeCompare(b.name))
        },
        {
            title: "Used Space",
            cellStyle: localCellStyle,
            render: (rowData) => getUsedSpace(rowData.total, rowData.remain),
            customSort: (a, b) => (b.remain - a.remain)
        },
        {
            title: "Total Space",
            cellStyle: localCellStyle,
            render: (rowData) => (rowData.total ? formatBytes(rowData.total) : formatBytes(0)),
            customSort: (a, b) => (a.total - b.total)
        },
        {
            title: "Array",
            field: "array",
            cellStyle: localCellStyle
        }
    ];

    const arrayTable = (
        <MaterialTable
            components={{
                Toolbar: () => (
                    <Grid className={classes.tableTitle}>
                        <Typography variant="h6" color="primary">
                            Array Summary
                        </Typography>
                    </Grid>
                )
            }}
            columns={arrayTableColumns}
            data={props.arrays}
            options={{
                headerStyle: {
                    ...customTheme.table.header,
                    paddingRight: 0
                },
                minBodyHeight: 290,
                maxBodyHeight: 290,
                search: false,
                sorting: true
            }}
            style={{
                height: "100%",
                boxShadow: "none",
            }}
            isLoading={props.arrayLoading}
            icons={icons}
        />
    );
    const volumeTable = selectedTab === VOLUMETAB && (
        <MaterialTable
            columns={volumeTableColumns}
            data={props.arrayVolumes}
            options={{
                headerStyle: {
                    ...customTheme.table.header,
                    paddingRight: 0
                },
                minBodyHeight: 290,
                maxBodyHeight: 290,
                search: false,
                sorting: true
            }}
            components={{
                Toolbar: () => (
                    <Grid className={classes.tableTitle}>
                        <Typography variant="h6" color="primary">
                            Volume Summary
                        </Typography>
                        <FormControl>
                            <InputLabel htmlFor="select-array">Array</InputLabel>
                            <Select
                                value={props.selectedArray}
                                onChange={(e) =>
                                    props.selectArray(e.target.value)
                                }
                                inputProps={{
                                    id: "select-array",
                                    "data-testid": "dashboard-array-select"
                                }}
                                data-testid="array-select"
                                className={classes.arraySelect}
                            >
                                <MenuItem value="all">All</MenuItem>
                                {props.arrays.map((array) => (
                                    <MenuItem key={array.arrayname} value={array.arrayname}>{array.arrayname}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                )
            }}
            style={{
                height: "100%",
                boxShadow: "none",
            }}
            icons={icons}
        />
    );

    return (
        <ThemeProvider theme={PageTheme}>
            <Paper className={classes.storageDetailsPaper}>
                <Grid item container xs={12} justifyContent="flex-start">
                    <Typography className={classes.cardHeader} variant="h2">
                        Storage Details
                    </Typography>
                </Grid>
                <Grid className={classes.storageSummary}>
                    <Grid
                        container
                        justifyContent="center"
                        alignContent="center"
                        className={classes.storageGraph}
                    >
                        {arraySize === 0 ? (
                            <Typography
                                data-testid="dashboard-no-array"
                                color="secondary"
                            >
                                Arrays are not available
                            </Typography>
                        ) : (
                            <>
                                <div className={classes.dashboardSizeLabelContainer}>
                                    <span className={classes.dashboardMinLabel}>0TB</span>

                                    <div className={classes.storageDetailContainer}>
                                        <div style={volFilledStyle}>
                                            <div style={volUsedStyle} />
                                        </div>
                                        <div style={storageFreeStyle} />
                                    </div>

                                    <span className={classes.dashboardMaxLabel}>
                                        {formatBytes(arraySize)}
                                    </span>
                                </div>
                                <Grid container wrap="wrap" justifyContent="flex-end">
                                    <Legend
                                        bgColor={customTheme.palette.secondary.dark}
                                        title="Data Written"
                                        value={formatBytes(volUsedSpace).replace(' ', '')}
                                    />
                                    <Legend
                                        bgColor={customTheme.palette.secondary.light}
                                        title="Volume Space Allocated"
                                        value={formatBytes(volSpace).replace(' ', '')}
                                    />
                                    <Legend
                                        bgColor="#fff"
                                        title="Available for Volume Creation"
                                        value={
                                            formatBytes(
                                                arraySize - volSpace >= BYTE_FACTOR * BYTE_FACTOR ?
                                                    arraySize - volSpace :
                                                    0
                                            ).replace(' ', '')
                                        }
                                    />
                                </Grid>
                            </>
                        )}
                    </Grid>
                </Grid>
                <Tabs
                    value={selectedTab}
                    onChange={(e, newVal) => setSelectedTab(newVal)}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="secondary tabs example"
                    centered
                    className={classes.tabs}
                >
                    <Tab
                        value={ARRAYTAB}
                        label={(
                            <Box display="flex" alignItems="center">
                                <img
                                    height="24px"
                                    width="24px"
                                    className={classes.arrayTabIcon}
                                    src={ArraysIconSelected}
                                    alt="Arrays Icon"
                                    style={selectedTab === ARRAYTAB ? { opacity: ".8" } : { opacity: ".3" }}
                                />
                                <Typography>{props.arrays.length} Arrays</Typography>
                            </Box>
                        )}
                        data-testid="array-tab"
                    />
                    <Tab
                        value={VOLUMETAB}
                        label={(
                            <Box display="flex" alignItems="center">
                                <img
                                    height="18px"
                                    width="18px"
                                    className={classes.tabIcon}
                                    src={VolumeIconSelected}
                                    alt="Volumes Icon"
                                    style={selectedTab === VOLUMETAB ? { opacity: ".8" } : { opacity: ".3" }}
                                />
                                <Typography>{props.arrayVolumes.length} Volumes</Typography>
                            </Box>
                        )}
                        data-testid="volume-tab"
                    />
                </Tabs>
                <Grid className={classes.borderSolid}>
                    {selectedTab === ARRAYTAB ? arrayTable : volumeTable}
                </Grid>
            </Paper>
        </ThemeProvider>
    );
};

const mapStateToProps = state => {
    return {
        volumes: state.dashboardReducer.volumes,
        arrayLoading: state.storageReducer.loading,
        arrays: state.storageReducer.arrays,
        arrayVolumes: state.dashboardReducer.arrayVolumes,
        arrayVolCount: state.dashboardReducer.arrayVols,
        arraySize: state.storageReducer.arraySize,
        selectedArray: state.dashboardReducer.selectedArray,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchPerformance: () => dispatch({ type: actionTypes.SAGA_FETCH_PERFORMANCE_INFO }),
        selectArray: (array) => dispatch({ type: actionTypes.SELECT_ARRAY, array }),
        fetchVolumes: () => dispatch({ type: actionTypes.SAGA_FETCH_VOLUME_INFO }),
        fetchArrays: () => dispatch({ type: actionTypes.SAGA_FETCH_ARRAY }),
    };
};

export default withStyles(styles)(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(StorageDetails)
);