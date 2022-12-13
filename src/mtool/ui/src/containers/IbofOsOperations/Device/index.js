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
import CreateDisk from '../../../components/CreateDisk';
import Popup from '../../../components/Popup';
import * as actionTypes from "../../../store/actions/actionTypes";
import MToolLoader from '../../../components/MToolLoader';
import AlertDialog from '../../../components/Dialog';

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

class Device extends Component {

    constructor() {
        super()
        this.state = {
            dialogOpen: false
        };
        this.openCreateDiskDialog = this.openCreateDiskDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }

    componentDidMount() {
        this.props.Get_Devices();
    }

    closeDialog() {
        this.setState({
            dialogOpen: false
        });
    }

    openCreateDiskDialog() {
        this.setState({
            dialogOpen: true
        });
    }

    render() {
        const deviceTableColumns = [{
            title: "Device Name",
            field: "name"
        }, {
            title: "Array",
            field: "arrayName"
        }];
        const { classes } = this.props;
        return (
            <Grid container direction="column">
                <Grid item className={classes.item}>
                    <ThemeProvider theme={TableTheme}>
                        <MaterialTable
                            title={(
                                <Typography className={classes.cardHeader}>Device List</Typography>
                            )}
                            actions={[{
                                icon: Add,
                                tooltip: "Add a device",
                                isFreeAction: true,
                                onClick: () => {
                                    this.openCreateDiskDialog();
                                }
                            }]}
                            data={this.props.devices}
                            options={{
                                headerStyle: {
                                    backgroundColor: "#788595",
                                    color: "#FFF",
                                }
                            }}
                            columns={deviceTableColumns}
                            icons={icons}
                        />
                    </ThemeProvider>
                </Grid>
                {/* <Grid item className={classes.item}>
                    <Paper>
                        <CreateDisk />
                    </Paper>
                </Grid> */}

                <Popup
                    title="Create Disk"
                    open={this.state.dialogOpen}
                    close={this.closeDialog}
                >
                    <CreateDisk
                        cleanup={this.closeDialog}
                    />
                </Popup>
                {this.props.loading ? <MToolLoader text={this.props.loadText} /> : null}
                <AlertDialog
                    title={this.props.alertTitle}
                    description={this.props.errorMsg}
                    open={this.props.alertOpen}
                    type={this.props.alertType}
                    errCode={this.props.errorCode}
                    onConfirm={this.props.Close_Alert}
                    handleClose={this.props.Close_Alert}
                />
            </Grid>
        );
    }
}
const mapStateToProps = (state) => ({
    loading: state.storageReducer.loading,
    loadText: state.storageReducer.loadText,
    devices: state.storageReducer.metadisks,
    alertOpen: state.storageReducer.alertOpen,
    alertType: state.storageReducer.alertType,
    alertTitle: state.storageReducer.alertTitle,
    errorMsg: state.storageReducer.errorMsg,
    errorCode: state.storageReducer.errorCode,
});

const mapDispatchToProps = (dispatch) => ({
    Get_Devices: (payload) =>
        dispatch({ type: actionTypes.SAGA_FETCH_DEVICE_INFO, payload }),
    Close_Alert: () => dispatch({ type: actionTypes.STORAGE_CLOSE_ALERT })
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Device));
