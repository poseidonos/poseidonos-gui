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

import React, { Component, lazy, Suspense } from "react";
import { Box, Grid, Typography, AppBar, Tabs, Tab } from "@material-ui/core";
import { withStyles, MuiThemeProvider as ThemeProvider } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import "react-dropdown/style.css";
import "react-table/react-table.css";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import MToolLoader from "../../components/MToolLoader";
import AlertDialog from "../../components/Dialog";
import * as actionTypes from "../../store/actions/actionTypes";
import MToolTheme, { customTheme } from "../../theme";
import "./StorageManagement.css";


const ArrayCreate = lazy(() => import("./ArrayCreate"));
const ArrayManage = lazy(() => import("./ArrayManage"));

const styles = (theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    paddingTop: "10px",
    paddingLeft: "35px",
    paddingRight: "24px",
    width: "calc(100% - 256px)",
    boxSizing: "border-box",
  },
  toolbar: customTheme.toolbar,
  titleContainer: {
    marginTop: theme.spacing(1),
  },
  pageHeader: customTheme.page.title,
  selectedTab: customTheme.tab.selected,
  card: {
    marginTop: theme.spacing(1),
  },
});

class StorageManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false,
    };
    this.alertConfirm = this.alertConfirm.bind(this);
    this.fetchDevices = this.fetchDevices.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
  }

  componentDidMount() {
    this.fetchDevices();
    this.props.Get_Max_Volume_Count();
    this.props.Get_Subsystems();
    const urlParams = new URLSearchParams(window.location.search);
    const array = urlParams.get("array");
    if (array) {
      this.props.Set_Array(array)
    }
  }

  handleDrawerToggle() {
    this.setState({
      mobileOpen: !this.state.mobileOpen,
    });
  }

  handleTabChange(event, newValue) {
    if (newValue === "manage") {
      this.props.Get_Subsystems();
      this.props.history.push(`/storage/array/${newValue}?array=${this.props.arrayname}`);
    } else {
      this.fetchDevices();
      this.props.history.push(`/storage/array/${newValue}`);
    }
  }

  fetchDevices() {
    this.props.Get_Devices(this.props.history);
  }

  alertConfirm() {
    this.props.Close_Alert();
  }

  render() {
    const { classes } = this.props;

    return (
      <ThemeProvider theme={MToolTheme}>
        <Box display="flex">
          <Header toggleDrawer={this.handleDrawerToggle} />
          <Sidebar
            mobileOpen={this.state.mobileOpen}
            toggleDrawer={this.handleDrawerToggle}
          />
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Grid container spacing={3}>
              <Grid container spacing={3} className={classes.titleContainer}>
                <Grid xs={12} item>
                  <Typography className={classes.pageHeader} variant="h6">
                    Storage Management
                  </Typography>
                </Grid>
              </Grid>

              <AppBar style={{ zIndex: 50 }} position="relative" color="default">
                <Tabs
                  onChange={this.handleTabChange}
                  value={
                    window.location.href.indexOf('manage') > 0 ? 'manage' : 'create'
                  }
                >
                  <Tab
                    label="create"
                    value="create"
                    className={(window.location.href.indexOf('create') > 0 ? /* istanbul ignore next */ classes.selectedTab : null)}
                  >
                    CREATE ARRAY
                  </Tab>
                  <Tab
                    label="manage"
                    value="manage"
                    className={(window.location.href.indexOf('manage') > 0 ? /* istanbul ignore next */ classes.selectedTab : null)}
                  >
                    ARRAY MANAGEMENT
                  </Tab>
                </Tabs>
              </AppBar>
              <Suspense fallback={<MToolLoader />}>
                <Switch>
                  <Redirect exact from="/storage/array/" to="/storage/array/create" />
                  <Route path="/storage/array/create">
                    <Grid container spacing={1} className={classes.card}>
                      <ArrayCreate />
                    </Grid>
                  </Route>
                  <Route path="/storage/array/manage*">
                    <>
                      {this.props.arrayMap[this.props.arrayname] ? (
                        <ArrayManage
                          getDevices={this.props.Get_Devices}
                        />
                      ) : null}
                    </>
                  </Route>
                </Switch>
              </Suspense>
              <AlertDialog
                title={this.props.alertTitle}
                description={this.props.errorMsg}
                open={this.props.alertOpen}
                type={this.props.alertType}
                link={this.props.alertLink}
                linkText={this.props.alertLinkText}
                onConfirm={this.alertConfirm}
                handleClose={this.alertConfirm}
                errCode={this.props.errorCode}
              />
              {this.props.loading ? (
                <MToolLoader text={this.props.loadText} />
              ) : null}
            </Grid>
          </main>
        </Box>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    arrayMap: state.storageReducer.arrayMap,
    arrayname: state.storageReducer.arrayname,
    loading: state.storageReducer.loading,
    alertOpen: state.storageReducer.alertOpen,
    alertType: state.storageReducer.alertType,
    alertTitle: state.storageReducer.alertTitle,
    alertLink: state.storageReducer.alertLink,
    alertLinkText: state.storageReducer.alertLinkText,
    errorMsg: state.storageReducer.errorMsg,
    errorCode: state.storageReducer.errorCode,
    arraySize: state.storageReducer.arraySize,
    totalVolSize: state.storageReducer.totalVolSize,
    slots: state.storageReducer.slots,
    arrayExists: state.storageReducer.arrayExists,
    RAIDLevel: state.storageReducer.RAIDLevel,
    loadText: state.storageReducer.loadText,
    mountStatus: state.storageReducer.mountStatus,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    Get_Devices: (payload) =>
      dispatch({ type: actionTypes.SAGA_FETCH_DEVICE_INFO, payload }),
    Get_Volumes: (payload) => dispatch({ type: actionTypes.SAGA_FETCH_VOLUMES, payload }),
    Close_Alert: () => dispatch({ type: actionTypes.STORAGE_CLOSE_ALERT }),
    Change_Mount_Status: (payload) =>
      dispatch({ type: actionTypes.SAGA_VOLUME_MOUNT_CHANGE, payload }),
    Get_Max_Volume_Count: () =>
      dispatch({ type: actionTypes.SAGA_FETCH_MAX_VOLUME_COUNT }),
    Set_Array: (payload) => dispatch({ type: actionTypes.SET_ARRAY, payload }),
    Get_Subsystems: () => dispatch({ type: actionTypes.SAGA_FETCH_SUBSYSTEMS }),
  };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withRouter(StorageManagement))
);
