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

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Paper, GridList, Typography, Tooltip, GridListTile , createMuiTheme,InputLabel, } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

import './Chassis.css';
import Legend from '../../Legend'
import * as actionTypes from '../../../store/actions/actionTypes';
import DiskDetails from '../../DiskDetails';
import ServerInformation from "../ServerInformation"

const styles = theme => ({
  multilineColor: {
    color: 'black'
  },
  root: {
    flexGrow: 1,
  },

  overviewPaper: {
    marginTop: theme.spacing(2),
    width: '100%',
  },


  chassisOuterGrid: {
   // border: '1px solid gray',
    maxWidth: '100%',
    flexBasis: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
    background: '#fff',
  },
  chassisInnerGrid: {
    maxWidth: '100%',
  },

  label: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(3),
  },
  gridTile: {
    width: 450,
    minWidth: 10,
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
  gridTileHealthy: {
    backgroundColor: 'green'
  },
  chassisGridContainer: {
    width: '100%',
    overflowX: 'auto',
    [theme.breakpoints.down('xs')]: {
      width: 'calc(100% - 32px)'
    }
  },
  chassisContainer: {
    margin: '20px',
    padding: '5px',
    border: '1px solid gray',

  },
  diskContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(0, 2, 0, 2),
    minWidth: 120
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
    flexGrow: 1,
    padding: theme.spacing(0, 0)
  },

  legendContainer: {
    maxWidth: '100%',
    padding: theme.spacing(2, 2)
  },
  chassisLabel:{
    padding:'15px',
    width:'100%',
    textAlign:'center'
  },
  
  powerParentGrid: {
   marginBottom: -theme.spacing(0.5)       
  }
});

