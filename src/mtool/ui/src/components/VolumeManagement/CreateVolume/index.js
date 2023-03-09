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

import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles';
import {
  Button,
  Paper,
  Grid,
  Typography,
  withStyles,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Tooltip
} from "@material-ui/core";
import { customTheme, PageTheme } from "../../../theme";
import "../../../containers/StorageManagement/StorageManagement.css";
import "./CreateVolume.css";
import AlertDialog from "../../Dialog";
import * as actionCreators from "../../../store/actions/exportActionCreators";
import * as actionTypes from "../../../store/actions/actionTypes";
import formatBytes from "../../../utils/format-bytes";
import AdvanceCreateVolume from "../AdvanceCreateVolume";

const styles = (theme) => ({
  formContainer: {
    width: "100%",
    display: "flex",
    padding: theme.spacing(0, 4),
    flexWrap: "wrap",
    boxSizing: "border-box",
    margin: "auto",
    [theme.breakpoints.down("sm")]: {
      width: `calc(100% - ${theme.spacing(4)}px)`,
      padding: theme.spacing(0, 1),
    },
  },
  volBtnContainer: {
    margin: theme.spacing(1, 0),
    gap: 8,
    [theme.breakpoints.down("xs")]: {
      justifyContent: "space-around",
    },
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
    height: "100%",
  },
  createHeader: customTheme.card.header,
  caption: {
    color: "#424850",
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    [theme.breakpoints.down("xs")]: {
      marginLeft: "10%",
      marginRight: "20%"
    },
  },
  labelCheckbox: {
    marginTop: theme.spacing(3),
  },
  largeFontTooltip: {
    fontSize: "16px"
  }
});

const getSubsystem = (subsystem, subsystems) => {
  const result = subsystems.find((s) => s.subnqn === subsystem);
  if (result) return result;
  return {
    listen_addresses: [],
    array: "-"
  };
}

const getTransport = (subsystem, transport) => {
  if (transport.indexOf(":") > 0) {
    const ip = transport.split(":")[0];
    const port = transport.split(":")[1];
    for (let i = 0; i < subsystem.listen_addresses.length; i += 1) {
      if (subsystem.listen_addresses[i].target_address === ip && subsystem.listen_addresses[i].transport_service_id === port) {
        return subsystem.listen_addresses[i];
      }
    }
  }
  return {};
}

