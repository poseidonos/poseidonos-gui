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

import React, { Component } from "react";
import io from "socket.io-client";
import { connect } from "react-redux";
import MaterialTable, { MTableBodyRow } from "material-table";
import { PieChart } from 'react-minimal-pie-chart';
import "react-dropdown/style.css";
import "react-table/react-table.css";
import "core-js/es/number";
import "core-js/es/array";
import { Paper, Grid, Typography, Link, Select, FormControl, InputLabel, MenuItem, Zoom, Button, IconButton, Tabs, Tab, Box, Tooltip } from "@material-ui/core";
import { withStyles, MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles';
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import { ArrowBack, Edit } from "@material-ui/icons";

import formatBytes from "../../utils/format-bytes";
import { customTheme, PageTheme } from "../../theme";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import Legend from "../../components/Legend";
import LightTooltip from "../../components/LightTooltip";
import Dialog from "../../components/Dialog";
import TelemetryForm from "../../components/TelemetryForm";
import * as actionTypes from "../../store/actions/actionTypes";
import * as actionCreators from "../../store/actions/exportActionCreators";
import { BYTE_FACTOR } from "../../utils/constants";


const styles = (theme) => {
  return {
    dashboardContainer: {
      display: "flex",
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(1),
      paddingLeft: "35px",
      paddingRight: "35px",
      width: "100%",
      boxSizing: "border-box",
    },
    toolbar: customTheme.toolbar,
    titleContainer: {
      marginTop: theme.spacing(1),
    },
    pageHeader: customTheme.page.title,
    mainGridContainer: {
      [theme.breakpoints.up("xl")]: {
        flexDirection: "column"
      }
    },
    performanceGridItem: {
      [theme.breakpoints.up("xl")]: {
        flexBasis: "fit-content"
      }
    },
    metricsPaper: {
      display: "flex",
      padding: theme.spacing(1, 2),
      paddingBottom: 0,
      flexWrap: "wrap",
    },
    metricContainer: {
      paddingBottom: theme.spacing(1),
      alignItems: "center",
      justifyContent: "center",
    },
    metricBox: {
      borderBottom: "2px solid #F1F0F5",
      [theme.breakpoints.down("lg")]: {
        borderRight: "4px solid #F1F0F5",
        borderBottom: "none"
      },
      [theme.breakpoints.down("md")]: {
        borderRight: "none",
        borderBottom: "2px solid #F1F0F5",
      },
      [theme.breakpoints.down("sm")]: {
        borderRight: "4px solid #F1F0F5",
        borderBottom: "none"
      },
      [theme.breakpoints.down("xs")]: {
        borderRight: "none",
        borderBottom: "2px solid #F1F0F5",
      },
    },
    writeColor: {
      height: "40px",
      textAlign: "center",
      color: "rgba(58, 108, 255, 1)",
    },
    readColor: {
      height: "40px",
      textAlign: "center",
      color: "rgba(125, 106, 181, 1)",
    },
    posInfoPaper: {
      height: 120,
      display: "flex",
      padding: theme.spacing(1, 2),
      paddingBottom: 0,
      flexWrap: "wrap",
      [theme.breakpoints.up("xl")]: {
        height: "auto",
      },
      [theme.breakpoints.down("md")]: {
        height: "auto",
      },
    },
    ipContainer: {
      padding: theme.spacing(1, 0),
      alignItems: "center",
      justifyContent: "center",
    },
    storageDetailsPaper: {
      height: "fit-content",
      padding: theme.spacing(1, 2)
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
      backgroundColor: "#E0E0E0"
    },
    tab: {
      fontSize: 14,
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
    hardwareHealthPaper: {
      marginTop: theme.spacing(1),
      height: 406,
      display: "flex",
      padding: theme.spacing(1, 2),
      flexWrap: "wrap",
      alignItems: "flex-end"
    },
    tableHeight: {
      height: 344,
    },
    tableTitle: {
      height: '46px',
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: theme.spacing(0, 2),
    },
    tooltip: {
      backgroundColor: "white",
      opacity: 1,
      color: "rgba(0, 0, 0, 1)",
      maxHeight: 300,
      fontSize: theme.typography.pxToRem(12),
      border: "1px solid #dadde9",
      "& b": {
        fontWeight: theme.typography.fontWeightMedium,
      },
    },
    tableHeader: {
      backgroundColor: "#788595",
      color: "#FFF",
      padding: 5,
      paddingLeft: theme.spacing(2),
      width: "-webkit-fill-available",
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
    cardHeader: {
      ...customTheme.card.header,
      marginLeft: 0,
      marginBottom: 0,
      paddingTop: 0
    },
    textOverflow: {
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
    },
    ipText: {
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
      textAlign: "left"
    },
    ipBorder: {
      borderRight: "2px solid lightgray",
      marginRight: theme.spacing(1)
    },
    metricText: {
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
      textAlign: "left",
      paddingLeft: theme.spacing(2),
      marginTop: theme.spacing(2.5),
      [theme.breakpoints.down("xs")]: {
        marginTop: theme.spacing(1.5),
      },
    },
    arraySelect: {
      textAlign: "center",
      minWidth: 100
    },
    borderSolid: {
      border: "1px solid #0001",
    }
  };
};

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

// namespace to connect to the websocket for multi-volume creation
const healthStatusSocketEndPoint = ":5000/health_status";

const ARRAYTAB = "arrayTab";
const VOLUMETAB = "volumeTab";
const CRITICAL = "critical";
const WARNING = "warning";
const NOMINAL = "nominal";
const TOTAL = "Summary"

const stateOrder = { [CRITICAL]: 1, [WARNING]: 2, [NOMINAL]: 3 };
const statesOrder = {
  [CRITICAL + CRITICAL]: 1,
  [CRITICAL + WARNING]: 2,
  [WARNING + CRITICAL]: 3,
  [CRITICAL + NOMINAL]: 4,
  [NOMINAL + CRITICAL]: 5,
  [WARNING + WARNING]: 6,
  [WARNING + NOMINAL]: 7,
  [NOMINAL + WARNING]: 8,
  [NOMINAL + NOMINAL]: 9
};

const getUsedSpace = (total, remain) => {
  if (Number.isNaN(remain)) {
    return formatBytes(0);
  }

  return formatBytes(total - remain);
}

const getColorStyle = (state) => (
  state === CRITICAL ?
    { color: "rgba(255, 62, 0)" } :
    state === WARNING ?
      { color: "rgba(255, 186, 0)" } :
      { color: "rgba(0, 186, 0)" }
)

const MetricsCard = ({ classes, header, writeValue, readValue }) => {
  return (
    <Paper className={classes.metricsPaper}>
      <Grid item container xs={12} justifyContent="space-between">
        <Typography className={classes.cardHeader}>
          {header}
        </Typography>
      </Grid>
      <Grid item container xs={12} sm={6} md={12} lg={6} xl={12} className={classes.metricContainer}>
        <Grid item xs={4}>
          <Typography
            align="center"
            className={classes.textOverflow}
            color={writeValue ? "secondary" : "primary"}
            variant="h6"
          >
            Write
          </Typography>
        </Grid>
        <Grid
          item
          xs={8}
          className={classes.metricBox}
        >
          <Typography
            variant={writeValue ? "h4" : "h6"}
            data-testid={`write-${header.toLowerCase()}`}
            color="secondary"
            className={classes.writeColor}
          >
            {writeValue !== 0 ? writeValue : "___"}
          </Typography>
        </Grid>
      </Grid>
      <Grid item container xs={12} sm={6} md={12} lg={6} xl={12} className={classes.metricContainer}>
        <Grid item xs={4}>
          <Typography
            align="center"
            className={classes.textOverflow}
            color={readValue ? "secondary" : "primary"}
            variant="h6"
          >
            Read
          </Typography>
        </Grid>
        <Grid
          item
          xs={8}
        >
          <Typography
            variant={readValue ? "h4" : "h6"}
            data-testid={`read-${header.toLowerCase()}`}
            className={classes.readColor}
          >
            {readValue !== 0 ? readValue : "___"}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  )
}

const BMCMetric = ({ classes, name, value, state }) => {
  return (
    <>
      <Grid key={name} item xs={6} sm={3} md={6} container alignItems="center" justifyContent="flex-start">
        <Typography
          className={classes.metricText}
          color="secondary"
        >
          {name}
        </Typography>
      </Grid>
      <Grid key={value} item xs={6} sm={3} md={6} container alignItems="center" justifyContent="flex-start">
        <Typography
          color="secondary"
          data-testid="dashboard-ip"
          className={classes.metricText}
          style={getColorStyle(state)}
        >
          {value}
        </Typography>
      </Grid>
    </>
  )
}


// eslint-disable-next-line react/no-multi-comp
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      healthData: [],
      pieChart: {
        title: TOTAL,
        totalCriticals: this.props.totalCriticals,
        totalWarnings: this.props.totalWarnings,
        totalNominals: this.props.totalNominals
      },
      selectedTable: "device",
      selectedRow: null,
      selectedTab: ARRAYTAB,
      mobileOpen: false,
      healthStatusSocket: io(healthStatusSocketEndPoint, {
        transports: ["websocket"],
        query: {
          "x-access-token": localStorage.getItem("token"),
        },
      }),
    };
    this.interval = null;
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    this.selectArray = this.selectArray.bind(this);
    this.getPercentage = this.getPercentage.bind(this);
  }

  componentDidMount() {
    if (this.props.isConfigured)
      this.props.fetchCheckTelemetry();
    this.props.getConfig();
    this.props.fetchVolumes();
    this.props.fetchArrays();
    this.props.fetchPerformance();
    this.props.fetchHardwareHealth();
    this.props.fetchIpAndMacInfo();
    this.props.enableFetchingAlerts(true);
    this.interval = setInterval(() => {
      if (this.props.isConfigured) {
        this.props.fetchPerformance();
        this.props.fetchHardwareHealth();
      }
    }, 2000);
  }

  componentDidUpdate(prevProps) {
    if (this.props.isConfigured && this.props.telemetryIP !== prevProps.telemetryIP)
      this.props.fetchCheckTelemetry();
    if (this.props.totalCriticals !== prevProps.totalCriticals ||
      this.props.totalWarnings !== prevProps.totalWarnings ||
      this.props.totalNominals !== prevProps.totalNominals)
      this.setState({
        ...this.state,
        pieChart: {
          ...this.state.pieChart,
          totalCriticals: this.props.totalCriticals,
          totalWarnings: this.props.totalWarnings,
          totalNominals: this.props.totalNominals
        }
      })
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    this.state.healthStatusSocket.disconnect();
  }

  handleDrawerToggle() {
    this.setState({
      mobileOpen: !this.state.mobileOpen,
    });
  }

  selectArray(event) {
    const { value } = event.target;
    this.props.selectArray(value);
  }

  // shouldComponentUpdate(nextProps) {
  //   if (
  //     JSON.stringify(this.props.devices) === JSON.stringify(nextProps.devices) &&
  //     JSON.stringify(this.props.bmc) === JSON.stringify(nextProps.bmc) &&
  //     this.props.totalCriticals === nextProps.totalCriticals &&
  //     this.props.totalWarnings === nextProps.totalWarnings &&
  //     this.props.totalNominals === nextProps.totalNominals
  //   )
  //     return true;
  //   return false;
  // }

  getPercentage(value) {
    const total = this.state.pieChart.totalCriticals + this.state.pieChart.totalNominals + this.state.pieChart.totalWarnings;
    return Math.round(value * 1000 / total) / 10;
  }

  render() {
    console.log("In Dashboard render")
    let volUsedSpace = 0;
    let volSpace = 0;
    const { classes } = this.props;
    this.props.volumes.forEach((vol) => {
      volUsedSpace += Number(vol.total) - (
        vol.remain === undefined ? Number(vol.total) : Number(vol.remain)
      );
      volSpace += Number(vol.total);
    });
    const volFilledStyle = {
      width: `${(volSpace * 100) / this.props.arraySize}%`,
      height: "100%",
      backgroundColor: "#e0e0e0",
      float: "left",
    };
    const volUsedStyle = {
      width: `${(volUsedSpace * 100) / volSpace}%`,
      height: "100%",
      backgroundColor: "rgb(120,133,149)",
      float: "left",
    };
    const storageFreeStyle = {
      width: `${100 - (volSpace * 100) / this.props.arraySize}%`,
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
        render: (rowData) => this.props.arrayVolCount[rowData.arrayname] ? this.props.arrayVolCount[rowData.arrayname] : 0,
        customSort: (a, b) => (this.props.arrayVolCount[a.arrayname] - this.props.arrayVolCount[b.arrayname])
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
    const bmcTableColumns = [
      {
        title: "BMCMetrics",
        cellStyle: {
          ...localCellStyle,
          width: 130,
        },
        field: "type",
        customSort: (a, b) => (a.name.localeCompare(b.name))
      },
      {
        title: "Criticals",
        cellStyle: localCellStyle,
        render: (rowData) => <Typography style={rowData.critical_count ? getColorStyle(CRITICAL) : {}}>{rowData.critical_count}</Typography>,
        customSort: (a, b) => (a.name.localeCompare(b.name))
      },
      {
        title: "Warnings",
        cellStyle: localCellStyle,
        render: (rowData) => <Typography style={rowData.warning_count ? getColorStyle(WARNING) : {}}>{rowData.warning_count}</Typography>,
        customSort: (a, b) => (a.name.localeCompare(b.name))
      },
      {
        title: "Nominals",
        cellStyle: localCellStyle,
        render: (rowData) => <Typography style={rowData.nominal_count ? getColorStyle(NOMINAL) : {}}>{rowData.nominal_count}</Typography>,
        customSort: (a, b) => (a.name.localeCompare(b.name))
      }
    ];
    const deviceTableColumns = [
      {
        title: "DeviceMetrics",
        cellStyle: {
          ...localCellStyle,
          width: 130,
        },
        field: "type",
        customSort: (a, b) => (a.name.localeCompare(b.name))
      },
      {
        title: "Criticals",
        cellStyle: localCellStyle,
        render: (rowData) => <Typography style={rowData.critical_count ? getColorStyle(CRITICAL) : {}}>{rowData.critical_count}</Typography>,
        customSort: (a, b) => (a.name.localeCompare(b.name))
      },
      {
        title: "Warnings",
        cellStyle: localCellStyle,
        render: (rowData) => <Typography style={rowData.warning_count ? getColorStyle(WARNING) : {}}>{rowData.warning_count}</Typography>,
        customSort: (a, b) => (a.name.localeCompare(b.name))
      },
      {
        title: "Nominals",
        cellStyle: localCellStyle,
        render: (rowData) => <Typography style={rowData.nominal_count ? getColorStyle(NOMINAL) : {}}>{rowData.nominal_count}</Typography>,
        customSort: (a, b) => (a.name.localeCompare(b.name))
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
        customSort: (a, b) => (a.name.localeCompare(b.name))
      },
      {
        title: "Value",
        cellStyle: localCellStyle,
        render: (rowData) => <Typography style={getColorStyle(rowData.state)}>{rowData.value}</Typography>,
        customSort: (a, b) => stateOrder[a.state] - stateOrder[b.state]
      },
    ];
    const performance = (
      <>
        <Grid xs={12} md={4} item>
          <MetricsCard
            classes={classes}
            header="Bandwidth"
            writeValue={this.props.writeBW}
            readValue={this.props.readBW}
          />
        </Grid>
        <Grid xs={12} md={4} item>
          <MetricsCard
            classes={classes}
            header="IOPS"
            writeValue={this.props.writeIOPS}
            readValue={this.props.readIOPS}
          />
        </Grid>
        <Grid xs={12} md={4} item>
          <MetricsCard
            classes={classes}
            header="Latency"
            writeValue={this.props.writeLatency}
            readValue={this.props.readLatency}
          />
        </Grid>
      </>
    );
    const posInfo = (
      <Paper className={classes.posInfoPaper}>
        <Grid item container xs={12} justifyContent="space-between">
          <Typography className={classes.cardHeader}>
            IP Info
          </Typography>
        </Grid>
        <Grid item container sm={12} md={6} lg={12} xl={6} className={classes.ipContainer}>
          <Grid item xs={4}>
            <Typography
              color="primary"
              variant="h6"
              className={`${classes.ipText} ${classes.ipBorder}`}
            >
              PoseidonOS
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography
              color="secondary"
              data-testid="dashboard-ip"
              variant="h6"
              className={classes.ipText}
            >
              {this.props.ip === "0.0.0.0" ? "- . - . - . -" : this.props.ip}
            </Typography>
          </Grid>
        </Grid>
        <Grid item container sm={12} md={6} lg={12} xl={6} className={classes.ipContainer}>
          <Grid item xs={4}>
            <Typography
              color="primary"
              variant="h6"
              className={`${classes.ipText} ${classes.ipBorder}`}
            >
              Telemetry
            </Typography>
          </Grid>
          <Grid item xs={8} container>
            {this.props.telemetryIP && this.props.telemetryPort ?
              (
                <>
                  <Typography
                    className={classes.ipText}
                    data-testid="telemetry-ip"
                    variant="h6"
                  >
                    {this.props.telemetryIP}:{this.props.telemetryPort}
                    &nbsp;&nbsp;&nbsp;
                  </Typography>
                  <IconButton
                    size="small"
                    id="btn-edit-telemetry"
                    data-testid="btn-edit-telemetry"
                    onClick={() => this.props.setShowConfig(true)}
                  >
                    <Edit />
                  </IconButton>
                </>
              ) :
              (
                <Button
                  color="secondary"
                  variant="outlined"
                  id="btn-add-telemetry"
                  data-testid="btn-add-telemetry"
                  onClick={() => this.props.setShowConfig(true)}
                >
                  Add Telemetry API
                </Button>
              )
            }
          </Grid>
        </Grid>
      </Paper>
    );
    const arrayTable = (
      <MaterialTable
        components={{
          Toolbar: () => (
            <Grid className={classes.tableTitle}>
              <Typography variant="h6" color="secondary">
                Array Summary
              </Typography>
            </Grid>
          )
        }}
        columns={arrayTableColumns}
        data={this.props.arrays}
        options={{
          headerStyle: {
            backgroundColor: "#788595",
            color: "#FFF",
            paddingTop: 8,
            paddingBottom: 8
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
        isLoading={this.props.arrayLoading}
        icons={icons}
      />
    );
    const volumeTable = (
      <MaterialTable
        columns={volumeTableColumns}
        data={this.props.arrayVolumes}
        options={{
          headerStyle: {
            backgroundColor: "#788595",
            color: "#FFF",
            paddingTop: 8,
            paddingBottom: 8
          },
          minBodyHeight: 290,
          maxBodyHeight: 290,
          search: false,
          sorting: true
        }}
        components={{
          Toolbar: () => (
            <Grid className={classes.tableTitle}>
              <Typography variant="h6" color="secondary">
                Volume Summary
              </Typography>
              <FormControl className={classes.volumeUnit}>
                <InputLabel htmlFor="select-array">Array</InputLabel>
                <Select
                  value={this.props.selectedArray}
                  onChange={this.selectArray}
                  inputProps={{
                    id: "select-array",
                    "data-testid": "dashboard-array-select"
                  }}
                  data-testid="array-select"
                  className={classes.arraySelect}
                >
                  <MenuItem value="all">All</MenuItem>
                  {this.props.arrays.map((array) => (
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
    const ipmiTable = (
      <MaterialTable
        columns={bmcTableColumns}
        data={this.props.bmc}
        onRowClick={((e, selectedRow) =>
          this.setState({
            selectedTable: "ipmi",
            selectedRow: selectedRow.tableData.id
          })
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
          rowStyle: rowData => {
            (
              this.state.selectedRow === rowData.tableData.id &&
              this.state.selectedTable === "ipmi" && (
                this.state.pieChart.totalCriticals !== rowData.critical_count ||
                this.state.pieChart.totalWarnings !== rowData.warning_count ||
                this.state.pieChart.totalNominals !== rowData.nominal_count)) &&
              this.setState({
                pieChart: {
                  title: rowData.type,
                  totalCriticals: rowData.critical_count,
                  totalWarnings: rowData.warning_count,
                  totalNominals: rowData.nominal_count
                }
              })
            return {
              backgroundColor: (this.state.selectedTable === "ipmi" && this.state.selectedRow === rowData.tableData.id) && '#EEE'
            }
          }
        }}
        components={{
          Toolbar: () => <></>,
          Row: (props) => {
            return <Tooltip
              classes={{
                tooltip: classes.tooltip,
              }}
              title={(
                <MaterialTable
                  columns={healthTableColumns}
                  components={{
                    Toolbar: () => <></>
                  }}
                  data={props.data.metrics}
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
              )}
              interactive
              placement="right"
            >
              <MTableBodyRow {...props} />
            </Tooltip >
          }
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
        components={{
          Toolbar: () => <></>,
          Row: (props) => {
            return <Tooltip
              classes={{
                tooltip: classes.tooltip,
              }}
              title={(
                <MaterialTable
                  columns={healthTableColumns}
                  components={{
                    Toolbar: () => <></>
                  }}
                  data={props.data.metrics}
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
              )}
              interactive
              placement="right"
            >
              <MTableBodyRow {...props} />
            </Tooltip >
          }
        }}
        data={this.props.devices}
        icons={icons}
        onRowClick={((e, selectedRow) =>
          this.setState({
            selectedTable: "device",
            selectedRow: selectedRow.tableData.id
          })
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
          rowStyle: rowData => {
            (
              this.state.selectedRow === rowData.tableData.id &&
              this.state.selectedTable === "device" && (
                this.state.pieChart.totalCriticals !== rowData.critical_count ||
                this.state.pieChart.totalWarnings !== rowData.warning_count ||
                this.state.pieChart.totalNominals !== rowData.nominal_count)) &&
              this.setState({
                pieChart: {
                  title: rowData.type,
                  totalCriticals: rowData.critical_count,
                  totalWarnings: rowData.warning_count,
                  totalNominals: rowData.nominal_count
                }
              })
            return {
              backgroundColor: (this.state.selectedTable === "device" && this.state.selectedRow === rowData.tableData.id) && '#EEE'
            }
          }
        }}
        style={{
          width: "100%",
          boxShadow: "none",
          border: "1px solid rgb(0 0 0 / 12%)",
        }}
      />
    );
    const storage = (
      <Paper className={classes.storageDetailsPaper}>
        <Grid item container xs={12} justifyContent="flex-start" >
          <Typography className={classes.cardHeader}>
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
            {this.props.arraySize === 0 ? (
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
                    {formatBytes(this.props.arraySize)}
                  </span>
                </div>
                <Grid container wrap="wrap" justifyContent="flex-end">
                  <Legend
                    bgColor="rgb(120,133,149)"
                    title="Data Written"
                    value={formatBytes(volUsedSpace).replace(' ', '')}
                  />
                  <Legend
                    bgColor="#e0e0e0"
                    title="Volume Space Allocated"
                    value={formatBytes(volSpace).replace(' ', '')}
                  />
                  <Legend
                    bgColor="#fff"
                    title="Available for Volume Creation"
                    value={
                      formatBytes(
                        this.props.arraySize - volSpace >= BYTE_FACTOR * BYTE_FACTOR ?
                          this.props.arraySize - volSpace :
                          0
                      ).replace(' ', '')
                    }
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
        <Grid className={classes.tabs} >
          <Tabs
            value={this.state.selectedTab}
            onChange={(e, newVal) => this.setState({ selectedTab: newVal })}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="secondary tabs example"
            centered
          >
            <Tab className={classes.tab} value={ARRAYTAB} label={this.props.arrays.length + " Arrays"} />
            <Tab className={classes.tab} value={VOLUMETAB} label={this.props.arrayVolumes.length + " Volumes"} />
          </Tabs>
        </Grid>
        <Grid className={classes.borderSolid}>
          {this.state.selectedTab === ARRAYTAB ? arrayTable : volumeTable}
        </Grid>
      </Paper>
    );
    const hardwareHealth = (
      <Paper className={classes.hardwareHealthPaper}>
        <Grid item container xs={12} justifyContent="flex-start">
          <Typography className={classes.cardHeader}>
            Hardware Health
          </Typography>
        </Grid>
        <Grid item container xs={12}
          justifyContent="center"
        // alignItems="baseL"
        >
          <Legend
            bgColor="rgba(0, 186, 0, 0.6)"
            title="Nominals"
            value={this.props.totalNominals}
          />
          <Legend
            bgColor="rgba(255, 186, 0, 0.6)"
            title="Warnings"
            value={this.props.totalWarnings}
          />
          <Legend
            bgColor="rgba(255, 62, 0, 0.6)"
            title="Criticals"
            value={this.props.totalCriticals}
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
            {this.state.pieChart.title}
          </Typography>

          <Box
            sx={{ mt: 4, mb: "auto", width: "100%" }}
            display="flex"
            flexDirection="column"
          >
            <PieChart
              animate
              animationDuration={500}
              data={[
                { title: CRITICAL, value: this.state.pieChart.totalCriticals, color: "rgba(255,0,0,0.8)" },
                { title: WARNING, value: this.state.pieChart.totalWarnings, color: "orange" },
                { title: NOMINAL, value: this.state.pieChart.totalNominals, color: "rgba(102,214,102,0.8)" },
              ]}
              labelPosition={60}
              label={(data) => {
                const value = this.getPercentage(data.dataEntry.value);
                return value < 5 ? "" : value + "%";
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
            {this.getPercentage(this.state.pieChart.totalNominals) < 5 &&
              this.getPercentage(this.state.pieChart.totalNominals) !== 0 &&
              <Legend
                bgColor="rgba(0, 186, 0, 0.6)"
                title="Nominals"
                value={this.getPercentage(this.state.pieChart.totalNominals) + "%"}
              />
            }
            {this.getPercentage(this.state.pieChart.totalWarnings) < 5 &&
              this.getPercentage(this.state.pieChart.totalWarnings) !== 0 &&
              <Legend
                bgColor="rgba(255, 186, 0, 0.6)"
                title="Warnings"
                value={this.getPercentage(this.state.pieChart.totalWarnings) + "%"}
              />
            }
            {this.getPercentage(this.state.pieChart.totalCriticals) < 5 &&
              this.getPercentage(this.state.pieChart.totalCriticals) !== 0 &&
              <Legend
                bgColor="rgba(255, 62, 0, 0.6)"
                title="Criticals"
                value={this.getPercentage(this.state.pieChart.totalCriticals) + "%"}
              />
            }
            {this.state.pieChart.title !== TOTAL &&
              <Button
                variant="outlined"
                color="secondry"
                size="small"
                onClick={() => {
                  this.setState({
                    selectedRow: null,
                    pieChart: {
                      title: TOTAL,
                      totalCriticals: this.props.totalCriticals,
                      totalWarnings: this.props.totalWarnings,
                      totalNominals: this.props.totalNominals
                    }
                  })
                }}
                style={{
                  margin: "auto"
                }}
              >
                View Details
              </Button>
            }
          </Box>
          {this.state.pieChart.title !== TOTAL &&
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => {
                this.setState({
                  selectedRow: null,
                  pieChart: {
                    title: TOTAL,
                    totalCriticals: this.props.totalCriticals,
                    totalWarnings: this.props.totalWarnings,
                    totalNominals: this.props.totalNominals
                  }
                })
              }}
              style={{
                marginBottom: 8
              }}
            >
              <ArrowBack /> Summary
            </Button>
          }
        </Grid>
        <Grid item sm={12} md={8} className={classes.tableHeight}>
          {ipmiTable}
          {deviceTable}
        </Grid>
      </Paper>
    );
    return (
      <ThemeProvider theme={PageTheme} >
        <div className={classes.dashboardContainer}>
          <Header toggleDrawer={this.handleDrawerToggle} />
          <Sidebar
            mobileOpen={this.state.mobileOpen}
            toggleDrawer={this.handleDrawerToggle}
          />
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Grid container spacing={3}>
              <Grid container spacing={3} className={classes.titleContainer}>
                <Grid sm={6} xs={12} item>
                  <Typography className={classes.pageHeader} variant="h6">
                    Dashboard
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={1} className={classes.mainGridContainer}>
                <Grid xs={12} xl={8} item className={classes.performanceGridItem}>
                  <Grid container spacing={1}>
                    {performance}
                  </Grid>
                </Grid>
                <Grid xs={12} lg={6} xl={8} item>
                  {posInfo}
                  {hardwareHealth}
                </Grid>
                <Grid xs={12} lg={6} xl={4} item>
                  {storage}
                </Grid>
              </Grid>
            </Grid>
          </main>
          <Dialog
            title="Telemetry IP"
            description={this.props.errorMsg}
            type="alert"
            open={this.props.showTelemetryAlert}
            handleClose={() => this.props.closeTelemetryAlert()}
          />
          <TelemetryForm />
        </div>
      </ThemeProvider>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    volumes: state.dashboardReducer.volumes,
    arrayVolumes: state.dashboardReducer.arrayVolumes,
    selectedArray: state.dashboardReducer.selectedArray,
    arrays: state.storageReducer.arrays,
    arrayLoading: state.storageReducer.loading,
    alerts: state.dashboardReducer.alerts,
    ibofs: state.dashboardReducer.ibofs,
    showTelemetryAlert: state.dashboardReducer.showTelemetryAlert,
    errorMsg: state.dashboardReducer.errorMsg,
    readIOPS: state.dashboardReducer.readIOPS,
    writeIOPS: state.dashboardReducer.writeIOPS,
    readBW: state.dashboardReducer.readBW,
    writeBW: state.dashboardReducer.writeBW,
    readLatency: state.dashboardReducer.readLatency,
    writeLatency: state.dashboardReducer.writeLatency,
    devices: state.dashboardReducer.devices,
    bmc: state.dashboardReducer.bmc,
    totalNominals: state.dashboardReducer.totalNominals,
    totalWarnings: state.dashboardReducer.totalWarnings,
    totalCriticals: state.dashboardReducer.totalCriticals,
    poerState: state.dashboardReducer.poerState,
    fetchingAlerts: state.dashboardReducer.fetchingAlerts,
    ip: state.dashboardReducer.ip,
    arrayVolCount: state.dashboardReducer.arrayVols,
    mac: state.dashboardReducer.mac,
    lastUpdateTime: state.dashboardReducer.lastUpdateTime,
    host: state.dashboardReducer.host,
    arraySize: state.storageReducer.arraySize,
    cpuUsage: state.dashboardReducer.cpuUsage,
    memoryUsage: state.dashboardReducer.memoryUsage,
    latencyVal: state.dashboardReducer.latencyVal,
    latencyPer: state.dashboardReducer.latencyPer,
    cpuArcsLength: state.dashboardReducer.cpuArcsLength,
    memoryArcsLength: state.dashboardReducer.memoryArcsLength,
    latencyArcsLength: state.dashboardReducer.latencyArcsLength,
    telemetryIP: state.authenticationReducer.telemetryIP,
    telemetryPort: state.authenticationReducer.telemetryPort,
    isConfigured: state.authenticationReducer.isConfigured,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    fetchCheckTelemetry: () => dispatch({ type: actionTypes.SAGA_FETCH_CHECK_TELEMETRY }),
    closeTelemetryAlert: () => dispatch({ type: actionTypes.CLOSE_TELEMETRY_ALERT }),
    enableFetchingAlerts: (flag) => dispatch(actionCreators.enableFetchingAlerts(flag)),
    getConfig: () => dispatch({ type: actionTypes.SAGA_CHECK_CONFIGURATION }),
    fetchVolumes: () => dispatch({ type: actionTypes.SAGA_FETCH_VOLUME_INFO }),
    fetchArrays: () => dispatch({ type: actionTypes.SAGA_FETCH_ARRAY }),
    fetchPerformance: () => dispatch({ type: actionTypes.SAGA_FETCH_PERFORMANCE_INFO }),
    fetchHardwareHealth: () => dispatch({ type: actionTypes.SAGA_FETCH_HARDWARE_HEALTH }),
    fetchIpAndMacInfo: () => dispatch({ type: actionTypes.SAGA_FETCH_IPANDMAC_INFO }),
    selectArray: (array) => dispatch({ type: actionTypes.SELECT_ARRAY, array }),
    setShowConfig: payload => dispatch(actionCreators.setShowConfig(payload))
  };
};
export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(Dashboard)
);