const defaultDiskDetails = {
  DevicePath: 'NA',
  BuildDate: 'NA',
  Manufacturer: 'NA',
  PartNumber: 'NA',
  SerialNumber: 'NA',
  Model: 'NA',
  PredictedMediaLifeLeftPercent:'NA',
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

class Chassis extends Component {
  constructor(props) {
    super(props);
    this.showPopup = this.showPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.getDiskDetails = this.getDiskDetails.bind(this);
    this.theme = createMuiTheme({
      overrides: {
        MuiSvgIcon: {
          //  stylesheet name
          root: {
            //  rule name
            color: '#808080',
          },
        },
        MuiTablePagination: {
          menuItem: {
            fontSize: "12px",
            minHeight: "0px"
          },
          select: {
            width: "45px"
          },
          toolbar: {
            maxHeight: '50px',
            minHeight: '20px'
          },
        },
      },

      palette: {
        primary: {
          main: '#4caf50',
        },
        secondary: {
          main: '#808080',
        },
      },

    });

    this.state = {
      disknameandslot:'',
      diskDetails: {...defaultDiskDetails},
      popupOpen: false,
      columns: [
        {
          title: 'Name',
          field: 'chassisname',
          cellStyle: {
            fontFamily:'Arial',
            fontSize: '12px',
          },
        },
        {
          title: 'Status',
          field: 'chassisstatus',
          cellStyle: {
            fontFamily:'Arial',
            fontSize: '12px',
          },
        },
        {
          title: 'Serial',
          field: 'chassisserial',
          cellStyle: {
            fontFamily:'Arial',
            fontSize: '12px',
          },
        },
        {
          title: 'Other',
          field: 'chassisother',
          cellStyle: {
            fontFamily:'Arial',
            fontSize: '12px',
          },
        },
      ],
      data: [{ 'chassisname': 'ETH0', 'chassisstatus': 'Healthy', 'chassisserial': 'CNGODYTRNHD', 'chassisother': 'SPEED Slot 40GB' }, { 'chassisname': 'ETH1', 'chassisstatus': 'Healthy', 'chassisserial': 'CNGODYTRNHDH', 'chassisother': 'SPEED Slot 50GB' },{ 'chassisname': 'PSU1', 'chassisstatus': 'Healthy', 'chassisserial': 'POWERCNGODYTRNHDH', 'chassisother': ' - ' }]
    };
  }

  componentDidMount() {
    this.props.fetchChassisFrontInfo();
    // this.props.fetchChassisRearInfo();
  }

  getDiskDetails(name,slot,disk) {
    this.setState({
      ...this.state,
      diskDetails:
      {
        ...defaultDiskDetails,
        ...disk
      },
      disknameandslot: `Disk Details (Disk Name: ${ name }${slot }, Slot Number: ${ slot+1 })`,
      popupOpen: true,
    });
  }

  showPopup(name,slot,disk) {
    this.getDiskDetails(name,slot,disk)
  }

  closePopup() {
    this.setState({
      ...this.state,
      popupOpen: false,
    });
  }

  render() {
    const { classes } = this.props;
    const freeSlots = [];
    if (this.props.chassis_front_list) {
      for (let i = this.props.chassis_front_list.length; i <32; i += 1) {
        freeSlots.push(
          <Grid className={`${classes.gridTile} ${classes.gridTileDisabled}`}>
            <Typography color="secondary" className={classes.diskNo}>{i + 1}</Typography>
          </Grid>
        );
      }
    }

    return (
      // <Paper className={classes.overviewPaper}>
        <Grid item spacing={2} container className={classes.powerParentGrid} data-testid="Chassis_Component">
          <Grid sm={6} xs={12} item container>
            <Paper xs={12} item className={classes.chassisOuterGrid}>  
            <InputLabel className={classes.chassisLabel}>Chassis Front View</InputLabel>
              <Grid sm={6} xs={12} item className={classes.chassisInnerGrid}>

                <div className={classes.chassisGridContainer}>
                  {/* <Grid container className={classes.chassisContainer}>
                <GridListTile></GridListTile> */}

                  <Grid container className={classes.diskContainer}>
                    {/* <InputLabel className={classes.chassisLabel}>Chassis</InputLabel> */}
                    <GridList cellHeight={150} className={classes.gridList} cols={32} data-testid="ChassisDiskPopUp">
                      {this.props.chassis_front_list
                        ? this.props.chassis_front_list.map((disk, index) => {
                          return (
                            <Tooltip
                            data-testid="Tooltip"
                              classes={{
                                tooltip: classes.tooltip,
                              }}
                              title={(
                                <React.Fragment>
                                  <div>
                                    Name:
                            {`nvme${ index}`}
                                  </div>
                                  {/* <div>
                                    Size:
                            {formatBytes(disk.size * 4 * 1024)}
                                  </div> */}
                                  
                                  <div
                                    data-testid="POPUP"
                                    role="link"
                                    aria-hidden="true"
                                    onClick={() => this.showPopup('nvme',index,disk)}
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
                              <Grid className={`${classes.gridTile} ${classes.gridTileHealthy}`}>
                                <GridListTile
                                  data-testid={`dev-${index}`}
                                  id={index}
                                // onClick={() => {
                                //   this.toggleRowSelect(index, slot);
                                // }}
                                >
                                  <Typography color="secondary">{index + 1}</Typography>
                                </GridListTile>
                              </Grid>
                            </Tooltip>
                          );
                        })
                        : null}
                      {freeSlots}
                    </GridList>
                  </Grid>
                  {/* </Grid> */}
                </div>
                <Grid item container sm={8} xs={12} wrap="wrap" className={classes.legendContainer}>
                  <Legend bgColor="green" title="Healthy" />
                  <Legend bgColor="yellow" title="Warning" />
                  <Legend bgColor="orange" title="Corrupt" />
                  <Legend bgColor="#e2e1e1" title="No Disk" />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid sm={6} xs={12} item container>
          <Paper xs={12} item className={classes.chassisOuterGrid}>       
          <ServerInformation />    
          </Paper>
          </Grid>     
          {/* <Grid sm={6} xs={12} item container >
            <Grid xs={12} item className={classes.chassisOuterGrid}>         
          <InputLabel className={classes.chassisLabel}>Chassis Rear View Information</InputLabel>
             
              <ThemeProvider theme={this.theme} >
                <MaterialTable 
                  icons={{
                    Check,
                    FirstPage,
                    LastPage,
                    NextPage: ChevronRight,
                    PreviousPage: ChevronLeft,
                    Search,
                    ThirdStateCheck: Remove,
                    DetailPanel: ChevronRight,
                    Export: SaveAlt,
                    Filter: FilterList,
                    Add,
                    Edit: EditIcon,
                    Delete: TrashIcon,
                    SortArrow: ArrowUpward,
                    Clear,
                  }}
                  columns={this.state.columns}
                  data={this.state.data}
                  options={{
                    actionsColumnIndex: -1,
                    selection: false,
                    sorting: true,
                    toolbar: false,
                    maxBodyHeight: '170px',
                    rowStyle: {
                      fontSize: '4px',
                    },
                    search: false,
                    paginationType: 'normal',
                    loadingType: 'linear',
                    headerStyle: {
                      backgroundColor: '#788595',
                      color: 'rgba(255, 255, 255, 0.87)',
                      fontSize: '14px',
                      height: '10%',
                      paddingTop: '2px',
                      paddingBottom: '2px',
                    },
                  }}

                />
              </ThemeProvider>
            </Grid>
          </Grid> */}
        
        <DiskDetails
          title={this.state.disknameandslot}
          details={this.state.diskDetails}
          open={this.state.popupOpen}
          onConfirm={this.closePopup}
          handleClose={this.closePopup}
          note_msg="Note: SMART Information cannot be retrieved from the disk as NVMe MI functionality is not implemented in BMC."
        />
        </Grid>
      // </Paper>
    );
  }
}


const mapStateToProps = state => {
  return {
    chassis_front_list: state.hardwareOverviewReducer.chassis_front_list,
    chassis_rear_list: state.hardwareOverviewReducer.chassis_rear_list,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    fetchChassisFrontInfo: () => dispatch({ type: actionTypes.SAGA_HARDWARE_OVERVIEW_FETCH_CHASSIS_FRONT_INFORMATION, }),
    // fetchChassisRearInfo: () => dispatch({ type: actionTypes.SAGA_HARDWARE_OVERVIEW_FETCH_CHASSIS_REAR_INFORMATION }),
  };
}

export default withStyles(styles)((connect(mapStateToProps, mapDispatchToProps))(((Chassis))));
