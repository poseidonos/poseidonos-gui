import React, { useEffect, useState } from 'react';
import { Button, Checkbox, FormControlLabel, Grid, Paper, ThemeProvider, Typography, withStyles } from '@material-ui/core';
import { PlayCircleFilled, StopRounded } from '@material-ui/icons';
import { connect } from 'react-redux';
import TelemetryPropertyAccordion from '../../../components/TelemetryPropertyAccordion';
import * as actionTypes from "../../../store/actions/actionTypes";
import { customTheme, TableTheme } from '../../../theme';
import AlertDialog from '../../../components/Dialog';
import MToolLoader from '../../../components/MToolLoader';

const styles = (theme) => ({
    content: {
        flexGrow: 1
    },
    cardHeader: {
        ...customTheme.card.header,
        marginLeft: 0,
    },
    paper: {
        padding: theme.spacing(2),
        marginTop: theme.spacing(1)
    },
    innerControl: {
        marginLeft: theme.spacing(2)
    },
    btnContainer: {
        padding: theme.spacing(2)
    },
    startBtn: {
        marginRight: theme.spacing(2)
    },
    colorGreen: {
        color: 'green'
    },
    colorOrange: {
        color: 'orange'
    },
    saveBtn: {
        width: 150
    }
})


const TelemetryConfiguration = ({
    classes,
    telemetryStatus,
    telemetryProperties,
    alert,
    loading,
    loadText,
    selectProperty,
    selectAllFromCategory,
    selectAllProperties,
    startTelemetry,
    stopTelemetry,
    fetchTelemetryProperties,
    closeAlert,
    openAlert,
    saveConfig
}) => {
    const [alertConfirm, setAlertConfirm] = useState(() => () => {});

    const isAllSelected = telemetryProperties.reduce((prev, cur) => {
        return prev && cur.fields.reduce((prevField, curField) => prevField && curField.isSet, true);
    }, true);

    const selectAll = () => {
        selectAllProperties(!isAllSelected);
    }

    const closeAndAction = (fn) => {
        return () => () => {
            closeAlert();
            fn();
        }
    }

    const confirmStart = () => {
        setAlertConfirm(closeAndAction(startTelemetry));
        openAlert({
            title: "Start Telemetry",
            open: true,
            errorMsg: "Are you sure you want to start Telemetry?",
            type: "confirm"
        });
    }

    const confirmStop = () => {
        setAlertConfirm(closeAndAction(stopTelemetry));
        openAlert({
            title: "Stop Telemetry",
            open: true,
            errorMsg: "Are you sure you want to stop Telemetry?",
            type: "confirm"
        });
    }

    useEffect(() => {
        fetchTelemetryProperties();
    }, [fetchTelemetryProperties]);

    return (
        <main className={classes.content}>
            <Paper className={classes.paper}>
                <Typography className={classes.cardHeader}>Telemetry Operations</Typography>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.startBtn}
                        onClick={confirmStart}
                        id="start-telemetry-btn"
                        disabled={telemetryStatus}
                    >
                        Start
                        <PlayCircleFilled htmlColor="white" className={classes.telemetryIcon} />
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={confirmStop}
                        id="stop-telemetry-btn"
                        disabled={!telemetryStatus}
                    >
                        Stop
                        <StopRounded htmlColor="white" className={classes.telemetryIcon} />
                    </Button>
                    </Grid>
                    <Typography>Telemetry is: {telemetryStatus ? (
                        <Typography variant="span" className={classes.colorGreen}>On</Typography>
                    ) : (
                        <Typography variant="span" className={classes.colorOrange}>Off</Typography>
                    )}
                    </Typography>
                </Grid>
            </Paper>
            {telemetryStatus && telemetryProperties && telemetryProperties.length ? (
            <Paper className={classes.paper}>
                <ThemeProvider theme={TableTheme}>
                <Grid container justifyContent="space-between">
                    <Typography className={classes.cardHeader}>Telemetry Fields</Typography>
                    <Grid item>
                        <FormControlLabel
                            className={classes.formLabel}
                            classes={{
                                label: classes.formLabelText
                            }}
                            control={<Checkbox checked={isAllSelected} onClick={selectAll} />}
                            label="Select All"
                            name="select-all"
                            id="select-all"
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                <Grid container alignContent="flex-start" item md={6}>
                    {telemetryProperties && telemetryProperties.slice(0, Math.ceil(telemetryProperties.length/2)).map((d) => (
                        <TelemetryPropertyAccordion selectProperty={selectProperty} selectAll={selectAllFromCategory} data={d} />
                    ))}
                </Grid>
                <Grid container alignContent="flex-start" item md={6}>
                    {telemetryProperties && telemetryProperties.slice(Math.ceil(telemetryProperties.length/2)).map((d) => (
                        <TelemetryPropertyAccordion selectProperty={selectProperty} selectAll={selectAllFromCategory} data={d} />
                    ))}
                </Grid>
                </Grid>
                </ThemeProvider>
                <Grid
                  container
                  justifyContent="center"
                  className={classes.btnContainer}
                >
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.saveBtn}
                    data-testid="createarray-btn"
                    onClick={() => saveConfig(telemetryProperties)}
                >
                    Save
                </Button>
                </Grid>
            </Paper>
            ) : null}
            <AlertDialog
                title={alert.title}
                description={alert.errorMsg}
                open={alert.open}
                type={alert.type}
                link={alert.link}
                linkText={alert.linkText}
                onConfirm={alertConfirm}
                handleClose={closeAlert}
            />
            {loading ? (
                <MToolLoader text={loadText} />
              ) : null}
        </main>
    );
};

const mapStateToProps = (state) => ({
    telemetryProperties: state.telemetryReducer.properties,
    telemetryStatus: state.telemetryReducer.status,
    alert: state.telemetryReducer.alert,
    loading: state.waitLoaderReducer.loading,
    loadText: state.waitLoaderReducer.loadText
});

const mapDispatchToProps = (dispatch) => ({
    fetchTelemetryProperties: () => dispatch({type: actionTypes.SAGA_FETCH_TELEMETRY_PROPERTIES}),
    selectAllFromCategory: (payload) => dispatch({type: actionTypes.SELECT_ALL_FROM_CATEGORY, payload}),
    selectProperty: (payload) => dispatch({type: actionTypes.SET_TELEMETRY_PROPERTY, payload}),
    selectAllProperties: (payload) => dispatch({type: actionTypes.SELECT_ALL_PROPERTIES, payload}),
    closeAlert: () => dispatch({type: actionTypes.TELEMETRY_CLOSE_ALERT}),
    openAlert: (payload) => dispatch({type: actionTypes.TELEMETRY_OPEN_ALERT, payload}),
    startTelemetry: () => dispatch({type: actionTypes.SAGA_START_TELEMETRY}),
    stopTelemetry: () => dispatch({type: actionTypes.SAGA_STOP_TELEMETRY}),
    saveConfig: (payload) => dispatch({type: actionTypes.SAGA_SAVE_TELEMETRY_CONFIG, payload})
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(TelemetryConfiguration));