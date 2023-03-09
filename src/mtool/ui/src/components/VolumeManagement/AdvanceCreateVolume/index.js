import * as React from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Tooltip,
  Typography,
  withStyles
} from '@material-ui/core';
import { CheckBox, CheckBoxOutlineBlank } from '@material-ui/icons';
import * as actionCreators from "../../../store/actions/exportActionCreators";
import * as actionTypes from "../../../store/actions/actionTypes";
import Dialog from '../../Dialog';
import Popup from '../../Popup';

const styles = (theme) => ({
  main: {
    width: '100%',
    height: '380px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    [theme.breakpoints.down("sm")]: {
      width: "600px",
    },
    [theme.breakpoints.down("xs")]: {
      width: "400px",
      height: "80vh"
    },
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '200px auto',
    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: '150px auto',
    },
    [theme.breakpoints.down("xs")]: {
      gridTemplateColumns: 'none',
      gridTemplateRows: '140px auto',
    },
  },
  fullWidth: {
    width: "100%"
  },
  removePadding: {
    padding: "0"
  },
  leftPadding: {
    padding: "16px"
  },
  leftMargin: {
    marginLeft: "8px"
  },
  borderBottom: {
    borderBottom: "1px solid grey"
  },
  xsHide: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  xsShow: {
    display: "none",
    [theme.breakpoints.down("xs")]: {
      display: "flex",
    },
  },
  stepContent: {
    width: "100%",
    height: "300px",
    display: "flex",
    padding: theme.spacing(2),
    flexWrap: "wrap",
    boxSizing: "border-box",
    borderLeft: "2px solid grey",
    flexDirection: 'row',
    alignContent: 'flex-start',
    overflow: "auto",
    [theme.breakpoints.down("xs")]: {
      height: "calc(80vh - 220px)",
      borderLeft: "none",
    },
  },
  actionsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingBottom: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  volBtnContainer: {
    margin: theme.spacing(1, 0),
  },
  unitSelect: {
    maxWidth: "240px",
    marginTop: theme.spacing(2),
    height: 32,
    [theme.breakpoints.down("xs")]: {
      maxWidth: "300px",
    },
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
    height: 400,
    [theme.breakpoints.down('md')]: {
      height: 450
    },
    [theme.breakpoints.down('xs')]: {
      height: 600
    }
  },
  createHeader: {
    color: "#424850",
    fontSize: "16px",
    fontWeight: "bold",
    textAlign: "left",
    marginLeft: theme.spacing(2),
    paddingTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  caption: {
    color: "#424850",
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  labelCheckbox: {
    marginTop: theme.spacing(0),
  },
  previewHeader: {
    color: "#424850",
    fontWeight: "bold",
  },
  previewElements: {
    display: "flex",
    flexWrap: "wrap",
    marginBottom: 8
  },
  previewElement: {
    display: "flex",
    flex: "1 0 45%",
    color: "#424850",
    minWidth: "fit-content",
    maxWidth: "100%",
    wordBreak: "break-word"
  },
});

const getVolumeCountTitle = (volCount, maxVolumeCount) => {
  if (volCount !== 0)
    return `Specify the number of volumes to create. ${volCount} volume already exists. POS supports max ${maxVolumeCount} volumes`;
  return `Specify the number of volumes to create. POS supports max ${maxVolumeCount} volumes`;
}

