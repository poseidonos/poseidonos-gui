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


DESCRIPTION: Configuration Page Container for rendering Configuration Page
@NAME : index.js
@AUTHORS: Jay Hitesh Sanghavi, Palak Kapoor 
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
[08/21/2019] [Palak]: Material UI & Redux.///////////////////
*/
import React, { Component } from 'react';
import ThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { withStyles } from '@material-ui/core/styles';
import { Grid, AppBar, Tabs, Tab } from '@material-ui/core';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import MToolTheme , { customTheme } from '../../theme';
import EmailAlerts from '../../components/EmailAlerts';
import './ConfigurationSetting.css';
import AlertDialog from '../../components/Dialog';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import * as actionTypes from '../../store/actions/actionTypes';
import * as actionCreators from '../../store/actions/exportActionCreators';

import LogConfiguration from '../../components/LogConfiguration';
import AlertManagement from './Alert-Management';
import UserManagement from './User-Management';

const styles = theme => ({
  configurationContainer: {
    display: 'flex',
  },
  GeneralContainer: {
    padding: theme.spacing(2, 0)
  },
  pageHeader: customTheme.page.title,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    width: '100%',
    boxSizing: 'border-box',
    paddingLeft: '24px',
    paddingRight: '13px',
  },
  toolbar: customTheme.toolbar,
  EmailTableContainer: {
    margin: 0
  },
  selectedTab: {
    color: 'rgb(33, 34, 37)',
    borderBottom: `2px solid ${'rgb(33, 34, 37)'}`,
    fontWeight: 600
  }
});
class ConfigurationSetting extends Component {
  constructor(props) {
    super(props);
    this.selectEmail = this.selectEmail.bind(this);
    this.editEmail = this.editEmail.bind(this);
    this.deleteEmails = this.deleteEmails.bind(this);
    this.saveEmail = this.saveEmail.bind(this);
    // this.sendEmail = this.sendEmail.bind(this);
    this.testserver = this.testserver.bind(this);
    this.deleteConfiguredSmtpServer = this.deleteConfiguredSmtpServer.bind(this);
    this.toggleEmailStatus = this.toggleEmailStatus.bind(this);
    this.savesmtpserverdetails = this.savesmtpserverdetails.bind(this);
    this.openAlert = this.openAlert.bind(this);
    this.handleAlertClose = this.handleAlertClose.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.triggerCommand = this.triggerCommand.bind(this);
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    this.OnHandleChange = this.OnHandleChange.bind(this);
    this.applyIbofOSTimeInterval = this.applyIbofOSTimeInterval.bind(this);
    this.deleteIbofOSTimeInterval = this.deleteIbofOSTimeInterval.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.state = {
      add_delete_send: '',
      mobileOpen: false,
      ibofostimeinterval: this.props.timeinterval,
      open: false,
      value: 0
    };
  }

  componentDidMount() {
    this.props.fetchEmailList();
    this.props.getSmtpDetails();
    this.setState({
      ibofostimeinterval: this.props.timeinterval
    });
  }

  OnHandleChange(event) {
    const { name, value } = event.target;
    this.setState({
      ...this.state,
      [name]: value
    });
  }

  // Change the checked state after selection
  selectEmail(index) {
    const emaillist = [...this.props.emaillist];
    emaillist[index].selected = true;
    this.props.changeEmailList(emaillist);
  }

  handleTabChange(event, newValue) {
    if (newValue === 'general') {
      this.componentDidMount();
    }
    this.props.history.push(`/ConfigurationSetting/${newValue}`);
  }

  deleteConfiguredSmtpServer() {
    this.props.deleteConfiguredSmtpServer();
  }

  editEmail(i) {
    const emaillist = [...this.props.emaillist];
    emaillist[i].edit = !emaillist[i].edit;
    this.props.changeEmailList(emaillist);
  }

