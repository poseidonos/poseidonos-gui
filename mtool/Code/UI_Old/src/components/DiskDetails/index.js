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
[12/06/2019] [Aswin] : Values adjusted for showing as NA
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
    fontSize: '12px',
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
        <span data-testid="diskdetails-close" style={{ fontSize: '14px', color: '#fff' }}>x</span>
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
          <span style={{ color: '#fff', fontSize: '14px', fontWeight: 600 }}>
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
                <span className="Diskdetails-value-label">Serial No: </span>
                <label>{props.details.SerialNumber}</label>
              </span>
              <span className="DiskDetails-value">
                <span className="Diskdetails-value-label">Model: </span>
                <label>{props.details.Model}</label>
              </span>
            </div>
            <div className="DiskDetails-value-wrap">
              <span className="DiskDetails-value">
                <span className="Diskdetails-value-label">Build Date: </span>
                <label>{props.details.BuildDate}</label>
              </span>
              <span className="DiskDetails-value">
                <span className="Diskdetails-value-label">Manufacturer: </span>
                <label>{props.details.Manufacturer}</label>
              </span>
            </div>
            <div className="DiskDetails-value-wrap">
              <span className="DiskDetails-value">
                <span className="Diskdetails-value-label">Part Number: </span>
                <label>{props.details.PartNumber}</label>
              </span>
              <span className="DiskDetails-value">
                <span className="Diskdetails-value-label">Total Size: </span>
                <label>{props.details.PhysicalSize}</label>
              </span>
            </div>
            <div className="DiskDetails-value-wrap">
              <span className="DiskDetails-value">
                <span className="Diskdetails-value-label">Used Size: </span>
                <label>{props.details.UsedBytes}</label>
              </span>
              <span className="DiskDetails-value">
                <span className="Diskdetails-value-label">Firmware: </span>
                <label>{props.details.Firmware}</label>
              </span>
            </div>
            <div className="DiskDetails-value-wrap">
            <span className="DiskDetails-value">
                <span className="Diskdetails-value-label">Predicted Life (%): </span>
                <label>{props.details.PredictedMediaLifeLeftPercent}</label>
            </span>
            </div>

            <div style={{ fontSize: '12px' }}>
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
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Critical Warning
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.critical_warning}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">Temperature</CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.temperature}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Available Spare
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.avail_spare}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Spare Threshold
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.spare_thresh}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Percentage Used
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.percent_used}
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
                      Critical Composite Temperature Time
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.critical_comp_time}
                    </CustomTableCell>
                  </TableRow>
                  <TableRow className={classes.row}>
                    <CustomTableCell align="left">
                      Warning Temperature Time
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {props.details.warning_temp_time}
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
