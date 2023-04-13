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
import { PieChart } from 'react-minimal-pie-chart';
import MaterialTable from "@material-table/core";
import { ArrowRight, ArrowUpward } from "@material-ui/icons";
import { Box, Button, Grid, Paper, ThemeProvider, Typography, withStyles } from "@material-ui/core";
import { customTheme, PageTheme } from "../../../theme";
import Legend from "../../../components/Legend";
import Popup from "../../../components/Popup";
import * as actionTypes from "../../../store/actions/actionTypes";
import { FETCH_API_INTERVAL } from "../../../utils/constants";


const styles = (theme) => ({
    hardwareHealthPaper: {
        marginTop: theme.spacing(1),
        height: 406,
        padding: theme.spacing(1, 2),
        [theme.breakpoints.down("md")]: {
            height: "auto",
        },
    },
    cardHeader: {
        ...customTheme.card.header,
        marginLeft: 0,
        marginBottom: 0,
        paddingTop: 0
    },
    tableHeight: {
        height: 344,
        [theme.breakpoints.down("md")]: {
            height: "auto",
            minHeight: 100
        },
    },
    tableHeader: {
        ...customTheme.table.header,
        padding: 8,
        paddingLeft: theme.spacing(2),
        width: "-webkit-fill-available",
    },
    pieChartBox: {
        border: "1px solid #0001",
        [theme.breakpoints.down("sm")]: {
            paddingBottom: 8
        },
    },
    marginAuto: {
        margin: "auto"
    },
    summary: {
        marginBottom: 6,
        marginTop: 6,
    }
});


const TEMPERETUREINDEX = 0
const SPAREINDEX = 1
const CRITICAL = "critical";
const WARNING = "warning";
const NOMINAL = "nominal";
const stateOrder = { [CRITICAL]: 1, [WARNING]: 2, [NOMINAL]: 3 };
const getDarkColorStyle = {
    [CRITICAL]: { color: customTheme.palette.error.dark },
    [WARNING]: { color: customTheme.palette.warning.dark },
    [NOMINAL]: { color: customTheme.palette.success.dark }
}

