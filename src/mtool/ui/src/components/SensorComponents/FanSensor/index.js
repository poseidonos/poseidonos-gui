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
import MaterialTable from 'material-table';
import { Paper, InputLabel } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

import { createTheme, withStyles, MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles';
import Search from '@material-ui/icons/Search';
import SaveAlt from '@material-ui/icons/SaveAlt';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Add from '@material-ui/icons/Add';
import Check from '@material-ui/icons/Check';
import FilterList from '@material-ui/icons/FilterList';
import Remove from '@material-ui/icons/Remove';
import EditIcon from '@material-ui/icons/Edit';
import TrashIcon from '@material-ui/icons/Delete';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Clear from '@material-ui/icons/Clear';
import HealthOKIcon from '../../../assets/images/Ok14x14.png'
import HealthNotOKIcon from '../../../assets/images/Not-Ok14x14.png'
import * as actionTypes from '../../../store/actions/actionTypes';

const styles = theme => ({
    multilineColor: {
        color: 'black'
    },
    root: {
        flexGrow: 1,
    },

    Paper: {
        marginTop: theme.spacing(2),
        width: '100%',
        maxHeight: '100%'
    },
    fanParentGrid: {
        maxWidth: '100%',
        flexBasis: '100%',
        minHeight: '100%'
    },

    fanOuterGrid: {
        border: '1px solid gray',
        maxWidth: '100%',
        flexBasis: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        background: '#fff',
    },
});


class FanSensor extends Component {
    constructor(props) {
        super(props);
        this.theme = createTheme({
            overrides: {
                MuiSvgIcon: {
                    //  stylesheet name
                    root: {
                        //  rule name
                        color: '#808080',
                    },
                },
                MuiTablePagination: {
                    menuItem: {
                        fontSize: 12,
                        minHeight: "0px"
                    },
                    select: {
                        width: "45px"
                    },
                    toolbar: {
                        maxHeight: '50px',
                        minHeight: '20px'
                    },
                },
            },

            palette: {
                primary: {
                    main: '#4caf50',
                },
                secondary: {
                    main: '#808080',
                },
            },

        });

        this.state = {
            columns: [
                {
                    title: 'Name',
                    field: 'Name',
                    cellStyle: {
                        fontFamily: 'Arial',
                        fontSize: 12,
                    },
                },
                {
                    title: 'Health',
                    field: 'Status.Health',
                    cellStyle: {
                        fontFamily: 'Arial',
                        fontSize: 12,
                    },
                    render: rowData =>
                    (
                        <img src={rowData.Status.Health === 'OK' ? HealthOKIcon : HealthNotOKIcon} alt={rowData.Status.Health === 'OK' ? "Sit and Relax" : 'Mayday'} />
                    ), 
                },
                {
                    title: 'Speed',
                    field: 'Reading',
                    cellStyle: {
                        fontFamily: 'Arial',
                        fontSize: 12,
                    },
                    render: rowData =>
                    (
                      <InputLabel> {`${rowData.Reading } ${ rowData.ReadingUnits}`}</InputLabel>
                    ),  
                },
            ],
        };
    }

    componentDidMount() {
        this.props.fetchFanSensorInfo();
    }

    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.Paper}>
                <Grid sm={6} xs={12} item container className={classes.fanParentGrid}>
                    <Grid xs={12} item className={classes.fanOuterGrid}>
                        <ThemeProvider theme={this.theme}>
                            <MaterialTable
                                icons={{
                                    Check,
                                    FirstPage,
                                    LastPage,
                                    NextPage: ChevronRight,
                                    PreviousPage: ChevronLeft,
                                    Search,
                                    ThirdStateCheck: Remove,
                                    DetailPanel: ChevronRight,
                                    Export: SaveAlt,
                                    Filter: FilterList,
                                    Add,
                                    Edit: EditIcon,
                                    Delete: TrashIcon,
                                    SortArrow: ArrowUpward,
                                    Clear,
                                }}
                                columns={this.state.columns}
                                data={this.props.fan_sensor_info}
                                options={{
                                    actionsColumnIndex: -1,
                                    selection: false,
                                    sorting: true,
                                    toolbar: false,
                                    rowStyle: {
                                        fontSize: 4,
                                    },
                                    search: false,
                                    paginationType: 'normal',
                                    loadingType: 'linear',
                                    maxBodyHeight: '500px',
                                    headerStyle: {
                                        backgroundColor: '#788595',
                                        color: 'rgba(255, 255, 255, 0.87)',
                                        fontSize: 14,
                                        height: '10%',
                                        paddingTop: '2px',
                                        paddingBottom: '2px',
                                    },
                                }}

                            />
                        </ThemeProvider>
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}


const mapStateToProps = state => {
    return {
        fan_sensor_info: state.hardwareSensorReducer.fan_sensor_info,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        fetchFanSensorInfo: () => dispatch({ type: actionTypes.SAGA_HARDWARE_SENSORS_FETCH_FAN_SENSOR_INFORMATION, }),
    };
}

export default withStyles(styles)((connect(mapStateToProps, mapDispatchToProps))(((FanSensor))));