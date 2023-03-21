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

import React, { Component } from "react";
import { Grid, ThemeProvider, Typography, withStyles } from "@material-ui/core";
import MaterialTable from "@material-table/core";
import {
  Add,
  Check,
  Clear,
  FirstPage,
  LastPage,
  Search,
  ChevronRight,
  ChevronLeft,
  Remove,
  ArrowUpward,
} from "@material-ui/icons";
import { connect } from "react-redux";
import { customTheme, TableTheme } from "../../../theme";
import CreateTransport from "../../../components/CreateTransport";
import Popup from "../../../components/Popup";
import * as actionTypes from "../../../store/actions/actionTypes";
import MToolLoader from "../../../components/MToolLoader";
import AlertDialog from "../../../components/Dialog";

const styles = (theme) => ({
  cardHeader: {
    ...customTheme.card.header,
    marginLeft: 0,
  },
  item: {
    marginTop: theme.spacing(1),
    width: "100%",
  },
});

const icons = {
  Add,
  FirstPage,
  LastPage,
  NextPage: ChevronRight,
  PreviousPage: ChevronLeft,
  ThirdStateCheck: Remove,
  DetailPanel: ChevronRight,
  SortArrow: ArrowUpward,
  Check,
  Search,
  ResetSearch: Clear,
};

class Transport extends Component {
  constructor() {
    super()
    this.state = {
      dialogOpen: false
    };
    this.openCreateTransportDialog = this.openCreateTransportDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
  }

  componentDidMount() {
    this.props.Get_Transports();
  }

  closeDialog() {
    this.setState({
      dialogOpen: false
    });
  }

  openCreateTransportDialog() {
    this.setState({
      dialogOpen: true
    });
  }

  render() {
    const transportTableColumns = [
      {
        title: "Transport type",
        field: "type",
      },
      {
        title: "Max QD",
        field: "maxQueueDepth",
      },
      {
        title: "Max IO Qpairs/ctrlr ",
        field: "maxIoQpairsPerCtrlr",
      },
      {
        title: "Incapsule Data Size",
        field: "inCapsuleDataSize",
      },
      {
        title: "MAX IO Size",
        field: "maxIoSize",
      },
      {
        title: "IO Unit Size",
        field: "ioUnitSize",
      },
      {
        title: "Abort Timeout Sec",
        field: "abortTimeoutSec",
      },
      {
        title: "Buf Cache Size",
        field: "bufCacheSize",
      },
      {
        title: "Num Shared Size",
        field: "numSharedBuf",
      },
    ];
    const { classes } = this.props;
    return (
      <Grid container direction="column">
        <Grid item className={classes.item}>
          <ThemeProvider theme={TableTheme}>
            <MaterialTable
              title={
                <Typography className={classes.cardHeader} variant="h1">
                  Transport List
                </Typography>
              }
              actions={[{
                icon: Add,
                tooltip: "Add a transport",
                iconProps: {
                  'data-testid': "add-transport"
                },
                isFreeAction: true,
                onClick: () => {
                  this.openCreateTransportDialog();
                }
              }]}
              data={this.props.transports}
              options={{
                headerStyle: customTheme.table.header,
              }}
              columns={transportTableColumns}
              icons={icons}
            />
          </ThemeProvider>
        </Grid>
        <Popup
          title="Create Transport"
          open={this.state.dialogOpen}
          close={this.closeDialog}
        >
          <CreateTransport
            cleanup={this.closeDialog}
          />
        </Popup>
        {this.props.loading ? <MToolLoader text={this.props.loadText} /> : null}
        <AlertDialog
          title={this.props.alertTitle}
          description={this.props.errorMsg}
          open={this.props.alertOpen}
          type={this.props.alertType}
          errCode={this.props.errorCode}
          onConfirm={this.props.Close_Alert}
          handleClose={this.props.Close_Alert}
        />
      </Grid>
    );
  }
}
const mapStateToProps = (state) => ({
  loading: state.storageReducer.loading,
  loadText: state.storageReducer.loadText,
  transports: state.storageReducer.transports,
  alertOpen: state.storageReducer.alertOpen,
  alertType: state.storageReducer.alertType,
  alertTitle: state.storageReducer.alertTitle,
  errorMsg: state.storageReducer.errorMsg,
  errorCode: state.storageReducer.errorCode,
});

const mapDispatchToProps = (dispatch) => ({
  Get_Transports: (payload) =>
    dispatch({ type: actionTypes.SAGA_FETCH_TRANSPORT_INFO, payload }),
  Close_Alert: () => dispatch({ type: actionTypes.STORAGE_CLOSE_ALERT }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Transport));
