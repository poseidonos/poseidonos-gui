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
import { Box, Grid, Typography, Paper, Popover, AppBar, Tabs, Tab, Select, FormControl, InputLabel, MenuItem } from "@material-ui/core";
import { withStyles, MuiThemeProvider as ThemeProvider } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import io from "socket.io-client";
import "react-dropdown/style.css";
import "react-table/react-table.css";
import InfoIcon from "@material-ui/icons/Info";
import AutoCreate from "../../components/AutoCreate";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import ArrayCreate from "../../components/ArrayManagement/ArrayCreate";
import ArrayShow from "../../components/ArrayManagement/ArrayShow";
import CreateVolume from "../../components/VolumeManagement/CreateVolume";
import VolumeList from "../../components/VolumeManagement/VolumeList";
import MToolLoader from "../../components/MToolLoader";
import RebuildProgress from "../../components/RebuildProgress";
import AlertDialog from "../../components/Dialog";
import "./Volume.css";
import MToolTheme, { customTheme } from "../../theme";
import SelectSubsystem from "../../components/SelectSubsystem";
import Legend from "../../components/Legend";
import * as actionTypes from "../../store/actions/actionTypes";
import formatBytes from "../../utils/format-bytes";
import getSubsystemForArray from "../../utils/subsystem";

const styles = (theme) => ({
  dashboardContainer: {
    display: "flex",
  },
  statsWrapper: {
    display: "flex",
    flexWrap: "wrap",
    width: "100%",
    boxSizing: "border-box",
    zIndex: 100,
    position: "absolute",
    flexBasis: "100%",
    height: "100%",
    alignContent: "center",
    padding: theme.spacing(0, 3),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(0, 1),
      marginTop: theme.spacing(1),
    },
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    paddingTop: "10px",
    paddingLeft: "35px",
    paddingRight: "24px",
    width: "calc(100% - 256px)",
    boxSizing: "border-box",
  },
  statsContainer: {
    margin: theme.spacing(1, 0, 2),
  },
  volumeStats: {
    width: "100%",
    border: "0px solid gray",
    height: 50,
  },
  arraySelect: {
    minWidth: 170,
    "&>div>p": {
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  },
  arraySelectStatus: {
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      justifyContent: "center"
    }
  },
  arraySelectGrid: {
    [theme.breakpoints.down("xs")]: {
      textAlign: "center",
      width: "100%"
    }
  },
  selectForm: {
    margin: `${theme.spacing(0, 2)} ${theme.spacing(0, 4)}`,
    maxWidth: "80%",
    [theme.breakpoints.down("sm")]: {
      margin: `${theme.spacing(0, 2)} ${theme.spacing(0, 3)}`,
    },
    [theme.breakpoints.down("xs")]: {
      maxWidth: "80%"
    }
  },
  toolbar: customTheme.toolbar,
  titleContainer: {
    marginTop: theme.spacing(1),
  },
  statusText: {
    display: "flex",
    alignItems: "center",
    margin: theme.spacing(0.5, 1),
    [theme.breakpoints.down("xs")]: {
      justifyContent: "center"
    }
  },
  volumeStatsPaper: {
    height: 400,
    display: "flex",
    position: "relative",
    flexDirection: "column",
    [theme.breakpoints.down("md")]: {
      height: 450,
    },
    [theme.breakpoints.down("xs")]: {
      height: 270,
    },
  },
  selectedTab: {
    color: 'rgb(33, 34, 37)',
    borderBottom: `2px solid ${'rgb(33, 34, 37)'}`,
    fontWeight: 600
  },
  pageHeader: customTheme.page.title,
  cardHeader: customTheme.card.header,
  card: {
    marginTop: theme.spacing(1),
  },
});

// namespace to connect to the websocket for multi-volume creation
const createVolSocketEndPoint = ":5000/create_vol";

