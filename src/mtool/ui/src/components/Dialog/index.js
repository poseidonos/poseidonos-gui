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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { withStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import DeleteIcon from '../../assets/images/Delete-ICON.png';
import ErrorIcon from '../../assets/images/ERROR-ICON.png';
import AlertIcon from '../../assets/images/ERROR-ICON_old.png';
import InfoIcon from '../../assets/images/INFO-ICON.png';

const styles = theme => ({
  title: {
    // backgroundColor: '#18355f',
    backgroundColor: '#424850',
    color: theme.palette.common.white,
    padding: theme.spacing(1),
  },
  dialogContent: {
    display: 'flex',
    alignItems: 'center',
  },
  submit: {
    // background: '#007bff',
    height: '1.8rem',
    fontSize: 12,
    textTransform: 'none',
    minWidth: '0px',
    width: '60px',
  },

  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: '4px',
    color: theme.palette.grey[500],
  },
  buttonStyle: {
    height: '22px',
    background: '#1a4d91',
    padding: '2px 16px',
    textAlign: 'center',
    cursor: 'pointer',
    color: 'white',
    margin: '0 5px',
    border: 'none',
    display: 'flex',
    justifyContent: 'center',
    align: 'center',
  },
  actions: {
    margin: '0 20px 20px 20px',
    justifyContent: 'center',
  },
});

export const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.title}>
      <Typography variant="h6">{children}</Typography>
      {!props.removeCrossButton && (
        <IconButton
          aria-label="Close"
          className={classes.closeButton}
          onClick={onClose}
          data-testid="alertCloseButton"
        >
          <span style={{ fontSize: 14, color: '#fff' }}>x</span>
        </IconButton>
      )}
    </MuiDialogTitle>
  );
});

const AlertDialog = (props) => {
  const { classes } = props;
  const history = useHistory();

  const handleConfirm = () => {
    if (props.link) {
      history.push(props.link);
    }
    props.handleClose();
  }

  const actions =
    props.type !== 'alert' && props.type !== 'info' && props.type !== 'partialError' ? (
      <DialogActions className={classes.actions}>
        <Button
          color="primary"
          variant="contained"
          onClick={props.handleClose}
          className={classes.submit}
          autoFocus
          data-testid="alertbox-no"
        >
          No
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={props.onConfirm}
          className={classes.submit}
          data-testid="alertbox-yes"
        >
          Yes
        </Button>
      </DialogActions>
    ) : (
      <DialogActions className={classes.actions}>
        <Button
          color="primary"
          variant="contained"
          onClick={handleConfirm}
          className={classes.submit}
          autoFocus
          data-testid="alertbox-ok"
        >
          OK
        </Button>
      </DialogActions>
    );
  const getIcon = (type) => {
    if (type === 'alert')
      return ErrorIcon;
    if (type === 'info')
      return InfoIcon;
    if (type === 'partialError')
      return AlertIcon;
    return DeleteIcon;
  };
  return (
    <div>
      <Dialog
        maxWidth="xs"
        open={props.open ? props.open : false}
        onClose={(event, reason) => {
          if (reason !== "backdropClick" && reason !== 'escapeKeyDown') {
            props.handleClose()
          }
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          onClose={props.handleClose}
          id="alert-dialog-title"
          className={classes.title}
          removeCrossButton={props.removeCrossButton}
        >
          <span
            style={{
              display: 'flex',
              padding: '3px',
              paddingLeft: '10px',
              color: '#fff',
              fontSize: 14,
              fontWeight: 500,
              alignItems: 'center',
            }}
          >
            {props.title}
          </span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            className={classes.dialogContent}
          >
            <span
              style={{
                padding: '35px 1px 0px 30px',
                color: '#000',
                fontSize: 12,
                display: 'inline-block',
              }}
            >
              <img
                style={{ height: '20px', marginRight: '7px' }}
                alt="icon"
                src={
                  getIcon(props.type)
                }
              />
            </span>
            <span
              style={{
                padding: '35px 30px 0px 0px',
                color: '#000',
                fontSize: 12,
                display: 'block'
              }}
              data-testid="alertDescription"
            >
              {props.description}
            </span>
          </DialogContentText>
          <p
            style={{
              color: '#000',
              fontSize: 12,
              padding: '0px 0px 0px 61px',
              whiteSpace: 'pre-line',
              display: 'block',
              marginTop: '0px',
            }}
          >
            {props.errCode}
          </p>
          {/* <p style={{color: "#000", fontSize: "12px", display: "block", width: "100%", textAlign: "center", marginTop: "0px"}}>{props.errCode}</p>            */}
        </DialogContent>

        {actions}
      </Dialog>
    </div>
  );
}

export default withStyles(styles)(AlertDialog);
