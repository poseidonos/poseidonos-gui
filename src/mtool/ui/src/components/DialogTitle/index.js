import React from "react";
import { withStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
  title: {
    // backgroundColor: '#18355f',
    backgroundColor: '#424850',
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    display: 'flex',
    color: '#fff',
    fontSize: 14,
    fontWeight: 500,
    alignItems: 'center',
  },

  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: '0px',
    color: theme.palette.grey[500],
  }
});

const DialogTitle = props => {
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
};

export default withStyles(styles)(DialogTitle);
