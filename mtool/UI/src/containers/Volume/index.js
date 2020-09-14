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
[12/06/2019] [Aswin] : Total Volume size shown. Error message on status code from iBOF
[05/05/2020] [Palak] : Multi-Volume Creation
*/
import React, { Component } from 'react';
import { Box, Grid, Typography, Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import ThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import 'react-dropdown/style.css';
import 'react-table/react-table.css';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import ArrayCreate from '../../components/ArrayManagement/ArrayCreate';
import ArrayShow from '../../components/ArrayManagement/ArrayShow';
import CreateVolume from '../../components/VolumeManagement/CreateVolume';
import VolumeList from '../../components/VolumeManagement/VolumeList';
import MToolLoader from '../../components/MToolLoader';
import AlertDialog from '../../components/Dialog';
import './Volume.css';
import MToolTheme, { customTheme } from '../../theme';
import Legend from '../../components/Legend';
import * as actionTypes from "../../store/actions/actionTypes";
// import bytesToTB from '../../utils/bytes-to-tb';
import formatBytes from '../../utils/format-bytes';

const styles = (theme) => ({
  dashboardContainer: {
    display: 'flex'
  },
  statsWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    boxSizing: 'border-box',
    zIndex: 100,
    position: 'absolute',
    flexBasis: '100%',
    height: '100%',
    alignContent: 'center',
    padding: theme.spacing(0, 3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 1),
      marginTop: theme.spacing(1)
    }
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    paddingTop: "10px",
    paddingLeft: "35px",
    paddingRight: "24px",
    width: 'calc(100% - 256px)',
    boxSizing: 'border-box'
  },
  statsContainer: {
    margin: theme.spacing(1, 0, 2)
  },
  volumeStats: {
    width: '100%',
    border: '0px solid gray',
    height: 50
  },
  toolbar: customTheme.toolbar,
  titleContainer: {
    marginTop: theme.spacing(1)
  },
  volumeStatsPaper: {
    height: 350,
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    [theme.breakpoints.down('md')]: {
      height: 400
    },
    [theme.breakpoints.down('xs')]: {
      height: 220
    }
  },
  pageHeader: customTheme.page.title,
  cardHeader: customTheme.card.header,
  card: {
    marginTop: theme.spacing(1)
  }
});


// namespace to connect to the websocket for multi-volume creation
const createVolSocketEndPoint = ":5000/create_vol";

