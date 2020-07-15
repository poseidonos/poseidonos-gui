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

DESCRIPTION: Drives Page Drive Component
@NAME : index.js
@AUTHORS: Jay Hitesh Sanghavi
@Version : 1.0 
@REVISION HISTORY
[03/11/2019] [Jay] : Prototyping..........////////////////////
*/

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import { Paper, Switch , createMuiTheme, } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

import ThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
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
import Health_OK_Icon from '../../../assets/images/Ok14x14.png'
import Health_NOT_OK_Icon from '../../../assets/images/Not-Ok14x14.png'
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
    powerParentGrid: {
        maxWidth: '100%',
        flexBasis: '100%',
        minHeight: '100%'
    },

    powerOuterGrid: {
        border: '1px solid gray',
        maxWidth: '100%',
        flexBasis: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        background: '#fff',
    },
});


class DriveTable extends Component {
    constructor(props) {
        super(props);
        this.theme = createMuiTheme({
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
                        fontSize: "12px",
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
                    title: 'Slot Number',
                    field: 'SlotNumber',
                    cellStyle: {
                        fontFamily: 'Arial',
                        fontSize: '12px',
                    },
                    render: rowData =>
                    (
                       <p>{rowData.SlotNumber? rowData.SlotNumber : 'NA'}</p>
                    ), 
                },
                {
                    title: 'Health',
                    field: 'Status.Health',
                    cellStyle: {
                        fontFamily: 'Arial',
                        fontSize: '12px',
                    },
                    render: rowData =>
                    (
                       <img src={(rowData.Status && rowData.Status.Health === 'OK') ? Health_OK_Icon : Health_NOT_OK_Icon} />
                    ), 
                },
                {
                    title: 'Serial Number',
                    field: 'SerialNumber',
                    cellStyle: {
                        fontFamily: 'Arial',
                        fontSize: '12px',
                    },
                    render: rowData =>
                    (
                       <p>{rowData.SerialNumber !== '' ? rowData.SerialNumber : 'NA'}</p>
                    ), 
                },
                {
                    title: 'Firmware',
                    field: 'Firmware',
                    cellStyle: {
                        fontFamily: 'Arial',
                        fontSize: '12px',
                    },
                    render: rowData =>
                    (
                       <p>{rowData.Firmware ? rowData.Firmware : 'NA'}</p>
                    ), 
                },
                {
                    title: 'State',
                    field: 'State',
                    cellStyle: {
                        fontFamily: 'Arial',
                        fontSize: '12px',
                    },
                    render: rowData =>
                    (
                       <p>{rowData.State ? rowData.State : 'NA'}</p>
                    ), 
                },
                {
                    title: 'Raw Capacity',
                    field: 'RawCapacity',
                    cellStyle: {
                        fontFamily: 'Arial',
                        fontSize: '12px',
                    },
                    render: rowData =>
                    (
                       <p>{rowData.Capacity ? rowData.Capacity : 'NA'}</p>
                    ), 
                },
                {
                    title: 'LED',
                    field: 'active',
                    cellStyle: {
                        fontFamily: 'Arial',
                        fontSize: '12px',
                    },
                    render: rowData =>
                    (
                        <Switch
                          size="small"
                          checked={rowData.active}
                          onChange={() => console.log("Switch")} // this.props.togglealertstatus(row.tableData.id)}
                          color="primary"
                          inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                    ), 
                },
            ],
        };
    }

    componentDidMount() {
    }

    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.Paper}>
                <Grid sm={6} xs={12} item container className={classes.powerParentGrid}>
                    <Grid xs={12} item className={classes.powerOuterGrid} data-testid="DriveTable-table">
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
                                data={this.props.chassis_front_list}
                                options={{
                                    actionsColumnIndex: -1,
                                    selection: false,
                                    sorting: true,
                                    toolbar: false,
                                    rowStyle: {
                                        fontSize: '4px',
                                    },
                                    search: false,
                                    paginationType: 'normal',
                                    loadingType: 'linear',
                                    maxBodyHeight: '260px',
                                    headerStyle: {
                                        backgroundColor: '#788595',
                                        color: 'rgba(255, 255, 255, 0.87)',
                                        fontSize: '14px',
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
        chassis_front_list: state.hardwareOverviewReducer.chassis_front_list,
    };
}


export default withStyles(styles)((connect(mapStateToProps))(((DriveTable))));