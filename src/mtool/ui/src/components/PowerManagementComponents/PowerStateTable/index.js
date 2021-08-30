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
import { connect } from 'react-redux';
import MaterialTable,{MTableEditField} from 'material-table';
import { Paper, RadioGroup, Radio, FormControlLabel, Typography } from '@material-ui/core';
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
import * as actionCreators from "../../../store/actions/exportActionCreators";

const styles = theme => ({
    multilineColor: {
        color: 'black'
    },
    root: {
        flexGrow: 1,
    },

    Paper: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        width: '100%',
        maxHeight: '100%',
    },
    powerParentGrid: {
        maxWidth: '100%',
        flexBasis: '100%',
        minHeight: '100%',
        marginTop: theme.spacing(2)
    },

    powerOuterGrid: {
        border: '1px solid gray',
        maxWidth: '100%',
        flexBasis: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        background: '#fff',
    },
    summaryOuterGrid: {
        border: '1px solid gray',
        maxWidth: '100%',
        minHeight: '140px',
        maxHeight: '150px',
        overflowY: 'auto',
        overflowX: 'hidden',
        justifyContent: 'left',
        background: '#fff'
    },

    summaryInfoHeader: {
        textAlign: 'left',
        color: 'rgba(255, 255, 255, 0.87)',
        fontSize: 14,
        borderRadius: '0px',
        width: '100%',
        marginLeft: '10px',
        lineHeight: '2',
    },

    summaryCard: {
        backgroundColor: '#788595',
        justifyContent: 'center',
        maxWidth: '100%',
        maxHeight: '30px',
        flexBasis: '100%'
    },
    ToggleCard: {
        margin: theme.spacing(2),
        maxWidth: '100%',
        flexBasis: '100%',
    },
    textField: {
        color: "black",
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        width: 300,
    },
    radioGroup: {
        display: 'flex',
        flexDirection: 'row',
        textAlign: 'center',
        marginTop: theme.spacing(1)
    },

});


