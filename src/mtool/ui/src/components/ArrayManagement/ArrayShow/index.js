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
  GridListTile,
} from "@material-ui/core";
import { Add, Remove, SwapHorizOutlined } from "@material-ui/icons";
import formatBytes from "../../../utils/format-bytes";
import AlertDialog from "../../Dialog";
import DiskDetails from "../../DiskDetails";
import "../CreateArray/CreateArray.css";
import { customTheme, PageTheme } from "../../../theme";
import Legend from "../../Legend";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    width: `calc(100% - ${theme.spacing(4)}px)`,
    padding: theme.spacing(0, 2),
    [theme.breakpoints.down("sm")]: {
      width: `calc(100% - ${theme.spacing(2)}px)`,
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
    width: "60%",
    minWidth: "170px",
    [theme.breakpoints.down("xs")]: {
      margin: theme.spacing(1, 0),
      width: "80%"
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
    minWidth: 24,
    border: "2px solid lightgray",
    display: "flex",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    "&>div": {
      display: "flex",
      height: "100%",
      justifyContent: "space-evenly",
      flexDirection: "column"
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
    justifyContent: "space-between",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(0, 2),
    minWidth: 800,
  },
  legendContainer: {
    padding: theme.spacing(0, 2),
    justifyContent: "flex-end"
  },
  buttonContainer: {
    justifyContent: "flex-start",
    gap: "8px",
    padding: theme.spacing(0, 2),
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down("xs")]: {
      justifyContent: "space-between",
    },

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
  sparedisk: {
    backgroundColor: "#339EFF",
    cursor: "default",
  },
  freedisk: {
    backgroundColor: "rgb(137,163,196)",
    cursor: "default",
  },
  usedDisk: {
    backgroundColor: "#A87B6A"
  },
  detachBtn: {
    minWidth: 20,
    width: 20,
    height: 20,
    borderRadius: 100,
    borderColor: customTheme.palette.primary.main,
    padding: 0,
  },
  diskNo: {
    textAlign: "center",
    fontSize: 12,
    color: customTheme.palette.primary.dark
  },
  diskTextNuma: {
    top: 8,
    width: 20,
    height: 20,
    textAlign: "center",
    background: "#087575",
    color: "white",
    borderRadius: 100
  },
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

const DEFAULT_TITLE = "";
const ADD_TITLE = "ADD_TITLE";
const REMOVE_TITLE = "REMOVE_TITLE";
const REPLACE_TITLE = "REPLACE_TITLE";

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
      writeThroughMode: this.props.writeThrough,
      diskTitle: DEFAULT_TITLE
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
    this.addSpareDisk = this.addSpareDisk.bind(this);
    this.removeSpareDisk = this.removeSpareDisk.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
  }

  componentDidMount() {
    this.props.getArrayInfo(this.props.arrayName);
    this.props.getDevices({ noLoad: true });
    this.interval = setInterval(() => {
      if (!this.props.isArrayInfoFetching) {
        this.props.getArrayInfo(this.props.arrayName);
      }
      if (!this.props.isDevicesFetching) {
        this.props.getDevices({ noLoad: true });
      }
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
    this.setState({
      ...this.state,
      writeThroughMode: this.props.writeThrough
    })
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

  changeTitle(title) {
    this.setState({
      diskTitle: title
    })
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

  replaceDevice(slot) {
    this.setState({
      selectedSlot: slot,
      messageOpen: true,
      messageDescription: "Are you sure you want to Replace this Device?",
      messageTitle: "Replace Device",
      onConfirm: () => {
        this.props.replaceDevice(this.state.selectedSlot);
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
          <GridListTile key={i} className={`${classes.gridTile} ${classes.gridTileDisabled}`}>
            <Typography className={classes.diskNo}>
              {i + 1}
            </Typography>
          </GridListTile>
        );
      }
    }

    const getClass = (disk) => {
      if (this.props.storagedisks.find(findDisk(disk.name))) {
        return classes.storagedisk;
      }
      if (this.props.sparedisks.find(findDisk(disk.name))) {
        return classes.sparedisk;
      }

      if (!disk.isAvailable) {
        return classes.usedDisk;
      }

      return classes.freedisk;
    };

    let isFreeDiskAvailable = false;
    this.props.slots.forEach(slot => {
      if (slot.arrayName === this.props.arrayName && getClass(slot) === classes.sparedisk)
        isFreeDiskAvailable = true;
    })

    const getTitle = (slot) => {
      if (this.state.diskTitle === ADD_TITLE)
        return "Add Spare Disk"
      if (this.state.diskTitle === REMOVE_TITLE)
        return "Remove Spare Disk"
      if (this.state.diskTitle === REPLACE_TITLE)
        return "Replace Disk"
      return (
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
      );
    }

    return (
      <ThemeProvider theme={PageTheme}>
        <form className={classes.root} data-testid="arrayshow">
          <Grid item xs={12} sm={6} lg={4} className={classes.inputGrid}>
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
          <Grid item xs={12} sm={6} lg={4} className={classes.inputGrid}>
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
          <Grid item xs={12} sm={6} lg={4} className={classes.inputGrid}>
            <FormControl className={classes.formControl}>
              <FormControlLabel
                control={(
                  <Checkbox
                    name="mount_arr_writethrough"
                    color="primary"
                    id="mount-writethrough-checkbox"
                    checked={this.props.mountStatus === "Mounted" ? this.props.writeThrough : this.state.writeThroughMode}
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
          </Grid>
          <Grid
            item
            container
            wrap="wrap"
            className={classes.legendContainer}
          >
            <Legend bgColor="rgba(236, 219, 87,0.6)" title="Storage disk" />
            <Legend bgColor="rgba(51, 158, 255, 0.6)" title="Spare disk" />
            <Legend bgColor="rgb(137,163,196)" title="Free disk" />
            <Legend bgColor="#A87B6A" title="Used by Another Array" />
            <Legend bgColor="rgba(226, 225, 225, 0.6)" title="Empty Slot" />
            <Legend bgColor="#087575" title="NUMA" />
          </Grid>
          <div className={classes.diskGridContainer}>
            <Grid container className={classes.diskContainer}>
              <GridList cellHeight={90} className={classes.gridList} cols={32}>
                {this.props.slots
                  ? this.props.slots.map((slot, index) => {
                    return (
                      <Tooltip
                        classes={{
                          tooltip: classes.tooltip,
                        }}
                        key={slot.name}
                        title={getTitle(slot)}
                        interactive
                      >
                        <GridListTile
                          className={`${classes.gridTile} ${getClass(slot)}`}
                          id={index}
                          data-testid={`diskshow-${index}`}
                        >
                          <Typography className={classes.diskTextNuma}>{slot.numa}</Typography>
                          <Typography
                            className={classes.diskNo}
                          >
                            {index + 1}
                          </Typography>
                          {getClass(slot) === classes.freedisk ? (
                            <Button
                              onMouseEnter={() => this.changeTitle(ADD_TITLE)}
                              onMouseLeave={() => this.changeTitle(DEFAULT_TITLE)}
                              variant="outlined"
                              color="primary"
                              className={classes.detachBtn}
                              data-testid={`attachdisk-${index}`}
                              onClick={() => this.addSpareDisk(slot)}
                              aria-label={`attach-disk-${index}`}
                            >
                              <Add fontSize="small" />
                            </Button>
                          ) : getClass(slot) === classes.sparedisk ? (
                            <Button
                              onMouseEnter={() => this.changeTitle(REMOVE_TITLE)}
                              onMouseLeave={() => this.changeTitle(DEFAULT_TITLE)}
                              variant="outlined"
                              color="primary"
                              className={classes.detachBtn}
                              data-testid={`detachdisk-${index}`}
                              onClick={() => this.removeSpareDisk(slot)}
                              aria-label={`detach-disk-${index}`}
                            >
                              <Remove fontSize="small" />
                            </Button>
                          ) : slot.arrayName === this.props.arrayName && isFreeDiskAvailable ? (
                            <Button
                              onMouseEnter={() => this.changeTitle(REPLACE_TITLE)}
                              onMouseLeave={() => this.changeTitle(DEFAULT_TITLE)}
                              variant="outlined"
                              color="primary"
                              className={classes.detachBtn}
                              data-testid={`replacedisk-${index}`}
                              onClick={() => this.replaceDevice(slot)}
                              aria-label={`replace-disk-${index}`}
                            >
                              <SwapHorizOutlined fontSize="small" />
                            </Button>
                          ) : <p />}
                        </GridListTile>
                      </Tooltip>
                    );
                  })
                  : null}
                {freeSlots}
              </GridList>
            </Grid>
          </div>
          <Grid
            item
            container
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
                  aria-label="mount-array"
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
                  color="secondary"
                  aria-label="unmount-array"
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
                variant="outlined"
                color="secondary"
                aria-label="delete-array"
              >
                Delete Array
              </Button>
            </Tooltip>
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
