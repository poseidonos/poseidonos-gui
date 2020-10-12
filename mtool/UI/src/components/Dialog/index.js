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
import DeleteIcon from '../../assets/images/Delete-ICON.png';
import ErrorIcon from '../../assets/images/ERROR-ICON.png';
import AlertIcon from '../../assets/images/ERROR-ICON_old.png';
import InfoIcon from '../../assets/images/INFO-ICON.png';

const styles = theme => ({
  title: {
    // backgroundColor: '#18355f',
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
        data-testid = "alertCloseButton"
      >
        <span style={{ fontSize: '14px', color: '#fff' }}>x</span>
      </IconButton>
    </MuiDialogTitle>
  );
});

class AlertDialog extends React.Component {

  // handleClickOpen = () => {
  //   this.setState({ open: true });
  // };

  // handleClose = () => {
  //   this.setState({ open: false });
  // };

  render() {
    const { classes } = this.props;
    const actions =
      this.props.type !== 'alert' && this.props.type !== 'info' && this.props.type !== 'partialError' ? (
        <DialogActions className={classes.actions}>
          <Button
            color="primary"
            variant="contained"
            onClick={this.props.handleClose}
            className={classes.submit}
            autoFocus
            data-testid="alertbox-no"
          >
            No
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={this.props.onConfirm}
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
            onClick={this.props.handleClose}
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
        {/* <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
          Open alert dialog
        </Button> */}
        <Dialog
          // minWidth="xs"
          maxWidth="xs"
          // fullWidth="false"
          open={this.props.open ? this.props.open : false}
          onClose={this.props.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            onClose={this.props.handleClose}
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
              {this.props.title}
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
                  fontSize: '12px',
                  display: 'inline-block',
                }}
              >
                <img
                  style={{ height: '20px', marginRight: '7px' }}
                  alt="icon"
                  src={
                    getIcon(this.props.type)
                  }
                />
              </span>
              <span
                style={{
                  padding: '35px 30px 0px 0px',
                  color: '#000',
                  fontSize: '12px',
                  display: 'block'
                }}
                data-testid = "alertDescription"
              >
                {this.props.description}
              </span>
            </DialogContentText>
            <p
              style={{
                color: '#000',
                fontSize: '12px',
                padding: '0px 0px 0px 61px',
                whiteSpace: 'pre',
                display: 'block',
                marginTop: '0px',
              }}
            >
              {this.props.errCode}
            </p>
            {/* <p style={{color: "#000", fontSize: "12px", display: "block", width: "100%", textAlign: "center", marginTop: "0px"}}>{this.props.errCode}</p>            */}
          </DialogContent>

          {actions}
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(AlertDialog);
