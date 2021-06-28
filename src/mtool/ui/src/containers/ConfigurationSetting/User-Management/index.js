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
import { connect } from 'react-redux'
import { withStyles, Grid } from '@material-ui/core';
import ThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import UserTable from '../../../components/UserTable';
import AddNewUser from '../../../components/AddNewUser';
import './User-Management.css';
import AlertDialog from '../../../components/Dialog';
import MToolTheme, { customTheme } from '../../../theme';
import * as actionTypes from "../../../store/actions/actionTypes";
import * as actionCreators from "../../../store/actions/exportActionCreators";

const styles = (theme) => ({
  content: {
    flexGrow: 1,
    width: '100%',
    boxSizing: 'border-box',
    padding: theme.spacing(2, 0)
  },
  toolbar: customTheme.toolbar,
  cardHeader: customTheme.card.header
});

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const USERNAME_REGEX = /^(?=.{2,15}$)[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/;

class UserManagement extends Component {
  constructor(props) {
    super(props);
    // this.toggleUserStatus = this.toggleUserStatus.bind(this);
    this.selectUser = this.selectUser.bind(this);
    this.deleteUsers = this.deleteUsers.bind(this);
    this.saveUser = this.saveUser.bind(this);
    this.OnHandleSubmit = this.OnHandleSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.OnHandleChange = this.OnHandleChange.bind(this);
    this.openAlert = this.openAlert.bind(this);
    this.handleAlertClose = this.handleAlertClose.bind(this);
    this.triggerCommand = this.triggerCommand.bind(this);
    this.validate = this.validate.bind(this);
    this.state = {
      username: "",
      password: "",
      confirmpassword: "",
      user_role: "Admin",
      mobilenumber: "+82",
      emailid: "",
      phone_number:"+82"
    };
  }

  componentDidMount() {
    this.props.fetchUsersInfo();
  }

  handleAlertClose() {
    this.props.openAlertBox({
      alertOpen: false
    });
  }

  onCancel() {
    this.setState({
      ...this.state,
      username: "",
      password: "",
      confirmpassword: "",
      user_role: "Admin",
      mobilenumber: "+82",
      emailid: "",
      phone_number:"+82"
    });
  }

  // toggleUserStatus(i) {
  //   const user = {
  //     userid: this.props.users[i]._id,
  //     status: !this.props.users[i].active,
  //   };
  //   this.props.toggleUsersInfo(user);
  // }

  selectUser(event, i) {
    const users = [...this.props.users];
    users[i].selected = event.target.checked;
    this.setState({
      ...this.state,
      users,
    });
  }

  saveUser(user) {
    this.props.updateUsersInfo(user);
  }

  deleteUsers(users) {
    const ids = [];
    const currentUser = localStorage.getItem('userid');
    [users].forEach(user => {
      if (user._id !== currentUser) {
        ids.push(user._id);
        // Uncomment below line when multiple user selection is enabled
        // } else if (user.selected && user._id === currentUser) {
      }
      if (user._id === currentUser) {
        this.props.openAlertBox({
          istypealert: true,
          alerttype: 'alert',
          alertOpen: true,
          alerttitle: 'Delete User',
          alertdescription: 'Current user cannot be deleted'
        });
      }
    });
    if(!ids.length) {
      return;
    }
    // if (ids.length === 0) {
    //   this.setState({
    //     istypealert: true,
    //     alerttype: 'alert',
    //     alertOpen: true,
    //     alerttitle: 'Delete User',
    //     alertdescription: 'Select the users to be deleted'
    //   });
    // }
    const data = {
      ids,
    };
    this.props.deleteUsersInfo(data);
  }

  OnHandleChange(event) {
    const { name, value } = event.target;
    this.setState({
      ...this.state,
      [name]: value
    });
  }

  validate() {
    if (!(USERNAME_REGEX.test(this.state.username))) {
      this.props.openAlertBox({
        alertOpen: true,
        alerttype: 'alert',
        istypealert: true,
        alerttitle: "Add New User",
        alertdescription: (<p>Username Should follow the below rules
		<ul>
		  <li>Alphanumeric characters only</li>
		  <li>2-15 characters</li>
		  <li>Underscore and hyphens and spaces (but not in beginning or end)</li>
		  <li>Cannot be two underscores, two hypens or two spaces in a row</li>
		  <li>e.g. ab, a-b-c, ab-cd, etc</li>
		  <li>Incorrect: _abc, abc_, a__b, a--b, etc</li>
		</ul>
                           </p>),
      });
    }
    else if (!this.state.password || !this.state.confirmpassword)
      this.props.openAlertBox({ alerttitle: "Add New User", alertOpen: true, alerttype: "alert", istypealert: true, alertdescription: "Please Enter a Valid Password" })
    else if (this.state.password !== this.state.confirmpassword)
      this.props.openAlertBox({ alerttitle: "Add New User", alertOpen: true, alerttype: "alert", istypealert: true, alertdescription: "Passwords do not match" })
    else if (this.state.password.length < 8 || this.state.password.length > 64)
    this.props.openAlertBox({ alerttitle: "Add New User", alertOpen: true, alerttype: "alert", istypealert: true, alertdescription: "Password length should be between 8-64 characters" })
    else if (!this.state.mobilenumber || this.state.mobilenumber.length < 4)
      this.props.openAlertBox({ alerttitle: "Add New User", alertOpen: true, alerttype: "alert", istypealert: true, alertdescription: "Please Enter a Valid Mobile Number" })
    else if (!(EMAIL_REGEX.test(this.state.emailid)))
      this.props.openAlertBox({ alerttitle: "Add New User", alertOpen: true, alerttype: "alert", istypealert: true, alertdescription: "Please Enter a Valid Email ID" })
    else {
      this.setState({ ...this.state, error: "" })
      return true;
    }
    return false;
  }

  openAlert(operationType) {
    if (operationType === "Submit") {
      if (!this.validate())
        return;
    }
    this.props.openAlertBox({
      alertOpen: true,
      addDeleteSend: operationType,
      alerttype: 'delete',
      istypealert: false,
      alerttitle: `${operationType} User`,
      alertdescription: `Are you sure you want to ${operationType} the user?`,
    }
    );
  }

  triggerCommand() {
    if (this.props.addDeleteSend === 'Submit') {
      this.OnHandleSubmit();
      this.handleAlertClose();
    } else {
      this.onCancel();
      this.handleAlertClose();
    }
  }

  OnHandleSubmit() {
      this.props.addNewUserInfo(this.state);
      this.setState({
        username: "",
        password: "",
        confirmpassword: "",
        user_role: "Admin",
        mobilenumber: "+82",
        emailid: "",
      });
  }

  render() {
    const { classes } = this.props;
    return (
      <ThemeProvider theme={MToolTheme}>
        {/* <Box display="flex"> */}
          {/* <Header /> */}
          {/* <Sidebar /> */}
          <main className={classes.content}>
            {/* <div className={classes.toolbar} /> */}
            <Grid container spacing={3}>
              <UserTable
                selectUser={this.selectUser}
                // toggleUserStatus={this.toggleUserStatus}
                saveChange={this.saveUser}
                deleteUsers={this.deleteUsers}
                users={this.props.users}
                fetchUsers={this.props.fetchUsersInfo}
                editUser={this.props.editUser}
                phone_number={this.state.phone_number}
                OnChangeRow={this.props.updateUserRow}
                openAlertBox = {this.props.openAlertBox}
              />
              <AddNewUser
                username={this.state.username}
                password={this.state.password}
                confirmpassword={this.state.confirmpassword}
                mobilenumber={this.state.mobilenumber}
                emailid={this.state.emailid}
                openAlert={this.openAlert}
                onCancel={this.onCancel}
                OnHandleChange={this.OnHandleChange}
              />
            </Grid>
          </main>
        {/* </Box> */}
          <AlertDialog
            title={this.props.alerttitle}
            description={this.props.alertdescription}
            open={this.props.alertOpen}
            type={this.props.alerttype}
            handleClose={this.handleAlertClose}
            onConfirm={this.triggerCommand}
          />
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => {
  return {
    users: state.userManagementReducer.users,
    addDeleteSend: state.alertManagementReducer.addDeleteSend,
    alertOpen: state.alertManagementReducer.alertOpen,
    alerttype: state.alertManagementReducer.alerttype,
    istypealert: state.alertManagementReducer.istypealert,
    alerttitle: state.alertManagementReducer.alerttitle,
    alertdescription: state.alertManagementReducer.alertdescription,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    // setUsersInfo: (updatedUsers) => dispatch(actionCreators.setUsersInfo(updatedUsers)),
    editUser: (user) => dispatch({type: actionTypes.USER_MANAGEMENT_EDIT_USER, user}),
    openAlertBox: (alertParam) => dispatch(actionCreators.openAlertBox(alertParam)),
    fetchUsersInfo: () => dispatch({ type: actionTypes.SAGA_USER_MANAGEMENT_FETCH_USERS }),
    updateUsersInfo: (newUsers) => dispatch({ type: actionTypes.SAGA_USER_MANAGEMENT_UPDATE_USERS, newUsers, }),
    updateUserRow: (user) => dispatch({ type: actionTypes.USER_MANAGEMENT_UPDATE_USER, user}),
    deleteUsersInfo: (deleteUsers) => dispatch({ type: actionTypes.SAGA_USER_MANAGEMENT_DELETE_USERS, deleteUsers, }),
    // toggleUsersInfo: (toggleUsers) => dispatch({ type: actionTypes.SAGA_USER_MANAGEMENT_TOGGLE_USERS, toggleUsers, }),
    addNewUserInfo: (addNewUser) => dispatch({ type: actionTypes.SAGA_USER_MANAGEMENT_ADD_NEW_USERS, addNewUser, }),
  };
}

export default withStyles(styles)((connect(mapStateToProps, mapDispatchToProps))(((UserManagement))));
