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
[12/06/2019] [Aswin] : Default disk details set to NA
*/
import React, { Component } from 'react';
import 'react-dropdown/style.css';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import ThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import {
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  GridList,
  Typography,
  MenuItem,
} from '@material-ui/core';
import formatBytes from '../../../utils/format-bytes';
import AlertDialog from '../../Dialog';
import DiskDetails from '../../DiskDetails';
import '../ArrayCreate/ArrayCreate.css';
import { PageTheme } from '../../../theme';
import Legend from '../../Legend';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    padding: theme.spacing(0, 3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 1)
    }
  },
  tooltip: {
    backgroundColor: '#f5f5f9',
    opacity: 1,
    color: 'rgba(0, 0, 0, 1)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
    '& b': {
      fontWeight: theme.typography.fontWeightMedium,
    },
  },
  formControl: {
    margin: theme.spacing(0.5, 2),
    minWidth: 170,
    [theme.breakpoints.down('xs')]: {
      margin: theme.spacing(1, 0)
    }
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
    flexGrow: 1,
    padding: theme.spacing(1, 0)
  },
  gridTile: {
    width: 200,
    minWidth: 35,
    border: '2px solid lightgray',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    flexDirection: 'column',
    '&>div': {
      height: 'auto'
    }
  },
  gridTileDisabled: {
    backgroundColor: '#e2e1e1'
  },
  diskGridContainer: {
    width: '100%',
    overflowX: 'auto',
    [theme.breakpoints.down('xs')]: {
      width: 'calc(100% - 32px)'
    }
  },
  diskContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2, 2, 0, 2),
    minWidth: 800
  },
  legendButtonGrid: {
    marginBottom: theme.spacing(1)
  },
  legendContainer: {
    padding: theme.spacing(0, 2)
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 2),
    marginTop: theme.spacing(0.5),
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center'
    }
  },
  button: {
    height: '1.8rem',
    lineHeight: '0px'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(0.5)
  },
  inputGrid: {
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
      justifyContent: 'center'
    }
  },
  storagedisk: {
    backgroundColor: 'rgb(236,219,87)',
    cursor: 'default'
  },
  writebufferdisk: {
    backgroundColor: 'rgb(232,114,114)',
    cursor: 'default'
  },
  sparedisk: {
    backgroundColor: '#339EFF',
    cursor: 'default'
  },
  freedisk: {
    backgroundColor: 'rgb(137,163,196)',
    cursor: 'default'
  },
  partOfArray: {
    backgroundColor: 'rgb(236, 219, 87)'
  },
  notSelectedShow: {
    backgroundColor: 'rgb(137, 163, 196)'
  },
  corrupted: {
    backgroundColor: 'rgb(232, 114, 114)'
  },
  detachBtn: {
    bottom: '-3px',
    width: '80%',
    position: 'absolute',
    fontSize: '0.6rem'
  },
  diskNo: {
    position: 'absolute'
  }
});

const defaultDiskDetails = {
  DevicePath: 'NA',
  SerialNumber: 'NA',
  Model: 'NA',
  PhysicalSize: 'NA',
  UsedBytes: 'NA',
  Firmware: 'NA',
  critical_warning: 'NA',
  temperature: 'NA',
  avail_spare: 'NA',
  spare_thresh: 'NA',
  precent_used: 'NA',
  data_units_read: 'NA',
  data_units_written: 'NA',
  critical_comp_time: 'NA',
  warning_temp_time: 'NA',
  percent_used: 'NA',
};


const findDisk = (diskName) => {
  return d => {
    return d.deviceName === diskName;
  };
}

