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
import * as actionTypes from '../../../store/actions/actionTypes';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    summaryOuterGrid: {
        border: '1px solid gray',
        maxWidth: '100%',
        minHeight: '100px',
        maxHeight: '150px',
        overflowY: 'auto',
        overflowX: 'hidden',
        justifyContent: 'left',
        background: '#fff'
    },

    summaryInfoHeader: {
        textAlign: 'left',
        color: 'rgba(255, 255, 255, 0.87)',
        fontSize: 14,
        borderRadius: '0px',
        width: '100%',
        marginLeft: '10px',
        lineHeight: '2',
    },

    overviewPaper: {
        width: '100%',
    },

    summaryCard: {
        backgroundColor: '#788595',
        justifyContent: 'center',
        maxWidth: '100%',
        maxHeight: '30px',
        flexBasis: '100%'
    },

    SpecifySummaryCard: {
        marginTop: theme.spacing(2),
        borderRadius: '0px',
        boxShadow: 'none',
    },
    textField: {
        color: "black",
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        width: 300,
    },

});

class PowerSummary extends Component {

    componentDidMount() {
       this.props.fetchPowerSummary();
       this.props.fetchPowerInfo();
    }
  
    render() {
        const { classes } = this.props;
        return (
            <Card className={classes.SpecifySummaryCard}>
                <Grid container className={classes.summaryOuterGrid}>
                    <Grid className={classes.summaryCard}>
                        <Typography className={classes.summaryInfoHeader}>
                            Power Summary
                        </Typography>
                    </Grid>
                    <TextField className={classes.textField}
                        id="standard-required"
                        margin="none"
                        value={this.props.powerconsumption === 0 ? "Error" : this.props.powerconsumption}
                        label="Total Power Consumption (Watts)"
                        disabled
                         InputProps={{
                            readOnly: true,
                             classes: {
                            input: classes.textField
                         }
                    }}
                    />
                    <TextField className={classes.textField}
                        id="standard-required"
                        margin="none"
                        value={this.props.currentpowermode}
                        disabled
                        label="Current Power Mode"
                          InputProps={{
                            readOnly: true,
                             classes: {
                            input: classes.textField
                         }
                    }}
                    />
                </Grid>
            </Card>
        );
    }
}

const mapStateToProps = state => {
    return {
        currentpowermode:state.hardwarePowerManagementReducer.currentpowermode,
        powerconsumption:state.hardwareOverviewReducer.powerconsumption,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        fetchPowerSummary: () => dispatch({ type: actionTypes.SAGA_HARDWARE_POWER_MANAGEMENT_FETCH_POWER_SUMMARY_INFORMATION }),
        fetchPowerInfo: () => dispatch({ type: actionTypes.SAGA_HARDWARE_OVERVIEW_FETCH_POWER_INFORMATION }),
    };
}

export default withStyles(styles)((connect(mapStateToProps, mapDispatchToProps))(((PowerSummary))));