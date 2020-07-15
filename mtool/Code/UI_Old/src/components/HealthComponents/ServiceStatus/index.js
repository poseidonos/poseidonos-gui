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

DESCRIPTION: Health Page Service Component
@NAME : index.js
@AUTHORS: Jay Hitesh Sanghavi
@Version : 1.0 
@REVISION HISTORY
[03/11/2019] [Jay] : Prototyping..........//////////////////// 
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import * as actionTypes from '../../../store/actions/actionTypes';
import Health_OK_Icon from '../../../assets/images/Ok14x14.png'
import Health_NOT_OK_Icon from '../../../assets/images/Not-Ok14x14.png'
import Refresh_Icon from '../../../assets/images/Refresh-14x14A.png'

const styles = theme => ({
    root: {
        flexGrow: 1,
    },

    overviewPaper: {
        width: '100%',
    },
    serviceRootGrid:{
      
    },
    serviceParentGrid: {
        marginTop: theme.spacing(0.5),
        maxWidth:'100%',
        flexBasis:'100%'
    },
    serviceOuterGrid: {
        border: '1px solid gray',
        maxWidth: '100%',
        flexBasis: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        minHeight: '75px',
        maxHeight: '100px',
        background: '#fff',
        marginTop:theme.spacing(2)
    },
    hardwareOuterGrid:{
        border: '1px solid gray',
        maxWidth: '100%',
        flexBasis: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        minHeight: '100px',
        maxHeight: '100px',
        background: '#fff',
        marginTop:theme.spacing(2)
    },
    serviceRowContainer:{
        maxWidth: '100%',
        flexBasis:'100%',
    },
    serviceInnerGrid: {
        maxWidth: '50%',
        flexBasis:'50%',
        marginTop: theme.spacing(2),
    },
    hardwareInnerGrid: {
        maxWidth: '33%',
        flexBasis:'33%',
        marginTop: theme.spacing(2),
    },
    serviceHeader: {
        backgroundColor: '#788595',
        color: 'white',
        paddingLeft: '5px',
        fontSize: '14px',
        height: '24px',
    },
    img:{
        marginLeft: theme.spacing(1),
        marginRight:theme.spacing(1),
    }
});

