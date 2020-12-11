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


DESCRIPTION: Power Management Page Component Tab
@NAME : index.js
@AUTHORS: Jay Hitesh Sanghavi
@Version : 1.0 
@REVISION HISTORY
[03/11/2019] [Jay] : Prototyping..........////////////////////
*/
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withStyles, Grid, Paper } from '@material-ui/core';
import ThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import AlertDialog from '../../../components/Dialog';
import { PageTheme, customTheme } from '../../../theme';
import * as actionCreators from "../../../store/actions/exportActionCreators";
import PowerSummary from '../../../components/PowerManagementComponents/PowerSummary'
import PowerStateTable from '../../../components/PowerManagementComponents/PowerStateTable'

const styles = (theme) => ({
  powerMgmtContainer: {
    margin: 0,
    maxWidth: "100%"
  },
  content: {
    flexGrow: 1,
    width: '100%',
    boxSizing: 'border-box',
    padding: theme.spacing(2, 0)
  },
  toolbar: customTheme.toolbar,
  cardHeader: customTheme.card.header,
  powerMgmtPaper: {
    width: '100%',
  },
});

class PowerManagement extends Component {
  constructor(props) {
    super(props);
    this.openAlert = this.openAlert.bind(this);
    this.handleAlertClose = this.handleAlertClose.bind(this);
    this.triggerCommand = this.triggerCommand.bind(this);
    this.onHandleChange = this.onHandleChange.bind(this);
    this.state = {
        powermode:'Manual',
    };
  }

  componentDidMount() {
  }

  handleAlertClose() {
    this.props.openAlertBox({
      alertOpen: false
    });
  }

  onHandleChange(event){
      const {name,value} = event.target;
      this.setState({
          ...this.state,
          [name]:value
      });
  }

  openAlert(operationType) {
    this.props.openAlertBox({
      alertOpen: true,
      addDeleteSend: operationType,
      alerttype: 'delete',
      istypealert: false,
      alerttitle: `${operationType} System`,
      alertdescription: `Are you sure you want to ${operationType} the system?`,
    }
    );
  }

  triggerCommand() {
    if (this.props.addDeleteSend === 'Reboot') {
      this.props.rebootSystem();
      this.handleAlertClose();
    } else if (this.props.addDeleteSend === 'Shutdown') {
      this.props.shutdownSystem();
      this.handleAlertClose();
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <ThemeProvider theme={PageTheme}>
        <main className={classes.content}>
          <Grid data-testid="PowerManagement-container" container className={classes.powerMgmtContainer}>
            <Paper className={classes.powerMgmtPaper}>
              <PowerSummary />
              <PowerStateTable powermode={this.state.powermode} handleChange={this.onHandleChange} />
            </Paper>
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
    openAlertBox: (alertParam) => dispatch(actionCreators.openAlertBox(alertParam)),
  };
}

export default withStyles(styles)((connect(mapStateToProps, mapDispatchToProps))(((PowerManagement))));