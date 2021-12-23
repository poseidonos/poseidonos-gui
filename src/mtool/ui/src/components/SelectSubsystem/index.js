import React from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { Button, Grid, FormControl, InputLabel, Select, MenuItem, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import DialogTitle from "../DialogTitle";

const styles = (theme) => ({
  dialogContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  formControl: {
    flexDirection: 'column'
  },
  subsystemFormItem: {
    margin: theme.spacing(1)
  }
});

const SelectSubsystem = (props) => {
    const { classes } = props;
    return (
      <Dialog
        fullWidth
        maxWidth="sm"
        open={props.open}
        aria-labelledby="subsystem-dialog-title"
        aria-describedby="subsystem-dialog-description"
      >
        <DialogTitle
          onClose={props.handleClose}
          id="subsystem-dialog-title"
        >
          <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>
            {props.title}
          </span>
        </DialogTitle>
        <DialogContent
            className={classes.dialogContent}
        >
	    {/*<DialogContentText
            id="subsystem-dialog-description"
          >*/}
	    <Grid
              item
              container
              xs={12}
              justifyContent="center"
              className={classes.formControl}
            >
	      <Typography variant="h6" align="center">Volume: {props.volume}</Typography>
	      <Typography variant="h6" align="center">Array: {props.array}</Typography>
              <FormControl className={classes.subsystemFormItem}>
              <InputLabel htmlFor="subsystem">Select Subsystem</InputLabel>
              <Select
                  value={props.selectedSubsystem}
                  onChange={props.handleChange}
                  label="Select Subsystem"
                  inputProps={{
                    name: "subsystem",
                    id: "subsystem",
                    "data-testid": "subsystem-input",
                  }}
                  SelectDisplayProps={{
                    "data-testid": "subsystem",
                  }}
                  className={classes.unitSelect}
              >
                  {props.subsystems.map((subsystem) => subsystem.subtype === "NVMe" ?
                  (
                    <MenuItem value={subsystem.nqn} key={subsystem.nqn}>
                      {subsystem.nqn} {subsystem.array ? `(Used by ${subsystem.array})` : null}
                    </MenuItem>
                  ) : null)}
              </Select>
	      <Button
                  onClick={props.mountVolume}
                  variant="contained"
                  color="primary"
                  data-testid="mountvolume-btn"
                  className={classes.subsystemFormItem}
              >
                  Mount Volume
              </Button>
              </FormControl>
            </Grid>
	    {/*</DialogContentText>*/}
	</DialogContent>
      </Dialog>
    );
}

export default withStyles(styles)(SelectSubsystem);
