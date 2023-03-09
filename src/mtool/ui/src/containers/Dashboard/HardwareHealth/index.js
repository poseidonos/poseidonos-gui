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
import { ArrowBack, ArrowUpward } from "@material-ui/icons";
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
        display: "flex",
        padding: theme.spacing(1, 2),
        flexWrap: "wrap",
        alignItems: "flex-end",
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
    },
    tableHeader: {
        ...customTheme.table.header,
        padding: 8,
        paddingLeft: theme.spacing(2),
        width: "-webkit-fill-available",
    },
    borderSolid: {
        border: "1px solid #0001",
    },
    marginAuto: {
        margin: "auto"
    },
    summaryButton: {
        marginBottom: 8,
    }
});

const TOTAL = "Summary"
const IPMI = "IPMI";
const DEVICE = "Device";
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
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedTable, setSelectedTable] = useState("");
    const [pieChart, setPieChart] = useState({
        title: TOTAL,
        criticals: props.totalCriticals,
        warnings: props.totalWarnings,
        nominals: props.totalNominals,
        metrics: [],
        unit: "",
    });
    const [ipmiErrorMessage, setIpmiErrorMessage] = useState("No records to display");
    const deviceErrorMessage = props.errorInDevices ? "Please Check POS Exporter" : "No records to display";

    useEffect(() => {
        if (isConfigured)
            fetchHardwareHealth();
        const interval = setInterval(() => {
            if (isConfigured)
                fetchHardwareHealth();
        }, FETCH_API_INTERVAL);

        return () => clearInterval(interval)
    }, [isConfigured, fetchHardwareHealth]);

    useEffect(() => {
        if (selectedRow === null)
            setPieChart({
                title: TOTAL,
                criticals: props.totalCriticals,
                warnings: props.totalWarnings,
                nominals: props.totalNominals,
                metrics: [],
                unit: "",
            })
    }, [props.totalCriticals, props.totalWarnings, props.totalNominals, selectedRow])

    useEffect(() => {
        if (!props.isIMPIChassisPowerOn)
            setIpmiErrorMessage("IPMI Power is OFF")
        if (props.errorInIMPI)
            setIpmiErrorMessage("Please Check IPMI Exporter")
    }, [props.isIMPIChassisPowerOn, props.errorInIMPI])
    const getPercentage = (value) => {
        const total = pieChart.criticals + pieChart.nominals + pieChart.warnings;
        return Math.round(value * 1000 / total) / 10;
    }
    /* eslint-disable react/no-multi-comp */
    const icons = {
        SortArrow: ArrowUpward,
    };
    const ipmiTableColumns = [
        {
            title: "IPMI",
            cellStyle: {
                ...localCellStyle,
                width: 130,
            },
            field: "type",
            customSort: (a, b) => (a.type.localeCompare(b.type))
        },
        {
            title: "Criticals",
            cellStyle: localCellStyle,
            render: (rowData) => <Typography style={rowData.criticals ? getDarkColorStyle[CRITICAL] : {}}>{rowData.criticals}</Typography>,
            customSort: (a, b) => (a.criticals - b.criticals)
        },
        {
            title: "Warnings",
            cellStyle: localCellStyle,
            render: (rowData) => <Typography style={rowData.warnings ? getDarkColorStyle[WARNING] : {}}>{rowData.warnings}</Typography>,
            customSort: (a, b) => (a.warnings - b.warnings)
        },
        {
            title: "Nominals",
            cellStyle: localCellStyle,
            render: (rowData) => <Typography style={rowData.nominals ? getDarkColorStyle[NOMINAL] : {}}>{rowData.nominals}</Typography>,
            customSort: (a, b) => (a.nominals - b.nominals)
        }
    ];
    const deviceTableColumns = [
        {
            title: "Device",
            cellStyle: {
                ...localCellStyle,
                width: 130,
            },
            field: "type",
            customSort: (a, b) => (a.type.localeCompare(b.type))
        },
        {
            title: "Criticals",
            cellStyle: localCellStyle,
            render: (rowData) => <Typography style={rowData.criticals ? getDarkColorStyle[CRITICAL] : {}}>{rowData.criticals}</Typography>,
            customSort: (a, b) => (a.criticals - b.criticals)
        },
        {
            title: "Warnings",
            cellStyle: localCellStyle,
            render: (rowData) => <Typography style={rowData.warnings ? getDarkColorStyle[WARNING] : {}}>{rowData.warnings}</Typography>,
            customSort: (a, b) => (a.warnings - b.warnings)
        },
        {
            title: "Nominals",
            cellStyle: localCellStyle,
            render: (rowData) => <Typography style={rowData.nominals ? getDarkColorStyle[NOMINAL] : {}}>{rowData.nominals}</Typography>,
            customSort: (a, b) => (a.nominals - b.nominals)
        }
    ];
    const healthTableColumns = [
        {
            title: "Name",
            cellStyle: {
                ...localCellStyle,
                width: 130,
            },
            field: "name",
            customSort: (a, b) => (a.type.localeCompare(b.type))
        },
        {
            title: pieChart.unit !== "" ? `Value (${pieChart.unit})` : "Value",
            cellStyle: localCellStyle,
            render: (rowData) => <Typography style={getDarkColorStyle[rowData.state]}>{rowData.value}</Typography>,
            customSort: (a, b) => stateOrder[a.state] - stateOrder[b.state]
        },
    ];
    const ipmiTable = (
        <MaterialTable
            columns={ipmiTableColumns}
            data={!props.errorInIMPI && props.isIMPIChassisPowerOn && props.isConfigured ? props.ipmi : []}
            localization={{
                body: {
                    emptyDataSourceMessage: ipmiErrorMessage
                }
            }}
            onRowClick={((e, localSelectedRow) => {
                setSelectedTable(IPMI);
                setSelectedRow(localSelectedRow.tableData.id);
                const ipmi = props.ipmi[localSelectedRow.tableData.id];
                setPieChart({
                    ...pieChart,
                    title: ipmi.type,
                    criticals: ipmi.criticals,
                    warnings: ipmi.warnings,
                    nominals: ipmi.nominals,
                    metrics: ipmi.metrics,
                    unit: ipmi.unit
                })
            }
            )}
            options={{
                headerStyle: {
                    ...customTheme.table.header,
                    fontSize: 12,
                    paddingRight: 0,
                },
                search: false,
                sorting: true,
                paging: false,
                rowStyle: rowData => ({
                    backgroundColor: (selectedTable === IPMI && selectedRow === rowData.tableData.id) && '#EEE'
                })
            }}
            components={{
                Toolbar: () => <></>,
            }}
            style={{
                width: "100%",
                height: "226px",
                boxShadow: "none",
                border: "1px solid rgb(0 0 0 / 12%)"
            }}
            icons={icons}
        />
    );
    const deviceTable = (
        <MaterialTable
            columns={deviceTableColumns}
            data={!props.errorInDevices && props.isConfigured ? props.devices : []}
            localization={{
                body: {
                    emptyDataSourceMessage: deviceErrorMessage
                }
            }}
            onRowClick={((e, localSelectedRow) => {
                setSelectedTable(DEVICE);
                setSelectedRow(localSelectedRow.tableData.id);
                const device = props.devices[localSelectedRow.tableData.id];
                setPieChart({
                    ...pieChart,
                    title: device.type,
                    criticals: device.criticals,
                    warnings: device.warnings,
                    nominals: device.nominals,
                    metrics: device.metrics,
                    unit: device.unit
                })
            }
            )}
            options={{
                headerStyle: {
                    ...customTheme.table.header,
                    fontSize: 12,
                    paddingRight: 0,
                },
                search: false,
                sorting: true,
                paging: false,
                rowStyle: rowData => ({
                    backgroundColor: (selectedTable === DEVICE && selectedRow === rowData.tableData.id) && '#EEE'
                })
            }}
            components={{
                Toolbar: () => <></>
            }}
            style={{
                width: "100%",
                height: "113px",
                boxShadow: "none",
                border: "1px solid rgb(0 0 0 / 12%)",
            }}
            icons={icons}
        />
    );
    const healthTable = (
        <MaterialTable
            columns={healthTableColumns}
            components={{
                Toolbar: () => <></>
            }}
            data={pieChart.metrics}
            icons={icons}
            options={{
                headerStyle: customTheme.table.header,
                search: false,
                sorting: true,
                paging: false,
            }}
            style={{
                width: "100%",
                maxHeight: 300,
                boxShadow: "none",
                border: "1px solid rgb(0 0 0 / 12%)",
                overflow: "scroll"
            }}
        />
    );
    const pieChartBox = props.isConfigured && (pieChart.criticals + pieChart.warnings + pieChart.nominals) !== 0 ?
        (
            <Box
                sx={{ mt: 4, mb: "auto", width: "100%" }}
                display="flex"
                flexDirection="column"
            >
                <PieChart
                    animate
                    animationDuration={500}
                    data={[
                        { title: CRITICAL, value: pieChart.criticals, color: customTheme.palette.error.main },
                        { title: WARNING, value: pieChart.warnings, color: customTheme.palette.warning.main },
                        { title: NOMINAL, value: pieChart.nominals, color: customTheme.palette.success.main },
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
                        width: "80%",
                        height: "80%",
                        maxHeight: 160,
                        padding: 2,
                        alignSelf: "center",
                        marginBottom: "auto"
                    }}
                />
                {getPercentage(pieChart.nominals) < 5 && getPercentage(pieChart.nominals) !== 0 &&
                    (
                        <Legend
                            bgColor={customTheme.palette.success.main}
                            title="Nominals"
                            value={`${getPercentage(pieChart.nominals)}%`}
                        />
                    )
                }
                {getPercentage(pieChart.warnings) < 5 && getPercentage(pieChart.warnings) !== 0 &&
                    (
                        <Legend
                            bgColor={customTheme.palette.warning.main}
                            title="Warnings"
                            value={`${getPercentage(pieChart.warnings)}%`}
                        />
                    )
                }
                {getPercentage(pieChart.criticals) < 5 && getPercentage(pieChart.criticals) !== 0 &&
                    (
                        <Legend
                            bgColor={customTheme.palette.error.main}
                            title="Criticals"
                            value={`${getPercentage(pieChart.criticals)}%`}
                        />
                    )
                }
                {pieChart.title !== TOTAL &&
                    (
                        <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            className={classes.marginAuto}
                            onClick={() => setShowHealthTable(!showHealthTable)}
                        >
                            View Details
                        </Button>
                    )
                }
            </Box>
        ) :
        <Typography className={classes.marginAuto}>No Data to plot PieChart</Typography>;
    const summaryButton = pieChart.title !== TOTAL &&
        (
            <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={() => {
                    setSelectedRow(null);
                    setPieChart({
                        ...pieChart,
                        title: TOTAL,
                        criticals: props.totalCriticals,
                        warnings: props.totalWarnings,
                        nominals: props.totalNominals
                    });
                }}
                className={classes.summaryButton}
                data-testid="hw-summary-button"
                aria-label="Summary"
            >
                <ArrowBack /> Summary
            </Button>
        );

    return (
        <ThemeProvider theme={PageTheme}>
            <Paper className={classes.hardwareHealthPaper}>
                <Grid item container xs={12} justifyContent="flex-start">
                    <Typography className={classes.cardHeader} variant="h2">
                        Hardware Health
                    </Typography>
                </Grid>
                <Grid item container xs={12} justifyContent="center">
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
                <Grid item container xs={12} md={4}
                    direction="column"
                    justifyContent="space-between"
                    alignItems="center"
                    className={`${classes.tableHeight} ${classes.borderSolid}`}
                >
                    <Typography
                        color="secondary"
                        className={classes.tableHeader}
                    >
                        {pieChart.title}
                    </Typography>
                    {pieChartBox}
                    {summaryButton}
                </Grid>
                <Grid item sm={12} md={8} className={classes.tableHeight}>
                    {ipmiTable}
                    {deviceTable}
                </Grid>
            </Paper>
            <Popup
                title={`${selectedTable} ${pieChart.title}`}
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
        ipmi: state.dashboardReducer.ipmi,
        errorInDevices: state.dashboardReducer.errorInDevices,
        errorInIMPI: state.dashboardReducer.errorInIMPI,
        totalNominals: state.dashboardReducer.totalNominals,
        totalWarnings: state.dashboardReducer.totalWarnings,
        totalCriticals: state.dashboardReducer.totalCriticals,
        isIMPIChassisPowerOn: state.dashboardReducer.isIMPIChassisPowerOn,
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
