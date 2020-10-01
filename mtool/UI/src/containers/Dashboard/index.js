/* -------------------------------------------------------------------------------------/
                                                                                    /
/               COPYRIGHT (c) 2019 SAMSUNG ELECTRONICS CO., LTD.                      /
/                          ALL RIGHTS RESERVED                                        /
/                                                                                     /
/   Permission is hereby granted to licensees of Samsung Electronics Co., Ltd.        /
/   products to use or abstract this computer program for the sole purpose of         /
/   implementing a product based on Samsung Electronics Co., Ltd. products.           /
/   No other rights to reproduce, use, or disseminate this computer program,          /
/   whether in part or in whole, are granted.                                         / 
/                                                                                     /
/   Samsung Electronics Co., Ltd. makes no representation or warranties with          /
/   respect to the performance of this computer program, and specifically disclaims   /
/   any responsibility for any damages, special or consequential, connected           /
/   with the use of this program.                                                     /
/                                                                                     /
/-------------------------------------------------------------------------------------/


DESCRIPTION: <File description> *
@NAME : index.js
@AUTHORS: Jay Hitesh Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import MaterialTable from "material-table";
import GaugeChart from "react-gauge-chart";
import "react-dropdown/style.css";
import { withStyles } from "@material-ui/core/styles";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import "react-table/react-table.css";
import "core-js/es/number";
import "core-js/es/array";
import { Paper, Grid, Typography } from "@material-ui/core";
import ThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import formatBytes from "../../utils/format-bytes";
import { customTheme, PageTheme } from "../../theme";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "./Dashboard.css";
import * as actionTypes from "../../store/actions/actionTypes";
import * as actionCreators from "../../store/actions/exportActionCreators";
import Legend from "../../components/Legend";
import bytesToTB from "../../utils/bytes-to-tb";

const styles = (theme) => {
  return {
    dashboardContainer: {
      display: "flex",
    },
    healthMetricsPaper: {
      minHeight: 150,
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
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
    healthMetricContainer: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
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
    healthMetricBox: {
      display: "flex",
      alignItems: "center",
      width: "75%",
      height: "82.5px",
      justifyContent: "center",
      borderRadius: "100px",
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

// eslint-disable-next-line react/no-multi-comp
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: "",
      mobileOpen: false,
      gaugeWidth: '100%',
    };
    this.interval = null;
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    this.setChartWidth = this.setChartWidth.bind(this);
  }

  componentDidMount() {
    this.props.fetchVolumes();
    this.props.fetchStorageInfo();
    this.props.fetchPerformance();
    this.props.fetchIpAndMacInfo();
    this.props.fetchAlertsInfo();
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
      this.props.fetchHealthStatus();
    }, 2000);
    this.setChartWidth();
    window.addEventListener("resize", this.setChartWidth);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    window.removeEventListener("resize", this.setChartWidth);
  }
  setChartWidth() {
    setTimeout(() => {
      const chart = document.getElementById(
        'gauge-chart1'
      );
      const gaugeWidth = chart ? chart.clientWidth : 500;
      this.setState({
        ...this.state,
        gaugeWidth,
      });
    }, 100);
  }

  handleDrawerToggle() {
    this.setState({
      mobileOpen: !this.state.mobileOpen,
    });
  }

  render() {
    let volUsedSpace = 0;
    let volSpace = 0;
    this.props.volumes.forEach((vol) => {
      volUsedSpace += Number(vol.total) - Number(vol.remain);
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
    const volumeTableColumns = [
      {
        title: "Name",
        field: "name",
      },
      {
        title: "Used Space (GB)",
        render: (rowData) =>
          rowData.usedspace ? formatBytes(rowData.total - rowData.remain) : 0,
      },
      {
        title: "Total Space",
        render: (rowData) => (rowData.total ? formatBytes(rowData.total) : 0),
      },
    ];
    const { classes } = this.props;

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
                <Grid xs={12} md={12} container spacing={1}>
                  
                  <Grid xs={12} md={6} item spacing={1}>
                  <Paper spacing={3} xs={6} className={classes.healthMetricsPaper}>
                      <Grid container justify="space-around">
                        <Grid
                          xs={10}
                          md={4}
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
                            CPU UTILIZATION
                          </Typography>
                          <Grid item xs={12}>
                            <GaugeChart
                              id="gauge-chart1"
                              styles={{width:this.state.gaugeWidth}}
                              nrOfLevels={3}
                              arcsLength={this.props.cpuArcsLength}
                              colors={["rgba(91,225,44,0.7)", "rgba(245,205,25,0.7)", "rgba(234,66,40,0.7"]}
                              percent={this.props.cpuUsage}
                              arcPadding={0.02}
                              needleColor="#D6DBDF"
                              needleBaseColor="#D6DBDF"
                              textColor="rgba(0,0,0,0.8)"

                            />
                          </Grid>
                        </Grid>
                        <Grid
                          xs={10}
                          md={4}
                          className={classes.healthMetricContainer}
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
                          <Grid item xs={12}>
                            <GaugeChart
                              id="gauge-chart2"
                              styles={{width:this.state.gaugeWidth}}
                              nrOfLevels={3}
                              arcsLength={this.props.latencyArcsLength}
                              colors={["rgba(91,225,44,0.7)", "rgba(245,205,25,0.7)", "rgba(234,66,40,0.7"]}
                              percent={this.props.latencyPer}
                              arcPadding={0.02}
                              needleColor="#D6DBDF"
                              needleBaseColor="#D6DBDF"
                              textColor="rgba(0,0,0,0.8)"
                              formatTextValue={(value) => this.props.latencyVal+ ' ms'}
                            />
                          </Grid>
                        </Grid>
                        <Grid
                          xs={10}
                          md={4}
                          className={classes.healthMetricContainer}
                          item
                          spacing-xs-1="true"
                        >
                          <Typography
                            align="center"
                            className={classes.textOverflow}
                            color="secondary"
                          >
                            MEMORY UTILIZATION
                          </Typography>
                          <Grid item xs={12}>
                            <GaugeChart
                              id="gauge-chart3"
                              styles={{width:this.state.gaugeWidth}}
                              nrOfLevels={3}
                              arcsLength={this.props.memoryArcsLength}
                              colors={["rgba(91,225,44,0.7)", "rgba(245,205,25,0.7)", "rgba(234,66,40,0.7"]}
                              percent={this.props.memoryUsage}
                              arcPadding={0.02}
                              needleColor="#D6DBDF"
                              needleBaseColor="#D6DBDF"
                              textColor="rgba(0,0,0,0.8)"
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Paper>
                    <Paper spacing={3} xs={6} className={classes.metricsPaper}>
                      <Grid container justify="space-around">
                        <Grid
                          xs={10}
                          md={6}
                          justify="center"
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
                              variant="h2"
                              data-testid="write-bw"
                              className={classes.metricTxt}
                            >
                              {this.props.writeBW} MBps
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
                              variant="h2"
                              data-testid="read-bw"
                              className={classes.metricTxt}
                            >
                              {this.props.readBW} MBps
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
                              variant="h2"
                              data-testid="latency"
                              className={classes.metricTxt}
                            >
                              {this.props.latency}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid> */}
                      <Grid container justify="space-around">
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
                              variant="h2"
                              data-testid="write-iops"
                              className={classes.metricTxt}
                            >
                              {this.props.readIOPS}
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
                              variant="h2"
                              data-testid="read-iops"
                              className={classes.metricTxt}
                            >
                              {this.props.writeIOPS}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                  <Grid xs={12} md={6} item spacing={1}>
                    <Paper className={classes.posInfo}>
                      <Grid
                        md={6}
                        xs={12}
                        item
                        container
                        direction="column"
                        justify="space-between"
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
                      <Grid container justify="space-between">
                        <Typography
                          className={classes.cardHeader}
                          style={{ marginLeft: "24px" }}
                        >
                          Storage Details
                        </Typography>
                      </Grid>
                      <Grid
                        container
                        justify="center"
                        alignContent="center"
                        className={classes.storageGraph}
                      >
                        {this.props.arraySize === 0 ? (
                          <Typography
                            data-testid="dashboard-no-array"
                            color="secondary"
                          >
                            No Array Created
                          </Typography>
                        ) : (
                          <React.Fragment>
                            <div className="dashboard-size-label-container">
                              <span className="dashboard-min-label">0TB</span>
                              <span className="dashboard-max-label">
                                {bytesToTB(this.props.arraySize)}
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
                                  title={`Data Written: ${bytesToTB(
                                    volUsedSpace
                                  )}`}
                                />
                                <Legend
                                  bgColor="#e0e0e0"
                                  title={`Volume Space Allocated: ${bytesToTB(
                                    volSpace
                                  )}`}
                                />
                                <Legend
                                  bgColor="#fff"
                                  title={`Available for Volume Creation: ${bytesToTB(
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

                <Grid xs={12} md={12} container spacing={1}>
                  <Grid
                    xs={12}
                    md={12}
                    item
                    className={classes.volumeContainer}
                  >
                    <Paper spacing={3} className={classes.volumeSummary}>
                      <MaterialTable
                        title={
                          <Typography className={classes.cardHeader}>
                            Volume Summary
                          </Typography>
                        }
                        columns={volumeTableColumns}
                        data={this.props.volumes}
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
    alerts: state.dashboardReducer.alerts,
    ibofs: state.dashboardReducer.ibofs,
    unusedSpace: state.dashboardReducer.unusedSpace,
    used: state.dashboardReducer.used,
    unused: state.dashboardReducer.unused,
    readIOPS: state.dashboardReducer.readIOPS,
    writeIOPS: state.dashboardReducer.writeIOPS,
    readBW: state.dashboardReducer.readBW,
    writeBW: state.dashboardReducer.writeBW,
    latency: state.dashboardReducer.latency,
    fetchingAlerts: state.dashboardReducer.fetchingAlerts,
    ip: state.dashboardReducer.ip,
    mac: state.dashboardReducer.mac,
    host: state.dashboardReducer.host,
    arraySize: state.dashboardReducer.arraySize,
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
    fetchAlertsInfo: () =>
      dispatch({ type: actionTypes.SAGA_FETCH_ALERTS_INFO }),
    fetchStorageInfo: () =>
      dispatch({ type: actionTypes.SAGA_FETCH_STORAGE_INFO }),
    fetchPerformance: () =>
      dispatch({ type: actionTypes.SAGA_FETCH_PERFORMANCE_INFO }),
    fetchIpAndMacInfo: () =>
      dispatch({ type: actionTypes.SAGA_FETCH_IPANDMAC_INFO }),
    fetchHealthStatus: () =>
      dispatch({ type: actionTypes.SAGA_FETCH_HEALTH_STATUS }),
  };
};
export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(Dashboard)
);
