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

import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './DiskDetails.css';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(),
    overflowX: 'auto',
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
    height: '20px',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(),
    top: theme.spacing(),
    color: theme.palette.grey[500],
  },
  title: {
    backgroundColor: '#18355f',
    color: theme.palette.common.white,
    padding: '10px',
  },
  headRow: {
    height: '20px',
  },
  headColumn: {
    backgroundColor: '#71859d',
  },
  buttonStyle: {
    height: '22px',
    background: '#1a4d91',
    padding: '2px 16px',
    textAlign: 'center',
    cursor: 'pointer',
    display: 'inline-block',
    color: 'white',
    margin: '0 5px',
    border: 'none',
  },
  alertDialogText: {
    color: '#000',
    fontSize: 12,
  },
});

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: 'rgba(91, 155, 213, 1)',
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 12,
  },
}))(TableCell);

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.title}>
      <Typography variant="h6">{children}</Typography>
      <IconButton
        aria-label="Close"
        className={classes.closeButton}
        onClick={onClose}
      >
        <span data-testid="diskdetails-close" style={{ fontSize: 14, color: '#fff' }}>x</span>
      </IconButton>
    </MuiDialogTitle>
  );
});

const DiskDetails = props => {
  const { classes } = props;
  return (
    <div>
      {/* <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
          Open alert dialog
        </Button> */}
      <Dialog
        fullWidth
        maxWidth="sm"
        open={props.open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          onClose={props.onConfirm}
          id="alert-dialog-title"
          className={classes.title}
        >
          <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>
            {props.title}
          </span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            className={classes.alertDialogText}
          >
	    <div className="DiskDetails-value-wrap">
              <span className="DiskDetails-value">
                <span className="Diskdetails-value-label">Name:</span>
                <span>{props.details.name}</span>
              </span>
     </div>
            <div className="DiskDetails-value-wrap">
              <span className="DiskDetails-value">
                <span className="Diskdetails-value-label">Serial No:</span>
                <span>{props.details.sn}</span>
              </span>
            </div>
	    <div className="DiskDetails-value-wrap">
              <span className="DiskDetails-value">
                <span className="Diskdetails-value-label">Model:</span>
                <span>{props.details.mn}</span>
              </span>
     </div>
            <div style={{ fontSize: 12 }}>
              <b>SMART Values</b>
            </div>
            <Paper className={classes.root}>
              <Table>
                <TableHead>
                  <TableRow className={classes.headRow}>
                    <CustomTableCell
                      className={classes.headColumn}
                      align="left"
                    >
                      <b>Name</b>
                    </CustomTableCell>
                    <CustomTableCell
                      className={classes.headColumn}
                      align="center"
                    >
                      <b>Value</b>
                    </CustomTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/*
                  This code is commented so that in future, if we decide to use dynamic values, we can uncomment this
                  {
                    Object.keys(props.details).map((key) => (
                      <TableRow className={classes.row}>
                        <CustomTableCell align="left">
                          {key.charAt(0).toUpperCase() + (key.replace(/([A-Z])/g, " $1")).slice(1)}
                        </CustomTableCell>
                        <CustomTableCell align="center">
                          {props.details[key]}
                        </CustomTableCell>
                      </TableRow>
                    ))
                  } */}
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Available Spare
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.availableSpare}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">Available Spare Space</CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.availableSpareSpace}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Available Spare Threshold
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.availableSpareThreshold}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Controller Busy Time
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.contollerBusyTime}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Critical Temperature Time
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.criticalTemperatureTime}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Current Temperature
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.currentTemperature}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Data Units Read
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.dataUnitsRead}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Data Units Written
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.dataUnitsWritten}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Device Reliability
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.deviceReliability}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Host Read Commands
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.hostReadCommands}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Host Write Commands
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.hostWriteCommands}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Life Percentage Used
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.lifePercentageUsed}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Lifetime Error Log Entries
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.lifetimeErrorLogEntries}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Power Cycles
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.powerCycles}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Power On Hours
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.powerOnHours}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Read Only
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.readOnly}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Temperature
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.temperature}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Temperature Sensor 1
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.temperatureSensor1}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Temperature Sensor 2
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.temperatureSensor2}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Temperature Sensor 3
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.temperatureSensor3}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Unrecoverable Media Errors
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.unrecoverableMediaErrors}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Unsafe Shutdowns
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.unsafeShutdowns}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Volatile Memory Backup
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.volatileMemoryBackup}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Warning Temperature Time
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.warningTemperatureTime}
                    </CustomTableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
            <p style={{ marginTop: '10px' }}>
              {props.note_msg}
            </p>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default withStyles(styles)(DiskDetails);

