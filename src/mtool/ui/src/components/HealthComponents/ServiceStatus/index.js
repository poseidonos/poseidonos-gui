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

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import * as actionTypes from '../../../store/actions/actionTypes';
import HealthOKIcon from '../../../assets/images/Ok14x14.png'
import HealthNotOKIcon from '../../../assets/images/Not-Ok14x14.png'
import RefreshIcon from '../../../assets/images/Refresh-14x14A.png'

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
        fontSize: 14,
        height: '24px',
    },
    img:{
        marginLeft: theme.spacing(1),
        marginRight:theme.spacing(1),
    }
});

class ServiceStatus extends Component {

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
                                    {this.props.software_health.length === 0 ? (
                                      <img alt="" title="Refreshing.." src={RefreshIcon} className={classes.img} />
                                    ) : null }
                                    {this.props.software_health.length !== 0 ? (
                                      <img alt="" title="Health Status"
                                        src={(this.props.software_health[0] && this.props.software_health[0].mgmt_service==="OK") ? HealthOKIcon : HealthNotOKIcon}
                                        className={classes.img}
                                      />
                                    ) : null }
                                    <span>Mgmt Service</span>
                                </Grid>
                                <Grid sm={6} xs={12} item className={classes.serviceInnerGrid}>
                                {this.props.software_health.length === 0 ? (
                                      <img alt="" title="Refreshing.." src={RefreshIcon} className={classes.img} />
                                    ) : null }
                                    {this.props.software_health.length !== 0 ? (
                                      <img alt="" title="Health Status"
                                        src={(this.props.software_health[0] && this.props.software_health[0].data_service==="OK") ? HealthOKIcon : HealthNotOKIcon}
                                        className={classes.img}
                                      />
                                    ) : null }
                                    <span>Data Services</span>
                                </Grid>
                            </Grid>
                        </Grid>


                        <Grid xs={12} item className={classes.hardwareOuterGrid}>
                            <Typography className={classes.serviceHeader} variant="h6">Hardware </Typography>
                            <Grid sm={6} xs={12} item container className={classes.serviceRowContainer}>
                                <Grid sm={6} xs={12} item className={classes.hardwareInnerGrid}>
                                    {this.props.hardware_health.length === 0 ? (
                                      <img alt="" title="Refreshing.." src={RefreshIcon} className={classes.img} />
                                    ) : null }
                                    {this.props.hardware_health.length !== 0 ? (
                                      <img alt="" title="Health Status"
                                        src={(this.props.hardware_health[0] && this.props.hardware_health[0].power==="OK") ? HealthOKIcon : HealthNotOKIcon}
                                        className={classes.img}
                                      />
                                    ) : null }
                                    <span>Power Supplies</span>
                                </Grid>
                                <Grid sm={6} xs={12} item className={classes.hardwareInnerGrid}>
                                    {this.props.hardware_health.length === 0 ? (
                                      <img alt="" title="Refreshing.." src={RefreshIcon} className={classes.img} />
                                    ) : null }
                                    {this.props.hardware_health.length !== 0 ? (
                                      <img alt="" title="Health Status"
                                        src={(this.props.hardware_health[0] && this.props.hardware_health[0].fans==="OK") ? HealthOKIcon : HealthNotOKIcon}
                                        className={classes.img}
                                      />
                                    ) : null }
                                    <span>Fans</span>
                                </Grid>
                                <Grid sm={6} xs={12} item className={classes.hardwareInnerGrid}>
                                    {this.props.hardware_health.length === 0 ? (
                                      <img alt="" title="Refreshing.." src={RefreshIcon} className={classes.img} />
                                    ) : null }
                                    {this.props.hardware_health.length !== 0 ? (
                                      <img alt="" title="Health Status"
                                        src={(this.props.hardware_health[0] && this.props.hardware_health[0].temperature === "OK") ? HealthOKIcon : HealthNotOKIcon}
                                        className={classes.img}
                                      />
                                    ) : null }
                                    <span>Temperature Sensors</span>
                                </Grid>
                                <Grid sm={6} xs={12} item className={classes.hardwareInnerGrid}>
                                    {this.props.hardware_health.length === 0 ? (
                                      <img alt="" title="Refreshing.." src={RefreshIcon} className={classes.img} />
                                    ) : null }
                                    {this.props.hardware_health.length !== 0 ? (
                                      <img alt="" title="Health Status"
                                        src={(this.props.hardware_health[0] && this.props.hardware_health[0].cpu === "OK") ? HealthOKIcon : HealthNotOKIcon}
                                        className={classes.img}
                                      />
                                    ) : null }
                                    <span>CPU</span>
                                </Grid>
                                <Grid sm={6} xs={12} item className={classes.hardwareInnerGrid}>
                                    {this.props.hardware_health.length === 0 ? (
                                      <img alt="" title="Refreshing.." src={RefreshIcon} className={classes.img} />
                                    ) : null }
                                    {this.props.hardware_health.length !== 0 ? (
                                      <img alt="" title="Health Status"
                                        src={(this.props.hardware_health[0] && this.props.hardware_health[0].memory === "OK") ? HealthOKIcon : HealthNotOKIcon}
                                        className={classes.img}
                                      />
                                    ) : null }
                                    <span>Memory</span>
                                </Grid>
                            </Grid>
                        </Grid>


                        <Grid xs={12} item className={classes.serviceOuterGrid}>
                            <Typography className={classes.serviceHeader} variant="h6">Network </Typography>
                            <Grid sm={6} xs={12} item container className={classes.serviceRowContainer}>
                                <Grid sm={6} xs={12} item className={classes.hardwareInnerGrid}>
                                    {this.props.network_health.length === 0 ? (
                                      <img alt="" title="Refreshing.." src={RefreshIcon} className={classes.img} />
                                    ) : null }
                                    {this.props.network_health.length !== 0 ? (
                                      <img alt="" title="Health Status"
                                        src={(this.props.network_health[0] && this.props.network_health[0].mgmt_network === "OK") ? HealthOKIcon : HealthNotOKIcon}
                                        className={classes.img}
                                      />
                                    ) : null }
                                    <span>Management Network</span>
                                </Grid>
                                <Grid sm={6} xs={12} item className={classes.hardwareInnerGrid}>
                                    {this.props.network_health.length === 0 ? (
                                      <img alt="" title="Refreshing.." src={RefreshIcon} className={classes.img} />
                                    ) : null }
                                    {this.props.network_health.length !== 0 ? (
                                      <img alt="" title="Health Status"
                                        src={(this.props.network_health[0] && this.props.network_health[0].client_network === "OK") ? HealthOKIcon : HealthNotOKIcon}
                                        className={classes.img}
                                      />
                                    ) : null }
                                    <span>Client Network</span>
                                </Grid>
                                <Grid sm={6} xs={12} item className={classes.hardwareInnerGrid}>
                                    {this.props.network_health.length === 0 ? (
                                      <img alt="" title="Refreshing.." src={RefreshIcon} className={classes.img} />
                                    ) : null }
                                    {this.props.network_health.length !== 0 ? (
                                      <img alt="" title="Health Status"
                                        src={(this.props.network_health[0] && this.props.network_health[0].storage_fabric === "OK") ? HealthOKIcon : HealthNotOKIcon}
                                        className={classes.img}
                                      />
                                    ) : null }
                                    <span>Storage Fabric 1</span>
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