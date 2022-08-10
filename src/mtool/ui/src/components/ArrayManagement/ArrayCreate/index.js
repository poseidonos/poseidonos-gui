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
import "react-dropdown/style.css";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles, MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Grid,
  GridList,
  GridListTile,
  Button,
  TextField,
  Link,
} from "@material-ui/core";
import formatBytes from "../../../utils/format-bytes";
import MToolLoader from "../../MToolLoader";
import AlertDialog from "../../Dialog";
import DiskDetails from "../../DiskDetails";
import "./ArrayCreate.css";
import { PageTheme } from "../../../theme";
import Legend from "../../Legend";

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
  createDiskIcon: {
    marginTop: theme.spacing(3)
  },
  formControl: {
    margin: theme.spacing(0.5, 2),
    minWidth: 170,
    maxWidth: "80%",
    [theme.breakpoints.down("xs")]: {
      margin: theme.spacing(1, 0),
    }
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
  writeBufferSelect: {
    "&>div>p": {
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  },
  diskContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(0, 2),
    minWidth: 800,
  },
  tooltipText: {
    margin: 10
  },
  diskText: {
    textAlign: "center",
    fontSize: 12
  },
  diskTextNuma: {
    top: 8,
    background: "#087575",
    textAlign: "center",
    color: "white",
    width: 20,
    height: 20,
    borderRadius: 100
  },
  legendContainer: {
    padding: theme.spacing(0, 2),
    justifyContent: "flex-end"
  },
  buttonContainer: {
    justifyContent: "center",
    padding: theme.spacing(0, 2),
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(1)
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
  partOfArray: {
    backgroundColor: "rgb(236, 219, 87)",
  },
  notSelectedShow: {
    backgroundColor: "rgb(137, 163, 196)",
  },
  corrupted: {
    backgroundColor: "rgb(232, 114, 114)",
  },
  usedDisk: {
    backgroundColor: "#8c6b5d"
  }
});
const removeA = (slot, disk) => {
  const arr = [];
  let size = 0;
  for (let i = 0; i < slot.length; i += 1) {
    if (slot[i].deviceName !== disk.name) {
      arr.push(slot[i]);
      size += disk.size;
    }
  }
  return {
    arr,
    size,
  };
};

const SPARE_DISK = "SPARE DISK";
const STORAGE_DISK = "STORAGE DISK";

class ArrayCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrayname: "",
      slots: { [STORAGE_DISK]: [], "Write Buffer Disk": [], [SPARE_DISK]: [] },
      diskType: STORAGE_DISK,
      metaDisk: "",
      loading: false,
      errorMsg: "",
      writeThroughMode: false,
      alertOpen: false,
      popupOpen: false,
      totalSize: 0,
      alertType: "error",
      confirmOpen: false,
      createMsg: "Do you want to proceed and create Array?",
      diskDetails: { ...defaultDiskDetails },
    };
    this.toggleRowSelect = this.toggleRowSelect.bind(this);
    this.createArray = this.createArray.bind(this);
    this.onSelectRaid = this.onSelectRaid.bind(this);
    this.onSelectDiskType = this.onSelectDiskType.bind(this);
    this.onSelectWriteBuffer = this.onSelectWriteBuffer.bind(this);
    this.onSetWriteThroughMode = this.onSetWriteThroughMode.bind(this);
    this.showPopup = this.showPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.getDiskDetails = this.getDiskDetails.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openCreatePopup = this.openCreatePopup.bind(this);
  }

  handleChange(event) {
    const { value } = event.target;
    this.setState({ arrayname: value });
  }

  onSelectRaid(event) {
    let localRaid = {};
    this.props.config.raidTypes.forEach(type => {
      if (type.raidType === event.target.value)
        localRaid = { ...type }
    })
    this.props.selectRaid(localRaid);
  }

  onSelectDiskType(event) {
    this.setState({
      ...this.state,
      diskType:
        event && event.target && event.target.value,
    });
  }

  onSelectWriteBuffer(event) {
    this.setState({
      ...this.state,
      metaDisk: event.target.value,
    });
  }

  onSetWriteThroughMode() {
    this.setState({
      ...this.state,
      writeThroughMode: !this.state.writeThroughMode
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
      alertOpen: false,
      confirmOpen: false
    });
  }

  openCreatePopup(event) {
    event.preventDefault();
    const numas = [];
    const numaMap = {};
    const spareDisks = this.state.slots[SPARE_DISK];
    for (let i = 0; i < spareDisks.length; i += 1) {
      if (!numaMap[spareDisks[i].numa]) {
        numaMap[spareDisks[i].numa] = true;
        numas.push(spareDisks[i].numa);
      }
    }
    const storageDisks = this.state.slots[STORAGE_DISK];
    for (let i = 0; i < storageDisks.length; i += 1) {
      if (!numaMap[storageDisks[i].numa]) {
        numas.push(storageDisks[i].numa);
        numaMap[storageDisks[i].numa] = true;
      }
    }
    if (numas.length > 1) {
      this.setState({
        ...this.state,
        confirmOpen: true,
        createMsg: "Selecting Disks of Different NUMA will cause performance degradation. Do you want to proceed and create Array?"
      })
    } else {
      this.setState({
        ...this.state,
        confirmOpen: true,
        createMsg: "Do you want to proceed and create Array?"
      })
    }
  }

  createArray() {
    this.closePopup();
    if (this.state.arrayname === "") {
      this.setState({
        ...this.state,
        alertType: "alert",
        errorMsg: "Please provide a valid Array name",
        alertOpen: true,
      });
      return;
    }
    if (this.props.selectedRaid.minStorageDisks > this.state.slots[STORAGE_DISK].length) {
      this.setState({
        ...this.state,
        alertType: "alert",
        errorMsg: `Select at least ${this.props.selectedRaid.minStorageDisks} Storage Disk`,
        alertOpen: true,
      });
      return;
    }
    if (this.props.selectedRaid.maxStorageDisks < this.state.slots[STORAGE_DISK].length) {
      this.setState({
        ...this.state,
        alertType: "alert",
        errorMsg: `Select at most ${this.props.selectedRaid.maxStorageDisks} Storage Disk`,
        alertOpen: true,
      });
      return;
    }
    if (this.props.selectedRaid.maxSpareDisks < this.state.slots[SPARE_DISK].length) {
      this.setState({
        ...this.state,
        alertType: 'alert',
        errorMsg: `Select at most ${this.props.selectedRaid.maxSpareDisks} Spare disk`,
        alertOpen: true,
      });
      return;
    }
    if (this.props.selectedRaid.minSpareDisks > this.state.slots[SPARE_DISK].length) {
      this.setState({
        ...this.state,
        alertType: 'alert',
        errorMsg: `Select at least ${this.props.selectedRaid.minSpareDisks} spare disk`,
        alertOpen: true,
      });
      return;
    }
    if (this.state.metaDisk === "") {
      this.setState({
        ...this.state,
        alertType: "alert",
        errorMsg: "Select a Write Buffer",
        alertOpen: true,
      });
      return;
    }
    this.setState({
      ...this.state,
      loading: true,
    });

    this.props.createArray({
      size: this.state.totalSize,
      arrayname: this.state.arrayname,
      raidtype: this.props.selectedRaid.raidType,
      storageDisks: this.state.slots[STORAGE_DISK],
      spareDisks: this.state.slots[SPARE_DISK],
      writeBufferDisk: this.state.slots["Write Buffer Disk"],
      metaDisk: this.state.metaDisk,
      writeThroughModeEnabled: this.state.writeThroughMode
    });
  }

  toggleRowSelect(position, disk) {
    const diskColorMap = {
      [STORAGE_DISK]: "#51ce46",
      "": "white",
      [SPARE_DISK]: "#339EFF",
      "Write Buffer Disk": "#FFEC33",
    };
    if (!disk.isAvailable) {
      return;
    }
    const el = document.getElementById(position);
    if (
      (el.style.backgroundColor === "white" ||
        el.style.backgroundColor === "") &&
      this.state.diskType !== ""
    ) {
      if (this.state.diskType === SPARE_DISK) {
        el.style.backgroundColor = diskColorMap[this.state.diskType];
        const spareSlots = [...this.state.slots[this.state.diskType]];
        spareSlots.push({ deviceName: disk.name, numa: disk.numa });
        this.setState({
          ...this.state,
          slots: {
            ...this.state.slots,
            [SPARE_DISK]: spareSlots,
          },
        });
      } else if (this.state.diskType === STORAGE_DISK) {
        el.style.backgroundColor = diskColorMap[this.state.diskType];
        const storageSlots = [...this.state.slots[this.state.diskType]];
        storageSlots.push({ deviceName: disk.name, numa: disk.numa });
        this.setState({
          ...this.state,
          slots: {
            ...this.state.slots,
            [STORAGE_DISK]: storageSlots,
          },
          totalSize: this.state.totalSize + disk.size,
        });
      }
    } else {
      el.style.backgroundColor = "white";
      const updatedSlots = { ...this.state.slots };
      let size = this.state.totalSize;
      Object.keys(this.state.slots).forEach((key) => {
        const x = removeA(this.state.slots[key], disk);
        updatedSlots[key] = x.arr;
        if (key === STORAGE_DISK) {
          size = x.size;
        }
      });
      this.setState({
        ...this.state,
        slots: {
          ...updatedSlots,
        },
        totalSize: size,
      });
      // }
    }
  }

  render() {
    const { classes } = this.props;
    const diskTypes = [STORAGE_DISK, SPARE_DISK];

    const freedisks = [];
    if (this.props.disks) {
      for (let i = this.props.disks.length; i < this.props.config.totalDisks; i += 1) {
        freedisks.push(
          <GridListTile
            className={`${classes.gridTile} ${classes.gridTileDisabled}`}
            key={i}
          >
            <Typography color="secondary">{i + 1}</Typography>
          </GridListTile>
        );
      }
    }

    return (
      <ThemeProvider theme={PageTheme}>
        <form className={classes.root} data-testid="arraycreate">
          <Grid item xs={12} sm={6} className={classes.inputGrid}>
            <FormControl className={classes.formControl}>
              <TextField
                id="array-name"
                name="arrayname"
                label="Array Name"
                value={this.state.arrayname}
                onChange={this.handleChange}
                inputProps={{
                  "data-testid": "array-name",
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.inputGrid}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="raid">Fault tolerance Level</InputLabel>
              <Select
                value={this.props.selectedRaid.raidType ? this.props.selectedRaid.raidType : ""}
                onChange={this.onSelectRaid}
                inputProps={{
                  name: "Fault Tolerance Type",
                  id: "raid",
                  "data-testid": "raid-select-input",
                }}
                SelectDisplayProps={{
                  "data-testid": "raid-select",
                }}
              >
                {this.props.config.raidTypes && this.props.config.raidTypes.map((raid) => (
                  <MenuItem value={raid.value} key={raid.value}>
                    <Typography color="secondary">{raid.label}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.inputGrid}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="disktype">Disk Type</InputLabel>
              <Select
                value={this.state.diskType}
                onChange={this.onSelectDiskType}
                inputProps={{
                  name: "Disk Type",
                  id: "disktype",
                  "data-testid": "disktype-input",
                }}
                SelectDisplayProps={{
                  "data-testid": "disktype",
                }}
              >
                {diskTypes.map((type) => (
                  <MenuItem value={type} key={type}>
                    <Typography color="secondary">{type}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} className={classes.inputGrid}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="writebuffer">Write Buffer Path</InputLabel>
              <Select
                value={this.state.metaDisk}
                onChange={this.onSelectWriteBuffer}
                inputProps={{
                  name: "Write Buffer Path",
                  id: "writebuffer",
                  "data-testid": "writebuffer-input",
                }}
                SelectDisplayProps={{
                  "data-testid": "writebuffer",
                }}
                className={classes.writeBufferSelect}
                disabled={!this.props.metadisks}
              >
                {this.props.metadisks
                  ? this.props.metadisks.map((disk) => (
                    <MenuItem key={disk.name} value={disk.name}>
                      <Typography color="secondary">{disk.displayMsg}</Typography>
                    </MenuItem>
                  ))
                  : null}
              </Select>
              <Link href="/operations/devices" align="right">Create Disk</Link>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.inputGrid}>
            <FormControl className={classes.formControl}>
              <FormControlLabel
                control={(
                  <Checkbox
                    name="mount_arr_writethrough"
                    color="primary"
                    id="mount-writethrough-checkbox"
                    checked={this.state.writeThroughMode}
                    value="Write Through Mode"
                    inputProps={{
                      "data-testid": "mount-writethrough-checkbox",
                    }}
                    onChange={this.onSetWriteThroughMode}
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
            <Legend bgColor="#51ce46" title="Selected Storage Disk" />
            <Legend bgColor="#339eff" title="Selected Spare Disk" />
            <Legend bgColor="#ffffff" title="Not Selected" />
            <Legend bgColor="#8c6b5d" title="Used Disk" />
            <Legend bgColor="#e2e1e1" title="Empty Slot" />
            <Legend bgColor="#087575" title="NUMA" />
          </Grid>
          <div className={classes.diskGridContainer}>
            <Grid container className={classes.diskContainer}>
              <GridList cellHeight={110} className={classes.gridList} cols={this.props.config.totalDisks}>
                {this.props.disks
                  ? this.props.disks.map((disk, i) => {
                    return (
                      <Tooltip
                        classes={{
                          tooltip: classes.tooltip,
                        }}
                        key={disk.name}
                        title={(
                          <React.Fragment>
                            <div className={classes.tooltipText}>
                              Name:
                              {disk.name}
                            </div>
                            <div className={classes.tooltipText}>
                              Size: {formatBytes(disk.size)}
                            </div>
                            <div className={classes.tooltipText}>
                              NUMA: {disk.numa}
                            </div>
                            <div
                              onClick={() => this.showPopup(disk.name)}
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
                        <GridListTile
                          className={`${classes.gridTile} ${disk.isAvailable ? {} : classes.usedDisk}`}
                          id={i}
                          onClick={() => {
                            this.toggleRowSelect(i, disk);
                          }}
                          data-testid={`diskselect-${i}`}
                        >
                          <Typography className={classes.diskTextNuma}>{disk.numa}</Typography>
                          <Typography className={classes.diskText} color="secondary">{i + 1}</Typography>
                          <p />
                        </GridListTile>
                      </Tooltip>
                    );
                  })
                  : null}
                {freedisks}
              </GridList>
            </Grid>
          </div>
          <Grid
            item
            container
            className={classes.buttonContainer}
          >
            <Button
              onClick={this.openCreatePopup}
              variant="contained"
              color="primary"
              data-testid="createarray-btn"
            >
              Create Array
            </Button>
            <AlertDialog
              type="confirm"
              title="Create Array"
              description={this.state.createMsg}
              open={this.state.confirmOpen}
              onConfirm={() => {
                this.setState({
                  confirmOpen: false
                }, () => {
                  this.createArray();
                })
              }}
              handleClose={this.closePopup}
            />
          </Grid>
          {this.props.loading /* istanbul ignore next */ ? (
            <MToolLoader />
          ) : null}
          <AlertDialog
            type={this.state.alertType}
            title="Create Array"
            description={this.state.errorMsg}
            open={this.state.alertOpen}
            onConfirm={this.closePopup}
            handleClose={this.closePopup}
          />
          <DiskDetails
            title="Disk Details"
            details={this.props.diskDetails}
            open={this.state.popupOpen}
            onConfirm={this.closePopup}
            handleClose={this.closePopup}
          />
        </form>
      </ThemeProvider>
    );
  }
}

export default withStyles(styles)(ArrayCreate);