class Volume extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false,
      createVolSocket: io(createVolSocketEndPoint, {
        transports: ['websocket'],
        query: {
          'x-access-token': localStorage.getItem('token')
        }
      })
    };
    this.deleteVolumes = this.deleteVolumes.bind(this);
    this.fetchVolumes = this.fetchVolumes.bind(this);
    this.createArray = this.createArray.bind(this);
    this.createVolume = this.createVolume.bind(this);
    this.deleteArray = this.deleteArray.bind(this);
    this.alertConfirm = this.alertConfirm.bind(this);
    this.fetchDevices = this.fetchDevices.bind(this);
    this.fetchStorageInfo = this.fetchStorageInfo.bind(this);
    this.fetchMaxVolumeCount = this.fetchMaxVolumeCount.bind(this);
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
  }

  componentDidMount() {
    this.fetchDevices();
    this.fetchStorageInfo();
    this.fetchMaxVolumeCount();
  }

  handleDrawerToggle() {
    this.setState({
      mobileOpen: !this.state.mobileOpen
    });
  }

  createVolume(volume) {
    this.props.Create_Volume({
      name: volume.volume_name,
      size: volume.volume_size,
      description: volume.volume_description,
      unit: volume.volume_units,
      arrayname: "POSArray",
      maxbw: volume.maxbw,
      maxiops: volume.maxiops,
      count: volume.volume_count,
      suffix: volume.volume_suffix,
      stop_on_error: volume.stop_on_error_checkbox,
      mount_vol: volume.mount_vol,
      max_available_size:  this.props.arraySize - this.props.totalVolSize
    });
  }

  fetchVolumes() {
    this.props.Get_Volumes();
  }

  fetchStorageInfo() {
    this.props.Get_Array_Size();
  }

  fetchMaxVolumeCount() {
    this.props.Get_Max_Volume_Count();
  }

  deleteVolumes(volumes) {
    const ids = [];
    volumes.forEach(volume => {
      ids.push(volume.name);
    });
    this.props.Delete_Volumes({ volumes: ids });
  }

  fetchDevices() {
    this.props.Get_Devices(this.props.history);
  }

  createArray(array) {
    this.props.Create_Array(array);
  }

  deleteArray() {
    this.props.Delete_Array({ arrayname: "" });
  }

  alertConfirm() {
    this.props.Close_Alert()
  }

  render() {
    const volumeFilledStyle = {
      width: `${this.props.arraySize !== 0 ?
        (100 * (this.props.totalVolSize)) /
        (this.props.arraySize) : 0}%`,
      height: '100%',
      backgroundColor: 'rgba(51, 158, 255,0.6)',
      float: 'left',
      overflowY: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    };
    const volumeFreeStyle = {
      width: `${this.props.arraySize !== 0 ? 100 -
        (100 * (this.props.totalVolSize)) /
        (this.props.arraySize) : 100}%`,
      height: '100%',
      color: 'white',
      backgroundColor: 'rgba(0, 186, 0, 0.6)',
      float: 'left',
      overflowY: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    };
    const { classes } = this.props;

    return (
      <ThemeProvider theme={MToolTheme}>
        <Box display="flex">
          <Header toggleDrawer={this.handleDrawerToggle} />
          <Sidebar mobileOpen={this.state.mobileOpen} toggleDrawer={this.handleDrawerToggle} />
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
              <Grid container xs={12} spacing={1} className={classes.card}>
                <Grid item xs={12}>
                  <Paper spacing={3} className={classes.spaced}>
                    <Grid container justify="space-between">
                      <Grid item xs={12}>
                        <Typography className={classes.cardHeader} data-testid="title">
                          Array Management
                        </Typography>
                      </Grid>
                      {this.props.arrayExists ? (
                        <ArrayShow
                          RAIDLevel={this.props.RAIDLevel}
                          slots={this.props.ssds}
                          corrupted={this.props.corrupted}
                          storagedisks={this.props.storagedisks}
                          sparedisks={this.props.sparedisks}
                          metadiskpath={this.props.metadiskpath}
                          writebufferdisks={this.props.writebufferdisks}
                          deleteArray={this.deleteArray}
                          diskDetails={this.props.diskDetails}
                          getDiskDetails={this.props.Get_Disk_Details}
                          // detachDisk={this.props.Detach_Disk}
                          // attachDisk={this.props.Attach_Disk}
                          addSpareDisk={this.props.Add_Spare_Disk}
                          removeSpareDisk={this.props.Remove_Spare_Disk}
                        />
                      ) : (
                          <ArrayCreate
                            createArray={this.createArray}
                            disks={this.props.ssds}
                            data-testid="arraycreate"
                            metadisks={this.props.metadisks}
                            diskDetails={this.props.diskDetails}
                            getDiskDetails={this.props.Get_Disk_Details}
                          />
                        )}
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
              {this.props.arrayExists ? (
                <React.Fragment>
                  <Grid container xs={12} spacing={1} className={classes.card}>
                    <Grid item xs={12} md={6} className={classes.spaced}>
                      <CreateVolume
                        data-testid="createvolume"
                        createVolume={this.createVolume}
                        maxVolumeCount={this.props.maxVolumeCount}
                        volCount={this.props.volumes.length}
                        maxAvailableSize = {this.props.arraySize - this.props.totalVolSize}
                        createVolSocket={this.state.createVolSocket}
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
                            <Typography variant="span" color="secondary">
                              Number of volumes: {this.props.volumes.length}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} className={classes.statsContainer}>
                            <Box className={classes.volumeStats}>
                              <div style={volumeFilledStyle} />
                              <div style={volumeFreeStyle} />
                            </Box>
                            <Grid item container xs={12} wrap="wrap" className={classes.legendContainer}>
                              <Legend
                                bgColor="rgba(51, 158, 255,0.6)"
                                title={`
                          Used Space :
                          ${formatBytes(
                                  this.props.totalVolSize
                                )}
                        `}
                              />
                              <Legend
                                bgColor="rgba(0, 186, 0, 0.6)"
                                title={`
                          Available for Volume Creation :
                          ${formatBytes(
                                  this.props.arraySize -
                                  this.props.totalVolSize
                                )}
                        `}
                              />
                            </Grid>
                          </Grid>
                        </div>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Grid container xs={12} spacing={1} className={classes.card}>
                    <Grid item xs={12}>
                      <VolumeList
                        ref={this.child}
                        volumeFetch={this.fetchVolumes}
                        volumes={this.props.volumes}
                        deleteVolumes={this.deleteVolumes}
                        editVolume={this.props.Edit_Volume}
                        changeField={this.props.Change_Volume_Field}
                        fetchVolumes={this.fetchVolumes}
                        saveVolume={this.props.Update_Volume}
                        changeMountStatus={this.props.Change_Mount_Status}
                      />
                    </Grid>
                  </Grid>
                </React.Fragment>
              ) : null}
              {this.props.loading ? (
                <MToolLoader text={this.props.loadText} />
              ) : null}
              <AlertDialog
                title={this.props.alertTitle}
                description={this.props.errorMsg}
                open={this.props.alertOpen}
                type={this.props.alertType}
                onConfirm={this.alertConfirm}
                handleClose={this.alertConfirm}
                errCode={this.props.errorCode}
              />
            </Grid>
          </main>
        </Box>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => {
  return {
    ssds: state.storageReducer.ssds,
    metadisks: state.storageReducer.metadisks,
    volumes: state.storageReducer.volumes,
    loading: state.storageReducer.loading,
    alertOpen: state.storageReducer.alertOpen,
    alertType: state.storageReducer.alertType,
    alertTitle: state.storageReducer.alertTitle,
    errorMsg: state.storageReducer.errorMsg,
    errorCode: state.storageReducer.errorCode,
    arraySize: state.storageReducer.arraySize,
    maxVolumeCount: state.storageReducer.maxVolumeCount,
    totalVolSize: state.storageReducer.totalVolSize,
    storagedisks: state.storageReducer.storagedisks,
    sparedisks: state.storageReducer.sparedisks,
    writebufferdisks: state.storageReducer.writebufferdisks,
    metadiskpath: state.storageReducer.metadiskpath,
    slots: state.storageReducer.slots,
    arrayExists: state.storageReducer.arrayExists,
    RAIDLevel: state.storageReducer.RAIDLevel,
    diskDetails: state.storageReducer.diskDetails,
    loadText: state.storageReducer.loadText
  };
}
const mapDispatchToProps = dispatch => {
  return {
    Get_Devices: (payload) => dispatch({ type: actionTypes.SAGA_FETCH_DEVICE_INFO, payload }),
    Create_Volume: (payload) => dispatch({ type: actionTypes.SAGA_SAVE_VOLUME, payload }),
    Get_Array_Size: () => dispatch({ type: actionTypes.SAGA_FETCH_ARRAY_SIZE }),
    Delete_Array: (payload) => dispatch({type: actionTypes.SAGA_DELETE_ARRAY, payload}),
    Get_Volumes: () => dispatch({ type: actionTypes.SAGA_FETCH_VOLUMES }),
    Delete_Volumes: (payload) => dispatch({ type: actionTypes.SAGA_DELETE_VOLUMES, payload }),
    Close_Alert: () => dispatch({ type: actionTypes.STORAGE_CLOSE_ALERT }),
    Create_Array: (payload) => dispatch({ type: actionTypes.SAGA_CREATE_ARRAY, payload }),
    Get_Disk_Details: (payload) => dispatch({ type: actionTypes.SAGA_FETCH_DEVICE_DETAILS, payload }),
    Edit_Volume: (payload) => dispatch({ type: actionTypes.EDIT_VOLUME, payload }),
    Change_Mount_Status: (payload) => dispatch({ type: actionTypes.SAGA_VOLUME_MOUNT_CHANGE, payload }),
    Change_Volume_Field: (payload) => dispatch({ type: actionTypes.CHANGE_VOLUME_FIELD, payload }),
    Update_Volume: (payload) => dispatch({ type: actionTypes.SAGA_UPDATE_VOLUME, payload }),
    // Detach_Disk: (payload) => dispatch({ type: actionTypes.SAGA_DETACH_DISK, payload }),
    // Attach_Disk: (payload) => dispatch({ type: actionTypes.SAGA_ATTACH_DISK, payload }),
    Add_Spare_Disk: (payload) => dispatch({ type: actionTypes.SAGA_ADD_SPARE_DISK, payload }),
    Remove_Spare_Disk: (payload) => dispatch({ type: actionTypes.SAGA_REMOVE_SPARE_DISK, payload }),
    Get_Max_Volume_Count: () => dispatch({ type: actionTypes.SAGA_FETCH_MAX_VOLUME_COUNT }),
  };
}

export default withStyles(styles)((connect(mapStateToProps, mapDispatchToProps))(Volume));
