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

/* eslint-disable no-nested-ternary */

import React, { Component } from "react";
import "react-dropdown/style.css";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles, MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles';
import {
  Button,
  Checkbox,
  Grid,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  GridList,
  Typography,
  MenuItem,
} from "@material-ui/core";
import formatBytes from "../../../utils/format-bytes";
import AlertDialog from "../../Dialog";
import DiskDetails from "../../DiskDetails";
import "../ArrayCreate/ArrayCreate.css";
import { PageTheme } from "../../../theme";
import Legend from "../../Legend";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    width: `calc(100% - ${theme.spacing(4)}px)`,
    padding: theme.spacing(0, 2),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(0, 1),
    },
  },
  tooltip: {
    backgroundColor: "#f5f5f9",
    opacity: 1,
    color: "rgba(0, 0, 0, 1)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
    "& b": {
      fontWeight: theme.typography.fontWeightMedium,
    },
  },
  formControl: {
    margin: theme.spacing(0.5, 2),
    minWidth: 170,
    [theme.breakpoints.down("xs")]: {
      margin: theme.spacing(1, 0),
    },
  },
  gridList: {
    flexWrap: "nowrap",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)",
    flexGrow: 1,
    padding: theme.spacing(1, 0),
  },
  gridTile: {
    width: 200,
    minWidth: 35,
    border: "2px solid lightgray",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    flexDirection: "column",
    "&>div": {
      height: "auto",
    },
  },
  gridTileDisabled: {
    backgroundColor: "#e2e1e1",
  },
  diskGridContainer: {
    width: "100%",
    overflowX: "auto",
    [theme.breakpoints.down("xs")]: {
      width: "calc(100% - 32px)",
    },
  },
  diskContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2, 2, 0, 2),
    minWidth: 800,
  },
  legendButtonGrid: {
    marginBottom: theme.spacing(1),
  },
  legendContainer: {
    padding: theme.spacing(0, 2),
  },
  buttonContainer: {
    justifyContent: "flex-end",
    padding: theme.spacing(0, 2, 0, 0),
    // paddingLeft:"0px",
    marginTop: theme.spacing(0.5),
    [theme.breakpoints.down("xs")]: {
      justifyContent: "center",
    },
  },

  button: {
    height: "1.8rem",
    lineHeight: "0px",
    marginLeft: "2px",
    marginBottom: "4px",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing(0.5),
  },
  inputGrid: {
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      justifyContent: "center",
    },
  },
  storagedisk: {
    backgroundColor: "rgb(236,219,87)",
    cursor: "default",
  },
  writebufferdisk: {
    backgroundColor: "rgb(232,114,114)",
    cursor: "default",
  },
  sparedisk: {
    backgroundColor: "#339EFF",
    cursor: "default",
  },
  freedisk: {
    backgroundColor: "rgb(137,163,196)",
    cursor: "default",
  },
  partOfArray: {
    backgroundColor: "rgb(236, 219, 87)",
  },
  notSelectedShow: {
    backgroundColor: "rgb(137, 163, 196)",
  },
  corrupted: {
    backgroundColor: "rgb(232, 114, 114)",
  },
  detachBtn: {
    bottom: "-3px",
    width: "80%",
    position: "absolute",
    fontSize: "0.6rem",
  },
  diskNo: {
    position: "absolute",
  },
  diskTextNuma: {
    top: 8,
    position: "absolute",
    background: "#087575",
    textAlign: "center",
    color: "white",
    width: 20,
    height: 20,
    borderRadius: 100
  },
  usedDisk: {
    backgroundColor: "#8c6b5d"
  }
});

const defaultDiskDetails = {
  DevicePath: "NA",
  SerialNumber: "NA",
  Model: "NA",
  PhysicalSize: "NA",
  UsedBytes: "NA",
  Firmware: "NA",
  critical_warning: "NA",
  temperature: "NA",
  avail_spare: "NA",
  spare_thresh: "NA",
  precent_used: "NA",
  data_units_read: "NA",
  data_units_written: "NA",
  critical_comp_time: "NA",
  warning_temp_time: "NA",
  percent_used: "NA",
};

