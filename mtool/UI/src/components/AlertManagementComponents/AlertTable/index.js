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


DESCRIPTION: Alert Management Component for displaying Alert Rule/Name Information in the table. (Top Portion)
@NAME : index.js
@AUTHORS: Jay Hitesh Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
*/

/* eslint-disable no-nested-ternary */

import React, { Component } from 'react';
import MaterialTable from 'material-table';
import ThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Switch, createMuiTheme, Select, MenuItem } from '@material-ui/core';
import { Add, ArrowUpward, Check, ChevronLeft, ChevronRight, Clear, Edit, FilterList, FirstPage, LastPage, Remove, SaveAlt, Search } from '@material-ui/icons';
import TrashIcon from "@material-ui/icons/Delete"
import AlertDialog from '../../Dialog';
import './AlertTable.css';
import { customTheme } from '../../../theme';

const styles = (theme) => {
  return ({
    titleContainer: {
      marginTop: "-5px",
      maxWidth: '100%',
      flexBasis: '100%',
    },
    pageHeader: {
      textAlign: 'left',
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#424850',
      marginBottom: theme.spacing(1),
    },
    tableContainer: {
      maxWidth: '100%',
      flexBasis: '100%',
    },
  })
};

let alertsData = [];
class AlertTable extends Component {
  constructor(props) {
    super(props);
    this.theme = createMuiTheme({
      typography: {
        fontSize: 12,
        fontFamily: 'Arial'
      },
      palette: {
        primary: {
          main: '#4caf50',
        },
        secondary: {
          main: '#ff9100',
        },
      },
    });

    this.state = {
      data:[],
      alertConditionValue: "",
      columns: [
        {
          title: 'Alert Name',
          field: 'alertName',
          editable: 'never',
          cellStyle: {
            minWidth:'14.28%',
            maxWidth:'14.28%',
            width:'14.28%'
          },
        },
        {
          title: 'Alert Type',
          field: 'alertCluster',
          editable: 'never',
          cellStyle: {
            minWidth:'14.28%',
            maxWidth:'14.28%',
            width:'14.28%'
          },
        },
        {
          title: 'Alert Condition',
          field: 'alertCondition',
          cellStyle: {
            minWidth:'14.28%',
            maxWidth:'14.28%',
            width:'14.28%'
          },
          render: rowData =>
            (
              <Select
              SelectDisplayProps={{'data-testid':"SelectEditTag"}}
                disabled
                value={((rowData) && (rowData.tableData) && (rowData.tableData.id !== null)) ?
			((this.props.alerts && this.props.alerts[rowData.tableData.id]) ? this.props.alerts[rowData.tableData.id].alertCondition : 'This is NULL') : 'This is NULL'
                }
              >
                {this.props.dropdownCondition ? this.props.dropdownCondition.map((eachValue) => {
                  return (<MenuItem key={eachValue} value={eachValue} data-testid="SelectEditMenuItemTag">{eachValue}</MenuItem>)
                }) : null}
              </Select>
            )
          ,

          editComponent: row =>
            (
              <Select
              SelectDisplayProps={{'data-testid':"SelectEditTag"}}
                onChange={(event) => {
                  alertsData = [...this.props.alerts];
                  alertsData[row.rowData.tableData.id].alertCondition = event.target.value;
                  row.rowData.alertCondition = event.target.value;
                  // this.props.updateAlertsState(alertsData);
                  this.setState({
                    ...this.state,
                    rowid: row.rowData.tableData.id,
                    alertConditionValue: event.target.value
                  });
                }
                }
                value={((row) && (row.rowData) && (row.rowData.tableData) && (row.rowData.tableData.id !== null)) ?
                  this.props.alerts[row.rowData.tableData.id].alertCondition : 'asd'
                }
              >
                {this.props.dropdownCondition ? this.props.dropdownCondition.map((eachValue) => {
                  return (<MenuItem key={eachValue} value={eachValue} data-testid="SelectEditMenuItemTag">{eachValue}</MenuItem>)
                }) : null}
              </Select>
            )
        },
        {
          title: 'Alert Value',
          field: 'alertRange',
          type: 'numeric',
          headerStyle: {
            textAlign: 'left'
          },
          cellStyle: {
            textAlign: 'left',
            minWidth:'14.28%',
            maxWidth:'14.28%',
            width:'14.28%'
          }
        },
        {
          title: 'Active/Inactive',
          field: 'active',
          editable: 'never',
          cellStyle: {
            minWidth:'14.28%',
            maxWidth:'14.28%',
            width:'14.28%'
          },
          render: row =>
            (
              <Switch
              data-testid="SwitchTag"
                disabled={(row && row.tableData && row.tableData.editing === 'update')}
                size="small"
                checked={row.active}
                onChange={() => this.props.togglealertstatus(row.tableData.id)}
                color="primary"
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            )
        },
        {
          title: 'Alert Description',
          field: 'description',
          cellStyle: {
            minWidth:'14.28%',
            maxWidth:'14.28%',
            width:'14.28%'
          },
        },
      ]
    }
  }

   // eslint-disable-next-line camelcase
   UNSAFE_componentWillReceiveProps(newProps) {
    this.setState({ data: newProps.alerts });
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid item data-testid="AlertsTableTag" container sm={6} xs={12} className={classes.titleContainer}>
        <Grid sm={6} xs={12} item className={classes.tableContainer}>
          <ThemeProvider theme={this.theme}>
            <MaterialTable
              style={{ flexBasis: '100%', }}
              editable={{
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve) => {
                    setTimeout(() => {
                      {
                      const { data } = this.state;
                      const index = data.indexOf(oldData);
                      data[index] = newData;
                     
                      
                      
                      if (this.state.alertConditionValue === "")
                        newData.alertCondition = oldData.alertCondition;
                      else newData.alertCondition = this.state.alertConditionValue
                      this.props.saveChange(newData);
                      this.setState({ data }, () => resolve());
                      this.setState({
                        ...this.state,
                        alertConditionValue: "",
                      })
                    }
                      resolve();
                    }, 1000);
                  }),
                onRowDelete: oldData =>
                  new Promise((resolve) => {
                    setTimeout(() => {
                      {
                        const event = { target: { checked: true } }
                        this.props.selectalerts(event, oldData.tableData.id)
                        this.props.deletealerts();
                      }
                      resolve();
                    }, 1000);
                  })
              }}

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
                Edit,
                Delete: TrashIcon,
                SortArrow: ArrowUpward,
                Clear,
              }}
              columns={this.state.columns}
              // data={this.props.alerts}
              data = {this.state.data}
              options={{
                headerStyle: customTheme.table.header,
                actionsColumnIndex: -1,
                selection: false,
                sorting: true,
                toolbar: false,
                loadingType: "linear",
               // maxBodyHeight: '200px'
              }}

            />
            <AlertDialog
              title={this.props.alerttitle}
              type=""
              description={this.props.alertdescription}
              open={this.props.alertOpen}
              handleClose={this.props.handleAlertClose}
              onConfirm={this.props.triggerCommand}
            />
          </ThemeProvider>
        </Grid>
      </Grid>
    );
  }
};

export default withStyles(styles)(AlertTable);
