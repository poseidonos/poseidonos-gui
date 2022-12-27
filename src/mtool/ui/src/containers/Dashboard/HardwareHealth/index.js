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
import MaterialTable from "material-table";
import { ArrowBack, ArrowUpward } from "@material-ui/icons";
import { Box, Button, Grid, Paper, ThemeProvider, Typography, withStyles } from "@material-ui/core";
import { customTheme, PageTheme } from "../../../theme";
import Legend from "../../../components/Legend";
import Popup from "../../../components/Popup";


const styles = (theme) => ({
    hardwareHealthPaper: {
        marginTop: theme.spacing(1),
        height: 406,
        display: "flex",
        padding: theme.spacing(1, 2),
        flexWrap: "wrap",
        alignItems: "flex-end"
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
        backgroundColor: "#788595",
        color: "#FFF",
        padding: 5,
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
        alignItems: "flex-start",
    }
});

const TOTAL = "Summary"
const IPMI = "IPMI";
const DEVICE = "Device";
const CRITICAL = "critical";
const WARNING = "warning";
const NOMINAL = "nominal";
const stateOrder = { [CRITICAL]: 1, [WARNING]: 2, [NOMINAL]: 3 };
const getColorStyle = {
    [CRITICAL]: { color: customTheme.palette.error.main },
    [WARNING]: { color: customTheme.palette.warning.main },
    [NOMINAL]: { color: customTheme.palette.success.main }
}

const HardwareHealth = (props) => {
    const { classes } = props;
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

    const getPercentage = (value) => {
        const total = pieChart.criticals + pieChart.nominals + pieChart.warnings;
        return Math.round(value * 1000 / total) / 10;
    }
    let ipmiErrorMessage = "No records to display";
    if (!props.isIMPIChassisPowerOn)
        ipmiErrorMessage = "IPMI Power is OFF"
    if (props.errorInIMPI)
        ipmiErrorMessage = "Please Check IPMI Exporter"

    const deviceErrorMessage = props.errorInDevices ? "Please Check POS Exporter" : "No records to display";

    /* eslint-disable react/no-multi-comp */
    const icons = {
        // FirstPage: () => <FirstPage id="Dashboard-icon-vol-firstpage" />,
        // LastPage: () => <LastPage id="Dashboard-icon-vol-lastpage" />,
        // NextPage: () => <ChevronRight id="Dashboard-icon-vol-nextpage" />,
        // PreviousPage: () => <ChevronLeft id="Dashboard-icon-vol-previouspage" />,
        // ThirdStateCheck: Remove,
        // DetailPanel: ChevronRight,
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
            render: (rowData) => <Typography style={rowData.criticals ? getColorStyle[CRITICAL] : {}}>{rowData.criticals}</Typography>,
            customSort: (a, b) => (a.criticals - b.criticals)
        },
        {
            title: "Warnings",
            cellStyle: localCellStyle,
            render: (rowData) => <Typography style={rowData.warnings ? getColorStyle[WARNING] : {}}>{rowData.warnings}</Typography>,
            customSort: (a, b) => (a.warnings - b.warnings)
        },
        {
            title: "Nominals",
            cellStyle: localCellStyle,
            render: (rowData) => <Typography style={rowData.nominals ? getColorStyle[NOMINAL] : {}}>{rowData.nominals}</Typography>,
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
            render: (rowData) => <Typography style={rowData.criticals ? getColorStyle[CRITICAL] : {}}>{rowData.criticals}</Typography>,
            customSort: (a, b) => (a.criticals - b.criticals)
        },
        {
            title: "Warnings",
            cellStyle: localCellStyle,
            render: (rowData) => <Typography style={rowData.warnings ? getColorStyle[WARNING] : {}}>{rowData.warnings}</Typography>,
            customSort: (a, b) => (a.warnings - b.warnings)
        },
        {
            title: "Nominals",
            cellStyle: localCellStyle,
            render: (rowData) => <Typography style={rowData.nominals ? getColorStyle[NOMINAL] : {}}>{rowData.nominals}</Typography>,
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
            render: (rowData) => <Typography style={getColorStyle[rowData.state]}>{rowData.value}</Typography>,
            customSort: (a, b) => stateOrder[a.state] - stateOrder[b.state]
        },
    ];
    const ipmiTable = (
        <MaterialTable
            columns={ipmiTableColumns}
            data={props.ipmi}
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
                    backgroundColor: "#788595",
                    color: "#FFF",
                    paddingTop: 8,
                    paddingBottom: 8,
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
                boxShadow: "none",
                border: "1px solid rgb(0 0 0 / 12%)"
            }}
            icons={icons}
        />
    );
    const deviceTable = (
        <MaterialTable
            columns={deviceTableColumns}
            data={props.devices}
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
                    backgroundColor: "#788595",
                    color: "#FFF",
                    paddingTop: 8,
                    paddingBottom: 8,
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
                headerStyle: {
                    backgroundColor: "#788595",
                    color: "#FFF",
                    paddingTop: 8,
                    paddingBottom: 8,
                    paddingRight: 0,
                },
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
    const pieChartBox = (pieChart.criticals + pieChart.warnings + pieChart.nominals) !== 0 ?
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
                            color="primary"
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
            >
                <ArrowBack /> Summary
            </Button>
        )
    return (
        <ThemeProvider theme={PageTheme}>
            <Paper className={classes.hardwareHealthPaper}>
                <Grid item container xs={12} justifyContent="flex-start">
                    <Typography className={classes.cardHeader}>
                        Hardware Health
                    </Typography>
                </Grid>
                <Grid item container xs={12} justifyContent="center">
                    {/* <Typography
                        color="secondary"
                        variant="h6"
                        style={{
                            marginTop: 4
                        }}
                    >
                        Total
                    </Typography> */}
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
                        variant="h6"
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
    };
};

export default withStyles(styles)(
    connect(
        mapStateToProps
    )(HardwareHealth)
);
