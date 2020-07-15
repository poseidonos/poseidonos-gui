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


DESCRIPTION: Alert Management Container for rendering Alert Management Page
@NAME : index.js
@AUTHORS: Jay Hitesh Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
*/
import React, { Component } from 'react';
import { connect } from 'react-redux'
import Grid from "@material-ui/core/Grid";
import { withStyles } from '@material-ui/core/styles';
import ThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { PageTheme } from '../../../theme';
import AlertTable from '../../../components/AlertManagementComponents/AlertTable';
import AddNewAlerts from '../../../components/AlertManagementComponents/AddNewAlerts';
import './Alert-Management.css';
import * as actionTypes from "../../../store/actions/actionTypes";
import * as actionCreators from "../../../store/actions/exportActionCreators";
import AlertFields from '../../../components/AlertManagementComponents/AlertFields';
import AlertTypes from '../../../components/AlertManagementComponents/AlertTypes';
import AlertDialog from '../../../components/Dialog';

const styles = (theme) => {
  return ({
    AlertManagementContainer: {
      display: 'flex'
    },
    content: {
      flexGrow: 1,
      paddingTop: theme.spacing(2),
      width: '100%',
      boxSizing: 'border-box'
    },
    toolbar: theme.mixins.toolbar,
  })
};


class AlertManagement extends Component {
  constructor(props) {
    super(props);
    this.toggleAlertStatus = this.toggleAlertStatus.bind(this);
    this.selectalerts = this.selectalerts.bind(this);
    this.editalerts = this.editalerts.bind(this);
    this.deletealerts = this.deletealerts.bind(this);
    this.updateAlerts = this.updateAlerts.bind(this);
    this.cancelChange = this.cancelChange.bind(this);
    this.selectAllalerts = this.selectAllalerts.bind(this);
    // this.onconditionchange = this.onconditionchange.bind(this);
    this.selectAlertCluster = this.selectAlertCluster.bind(this);
    this.selectAlertSubCluster = this.selectAlertSubCluster.bind(this);
    this.alertTypeSelected = this.alertTypeSelected.bind(this);
    this.onHandleChange = this.onHandleChange.bind(this);
    this.onHandleDropdownChange = this.onHandleDropdownChange.bind(this);
    this.addAlerts = this.addAlerts.bind(this);
    this.openAlert = this.openAlert.bind(this);
    this.handleAlertClose = this.handleAlertClose.bind(this);
    this.triggerCommand = this.triggerCommand.bind(this);
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    this.updateAlertsState = this.updateAlertsState.bind(this);
    this.state = {
      conditions: [
        'Greater Than',
        'Less Than',
        'Equal To',
        'Not Equal To',
        'Equal To Or Greater',
        'Equal To Or Less Than',
      ], // For Alert Table and Add New Alerts
      // , 'Inside Range', 'Outside Range'  - TBD
      selectedAlertSubCluster: null, // For Alert Types
      radiolist: [
        // For Alert Fields
        [
          {
            name: 'cpu-usage',
            id: '1',
          },
          {
            name: 'cpu-affinity',
            id: '2',
          },
          {
            name: 'cpu-state',
            id: '3',
          },
          {
            name: 'cpu-processor-usage',
            id: '4',
          },
          {
            name: 'cpu-threads',
            id: '5',
          },
          {
            name: 'cpu-memory',
            id: '6',
          },
          {
            name: 'cpu-utilization',
            id: '7',
          },
          {
            name: 'cpu-affinity2',
            id: '8',
          },
        ],
        [
          {
            name: 'array-name',
            id: '1',
          },
          {
            name: 'array-time',
            id: '2',
          },
        ],
      ],
      radioindex: 0,
      alertName: '',
      alertType: '',
      alertRadioButton: '', // For Alert Fields
      alertCondition: 'Greater Than', // For Add New Alerts
      alertRange: '', // For Add New Alerts
      description: '', // For Add New Alerts
      alertClusterName: '', // For Add New Alerts,

      mobileOpen: false
    };
  }

  componentDidMount() {
    this.props.fetchAlertsInfo();
    this.props.fetchAlertsTypeInfo();
  }

  onHandleDropdownChange(event) {
    this.setState({
      alertCondition: event.target.value,
    });
  }

  onHandleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  }

  // Edit Alert Condition, Alert Range and Description
  editalerts(i) {
    const alerts = [...this.props.alerts];
    alerts[i].edit = !alerts[i].edit;
    this.setState({
      ...this.state,
      alerts,
    });
  }

  // Select all Alerts from the table
  selectAllalerts(event) {
    const { checked } = event.target;
    const alerts = [];
    this.props.alerts.forEach(alert => {
      alerts.push({
        ...alert,
        selected: checked,
      });
    });
    this.setState({
      ...this.state,
      alerts,
    });
  }

  updateAlertsState(alertsData) {
    this.setState({
      ...this.state,
      alerts: alertsData
    });
  }

  // update existing alerts with change in fields
  updateAlerts(alerts) {
    const newalerts = {
      ...alerts,
    };
    this.props.updateAlertsInfo(newalerts);
  }

  // Cancel all the changes made
  cancelChange(i) {
    const alerts = [...this.props.alerts];
    alerts[i].edit = !alerts[i].edit;
    this.setState({
      ...this.state,
      alerts,
    });
  }

  // Delete selected alerts from backend
  deletealerts() {
    const ids = [];
    this.props.alerts.forEach(alerts => {
      if (alerts.selected) ids.push(alerts.alertName);
    });
    if (ids.length <= 0) {
      this.props.openAlertBox({
        alertOpen: true,
        istypealert: true,
        alerttype: 'alert',
        alerttitle: 'Delete Alert',
        alertdescription: 'Please select an alert to delete',
      });
      return;
    }
    const data = {
      ids,
    };
    this.props.deleteAlertsInfo(data);
    this.handleAlertClose();
  }

  // API for selecting a alert cluster
  selectAlertCluster(cluster, i) {
    this.setState({
      ...this.state,
      alertClusterName: cluster.name,
      radioindex: i,
    });
  }

  // API for selecting a alert sub cluster
  selectAlertSubCluster(clusterName, alertSubCluster, i) {
    this.setState({
      ...this.state,
      selectedAlertSubCluster: alertSubCluster,
      alertClusterName: clusterName,
      radioindex: i,
    });
  }

  // API for selecting a particular alert type
  alertTypeSelected(type, i, j) {
    this.setState({
      ...this.state,
      radioindex: i,
      alertType: type.type,
    });
    this.props.setAlertsInfo({ type, i, j });
  }

  // Select Alerts from Table
  selectalerts(event, i) {
    const alerts = [...this.props.alerts];
    alerts[i].selected = event.target.checked;
    this.setState({
      ...this.state,
      alerts,
    });
  }

  // API to toggle alert name... Dont delete from the Mongo DB
  toggleAlertStatus(i) {
    const alert = {
      alertName: this.props.alerts[i].alertName,
      status: !this.props.alerts[i].active,
    };
    this.props.toggleAlertsInfo(alert);
  }

  // Add new alerts in DB
  addAlerts() {
    // if (this.state.alertCondition == "Inside Range" || this.state.alertCondition == "Outside Range")
    //     var regex = /^[0-9-]+$/
    // else
    const regex = /\b(0?[1-9]|[1-9][0-9]|100)\b/; // /^[0-9]+$/
    // Validate TextBox value against the Regex.
    const isValid = regex.test(this.state.alertRange);
    if (!isValid) {
      this.props.openAlertBox({
        alertOpen: true,
        istypealert: true,
        alerttype: 'alert',
        alerttitle: 'Add Alert',
        alertdescription: 'Please specify a valid input',
      });
      return;
    }
    if (
      this.state.alertName === '' ||
      this.state.alertRadioButton === '' ||
      this.state.alertCondition === '' ||
      this.state.alertRange === '' ||
      this.state.alertType === ''
    ) {
      // alert("Please specify a valid input");
      this.props.openAlertBox({
        alertOpen: true,
        istypealert: true,
        alerttype: 'alert',
        // alerttitle:"Input Error",
        alerttitle: 'Add Alert',
        alertdescription: 'Please specify a valid input',
      });
      return;
    }
    let alertType = '';
    this.props.alertClusters.map(cluster => {
      return {
        ...cluster,
        alertSubCluster: cluster.alertSubCluster.map((subcluster) => {
          return {
            ...subcluster,
            alertTypes: subcluster.alertTypes.forEach(cip => {
              if (cip.selected === true) {
                if (alertType === '') alertType = cip.type;
                else alertType = `${alertType}|${cip.type}`;
              }
            }),
          };
        }),
      };
    });
    this.setState({
      ...this.state,
      alertType,
    });
	let subClusterName= this.state.selectedAlertSubCluster.name;
	if (subClusterName === "cpu ")
	  subClusterName = "cpu"
    const addNewAlert = {
      alertName: this.state.alertName,
      alertField: this.state.alertRadioButton,
      alertCluster: this.state.alertClusterName,
      alertSubCluster: subClusterName,
      alertType: this.state.alertType,
      alertCondition: this.state.alertCondition, // For Add New Alerts
      alertRange: this.state.alertRange, // For Add New Alerts
      description: this.state.description, // For Add New Alerts
    };
    this.props.addNewAlertsInfo(addNewAlert);
    this.setState({
      alertName: '',
      alertField: '',
      alertRadioButton: '', // For Alert Fields
      alertCondition: 'Greater Than', // For Add New Alerts
      alertRange: '', // For Add New Alerts
      description: '', // For Add New Alerts
    });
    this.handleAlertClose();
  }

  openAlert(operationType) {
    this.props.openAlertBox({
      alertOpen: true,
      addDeleteSend: operationType,
      alerttype: 'delete',
      istypealert: false,
      alerttitle: `${operationType} Alert`,
      alertdescription: `Are you sure you want to ${operationType} the alert?`,
    }
    );
  }

  handleAlertClose() {
    this.props.openAlertBox({
      alertOpen: false
    });
  }

  triggerCommand() {
    if (this.props.addDeleteSend === 'Delete') {
      this.deletealerts();
    } else if (this.props.addDeleteSend === 'Add') {
      this.addAlerts();
    }
  }

  handleDrawerToggle() {
    this.setState({
      mobileOpen: !this.state.mobileOpen
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <ThemeProvider theme={PageTheme}>
        <div className={classes.AlertManagementContainer} data-testid="alertManagementTag">
          {/* <Header toggleDrawer={this.handleDrawerToggle} /> */}
          {/* <Sidebar mobileOpen={this.state.mobileOpen} toggleDrawer={this.handleDrawerToggle} /> */}
          <main className={classes.content}>
            {/* <div className={classes.toolbar} /> */}
            <Grid container spacing={3}>
              <AlertTable
                selectalerts={this.selectalerts}
                togglealertstatus={this.toggleAlertStatus}
                editalerts={this.editalerts}
                cancelChange={this.cancelChange}
                saveChange={this.updateAlerts}
                updateAlertsState={this.updateAlertsState}
                deletealerts={this.deletealerts}
                selectAllalerts={this.selectAllalerts}
                alerts={this.props.alerts}
                dropdownCondition={this.state.conditions}
                alertOpen={this.state.alertOpen_alertTable}
                alerttitle={this.state.alertboxtitle_alertTable}
                alertdescription={this.state.alertboxdescription_alertTable}
                triggerCommand={this.triggerCommand}
                openAlert={this.openAlert}
              />
              <Grid item container spacing={3}>
                <AlertTypes
                  selectAlertCluster={this.selectAlertCluster}
                  selectAlertSubCluster={this.selectAlertSubCluster}
                  alertClusterList={this.props.alertClusters}
                  selectedAlertSubCluster={this.state.selectedAlertSubCluster}
                  alertTypeSelected={this.alertTypeSelected}
                />

                <AlertFields
                  radiolist={this.state.radiolist}
                  alertClusterList={this.props.alertClusters}
                  alertRadioButton={this.state.alertRadioButton}
                  onHandleChange={this.onHandleChange}
                  radioindex={this.state.radioindex}
                  alertClusterName={this.state.alertClusterName}
                  selectedAlertSubCluster={this.state.selectedAlertSubCluster}
                  alertType={this.state.alertType}
                />
              </Grid>
              <Grid item container>
                <AddNewAlerts
                  dropdownCondition={this.state.conditions}
                  onHandleChange={this.onHandleChange}
                  alertName={this.state.alertName}
                  alertCondition={this.state.alertCondition}
                  onHandleDropdownChange={this.onHandleDropdownChange}
                  alertRadioButton={this.state.alertRadioButton}
                  alertRange={this.state.alertRange}
                  description={this.state.description}
                  // addAlerts={this.addAlerts}
                  openAlert={this.openAlert}
                />
              </Grid>
              <AlertDialog
                title={this.props.alerttitle}
                description={this.props.alertdescription}
                open={this.props.alertOpen}
                type={this.props.alerttype}
                handleClose={this.handleAlertClose}
                onConfirm={this.triggerCommand}
              />
            </Grid>
          </main>
        </div>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => {
  return {
    alerts: state.alertManagementReducer.alerts,
    alertClusters: state.alertManagementReducer.alertClusters,
    alertOpen:state.alertManagementReducer.alertOpen,
    addDeleteSend: state.alertManagementReducer.addDeleteSend,
    alerttype: state.alertManagementReducer.alerttype,
    istypealert: state.alertManagementReducer.istypealert,
    alerttitle: state.alertManagementReducer.alerttitle,
    alertdescription: state.alertManagementReducer.alertdescription,
  };
}
const mapDispatchToProps = dispatch => {
  return {
    setAlertsInfo: (updatedAlerts) => dispatch(actionCreators.setAlertsInfo(updatedAlerts)),
    openAlertBox: (alertParam) => dispatch(actionCreators.openAlertBox(alertParam)),
    fetchAlertsInfo: () => dispatch({ type: actionTypes.SAGA_ALERT_MANAGEMENT_FETCH_ALERTS }),
    fetchAlertsTypeInfo: () => dispatch({ type: actionTypes.SAGA_ALERT_MANAGEMENT_FETCH_ALERTS_TYPE }),
    updateAlertsInfo: (newAlerts) => dispatch({ type: actionTypes.SAGA_ALERT_MANAGEMENT_UPDATE_ALERTS, newAlerts, }),
    deleteAlertsInfo: (deleteAlerts) => dispatch({ type: actionTypes.SAGA_ALERT_MANAGEMENT_DELETE_ALERTS, deleteAlerts, }),
    toggleAlertsInfo: (toggleAlerts) => dispatch({ type: actionTypes.SAGA_ALERT_MANAGEMENT_TOGGLE_ALERTS, toggleAlerts, }),
    addNewAlertsInfo: (addNewAlert) => dispatch({ type: actionTypes.SAGA_ALERT_MANAGEMENT_ADD_NEW_ALERTS, addNewAlert, }),
  };
}

export default withStyles(styles)((connect(mapStateToProps, mapDispatchToProps))(((AlertManagement))));
