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
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import RunIbofOs from '../../components/IbofOsOperationComponents/RunIbofOs/index';
import './IbofOsOperations.css';
import AlertDialog from "../../components/Dialog";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import * as actionTypes from "../../store/actions/actionTypes";
import * as actionCreators from '../../store/actions/exportActionCreators';

import MToolTheme from '../../theme';

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
        };
        this.triggerCommand = this.triggerCommand.bind(this);
        // this.onHandleExitIbofOS = this.onHandleExitIbofOS.bind(this);
        // this.OnHandleChange = this.OnHandleChange.bind(this);
        // this.validate = this.validate.bind(this);
        // this.onClickRunCommand = this.onClickRunCommand.bind(this);
        this.openAlert = this.openAlert.bind(this);
        this.handleAlertClose = this.handleAlertClose.bind(this);
        this.interval = null;
    }

    componentDidMount() {
        this.props.Set_Message("");
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    // validate() {
    //     if (this.state.filepath === "") {
    //         this.setState({
    //             alertOpen: true,
    //             istypealert: true,
    //             alerttype: "alert",
    //             alerttitle: "Run Command on iBoF OS",
    //             alertdescription: "Please enter a valid file path"
    //         });
    //     }
    //     else {
    //         this.setState({ ...this.state, error: "" });
    //         return true;
    //     }
    //     return false;
    // }

    handleAlertClose() {
        this.setState({
            alertOpen: false
        })
    }

    openAlert(operationType) {
        let message = "";
        // if (operationType === "Run")
        //     message = " Command";
        // if (operationType === "Start" || operationType === "Stop" || operationType === "Exit")
        // if (operationType === "Start" || operationType === "Stop")
        message = "Poseidon OS";
        // istanbul ignore next: cannot reset as it is hidden
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
        // if (this.state.add_delete_send === "Run") {
        //     this.onClickRunCommand();
        // }
        if (this.state.add_delete_send === "Start") {
            this.props.Start_POS();
        } else if (this.state.add_delete_send === "Stop") {
            this.props.Stop_POS();
        } else if (this.state.add_delete_send === "Mount") {
            this.props.Mount_POS();
        } else if (this.state.add_delete_send === "Unmount") {
            this.props.Unmount_POS()
        } else {
            this.props.Reset_POS();
        }
        this.handleAlertClose();
        // else if (this.state.add_delete_send === "Exit") {
        //     this.onHandleExitIbofOS();
        //     this.handleAlertClose("YES");
        // }
    }

    render() {
        return (
            <ThemeProvider theme={MToolTheme}>
                <CssBaseline />
                <Header />
                <Sidebar />
                <div className="IbofOsOperations">
                    <RunIbofOs
                        status={this.props.bool_status}
                        responsefromos={this.props.operationsMessage}
                        openAlert={this.openAlert}
                        OS_Running_Status={this.props.OS_Running}
                        isButtonDisabled={this.state.isButtonDisabled}
                        mountState={this.props.posMountStatus}
                    />
                    <AlertDialog
                        title={this.state.alerttitle}
                        description={this.state.alertdescription}
                        open={this.state.alertOpen}
                        type={this.state.alerttype}
                        handleClose={this.handleAlertClose}
                        onConfirm={this.triggerCommand}
                    />
                </div>
            </ThemeProvider>
        );
    }
}

const mapStateToProps = state => {
    return {
        OS_Running: state.headerReducer.OS_Running_Status,
        bool_status: state.headerReducer.status,
        operationsMessage: state.headerReducer.operationsMessage,
        posMountStatus: state.headerReducer.state
    };
}
const mapDispatchToProps = dispatch => {
    return {
        Get_Is_iBOFOS_Running_Status: (payload) => dispatch({ type: actionTypes.SAGA_GET_IS_IBOF_OS_RUNNING, payload }),
        resetIsLoggedIn: () => dispatch(actionCreators.resetIsLoggedIn()),
        Stop_POS: () => dispatch({type: actionTypes.SAGA_STOP_IBOFOS}),
        Start_POS: () => dispatch({type: actionTypes.SAGA_START_IBOFOS}),
        Reset_POS: () => dispatch({type: actionTypes.SAGA_RESET_IBOFOS}),
        Unmount_POS: () => dispatch({ type: actionTypes.SAGA_UNMOUNT_IBOFOS}),
        Mount_POS: () => dispatch({ type: actionTypes.SAGA_MOUNT_IBOFOS}),
        Set_Message: (message) => dispatch({ type: actionTypes.SET_OPERATIONS_MESSAGE, message})
    };
}
export default ((connect(mapStateToProps, mapDispatchToProps))(withRouter(IbofOsOperations)));

