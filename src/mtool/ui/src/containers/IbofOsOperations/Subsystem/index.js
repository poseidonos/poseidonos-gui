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
import { Grid, IconButton, ThemeProvider, Typography, Tooltip, withStyles } from '@material-ui/core';
import MaterialTable from '@material-table/core';
import { Add, Check, Clear, FirstPage, LastPage, Search, ChevronRight, ChevronLeft, Delete, Remove, ArrowUpward } from '@material-ui/icons';
import { connect } from 'react-redux';
import { customTheme, TableTheme } from '../../../theme';
import Popup from '../../../components/Popup';
import * as actionTypes from "../../../store/actions/actionTypes";
import MToolLoader from '../../../components/MToolLoader';
import CreateSubsystem from '../../../components/CreateSubsystem';
import AlertDialog from "../../../components/Dialog";
import SubsystemDetails from '../../../components/SubsystemDetails';

const styles = (theme) => ({
    cardHeader: {
        ...customTheme.card.header,
        marginLeft: 0
    },
    detailText: {
        fontWeight: 600
    },
    deleteIcon: {
        cursor: "pointer",
        "&:hover": {
            boxShadow: 5
        }
    },
    item: {
        marginTop: theme.spacing(1)
    }
});

const icons = {
    Add,
    FirstPage,
    LastPage,
    NextPage: ChevronRight,
    PreviousPage: ChevronLeft,
    ThirdStateCheck: Remove,
    DetailPanel: ChevronRight,
    SortArrow: ArrowUpward,
    Check,
    Search,
    ResetSearch: Clear
};

class Subsystem extends Component {

    constructor() {
        super()
        this.state = {
            dialogOpen: false,
            actionTitle: "",
            actionOpen: false,
            actionMsg: "",
            actionType: "confirm",
            confirmAction: () => { }
        };
        this.openCreateSubsystemDialog = this.openCreateSubsystemDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
        this.openAction = this.openAction.bind(this);
        this.closeAction = this.closeAction.bind(this);
    }

    componentDidMount() {
        this.props.Get_Subsystems();
    }

    closeDialog() {
        this.setState({
            dialogOpen: false
        });
    }

    openCreateSubsystemDialog() {
        this.setState({
            dialogOpen: true
        });
    }

    closeAlert() {
        this.props.Close_Alert();
        this.setState({
            actionOpen: false,
            dialogOpen: this.props.errorCode ?
                this.state.dialogOpen : false
        });
    }

    closeAction() {
        this.setState({
            actionOpen: false
        });
    }

    openAction(title, message, callback) {
        this.setState({
            actionMsg: message,
            actionTitle: title,
            actionOpen: true,
            confirmAction: callback
        });
    }

    render() {
        const subsystemTableColumns = [{
            title: "SUBNQN",
            field: "subnqn"
        }, {
            title: "Subtype",
            field: "subtype"
        }, {
            title: "Array",
            field: "array"
        }, {
            title: "Actions",
            render: (rowData) => (
                <Tooltip title="Delete Subsystem">
                    <IconButton
                        onClick={() => {
                            this.openAction("Delete Subsystem",
                                `Are you sure you want to delete the subsystem ${rowData.subnqn}`,
                                () => this.props.Delete_Subsystem({ name: rowData.subnqn }))
                        }}
                    >
                        <Delete />
                    </IconButton>
                </Tooltip>
            )
        }];
        const { classes } = this.props;
        return (
            <Grid container direction="column">
                <Grid item className={classes.item}>
                    <ThemeProvider theme={TableTheme}>
                        <MaterialTable
                            title={(
                                <Typography className={classes.cardHeader}>Subsystems</Typography>
                            )}
                            actions={[{
                                icon: Add,
                                tooltip: "Add a Subsystem",
                                isFreeAction: true,
                                iconProps:{
                                    'data-testid': "add-subsystem"
                                },
                                onClick: () => {
                                    this.openCreateSubsystemDialog();
                                }
                            }]}
                            detailPanel={[{
                                tooltip: "Show Subsystem Details",
                                render: rowData => (
                                    <SubsystemDetails
                                        data={rowData}
                                    />
                                )
                            }]}
                            data={this.props.subsystems}
                            options={{
                                headerStyle: customTheme.table.header
                            }}
                            columns={subsystemTableColumns}
                            icons={icons}
                        />
                    </ThemeProvider>
                </Grid>
                <Popup
                    title="Create Subsystem"
                    open={this.state.dialogOpen}
                    close={this.closeDialog}
                >
                    <CreateSubsystem createSubsystem={this.props.Create_Subsystem} confirmAction={this.openAction} />
                </Popup>
                <AlertDialog
                    title={this.state.actionTitle}
                    description={this.state.actionMsg}
                    open={this.state.actionOpen}
                    type={this.state.actionType}
                    onConfirm={this.state.confirmAction}
                    handleClose={this.closeAction}
                />
                <AlertDialog
                    title={this.props.alertTitle}
                    description={this.props.errorMsg}
                    open={this.props.alertOpen}
                    type={this.props.alertType}
                    link={this.props.alertLink}
                    linkText={this.props.alertLinkText}
                    onConfirm={this.closeAlert}
                    handleClose={this.closeAlert}
                    errCode={this.props.errorCode}
                />
                {this.props.loading ?
                    <MToolLoader text={this.props.loadText} /> : null}
            </Grid>
        );
    }
}
const mapStateToProps = (state) => ({
    loading: state.waitLoaderReducer.loading,
    loadText: state.waitLoaderReducer.loadText,
    subsystems: state.subsystemReducer.subsystems,
    alertTitle: state.subsystemReducer.alert.title,
    alertOpen: state.subsystemReducer.alert.open,
    alertType: state.subsystemReducer.alert.type,
    errorMsg: state.subsystemReducer.alert.msg,
    errorCode: state.subsystemReducer.alert.code,
});

const mapDispatchToProps = (dispatch) => ({
    Get_Subsystems: () =>
        dispatch({ type: actionTypes.SAGA_FETCH_SUBSYSTEMS }),
    Create_Subsystem: (payload) =>
        dispatch({ type: actionTypes.SAGA_CREATE_SUBSYSTEM, payload }),
    Delete_Subsystem: (payload) =>
        dispatch({ type: actionTypes.SAGA_DELETE_SUBSYSTEM, payload }),
    Close_Alert: () =>
        dispatch({ type: actionTypes.CLOSE_SUBSYSTEM_ALERT })
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Subsystem));
