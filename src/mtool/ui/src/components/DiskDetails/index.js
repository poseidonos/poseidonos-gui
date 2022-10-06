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

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import DialogTitle from '../DialogTitle';

const styles = theme => ({
  primaryContent: {
    display: "flex",
    flexWrap: "wrap",
    marginBottom: theme.spacing(1)
  },
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
    backgroundColor: '#788595',
    color: theme.palette.common.white,
    padding: theme.spacing(1, 2),
  },
  body: {
    fontSize: 12,
    padding: theme.spacing(1, 2),
  },
}))(TableCell);

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
        >
          {props.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            className={classes.alertDialogText}
          >
            <div className={classes.primaryContent}>
              <Grid xs={3}><Typography variant="subtitle1">Name :</Typography></Grid>
              <Grid xs={9}><Typography variant="subtitle2">{props.details.name}</Typography></Grid>
              <Grid xs={3}><Typography variant="subtitle1">Serial No :</Typography></Grid>
              <Grid xs={9}><Typography variant="subtitle2">{props.details.sn}</Typography></Grid>
              <Grid xs={3}><Typography variant="subtitle1">Model :</Typography></Grid>
              <Grid xs={9}><Typography variant="subtitle2">{props.details.mn}</Typography></Grid>
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
                      {props.details.controllerBusyTime}
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
                  {Array.isArray(props.details.temperatureSensor) ? props.details.temperatureSensor.map((sensor, index) => (
                    <TableRow className={classes.row}>
                      <CustomTableCell align="left">
                        Temperature Sensor {index + 1}
                      </CustomTableCell>
                      <CustomTableCell align="center">
                        {sensor}
                      </CustomTableCell>
                    </TableRow>
                  )) : null}
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
              {props.noteMsg}
            </p>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default withStyles(styles)(DiskDetails);