const findDisk = (diskName) => {
  return (d) => {
    return d.deviceName === diskName;
  };
};

class ArrayShow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      diskDetails: { ...defaultDiskDetails },
      popupOpen: false,
      messageDescription: "",
      messageOpen: "",
      messageTitle: "",
      selectedSlot: null,
      onConfirm: null,
      writeThroughMode: this.props.writeThrough
    };
    this.interval = null;
    this.handleClick = this.handleClick.bind(this);
    this.handleMountClick = this.handleMountClick.bind(this);
    this.handleUnmountClick = this.handleUnmountClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.showPopup = this.showPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.deleteArray = this.deleteArray.bind(this);
    this.getDiskDetails = this.getDiskDetails.bind(this);
    // this.attachDisk = this.attachDisk.bind(this);
    // this.detachDisk = this.detachDisk.bind(this);
    this.addSpareDisk = this.addSpareDisk.bind(this);
    this.removeSpareDisk = this.removeSpareDisk.bind(this);
  }

  componentDidMount() {
    this.props.getArrayInfo(this.props.arrayName);
    this.props.getDevices({ noLoad: true });
    this.interval = setInterval(() => {
      this.props.getArrayInfo(this.props.arrayName);
      this.props.getDevices({ noLoad: true });
    }, 5000);
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  handleClick(event) {
    event.preventDefault();
    this.setState({
      open: true,
    });
  }

  handleUnmountClick() {
    this.props.handleUnmountPOS();
  }

  handleMountClick() {
    this.props.handleMountPOS({
      writeThrough: this.state.writeThroughMode,
      array: this.props.arrayName
    });
  }

  handleClose() {
    this.setState({
      open: false,
      popupOpen: false,
      messageOpen: false,
      diskDetails: { ...defaultDiskDetails },
    });
  }

  getDiskDetails(name) {
    this.props.getDiskDetails({ name });
  }

  showPopup(name) {
    this.getDiskDetails(name);
    this.setState({
      ...this.state,
      popupOpen: true,
    });
  }

  closePopup() {
    this.setState({
      ...this.state,
      popupOpen: false,
    });
  }

  deleteArray() {
    this.setState({
      open: false,
    });
    this.props.deleteArray();
  }

  // attachDisk(slot) {
  //   this.setState({
  //     selectedSlot: slot,
  //     messageOpen: true,
  //     messageDescription: 'Are you sure you want to Attach Disk?',
  //     messageTitle: 'Attach Disk',
  //     onConfirm: () => {
  //       this.props.attachDisk(this.state.selectedSlot);
  //       this.setState({
  //         messageOpen: false
  //       });
  //     }
  //   })
  // }

  addSpareDisk(slot) {
    this.setState({
      selectedSlot: slot,
      messageOpen: true,
      messageDescription: "Are you sure you want to Add the Disk?",
      messageTitle: "Add Spare Disk",
      onConfirm: () => {
        this.props.addSpareDisk(this.state.selectedSlot);
        this.setState({
          messageOpen: false,
        });
      },
    });
  }

  // detachDisk(slot) {
  //   this.setState({
  //     selectedSlot: slot,
  //     messageOpen: true,
  //     messageDescription: 'Are you sure you want to Detach Disk?',
  //     messageTitle: 'Detach Disk',
  //     onConfirm: () => {
  //       this.props.detachDisk(this.state.selectedSlot);
  //       this.setState({
  //         messageOpen: false
  //       });
  //     }
  //   })
  // }

  removeSpareDisk(slot) {
    this.setState({
      selectedSlot: slot,
      messageOpen: true,
      messageDescription: "Are you sure you want to Remove the Disk?",
      messageTitle: "Remove Spare Disk",
      onConfirm: () => {
        this.props.removeSpareDisk(this.state.selectedSlot);
        this.setState({
          messageOpen: false,
        });
      },
    });
  }

  render() {
    const { classes } = this.props;
    const freeSlots = [];
    /* istanbul ignore else */
    if (this.props.slots) {
      for (let i = this.props.slots.length; i < 32; i += 1) {
        freeSlots.push(
          <Grid key={i} className={`${classes.gridTile} ${classes.gridTileDisabled}`}>
            <Typography color="secondary" className={classes.diskNo}>
              {i + 1}
            </Typography>
          </Grid>
        );
      }
    }
    const getClass = (disk) => {
      if (this.props.storagedisks.find(findDisk(disk.name))) {
        return classes.storagedisk;
      }
      // Required only if Buffer disks can be one of the Nvme disk
      // if (this.props.writebufferdisks.find(findDisk(disk.name))) {
      //   return classes.writebufferdisk;
      // }
      if (this.props.sparedisks.find(findDisk(disk.name))) {
        return classes.sparedisk;
      }

      if (!disk.isAvailable) {
        return classes.usedDisk;
      }

      return classes.freedisk;
    };
    return (
      <ThemeProvider theme={PageTheme}>
        <form className={classes.root} data-testid="arrayshow">
          <Grid item xs={12} sm={6} className={classes.inputGrid}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="raid">Fault tolerance Level</InputLabel>
              <Select
                value={this.props.RAIDLevel}
                inputProps={{
                  name: "Fault Tolerance Type",
                  id: "raid",
                }}
                disabled
              >
                <MenuItem value={this.props.RAIDLevel}>
                  {this.props.RAIDLevel}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.inputGrid}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="writebuffer">Write Buffer Path</InputLabel>
              <Select
                value={this.props.metadiskpath && this.props.metadiskpath.length > 0 ? this.props.metadiskpath[0].deviceName : ""}
                inputProps={{
                  name: "Write Buffer Path",
                  id: "writebuffer",
                }}
                disabled
              >
               {this.props.metadiskpath && this.props.metadiskpath[0] && (
                <MenuItem value={this.props.metadiskpath[0].deviceName}>
                  {this.props.metadiskpath[0].deviceName}
                </MenuItem>
               )}
              </Select>
            </FormControl>
          </Grid>
          <FormControl className={classes.formControl}>
            <FormControlLabel
              control={(
                <Checkbox
                  name="mount_arr_writethrough"
                  color="primary"
                  id="mount-writethrough-checkbox"
                  checked={this.state.writeThroughMode}
                  disabled={this.props.mountStatus === "Mounted"}
                  value="Write Through Mode"
                  inputProps={{
                    "data-testid": "mount-writethrough-checkbox",
                  }}
                  onChange={() => this.setState({
                    ...this.state,
                    writeThroughMode: !this.state.writeThroughMode
                  })}
                />
              )}
              label="Write Through Mode"
            />
          </FormControl>
          <div className={classes.diskGridContainer}>
            <Grid container className={classes.diskContainer}>
              <GridList cellHeight={110} className={classes.gridList} cols={32}>
                {this.props.slots
                  ? this.props.slots.map((slot, index) => {
                    return (
                      <Tooltip
                        classes={{
                          tooltip: classes.tooltip,
                        }}
                        key={slot.name}
                        title={(
                          <React.Fragment>
                            <div>
                              Name:
                              {slot.name}
                            </div>
                            <div>
                              Size:
                              {formatBytes(slot.size)}
                            </div>
                            <div>
                              NUMA: {slot.numa}
                            </div>
                            <div
                              onClick={() => this.showPopup(slot.name)}
                              aria-hidden="true"
                              style={{
                                cursor: "pointer",
                                textAlign: "right",
                                margin: "10px",
                              }}
                            >
                              <u>More Details</u>
                            </div>
                          </React.Fragment>
                        )}
                        interactive
                      >
                        <Grid
                          className={`${classes.gridTile} ${getClass(slot)}`}
                          id={index}
                          data-testid={`diskshow-${index}`}
                        >
                          <Typography className={classes.diskTextNuma}>{slot.numa}</Typography>
                          <Typography
                            color="secondary"
                            className={classes.diskNo}
                          >
                            {index + 1}
                          </Typography>
                          {getClass(slot) === classes.freedisk ? (
                            <Button
                              className={classes.detachBtn}
                              data-testid={`attachdisk-${index}`}
                              onClick={() => this.addSpareDisk(slot)}
                            >
                              Add Spare Disk
                            </Button>
                          ) : getClass(slot) === classes.sparedisk ? (
                            <Button
                              className={classes.detachBtn}
                              data-testid={`detachdisk-${index}`}
                              onClick={() => this.removeSpareDisk(slot)}
                            >
                              Remove Spare Disk
                            </Button>
                          ) : <p />}

                          {/* {(getClass(slot) === classes.freedisk) ? (
                        <Button
                          className={classes.detachBtn}
                          data-testid={`attachdisk-${index}`}
                          onClick={() => this.attachDisk(slot)}
                        >Attach</Button>
                      ) : (
                        <Button
                          className={classes.detachBtn}
                          data-testid={`detachdisk-${index}`}
                          onClick={() => this.detachDisk(slot)}
                        >Detach</Button>
                      )} */}
                        </Grid>
                      </Tooltip>
                    );
                  })
                  : /* istanbul ignore next */ null}
                {freeSlots}
              </GridList>
            </Grid>
          </div>
          <Grid container className={classes.legendButtonGrid}>
            <Grid
              item
              container
              sm={8}
              xs={12}
              wrap="wrap"
              className={classes.legendContainer}
            >
              <Legend bgColor="rgba(236, 219, 87,0.6)" title="Storage disk" />
              <Legend bgColor="rgba(51, 158, 255, 0.6)" title="Spare disk" />
              <Legend bgColor="#8c6b5d" title="Used by Another Array" />
              <Legend bgColor="rgba(137, 163, 196, 0.6)" title="Not Selected" />
              <Legend bgColor="rgba(226, 225, 225, 0.6)" title="Empty Slot" />
              <Legend bgColor="#087575" title="NUMA" />
            </Grid>
            <Grid
              item
              container
              sm={4}
              xs={12}
              className={classes.buttonContainer}
            >
              {this.props.mountStatus !== "Mounted" ? (
                <Tooltip
                  title="Mount the array to perform volume level operations"
                  placement="bottom-start"
                  classes={{
                    tooltip: classes.tooltip,
                  }}
                >
                  <Button
                    onClick={this.handleMountClick}
                    variant="contained"
                    color="primary"
                    className={classes.button}
                  >
                    Mount Array
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip
                  title="Unmounting the array will disable all the volume level operations for the user"
                  placement="bottom-start"
                  classes={{
                    tooltip: classes.tooltip,
                  }}
                >
                  <Button
                    onClick={this.handleUnmountClick}
                    variant="contained"
                    color="primary"
                    className={classes.button}
                  >
                    Unmount Array
                  </Button>
                </Tooltip>
              )}
              <Tooltip
                title="Delete array will delete the array and the volumes in it"
                placement="bottom-start"
                classes={{
                  tooltip: classes.tooltip,
                }}
              >
                <Button
                  onClick={this.handleClick}
                  variant="contained"
                  color="primary"
                  className={classes.button}
                >
                  Delete Array
                </Button>
              </Tooltip>
            </Grid>
          </Grid>
          <AlertDialog
            title="Delete Array"
            description="Are you sure you want to delete the array?"
            open={this.state.open}
            handleClose={this.handleClose}
            onConfirm={this.deleteArray}
          />
          <AlertDialog
            title={this.state.messageTitle}
            description={this.state.messageDescription}
            open={this.state.messageOpen}
            handleClose={this.handleClose}
            onConfirm={this.state.onConfirm}
          />
          <DiskDetails
            title="Disk Details"
            details={this.props.diskDetails}
            open={this.state.popupOpen}
            onConfirm={this.closePopup}
          />
        </form>
      </ThemeProvider>
    );
  }
}

export default withStyles(styles)(ArrayShow);