class CreateVolume extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form_valid: true,
      open: false,
      alert_description: "",
      alert_open: false,
      onConfirm: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.createVolumeInParent = this.createVolumeInParent.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.showAlertHandler = this.showAlertHandler.bind(this);
    this.setSubsystem = this.setSubsystem.bind(this);
  }

  componentDidMount() {
    this.setSubsystem();
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
      if (!this.props.createVolumeButton)
        return;

      const { total_count, pass, description, errorCode, errorResponses } = msg;
      const fail = total_count - pass;
      let alertType = "info";
      let errorMsg = `Total Volumes: ${total_count}, Passed: ${pass}, Failed: ${fail}`;
      let errorCodeDescription = description === '' ? '' : `${description} \n\n`;

      if (pass === 0)
        alertType = "alert";
      if (pass > 0 && fail > 0)
        alertType = "partialError";
      if (errorCode)
        alertType = fail ? "alert" : "partialError";

      if (errorCode && errorResponses && errorResponses.map) {
        errorMsg = `Total Volumes: ${total_count}, Volumes Created: ${pass}, Failed: ${fail} with below `;
        errorMsg += fail ? "Errors" : "Warnings";
        errorResponses.map(err => {
          errorCodeDescription += `${err.description}\n\n`;
          return err;
        });
      }

      this.props.toggleCreateVolumeButton(false);
      this.props.showStorageAlert({
        alertType,
        alertTitle: "Create Volume",
        errorMsg,
        errorCode: errorCodeDescription,
      });

      this.props.Reset_Inputs();

      this.props.fetchVolumes();
      this.props.fetchArray();
      this.props.fetchSubsystems();
      /* eslint-enable camelcase */
    });
  }

  componentDidUpdate() {
    this.setSubsystem()
  }

  handleClose() {
    this.setState({ open: false, alert_open: false });
  }

  handleChange(event) {
    const { name, value } = event.target;
    const replacedName = name.includes('adv_') ? name.replace('adv_', '') : name;

    if (replacedName === "subsystem") {
      const localSubsystem = getSubsystem(value, this.props.subsystems);
      if (localSubsystem.listen_addresses && localSubsystem.listen_addresses.length) {
        this.props.Update_Subsystem({
          subsystem: value,
          transport: `${localSubsystem.listen_addresses[0].target_address}:${localSubsystem.listen_addresses[0].transport_service_id}`
        });
      } else {
        this.props.Update_Subsystem({
          subsystem: value,
          transport: ""
        });
      }
      return;
    }
    this.props.Change_Input({ name: replacedName, value })
  }

  setSubsystem() {
    if (!this.props.subsystem && this.props.subsystems.length > 0) {
      /* eslint-disable react/no-did-update-set-state */
      for (let i = 0; i < this.props.subsystems.length; i += 1) {
        if (this.props.subsystems[i].subtype === "NVMe") {

          const localSubsystem = this.props.subsystems[i].subnqn

          if (this.props.subsystems[i].listen_addresses && this.props.subsystems[i].listen_addresses.length) {
            this.props.Update_Subsystem({
              subsystem: localSubsystem,
              transport: `${this.props.subsystems[i].listen_addresses[0].target_address}:${this.props.subsystems[i].listen_addresses[0].transport_service_id}`
            });
          } else {
            this.props.Update_Subsystem({
              subsystem: localSubsystem,
              transport: ""
            });
          }

          break;
        }
      }
      /* eslint-enable react/no-did-update-set-state */
    }
  }

  showAlertHandler(msg) {
    this.setState({ open: true, alert_description: msg });
  }

  createVolumeInParent() {
    let isError = true;
    let errorDesc = "";
    let volSize = this.props.volume_size;
    let maxAvailableSize;
    const subsystem = getSubsystem(this.props.subsystem, this.props.subsystems);
    if (this.props.volume_size.length === 0)
      errorDesc = "Please Enter Volume Size";
    else if (this.props.volume_size < 0)
      errorDesc = "Volume Size cannot be negative";
    else if (this.props.volume_name.length < 1)
      errorDesc = "Please Enter Volume Name";
    else if (this.props.volume_count.length === 0)
      errorDesc = "Please Enter Volume Count";
    // istanbul ignore next: cannot provide negative numbers to number field with min 0
    else if (this.props.volume_count < 1)
      errorDesc = "Volume Count should be greater than 0";
    else if (this.props.volume_count > parseInt(this.props.maxVolumeCount, 10))
      errorDesc = `Volume Count should not exceed ${this.props.maxVolumeCount}`;
    else if (this.props.volume_count > 1 && this.props.volume_suffix < 0)
      errorDesc = "Suffix Value cannot be negative";
    else if (this.props.volume_count > 1 && this.props.volume_suffix.length === 0)
      errorDesc = "Please Enter Suffix Start Value";
    else if (!(/^\d+$/.test(this.props.volume_count)))
      errorDesc = "Please Enter Integer Value of Volume Count";
    else if (this.props.volume_count > 1 && !(/^\d+$/.test(this.props.volume_suffix)))
      errorDesc = "Please Enter Integer Value of Suffix Value";
    else if (this.props.mount_vol && subsystem.array && subsystem.array !== this.props.array)
      errorDesc = "Please select an unused subsystem, or a subsystem used by the current array, or create a new subsystem";
    else isError = false;

    if (isError === true) {
      this.showAlertHandler(errorDesc)
      return;
    }

    if (this.props.volume_size !== 0) {
      maxAvailableSize = formatBytes(this.props.maxAvailableSize);
      volSize =
        `${this.props.volume_size.toString()} ${this.props.volume_units}`;

      if (volSize === maxAvailableSize) {
        volSize = 0;
        this.props.Change_Input({ name: "volume_size", value: 0 });
      }
    }

    const transport = getTransport(subsystem, this.props.transport)
    const localMinBw = this.props.mintype === "minbw" ? this.props.minvalue : 0;
    const localMinIOPS = this.props.mintype === "miniops" ? this.props.minvalue : 0;
    const localSubsystem = Object.keys(transport).length === 0 ? {
      transport_type: "tcp",
      transport_service_id: "",
      target_address: "",
      subnqn: this.props.subsystem
    } : {
      transport_type: transport.transport_type,
      transport_service_id: transport.transport_service_id,
      target_address: transport.target_address,
      subnqn: this.props.subsystem
    }
    if (this.props.volume_count > 1 && parseInt(volSize, 10) === 0) {
      this.setState({
        alert_open: true,
        onConfirm: () => {
          this.setState({
            alert_open: false,
          });
          this.props.Change_Input({ name: "volume_count", value: 1 })
          this.props.createVolume({
            ...this.state,
            volume_name: this.props.volume_name,
            volume_suffix: this.props.volume_suffix,
            volume_size: this.props.volume_size,
            volume_description: this.props.description,
            volume_units: this.props.volume_units,
            maxbw: this.props.maxbw,
            maxiops: this.props.maxiops,
            minbw: localMinBw,
            miniops: localMinIOPS,
            stop_on_error_checkbox: this.props.stop_on_error_checkbox,
            mount_vol: this.props.mount_vol,
            transport: this.props.transport,
            subsystem: { ...localSubsystem },
            volume_count: 1
          });
        },
      });
    } else {
      this.props.createVolume({
        ...this.state,
        volume_count: this.props.volume_count,
        volume_name: this.props.volume_name,
        volume_suffix: this.props.volume_suffix,
        volume_size: this.props.volume_size,
        volume_description: this.props.description,
        volume_units: this.props.volume_units,
        maxbw: this.props.maxbw,
        maxiops: this.props.maxiops,
        minbw: localMinBw,
        miniops: localMinIOPS,
        stop_on_error_checkbox: this.props.stop_on_error_checkbox,
        mount_vol: this.props.mount_vol,
        transport: this.props.transport,
        subsystem: { ...localSubsystem }
      })
    };
  }

  render() {
    const { classes } = this.props;
    let volumeCountTitle;
    if (this.props.volCount >= 1)
      volumeCountTitle = `Specify the number of volumes to create. ${this.props.volCount} volume already exists. POS supports max ${this.props.maxVolumeCount} volumes`;
    else
      volumeCountTitle = `Specify the number of volumes to create. POS supports max ${this.props.maxVolumeCount} volumes`;

    return (
      <ThemeProvider theme={PageTheme}>
        <Paper className={classes.volumeCreatePaper}>
          <Grid item xs={12}>
            <Typography className={classes.createHeader} variant="h2">
              Create Volume
            </Typography>
          </Grid>
          <form className={classes.formContainer}>
            <Grid
              item
              container
              xs={12}
              sm={6}
              justifyContent="flex-start"
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
                    value={this.props.volume_count}
                    onChange={this.handleChange}
                    required
                    disabled={this.props.showAdvanceOptions}
                  />
                </FormControl>
              </Tooltip>
            </Grid>
            <Grid
              item
              container
              xs={12}
              sm={6}
              justifyContent="flex-end"
              className={classes.formControl}
            >
              <FormControl className={classes.volumeName}>
                <FormControlLabel
                  control={(
                    <Checkbox
                      name="mount_vol_checkbox"
                      color="primary"
                      id="mount-vol-checkbox"
                      checked={this.props.mount_vol}
                      value="Mount Volume"
                      inputProps={{
                        "data-testid": "mount-vol-checkbox",
                      }}
                      onChange={this.handleChange}
                      disabled={this.props.showAdvanceOptions}
                    />
                  )}
                  label="Mount Volume"
                  className={classes.labelCheckbox}
                />
              </FormControl>
            </Grid>
            <Grid item container xs={12}>
              <Typography
                variant="body2"
                // component="h4"
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
              justifyContent="flex-start"
              className={classes.formControl}
            >
              <FormControl className={classes.volumeName}>
                <TextField
                  id="create-vol-name"
                  label="Volume Name"
                  name="volume_name"
                  value={this.props.volume_name}
                  onChange={this.handleChange}
                  inputProps={{
                    "data-testid": "create-vol-name",
                  }}
                  required
                  disabled={this.props.showAdvanceOptions}
                />
              </FormControl>
            </Grid>
            <Grid
              item
              container
              xs={12}
              sm={6}
              justifyContent="flex-end"
              className={classes.formControl}
            >
              <Tooltip
                title=" Min suffix value allowed is 0.
                        The suffix will be appended to the volume name to form the final volume name (e.g. vol_0, vol_1)"
                placement="right-start"
                disableFocusListener={this.props.volume_count < 2}
                disableHoverListener={this.props.volume_count < 2}
                disableTouchListener={this.props.volume_count < 2}
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
                    value={this.props.volume_suffix}
                    onChange={this.handleChange}
                    disabled={this.props.volume_count < 2 || this.props.showAdvanceOptions}
                  />
                </FormControl>
              </Tooltip>
            </Grid>
            <Grid
              item
              container
              xs={12}
              sm={6}
              justifyContent="flex-start"
              className={classes.formControl}
            >
              <Tooltip
                title="Please input 0 to utilize all the available space in the array"
                placement="right-start"
              >
                <FormControl className={classes.unitText}>
                  <TextField
                    id="create-vol-size"
                    label="Volume Size"
                    name="volume_size"
                    value={this.props.volume_size}
                    onChange={this.handleChange}
                    type="number"
                    inputProps={{
                      "data-testid": "create-vol-size",
                      min: 0
                    }}
                    required
                    disabled={this.props.showAdvanceOptions}
                  />
                </FormControl>
              </Tooltip>
              <FormControl className={classes.volumeUnit}>
                <Select
                  value={this.props.volume_units}
                  onChange={this.handleChange}
                  inputProps={{
                    name: "volume_units",
                    id: "vol_unit",
                    "data-testid": "volume-unit-input",
                  }}
                  SelectDisplayProps={{
                    "data-testid": "volume-unit",
                  }}
                  className={classes.unitSelect}
                  disabled={this.props.showAdvanceOptions}
                >
                  <MenuItem value="MB" data-testid="mb">
                    MB
                  </MenuItem>
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
              justifyContent="flex-end"
              className={classes.formControl}
            >
              <FormControl className={classes.volumeName}>
                <InputLabel htmlFor="subsystem">Select Subsystem</InputLabel>
                <Select
                  value={this.props.subsystem}
                  onChange={this.handleChange}
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
                  disabled={!this.props.mount_vol || this.props.showAdvanceOptions}
                >
                  {this.props.subsystems.map((subsystem) => subsystem.subtype === "NVMe" ?
                    (
                      <MenuItem value={subsystem.subnqn} key={subsystem.subnqn}>
                        {subsystem.subnqn} {subsystem.array ? `(Used by ${subsystem.array})` : null}
                      </MenuItem>
                    ) : null)}
                </Select>
              </FormControl>
            </Grid>
            <Grid
              item
              container
              xs={12}
              sm={6}
              justifyContent="flex-start"
              className={classes.formControl}
            >
              <FormControl className={classes.volumeName}>
                <Tooltip
                  title="Do you want to proceed with subsequent volume creation in case an error occurs or abort the remaining process?"
                  placement="bottom-start"
                  disableFocusListener={this.props.volume_count < 2}
                  disableHoverListener={this.props.volume_count < 2}
                  disableTouchListener={this.props.volume_count < 2}
                >
                  <FormControlLabel
                    disabled={this.props.volume_count < 2}
                    control={(
                      <Checkbox
                        name="stop_on_error_checkbox"
                        color="primary"
                        id="create-vol-stop-on-error-checkbox"
                        checked={this.props.stop_on_error_checkbox}
                        value="Stop on error"
                        inputProps={{
                          "data-testid": "stop-on-error-checkbox",
                        }}
                        onChange={this.handleChange}
                        disabled={this.props.showAdvanceOptions}
                      />
                    )}
                    label="Stop Multi-Volume Creation on Error"
                    className={classes.labelCheckbox}
                  />
                </Tooltip>
              </FormControl>
            </Grid>
            <Grid
              item
              container
              xs={12}
              display="flex"
              className={classes.volBtnContainer}
            >
              <Tooltip
                title="Please wait... Volume creation is in progress. It may take from a few seconds to few minutes"
                placement="right-start"
                open={this.props.createVolumeButton}
                classes={{ tooltip: classes.largeFontTooltip }}
              >
                <Button
                  onClick={this.createVolumeInParent}
                  variant="contained"
                  color="secondary"
                  data-testid="createvolume-btn"
                  disabled={this.props.createVolumeButton || this.props.showAdvanceOptions}
                >
                  Create Volume
                </Button>
              </Tooltip>
              <Button
                onClick={() => this.props.Toggle_Advance_Create_Volume_Popup(true)}
                variant="outlined"
                color="secondary"
                data-testid="advanceoptions-btn"
                className={classes.button}
                disabled={this.props.createVolumeButton}
              >
                Advance Options
              </Button>
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
            description="Multiple volumes cannot be created when volume size is set as 0. Do you want to create a single volume with the maximum available size?"
            open={this.state.alert_open}
            handleClose={this.handleClose}
            onConfirm={this.state.onConfirm}
          />
          <AdvanceCreateVolume
            array={this.props.array}
            handleChange={this.handleChange}
            createVolume={this.props.createVolume}
            subsystems={this.props.subsystems}
            maxVolumeCount={this.props.maxVolumeCount}
            volCount={this.props.volCount}
            showAlertHandler={this.showAlertHandler}
            getSubsystem={getSubsystem}
            formatBytes={formatBytes}
            maxAvailableSize={this.props.maxAvailableSize}
            createVolumeInParent={this.createVolumeInParent}
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
    volume_count: state.createVolumeReducer.volume_count,
    volume_name: state.createVolumeReducer.volume_name,
    volume_suffix: state.createVolumeReducer.volume_suffix,
    volume_size: state.createVolumeReducer.volume_size,
    volume_description: state.createVolumeReducer.volume_description,
    volume_units: state.createVolumeReducer.volume_units,
    maxbw: state.createVolumeReducer.maxbw,
    maxiops: state.createVolumeReducer.maxiops,
    minvalue: state.createVolumeReducer.minvalue,
    mintype: state.createVolumeReducer.mintype,
    stop_on_error_checkbox: state.createVolumeReducer.stop_on_error_checkbox,
    mount_vol: state.createVolumeReducer.mount_vol,
    subsystem: state.createVolumeReducer.subsystem,
    transport: state.createVolumeReducer.transport,
    showAdvanceOptions: state.createVolumeReducer.showAdvanceOptions
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleCreateVolumeButton: (flag) =>
      dispatch(actionCreators.toggleCreateVolumeButton(flag)),
    showStorageAlert: (alertParams) =>
      dispatch(actionCreators.showStorageAlert(alertParams)),
    Reset_Inputs: () =>
      dispatch({ type: actionTypes.RESET_INPUTS }),
    Change_Input: (payload) =>
      dispatch({ type: actionTypes.CHANGE_INPUT, payload }),
    Update_Subsystem: (payload) =>
      dispatch({ type: actionTypes.UPDATE_SUBSYSTEM, payload }),
    Toggle_Advance_Create_Volume_Popup: (flag) =>
      dispatch(actionCreators.toggleAdvanceCreateVolumePopup(flag))
  };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CreateVolume)
);
