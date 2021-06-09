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

DESCRIPTION: Overview Page Power Component
@NAME : index.js
@AUTHORS: Jay Hitesh Sanghavi
@Version : 1.0 
@REVISION HISTORY
[03/11/2019] [Jay] : Prototyping..........//////////////////// 
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import Tooltip from '@material-ui/core/Tooltip';
import * as actionTypes from "../../../store/actions/actionTypes";

const styles = theme => ({
  root: {
    flexGrow: 1
  },

  overviewPaper: {
    width: "100%"
  },

  textField: {
    color: "black",
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 230
  },
  powerParentGrid: {
    marginTop: theme.spacing(0.5)
  },
  powerOuterGrid: {
    // border: "1px solid gray",
    maxWidth: "100%",
    flexBasis: "100%",
    overflowY: "auto",
    overflowX: "hidden",
    minHeight: "130px",
    // maxHeight: "130px",
    background: "#fff"
  },
  powerInnerGrid: {
    maxWidth: "100%",
    marginTop: theme.spacing(1)
  },
  powerHeader: {
    backgroundColor: "#788595",
    color: "white",
    paddingLeft: "5px",
    fontSize: "14px",
    height: "24px"
  },
  label: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(3)
  },
  submit: {
    height: "1.75rem",
    fontSize: "12px",
    textTransform: "none",
    marginTop: "18px",
    marginRight: "15px",
    // minWidth: '0px',
    maxWidth: "110px"
  }
});

class PowerInformation extends Component {

  componentDidMount() {
    this.props.fetchPowerInfo();
    this.interval = setInterval(() => {
        this.props.fetchPowerInfo("doNotStartLoader");
      }, 300000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { classes } = this.props;
    return (
        <Grid item container spacing={2} className={classes.powerParentGrid}>
          <Grid sm={6} xs={12} item container>
            <Paper xs={12} item className={classes.powerOuterGrid}>
              <Typography className={classes.powerHeader} variant="h6">
                Power Options
              </Typography>
              <Grid sm={6} xs={12} item className={classes.powerInnerGrid}>
                <TextField
                  className={classes.textField}
                  id="standard-required"
                  margin="none"
                  value={this.props.powerconsumption === 0 ? "Error" : this.props.powerconsumption}
                  label="Power Consumption (Watts)"
                  disabled
                  InputProps={{
                    readOnly: true,
                    classes: {
                      input: classes.textField
                    }
                  }}
                />
                <TextField
                  className={classes.textField}
                  id="standard-required"
                  margin="none"
                  value={this.props.powercap}
                  disabled
                  label="Power CAP"
                  InputProps={{
                    readOnly: true,
                    classes: {
                      input: classes.textField
                    }
                  }}
                />
                <TextField
                  className={classes.textField}
                  id="standard-required"
                  margin="none"
                  disabled
                  value={this.props.powerstatus}
                  label=" CPU Power Status"
                  InputProps={{
                    readOnly: true,
                    classes: {
                      input: classes.textField
                    }
                  }}
                />
                <div style={{paddingBottom:"10px"}}>
              <Tooltip title = "Power On Poseidon Box">
                <Button
                 data-testid = "PowerOnButton"
                  variant="contained"
                  color="primary"
                  type="submit"
                  style={{ marginLeft: "20px" }}
                  className={classes.submit}
                  onClick={() => {
                    this.props.openAlert("Power On Poseidon Box");
                  }}
                >
                  On
                </Button>
              </Tooltip>
                <Tooltip title = "Power Off Poseidon Box">
                <Button
                  data-testid = "PowerOffButton"
                  variant="contained"
                  color="primary"
                  type="submit"
                  className={classes.submit}
                  onClick={() => {
                    this.props.openAlert("Power Off Poseidon Box");
                  }}
                >
                  Off
                </Button>
                </Tooltip>
                <Tooltip title = "Force Power Off Poseidon Box">
                <Button
                 data-testid = "ForcePowerOffButton"
                  variant="contained"
                  color="primary"
                  type="submit"
                  className={classes.submit}
                  onClick={() => {
                    this.props.openAlert("Force Power Off Poseidon Box");
                  }}
                >
                  Force Off
                </Button>
                </Tooltip>
                  <Tooltip title = "Restart Poseidon Box">
                <Button
                  data-testid = "ForceRestartButton"
                  variant="contained"
                  color="primary"
                  type="submit"
                  className={classes.submit}
                  onClick={() => {
                    this.props.openAlert("Force Restart Poseidon Box");
                  }}
                >
                  Restart
                </Button>
                  </Tooltip>
                </div>
              </Grid>
            </Paper>
          </Grid>

          <Grid sm={6} xs={12} item container>
            <Paper xs={12} item className={classes.powerOuterGrid}>
              <Grid
                sm={6}
                xs={12}
                item
                className={classes.powerInnerGrid}
                style={{ textAlign: "center", marginTop: "60px" }}
              >
                <span>Turn On Server LED</span>
                <Switch
                  size="small"
                  checked
                  id="serverLED"
                  color="primary"
                  // onClick={() => console.log("here")}
                />
              </Grid>
            </Paper>
          </Grid>
        </Grid>
    );
  }
}

const mapStateToProps = state => {
  return {
    powerconsumption: state.hardwareOverviewReducer.powerconsumption,
    powercap: state.hardwareOverviewReducer.powercap,
    powerstatus: state.hardwareOverviewReducer.powerstatus
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchPowerInfo: (param) =>
      dispatch({
        type: actionTypes.SAGA_HARDWARE_OVERVIEW_FETCH_POWER_INFORMATION,param
      })
  };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PowerInformation)
);
