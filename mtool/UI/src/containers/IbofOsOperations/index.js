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


DESCRIPTION: IBOF Operations Page Container for rendering IBOF Operations Page
@NAME : index.js
@AUTHORS: Jay Hitesh Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
*/
import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import ThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
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
        this.IsIbofOSRunning = this.IsIbofOSRunning.bind(this);
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

    IsIbofOSRunning() {
        this.props.Get_Is_iBOFOS_Running_Status({ push: this.props.history.push, resetIsLoggedIn: this.props.resetIsLoggedIn });
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

