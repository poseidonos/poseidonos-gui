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
              <Grid xs={3}><Typography variant="subtitle2">Name:</Typography></Grid>
              <Grid xs={9}><Typography variant="body1">{props.details.name}</Typography></Grid>
              <Grid xs={3}><Typography variant="subtitle2">Serial No:</Typography></Grid>
              <Grid xs={9}><Typography variant="body1">{props.details.sn}</Typography></Grid>
              <Grid xs={3}><Typography variant="subtitle2">Model:</Typography></Grid>
              <Grid xs={9}><Typography variant="body1">{props.details.mn}</Typography></Grid>
            </div>
            <Typography variant="subtitle1">SMART VALUES</Typography>
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
                      {props.details.available_spare}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">Available Spare Space</CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.available_spare_space}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Available Spare Threshold
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.available_spare_threshold}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Controller Busy Time
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.controller_busy_time}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Critical Temperature Time
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.critical_temperature_time}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Current Temperature
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.current_temperature}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Data Units Read
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.data_units_read}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Data Units Written
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.data_units_written}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Device Reliability
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.device_reliability}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Host Read Commands
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.host_read_commands}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Host Write Commands
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.host_write_commands}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Life Percentage Used
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.life_percentage_used}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Lifetime Error Log Entries
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.lifetime_error_log_entries}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Power Cycles
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.power_cycles}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Power On Hours
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.power_on_hours}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Read Only
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.read_only}
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
                      {props.details.temperature_sensor1}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Temperature Sensor 2
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.temperature_sensor2}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Temperature Sensor 3
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.temperature_sensor3}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Unrecoverable Media Errors
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.unrecoverable_media_errors}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Unsafe Shutdowns
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.unsafe_shutdowns}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Volatile Memory Backup
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.volatile_memory_backup}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Warning Temperature Time
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.warning_temperature_time}
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

