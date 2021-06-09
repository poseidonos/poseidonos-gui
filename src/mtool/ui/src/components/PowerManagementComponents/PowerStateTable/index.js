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

DESCRIPTION: Power State Table Component
@NAME : index.js
@AUTHORS: Jay Hitesh Sanghavi
@Version : 1.0 
@REVISION HISTORY
[03/11/2019] [Jay] : Prototyping..........////////////////////
*/

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import MaterialTable,{MTableEditField} from 'material-table';
import { Paper , createMuiTheme, RadioGroup, Radio, FormControlLabel, Typography } from '@material-ui/core';
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
        fontSize: '14px',
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
        this.interval = null;
        this.state = {
            columns: [
                {
                    title: 'Drive Name',
                    field: 'driveName',
                    editable: 'never',
                    cellStyle: {
                        fontFamily: 'Arial',
                        fontSize: '12px',
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
                        fontSize: '12px',
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
                        fontSize: '12px',
                    },
                },
                {
                    title: 'Max Power State Value',
                    field: 'MaxPowerState',
                    editable: 'never',
                    cellStyle: {
                        fontFamily: 'Arial',
                        fontSize: '12px',
                    },
                },
                {
                    title: 'Current Power State',
                    field: 'PowerState',
                    cellStyle: {
                        fontFamily: 'Arial',
                        fontSize: '12px',
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