class ArrayShow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      diskDetails: { ...defaultDiskDetails },
      popupOpen: false,
      messageDescription: '',
      messageOpen: '',
      messageTitle: '',
      selectedSlot: null,
      onConfirm: null
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.showPopup = this.showPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.deleteArray = this.deleteArray.bind(this);
    this.getDiskDetails = this.getDiskDetails.bind(this);
    this.attachDisk = this.attachDisk.bind(this);
    this.detachDisk = this.detachDisk.bind(this);
    this.addSpareDisk = this.addSpareDisk.bind(this);
    this.removeSpareDisk = this.removeSpareDisk.bind(this);
  }

  getDiskDetails(name) {
    this.props.getDiskDetails({ name });
  }

  handleClick(event) {
    event.preventDefault();
    this.setState({
      open: true,
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

  attachDisk(slot) {
    this.setState({
      selectedSlot: slot,
      messageOpen: true,
      messageDescription: 'Are you sure you want to Attach Disk?',
      messageTitle: 'Attach Disk',
      onConfirm: () => {
        this.props.attachDisk(this.state.selectedSlot);
        this.setState({
          messageOpen: false
        });
      }
    })
  }

  addSpareDisk(slot) {
    this.setState({
      selectedSlot: slot,
      messageOpen: true,
      messageDescription: 'Are you sure you want to Add the Disk?',
      messageTitle: 'Add Spare Disk',
      onConfirm: () => {
        this.props.addSpareDisk(this.state.selectedSlot);
        this.setState({
          messageOpen: false
        });
      }
    })
  }

  detachDisk(slot) {
    this.setState({
      selectedSlot: slot,
      messageOpen: true,
      messageDescription: 'Are you sure you want to Detach Disk?',
      messageTitle: 'Detach Disk',
      onConfirm: () => {
        this.props.detachDisk(this.state.selectedSlot);
        this.setState({
          messageOpen: false
        });
      }
    })
  }

  removeSpareDisk(slot) {
    this.setState({
      selectedSlot: slot,
      messageOpen: true,
      messageDescription: 'Are you sure you want to Remove the Disk?',
      messageTitle: 'Remove Spare Disk',
      onConfirm: () => {
        this.props.removeSpareDisk(this.state.selectedSlot);
        this.setState({
          messageOpen: false
        });
      }
    })
  }

  render() {
    const { classes } = this.props;
    const freeSlots = [];
    if (this.props.slots) {
      for (let i = this.props.slots.length; i < 32; i += 1) {
        freeSlots.push(
          <Grid className={`${classes.gridTile} ${classes.gridTileDisabled}`}>
            <Typography color="secondary" className={classes.diskNo}>{i + 1}</Typography>
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
      return classes.freedisk;
    }
    return (
      <ThemeProvider theme={PageTheme}>
        <form className={classes.root} data-testid="arrayshow">
          <Grid item xs={12} sm={6} className={classes.inputGrid}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="raid">Fault tolerance Level</InputLabel>
              <Select
                value={this.props.RAIDLevel}
                inputProps={{
                  name: 'Fault Tolerance Type',
                  id: 'raid',
                }}
                disabled
              >
                <MenuItem value={this.props.RAIDLevel}>RAID {this.props.RAIDLevel}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.inputGrid}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="writebuffer">Write Buffer Path</InputLabel>
              <Select
                value={this.props.metadiskpath[0].deviceName}
                inputProps={{
                  name: 'Write Buffer Path',
                  id: 'writebuffer',
                }}
                disabled
              >
                <MenuItem value={this.props.metadiskpath[0].deviceName}>{this.props.metadiskpath[0].deviceName}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
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
                        title={(
                          <React.Fragment>
                            <div>
                              Name:
                            {slot.name}
                            </div>
                            <div>
                              Size:
                            {formatBytes(slot.size * 4 * 1024)}
                            </div>
                            <div
                              onClick={() => this.showPopup(slot.name)}
                              style={{
                                cursor: 'pointer',
                                textAlign: 'right',
                                margin: '10px',
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
                          <Typography color="secondary" className={classes.diskNo}>{index + 1}</Typography>
                          {(getClass(slot) === classes.freedisk) ? (
                            <Button
                              className={classes.detachBtn}
                              data-testid={`attachdisk-${index}`}
                              onClick={() => this.addSpareDisk(slot)}
                            >Add Spare Disk
                            </Button>
                          ) : (
                              (getClass(slot) === classes.sparedisk) ? (
                                <Button
                                  className={classes.detachBtn}
                                  data-testid={`detachdisk-${index}`}
                                  onClick={() => this.removeSpareDisk(slot)}
                                >Remove Spare Disk
                                </Button>
                              ) :
                                null
                            )

                          }


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
                  : null}
                {freeSlots}
              </GridList>
            </Grid>
          </div>
          <Grid container xs={12} className={classes.legendButtonGrid}>
            <Grid item container sm={8} xs={12} wrap="wrap" className={classes.legendContainer}>
              <Legend bgColor="rgba(236, 219, 87,0.6)" title="Storage disk" />
              <Legend bgColor="rgba(51, 158, 255, 0.6)" title="Spare disk" />
              <Legend bgColor="rgba(137, 163, 196, 0.6)" title="Not Selected" />
              <Legend bgColor="rgba(226, 225, 225, 0.6)" title="Empty Slot" />
            </Grid>
            <Grid item container sm={4} xs={12} className={classes.buttonContainer}>
              <Button
                onClick={this.handleClick}
                variant="contained"
                color="primary"
                className={classes.button}
              >
                Delete Array
              </Button>
            </Grid>
          </Grid>
          <AlertDialog
            title="Delete Array"
            description="Are you sure you want to delete?"
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
            note_msg="Note: Currently SPDK NVME cli cannot retrieve disk details while iBoF is running. Details will be displayed at a later stage."
          />
        </form>
      </ThemeProvider>
    );
  }
}

export default withStyles(styles)(ArrayShow);
