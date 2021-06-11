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

import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import {
  Button,
  Paper,
  Grid,
  Typography,
  withStyles,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Tooltip,
} from "@material-ui/core";
import { customTheme, PageTheme } from "../../../theme";
import "../../../containers/Volume/Volume.css";
import "./CreateVolume.css";
import AlertDialog from "../../Dialog";
import * as actionCreators from "../../../store/actions/exportActionCreators";
import formatBytes from "../../../utils/format-bytes";

const styles = (theme) => ({
  formContainer: {
    width: "100%",
    display: "flex",
    padding: theme.spacing(0, 4),
    flexWrap: "wrap",
    boxSizing: "border-box",
  },
  volBtnContainer: {
    margin: theme.spacing(1, 0),
  },
  unitSelect: {
    marginTop: theme.spacing(2),
    height: 32,
  },
  unitText: {
    width: "calc(80% - 60px)",
    display: "flex",
    justifyContent: "flex-end",
    [theme.breakpoints.down("xs")]: {
      width: "60%",
    },
  },
  formControl: {
    [theme.breakpoints.down("xs")]: {
      justifyContent: "center",
    },
  },
  button: {
    height: "1.8rem",
    lineHeight: "0px",
  },
  volumeName: {
    width: "80%",
  },
  volumeUnit: {
    minWidth: 60,
    [theme.breakpoints.down("xs")]: {
      width: "20%",
    },
  },
  volumeCreatePaper: {
    height: 350,
    [theme.breakpoints.down('md')]: {
      height: 400
    },
    [theme.breakpoints.down('xs')]: {
      height: 550
    }
  },
  createHeader: customTheme.card.header,
  caption: {
    color: "#424850",
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  labelCheckbox: {
    marginTop: theme.spacing(3),
  },
});

class CreateVolume extends Component {
  constructor(props) {
    super(props);
    this.state = {
      volume_count: 1,
      volume_name: "vol",
      volume_suffix: 0,
      volume_size: 0,
      volume_description: "",
      volume_units: "GB",
      form_valid: true,
      open: false,
      alert_description: "",
      maxbw: 0,
      maxiops: 0,
      stop_on_error_checkbox: false,
      mount_vol: true,
      alert_open: false,
      onConfirm: null,
    };

    this.setUnit = this.setUnit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.createVolumeInParent = this.createVolumeInParent.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    this.props.createVolSocket.on("connect", () => {
      console.log("connected to create volume socket"); // eslint-disable-line no-console
    });

    // on reconnection, reset the transports option, as the Websocket
    // connection may have failed (caused by proxy, firewall, browser, ...)
    this.props.createVolSocket.on("reconnect_attempt", () => {
      this.props.createVolSocket.io.opts.transports = ["polling", "websocket"];
    });

    // callback function for create multi-volume response
    this.props.createVolSocket.on("create_multi_volume", (msg) => {
      /* eslint-disable camelcase */
      if (this.props.createVolumeButton === true) {
        let alertType = "info";
        const { total_count, pass, description } = msg;
        if (pass === 0) {
          alertType = "alert";
        } else if (pass > 0 && total_count - pass > 0)
          alertType = "partialError";
        const errorMsg = `Total Volumes: ${total_count}, Passed: ${pass}, Failed: ${total_count -
          pass}`;
        this.props.toggleCreateVolumeButton(false);
        this.props.showStorageAlert({
          alertType,
          alertTitle: "Create Volume",
          errorMsg,
          errorCode: description,
        });

        this.setState({
          ...this.state,
          volume_count: 1,
          volume_name: "vol",
          volume_suffix: 0,
          volume_size: 0,
          volume_description: "",
          volume_units: "GB",
          maxbw: 0,
          maxiops: 0,
          stop_on_error_checkbox: false,
          mount_vol: true,
        });

        this.props.fetchVolumes();
        this.props.fetchArray();
      }
      /* eslint-enable camelcase */
    });
  }

  handleClose() {
    this.setState({ open: false, alert_open: false });
  }

  handleChange(event) {
    const { name, value } = event.target;
    if (name === "stop_on_error_checkbox") {
      this.setState({
        stop_on_error_checkbox: !this.state.stop_on_error_checkbox,
      });
    } else if (name === "mount_vol_checkbox") {
      this.setState({ mount_vol: !this.state.mount_vol });
    } else this.setState({ [name]: value });
  }

  setUnit(event) {
    this.setState({ volume_units: event.target.value });
  }

  createVolumeInParent() {
    let isError = true;
    let errorDesc = "";
    let volSize = this.state.volume_size;
    let maxAvailableSize;
    if (this.state.volume_size.length === 0)
      errorDesc = "Please Enter Volume Size";
    else if (this.state.volume_size < 0)
      errorDesc = "Volume Size cannot be negative";
    else if (this.state.volume_name.length < 1)
      errorDesc = "Please Enter Volume Name";
    else if (this.state.volume_count.length === 0)
      errorDesc = "Please Enter Volume Count";
    // istanbul ignore next: cannot provide negative numbers to number field with min 0
    else if (this.state.volume_count < 1)
      errorDesc = "Volume Count should be greater than 0";
    else if (this.state.volume_count > parseInt(this.props.maxVolumeCount, 10))
      errorDesc = `Volume Count should not exceed ${this.props.maxVolumeCount}`;
    else if (this.state.volume_count > 1 && this.state.volume_suffix < 0)
      errorDesc = "Suffix Value cannot be negative";
    else if (this.state.volume_count > 1 && this.state.volume_suffix === null)
      errorDesc = "Please Enter Suffix Start Value";
    else if (this.state.maxbw.length === 0)
      errorDesc = "Please Enter Maximum Bandwidth (MB/s) ";
    else if (this.state.maxiops.length === 0)
      errorDesc = "Please Enter Maximum IOPS (KIOPS)";
    else if (this.state.maxbw < 0)
      errorDesc = "Max Bandwidth cannot be negative";
    else if (this.state.maxiops < 0) errorDesc = "Maximum IOPS be negative";
    else if (this.state.maxiops > 0 && this.state.maxiops < 10)
      errorDesc = "Invalid value for Maximum IOPS";
    else isError = false;

    if (isError === true) {
      this.setState({ open: true, alert_description: errorDesc });
      return;
    }

    if (this.state.volume_size !== 0) {
      maxAvailableSize = formatBytes(this.props.maxAvailableSize);
      volSize =
        `${this.state.volume_size.toString() } ${ this.state.volume_units}`;

      if (volSize === maxAvailableSize) {
        volSize = 0;
        this.setState({ volume_size: 0 });
      }
    }

    if (this.state.volume_count > 1 && parseInt(volSize, 10) === 0) {
      this.setState({
        alert_open: true,
        onConfirm: () => {
          this.setState({
            alert_open: false,
            volume_count: 1,
          });
          this.props.createVolume({ ...this.state, volume_count: 1 });
        },
      });
    } else this.props.createVolume({ ...this.state });
  }

  render() {
    const { classes } = this.props;
    let volumeCountTitle;
    if (this.props.volCount > 1)
      volumeCountTitle = `Specify the number of volumes to create. ${this.props.volCount} volumes already exist. POS supports max ${this.props.maxVolumeCount} volumes`;
    else if (this.props.volCount === 1)
      volumeCountTitle = `Specify the number of volumes to create. ${this.props.volCount} volume already exists. POS supports max ${this.props.maxVolumeCount} volumes`;
    else
      volumeCountTitle = `Specify the number of volumes to create. POS supports max ${this.props.maxVolumeCount} volumes`;

    return (
      <ThemeProvider theme={PageTheme}>
        <Paper className={classes.volumeCreatePaper}>
          <Grid item xs={12}>
            <Typography className={classes.createHeader}>
              Create Volume
            </Typography>
          </Grid>
          <form className={classes.formContainer}>
            <Grid
              item
              container
              xs={12}
              sm={6}
              justify="flex-start"
              className={classes.formControl}
            >
              <Tooltip title={volumeCountTitle} placement="bottom-start">
                <FormControl className={classes.volumeName}>
                  <TextField
                    id="create-vol-count"
                    name="volume_count"
                    label="Volume Count"
                    type="number"
                    inputProps={{
                      min: 1,
                      max: this.props.maxVolumeCount,
                      "data-testid": "create-vol-count",
                    }}
                    value={this.state.volume_count}
                    onChange={this.handleChange}
                    required="true"
                  />
                </FormControl>
              </Tooltip>
            </Grid>
            <Grid
              item
              container
              xs={12}
              sm={6}
              justify="flex-end"
              className={classes.formControl}
            >
              <FormControl className={classes.volumeName}>
                <FormControlLabel
                  control={(
<Checkbox
                      name="mount_vol_checkbox"
                      color="primary"
                      id="mount-vol-checkbox"
                      checked={this.state.mount_vol}
                      value="Mount Volume"
                      inputProps={{
                        "data-testid": "mount-vol-checkbox",
                      }}
                      onChange={this.handleChange}
/>
)}
                  label="Mount Volume"
                  className={classes.labelCheckbox}
                />
              </FormControl>
            </Grid>
            <Grid item container xs={12}>
              <Typography
                variant="h4"
                component="h4"
                className={classes.caption}
                display="block"
              >
                For Volume Count &gt; 1, please provide a seed in the Suffix
                Start Value field (e.g. 0,1)
              </Typography>
            </Grid>

            <Grid
              item
              container
              xs={12}
              sm={6}
              justify="flex-start"
              className={classes.formControl}
            >
              <FormControl className={classes.volumeName}>
                <TextField
                  id="create-vol-name"
                  label="Volume Name"
                  name="volume_name"
                  value={this.state.volume_name}
                  onChange={this.handleChange}
                  inputProps={{
                    "data-testid": "create-vol-name",
                  }}
                  required="true"
                />
              </FormControl>
            </Grid>
            <Grid
              item
              container
              xs={12}
              sm={6}
              justify="flex-end"
              className={classes.formControl}
            >
              <Tooltip
                title=" Min suffix value allowed is 0.
                        The suffix will be appended to the volume name to form the final volume name (e.g. vol_0, vol_1)"
                placement="right-start"
                disableFocusListener={this.state.volume_count < 2}
                disableHoverListener={this.state.volume_count < 2}
                disableTouchListener={this.state.volume_count < 2}
              >
                <FormControl className={classes.volumeName}>
                  <TextField
                    id="create-vol-suffix"
                    label="Suffix Start Value"
                    name="volume_suffix"
                    type="number"
                    InputProps={{
                      inputProps: {
                        min: 0,
                        "data-testid": "create-vol-suffix",
                      },
                    }}
                    value={this.state.volume_suffix}
                    onChange={this.handleChange}
                    disabled={this.state.volume_count < 2}
                  />
                </FormControl>
              </Tooltip>
            </Grid>
            <Grid
              item
              container
              xs={12}
              sm={6}
              justify="flex-start"
              className={classes.formControl}
            >
              <Tooltip
                title="0 means max available size"
                placement="right-start"
              >
                <FormControl className={classes.unitText}>
                  <TextField
                    id="create-vol-size"
                    label="Volume Size"
                    name="volume_size"
                    value={this.state.volume_size}
                    onChange={this.handleChange}
                    type="number"
                    inputProps={{
                      "data-testid": "create-vol-size",
                    }}
                    required="true"
                  />
                </FormControl>
              </Tooltip>
              <FormControl className={classes.volumeUnit}>
                <Select
                  value={this.state.volume_units}
                  onChange={this.setUnit}
                  inputProps={{
                    name: "Volume Unit",
                    id: "vol_unit",
                    "data-testid": "volume-unit-input",
                  }}
                  SelectDisplayProps={{
                    "data-testid": "volume-unit",
                  }}
                  className={classes.unitSelect}
                >
                  <MenuItem value="GB" data-testid="gb">
                    GB
                  </MenuItem>
                  <MenuItem value="TB" data-testid="tb">
                    TB
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid
              item
              container
              xs={12}
              sm={6}
              justify="flex-end"
              className={classes.formControl}
            >
              <Tooltip
                title="Min Value 10. 0 means max"
                placement="right-start"
              >
                <FormControl className={classes.volumeName}>
                  <TextField
                    id="create-vol-maxiops"
                    label="Maximum IOPS (KIOPS)"
                    name="maxiops"
                    value={this.state.maxiops}
                    onChange={this.handleChange}
                    type="number"
                    // placeholder="Min Value 10. 0 means max"
                    inputProps={{
                      min: 0,
                      "data-testid": "create-vol-max-iops",
                    }}
                    required="true"
                  />
                </FormControl>
              </Tooltip>
            </Grid>
            <Grid
              item
              container
              xs={12}
              sm={6}
              justify="flex-start"
              className={classes.formControl}
            >
              <Tooltip title="0 means max" placement="right-start">
                <FormControl className={classes.volumeName}>
                  <TextField
                    id="create-vol-maxbw"
                    label="Maximum Bandwidth (MB/s)"
                    name="maxbw"
                    value={this.state.maxbw}
                    onChange={this.handleChange}
                    type="number"
                    // placeholder="0 means max"
                    inputProps={{ min: 0, "data-testid": "create-vol-max-bw" }}
                    required="true"
                  />
                </FormControl>
              </Tooltip>
            </Grid>

            <Grid
              item
              container
              xs={12}
              sm={6}
              justify="flex-end"
              className={classes.formControl}
            >
              <FormControl className={classes.volumeName}>
                <Tooltip
                  title="Do you want to proceed with subsequent volume creation in case an error occurs or abort the remaining process?"
                  placement="bottom-start"
                  disableFocusListener={this.state.volume_count < 2}
                  disableHoverListener={this.state.volume_count < 2}
                  disableTouchListener={this.state.volume_count < 2}
                >
                  <FormControlLabel
                    disabled={this.state.volume_count < 2}
                    control={(
<Checkbox
                        name="stop_on_error_checkbox"
                        color="primary"
                        id="create-vol-stop-on-error-checkbox"
                        checked={this.state.stop_on_error_checkbox}
                        value="Stop on error"
                        inputProps={{
                          "data-testid": "stop-on-error-checkbox",
                        }}
                        onChange={this.handleChange}
/>
)}
                    label="Stop Multi-Volume Creation on Error"
                    className={classes.labelCheckbox}
                  />
                </Tooltip>
              </FormControl>
            </Grid>
            {/* <Grid item container xs={12} sm={6} justify="flex-end" className={classes.formControl}>
              <FormControl className={classes.volumeName}>
                  <FormControlLabel
                    control={
                      <Checkbox name="mount_vol_checkbox" color="primary" id="mount-vol-checkbox"
                        checked={this.state.mount_vol}
                        value="Mount Volume"
                        onChange={this.handleChange}
                      />
                    }

                    label="Mount Volume"
                    className={classes.labelCheckbox}
                  />
              </FormControl>
            </Grid> */}
            <Grid
              item
              container
              xs={12}
              display="flex"
              justify="flex-start"
              className={`${classes.volBtnContainer} ${classes.formControl}`}
            >
              <Tooltip
                title="Volume Creation is in progress. Please wait for sometime."
                placement="right-start"
                open={this.props.createVolumeButton}
              >
                <Button
                  onClick={this.createVolumeInParent}
                  variant="contained"
                  color="primary"
                  data-testid="createvolume-btn"
                  className={classes.button}
                  disabled={this.props.createVolumeButton}
                >
                  Create Volume
                </Button>
              </Tooltip>
            </Grid>
          </form>
          <AlertDialog
            title="Create Volume"
            description={this.state.alert_description}
            type="alert"
            open={this.state.open}
            handleClose={this.handleClose}
          />
          <AlertDialog
            title="Create Volume"
            description="Multiple volumes cannot be created when volume size is set as 0(max). Do you want to create a single volume with the maximum available size?"
            open={this.state.alert_open}
            handleClose={this.handleClose}
            onConfirm={this.state.onConfirm}
          />
        </Paper>
      </ThemeProvider>
    );
  }
}

CreateVolume.propTypes = {
  createVolume: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    createVolumeButton: state.storageReducer.createVolumeButton,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleCreateVolumeButton: (flag) =>
      dispatch(actionCreators.toggleCreateVolumeButton(flag)),
    showStorageAlert: (alertParams) =>
      dispatch(actionCreators.showStorageAlert(alertParams))
  };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CreateVolume)
);
