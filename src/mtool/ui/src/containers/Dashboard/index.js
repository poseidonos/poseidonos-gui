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
import { connect } from "react-redux";
import "react-dropdown/style.css";
import "react-table/react-table.css";
import "core-js/es/number";
import "core-js/es/array";
import { Paper, Grid, Typography, Button, IconButton } from "@material-ui/core";
import { withStyles, MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles';
import { Edit } from "@material-ui/icons";

import { customTheme, PageTheme } from "../../theme";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import Dialog from "../../components/Dialog";
import TelemetryForm from "../../components/TelemetryForm";
import * as actionTypes from "../../store/actions/actionTypes";
import * as actionCreators from "../../store/actions/exportActionCreators";
import HardwareHealth from "./HardwareHealth";
import Performance from "./Performance";
import StorageDetails from "./StorageDetails";


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
    cardHeader: {
      ...customTheme.card.header,
      marginLeft: 0,
      marginBottom: 0,
      paddingTop: 0
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
    borderSolid: {
      border: "1px solid #0001",
    }
  };
};



class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false,
    };
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
  }

  componentDidMount() {
    if (this.props.isConfigured)
      this.props.fetchCheckTelemetry();
    this.props.getConfig();
    this.props.fetchIpAndMacInfo();
    this.props.enableFetchingAlerts(true);
  }

  componentDidUpdate(prevProps) {
    if (this.props.isConfigured && this.props.telemetryIP !== prevProps.telemetryIP)
      this.props.fetchCheckTelemetry();
  }

  handleDrawerToggle() {
    this.setState({
      mobileOpen: !this.state.mobileOpen,
    });
  }

  render() {
    const { classes } = this.props;

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
                    <Performance />
                  </Grid>
                </Grid>
                <Grid xs={12} lg={6} xl={8} item>
                  {posInfo}
                  <HardwareHealth />
                </Grid>
                <Grid xs={12} lg={6} xl={4} item>
                  <StorageDetails />
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
    alerts: state.dashboardReducer.alerts,
    ibofs: state.dashboardReducer.ibofs,
    showTelemetryAlert: state.dashboardReducer.showTelemetryAlert,
    errorMsg: state.dashboardReducer.errorMsg,
    fetchingAlerts: state.dashboardReducer.fetchingAlerts,
    ip: state.dashboardReducer.ip,
    mac: state.dashboardReducer.mac,
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
    fetchIpAndMacInfo: () => dispatch({ type: actionTypes.SAGA_FETCH_IPANDMAC_INFO }),
    setShowConfig: payload => dispatch(actionCreators.setShowConfig(payload))
  };
};
export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(Dashboard)
);
