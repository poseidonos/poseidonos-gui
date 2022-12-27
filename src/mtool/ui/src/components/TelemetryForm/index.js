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

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import {
    Button,
    FormControl,
    Grid,
    TextField,
    ThemeProvider,
    Typography,
    withStyles,
} from "@material-ui/core";

import { PageTheme } from "../../theme";
import { IP_REGEX } from '../../utils/constants';
import Popup from "../Popup";
import * as actionTypes from '../../store/actions/actionTypes';
import * as actionCreators from '../../store/actions/exportActionCreators';


const styles = (theme) => ({
    formControl: {
        marginTop: theme.spacing(2),
        width: "100%",
        [theme.breakpoints.down("xs")]: {
            marginTop: theme.spacing(1),
        }
    },
    button: {
        margin: theme.spacing(2, 0),
        width: 80,
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing(1, 0),
            width: "100%",
        }
    },
    textEnd: {
        padding: 0,
        width: "fit-content",
        minWidth: "fit-content",
        textAlign: "end",
        display: "block",
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing(1, 0),
            width: "100%",
            textAlign: "center",
            padding: "inherit"
        },
        "&:hover": {
            backgroundColor: "inherit",
            textDecoration: "underline"
        }
    },
});


const TelemetryForm = (props) => {
    const { t, classes, showConfig, setShowConfig } = props;
    const [telemetryIP, setTelemetryIP] = useState(props.telemetryIP);
    const [telemetryPort, setTelemetryPort] = useState(props.telemetryPort);
    const [isValidationFailed, setIsValidationFailed] = useState(false);
    const [validationFailedMessage, setValidationFailedMessage] = useState("");

    useEffect(() => {
        setTelemetryIP(props.telemetryIP);
        setTelemetryPort(props.telemetryPort);
    }, [props.telemetryIP, props.telemetryPort]);

    const handleSaveConfig = () => {
        let isError = true;
        let errorDesc = "";

        if (!(IP_REGEX.test(telemetryIP)))
            errorDesc = "Please Enter a valid IP for Telemetry API";
        else if (Number(telemetryPort) <= 0 || Number(telemetryPort) > 65535)
            errorDesc = "Please Enter a valid Port for Telemetry API";
        else
            isError = false;

        setIsValidationFailed(isError);
        setValidationFailedMessage(errorDesc);

        if (isError) return;

        const payload = {
            "telemetryIP": telemetryIP,
            "telemetryPort": telemetryPort,
        }
        props.saveConfig(payload);
    }

    return (
        <ThemeProvider theme={PageTheme}>
            <Popup
                title="Configure Telemetry API"
                open={showConfig}
                close={() => setShowConfig(false)}
                maxWidth="xs"
            >
                <Grid
                    container
                    justifyContent="space-between"
                    wrap="wrap"
                >
                    <Grid container justifyContent="space-between" wrap="wrap">
                        <Grid item xs={12} sm={7} container justifyContent="center" alignItems="center">
                            <FormControl className={classes.formControl}>
                                <TextField
                                    id="telemetryIPInputPopup"
                                    name="telemetryIP"
                                    label="Telemetry IP"
                                    value={telemetryIP}
                                    onChange={e => setTelemetryIP(e.target.value)}
                                    inputProps={{
                                        "data-testid": "telemetryIPInputPopup",
                                    }}
                                    className={classes.formText}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4} container justifyContent="center" alignItems="center">
                            <FormControl className={classes.formControl}>
                                <TextField
                                    id="telemetryPortInputPopup"
                                    name="telemetryPort"
                                    label="Telemetry Port"
                                    type="number"
                                    value={telemetryPort}
                                    onChange={e => setTelemetryPort(e.target.value)}
                                    inputProps={{
                                        "data-testid": "telemetryPortInputPopup",
                                    }}
                                    className={classes.formText}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    {isValidationFailed &&
                        (
                            <Typography
                                variant="caption"
                                component="span"
                                data-testid="errorMsgConfigValidationPopup"
                                color="error"
                            >
                                {validationFailedMessage}
                            </Typography>
                        )
                    }
                    {!isValidationFailed && props.configurationFailed &&
                        (
                            <Typography
                                variant="caption"
                                component="span"
                                data-testid="errorMsgConfigPopup"
                                color="error"
                            >
                                {t('Configuration failed! Telemetry API is not reachable')}
                            </Typography>
                        )
                    }
                    <Grid item xs={12} container justifyContent="space-between">
                        <Grid item sm={5} xs={12} container justifyContent="space-between">
                            <Button
                                onClick={handleSaveConfig}
                                variant="contained"
                                color="primary"
                                id="btn-save-telemetry-tconfig"
                                data-testid="btn-save-telemetry-config"
                                className={classes.button}
                                disabled={props.isSavingConfig}
                            >
                                {t('Save')}
                            </Button>
                            <Button
                                onClick={() => setShowConfig(false)}
                                variant="outlined"
                                id="btn-cancel-telemetry-config"
                                color="secondary"
                                data-testid="btn-cancel-telemetry-config"
                                className={classes.button}
                            >
                                {t('Cancel')}
                            </Button>
                        </Grid>
                        <Grid item sm={4} xs={12} container justifyContent="space-between" alignItems="center">
                            <Typography
                                variant="caption"
                                component="span"
                                data-testid="errorMsgConfigPopup"
                                color="error"
                            >
                                {props.resettingConfigFailed && "Resetting Failed!"}
                            </Typography>
                            <Button
                                onClick={() => props.resetConfig()}
                                variant="text"
                                id="btn-reset-telemetry-config"
                                color="secondary"
                                data-testid="btn-reset-telemetry-config"
                                className={`${classes.button} ${classes.textEnd}`}
                                disabled={!props.isConfigured || props.isResettingConfig}
                            >
                                Reset
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Popup>
        </ThemeProvider>
    );
};

const mapStateToProps = state => {
    return {
        telemetryIP: state.authenticationReducer.telemetryIP,
        telemetryPort: state.authenticationReducer.telemetryPort,
        isConfigured: state.authenticationReducer.isConfigured,
        configurationFailed: state.authenticationReducer.configurationFailed,
        showConfig: state.authenticationReducer.showConfig,
        isSavingConfig: state.authenticationReducer.isSavingConfig,
        isResettingConfig: state.authenticationReducer.isResettingConfig,
        resettingConfigFailed: state.authenticationReducer.resettingConfigFailed,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        saveConfig: (data, fn) => dispatch({ type: actionTypes.SAGA_CONFIGURE, payload: data, history: fn }),
        changeCredentials: payload => dispatch(actionCreators.changeCredentials(payload)),
        setShowConfig: payload => dispatch(actionCreators.setShowConfig(payload)),
        resetConfig: () => dispatch({ type: actionTypes.SAGA_RESET_CONFIGURATION })
    };
};

export default withStyles(styles)(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(withTranslation('translations')(TelemetryForm))
);
