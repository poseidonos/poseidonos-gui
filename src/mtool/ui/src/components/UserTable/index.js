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
import MaterialTable from 'material-table';
import ThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { withStyles } from '@material-ui/core/styles';
import MuiPhoneNumber from 'material-ui-phone-number';
import { Grid, Typography, createMuiTheme, } from '@material-ui/core';
import { Add, ArrowUpward, Check, ChevronLeft, ChevronRight, Clear, Edit, FilterList, FirstPage, LastPage, Remove, SaveAlt, Search } from '@material-ui/icons';
import TrashIcon from "@material-ui/icons/Delete"
import './UserTable.css';
import { customTheme } from "../../theme";

const styles = (theme) => {
  return ({
    titleContainer: {
      maxWidth: '100%',
      flexBasis: '100%',
    },
    pageHeader: {
      textAlign: 'left',
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#424850',
      marginBottom: theme.spacing(1)
    },
    userListTypography: {
      textAlign: 'left',
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#424850',
      margin: theme.spacing(1.5),
    },
    tableContainer: {
      maxWidth: '100%',
      flexBasis: '100%'
    },
    userListGrid: {
      background: 'white',
      fontSize: '14px',
      maxWidth: '100%',
      flexBasis: '100%',
      border: '1px solid gray'
    },
  })
};

function validate(newData) {
  if (!newData || !newData.email || !(newData.email.indexOf('@') > -1) || !(newData.email.indexOf('.') > -1))
    return false;
  return true;
}

class UserTable extends Component {
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
      columns: [
        {
          title: 'Role',
          field: 'role',
          editable: 'never',
          render: row =>row.role ? row.role.toUpperCase() : ''
        },
        {
          title: 'User Name',
          field: '_id',
          editable: 'never',
          cellStyle: {
            maxWidth: "200px",
            overflowWrap: "break-word"
          }
        },
/*
        {
          title: 'API Enable',
          field: 'active',
          editable: 'never',
          render: row =>
            (
              <Switch
                disabled={(row && row.tableData && row.tableData.editing === 'update')}
                size="small"
                checked={row.active}
                onChange={() => this.props.toggleUserStatus(row.tableData.id)}
                color="primary"
                inputProps={{ 'aria-label': 'primary checkbox', title: 'api-enable' }}
                id = {`UserTable-togglebtn-${row._id}`}
              />
            ),
        },
*/
        {
          title: 'Phone',
          field: 'phone_number',
          headerStyle: {
            textAlign: 'left'
          },
          cellStyle: {
            textAlign: 'left'
          },
          editComponent: row =>
            (
              <MuiPhoneNumber
                onChange={(value) => this.props.OnHandleChange({ target: { value, name: 'phone_number' } })}
                inputProps={{
                  name: 'phone_number',
                  default: row.phone_number,
                  id : `UserTable-phone-${ row}`
                }}
                value={this.props.phone_number}
                required
                label=""
                // onlyCountries={['in', 'kr']}
                defaultCountry="kr"
              />
            )
        },
        {
          title: 'Email',
          field: 'email',
        },
        // {
        //   title: 'Privilege',
        //   field: 'privileges',
        //   editable: 'never'
        // },
      ]
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid item container sm={6} xs={12} className={classes.titleContainer}>
        <Grid sm={6} xs={12} item className={classes.tableContainer}>
          <Grid sm={6} xs={12} item className={classes.userListGrid}>
            <ThemeProvider theme={this.theme}>
              <Typography className={classes.userListTypography} variant="h3">User List</Typography>
              <MaterialTable
                editable={{
                  onRowUpdate: (newData, oldData) =>
                    new Promise((resolve, reject) => {
                      setTimeout(() => {
                        const valid = validate(newData);
                        if (valid) {
                          newData.phone_number = this.props.phone_number;
                          this.props.saveChange(newData, oldData.tableData.id);
                        }
                        else {
                          this.props.openAlertBox({
                            istypealert: true,
                            alerttype: 'alert',
                            alertOpen: true,
                            alerttitle: 'Update User',
                            alertdescription: 'Please enter a valid input'
                          });
                          reject();
                        }
                        resolve();
                      }, 1000);
                    }),
                  onRowDelete: oldData =>
                    new Promise((resolve) => {
                      setTimeout(() => {
                        {
                          const event = { target: { checked: true } }
                          this.props.selectUser(event, oldData.tableData.id)
                          this.props.deleteUsers();
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
                data={this.props.users}
                options={{
                  headerStyle: customTheme.table.header,
                  actionsColumnIndex: -1,
                  selection: false,
                  sorting: true,
                  toolbar: false,
                  maxBodyHeight: '230px'
                }}
              />
            </ThemeProvider>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(UserTable);