  // Update an existing email id or add another email id
  saveEmail(emailentry, i, newEntry) {
    if (
      emailentry.email === '' ||
      !emailentry.email ||
      (emailentry.email && !(emailentry.email.indexOf('@') > -1)) ||
      (emailentry.email && !(emailentry.email.indexOf('.') > -1))
    ) {
      const payload = {
        alertOpen: true,
        istypealert: true,
        alerttype: 'alert',
        alerttitle: 'Save Email',
        alertdescription: 'Please enter a valid email id',
      };
      this.props.setAlertBox(payload);
      return;
    }
    for (let j = 0; j < this.props.emaillist.length; j += 1) {
      if (this.props.emaillist[j].email === emailentry.email && j !== i) {
        const payload = {
          alertOpen: true,
          istypealert: true,
          alerttype: 'alert',
          alerttitle: 'Save Email',
          alertdescription: 'This email id exists',
        };
        this.props.setAlertBox(payload);
        return;
      }
    }

    if (newEntry === true) {
      const email = [...this.props.emaillist];
      email.push({
        _id: 'Wassup',
        email: emailentry.email,
        selected: false,
        active: 1,
      });
      this.props.changeEmailList(email);
      i = this.props.emaillist.length - 1;
    }

    const newEmail = {
      ...emailentry,
      oldid: this.props.emaillist[i].email,
    };
    this.props.updateEmail(newEmail);
    this.props.fetchEmailList();
  }

  // Delete all selected email ids
  deleteEmails() {
    const ids = [];
    let toggleFlag = false;
    let toggleEmail = {}
    this.props.emaillist.forEach((email, index) => {
      if (email.selected) {
        if(email.active === 0){
          toggleEmail = {
            emailid: email.email,
            status: !email.active,
          };
          toggleFlag = true;
        }
        ids.push(email.email);
        const emaillist = [...this.props.emaillist];
        emaillist[index].selected = false;
        this.props.changeEmailList(emaillist);
      }
    });

    const data = {
      ids,
    };
    const deletePayload = {
      data,
      toggleFlag,
      toggleEmail
    }

    this.props.deleteEmailIds(deletePayload);
  }

  // Send email to all the active email ids
  // sendEmail() {
  //   const ids = [];
  //   this.props.emaillist.forEach((email, index) => {
  //     if (email.selected && email.active) {
  //       const emaillist = [...this.props.emaillist];
  //       emaillist[index].selected = false;
  //       this.props.changeEmailList(emaillist);
  //       ids.push(email.email);
  //     }
  //   });
  //   if (ids.length <= 0) {
  //     const payload = {
  //       alertOpen: true,
  //       istypealert: true,
  //       alerttype: 'alert',
  //       alerttitle: 'Send Email',
  //       alertdescription: 'Please select an email id to send',
  //     };
  //     this.props.setAlertBox(payload);
  //     return;
  //   }
  //   if (this.props.configuredsmtpserver === '') {
  //     const payload = {
  //       alertOpen: true,
  //       istypealert: true,
  //       alerttype: 'alert',
  //       alerttitle: 'Send Email',
  //       alertdescription: 'Please configure smtp server',
  //     };
  //     this.props.setAlertBox(payload);
  //     return;
  //   }
  //   const arr = this.props.configuredsmtpserver.split(':');
  //   const data = {
  //     smtpserverip: arr[0],
  //     smtpserverport: arr[1],
  //     ids,
  //   };
  //   document.getElementsByTagName('body')[0].style.cursor = 'wait';
  //   this.props.sendEmail(data);
  // }

  // Test whether smtp server is working as expected
  testserver(event) {
    event.preventDefault();
    document.getElementsByTagName('body')[0].style.cursor = 'wait';
    const payload = {
      smtpserver: this.props.smtpserver,
      smtpserverip: this.props.smtpserverip,
      smtpserverport: this.props.smtpserverport,
      smtpusername: this.props.smtpusername,
      smtppassword: this.props.smtppassword,
      smtpfromemail: this.props.smtpfromemail,
    };
    this.props.testEmail(payload);
  }