class ServiceStatus extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchSoftwareDetails();
        this.props.fetchHardwareDetails();
        this.props.fetchNetworkDetails();
    }

    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.overviewPaper}>
                <Grid item container spacing={3} className={classes.serviceRootGrid}>
                    <Grid sm={6} xs={12} item container className={classes.serviceParentGrid}>
                        <Grid xs={12} item className={classes.serviceOuterGrid}>
                            <Typography className={classes.serviceHeader} variant="h6">Software </Typography>
                            <Grid sm={6} xs={12} item container className={classes.serviceRowContainer}>
                                <Grid sm={6} xs={12} item className={classes.serviceInnerGrid}>
                                    <img title={(this.props.software_health.length === 0 ? "Refreshing..": "Health Status")} src={(this.props.software_health.length === 0 ? Refresh_Icon:((this.props.software_health && this.props.software_health[0] && this.props.software_health[0].mgmt_service==="OK") ? Health_OK_Icon : Health_NOT_OK_Icon))} className={classes.img} />
                                    <label>Mgmt Service</label>
                                </Grid>
                                <Grid sm={6} xs={12} item className={classes.serviceInnerGrid}>
                                    <img title={(this.props.software_health.length === 0 ? "Refreshing..": "Health Status")} src={(this.props.software_health.length === 0 ? Refresh_Icon:((this.props.software_health && this.props.software_health[0] && this.props.software_health[0].data_service==="OK") ? Health_OK_Icon : Health_NOT_OK_Icon))} className={classes.img} />
                                    <label>Data Services</label>
                                </Grid>
                            </Grid>
                        </Grid>


                        <Grid xs={12} item className={classes.hardwareOuterGrid}>
                            <Typography className={classes.serviceHeader} variant="h6">Hardware </Typography>
                            <Grid sm={6} xs={12} item container className={classes.serviceRowContainer}>
                                <Grid sm={6} xs={12} item className={classes.hardwareInnerGrid}>
                                    <img title={(this.props.hardware_health.length === 0 ? "Refreshing..": "Health Status")} src={(this.props.hardware_health.length === 0 ? Refresh_Icon:((this.props.hardware_health && this.props.hardware_health[0] && this.props.hardware_health[0].power === "OK") ?Health_OK_Icon : Health_NOT_OK_Icon))} className={classes.img} />
                                    <label>Power Supplies</label>
                                </Grid>
                                <Grid sm={6} xs={12} item className={classes.hardwareInnerGrid}>
                                    <img title={(this.props.hardware_health.length === 0 ? "Refreshing..": "Health Status")} src={(this.props.hardware_health.length === 0 ? Refresh_Icon:((this.props.hardware_health && this.props.hardware_health[0] && this.props.hardware_health[0].fans === "OK") ? Health_OK_Icon : Health_NOT_OK_Icon))} className={classes.img} />
                                    <label>Fans</label>
                                </Grid>
                                <Grid sm={6} xs={12} item className={classes.hardwareInnerGrid}>
                                    <img title={(this.props.hardware_health.length === 0 ? "Refreshing..": "Health Status")} src={(this.props.hardware_health.length === 0 ? Refresh_Icon:((this.props.hardware_health && this.props.hardware_health[0] && this.props.hardware_health[0].temperature==="OK") ?Health_OK_Icon : Health_NOT_OK_Icon))} className={classes.img} />
                                    <label>Temperature Sensors</label>
                                </Grid>
                                <Grid sm={6} xs={12} item className={classes.hardwareInnerGrid}>
                                    <img title={(this.props.hardware_health.length === 0 ? "Refreshing..": "Health Status")} src={(this.props.hardware_health.length === 0 ? Refresh_Icon:((this.props.hardware_health && this.props.hardware_health[0] && this.props.hardware_health[0].cpu==="OK") ?Health_OK_Icon : Health_NOT_OK_Icon))} className={classes.img} />
                                    <label>CPU</label>
                                </Grid>
                                <Grid sm={6} xs={12} item className={classes.hardwareInnerGrid}>
                                    <img title={(this.props.hardware_health.length === 0 ? "Refreshing..": "Health Status")} src={(this.props.hardware_health.length === 0 ? Refresh_Icon:((this.props.hardware_health && this.props.hardware_health[0] && this.props.hardware_health[0].memory==="OK") ?Health_OK_Icon : Health_NOT_OK_Icon))} className={classes.img} />
                                    <label>Memory</label>
                                </Grid>
                            </Grid>
                        </Grid>


                        <Grid xs={12} item className={classes.serviceOuterGrid}>
                            <Typography className={classes.serviceHeader} variant="h6">Network </Typography>
                            <Grid sm={6} xs={12} item container className={classes.serviceRowContainer}>
                                <Grid sm={6} xs={12} item className={classes.hardwareInnerGrid}>
                                    <img title={(this.props.network_health.length === 0 ? "Refreshing..": "Health Status")} src={(this.props.network_health.length === 0 ? Refresh_Icon:((this.props.network_health && this.props.network_health[0] && this.props.network_health[0].mgmt_network==="OK") ? Health_OK_Icon : Health_NOT_OK_Icon))} className={classes.img} />
                                    <label>Management Network</label>
                                </Grid>
                                <Grid sm={6} xs={12} item className={classes.hardwareInnerGrid}>
                                    <img title={(this.props.network_health.length === 0 ? "Refreshing..": "Health Status")} src={(this.props.network_health.length === 0 ? Refresh_Icon:((this.props.network_health && this.props.network_health[0] && this.props.network_health[0].client_network==="OK") ? Health_OK_Icon : Health_NOT_OK_Icon))} className={classes.img} />
                                    <label>Client Network</label>
                                </Grid>
                                <Grid sm={6} xs={12} item className={classes.hardwareInnerGrid}>
                                    <img title={(this.props.network_health.length === 0 ? "Refreshing..": "Health Status")} src={(this.props.network_health.length === 0 ? Refresh_Icon:((this.props.network_health && this.props.network_health[0] && this.props.network_health[0].storage_fabric==="OK") ? Health_OK_Icon : Health_NOT_OK_Icon))} className={classes.img} />
                                    <label>Storage Fabric 1</label>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}

const mapStateToProps = state => {
    return {
        software_health: state.hardwareHealthReducer.software_health,
        hardware_health: state.hardwareHealthReducer.hardware_health,
        network_health: state.hardwareHealthReducer.network_health,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        fetchSoftwareDetails: () => dispatch({ type: actionTypes.SAGA_HARDWARE_HEALTH_FETCH_SOFTWARE_DETAILS }),
        fetchHardwareDetails: () => dispatch({ type: actionTypes.SAGA_HARDWARE_HEALTH_FETCH_HARDWARE_DETAILS }),
        fetchNetworkDetails: () => dispatch({ type: actionTypes.SAGA_HARDWARE_HEALTH_FETCH_NETWORK_DETAILS }),
    };
}

export default withStyles(styles)((connect(mapStateToProps, mapDispatchToProps))(((ServiceStatus))));