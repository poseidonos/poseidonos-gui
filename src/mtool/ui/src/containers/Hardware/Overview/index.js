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


DESCRIPTION: Overview Page Component Tab
@NAME : index.js
@AUTHORS: Jay Hitesh Sanghavi
@Version : 1.0 
@REVISION HISTORY
[03/11/2019] [Jay] : Prototyping..........////////////////////
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles, Grid } from "@material-ui/core";
import ThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import "./overview.css";
import AlertDialog from "../../../components/Dialog";
import { PageTheme, customTheme } from "../../../theme";
import * as actionTypes from "../../../store/actions/actionTypes";
import * as actionCreators from "../../../store/actions/exportActionCreators";
import Chassis from "../../../components/OverviewComponents/Chassis";
import PowerInformation from "../../../components/OverviewComponents/PowerInformation";
// import BmcLogTable from "../../../components/OverviewComponents/BmcLogTable";

const styles = theme => ({
  overviewContainer: {
    margin: 0,
    maxWidth: "100%"
  },
  content: {
    flexGrow: 1,
    width: "100%",
    boxSizing: "border-box",
    padding: theme.spacing(2, 0)
  },
  toolbar: customTheme.toolbar,
  cardHeader: customTheme.card.header,
  overviewPaper: {
    width: "100%"
  }
});

class OverviewTab extends Component {
  constructor(props) {
    super(props);
    this.openAlert = this.openAlert.bind(this);
    this.handleAlertClose = this.handleAlertClose.bind(this);
    this.triggerCommand = this.triggerCommand.bind(this);
  }

  handleAlertClose() {
    this.props.openAlertBox({
      alertOpen: false
    });
  }

  openAlert(operationType) {
    this.props.openAlertBox({
      alertOpen: true,
      addDeleteSend: operationType,
      alerttype: "delete",
      istypealert: false,
      alerttitle: `${operationType} System`,
      alertdescription: `Are you sure you want to ${operationType} the system?`
    });
  }

  triggerCommand() {
    if (this.props.addDeleteSend === "Force Restart Poseidon Box") {
      this.props.rebootSystem();
      this.handleAlertClose();
    }
    else if (this.props.addDeleteSend === "Power Off Poseidon Box") {
      this.props.shutdownSystem();
      this.handleAlertClose();
    }
    else if (this.props.addDeleteSend === "Force Power Off Poseidon Box") {
      this.props.forceShutdownSystem();
      this.handleAlertClose();
    }
    /* istanbul ignore else */
    else if (this.props.addDeleteSend === "Power On Poseidon Box") {
      this.props.powerOnSystem();
      this.handleAlertClose();
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <ThemeProvider theme={PageTheme}>
        <main className={classes.content}>
          <Grid data-testid="OverviewTab-container" container className={classes.overviewContainer}>
            <Grid className={classes.overviewPaper}>
              <Chassis openAlert={this.openAlert} />
              {/* <BmcLogTable
                 bmclogList={this.props.bmclogList}
              /> */}
              <PowerInformation openAlert={this.openAlert} />
            </Grid>
          </Grid>
        </main>
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
    alertOpen: state.alertManagementReducer.alertOpen,
    addDeleteSend: state.alertManagementReducer.addDeleteSend,
    alerttype: state.alertManagementReducer.alerttype,
    istypealert: state.alertManagementReducer.istypealert,
    alerttitle: state.alertManagementReducer.alerttitle,
    alertdescription: state.alertManagementReducer.alertdescription,
    // bmclogList: state.bmcLogReducer.logList,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    rebootSystem: () =>
      dispatch({ type: actionTypes.SAGA_HARDWARE_OVERVIEW_REBOOT_SYSTEM }),
    shutdownSystem: () =>
      dispatch({ type: actionTypes.SAGA_HARDWARE_OVERVIEW_SHUTDOWN_SYSTEM }),
      forceShutdownSystem: () =>
      dispatch({ type: actionTypes.SAGA_HARDWARE_OVERVIEW_FORCE_SHUTDOWN_SYSTEM }),
      powerOnSystem: () =>
      dispatch({ type: actionTypes.SAGA_HARDWARE_OVERVIEW_POWER_ON_SYSTEM }),
      // getBmcLogs: () => dispatch({ type: actionTypes.SAGA_GET_BMC_LOGS }),
      openAlertBox: alertParam =>
      dispatch(actionCreators.openAlertBox(alertParam)),
  };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OverviewTab)
);
