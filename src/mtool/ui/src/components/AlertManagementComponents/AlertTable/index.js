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

/* eslint-disable no-nested-ternary */

import React, { Component } from 'react';
import MaterialTable from 'material-table';
import { createTheme, withStyles, MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles';
import { Grid, Switch, Select, MenuItem } from '@material-ui/core';
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
      fontSize: 16,
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
    this.theme = createTheme({
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
       /* istanbul ignore next */
			((this.props.alerts && this.props.alerts[rowData.tableData.id]) ? this.props.alerts[rowData.tableData.id].alertCondition : 'This is NULL') : /* istanbul ignore next */ 'This is NULL'
                }
              >
                {this.props.dropdownCondition ? this.props.dropdownCondition.map((eachValue) => {
                  return (<MenuItem key={eachValue} value={eachValue} data-testid="SelectEditMenuItemTag">{eachValue}</MenuItem>)
                }) : /* istanbul ignore next */ null}
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
                }) : /* istanbul ignore next */ null}
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

  
    // this method is considered legacy and should be avoided in new code
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
                     
                      
                      // istanbul ignore else
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
