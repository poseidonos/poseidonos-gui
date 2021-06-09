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

DESCRIPTION: Power Summary Component
@NAME : index.js
@AUTHORS: Jay Hitesh Sanghavi
@Version : 1.0 
@REVISION HISTORY
[03/11/2019] [Jay] : Prototyping..........////////////////////
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
        fontSize: '14px',
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