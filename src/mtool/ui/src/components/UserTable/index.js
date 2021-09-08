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
import { createTheme, withStyles, MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles';
import MuiPhoneNumber from 'material-ui-phone-number';
import { Grid, Typography, TextField, Button } from '@material-ui/core';
import { Add, ArrowUpward, Check, ChevronLeft, ChevronRight, Done, Clear, Edit, FilterList, FirstPage, LastPage, SaveAlt, Search } from '@material-ui/icons';
import Remove from '@material-ui/icons/Remove';
import TrashIcon from "@material-ui/icons/Delete";
import AlertDialog from '../Dialog';
import './UserTable.css';
import { customTheme } from "../../theme";
import { PHONE_REGEX, EMAIL_REGEX } from '../../utils/constants';

const styles = (theme) => {
  return ({
    titleContainer: {
      maxWidth: '100%',
      flexBasis: '100%',
    },
    pageHeader: {
      textAlign: 'left',
      fontSize: 16,
      fontWeight: 'bold',
      color: '#424850',
      marginBottom: theme.spacing(1)
    },
    userListTypography: {
      textAlign: 'left',
      fontSize: 14,
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
      fontSize: 14,
      maxWidth: '100%',
      flexBasis: '100%',
      border: '1px solid gray'
    },
  })
};


function validate(newData) {
  if (!(EMAIL_REGEX.test(newData.email))) {
    return "Please Enter a Valid Email";
  }
  if(!(PHONE_REGEX.test(newData.phone_number))) {
    return "Please Enter a Valid Phone Number";
  }
  return "";
}

class UserTable extends Component {
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
      alertOpen: false,
      currentUserAlertOpen: false,
      selectedRow: {}
    }
    this.selectRow = this.selectRow.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
  }


  selectRow(row) {
    if(row._id === localStorage.getItem('userid')) {
      this.setState({
        currentUserAlertOpen: true
      });
      return;
    }
    this.setState({
      alertOpen: true,
      selectedRow: row
    });
  }

  closeAlert() {
    this.setState({
      alertOpen: false,
      currentUserAlertOpen: false
    });
  }

  saveUser(user) {
    const errMsg = validate(user);
    if (errMsg.length > 0) {
      this.props.openAlertBox({
        istypealert: true,
        alerttype: 'alert',
        alertOpen: true,
        alerttitle: 'Update User',
        alertdescription: errMsg
      });
      return;
    }
    this.props.saveChange(user);
  }

  render() {
    const { classes } = this.props;

    const userColumns = [
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
        render: row => row.edit ? (
            <MuiPhoneNumber
              onChange={(value) => this.props.OnChangeRow({ value, id: row._id, name: 'phone_number' })}
              inputProps={{
                name: 'phone_number',
                default: row.phone_number,
                id : `UserTable-phone-${ row._id}`
              }}
              autoFormat={false}
              value={row.phone_number}
              required
              label=""
              defaultCountry="kr"
            />
          ) : row.phone_number
      },
      {
        title: 'Email',
        render: row => (row.edit) ? (
          <TextField
            onChange={(event) => {this.props.OnChangeRow({ value: event.target.value, id: row._id, name: 'email' })}}
            inputProps={{
              name: 'email',
              default: row.email,
              id : `UserTable-email-${ row._id}`,
              title: 'email'
            }}
            value={row.email}
          />
        ) : row.email

      },
      {
        title: 'Actions',
        field: 'edit',
        editable: 'never',
        sorting: false,
        render: row => {
          return !row.edit ? (
            <React.Fragment>
            <Button
              title="Edit"
              data-testid={`vol-edit-btn-${row.name}`}
              onClick={() => this.props.editUser(row)}
              id={`VolumeList-btn-edit-${row.name}`}
            >
              <Edit />
            </Button>
            <Button
              title="Delete"
              data-testid={`vol-edit-btn-${row.name}`}
              onClick={() => this.selectRow(row)}
              id={`VolumeList-btn-edit-${row.name}`}
            >
              <TrashIcon />
            </Button>
            </React.Fragment>
          ) : (
              <React.Fragment>
                <Button
                  title="Save"
                  data-testid={`vol-edit-save-btn-${row.name}`}
                  onClick={() => this.saveUser(row)}
                  id={`VolumeList-btn-done-${row.name}`}
                >
                  <Done />
                </Button>
                <Button
                  data-testid={`vol-edit-cancel-btn-${row.name}`}
                  title="Cancel"
                  onClick={this.props.fetchUsers}
                  id={`VolumeList-btn-clear-${row.name}`}
                >
                  <Clear />
                </Button>
              </React.Fragment>
            );
        }
      }
      // {
      //   title: 'Privilege',
      //   field: 'privileges',
      //   editable: 'never'
      // },
    ]
    return (
      <Grid item container sm={6} xs={12} className={classes.titleContainer}>
        <Grid sm={6} xs={12} item className={classes.tableContainer}>
          <Grid sm={6} xs={12} item className={classes.userListGrid}>
            <ThemeProvider theme={this.theme}>
              <Typography className={classes.userListTypography} variant="h3">User List</Typography>
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
                  Edit,
                  Delete: TrashIcon,
                  SortArrow: ArrowUpward,
                  Clear,
                }}
                columns={userColumns}
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
        <AlertDialog
          title="Delete User"
          description={`Are you sure you want to delete the user ${this.state.selectedRow._id}?`}
          open={this.state.alertOpen}
          handleClose={this.closeAlert}
          onConfirm={() => {
            this.closeAlert()
            this.props.deleteUsers(this.state.selectedRow);
          }}
        />
        <AlertDialog
          title="Delete User"
          type="alert"
          description="Current user cannot be deleted"
          open={this.state.currentUserAlertOpen}
          handleClose={this.closeAlert}
        />
      </Grid>
    );
  }
}

export default withStyles(styles)(UserTable);
