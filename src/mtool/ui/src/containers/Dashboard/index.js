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
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import "react-table/react-table.css";
import "core-js/es/number";
import "core-js/es/array";
import { Paper, Grid, Typography, Link, Select, FormControl, InputLabel, MenuItem } from "@material-ui/core";
import { withStyles, MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles';
import formatBytes from "../../utils/format-bytes";
import { customTheme, PageTheme } from "../../theme";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "./Dashboard.css";
import * as actionTypes from "../../store/actions/actionTypes";
import * as actionCreators from "../../store/actions/exportActionCreators";
import Legend from "../../components/Legend";
import HealthMetrics from "../../components/HealthMetrics";

const styles = (theme) => {
  return {
    dashboardContainer: {
      display: "flex",
    },
    storageDetailsPaper: {
      height: 250,
      position: "relative",
      marginTop: theme.spacing(1),
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
    tableContainer: {
      minHeight: "372px",
    },
    readMetric: {
      backgroundColor: "rgba(59, 189, 179,0.7)",
    },
    writeMetric: {
      backgroundColor: "rgba(58, 108, 255,0.6)",
    },
    totalMetric: {
      backgroundColor: "rgba(228, 148, 42,0.6)",
    },
    loadWrapper: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    metricContainer: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    posInfo: {
      padding: theme.spacing(1),
      height: 150,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      boxSizing: "border-box",
    },
    posInfoKey: {
      display: "inline-block",
      width: "40%",
    },
    posInfoText: {
      fontSize: 14,
      fontWeight: 560,
      color: "rgba(0, 0, 0, 0.7)",
      margin: `${theme.spacing(1)}px auto`,
      width: "100%",
      textAlign: "center",
    },
    volumeSummary: {
      minHeight: 413,
      [theme.breakpoints.down("md")]: {
        minHeight: 460,
      },
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
      "&:hover": {
        width: "auto",
        maxWidth: "calc(100% - 100px)",
        backgroundColor: "white",
        position: "absolute",
        marginTop: -theme.spacing(1),
        zIndex: 1000,
        overflow: "visible",
        wordBreak: "break-all"
      }
    },
    volumeContainer: {
      marginTop: theme.spacing(1),
    },
    metricBox: {
      display: "flex",
      alignItems: "center",
      width: "50%",
      height: "82.5px",
      justifyContent: "center",
      borderRadius: "10px",
      margin: "auto",
      [theme.breakpoints.down(1200)]: {
        width: "75%",
      },
    },
    storageGraph: {
      position: "absolute",
      height: "100%",
      top: 0,
    },
    metricTxt: {
      color: "#fff",
    },
    spaced: {
      marginTop: theme.spacing(1),
    },
    topGrid: {
      marginBottom: "-8px",
      marginTop: theme.spacing(1),
    },
    cardHeader: {
      ...customTheme.card.header,
      marginLeft: 0,
    },
    textRight: {
      textAlign: "right",
      marginRight: theme.spacing(1),
    },
    textLeft: {
      textAlign: "left",
      marginLeft: theme.spacing(1),
    },
    pageHeader: customTheme.page.title,
    textOverflow: {
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
    },
    volumeHeader: {
      minHeight: 64,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      paddingLeft: 24,
      paddingRight: 24,
    },
    arraySelect: {
      textAlign: "center",
      minWidth: 100
    },
    metricsPaper: {
      minHeight: 250,
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      marginTop: theme.spacing(1),
    },
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

/* eslint-enable react/no-multi-comp */

// Disabling for PoC1
// const alertIcons = {
//   ...icons,
//   FirstPage: () => <FirstPage id="Dashboard-alert-vol-firstpage" /> ,
//   LastPage: () => <LastPage id="Dashboard-alert-vol-lastpage" />,
//   NextPage: () => <ChevronRight id="Dashboard-alert-vol-nextpage" />,
//   PreviousPage: () => <ChevronLeft id="Dashboard-alert-vol-previouspage" />,
// };

// namespace to connect to the websocket for multi-volume creation
const healthStatusSocketEndPoint = ":5000/health_status";
// const healthStatusSocketEndPoint = "http://localhost:3000/health_status";

const getUsedSpace = (total, remain) => {

  if(Number.isNaN(remain)) {
    return formatBytes(0);
  }

  // if(remain > total) {
  //   return formatBytes(total);
  // }
  return formatBytes(total - remain);
}

// eslint-disable-next-line react/no-multi-comp
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: "",
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
    this.props.fetchVolumes();
    this.props.fetchArrays();
    this.props.fetchPerformance();
    this.props.fetchIpAndMacInfo();
    // this.props.fetchAlertsInfo();
    const today = new Date();
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const date = `${
      months[today.getMonth()]
      } ${today.getDate()}, ${today.getFullYear()},`;
    const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
    const dateTime = `${date} ${time}`;
    this.setState({ time: dateTime });
    this.props.enableFetchingAlerts(true);
    this.interval = setInterval(() => {
      this.props.fetchPerformance();
    }, 2000);
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
    const {value} = event.target;
    this.props.selectArray(value);
  }

  render() {
    let volUsedSpace = 0;
    let volSpace = 0;
    const { classes } = this.props;
    this.props.volumes.forEach((vol) => {
      volUsedSpace += Number(vol.total) - (
        Number.isNaN(vol.remain) ? 0 : Number(vol.remain)
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
      backgroundColor: "rgba(0, 186, 0,0.6)",
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
    const storageDangerStyle = {
      width: "10%",
      right: "0px",
      height: "100%",
      float: "right",
      position: "absolute",
      display: "inline-block",
      borderLeft: "2px solid rgb(255, 173, 173)",
    };

    // Disabling for PoC1
    // const alertColumns = [
    //   {
    //     title: 'Alert Name',
    //     field: 'alertName',
    //     sorting: false,
    //   },
    //   {
    //     title: 'Time Stamp',
    //     field: 'time',
    //     defaultSort: 'desc',
    //     sorting: false,
    //   },
    //   {
    //     title: 'Status',
    //     field: 'level',
    //     width: 100,
    //     sorting: false,
    //     render: row => {
    //       if (row.level === 'CRITICAL') {
    //         return <span style={{ color: 'red' }}>{row.level}</span>;
    //       }
    //       return <span style={{ color: 'green' }}>{row.level}</span>;
    //     },
    //   },
    //   {
    //     title: 'Description',
    //     field: 'message',
    //     sorting: false,
    //   },
    //   {
    //     title: 'Duration(sec)',
    //     field: 'duration',
    //     width: 150,
    //     sorting: false,
    //   },
    //  // {
    //   //  title: 'Node',
    //    // field: 'host',
    //     // sorting: false,
    //  // },
    // ];
    const arrayTableColumns = [
      {
        title: "Name",
        field: "arrayname",
        render: (rowData) => (
          <Link className={classes.volName} href={`/storage/array/manage?array=${rowData.arrayname}`}>{rowData.arrayname}</Link>
        )
      },
      {
        title: "RAID",
        render: (rowData) => `RAID ${rowData.RAIDLevel}`
      },
      {
        title: "Total Space",
        render: (rowData) => formatBytes(rowData.totalsize)
      },
      {
        title: "Number of Volumes",
        render: (rowData) => this.props.arrayVolCount[rowData.arrayname] ? this.props.arrayVolCount[rowData.arrayname] : 0
      }
    ];
    const volumeTableColumns = [
      {
        title: "Name",
        render: (rowData) => <Typography className={classes.volName}>{rowData.name}</Typography>
      },
      {
        title: "Used Space",
        render: (rowData) => getUsedSpace(rowData.total, rowData.remain)
      },
      {
        title: "Total Space",
        render: (rowData) => (rowData.total ? formatBytes(rowData.total) : formatBytes(0)),
      },
      {
        title: "Array",
        field: "array"
      }
    ];

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
              <Grid container spacing={1} className={classes.topGrid}>
                <Grid container spacing={1}>
                  <Grid xs={12} md={6} item>
                    <HealthMetrics
                      healthStatusSocket={this.state.healthStatusSocket}
                    />
                    {/* <Paper
                      spacing={3}
                      xs={6}
                      className={classes.healthMetricsPaper}
                    >
                      <Grid container justify="space-around">
                        {this.state.healthMetrics.map((metric) => (
                          <Grid
                            xs={10}
                            md={4} // currently, it is assumed that there are only 3 health metrics
                            justify="center"
                            className={classes.healthMetricContainer}
                            item
                            spacing-xs-1="true"
                          >
                            <Typography
                              align="center"
                              className={classes.textOverflow}
                              color="secondary"
                            >
                              {metric.label}
                            </Typography>
                            <Grid item xs={12}>
                              <GaugeChart
                                id={metric.id}
                                styles={{ width: this.state.gaugeWidth }}
                                nrOfLevels={3}
                                arcsLength={metric.arcsLength}
                                colors={[
                                  "rgba(91,225,44,0.7)",
                                  "rgba(245,205,25,0.7)",
                                  "rgba(234,66,40,0.7",
                                ]}
                                percent={metric.percentage}
                                arcPadding={0.02}
                                needleColor="#D6DBDF"
                                needleBaseColor="#D6DBDF"
                                textColor="rgba(0,0,0,0.8)"
                                formatTextValue={() =>
                                  `${metric.value} ` + `${metric.unit}`
                                }
                              />
                            </Grid>
                          </Grid>
                        ))}
                      </Grid>
                    </Paper> */}
                    <Paper spacing={3} xs={6} className={classes.metricsPaper}>
                      <Grid container justifyContent="space-around">
                        <Grid
                          xs={10}
                          md={6}
                          className={classes.metricContainer}
                          item
                          spacing-xs-1="true"
                        >
                          <Typography
                            align="center"
                            className={classes.textOverflow}
                            color="secondary"
                          >
                            WRITE BANDWIDTH
                          </Typography>
                          <Grid
                            item
                            xs={12}
                            className={`${classes.metricBox} ${classes.writeMetric}`}
                          >
                            <Typography
                              variant="h5"
                              data-testid="write-bw"
                              className={classes.metricTxt}
                            >
                              {formatBytes(this.props.writeBW, 0)}ps
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid
                          xs={10}
                          md={6}
                          className={classes.metricContainer}
                          item
                          spacing-xs-1="true"
                        >
                          <Typography
                            align="center"
                            className={classes.textOverflow}
                            color="secondary"
                          >
                            READ BANDWIDTH
                          </Typography>
                          <Grid
                            item
                            xs={12}
                            className={`${classes.metricBox} ${classes.readMetric}`}
                          >
                            <Typography
                              variant="h5"
                              data-testid="read-bw"
                              className={classes.metricTxt}
                            >
                              {formatBytes(this.props.readBW, 0)}ps
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      {/* <Grid container justify="center">
                        <Grid
                          xs={10}
                          md={6}
                          className={classes.metricContainer}
                          item
                          spacing-xs-1="true"
                        >
                          <Typography
                            align="center"
                            className={classes.textOverflow}
                            color="secondary"
                          >
                            LATENCY
                          </Typography>
                          <Grid
                            item
                            xs={12}
                            className={`${classes.metricBox} ${classes.totalMetric}`}
                          >
                            <Typography
                              variant="h5"
                              data-testid="latency"
                              className={classes.metricTxt}
                            >
                              {this.props.latency}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid> */}
                      <Grid container justifyContent="space-around">
                        <Grid
                          xs={10}
                          md={6}
                          className={classes.metricContainer}
                          item
                          spacing-xs-1="true"
                        >
                          <Typography
                            align="center"
                            className={classes.textOverflow}
                            color="secondary"
                          >
                            WRITE IOPS
                          </Typography>
                          <Grid
                            item
                            xs={12}
                            className={`${classes.metricBox} ${classes.writeMetric}`}
                          >
                            <Typography
                              variant="h5"
                              data-testid="write-iops"
                              className={classes.metricTxt}
                            >
                              {this.props.writeIOPS}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid
                          xs={10}
                          md={6}
                          className={classes.metricContainer}
                          item
                          spacing-xs-1="true"
                        >
                          <Typography
                            align="center"
                            className={classes.textOverflow}
                            color="secondary"
                          >
                            READ IOPS
                          </Typography>
                          <Grid
                            item
                            xs={12}
                            className={`${classes.metricBox} ${classes.readMetric}`}
                          >
                            <Typography
                              variant="h5"
                              data-testid="read-iops"
                              className={classes.metricTxt}
                            >
                              {this.props.readIOPS}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                  <Grid xs={12} md={6} item>
                    <Paper className={classes.posInfo}>
                      <Grid
                        md={6}
                        xs={12}
                        item
                        container
                        direction="column"
                        justifyContent="space-between"
                      >
                        <Typography
                          data-testid="dashboard-ip"
                          className={classes.posInfoText}
                          variant="body1"
                          component="span"
                        >
                          <span
                            className={`${classes.posInfoKey} ${classes.textLeft}`}
                          >
                            IP
                          </span>
                          :
                          <span
                            className={`${classes.posInfoKey} ${classes.textLeft}`}
                          >
                            {this.props.ip}
                          </span>
                        </Typography>
                        <Typography
                          data-testid="dashboard-host"
                          className={classes.posInfoText}
                          variant="body1"
                          component="span"
                        >
                          <span
                            className={`${classes.posInfoKey} ${classes.textLeft}`}
                          >
                            Poseidon Name
                          </span>
                          :
                          <span
                            className={`${classes.posInfoKey} ${classes.textLeft}`}
                          >
                            {this.props.host}
                          </span>
                        </Typography>
                        <Typography
                          data-testid="dashboard-mac"
                          className={classes.posInfoText}
                          variant="body1"
                          component="span"
                        >
                          <span
                            className={`${classes.posInfoKey} ${classes.textLeft}`}
                          >
                            MAC
                          </span>
                          :
                          <span
                            className={`${classes.posInfoKey} ${classes.textLeft}`}
                          >
                            {this.props.mac}
                          </span>
                        </Typography>
                      </Grid>
                    </Paper>
                    <Paper
                      spacing={3}
                      xs={6}
                      className={`${classes.storageDetailsPaper}`}
                    >
                      <Grid container justifyContent="space-between">
                        <Typography
                          className={classes.cardHeader}
                          style={{ marginLeft: "24px" }}
                        >
                          Storage Details
                        </Typography>
                      </Grid>
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
                            No Mounted Arrays
                          </Typography>
                        ) : (
                          <React.Fragment>
                            <div className="dashboard-size-label-container">
                              <span className="dashboard-min-label">0TB</span>
                              <span className="dashboard-max-label">
                                {formatBytes(this.props.arraySize)}
                              </span>
                            </div>
                            <div className="storage-detail-container">
                              <div style={volFilledStyle}>
                                <div style={volUsedStyle} />
                              </div>
                              <div style={storageFreeStyle} />
                              <div style={storageDangerStyle}>
                                <div className="dashboard-threshold-label">
                                  80%
                                </div>
                              </div>
                            </div>
                            <div
                              style={{
                                width: "94%",
                                margin: "5px auto auto",
                                height: "auto",
                                position: "relative",
                              }}
                            >
                              <Grid item container xs={12} wrap="wrap">
                                <Legend
                                  bgColor="rgba(0, 186, 0, 0.6)"
                                  title={`Data Written: ${formatBytes(
                                    volUsedSpace
                                  )}`}
                                />
                                <Legend
                                  bgColor="#e0e0e0"
                                  title={`Volume Space Allocated: ${formatBytes(
                                    volSpace
                                  )}`}
                                />
                                <Legend
                                  bgColor="#fff"
                                  title={`Available for Volume Creation: ${formatBytes(
                                    this.props.arraySize - volSpace
                                  )}`}
                                />
                                <Legend
                                  bgColor="rgb(255, 173, 173)"
                                  title="Threshold"
                                />
                              </Grid>
                              <span
                                style={{
                                  width: "100%",
                                  marginTop: "10px",
                                  float: "left",
                                  textAlign: "left",
                                }}
                              >
                                As of {this.state.time}
                              </span>
                            </div>
                          </React.Fragment>
                        )}
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>

                <Grid container spacing={1}>
                  <Grid
                    xs={12}
                    md={6}
                    item
                    className={classes.volumeContainer}
                  >
                    <Paper spacing={3} className={classes.volumeSummary}>
                      <MaterialTable
                        title={(
                          <Typography className={classes.cardHeader}>
                            Array Summary
                          </Typography>
                        )}
                        columns={arrayTableColumns}
                        data={this.props.arrays}
                        options={{
                          headerStyle: {
                            backgroundColor: "#788595",
                            color: "#FFF",
                          },
                          minBodyHeight: 342,
                          maxBodyHeight: 342,
                          search: false,
                        }}
                        style={{ height: "100%" }}
                        isLoading={this.props.arrayLoading}
                        icons={icons}
                      />
                    </Paper>
                  </Grid>
                  <Grid
                    xs={12}
                    md={6}
                    item
                    className={classes.volumeContainer}
                  >
                    <Paper spacing={3} className={classes.volumeSummary}>
                      <MaterialTable
                        columns={volumeTableColumns}
                        data={this.props.arrayVolumes}
                        options={{
                          headerStyle: {
                            backgroundColor: "#788595",
                            color: "#FFF",
                          },
                          minBodyHeight: 342,
                          maxBodyHeight: 342,
                          search: false
                        }}
                        components={{
                          Toolbar: () => (
                            <Grid className={classes.volumeHeader}>
                              <Typography className={classes.cardHeader}>
                                Volume Summary
                              </Typography>
                              <FormControl className={classes.volumeUnit}>
                              <InputLabel htmlFor="select-array">Array</InputLabel>
                              <Select
                                value={this.props.selectedArray}
                                onChange={this.selectArray}
                                inputProps={{
                                  id: "select-array",
                                }}
                                className={classes.arraySelect}
                              >
                                <MenuItem value="all">All</MenuItem>
                                {this.props.arrays.map((array) => (
                                  <MenuItem key={array.arrayname} value={array.arrayname}>{array.arrayname}</MenuItem>
                                ))};
                              </Select>
                              </FormControl>
                            </Grid>
                          )
                        }}
                        style={{ height: "100%" }}
                        icons={icons}
                      />
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
              {/* <Grid container spacing={1} className={classes.spaced}>
            <Grid xs={12} item>
            <Paper>
              {this.props.alerts.length > 0 ||
                this.props.fetchingAlerts === false ? (
                <MaterialTable
                  title={(
                    <Typography className={classes.cardHeader}>Storage Alerts</Typography>
                  )}
                  data-testid="Dashboard-table-alert"
                  options={{
                    headerStyle: {
                      backgroundColor: '#788595',
                      color: '#FFF'
                    },
                    search: false
                  }}
                  data={this.props.alerts}
                  columns={alertColumns}
                  icons={alertIcons}
                />
              ) : (
                <div className={classes.loadWrapper}>
                  <Loader
                    type="Bars"
                    color="#788595"
                    marginTop="100px"
                    width="50"
                  />
                </div>
              )}
            </Paper>
            </Grid>
          </Grid> */}
            </Grid>
          </main>
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
    readIOPS: state.dashboardReducer.readIOPS,
    writeIOPS: state.dashboardReducer.writeIOPS,
    readBW: state.dashboardReducer.readBW,
    writeBW: state.dashboardReducer.writeBW,
    latency: state.dashboardReducer.latency,
    fetchingAlerts: state.dashboardReducer.fetchingAlerts,
    ip: state.dashboardReducer.ip,
    arrayVolCount: state.dashboardReducer.arrayVols,
    mac: state.dashboardReducer.mac,
    host: state.dashboardReducer.host,
    arraySize: state.storageReducer.arraySize,
    cpuUsage: state.dashboardReducer.cpuUsage,
    memoryUsage: state.dashboardReducer.memoryUsage,
    latencyVal: state.dashboardReducer.latencyVal,
    latencyPer: state.dashboardReducer.latencyPer,
    cpuArcsLength: state.dashboardReducer.cpuArcsLength,
    memoryArcsLength: state.dashboardReducer.memoryArcsLength,
    latencyArcsLength: state.dashboardReducer.latencyArcsLength,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    enableFetchingAlerts: (flag) =>
      dispatch(actionCreators.enableFetchingAlerts(flag)),
    fetchVolumes: () => dispatch({ type: actionTypes.SAGA_FETCH_VOLUME_INFO }),
    fetchArrays: () => dispatch({ type: actionTypes.SAGA_FETCH_ARRAY }),
    // fetchAlertsInfo: () =>
    //  dispatch({ type: actionTypes.SAGA_FETCH_ALERTS_INFO }),
    fetchPerformance: () =>
      dispatch({ type: actionTypes.SAGA_FETCH_PERFORMANCE_INFO }),
    fetchIpAndMacInfo: () =>
      dispatch({ type: actionTypes.SAGA_FETCH_IPANDMAC_INFO }),
    selectArray: (array) =>
      dispatch({ type: actionTypes.SELECT_ARRAY, array}),
  };
};
export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(Dashboard)
);
