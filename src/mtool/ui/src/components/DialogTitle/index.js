import React from "react";
import { withStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
  title: {
    // backgroundColor: '#18355f',
    backgroundColor: '#424850',
    color: theme.palette.common.white,
    padding: '5px',
  },

  closeButton: {
    position: 'absolute',
    right: theme.spacing(),
    top: theme.spacing(),
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
        <span data-testid="diskdetails-close" style={{ fontSize: 14, color: '#fff' }}>x</span>
      </IconButton>
    </MuiDialogTitle>
  );
};

export default withStyles(styles)(DialogTitle);
