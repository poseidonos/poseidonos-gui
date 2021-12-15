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
import { Grid, ThemeProvider, Typography, withStyles } from '@material-ui/core';
import MaterialTable from 'material-table';
import { Add, Check, Clear, FirstPage, LastPage, Search, ChevronRight, ChevronLeft, Remove, ArrowUpward } from '@material-ui/icons';
import { connect } from 'react-redux';
import { customTheme, TableTheme } from '../../../theme';
import Popup from '../../../components/Popup';
import * as actionTypes from "../../../store/actions/actionTypes";
import MToolLoader from '../../../components/MToolLoader';
import CreateSubsystem from '../../../components/CreateSubsystem';
import AlertDialog from "../../../components/Dialog";

const styles = (theme) => ({
    cardHeader: {
        ...customTheme.card.header,
        marginLeft: 0
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
            dialogOpen: false
        };
        this.openCreateSubsystemDialog = this.openCreateSubsystemDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
	this.closeAlert = this.closeAlert.bind(this);
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
    }
    
    openConfirmation(callback) {
	this.setState({
		alertopen: true
	});
    }

    render() {
        const subsystemTableColumns = [{
            title: "NQN",
            field: "nqn"
        }, {
            title: "Subtype",
            field: "subtype"
        }, {
	    title: "Serial No",
	    field: "serial_number"
	}, {
	    title: "Model No",
	    field: "model_number"
	}, {
	    title: "Array",
	    field: "array"
	}, {
	    title: "Allow Any Host",
	    render: (rowData) => rowData.allow_any_host === 1 ? "Yes" : "No"
	}, {
	    title: "Actions",
	    render: (rowData) => (
		    <button onClick={() => this.props.Delete_Subsystem({name: rowData.nqn})}>Delete</button>
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
                                onClick: () => {
                                    this.openCreateSubsystemDialog();
                                }
                            }]}
		            detailPanel={
				    rowData => (
					    <div>
					    {rowData.listen_addresses && rowData.listen_addresses.map(address => (
						    <div>{address.target_address}</div>
					    ))}
					    {rowData.namespaces && rowData.namespaces.map(ns => (
                                                    <div>{ns.bdev_name}</div>
                                            ))}
					    <div>{rowData.max_namespaces}</div>
					    </div>
				    )
			    }
                            data={this.props.subsystems}
                            options={{
                                headerStyle: {
                                    backgroundColor: "#788595",
                                    color: "#FFF",
                                }
                            }}
                            columns={subsystemTableColumns}
                            icons={icons}
                        />
                    </ThemeProvider>
                </Grid>
                {/* <Grid item className={classes.item}>
                    <Paper>
                        <CreateSubsystem />
                    </Paper>
                        </Grid> */}
                <Popup
                    title="Create Subsystem"
                    open={this.state.dialogOpen}
                    close={this.closeDialog}
                >
                    <CreateSubsystem createSubsystem={this.props.Create_Subsystem}/>
                </Popup>
		{/*<AlertDialog
                  title={this.state.alertTitle}
                  description={this.state.errorMsg}
                  open={this.state.alertOpen}
                  type={this.state.alertType}
                  onConfirm={this.alertConfirm}
                  handleClose={this.alertClose}
                  errCode={this.state.errorCode}
                />*/}
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
    loadText:state.waitLoaderReducer.loadText,
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
	dispatch({ type: actionTypes.SAGA_CREATE_SUBSYSTEM, payload}),
    Delete_Subsystem: (payload) =>
	dispatch({ type: actionTypes.SAGA_DELETE_SUBSYSTEM, payload}),
    Close_Alert: () =>
	dispatch({ type: actionTypes.CLOSE_SUBSYSTEM_ALERT })
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Subsystem));
