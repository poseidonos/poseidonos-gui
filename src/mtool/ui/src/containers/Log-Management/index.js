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

import React, { Component } from "react";
import ThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import { withStyles } from "@material-ui/core/styles";
import { Grid, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import MToolTheme, { customTheme } from "../../theme";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import * as actionTypes from "../../store/actions/actionTypes";

import LogTable from "../../components/LogTable";

const styles = theme => ({
  configurationContainer: {
    display: "flex"
  },
  pageHeader: customTheme.page.title,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    width: "100%",
    boxSizing: "border-box",
    paddingLeft: "24px",
    paddingRight: "13px"
  },
  toolbar: customTheme.toolbar,
  LogTableContainer: {
    margin: 0
  }
});
class LogManagement extends Component {
  constructor(props) {
    super(props);
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    this.toggleLiveLogs = this.toggleLiveLogs.bind(this);
    this.state = {
      mobileOpen: false
    };
    this.interval = null;
  }

  componentDidMount() {
    this.props.getIbofOsLogs();
    this.props.getLiveLogsDb();

    if (this.props.showLiveLogs === "yes") {
      this.interval = setInterval(() => {
        this.props.getIbofOsLogs();
      }, 2000);
    }
  }

  componentDidUpdate() {
    clearInterval(this.interval);
    if (this.props.showLiveLogs === "yes") {
      this.interval = setInterval(() => {
        this.props.getIbofOsLogs();
      }, 2000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleDrawerToggle() {
    this.setState({
      mobileOpen: (!this.state.mobileOpen)
    });
  }

  toggleLiveLogs() {
    this.props.setLiveLogsDb((this.props.showLiveLogs === "yes" ? "no" : "yes"));
  }

  render() {
    const { classes } = this.props;
    return (
      <ThemeProvider theme={MToolTheme}>
        <div className={classes.configurationContainer}>
          <Header toggleDrawer={this.handleDrawerToggle} />
          <Sidebar
            mobileOpen={this.state.mobileOpen}
            toggleDrawer={this.handleDrawerToggle}
          />
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Grid container spacing={3} className={classes.titleContainer}>
              <Grid sm={6} xs={12} item>
                <Typography className={classes.pageHeader} variant="h6">
                  Trace Management
                </Typography>
              </Grid>
            </Grid>
            <LogTable
              logList={this.props.logList}
              toggleLiveLogs={this.toggleLiveLogs}
              showLiveLogs={this.props.showLiveLogs}
              label = {this.props.label}
              value = {this.props.value}
              entries= {this.props.entries}
            />
          </main>
        </div>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => {
  return {
    logList: state.logManagementReducer.logList,
    showLiveLogs: state.logManagementReducer.showLiveLogs,
    label: state.logManagementReducer.label,
    value: state.logManagementReducer.value,
    entries: state.logManagementReducer.entries,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getIbofOsLogs: () => dispatch({ type: actionTypes.SAGA_GET_IBOFOS_LOGS }),
    getLiveLogsDb: () => dispatch({ type: actionTypes.SAGA_GET_LIVE_LOGS_DB }),
    setLiveLogsDb: data =>
      dispatch({ type: actionTypes.SAGA_SET_LIVE_LOGS_DB, payload: data })
  };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LogManagement)
);
