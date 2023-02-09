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

import React, { Component, lazy, Suspense } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import { MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles';
import { AppBar, Tabs, Tab, withStyles, Box } from '@material-ui/core';
import './IbofOsOperations.css';
import AlertDialog from "../../components/Dialog";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import TabPanel from "../../components/TabPanel";
import * as actionTypes from "../../store/actions/actionTypes";
import * as actionCreators from '../../store/actions/exportActionCreators';
import MToolTheme, { customTheme } from '../../theme';
import MToolLoader from '../../components/MToolLoader';

const RunIbofOs = lazy(() => import('../../components/IbofOsOperationComponents/RunIbofOs/index'));
const Device = lazy(() => import('./Device'));
const Subsystem = lazy(() => import('./Subsystem'));

const styles = (theme) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        width: '100%',
        boxSizing: 'border-box',
    },
    selectedTab: {
        color: 'rgb(33, 34, 37)',
        borderBottom: `2px solid ${'rgb(33, 34, 37)'}`,
        fontWeight: 600
    },

    toolbar: customTheme.toolbar
});

class IbofOsOperations extends Component {
    constructor() {
        super();
        this.state = {
            responseforIbofOS: "",
            isButtonDisabled: false,
            responseforRunCommand: "",
            filepath: "",
            error: "",
            istypealert: false,
            alerttype: "",
            alertOpen: false,
            add_delete_send: "",
            alerttitle: "",
            alertdescription: "",
            tabValue: "operations"
        };
        this.triggerCommand = this.triggerCommand.bind(this);
        this.openAlert = this.openAlert.bind(this);
        this.handleAlertClose = this.handleAlertClose.bind(this);
        this.handleCallToRouter = this.handleCallToRouter.bind(this);
        this.interval = null;
    }

    componentDidMount() {
        this.props.Set_Message("");
        this.props.Get_POS_Property();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    handleAlertClose() {
        this.setState({
            alertOpen: false
        })
    }

    handleCallToRouter(_, value) {
        this.props.history.push(value);
    }

    openAlert(operationType) {
        let message = "";
        message = "Poseidon OS";
        const alertMessage = operationType === "Reset" ?
            "Reset will delete all the array and volumes in POS. " : "";


        this.setState({
            ...this.state,
            alertOpen: true,
            add_delete_send: operationType,
            alerttype: "delete",
            istypealert: false,
            alerttitle: `${operationType} ${message}`,
            alertdescription: `${alertMessage}Do you want to  ${operationType} the ${message} ?`,
        });
    }

    triggerCommand() {
        if (this.state.add_delete_send === "Start") {
            this.props.Start_POS();
        } else if (this.state.add_delete_send === "Stop") {
            this.props.Stop_POS();
        } else {
            this.props.Reset_POS();
        }
        this.handleAlertClose();
    }

    render() {
        const { classes } = this.props;
        return (
            <ThemeProvider theme={MToolTheme}>
                <Box display="flex">
                    <Header />
                    <Sidebar />
                    <main className={classes.content}>
                        <div className={classes.toolbar} />
                        <AppBar position="static" color="default">
                            <Tabs
                                value={this.props.history.location.pathname}
                                onChange={this.handleCallToRouter}
                            >
                                <Tab data-testid="operationsTab" label="Operations" key="operations" value="/operations/pos" />
                                <Tab data-testid="devicesTab" label="Devices" key="devices" value="/operations/devices" />
                                <Tab data-testid="subsystemTab" label="Subsystem" key="subsystem" value="/operations/subsystem" />
                            </Tabs>
                        </AppBar>
                        <Suspense fallback={<MToolLoader />}>
                            <TabPanel value={this.props.history.location.pathname} index="/operations/pos">
                                <RunIbofOs
                                    property={this.props.posProperty}
                                    status={this.props.bool_status}
                                    responsefromos={this.props.operationsMessage}
                                    openAlert={this.openAlert}
                                    OS_Running_Status={this.props.OS_Running}
                                    isButtonDisabled={this.state.isButtonDisabled}
                                    mountState={this.props.posMountStatus}
                                    setProperty={this.props.Set_POS_Property}
                                />
                            </TabPanel>
                            <TabPanel value={this.props.history.location.pathname} index="/operations/devices">
                                <Device />
                            </TabPanel>
                            <TabPanel value={this.props.history.location.pathname} index="/operations/subsystem">
                                <Subsystem />
                            </TabPanel>
                        </Suspense>
                        <AlertDialog
                            title={this.state.alerttitle}
                            description={this.state.alertdescription}
                            open={this.state.alertOpen}
                            type={this.state.alerttype}
                            handleClose={this.handleAlertClose}
                            onConfirm={this.triggerCommand}
                        />
                    </main>
                </Box>
            </ThemeProvider>
        );
    }
}

const mapStateToProps = state => {
    return {
        OS_Running: state.headerReducer.OS_Running_Status,
        bool_status: state.headerReducer.status,
        operationsMessage: state.headerReducer.operationsMessage,
        posMountStatus: state.headerReducer.state,
        posProperty: state.headerReducer.posProperty
    };
}
const mapDispatchToProps = dispatch => {
    return {
        Get_Is_iBOFOS_Running_Status: (payload) => dispatch({ type: actionTypes.SAGA_GET_IS_IBOF_OS_RUNNING, payload }),
        resetIsLoggedIn: () => dispatch(actionCreators.resetIsLoggedIn()),
        Stop_POS: () => dispatch({ type: actionTypes.SAGA_STOP_IBOFOS }),
        Start_POS: () => dispatch({ type: actionTypes.SAGA_START_IBOFOS }),
        Reset_POS: () => dispatch({ type: actionTypes.SAGA_RESET_IBOFOS }),
        Set_Message: (message) => dispatch({ type: actionTypes.SET_OPERATIONS_MESSAGE, message }),
        Get_POS_Property: () => dispatch({ type: actionTypes.SAGA_GET_POS_PROPERTY }),
        Set_POS_Property: (payload) => dispatch({ type: actionTypes.SAGA_SET_POS_PROPERTY, payload })
    };
}
export default ((connect(mapStateToProps, mapDispatchToProps))(withRouter(withStyles(styles)(IbofOsOperations))));

