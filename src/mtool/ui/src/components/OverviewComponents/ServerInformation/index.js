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

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import ThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { createMuiTheme } from "@material-ui/core";
import { customTheme } from '../../../theme';
import * as actionTypes from '../../../store/actions/actionTypes';

const formTheme = createMuiTheme({
  ...customTheme,
  typography: {
      fontSize: '12px'
  },
  overrides: {
    MuiInput: {
      // Name of the styleSheet
      underline: {
        '&:hover:not($disabled):before': {
          borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
        },
        '&:after': {
            borderBottom: 0
        }
      },
    },
  },
});

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    serverOuterGrid: {
        maxWidth: '100%',
        minHeight: '140px',
        overflowY: 'auto',
        overflowX: 'hidden',
        justifyContent: 'left',
        background: '#fff'
    },
    serverInfoHeader: {
        textAlign: 'left',
        color: 'rgba(255, 255, 255, 0.87)',
        fontSize: '14px',
        borderRadius: '0px',
        width: '100%',
        marginLeft: '10px',
        lineHeight: '1.5',
    },
    overviewPaper: {
        width: '100%',
    },

    serverCard: {
        backgroundColor: '#788595',
        justifyContent: 'center',
        maxWidth: '100%',
        maxHeight: '24px',
        flexBasis: '100%'
    },

    SpecifyServerCard: {
        borderRadius: '0px',
        boxShadow: 'none',
    },
    textField: {
        color: "black",
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 230,
    },

});

class ServerInformation extends Component {

    componentDidMount() {
        this.props.fetchServerInfo();
    }
  
    render() {
        const { classes } = this.props;
        return (
            <Card className={classes.SpecifyServerCard}>
                <Grid container className={classes.serverOuterGrid}>
                        <ThemeProvider theme={formTheme}>
                    <Grid className={classes.serverCard}>
                        <Typography className={classes.serverInfoHeader}>
                            Server Information
                        </Typography>
                    </Grid>
                    <TextField
    //                 onFocus={event => {
    //     event.target.select()
    //   }}
                        className={classes.textField}
                        id="standard-required"
                        margin="none"
                        value={this.props.model ==="" ? "NA": this.props.model}
                        label="Model"
                        // disabled
                         InputProps={{
                            readOnly: true,
                             classes: {
                            input: classes.textField
                         }
                    }}
                    />


                    <TextField className={classes.textField}
    //                 onFocus={event => {
    //     event.target.select()
    //   }}
                        id="standard-required"
                        margin="none"
                        // disabled
                        value={this.props.manufacturer ===""? "NA": this.props.manufacturer}
                        label="Manufacturer"
                         InputProps={{
                             readOnly: true,
                             autoFocus :false,
                             classes: {
                            input: classes.textField
                         }
                    }}
                    />
                    <TextField className={classes.textField}
    //                 onFocus={event => {
    //     event.target.select()
    //   }}
                        id="standard-required"
                        margin="none"
                        value={this.props.servermac ===""?"NA":this.props.servermac}
                        label="BMC MAC Address"
                        // disabled
                         InputProps={{
                             readOnly: true,
                             classes: {
                            input: classes.textField
                         }
                    }}
                    />
                    <TextField className={classes.textField}
    //                 onFocus={event => {
    //     event.target.select()
    //   }}
                        id="standard-required"
                        margin="none"
                        value={this.props.serverip === "" ? "NA":this.props.serverip}
                        // disabled
                        label="BMC IP Address"
                         InputProps={{
                            readOnly: true,
                             classes: {
                            input: classes.textField
                         }
                    }}
                    />
                    <TextField className={classes.textField}
    //                 onFocus={event => {
    //     event.target.select()
    //   }}
                        id="standard-required"
                        margin="none"
                        value={this.props.firmwareversion==="" ?"NA": this.props.firmwareversion}
                        label="BMC Firmware Version"
                        // disabled
                         InputProps={{
                             readOnly: true,
                             classes: {
                            input: classes.textField
                         }
                    }}
                    />
                    <TextField className={classes.textField}
    //                 onFocus={event => {
    //     event.target.select()
    //   }}
                        id="standard-required"
                        margin="none"
                        value={this.props.serialno==="" ? "NA": this.props.serialno}
                        label="Serial Number"
                       // disabled
                         InputProps={{
                             readOnly: true,
                             classes: {
                            input: classes.textField
                         }
                    }}
                    />
                        </ThemeProvider>
                </Grid>
            </Card>
        );
    }
}

const mapStateToProps = state => {
    return {
        model:  state.hardwareOverviewReducer.model,
        manufacturer: state.hardwareOverviewReducer.manufacturer,
        servermac: state.hardwareOverviewReducer.servermac,
        serverip: state.hardwareOverviewReducer.serverip,
        firmwareversion: state.hardwareOverviewReducer.firmwareversion,
        serialno: state.hardwareOverviewReducer.serialno,
        hostname: state.hardwareOverviewReducer.hostname,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        fetchServerInfo: () => dispatch({ type: actionTypes.SAGA_HARDWARE_OVERVIEW_FETCH_SERVER_INFORMATION }),
    };
}

export default withStyles(styles)((connect(mapStateToProps, mapDispatchToProps))(((ServerInformation))));