  savesmtpserverdetails(event) {
    const { value } = event.target;
    let payload = {};
    if(event.target.name === 'smtpserver'){
    const arr = event.target.value.split(':');
    payload = {
      smtpserver: value,
      smtpserverip: arr[0],
      smtpserverport: arr[1],
    };
  }
  else{
     payload = {
      [event.target.name]:event.target.value
    };
  }
    this.props.setSmtpServer(payload);
  }

  // Enable/Disable an email id but do not delete from DB
  toggleEmailStatus(i) {
    const email = {
      emailid: this.props.emaillist[i].email,
      status: !this.props.emaillist[i].active,
    };
    this.props.toggleActiveStatus(email);
  }

  openAlert(operationType) {
    this.setState({
      ...this.state,
      add_delete_send: operationType,
    });
    const payload = {
      alertOpen: true,
      istypealert: false,
      alerttype: 'delete',
      alerttitle: `${operationType} Email`,
      alertdescription: `Are you sure you want to ${operationType} the email?`,
    };
    this.props.setAlertBox(payload);
  }

  handleAlertClose() {
    const payload = {
      alertOpen: false
    };
    this.props.setAlertBox(payload);
  }

  handleClose() {
    this.setState({
      ...this.state,
      open: false
    })
  }

  triggerCommand() {
    // if (this.state.add_delete_send === 'Delete') {
    //   this.deleteEmails();
    // } 
    // else if (this.state.add_delete_send === 'Send') {
    //   this.sendEmail();
    // }

    this.deleteEmails();
  }

  handleDrawerToggle() {
    this.setState({
      mobileOpen: !this.state.mobileOpen,
    });
  }

  applyIbofOSTimeInterval() {
    if(this.state.ibofostimeinterval >= 0) {
      this.props.setIbofOSTimeInterval({timeinterval:this.state.ibofostimeinterval});
    } else {
      this.setState({
        ...this.state,
        open: true
      })
    }
  }

  deleteIbofOSTimeInterval() {
    this.props.setIbofOSTimeInterval({timeinterval:4});
  }