class Volume extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false,
      createVolSocket: io(createVolSocketEndPoint, {
        transports: ["websocket"],
        query: {
          "x-access-token": localStorage.getItem("token"),
        },
      }),
      mountSubsystem: ""
    };
    this.deleteVolumes = this.deleteVolumes.bind(this);
    this.fetchVolumes = this.fetchVolumes.bind(this);
    this.createArray = this.createArray.bind(this);
    this.createVolume = this.createVolume.bind(this);
    this.deleteArray = this.deleteArray.bind(this);
    this.alertConfirm = this.alertConfirm.bind(this);
    this.fetchDevices = this.fetchDevices.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.fetchStorageInfo = this.fetchStorageInfo.bind(this);
    this.fetchMaxVolumeCount = this.fetchMaxVolumeCount.bind(this);
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    this.changeArray = this.changeArray.bind(this);
    this.changeMountStatus = this.changeMountStatus.bind(this);
    this.mountConfirm = this.mountConfirm.bind(this);
    this.changeMountSubsystem = this.changeMountSubsystem.bind(this);
    this.closeMountPopup = this.closeMountPopup.bind(this);
    this.isSubsystemReserved = this.isSubsystemReserved.bind(this);
    this.openRebuildPopover = this.openRebuildPopover.bind(this);
    this.closeRebuildPopover = this.closeRebuildPopover.bind(this);
    const urlParams = new URLSearchParams(window.location.search);
    const array = urlParams.get("array");
    if (array) {
      this.props.Set_Array(array)
    }
  }

  componentDidMount() {
    this.props.Get_Config();
    this.fetchDevices();
    this.fetchStorageInfo();
    this.fetchMaxVolumeCount();
    this.props.Get_Subsystems();
  }

  componentDidUpdate() {
    if (window.location.href.indexOf('manage') > 0
      && window.location.href.indexOf(`array=${this.props.selectedArray}`) < 0) {
      this.props.history.push(`/storage/array/manage?array=${this.props.selectedArray}`);
      this.fetchVolumes();
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
      this.props.history.push(`/storage/array/${newValue}?array=${this.props.selectedArray}`);
    } else {
      this.fetchDevices();
      this.props.history.push(`/storage/array/${newValue}`);
    }
  }

  createVolume(volume) {
    this.props.Create_Volume({
      name: volume.volume_name,
      size: volume.volume_size,
      description: volume.volume_description,
      unit: volume.volume_units,
      maxbw: volume.maxbw,
      maxiops: volume.maxiops,
      minbw: volume.minbw,
      miniops: volume.miniops,
      count: volume.volume_count,
      subsystem: volume.subsystem,
      suffix: volume.volume_suffix,
      stop_on_error: volume.stop_on_error_checkbox,
      mount_vol: volume.mount_vol,
      max_available_size: this.props.arrayMap[this.props.selectedArray].totalsize - this.props.arrayMap[this.props.selectedArray].usedspace,
    });
  }

  changeArray(event) {
    const { value } = event.target;
    this.props.history.push(`/storage/array/manage?array=${value}`);
    this.props.Set_Array(value);
    this.props.Get_Volumes({ array: value });
  }

  fetchVolumes() {
    this.props.Get_Volumes({ array: this.props.selectedArray });
  }

  fetchStorageInfo() {
    this.props.Get_Array_Size();
  }

  fetchMaxVolumeCount() {
    this.props.Get_Max_Volume_Count();
  }

  deleteVolumes(volumes) {
    const vols = [];
    volumes.forEach((volume) => {
      vols.push({ name: volume.name, isMounted: volume.status === "Mounted" });
    });
    this.props.Delete_Volumes({ volumes: vols });
  }

  fetchDevices() {
    this.props.Get_Devices(this.props.history);
  }

  createArray(array) {
    this.props.Create_Array(array);
  }

  closeMountPopup() {
    this.setState({
      mountOpen: false
    });
  }

  openRebuildPopover(event) {
    this.setState({
      rebuildPopoverElement: event.currentTarget
    });
  }

  closeRebuildPopover() {
    this.setState({
      rebuildPopoverElement: null
    });
  }

  changeMountSubsystem(event) {
    this.setState({
      mountSubsystem: event.target.value
    });
  }

  isSubsystemReserved() {
    for (let i = 0; i < this.props.subsystems.length; i += 1) {
      const subsystem = this.props.subsystems[i];
      const isSubsystemSelected = subsystem.nqn === this.state.mountSubsystem;
      const isArrayFreeOrValid = !subsystem.array || subsystem.array === this.props.selectedArray;
      if (isSubsystemSelected && isArrayFreeOrValid) {
        return false;
      }
    }
    return true;
  }

  mountConfirm(payload) {
    this.setState({
      mountSubsystem: getSubsystemForArray(this.props.subsystems, this.props.selectedArray),
      volumeForMount: payload.name,
      mountConfirm: () => {

        if (this.isSubsystemReserved()) {
          this.props.Show_Storage_Alert({
            alertType: "alert",
            errorMsg: "Mount error",
            errorCode: "Selected Subsystem is used by another array",
            alertTitle: "Mounting Array"
          });
          return;
        }
        this.closeMountPopup();
        this.props.Change_Mount_Status({
          ...payload,
          subsystem: this.state.mountSubsystem
        })
      },
      mountOpen: true
    });
  }

  changeMountStatus(payload) {
    if (payload.status !== "Mounted") {
      this.mountConfirm(payload);
    } else {
      this.props.Change_Mount_Status(payload);
    }
  }

  deleteArray() {
    this.props.Delete_Array({ arrayname: "" });
  }

  alertConfirm() {
    this.props.Close_Alert();
  }

  render() {
    let totalVolSize = 0;
    for (let i = 0; i < this.props.volumes.length; i += 1) {
      totalVolSize += this.props.volumes[i].size;
    }
    const volumeFilledStyle = {
      width: `${this.props.arrayMap[this.props.selectedArray] && this.props.arrayMap[this.props.selectedArray].totalsize !== 0
        ? (100 * totalVolSize) / this.props.arrayMap[this.props.selectedArray].totalsize
        : 0
        }%`,
      height: "100%",
      backgroundColor: "rgba(51, 158, 255,0.6)",
      float: "left",
      overflowY: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };
    const volumeFreeStyle = {
      width: `${this.props.arrayMap[this.props.selectedArray] && this.props.arrayMap[this.props.selectedArray].totalsize !== 0
        ? 100 - (100 * totalVolSize) / this.props.arrayMap[this.props.selectedArray].totalsize
        : 100
        }%`,
      height: "100%",
      color: "white",
      backgroundColor: "rgba(0, 186, 0, 0.6)",
      float: "left",
      overflowY: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };
    const openPopover = this.state.rebuildPopoverElement;
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

              <Switch>
                <Redirect exact from="/storage/array/" to="/storage/array/create" />
                <Route path="/storage/array/create">
                  <Grid container spacing={1} className={classes.card}>
                    <Grid item xs={12}>
                      <Paper spacing={3} className={classes.spaced}>
                        <Grid container justifyContent="space-between">
                          <ArrayCreate
                            createArray={this.createArray}
                            config={this.props.config}
                            selectedRaid={this.props.selectedRaid}
                            selectRaid={this.props.Select_Raid}
                            disks={this.props.ssds}
                            data-testid="arraycreate"
                            metadisks={this.props.metadisks}
                            diskDetails={this.props.diskDetails}
                            getDiskDetails={this.props.Get_Disk_Details}
                          />
                        </Grid>
                      </Paper>
                      <AutoCreate
                        disks={this.props.ssds}
                        metadisks={this.props.metadisks}
                        autoCreateArray={this.props.Auto_Create_Array}
                        config={this.props.config}
                      />
                      {(this.props.posMountStatus === "EXIST_NORMAL") ? (
                        <Typography style={{ color: "#b11b1b" }} variant="h5" align="center">Poseidon OS is not Mounted !!!</Typography>
                      ) : null}
                    </Grid>
                  </Grid>
                </Route>
                <Route path="/storage/array/manage*">
                  <>
                    {this.props.arrayMap[this.props.selectedArray] ? (
                      <React.Fragment>
                        <Grid container spacing={1} className={classes.card}>
                          <Grid item xs={12}>
                            <Paper spacing={3} className={classes.spaced}>
                              <Grid container justifyContent="space-between">
                                <Grid container className={classes.arraySelectStatus}>
                                  <Grid item sm={6} className={classes.arraySelectGrid}>
                                    <FormControl
                                      className={classes.selectForm}
                                      data-testid="arrayshow-form"
                                    >
                                      <InputLabel htmlFor="select-array">Select Array</InputLabel>
                                      <Select
                                        inputProps={{
                                          id: "select-array",
                                          "data-testid": "select-array-input",
                                        }}
                                        SelectDisplayProps={{
                                          style: {
                                            overflow: "hidden",
                                            textOverflow: "ellipsis"
                                          },
                                          "data-testid": "select-array",
                                        }}
                                        onChange={this.changeArray}
                                        value={this.props.selectedArray}
                                        className={classes.arraySelect}
                                      >
                                        {this.props.arrays.map((array) => (
                                          <MenuItem key={array.arrayname} value={array.arrayname}>
                                            <Typography color="secondary">{array.arrayname}</Typography>
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                  <Typography className={classes.statusText}>Status:
                                    <span
                                      style={{
                                        fontWeight: 600,
                                        color: this.props.arrayMap[this.props.selectedArray].status === "Mounted" ? "green" : "orange"
                                      }}
                                    >
                                      {this.props.arrayMap[this.props.selectedArray].status}
                                    </span>
                                    <Grid container>, <span data-testid="array-show-status">{this.props.arrayMap[this.props.selectedArray].situation}</span>
                                      {this.props.arrayMap[this.props.selectedArray].situation === "REBUILDING" ? (
                                        <InfoIcon
                                          aria-owns={openPopover ? 'rebuild-popover' : undefined}
                                          aria-haspopup="true"
                                          color="primary"
                                          data-testid="rebuild-popover-icon"
                                          onClick={this.openRebuildPopover}
                                          onBlur={this.closeRebuildPopover}
                                        />
                                      ) : null
                                      }
                                    </Grid>
                                  </Typography>
                                  {this.props.arrayMap[this.props.selectedArray].rebuildProgress ? (
                                    <Popover
                                      id="rebuild-popover"
                                      open={openPopover}
                                      anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "left"
                                      }}
                                      transformOrigin={{
                                        vertical: "top",
                                        horizontal: "left"
                                      }}
                                      anchorEl={this.state.rebuildPopoverElement}
                                      onClose={this.closeRebuildPopover}
                                      disableRestoreFocus
                                    >
                                      <RebuildProgress
                                        arrayMap={this.props.arrayMap}
                                        array={this.props.selectedArray}
                                        progress={this.props.arrayMap[this.props.selectedArray].rebuildProgress}
                                        rebuildTime={this.props.arrayMap[this.props.selectedArray].rebuildTime}
                                      />
                                    </Popover>
                                  ) : null}
                                </Grid>
                                <ArrayShow
                                  RAIDLevel={this.props.arrayMap[this.props.selectedArray].RAIDLevel}
                                  slots={this.props.ssds}
                                  arrayName={this.props.selectedArray}
                                  corrupted={this.props.arrayMap[this.props.selectedArray].corrupted}
                                  storagedisks={this.props.arrayMap[this.props.selectedArray].storagedisks}
                                  sparedisks={this.props.arrayMap[this.props.selectedArray].sparedisks}
                                  metadiskpath={this.props.arrayMap[this.props.selectedArray].metadiskpath}
                                  writebufferdisks={this.props.arrayMap[this.props.selectedArray].writebufferdisks}
                                  deleteArray={this.deleteArray}
                                  writeThrough={this.props.arrayMap[this.props.selectedArray].writeThroughEnabled}
                                  diskDetails={this.props.diskDetails}
                                  getDiskDetails={this.props.Get_Disk_Details}
                                  // detachDisk={this.props.Detach_Disk}
                                  // attachDisk={this.props.Attach_Disk}
                                  addSpareDisk={this.props.Add_Spare_Disk}
                                  removeSpareDisk={this.props.Remove_Spare_Disk}
                                  mountStatus={this.props.arrayMap[this.props.selectedArray].status}
                                  handleUnmountPOS={this.props.Unmount_POS}
                                  handleMountPOS={this.props.Mount_POS}
                                  getArrayInfo={this.props.Get_Array_Info}
                                  getDevices={this.props.Get_Devices}
                                />
                              </Grid>
                            </Paper>
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          spacing={1}
                          className={classes.card}
                          style={{
                            opacity: this.props.arrayMap[this.props.selectedArray].status !== "Mounted" ? 0.5 : 1,
                            pointerEvents:
                              this.props.arrayMap[this.props.selectedArray].status !== "Mounted"
                                ? "none"
                                : "initial",
                          }}
                        >
                          <Grid item xs={12} md={6} className={classes.spaced}>
                            <CreateVolume
                              data-testid="createvolume"
                              createVolume={this.createVolume}
                              subsystems={this.props.subsystems}
                              array={this.props.selectedArray}
                              maxVolumeCount={this.props.maxVolumeCount}
                              volCount={this.props.volumes.length}
                              maxAvailableSize={
                                this.props.arrayMap[this.props.selectedArray].totalsize - totalVolSize
                              }
                              createVolSocket={this.state.createVolSocket}
                              fetchVolumes={this.fetchVolumes}
                              fetchArray={this.props.Get_Array}
                              fetchSubsystems={this.props.Get_Subsystems}
                            />
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Paper className={classes.volumeStatsPaper}>
                              <Grid item xs={12}>
                                <Typography className={classes.cardHeader}>
                                  Volume Statistics
                                </Typography>
                              </Grid>
                              <div className={classes.statsWrapper}>
                                <Grid item xs={12}>
                                  <Typography color="secondary">
                                    Number of volumes: {this.props.volumes.length}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} className={classes.statsContainer}>
                                  <Box className={classes.volumeStats}>
                                    <div style={volumeFilledStyle} />
                                    <div style={volumeFreeStyle} />
                                  </Box>
                                  <Grid
                                    item
                                    container
                                    xs={12}
                                    wrap="wrap"
                                    className={classes.legendContainer}
                                  >
                                    <Legend
                                      bgColor="rgba(51, 158, 255,0.6)"
                                      title={`
                          Used Space :
                          ${formatBytes(totalVolSize)}
                        `}
                                    />
                                    <Legend
                                      bgColor="rgba(0, 186, 0, 0.6)"
                                      title={`
                          Available for Volume Creation :
                          ${formatBytes(
                                        this.props.arrayMap[this.props.selectedArray].totalsize - totalVolSize
                                      )}
                        `}
                                    />
                                  </Grid>
                                </Grid>
                              </div>
                            </Paper>
                          </Grid>
                        </Grid>

                        <Grid
                          container
                          spacing={1}
                          className={classes.card}
                          style={{
                            opacity: this.props.arrayMap[this.props.selectedArray].status !== "Mounted" ? 0.5 : 1,
                            pointerEvents:
                              this.props.arrayMap[this.props.selectedArray].status !== "Mounted"
                                ? "none"
                                : "initial",
                          }}
                        >
                          <Grid item xs={12}>
                            <VolumeList
                              ref={this.child}
                              volumeFetch={this.fetchVolumes}
                              volumes={this.props.volumes}
                              fetchingVolumes={this.props.fetchingVolumes}
                              deleteVolumes={this.deleteVolumes}
                              resetQoS={this.props.Reset_Volume_QoS}
                              editVolume={this.props.Edit_Volume}
                              changeField={this.props.Change_Volume_Field}
                              fetchVolumes={this.fetchVolumes}
                              saveVolume={this.props.Reset_And_Update_Volume}
                              changeMountStatus={this.changeMountStatus}
                              changeMinType={this.props.Change_Min_Type}
                              changeResetType={this.props.Change_Reset_Type}
                            />
                          </Grid>
                        </Grid>
                      </React.Fragment>
                    ) : null}
                  </>
                </Route>
              </Switch>
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
              <SelectSubsystem
                title="Select a subsystem"
                open={this.state.mountOpen}
                subsystems={this.props.subsystems}
                handleChange={this.changeMountSubsystem}
                selectedSubsystem={this.state.mountSubsystem}
                handleClose={this.closeMountPopup}
                array={this.props.selectedArray}
                volume={this.state.volumeForMount}
                mountVolume={this.state.mountConfirm}
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
    ssds: state.storageReducer.ssds,
    metadisks: state.storageReducer.metadisks,
    volumes: state.storageReducer.volumes,
    fetchingVolumes: state.storageReducer.fetchingVolumes,
    arrays: state.storageReducer.arrays,
    arrayMap: state.storageReducer.arrayMap,
    config: state.storageReducer.config,
    selectedArray: state.storageReducer.arrayname,
    loading: state.storageReducer.loading,
    subsystems: state.subsystemReducer.subsystems,
    alertOpen: state.storageReducer.alertOpen,
    alertType: state.storageReducer.alertType,
    alertTitle: state.storageReducer.alertTitle,
    alertLink: state.storageReducer.alertLink,
    alertLinkText: state.storageReducer.alertLinkText,
    errorMsg: state.storageReducer.errorMsg,
    errorCode: state.storageReducer.errorCode,
    arraySize: state.storageReducer.arraySize,
    maxVolumeCount: state.storageReducer.maxVolumeCount,
    totalVolSize: state.storageReducer.totalVolSize,
    slots: state.storageReducer.slots,
    arrayExists: state.storageReducer.arrayExists,
    selectedRaid: state.storageReducer.selectedRaid,
    RAIDLevel: state.storageReducer.RAIDLevel,
    diskDetails: state.storageReducer.diskDetails,
    loadText: state.storageReducer.loadText,
    mountStatus: state.storageReducer.mountStatus,
    posMountStatus: state.headerReducer.state
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    Get_Devices: (payload) =>
      dispatch({ type: actionTypes.SAGA_FETCH_DEVICE_INFO, payload }),
    Create_Volume: (payload) =>
      dispatch({ type: actionTypes.SAGA_SAVE_VOLUME, payload }),
    Get_Array_Size: () => dispatch({ type: actionTypes.SAGA_FETCH_ARRAY_SIZE }),
    Get_Array: () => dispatch({ type: actionTypes.SAGA_FETCH_ARRAY }),
    Delete_Array: (payload) =>
      dispatch({ type: actionTypes.SAGA_DELETE_ARRAY, payload }),
    Get_Volumes: (payload) => dispatch({ type: actionTypes.SAGA_FETCH_VOLUMES, payload }),
    Get_Config: () => dispatch({ type: actionTypes.SAGA_FETCH_CONFIG }),
    Delete_Volumes: (payload) =>
      dispatch({ type: actionTypes.SAGA_DELETE_VOLUMES, payload }),
    Close_Alert: () => dispatch({ type: actionTypes.STORAGE_CLOSE_ALERT }),
    Create_Array: (payload) =>
      dispatch({ type: actionTypes.SAGA_CREATE_ARRAY, payload }),
    Get_Disk_Details: (payload) =>
      dispatch({ type: actionTypes.SAGA_FETCH_DEVICE_DETAILS, payload }),
    Edit_Volume: (payload) =>
      dispatch({ type: actionTypes.EDIT_VOLUME, payload }),
    Change_Mount_Status: (payload) =>
      dispatch({ type: actionTypes.SAGA_VOLUME_MOUNT_CHANGE, payload }),
    Change_Volume_Field: (payload) =>
      dispatch({ type: actionTypes.CHANGE_VOLUME_FIELD, payload }),
    Change_Min_Type: (payload) =>
      dispatch({ type: actionTypes.CHANGE_MIN_TYPE, payload }),
    Change_Reset_Type: (payload) =>
      dispatch({ type: actionTypes.CHANGE_RESET_TYPE, payload }),
    Reset_And_Update_Volume: (payload) =>
      dispatch({ type: actionTypes.SAGA_RESET_AND_UPDATE_VOLUME, payload }),
    // Detach_Disk: (payload) => dispatch({ type: actionTypes.SAGA_DETACH_DISK, payload }),
    // Attach_Disk: (payload) => dispatch({ type: actionTypes.SAGA_ATTACH_DISK, payload }),
    Add_Spare_Disk: (payload) =>
      dispatch({ type: actionTypes.SAGA_ADD_SPARE_DISK, payload }),
    Remove_Spare_Disk: (payload) =>
      dispatch({ type: actionTypes.SAGA_REMOVE_SPARE_DISK, payload }),
    Get_Max_Volume_Count: () =>
      dispatch({ type: actionTypes.SAGA_FETCH_MAX_VOLUME_COUNT }),
    Unmount_POS: () => dispatch({ type: actionTypes.SAGA_UNMOUNT_POS }),
    Mount_POS: (payload) => dispatch({ type: actionTypes.SAGA_MOUNT_POS, payload }),
    Set_Array: (payload) => dispatch({ type: actionTypes.SET_ARRAY, payload }),
    Select_Raid: (payload) => dispatch({ type: actionTypes.SELECT_RAID, payload }),
    Get_Subsystems: () => dispatch({ type: actionTypes.SAGA_FETCH_SUBSYSTEMS }),
    Show_Storage_Alert: (payload) => dispatch({ type: actionTypes.STORAGE_SHOW_ALERT, payload }),
    Auto_Create_Array: (payload) => dispatch({ type: actionTypes.SAGA_AUTO_CREATE_ARRAY, payload }),
    Reset_Volume_QoS: (payload) => dispatch({ type: actionTypes.SAGA_RESET_VOLUME_QOS, payload }),
    Get_Array_Info: (payload) => dispatch({ type: actionTypes.SAGA_GET_ARRAY_INFO, payload })
  };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withRouter(Volume))
);