const HardwareHealth = (props) => {
    const { classes, isConfigured, fetchHardwareHealth } = props;
    const localCellStyle = {
        paddingTop: 8,
        paddingBottom: 8,
    };
    const [showHealthTable, setShowHealthTable] = useState(false);
    const [healthTableData, setHealthTableData] = useState({
        title: "",
        metrics: [],
        valueHeader: "",
    });

    useEffect(() => {
        if (isConfigured)
            fetchHardwareHealth();
        const interval = setInterval(() => {
            if (isConfigured)
                fetchHardwareHealth();
        }, FETCH_API_INTERVAL);

        return () => clearInterval(interval)
    }, [isConfigured, fetchHardwareHealth]);

    /* eslint-disable react/no-multi-comp */
    const icons = {
        SortArrow: ArrowUpward,
    };
    const healthTableColumns = [
        {
            title: "Device Name",
            cellStyle: {
                ...localCellStyle,
                width: 130,
            },
            field: "name",
            customSort: (a, b) => (a.type.localeCompare(b.type))
        },
        {
            title: healthTableData.valueHeader,
            cellStyle: localCellStyle,
            render: (rowData) => <Typography style={getDarkColorStyle[rowData.state]}>{rowData.value}</Typography>,
            customSort: (a, b) => stateOrder[a.state] - stateOrder[b.state]
        },
    ];
    const healthTable = (
        <MaterialTable
            columns={healthTableColumns}
            components={{
                Toolbar: () => <></>
            }}
            data={healthTableData.metrics}
            icons={icons}
            options={{
                headerStyle: customTheme.table.header,
                search: false,
                sorting: true,
                paging: false,
            }}
            style={{
                width: "100%",
                height: 380,
                boxShadow: "none",
                border: "1px solid rgb(0 0 0 / 12%)",
                overflow: "scroll"
            }}
        />
    );

    const pieChartBox = (index) => {
        if (props.errorInDevices)
            return <Typography className={classes.marginAuto}>Please Check POS Exporter</Typography>;

        const { criticals, warnings, nominals } = props.devices[index];
        const total = (criticals + warnings + nominals)
        if (!total)
            return <Typography className={classes.marginAuto}>No Data to plot PieChart</Typography>;

        const getPercentage = (value) => Math.round(value * 1000 / total) / 10;

        return (
            <>
                <Box
                    sx={{ mt: 2, mb: "auto", width: "100%" }}
                >
                    <PieChart
                        animate
                        animationDuration={500}
                        data={[
                            { title: CRITICAL, value: criticals, color: customTheme.palette.error.main },
                            { title: WARNING, value: warnings, color: customTheme.palette.warning.main },
                            { title: NOMINAL, value: nominals, color: customTheme.palette.success.main },
                        ]}
                        labelPosition={60}
                        label={(data) => {
                            const value = getPercentage(data.dataEntry.value);
                            return value < 5 ? "" : `${value}%`;
                        }}
                        labelStyle={{
                            fontSize: "10px",
                            fontColor: "FFFFFA",
                            fontWeight: "400",
                            pointerEvents: "none"
                        }}
                        lengthAngle={360}
                        lineWidth={75}
                        radius={45}
                        segmentsShift={2}
                        style={{
                            maxHeight: 160,
                            alignSelf: "center",
                        }}
                    />
                    <Box display="flex" justifyContent="center">
                        {getPercentage(nominals) < 5 && getPercentage(nominals) !== 0 &&
                            (
                                <Legend
                                    bgColor={customTheme.palette.success.main}
                                    title="Nominals"
                                    value={`${getPercentage(nominals)}%`}
                                />
                            )
                        }
                        {getPercentage(warnings) < 5 && getPercentage(warnings) !== 0 &&
                            (
                                <Legend
                                    bgColor={customTheme.palette.warning.main}
                                    title="Warnings"
                                    value={`${getPercentage(warnings)}%`}
                                />
                            )
                        }
                        {getPercentage(criticals) < 5 && getPercentage(criticals) !== 0 &&
                            (
                                <Legend
                                    bgColor={customTheme.palette.error.main}
                                    title="Criticals"
                                    value={`${getPercentage(criticals)}%`}
                                />
                            )
                        }
                    </Box>
                </Box>
                <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    className={classes.marginAuto}
                    onClick={() => {
                        setHealthTableData({
                            title: props.devices[index].type,
                            valueHeader: props.devices[index].unit,
                            metrics: props.devices[index].metrics
                        })
                        setShowHealthTable(!showHealthTable)
                    }}
                >
                    View Details
                    <ArrowRight />
                </Button>
            </>
        )
    };

    return (
        <ThemeProvider theme={PageTheme}>
            <Paper className={classes.hardwareHealthPaper}>
                <Grid item container xs={12} justifyContent="flex-start">
                    <Typography className={classes.cardHeader} variant="h2">
                        Hardware Health
                    </Typography>
                </Grid>
                <Grid item container xs={12} justifyContent="center" className={classes.summary}>
                    <Legend
                        bgColor={customTheme.palette.success.main}
                        title="Nominals"
                        value={props.totalNominals}
                    />
                    <Legend
                        bgColor={customTheme.palette.warning.main}
                        title="Warnings"
                        value={props.totalWarnings}
                    />
                    <Legend
                        bgColor={customTheme.palette.error.main}
                        title="Criticals"
                        value={props.totalCriticals}
                    />
                </Grid>
                <Grid container className={`${classes.tableHeight}`}>
                    {!props.isConfigured && <Typography className={classes.marginAuto}>Telemetry IP is not Configured</Typography>}
                    {props.isConfigured && props.devices.length === 2 && (
                        <>
                            <Grid item container xs={12} md={6}
                                direction="column"
                                justifyContent="space-between"
                                alignItems="center"
                                className={`${classes.pieChartBox}`}
                            >
                                <Typography className={classes.tableHeader}>
                                    Temperatures
                                </Typography>
                                {pieChartBox(TEMPERETUREINDEX)}
                            </Grid>
                            <Grid item container xs={12} md={6}
                                direction="column"
                                justifyContent="space-between"
                                alignItems="center"
                                className={`${classes.pieChartBox}`}
                            >
                                <Typography className={classes.tableHeader}>
                                    Spares
                                </Typography>
                                {pieChartBox(SPAREINDEX)}
                            </Grid>
                        </>
                    )}
                </Grid>
            </Paper>
            <Popup
                title={`${healthTableData.title}`}
                open={showHealthTable}
                close={() => setShowHealthTable(false)}
                maxWidth="xs"
            >
                {healthTable}
            </Popup>
        </ThemeProvider>
    );
};

const mapStateToProps = state => {
    return {
        devices: state.dashboardReducer.devices,
        errorInDevices: state.dashboardReducer.errorInDevices,
        totalNominals: state.dashboardReducer.totalNominals,
        totalWarnings: state.dashboardReducer.totalWarnings,
        totalCriticals: state.dashboardReducer.totalCriticals,
        isConfigured: state.authenticationReducer.isConfigured,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchHardwareHealth: () => dispatch({ type: actionTypes.SAGA_FETCH_HARDWARE_HEALTH }),
    };
};

export default withStyles(styles)(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(HardwareHealth)
);