  render() {
    const { classes } = this.props;
    return (
      <ThemeProvider theme={MToolTheme}>
        <div className={classes.configurationContainer}>
          <Header toggleDrawer={this.handleDrawerToggle} />
          <Sidebar
            mobileOpen={this.state.mobileOpen}
            toggleDrawer={this.handleDrawerToggle}
          />
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <AppBar position="static" color="default">
              <Tabs
                value={this.state.value}
                onChange={this.handleTabChange}
              >
                <Tab label="General" key="general" value="general" className={(window.location.href.indexOf('general') > 0 ? classes.selectedTab : null)} />
                <Tab label="Alert" key="alert" value="alert" className={(window.location.href.indexOf('alert') > 0 ? classes.selectedTab : null)} />
                <Tab label="User" key="user" value="user" className={(window.location.href.indexOf('user') > 0 ? classes.selectedTab : null)} />
              </Tabs>
            </AppBar>
            <Switch>
                <Route exact path="/ConfigurationSetting/general">
                  <Grid container spacing={1} className={classes.GeneralContainer}>

                    <Grid item container spacing={1} xs={12} sm={12} className={classes.EmailTableContainer}>
                      <EmailAlerts
                        emailids={this.props.emaillist}
                        IP={this.props.smtpserverip}
                        Port={this.props.smtpserverport}
                        addemailids={this.updateEmailIDList}
                        editEmail={this.editEmail}
                        selectEmail={this.selectEmail}
                        saveChange={this.saveEmail}
                        deleteEmails={this.deleteEmails}
                        // sendEmail={this.sendEmail}
                        configuredsmtpserver={this.props.configuredsmtpserver}
                        deleteConfiguredSmtpServer={this.deleteConfiguredSmtpServer}
                        testserver={this.testserver}
                        savesmtpserverdetails={this.savesmtpserverdetails}
                        toggleEmailStatus={this.toggleEmailStatus}
                        openAlert={this.openAlert}
                      />
                      <AlertDialog
                        title={this.props.alerttitle}
                        description={this.props.alertdescription}
                        open={this.props.alertOpen}
                        type={this.props.alerttype}
                        handleClose={this.handleAlertClose}
                        onConfirm={this.triggerCommand}
                      />
                    </Grid>
                    {/* <Grid item container spacing={1} xs={12} sm={6} className={classes.EmailTableContainer}>
                      <LogConfiguration
                        downloadLogs={this.props.downloadLogs}
                        OnHandleChange={this.OnHandleChange}
                        ibofostimeintervalvalue={this.props.timeinterval}
                        ibofostimeinterval={this.state.ibofostimeinterval}
                        applyIbofOSTimeInterval={this.applyIbofOSTimeInterval}
                        deleteIbofOSTimeInterval={this.deleteIbofOSTimeInterval}
                      />
                    </Grid> */}
                  </Grid>
                </Route>
              <Route path="/ConfigurationSetting/alert">
                <AlertManagement />
              </Route>
              <Route path="/ConfigurationSetting/user">
                <UserManagement />
              </Route>
            </Switch>
            <AlertDialog
              title="Update Interval"
              description="Invalid input. Please enter a valid interval"
              type="alert"
              open={this.state.open}
              handleClose={this.handleClose}
            />
          </main>
        </div>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => {
  return {
    emaillist: state.configurationsettingReducer.emaillist,
    alertOpen: state.configurationsettingReducer.alertOpen,
    istypealert: state.configurationsettingReducer.istypealert,
    alerttitle: state.configurationsettingReducer.alerttitle,
    alerttype: state.configurationsettingReducer.alerttype,
    alertdescription: state.configurationsettingReducer.alertdescription,
    configuredsmtpserver:
      state.configurationsettingReducer.configuredsmtpserver,
    smtpserverip: state.configurationsettingReducer.smtpserverip,
    smtpserverport: state.configurationsettingReducer.smtpserverport,
    smtpserver: state.configurationsettingReducer.smtpserver,
    smtpusername: state.configurationsettingReducer.smtpusername,
    smtppassword: state.configurationsettingReducer.smtppassword,
    smtpfromemail: state.configurationsettingReducer.smtpfromemail,
    timeinterval: state.configurationsettingReducer.timeinterval,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    fetchEmailList: () => dispatch({ type: actionTypes.SAGA_FETCH_EMAIL_LIST }),
    getSmtpDetails: () => dispatch({ type: actionTypes.SAGA_GET_SMTP_DETAILS }),
    changeEmailList: newemail =>
      dispatch(actionCreators.changeEmailList(newemail)),
    setAlertBox: payload => dispatch(actionCreators.setAlertBox(payload)),
    updateEmail: newemail =>
      dispatch({ type: actionTypes.SAGA_UPDATE_EMAIL, payload: newemail }),
    toggleActiveStatus: email =>
      dispatch({ type: actionTypes.SAGA_TOGGLE_ACTIVE_STATUS, payload: email }),
    // sendEmail: data =>
    //   dispatch({ type: actionTypes.SAGA_SEND_EMAIL, payload: data }),
    testEmail: data =>
      dispatch({ type: actionTypes.SAGA_TEST_EMAIL, payload: data }),
    setSmtpServer: payload => dispatch(actionCreators.setSmtpServer(payload)),
    deleteConfiguredSmtpServer: () =>
      dispatch({ type: actionTypes.SAGA_DELETE_SMTP_DETAILS}),
    deleteEmailIds: data =>
      dispatch({ type: actionTypes.SAGA_DELETE_EMAIL_IDS, payload: data }),
    downloadLogs: data =>
      dispatch({ type: actionTypes.SAGA_DOWNLOAD_LOGS, payload: data }),
    setIbofOSTimeInterval: data =>
      dispatch({ type: actionTypes.SAGA_SET_IBOFOS_TIME_INTERVAL, payload: data }),
  };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withRouter(ConfigurationSetting))
);
