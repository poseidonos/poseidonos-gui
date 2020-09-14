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
import ThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
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
    fontSize: '12px',
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
        <span style={{ fontSize: '14px', color: '#fff' }}>x</span>
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
                            fontSize: '14px',
                            fontWeight: 500,
                            alignItems: 'center',
                        }}
                    >
                        Change Password
                    </span>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText
                        id="alert-dialog-description"
                        className={classes.dialogContent}
                    >
                        <Grid container justify="center">
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
                    </DialogContentText>
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
