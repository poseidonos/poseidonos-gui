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
[11/06/2019] [Aswin] : Removed Write Buffer disk from dropdown
[12/06/2019] [Aswin] : Fixed Spare disk selection bug. Default disk details set to NA
*/
import React, { Component } from 'react';
import 'react-dropdown/style.css';
import Tooltip from '@material-ui/core/Tooltip';
import ThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { FormControl, InputLabel, Select, MenuItem, Typography, Grid, GridList, GridListTile, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import formatBytes from '../../../utils/format-bytes';
import MToolLoader from '../../MToolLoader';
import AlertDialog from '../../Dialog';
import DiskDetails from '../../DiskDetails';
import './ArrayCreate.css';
import { PageTheme } from '../../../theme';
import Legend from '../../Legend';

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
const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    width: `calc(100% - ${theme.spacing(4)}px)`,
    padding: theme.spacing(0, 2),
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
    border: '2px solid lightgray',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
  button: {
    textTransform: 'none'
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 2),
    marginTop: theme.spacing(0.5),
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center'
    }
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
  partOfArray: {
    backgroundColor: 'rgb(236, 219, 87)'
  },
  notSelectedShow: {
    backgroundColor: 'rgb(137, 163, 196)'
  },
  corrupted: {
    backgroundColor: 'rgb(232, 114, 114)'
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
}

class ArrayCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrayname: 'POSArray',
      raids: [
        {
          label: 'RAID-5',
          minStorage: 3,
          minSpare: 1,
          minWriteBUffer: 1,
          value: 'raid5',
        }
      ],
      minStorage: 3,
      minSpare: 1,
      minWriteBUffer: 1,
      raid: 'raid5',
      slots: { 'Storage Disk': [], 'Write Buffer Disk': [], 'Spare Disk': [] },
      diskType: 'Storage Disk',
      metaDisk: '',
      loading: false,
      errorMsg: '',
      alertOpen: false,
      popupOpen: false,
      totalSize: 0,
      alertType: 'error',
      diskDetails: { ...defaultDiskDetails },
    };
    this.toggleRowSelect = this.toggleRowSelect.bind(this);
    this.createArray = this.createArray.bind(this);
    // // this.onSelectRaid = this.onSelectRaid.bind(this);
    this.onSelectDiskType = this.onSelectDiskType.bind(this);
    this.onSelectWriteBuffer = this.onSelectWriteBuffer.bind(this);
    this.showPopup = this.showPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.getDiskDetails = this.getDiskDetails.bind(this);
  }

  // onSelectRaid(event) {
  //   for (let i = 0; i < this.state.raids.length; i += 1) {
  //     if (this.state.raids[i].value === event.target.value) {
  //       this.setState({
  //         ...this.state,
  //         raid: event.target.value,
  //         minStorage: this.state.raids[i].minStorage,
  //         minSpare: this.state.raids[i].minSpare,
  //         minWriteBUffer: this.state.raids[i].minWriteBUffer,
  //       });
  //       return;
  //     }
  //   }
  // }

  onSelectDiskType(event) {
    this.setState({
      ...this.state,
      diskType: (event && event.target) ?
        event.target.value /* istanbul ignore next */: '',
    });
  }

  onSelectWriteBuffer(event) {
    this.setState({
      ...this.state,
      metaDisk: event.target.value,
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
    });
  }

  createArray(event) {
    event.preventDefault();
    if (this.state.minStorage > this.state.slots['Storage Disk'].length) {
      this.setState({
        ...this.state,
        alertType: 'alert',
        errorMsg: `Select at least ${this.state.minStorage} storage disk`,
        alertOpen: true,
      });
      return;
    }
    // if (this.state.minSpare > this.state.slots['Spare Disk'].length) {
    //   this.setState({
    //     ...this.state,
    //     alertType: 'alert',
    //     errorMsg: `Select at least ${this.state.minSpare} Spare disk`,
    //     alertOpen: true,
    //   });
    //   return;
    // }
    if (this.state.metaDisk === '') {
      this.setState({
        ...this.state,
        alertType: 'alert',
        errorMsg: 'Select a Write Buffer',
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
        raidtype: this.state.raid,
        storageDisks: this.state.slots['Storage Disk'],
        spareDisks: this.state.slots['Spare Disk'],
        writeBufferDisk: this.state.slots['Write Buffer Disk'],
        metaDisk: this.state.metaDisk
    });
  }

  toggleRowSelect(position, disk) {
    const diskColorMap = {
      'Storage Disk': '#51ce46',
      '': 'white',
      'Spare Disk': '#339EFF',
      'Write Buffer Disk': '#FFEC33',
    };
    const el = document.getElementById(position);
    if (
      (el.style.backgroundColor === 'white' ||
        el.style.backgroundColor === '') &&
      this.state.diskType !== ''
    ) {
      if (
        this.state.diskType === 'Spare Disk'
      ) {
        el.style.backgroundColor = diskColorMap[this.state.diskType];
        const spareSlots = [...this.state.slots[this.state.diskType]];
        spareSlots.push({ deviceName: disk.name });
        this.setState({
          ...this.state,
          slots: {
            ...this.state.slots,
            'Spare Disk': spareSlots,
          },
        });
      } else if (this.state.diskType === 'Storage Disk') {
        el.style.backgroundColor = diskColorMap[this.state.diskType];
        const storageSlots = [...this.state.slots[this.state.diskType]];
        storageSlots.push({ deviceName: disk.name });
        this.setState({
          ...this.state,
          slots: {
            ...this.state.slots,
            'Storage Disk': storageSlots,
          },
          totalSize: this.state.totalSize + disk.size,
        });
      // } else if (
      //   this.state.diskType === 'Write Buffer Disk' &&
      //   this.state.slots[this.state.diskType].length < 1 &&
      //   this.state.metaDisk === ''
      // ) {
      //   el.style.backgroundColor = diskColorMap[this.state.diskType];
      //   const joined = this.state.slots[this.state.diskType].push({
      //     deviceName: position,
      //   });
      //   this.setState({
      //     ...this.state,
      //     slots: {
      //       ...this.state.slots,
      //       'Write Disk Buffer': joined,
      //     },
      //   });
      }
    } else {
      el.style.backgroundColor = 'white';
      const updatedSlots = { ...this.state.slots };
      let size = this.state.totalSize;
      Object.keys(this.state.slots).forEach((key) => {
        const x = removeA(this.state.slots[key], disk);
        updatedSlots[key] = x.arr;
        if (key === 'Storage Disk') {
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
    const diskTypes = ['Storage Disk', 'Spare Disk'];

    const freedisks = [];
    if (this.props.disks) {
      for (let i = this.props.disks.length; i < 32; i += 1) {
        freedisks.push(
          <GridListTile className={`${classes.gridTile} ${classes.gridTileDisabled}`}>
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
        <InputLabel htmlFor="raid">Fault tolerance Level</InputLabel>
        <Select
          value={this.state.raid}
          // onChange={this.onSelectRaid}
          inputProps={{
            name: 'Fault Tolerance Type',
            id: 'raid',
            'data-testid': 'raid-select-input'
          }}
          SelectDisplayProps={{
            'data-testid': 'raid-select'
          }}
        >
          {this.state.raids.map((raid) => (
             <MenuItem value={raid.value}><Typography color="secondary">{raid.label}</Typography></MenuItem>
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
            name: 'Write Buffer Path',
            id: 'writebuffer',
            'data-testid': "writebuffer-input"
          }}
          SelectDisplayProps={{
            'data-testid': 'writebuffer'
          }}
          disabled={!this.props.metadisks}
        >
          {this.props.metadisks ? this.props.metadisks.map((disk) => (
             <MenuItem value={disk}><Typography color="secondary">{disk}</Typography></MenuItem>
          )): null}
        </Select>
      </FormControl>
      </Grid>
      <Grid item xs={12} className={classes.inputGrid}>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="disktype">Disk Type</InputLabel>
        <Select
          value={this.state.diskType}
          onChange={this.onSelectDiskType}
          inputProps={{
            name: 'Disk Type',
            id: 'disktype',
            'data-testid': "disktype-input"
          }}
          SelectDisplayProps={{
            'data-testid': 'disktype'
          }}
        >
          {diskTypes.map((type) => (
             <MenuItem value={type}><Typography color="secondary">{type}</Typography></MenuItem>
          ))}
        </Select>
      </FormControl>
      </Grid>
      <div className={classes.diskGridContainer}>
      <Grid container className={classes.diskContainer}>
      <GridList cellHeight={110} className={classes.gridList} cols={32}>
          {this.props.disks
            ? this.props.disks.map((disk, i) => {
                return (
                  <Tooltip
                    classes={{
                      tooltip: classes.tooltip,
                    }}
                    title={(
                      <React.Fragment>
                        <div style={{ margin: '10px' }}>
                          Name:
                          {disk.name}
                        </div>
                        <div style={{ margin: '10px' }}>
                          Size: {formatBytes(disk.size)}
                        </div>
                        <div
                          onClick={() => this.showPopup(disk.name)}
			  aria-hidden="true"
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
                    <GridListTile
                      className={classes.gridTile}
                      id={i}
                      onClick={() => {
                        this.toggleRowSelect(i, disk);
                      }}
                      data-testid={`diskselect-${i}`}
                    >
                      <Typography color="secondary">{ i + 1 }</Typography>
                    </GridListTile>
                  </Tooltip>
                );
              })
            : null}
          {freedisks}
      </GridList>
      </Grid>
      </div>
        <Grid container xs={12} className={classes.legendButtonGrid}>
          <Grid item container sm={8} xs={12} wrap="wrap" className={classes.legendContainer}>
            <Legend bgColor="#51ce46" title="Selected Storage disk" />
            <Legend bgColor="#339eff" title="Selected Spare disk" />
            <Legend bgColor="#ffffff" title="Not Selected" />
            <Legend bgColor="#e2e1e1" title="Empty Slot" />
          </Grid>
          <Grid item container sm={4} xs={12} className={classes.buttonContainer}>
            <Button
              onClick={this.createArray}
              variant="contained"
              color="primary"
              data-testid="createarray-btn"
              className={classes.button}
            >
              Create Array
            </Button>
          </Grid>
        </Grid>
        {this.props.loading /* istanbul ignore next */? <MToolLoader /> : null}
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
