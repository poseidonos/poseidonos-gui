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


DESCRIPTION: Hardware Page Container
@NAME : index.js
@AUTHORS: Jay Hitesh Sanghavi
@Version : 1.0 
@REVISION HISTORY
[03/11/2019] [Jay] : Prototyping..........////////////////////
*/
import React, { Component } from 'react';
import ThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { AppBar, Tabs, Tab } from '@material-ui/core';
import { Route, Switch, withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import AccountCircle from '@material-ui/icons/AccountCircle';

import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import OverviewTab from './Overview';
import HealthTab from './Health';
import DrivesTab from './Drives';
import Sensors from './Sensors'
import PowerManagement from './PowerManagement';
import MToolTheme , { customTheme } from '../../theme';
// import MToolLoader from '../../components/MToolLoader';
import './hardware.css';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import * as actionTypes from '../../store/actions/actionTypes';
import * as actionCreators from '../../store/actions/exportActionCreators';

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
  },

  paper: {
    marginTop: "47vh",
    justifyContent:'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  submit: {
    margin: theme.spacing(3, 0, 2),
    // background: '#007bff',
    background: '#788595',
    fontSize: '12px',
    marginTop: '0px',
    marginBottom: '0px',
  },

  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },

  input: {
    height: '100px',
    color: 'black',
    outline: 'none',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },

  textField: {
    background: 'rgba(255, 255, 255, 0.87)',
    marginBottom: '20px',
    height: '30px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    borderRadius: '4px',
    '&>input': {
      paddingRight: '40px',
    },
  },
  inputAdornment: {
    position: 'absolute',
    right: 0,
    paddingRight: '13px',
    opacity: 0.6,
  },
  passwordAdornment: {
    position: 'absolute',
    right: 0,
  },
});

class Hardware extends Component {
  constructor(props) {
    super(props);
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
    this.state = {
      mobileOpen: false,
      value: 0,
      showPassword: false,
    };
  }

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleSubmit(event) {
    event.preventDefault();
    const payload= {
      username: this.props.bmc_username,
      password: this.props.bmc_password,
    }
    this.props.bmc_login(payload, this.props.history);
  }

  handleChange(event) {
    const { name, value } = event.target;
    const payload ={
      name,
      value,
    };
    this.props.BMCChangeCredentials(payload);
  }

  handleTabChange(event, newValue) {
    // if (newValue === 'Overview') {
    //   this.componentDidMount();
    // }
    if (newValue === 'Sensors')
      this.props.history.push(`/Hardware/Sensors/Power`);
    else this.props.history.push(`/Hardware/${newValue}`);
  }


  handleDrawerToggle() {
    this.setState({
      mobileOpen: !this.state.mobileOpen,
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <ThemeProvider theme={MToolTheme}>
        <div className={classes.configurationContainer} data-testid="HardwareBMCPage">
          <Header toggleDrawer={this.handleDrawerToggle} />
          <Sidebar
            mobileOpen={this.state.mobileOpen}
            toggleDrawer={this.handleDrawerToggle}
          />
          { localStorage.getItem('BMC_LoggedIn') === "false" ?
          (
          <Container component="main" maxWidth="xs">
              <CssBaseline />
              <div className={classes.paper}>
                <form className={classes.form} onSubmit={this.handleSubmit}>
                  <Input
                    required
                    fullWidth
                    id="email"
                    placeholder="BMC Username"
                    inputProps={{
                      className: classes.input,
                     'data-testid': "usernameInput"
                    }}
                    name="bmc_username"
                    className={classes.textField}
                    onChange={this.handleChange}
                    endAdornment={
                      (
                      <InputAdornment
                        className={classes.inputAdornment}
                        position="end"
                      >
                        <AccountCircle />
                      </InputAdornment>
                      )
                    }
                  />
                  <Input
                    required
                    fullWidth
                    placeholder="BMC Password"
                    name="bmc_password"
                    inputProps={{
                      className: classes.input,
                      'data-testid': "passwordInput"
                    }}
                    type={this.state.showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    className={classes.textField}
                    onChange={this.handleChange}
                    endAdornment={
                      (
                      <InputAdornment
                        className={classes.passwordAdornment}
                        position="end"
                      >
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={this.handleClickShowPassword}
                          data-testid = "visibilityButton"
                        >
                          {this.state.showPassword ? (
                            <Visibility data-testid = "showPassword" />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                      )
                    }
                  />
                  <Button
                    type="submit"
                    data-testid= "submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                  >
                    Login
                  </Button>
                </form>
                {this.props.bmc_loginFailed ? (
                  <Typography
                    variant="caption"
                    component="span"
                    data-testid = "errorMsg"
                    style={{ marginLeft: '10%', color: 'red' }}
                  >
                    Login failed! Invalid id or password
                  </Typography>
                ) : (
                  <span>&nbsp;</span>
                )}
              </div>
          </Container>
    )
          :
          (  
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <AppBar position="static" color="default">
              <Tabs
                variant="fullWidth" 
                value={this.state.value}
                onChange={this.handleTabChange}
              >
                <Tab label="Overview" data-testid="OverviewTab" key="Overview" value="Overview" className={(window.location.href.indexOf('Overview') > 0 ? classes.selectedTab : null)} />
                <Tab label="Health" data-testid="HealthTab" key="Health" value="Health" className={(window.location.href.indexOf('Health') > 0 ? classes.selectedTab : null)} />
                <Tab label="Drive" data-testid="DriveTab" key="Drive" value="Drive" className={(window.location.href.indexOf('Drive') > 0 ? classes.selectedTab : null)} />
                <Tab label="Sensors" data-testid="SensorsTab" key="Sensors" value="Sensors" className={(window.location.href.indexOf('Sensors') > 0 ? classes.selectedTab : null)} />
                <Tab label="Power Management" data-testid="PowerManagementTab" key="PowerManagement" value="PowerManagement" className={(window.location.href.indexOf('PowerManagement') > 0 ? classes.selectedTab : null)} />
              </Tabs>
            </AppBar>
            <Switch>
              <Route exact path="/Hardware/Overview">
                <OverviewTab />
              </Route>
              <Route path="/Hardware/Health">
                <HealthTab />
              </Route>
              <Route path="/Hardware/Drive">
                <DrivesTab />
              </Route>
              <Route path="/Hardware/Sensors/*">
                <Sensors />
              </Route>
              <Route path="/Hardware/PowerManagement">
                <PowerManagement />
              </Route>
            </Switch>
          </main>
          )
  }
          {/* {this.props.loading ? <MToolLoader text={this.props.loadText} /> : null} */}
        </div>     
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.waitLoaderReducer.loading,
    loadText:state.waitLoaderReducer.loadText,
    bmc_username: state.BMCAuthenticationReducer.bmc_username,
    bmc_password: state.BMCAuthenticationReducer.bmc_password,
    bmc_loginFailed: state.BMCAuthenticationReducer.bmc_loginFailed,
    bmc_isLoggedIn: state.BMCAuthenticationReducer.bmc_isLoggedIn,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    BMCChangeCredentials: payload => dispatch(actionCreators.BMCChangeCredentials(payload)),
    bmc_login: (data, fn) => dispatch({ type: actionTypes.SAGA_BMC_LOGIN, payload: data, history: fn}),
  };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withRouter(Hardware))
);
