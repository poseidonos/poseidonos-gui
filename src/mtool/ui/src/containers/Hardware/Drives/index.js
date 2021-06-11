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
import { connect } from 'react-redux'
import { withStyles, Grid, Paper } from '@material-ui/core';
import ThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
// import AlertDialog from '../../../components/Dialog';
import { PageTheme, customTheme } from '../../../theme';
import * as actionTypes from '../../../store/actions/actionTypes';
// import * as actionCreators from "../../../store/actions/exportActionCreators";
import Chassis from '../../../components/OverviewComponents/Chassis'
import DriveTable from '../../../components/DriveComponents/DriveTable'

const styles = (theme) => ({
  overviewContainer: {
    margin: 0,
    maxWidth: "100%"
  },
  content: {
    flexGrow: 1,
    width: '100%',
    boxSizing: 'border-box',
    padding: theme.spacing(2, 0)
  },
  toolbar: customTheme.toolbar,
  cardHeader: customTheme.card.header,
  overviewPaper: {
    width: '100%',
  },
});

class DrivesTab extends Component {
  /* constructor(props) {
    super(props);
    // this.openAlert = this.openAlert.bind(this);
    // this.handleAlertClose = this.handleAlertClose.bind(this);
    // this.triggerCommand = this.triggerCommand.bind(this);
  } */

  componentDidMount() {
    this.props.fetchChassisFrontInfo();
  }

  // handleAlertClose() {
  //   this.props.openAlertBox({
  //     alertOpen: false
  //   });
  // }

  // openAlert(operationType) {
  //   this.props.openAlertBox({
  //     alertOpen: true,
  //     addDeleteSend: operationType,
  //     alerttype: 'delete',
  //     istypealert: false,
  //     alerttitle: `${operationType} System`,
  //     alertdescription: `Are you sure you want to ${operationType} the system?`,
  //   }
  //   );
  // }

  // triggerCommand() {
  //   if (this.props.addDeleteSend === 'Reboot') {
  //     this.props.rebootSystem();
  //     this.handleAlertClose();
  //   } else if (this.props.addDeleteSend === 'Shutdown') {
  //     this.props.shutdownSystem();
  //     this.handleAlertClose();
  //   }
  // }

  render() {
    const { classes } = this.props;
    return (
      <ThemeProvider theme={PageTheme}>
        <main className={classes.content}>
          <Grid container className={classes.overviewContainer}>
            <Paper className={classes.overviewPaper}>
              <Chassis />
                {/* openAlert={this.openAlert}
              /> */}
              <DriveTable />
            </Paper>
          </Grid>
        </main>
        {/* <AlertDialog
          title={this.props.alerttitle}
          description={this.props.alertdescription}
          open={this.props.alertOpen}
          type={this.props.alerttype}
          handleClose={this.handleAlertClose}
          onConfirm={this.triggerCommand}
        /> */}
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => {
  return {
    alertOpen:state.alertManagementReducer.alertOpen,
    addDeleteSend: state.alertManagementReducer.addDeleteSend,
    alerttype: state.alertManagementReducer.alerttype,
    istypealert: state.alertManagementReducer.istypealert,
    alerttitle: state.alertManagementReducer.alerttitle,
    alertdescription: state.alertManagementReducer.alertdescription,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    fetchChassisFrontInfo: () => dispatch({ type: actionTypes.SAGA_HARDWARE_OVERVIEW_FETCH_CHASSIS_FRONT_INFORMATION, }),
    // openAlertBox: (alertParam) => dispatch(actionCreators.openAlertBox(alertParam)),
  };
}

export default withStyles(styles)((connect(mapStateToProps, mapDispatchToProps))(((DrivesTab))));