class PowerStateTable extends Component {
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
        this.interval = null;
        this.state = {
            columns: [
                {
                    title: 'Drive Name',
                    field: 'driveName',
                    editable: 'never',
                    cellStyle: {
                        fontFamily: 'Arial',
                        fontSize: 12,
                    },
                    render: rowData =>
                        (
                            <p>{`nvme${ rowData.tableData.id}`}</p>
                        ),
                },
                {
                    title: 'Drive Status',
                    field: 'Status.Health',
                    editable: 'never',
                    cellStyle: {
                        fontFamily: 'Arial',
                        fontSize: 12,
                    },
                    render: rowData =>
                        (
                            <img alt="" src={(rowData.Status && rowData.Status.Health === 'OK') ? HealthOKIcon : HealthNotOKIcon} />
                        ),
                },
                {
                    title: 'Min Power State Value',
                    field: 'MinPowerState',
                    editable: 'never',
                    cellStyle: {
                        fontFamily: 'Arial',
                        fontSize: 12,
                    },
                },
                {
                    title: 'Max Power State Value',
                    field: 'MaxPowerState',
                    editable: 'never',
                    cellStyle: {
                        fontFamily: 'Arial',
                        fontSize: 12,
                    },
                },
                {
                    title: 'Current Power State',
                    field: 'PowerState',
                    cellStyle: {
                        fontFamily: 'Arial',
                        fontSize: 12,
                    },
                },
            ],
        };
    }

    componentDidMount() {
        this.props.fetchChassisFrontInfo();
        this.interval = setInterval(() => {
            this.props.fetchChassisFrontInfo();
          },5000);
    }

    componentWillUnmount(){
        clearInterval(this.interval);
    }

    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.Paper}>
                <Grid sm={6} xs={12} item container className={classes.powerParentGrid}>
                    <Grid xs={12} item className={classes.powerOuterGrid}>
                        <Grid className={classes.summaryCard}>
                            <Typography className={classes.summaryInfoHeader}>
                                Power Mode
                            </Typography>
                        </Grid>
                        <Grid className={classes.ToggleCard}>
                            <span>Select Power Mode: </span>
                            <RadioGroup
                                className={classes.radioGroup}
                                name = "powermode"
                                // value = {this.props.powermode}
                                onChange={(event) => { this.props.handleChange(event) }}
                                // onChange={(event) => { this.props.setCurrentPowerMode({"newpowermode":event.target.value}); }}
                            >
                                <FormControlLabel
                                    value="Manual"
                                    checked={this.props.powermode === "Manual"}
                                    control={<Radio inputProps={{"data-testid": "radio-btn-manual"}} />}
                                    label="Manual"
                                />
                                <FormControlLabel
                                    value="Power Efficient"
                                    checked={this.props.powermode === "Power Efficient"}
                                    control={<Radio inputProps={{"data-testid": "radio-btn-powerefficient"}} />}
                                    label="Power Efficient"
                                />

                                <FormControlLabel
                                    value="Performance"
                                    checked={this.props.powermode === "Performance"}
                                    control={<Radio inputProps={{"data-testid": "radio-btn-performance"}} />}
                                    label="Performance"
                                />
                            </RadioGroup>
                        </Grid>
                    </Grid>
                </Grid>
                {this.props.powermode === "Manual" ?
                    (
                        <Grid sm={6} xs={12} item container className={classes.powerParentGrid}>
                            <Grid xs={12} item className={classes.powerOuterGrid}>

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
                                        components={{
                                            EditField: fieldProps => {
                                                clearInterval(this.interval);
                                                if (fieldProps.columnDef.required && fieldProps.value.length === 0) {
                                                    /* Ignore props spreading check, as it is used by material-table */
                                                    /* eslint-disable-next-line react/jsx-props-no-spreading */
                                                    return (<MTableEditField {...fieldProps} error label="Required" />);
                                                }
                                                /* Ignore props spreading check, as it is used by material-table */
                                                /* eslint-disable-next-line react/jsx-props-no-spreading */
                                                return (<MTableEditField {...fieldProps} />);
                                            }
                                        }}
                                        editable={{
                                            onRowUpdate: (newData, oldData) =>
                                                new Promise((resolve) => {
                                                    clearInterval(this.interval);
                                                    clearInterval(this.interval);
                                                    if (newData.PowerState < oldData.MinPowerState || newData.PowerState > oldData.MaxPowerState) {
                                                        this.props.openAlertBox({
                                                            alertOpen: true,
                                                            istypealert: true,
                                                            alerttype: 'alert',
                                                            alerttitle: 'Change Power State',
                                                            alertdescription: 'Power State Value is out of range',
                                                        });
                                                        this.interval = setInterval(() => {
                                                            this.props.fetchChassisFrontInfo();
                                                        }, 5000);
                                                    }
                                                    else if (newData.PowerState === oldData.PowerState) {
                                                        this.props.openAlertBox({
                                                            alertOpen: true,
                                                            istypealert: true,
                                                            alerttype: 'info',
                                                            alerttitle: 'Change Power State',
                                                            alertdescription: `Already in Power State ${ oldData.PowerState}`,
                                                        });
                                                    }
                                                    else {
                                                        this.props.changeCurrentPowerState(newData);
                                                        /* const intervalAlert = setInterval(() => {
                                                            if (this.props.alertStatus === true) {
                                                                clearInterval(intervalAlert);
                                                            }
                                                        }, 1000); */
                                                    }
                                                    this.interval = setInterval(() => {
                                                        this.props.fetchChassisFrontInfo();
                                                    }, 5000);
                                                    resolve();        
                                                }),
                                        }}
                                        columns={this.state.columns}
                                        data={this.props.chassis_front_list} 
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
                                            maxBodyHeight: '260px',
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
                    )
                    : null}

            </Paper>
        );
    }
}


const mapStateToProps = state => {
    return {
        chassis_front_list: state.hardwareOverviewReducer.chassis_front_list,
        currentpowermode:state.hardwarePowerManagementReducer.currentpowermode, 
        alertStatus: state.alertManagementReducer.alertOpen
    };
}

const mapDispatchToProps = dispatch => {
    return {
        // setCurrentPowerMode:(param) => dispatch({ type: actionTypes.SAGA_HARDWARE_POWER_MANAGEMENT_SET_CURRENT_POWER_MODE,param }),
        changeCurrentPowerState:(param) => dispatch({ type: actionTypes.SAGA_HARDWARE_POWER_MANAGEMENT_CHANGE_CURRENT_POWER_STATE,param }),
        openAlertBox: (alertParam) => dispatch(actionCreators.openAlertBox(alertParam)),
        fetchChassisFrontInfo: (param) => dispatch({ type: actionTypes.SAGA_HARDWARE_OVERVIEW_FETCH_CHASSIS_FRONT_INFORMATION, param }),
    };
}

export default withStyles(styles)((connect(mapStateToProps, mapDispatchToProps))(((PowerStateTable))));
