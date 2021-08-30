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
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles, MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles';
import { Grid, TextField } from '@material-ui/core';
import { PageTheme } from '../../theme';

const styles = theme => ({
  title: {
    backgroundColor: '#424850',
    color: theme.palette.common.white,
    padding: '5px',
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
    right: theme.spacing(),
    top: '0px',
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
  textField: {
    width: '70%'
  },
  actions: {
    margin: '0 20px 20px 20px',
    justifyContent: 'center',
  },
});

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
        <span style={{ fontSize: 14, color: '#fff' }}>x</span>
      </IconButton>
    </MuiDialogTitle>
  );
});

const ChangePassword = (props) => {
  const { classes } = props;
  return (
    <ThemeProvider theme={PageTheme}>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          onClose={props.handleClose}
          id="alert-dialog-title"
          className={classes.title}
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
            Change Password
          </span>
        </DialogTitle>
        <DialogContent>
          <Grid container justifyContent="center">
            <Grid item xs={12} container justify="center">
                <TextField className={classes.textField}
                  required
                  margin="none"
                  value={props.oldPassword}
                  name="oldPassword"
                  type="password"
                  label="Old Password"
                  placeholder="Enter Old Password"
                  onChange={props.OnHandleChange}
                  onKeyDown={e => /[+-,#, ,]$/.test(e.key)}
                />
            </Grid>
            <Grid item xs={12} container justify="center">
                <TextField className={classes.textField}
                  required
                  margin="none"
                  value={props.newPassword}
                  name="newPassword"
                  type="password"
                  label="New Password"
                  placeholder="Enter New Password"
                  onChange={props.OnHandleChange}
                  onKeyDown={e => /[+-,#, ,]$/.test(e.key)}
                />
            </Grid>
            <Grid item xs={12} container justify="center">
                <TextField className={classes.textField}
                  required
                  margin="none"
                  name="confirmPassword"
                  value={props.confirmPassword}
                  type="password"
                  label="Confirm Password"
                  placeholder="Confirm New Password"
                  onChange={props.OnHandleChange}
                  onKeyDown={e => /[+-,#, ,]$/.test(e.key)}
                />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions className={classes.actions}>
          <Button
            color="primary"
            variant="contained"
            onClick={props.handleClose}
            className={classes.submit}
            autoFocus
            id="change-pwd-cancel"
            data-testid="change-pwd-cancel"
          >
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            className={classes.submit}
            onClick={props.onConfirm}
            id="change-pwd-submit"
            data-testid="change-pwd-submit"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default withStyles(styles)(ChangePassword);
