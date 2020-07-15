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


DESCRIPTION: Configuration Page Container for rendering Configuration Page
@NAME : index.js
@AUTHORS: Jay Hitesh Sanghavi, Palak Kapoor 
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
[08/21/2019] [Palak]: Material UI & Redux.///////////////////
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

  toggleLiveLogs() {
    this.props.setLiveLogsDb((this.props.showLiveLogs === "yes" ? "no" : "yes"));
  }

  handleDrawerToggle() {
    this.setState({
      mobileOpen: (!this.state.mobileOpen)
    });
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