function AdvanceCreateVolume(props) {
  const { showAdvanceOptions, classes, handleChange, activeStep, setActiveStep } = props;
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertDescription, setAlertDescription] = React.useState("")
  const [onAlertConfirm, setOnAlertConfirm] = React.useState(() => { });

  const volumeCountTitle = getVolumeCountTitle(props.volCount, props.maxVolumeCount);

  const volumeDetails = (
    <React.Fragment>
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
              id="adv-create-vol-count"
              name="adv_volume_count"
              label="Volume Count"
              type="number"
              inputProps={{
                min: 1,
                max: props.maxVolumeCount,
                "data-testid": "adv-create-vol-count",
              }}
              value={props.volume_count}
              onChange={handleChange}
              required
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
          <Tooltip
            title="Do you want to proceed with subsequent volume creation in case an error occurs or abort the remaining process?"
            placement="bottom-start"
            disableFocusListener={props.volume_count < 2}
            disableHoverListener={props.volume_count < 2}
            disableTouchListener={props.volume_count < 2}
          >
            <FormControlLabel
              disabled={props.volume_count < 2}
              control={(
                <Checkbox
                  name="adv_stop_on_error_checkbox"
                  color="primary"
                  id="adv-create-vol-stop-on-error-checkbox"
                  checked={props.stop_on_error_checkbox}
                  value="Stop on error"
                  inputProps={{
                    "data-testid": "adv-stop-on-error-checkbox",
                  }}
                  onChange={handleChange}
                />
              )}
              label="Stop Multi-Volume Creation on Error"
              className={classes.labelCheckbox}
            />
          </Tooltip>
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
            id="adv-create-vol-name"
            label="Volume Name"
            name="adv_volume_name"
            value={props.volume_name}
            onChange={handleChange}
            inputProps={{
              "data-testid": "adv-create-vol-name",
            }}
            required
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
          disableFocusListener={props.volume_count < 2}
          disableHoverListener={props.volume_count < 2}
          disableTouchListener={props.volume_count < 2}
        >
          <FormControl className={classes.volumeName}>
            <TextField
              id="adv-create-vol-suffix"
              label="Suffix start value"
              name="adv_volume_suffix"
              type="number"
              InputProps={{
                inputProps: {
                  min: 0,
                  "data-testid": "adv-create-vol-suffix",
                },
              }}
              value={props.volume_suffix}
              onChange={handleChange}
              disabled={props.volume_count < 2}
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
              id="adv-create-vol-size"
              label="Volume Size"
              name="adv_volume_size"
              value={props.volume_size}
              onChange={handleChange}
              type="number"
              inputProps={{
                "data-testid": "adv-create-vol-size",
                min: 0
              }}
              required
            />
          </FormControl>
        </Tooltip>
        <FormControl className={classes.volumeUnit}>
          <Select
            value={props.volume_units}
            onChange={handleChange}
            inputProps={{
              name: "adv_volume_units",
              id: "adv-vol-unit",
              "data-testid": "adv-volume-unit-input",
            }}
            SelectDisplayProps={{
              "data-testid": "adv-volume-unit",
            }}
            className={classes.unitSelect}
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
    </React.Fragment>
  )

  const qosValues = (
    <React.Fragment>
      <Grid
        item
        container
        xs={12}
        sm={6}
        justifyContent="flex-start"
        className={classes.formControl}
      >
        <Tooltip
          title="0 means max"
          placement="right-start"
        >
          <FormControl className={classes.volumeName}>
            <TextField
              id="create-vol-maxiops"
              label="Maximum IOPS (KIOPS)"
              name="maxiops"
              value={props.maxiops}
              onChange={handleChange}
              type="number"
              // placeholder="Min Value 10. 0 means max"
              inputProps={{
                min: 0,
                "data-testid": "adv-create-vol-max-iops",
              }}
              required
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
        <Tooltip title="Min value 10. 0 means max" placement="right-start">
          <FormControl className={classes.volumeName}>
            <TextField
              id="create-vol-maxbw"
              label="Maximum Bandwidth (MB/s)"
              name="maxbw"
              value={props.maxbw}
              onChange={handleChange}
              type="number"
              // placeholder="0 means max"
              inputProps={{ min: 0, "data-testid": "adv-create-vol-max-bw" }}
              required
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
          title="0 means no minimum iops/bw"
          placement="right-start"
        >
          <FormControl className={classes.unitText}>
            <TextField
              id="create-vol-minvalue"
              label="Minimum IOPS/BW"
              name="minvalue"
              value={props.minvalue}
              onChange={handleChange}
              type="number"
              inputProps={{
                "data-testid": "adv-create-vol-minvalue",
                min: 0
              }}
            />
          </FormControl>
        </Tooltip>
        <FormControl className={classes.volumeUnit}>
          <Select
            value={props.mintype}
            onChange={handleChange}
            inputProps={{
              name: "mintype",
              id: "mintype",
              "data-testid": "adv-mintype-input",
            }}
            SelectDisplayProps={{
              "data-testid": "adv-mintype",
            }}
            className={classes.unitSelect}
          >
            <MenuItem value="miniops" data-testid="miniops">
              KIOPS
            </MenuItem>
            <MenuItem value="minbw" data-testid="minbw">
              MB/s
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>

    </React.Fragment>
  )

  const mountOptions = (
    <React.Fragment>
      <Grid
        item
        container
        xs={12}
        sm={6}
        justifyContent="flex-start"
        className={classes.formControl}
      >
        <FormControl className={classes.volumeName}>
          <FormControlLabel
            control={(
              <Checkbox
                name="adv_mount_vol_checkbox"
                color="primary"
                id="adv-mount-vol-checkbox"
                checked={props.mount_vol}
                value="Mount Volume"
                inputProps={{
                  "data-testid": "adv-mount-vol-checkbox",
                }}
                onChange={props.handleChange}
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
          className={classes.caption}
          display="block"
        />
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
          <InputLabel htmlFor="subsystem">Select Subsystem</InputLabel>
          <Select
            value={props.subsystem}
            onChange={handleChange}
            label="Select Subsystem"
            inputProps={{
              name: "adv_subsystem",
              id: "adv-subsystem",
              "data-testid": "adv-subsystem-input",
            }}
            SelectDisplayProps={{
              "data-testid": "adv-subsystem",
            }}
            className={classes.unitSelect}
            required={!props.selectedNewSubsystem}
            disabled={props.selectedNewSubsystem || !props.mount_vol}
          >
            {props.subsystems.map((subsystem) => subsystem.subtype === "NVMe" ?
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
        justifyContent="flex-end"
        className={classes.formControl}
      >
        <FormControl className={classes.volumeName}>
          <FormControlLabel
            control={(
              <Checkbox
                name="selectedNewSubsystem"
                color="primary"
                id="selectedNewSubsystem"
                checked={props.selectedNewSubsystem}
                value="With A New Subsystem"
                inputProps={{
                  "data-testid": "adv-selectedNewSubsystem",
                }}
                onChange={props.handleChange}
              />
            )}
            label="With A New Subsystem"
            className={classes.labelCheckbox}
            disabled={!props.mount_vol}
          />
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
          <TextField
            id="create-subsystem-name"
            label="Subsystem Name"
            name="subnqn"
            value={props.subnqn}
            onChange={handleChange}
            inputProps={{
              "data-testid": "adv-create-subsystem-name",
            }}
            required={props.selectedNewSubsystem}
            disabled={!props.selectedNewSubsystem || !props.mount_vol}
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
        <FormControl className={classes.volumeName}>
          <InputLabel htmlFor="transport_type">Select Transport Type</InputLabel>
          <Select
            value={props.transport_type}
            onChange={handleChange}
            label="Select Transport Type"
            inputProps={{
              name: "transport_type",
              id: "transport_type",
              "data-testid": "adv-transport_type-input",
            }}
            SelectDisplayProps={{
              "data-testid": "adv-transport_type",
            }}
            className={classes.unitSelect}
            required={props.selectedNewSubsystem}
            disabled={!props.selectedNewSubsystem || !props.mount_vol}
          >
            <MenuItem value="TCP" key="TCP">
              TCP
            </MenuItem>
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
          <TextField
            id="create-target-address"
            label="Target Address"
            name="target_address"
            value={props.target_address}
            onChange={handleChange}
            inputProps={{
              "data-testid": "adv-create-target-address",
            }}
            required={props.selectedNewSubsystem}
            disabled={!props.selectedNewSubsystem || !props.mount_vol}
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
        <FormControl className={classes.volumeName}>
          <TextField
            id="create-transport-service-id"
            label="Transport Service Id"
            name="transport_service_id"
            value={props.transport_service_id}
            onChange={handleChange}
            inputProps={{
              "data-testid": "adv-create-transport-service-id",
            }}
            required={props.selectedNewSubsystem}
            disabled={!props.selectedNewSubsystem || !props.mount_vol}
          />
        </FormControl>
      </Grid>

    </React.Fragment>
  )

  const validateVolumeDetails = () => {
    let isError = true;
    let errorDesc = "";
    let volSize = props.volume_size;
    let maxAvailableSize;
    if (props.volume_size.length === 0)
      errorDesc = "Please Enter Volume Size";
    else if (props.volume_size < 0)
      errorDesc = "Volume Size cannot be negative";
    else if (props.volume_name.length < 1)
      errorDesc = "Please Enter Volume Name";
    else if (props.volume_count.length === 0)
      errorDesc = "Please Enter Volume Count";
    // istanbul ignore next: cannot provide negative numbers to number field with min 0
    else if (props.volume_count < 1)
      errorDesc = "Volume Count should be greater than 0";
    else if (props.volume_count > parseInt(props.maxVolumeCount, 10))
      errorDesc = `Volume Count should not exceed ${props.maxVolumeCount}`;
    else if (props.volume_count > 1 && props.volume_suffix < 0)
      errorDesc = "Suffix Value cannot be negative";
    else if (props.volume_count > 1 && props.volume_suffix.length === 0)
      errorDesc = "Please Enter Suffix Start Value";
    else if (!(/^\d+$/.test(props.volume_count)))
      errorDesc = "Please Enter Integer Value of Volume Count";
    else if (props.volume_count > 1 && !(/^\d+$/.test(props.volume_suffix)))
      errorDesc = "Please Enter Integer Value of Suffix Value";
    else isError = false;

    if (isError === true) {
      props.showAlertHandler(errorDesc)
      return true;
    }

    if (props.volume_size !== 0) {
      maxAvailableSize = props.formatBytes(props.maxAvailableSize);
      volSize =
        `${props.volume_size.toString()} ${props.volume_units}`;
      if (volSize === maxAvailableSize) {
        volSize = 0;
        props.Change_Input({ name: "volume_size", value: 0 });
      }
    }

    if (props.volume_count > 1 && parseInt(volSize, 10) === 0) {
      setAlertDescription("Multiple volumes cannot be created when volume size is set as 0. Do you want to create a single volume with the maximum available size?")
      setAlertOpen(true);
      setOnAlertConfirm(() => () => {
        setAlertOpen(false);
        props.Change_Input({ name: "volume_count", value: 1 })
      })
      return true;
    }

    return false;
  }

  const validateQosValues = () => {
    let isError = true;
    let errorDesc = "";

    const isGreaterThanEqualTo = (param) => {
      if (typeof (param) === 'number') return false;
      const max = "18446744073709552";
      if (param.length < max.length) return false;
      if (param.length > max.length) return true;

      const max1 = max.substring(0, max.length - 1);
      const max2 = max.substring(max.length - 1);
      const param1 = param.substring(0, param.length - 1);
      const param2 = param.substring(param.length - 1);

      if (param1 < max1) return false;
      if (param1 > max1) return true;
      if (param2 < max2) return false;
      return true;
    }

    if (props.maxbw.length === 0)
      errorDesc = "Please Enter Maximum Bandwidth (MB/s) ";
    else if (props.maxiops.length === 0)
      errorDesc = "Please Enter Maximum IOPS (KIOPS)";
    else if (props.maxbw < 0) errorDesc = "Maximum Bandwidth cannot be negative";
    else if (props.maxiops < 0) errorDesc = "Maximum IOPS cannot be negative";
    else if (!(/^\d+$/.test(props.maxiops)))
      errorDesc = "Please Enter Integer Value of Maximum IOPS"
    else if (!(/^\d+$/.test(props.maxbw)))
      errorDesc = "Please Enter Integer Value of Maximum BW"
    else if ((props.maxbw > 0 && props.maxbw < 10) || props.maxbw > 17592186044415)
      errorDesc = "Max Bandwidth should be in the range 10 ~ 17592186044415. Please input 0, for no limit for qos or Maximum";
    else if ((props.maxiops > 0 && props.maxiops < 10) || isGreaterThanEqualTo(props.maxiops))
      errorDesc = "Max IOPS should be in the range 10 ~ 18446744073709551. Please input 0, for no limit for qos or Maximum";
    else if (props.minvalue.length === 0)
      errorDesc = "Please Enter Minimum IOPS/BW or set 0 for no Minimum IOPS/BW"
    else if (props.minvalue < 0)
      errorDesc = "Minimum IOPS/Bandwidth cannot be negative";
    else if (!(/^\d+$/.test(props.minvalue)))
      errorDesc = "Please Enter Integer Value of Minimum IOPS/BW"
    else isError = false;
    if (isError === true) {
      props.showAlertHandler(errorDesc)
      return true;
    }
    return false;
  }

  const validateMountOptions = () => {
    let isError = true;
    let errorDesc = "";
    const subsystem = props.getSubsystem(props.subsystem, props.subsystems);
    if (props.mount_vol) {
      if (!props.selectedNewSubsystem && subsystem.array && subsystem.array !== props.array)
        errorDesc = "Please select an unused subsystem, or a subsystem used by the current array, or create a new subsystem";
      else if (props.selectedNewSubsystem) {
        if (props.subnqn.length < 1)
          errorDesc = "Please Enter Subsystem Name";
        else if (props.target_address.length < 1)
          errorDesc = "Please Enter Target Address";
        else if (props.transport_service_id.length === 0)
          errorDesc = "Please Enter Transport Service Type";
        else if (props.transport_service_id < 0)
          errorDesc = "Transport Service Type cannot be negative";
        else if (!(/^\d+$/.test(props.transport_service_id)))
          errorDesc = "Please Enter Integer Value of Transport Service Id";
        else
          isError = false;

        if (!isError) {
          const isDuplicate = props.subsystems.find((s) => s.subnqn === props.subnqn);
          if (isDuplicate) {
            errorDesc = "Please Enter A New Subsystem Name"
            isError = true;
          }
        }
      } else
        isError = false;
    }
    else isError = false;
    if (isError === true) {
      props.showAlertHandler(errorDesc)
      return true;
    }
    return false;
  }

  const steps = ['Volume Details', 'Qos Values', 'Mount Options']
  const stepContents = [volumeDetails, qosValues, mountOptions]
  const validateContents = [validateVolumeDetails, validateQosValues, validateMountOptions]

  const previewDetails = (
    <div className={classes.fullWidth}>
      <Typography className={classes.previewHeader}>Volume Details</Typography>
      <div className={classes.previewElements}>
        <Typography className={classes.previewElement}>Volume Count : {props.volume_count}</Typography>
        {props.volume_count > 1 &&
          (
            <Typography className={classes.previewElement}>
              Stop Multi-volume Creation on Error :
              <Checkbox
                size="small"
                color="primary"
                checked={props.stop_on_error_checkbox}
                className={classes.removePadding}
              />
            </Typography>
          )
        }
        <Typography className={`${classes.previewElement} ${classes.fullWidth}`}>Volume Name : {props.volume_name}</Typography>
        {props.volume_count > 1 &&
          <Typography className={classes.previewElement}>Start Suffix Value : {props.volume_suffix}</Typography>
        }
        {parseFloat(props.volume_size) === 0.0 ? (
          <Typography className={classes.previewElement}>Volume Size : Remaining space in the Array</Typography>
        ) : (
          <Typography className={classes.previewElement}>Volume Size : {props.volume_size} {props.volume_units}</Typography>
        )
        }
      </div>
      <Typography className={classes.previewHeader}>Qos Values</Typography>
      <div className={classes.previewElements}>
        <Typography className={classes.previewElement}>Max Bandwidth: {props.maxbw} MB/s</Typography>
        <Typography className={classes.previewElement}>Max IOPS : {props.maxiops} KIOPS</Typography>
        <Typography className={classes.previewElement}>Min IOPS/BW: {props.minvalue} {props.mintype === "miniops" ? "KIOPS" : "MB/s"}</Typography>
      </div>
      <Typography className={classes.previewHeader}>Mount Options</Typography>
      <div className={classes.previewElements}>
        <Typography className={classes.previewElement}>
          Mount Volume :
          {props.mount_vol ? <CheckBox /> : <CheckBoxOutlineBlank />}
        </Typography>
        {props.mount_vol &&
          (
            <React.Fragment>
              <Typography className={classes.previewElement}>
                With New Subsystem :
                {props.selectedNewSubsystem ? <CheckBox /> : <CheckBoxOutlineBlank />}
              </Typography>
              {props.selectedNewSubsystem ?
                (
                  <React.Fragment>
                    <Typography className={`${classes.previewElement} ${classes.fullWidth}`}>Subsystem Name : {props.subnqn}</Typography>
                    <Typography className={classes.previewElement}>Transport Type : {props.transport_type}</Typography>
                    <Typography className={classes.previewElement}>Target Address : {props.target_address}</Typography>
                    <Typography className={classes.previewElement}>Transport Service Id : {props.transport_service_id}</Typography>
                  </React.Fragment>
                ) :
                <Typography className={classes.previewElement}>Selected Subsytem : {props.subsystem}</Typography>
              }
            </React.Fragment>
          )
        }
      </div>
    </div>
  )

  const createVolumeWithNewSubsystem = () => {
    props.createVolume({
      volume_count: props.volume_count,
      volume_name: props.volume_name,
      volume_suffix: props.volume_suffix,
      volume_size: props.volume_size,
      volume_description: props.description,
      volume_units: props.volume_units,
      maxbw: props.maxbw,
      maxiops: props.maxiops,
      minbw: props.mintype === "minbw" ? props.minvalue : 0,
      miniops: props.mintype === "miniops" ? props.minvalue : 0,
      stop_on_error_checkbox: props.stop_on_error_checkbox,
      mount_vol: props.mount_vol,
      transport: props.transport,
      subsystem: {
        transport_type: props.transport_type,
        transport_service_id: props.transport_service_id,
        target_address: props.target_address,
        subnqn: props.subnqn
      },
    })
  }

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    props.Reset_Inputs();
  };

  const handleNext = () => {
    if (activeStep === steps.length) {
      if (props.mount_vol && props.selectedNewSubsystem) {
        createVolumeWithNewSubsystem();
        return;
      }
      props.createVolumeInParent();
      return;
    }
    if (validateContents[activeStep]() === true) {
      return
    }
    setActiveStep(activeStep + 1);
  };

  const handleModalClose = () => {
    setAlertDescription("Closing the Advance Create Volume popup will reset the input fields ?")
    setAlertOpen(true);
    setOnAlertConfirm(() => () => {
      setAlertOpen(false);
      handleReset();
      props.Toggle_Advance_Create_Volume_Popup(false);
    })
  }

  return (
    <Popup
      title="Advance Create Volume"
      open={showAdvanceOptions}
      close={handleModalClose}
      maxWidth="md"
    >
      <form className={classes.main}>
        <div className={classes.mainContent}>
          <div>
            <Typography className={classes.createHeader}>Steps</Typography>
            <Stepper
              activeStep={activeStep}
              className={[classes.xsHide, classes.leftPadding].join(' ')}
              orientation="vertical"
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Stepper
              activeStep={activeStep}
              className={[classes.xsShow, classes.borderBottom].join(' ')}
              orientation="horizontal"
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </div>

          <div>
            <Typography className={classes.createHeader}>{activeStep === steps.length ? "Preview" : steps[activeStep]} </Typography>
            <div className={classes.stepContent}>
              {activeStep === steps.length ? previewDetails : stepContents[activeStep]}
            </div>
          </div>
        </div>

        <div className={classes.actionsContainer}>
          <div>
            <Button
              variant="outlined"
              color="secondary"
              data-testid="back-btn"
              disabled={activeStep === 0}
              onClick={handleBack}
              className={classes.button}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="secondary"
              data-testid="next-btn"
              onClick={handleNext}
              className={`${classes.button} ${classes.leftMargin}`}
              disabled={props.createVolumeButton}
            >
              {activeStep === steps.length ? 'Create Volume' : 'Next'}
            </Button>
          </div>
        </div>
      </form>
      <Dialog
        title="Reset Fields"
        description={alertDescription}
        open={alertOpen}
        handleClose={() => {
          setAlertOpen(false)
        }}
        onConfirm={onAlertConfirm}
      />
    </Popup>
  );
}

const mapStateToProps = (state) => {
  return {
    createVolumeButton: state.storageReducer.createVolumeButton,
    activeStep: state.createVolumeReducer.activeStep,
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
    selectedNewSubsystem: state.createVolumeReducer.selectedNewSubsystem,
    subnqn: state.createVolumeReducer.subnqn,
    transport_type: state.createVolumeReducer.transport_type,
    target_address: state.createVolumeReducer.target_address,
    transport_service_id: state.createVolumeReducer.transport_service_id,
    showAdvanceOptions: state.createVolumeReducer.showAdvanceOptions
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    Reset_Inputs: () =>
      dispatch({ type: actionTypes.RESET_INPUTS }),
    Change_Input: (payload) =>
      dispatch({ type: actionTypes.CHANGE_INPUT, payload }),
    Toggle_Advance_Create_Volume_Popup: (flag) =>
      dispatch(actionCreators.toggleAdvanceCreateVolumePopup(flag)),
    setActiveStep: (payload) => {
      dispatch({ type: actionTypes.SET_ACTIVE_STEP, payload })
    }
  };
};


export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AdvanceCreateVolume));
