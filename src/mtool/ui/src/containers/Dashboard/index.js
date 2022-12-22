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
import MaterialTable from "material-table";
import "react-dropdown/style.css";
import "react-table/react-table.css";
import "core-js/es/number";
import "core-js/es/array";
import { Paper, Grid, Typography, Link, Select, FormControl, InputLabel, MenuItem, Zoom, Button, IconButton, Tabs, Tab, Box } from "@material-ui/core";
import { withStyles, MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles';
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import { Edit } from "@material-ui/icons";

import VolumeIconSelected from '../../assets/images/Volume-Icon-SEL.png';
import ArraysIconSelected from '../../assets/images/Arrays-SEL.png';
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
import HardwareHealth from "./HardwareHealth";


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
    tabIcon: {
      height: 18,
      marginRight: theme.spacing(1)
    },
    arrayTabIcon: {
      height: 24,
      marginRight: theme.spacing(.5)
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

const getUsedSpace = (total, remain) => {
  if (Number.isNaN(remain)) {
    return formatBytes(0);
  }

  return formatBytes(total - remain);
}

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


// eslint-disable-next-line react/no-multi-comp
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
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

  render() {
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
    const storage = (
      <Paper className={classes.storageDetailsPaper}>
        <Grid item container xs={12} justifyContent="flex-start">
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
        <Grid className={classes.tabs}>
          <Tabs
            value={this.state.selectedTab}
            onChange={(e, newVal) => this.setState({ selectedTab: newVal })}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="secondary tabs example"
            centered
          >
            <Tab
              className={classes.tab}
              value={ARRAYTAB}
              label={(
                <Box display="flex" alignItems="center">
                  <img
                    className={classes.arrayTabIcon}
                    src={ArraysIconSelected}
                    alt="l"
                    style={this.state.selectedTab === ARRAYTAB ? { opacity: ".8" } : { opacity: ".3" }}
                  />
                  <Typography>{this.props.arrays.length} Arrays</Typography>
                </Box>
              )}
              data-testid="array-tab"
            />
            <Tab
              className={classes.tab}
              value={VOLUMETAB}
              label={(
                <Box display="flex" alignItems="center">
                  <img
                    className={classes.tabIcon}
                    src={VolumeIconSelected}
                    alt="l"
                    style={this.state.selectedTab === VOLUMETAB ? { opacity: ".8" } : { opacity: ".3" }}
                  />
                  <Typography>{this.props.arrayVolumes.length} Volumes</Typography>
                </Box>
              )}
              data-testid="volume-tab"
            />
          </Tabs>
        </Grid>
        <Grid className={classes.borderSolid}>
          {this.state.selectedTab === ARRAYTAB ? arrayTable : volumeTable}
        </Grid>
      </Paper>
    );
    return (
      <ThemeProvider theme={PageTheme}>
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
                  <HardwareHealth />
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
