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


DESCRIPTION: Component corresponding to User Management Page
@NAME : index.js
@AUTHORS: Jay Hitesh Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
[04/06/2019] [Aswin] : Changes for adding custom alert
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

  saveUser(user, i) {
    const newUser = {
      ...user,
      oldid: this.props.users[i]._id,
    };
    this.props.updateUsersInfo(newUser);
  }

  deleteUsers() {
    const ids = [];
    const currentUser = localStorage.getItem('userid');
    this.props.users.forEach(user => {
      if (user.selected && user._id !== currentUser) {
        ids.push(user._id);
        // Uncomment below line when multiple user selection is enabled
        // } else if (user.selected && user._id === currentUser) {
      }
      if (user.selected && user._id === currentUser) {
        this.props.openAlertBox({
          istypealert: true,
          alerttype: 'alert',
          alertOpen: true,
          alerttitle: 'Delete User',
          alertdescription: 'Current user cannot be deleted'
        });
      }
    });
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
    if (!this.state.username) {
      this.props.openAlertBox({
        alertOpen: true,
        alerttype: 'alert',
        istypealert: true,
        alerttitle: "Add New User",
        alertdescription: "Please Enter a Valid Username",
      });
    }
    else if (!this.state.password || !this.state.confirmpassword)
      this.props.openAlertBox({ alerttitle: "Add New User", alertOpen: true, alerttype: "alert", istypealert: true, alertdescription: "Please Enter a Valid Password" })
    else if (this.state.password !== this.state.confirmpassword)
      this.props.openAlertBox({ alerttitle: "Add New User", alertOpen: true, alerttype: "alert", istypealert: true, alertdescription: "Passwords do not match" })
    else if (!this.state.mobilenumber || this.state.mobilenumber.length < 4)
      this.props.openAlertBox({ alerttitle: "Add New User", alertOpen: true, alerttype: "alert", istypealert: true, alertdescription: "Please Enter a Valid Mobile Number" })
    else if (!this.state.emailid || !(this.state.emailid.indexOf('@') > -1) || !(this.state.emailid.indexOf('.') > -1))
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
                phone_number={this.state.phone_number}
                OnHandleChange={this.OnHandleChange}
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
    openAlertBox: (alertParam) => dispatch(actionCreators.openAlertBox(alertParam)),
    fetchUsersInfo: () => dispatch({ type: actionTypes.SAGA_USER_MANAGEMENT_FETCH_USERS }),
    updateUsersInfo: (newUsers) => dispatch({ type: actionTypes.SAGA_USER_MANAGEMENT_UPDATE_USERS, newUsers, }),
    deleteUsersInfo: (deleteUsers) => dispatch({ type: actionTypes.SAGA_USER_MANAGEMENT_DELETE_USERS, deleteUsers, }),
    // toggleUsersInfo: (toggleUsers) => dispatch({ type: actionTypes.SAGA_USER_MANAGEMENT_TOGGLE_USERS, toggleUsers, }),
    addNewUserInfo: (addNewUser) => dispatch({ type: actionTypes.SAGA_USER_MANAGEMENT_ADD_NEW_USERS, addNewUser, }),
  };
}

export default withStyles(styles)((connect(mapStateToProps, mapDispatchToProps))(((UserManagement))));