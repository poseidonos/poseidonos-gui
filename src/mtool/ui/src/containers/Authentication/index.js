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
 *     * Neither the name of Samsung Electronics Corporation nor the names of its
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
import { MuiThemeProvider as ThemeProvider, withStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Transition } from 'react-transition-group';
import CssBaseline from '@material-ui/core/CssBaseline';
import CardMedia from '@material-ui/core/CardMedia';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { connect } from 'react-redux';
import MToolTheme from '../../theme';
import './Authentication.css';
import PoseidonLogo from '../../assets/images/Poseidon.png';
import * as actionTypes from '../../store/actions/actionTypes';
import * as actionCreators from '../../store/actions/exportActionCreators';

const styles = theme => ({
  container: {
    width: '100vw',
    height: '100vh',
    backgroundImage: 'linear-gradient(to bottom right, #171719, #788595)',
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    padding: "12px"
  },

  cardmedia: {
    backgroundSize: 'auto',
    alt: 'Poseidon Management Tool',
    width: 'auto',
    height: '50px',
    clear: 'right'
  },

  main: {
    display: "flex",
    justifyContent: "center",
  },
  
  configPaper: {
    height: 450,
    maxWidth: 600,
    minWidth: 450,
    padding: theme.spacing(6, 8),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: "space-between",
    alignItems: 'center',
    backgroundImage: 'linear-gradient(to bottom right, #171719, #464C55)',
  },

  loginPaper: {
    height: 450,
    width: 600,
    padding: theme.spacing(6, 8),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: "space-between",
    alignItems: 'center',
    backgroundImage: 'linear-gradient(to bottom right, #171719, #464C55)',
  },

  header: {
    marginTop: 0,
    marginBottom: theme.spacing(1),
    color: "white",
  },

  form: {
    width: '100%',
  },

  apiForm: {
    display: "grid",
    gridTemplateColumns: "65% auto",
    gap: "8%"
  },

  textField: {
    background: 'rgba(255, 255, 255, 0.87)',
    marginBottom: theme.spacing(2),
    height: '36px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    borderRadius: '4px',
    '&>input': {
      paddingRight: '40px',
    },
  },

  input: {
    height: '100px',
    color: 'black',
    outline: 'none',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
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

  configDetails: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#ccd3db",
  },

  apiDetails: {
    width: "280px",
    display: "flex",
    justifyContent: "space-between",
    marginTop: theme.spacing(1),
  },

  submit: {
    background: '#788595',
  },

  editOutlinedButton: {
    border: "2px solid #ccd3db",
    fontWeight: "bold",
    color: "#ccd3db"
  },

  poseidonLogo: {
    height: 75,
    width: 'auto',
    backgroundSize: 'contain',
  },
});

class Authentication extends Component {
  constructor(props) {
    super(props);
    // localStorage.clear();
    this.state = {
      showConfigurations: true,
      showPassword: false,
    }
    this.handleLogInSubmit = this.handleLogInSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
  }

  UNSAFE_componentWillMount() {
    this.props.i18n.changeLanguage(this.props.lang);
  }

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleLogInSubmit(event) {
    event.preventDefault();
    const payload = {
      username: this.props.username,
      password: this.props.password,
    }
    this.props.login(payload, this.props.history);
  }
  
  handleChange(event) {
    const { name, value } = event.target;
    const payload = {
      name,
      value,
    };
    this.props.changeCredentials(payload);
  }

  render() {
    const { t } = this.props;
    const { classes } = this.props;
    if (this.props.isLoggedIn) {
      return <Redirect to="/dashboard" />;
    }
    return (
      <ThemeProvider theme={MToolTheme}>
        <CssBaseline />
        <div className={classes.container}>
          <div></div> {/*For easy to manage flex*/}
          <main className={classes.main}>
            <Transition
              mountOnEnter
              unmountOnExit
              in={this.state.showConfigurations}
              timeout={200}
            >
              {state => (
                <Paper
                  className={classes.configPaper}
                  style={{
                    transition: "all 200ms ease-out",
                    opacity: state === "exited" ? 0 : 1,
                    transform: state === "exited" ? "translateX(0%) scale(0%)" : "translateX(37.5%) scale(100%)",
                    zIndex: state === "exited" ? 10 : 20,
                    flexGrow: state === "exited" ? 0 : 1,
                  }}
                >
                  <h1 className={classes.header}>Configurations</h1>
                  <form className={classes.form} >
                    <h3 className={classes.header}>Rest API</h3>
                    <div className={classes.apiForm}>
                      <Input
                        required
                        fullWidth
                        data-testid="restIPInput"
                        id="restIP"
                        placeholder={t('IP Address')}
                        name="restIP"
                        className={classes.textField}
                        onChange={this.handleChange}
                      />
                      <Input
                        required
                        fullWidth
                        data-testid="restPortInput"
                        id="restPort"
                        placeholder={t('Port')}
                        name="restPort"
                        className={classes.textField}
                        onChange={this.handleChange}
                      />
                    </div>
                    <h3 className={classes.header}>Telemetry API</h3>
                    <div className={classes.apiForm}>
                      <Input
                        required
                        fullWidth
                        data-testid="telemetryIPInput"
                        id="telemetryIP"
                        placeholder={t('IP Address')}
                        name="telemetryIP"
                        className={classes.textField}
                        onChange={this.handleChange}
                      />
                      <Input
                        required
                        fullWidth
                        data-testid="telemetryPortInput"
                        id="telemetryPort"
                        placeholder={t('Port')}
                        name="telemetryPort"
                        className={classes.textField}
                        onChange={this.handleChange}
                      />
                    </div>
                    <Button
                      // type="submit"
                      data-testid="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                      onClick={() => this.setState({ showConfigurations: false })}
                    >
                      {t('Save')}
                    </Button>
                    {this.props.loginFailed ? (
                      <Typography
                        variant="caption"
                        component="span"
                        data-testid="errorMsg"
                        style={{ marginLeft: '10%;', color: 'red' }}
                      >
                        {t('Login failed! Invalid id or password')}
                      </Typography>
                    ) : (
                      <span>&nbsp;</span>
                    )}
                  </form>
                  <div></div> {/*For easy to manage flex*/}
                </Paper>
              )}
            </Transition>
            <Transition
              in={!this.state.showConfigurations}
              timeout={200}
            >
              {state => (
                <Paper
                  className={classes.loginPaper}
                  style={{
                    transition: "all 200ms ease-out",
                    zIndex: state === "exited" ? 10 : 20,
                    transform: state === "exited" ? "scale(0.8)" : "scale(1)",
                    transformOrigin: state === "exited" ? "left" : "none",
                    opacity: state === "exited" ? 0.4 : 1,
                  }}
                >
                  <h1 className={classes.header}>LOG IN</h1>
                  <form className={classes.form} onSubmit={this.handleLogInSubmit}>
                    <Input
                      required
                      fullWidth
                      data-testid="usernameInput"
                      id="email"
                      placeholder={t('Username')}
                      name="username"
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
                      data-testid="passwordInput"
                      placeholder={t('Password')}
                      name="password"
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
                              data-testid="visibilityButton"
                            >
                              {this.state.showPassword ? (
                                <Visibility data-testid="showPassword" />
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
                      data-testid="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                    >
                      {t('Login')}
                    </Button>
                    {this.props.loginFailed ? (
                      <Typography
                        variant="caption"
                        component="span"
                        data-testid="errorMsg"
                        style={{ marginLeft: '10%;', color: 'red' }}
                      >
                        {t('Login failed! Invalid id or password')}
                      </Typography>
                    ) : (
                      <span>&nbsp;</span>
                    )}
                  </form>
                  <div className={classes.configDetails}>
                    <div>
                      <div className={classes.apiDetails}>
                        <Typography>Rest API</Typography>
                        <Typography>107.108.221.146<b>:</b>3002</Typography>
                      </div>
                      <div className={classes.apiDetails}>
                        <Typography>Telemetry API</Typography>
                        <Typography>107.108.221.146<b>:</b>2112</Typography>
                      </div>
                    </div>
                    <Button variant="outlined" className={classes.editOutlinedButton} onClick={() => this.setState({ showConfigurations: true })}>Edit Config</Button>
                  </div>
                </Paper>
              )
              }
            </Transition>
          </main>
          <CardMedia image={PoseidonLogo} className={classes.poseidonLogo} />
        </div>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => {
  return {
    username: state.authenticationReducer.username,
    password: state.authenticationReducer.password,
    loginFailed: state.authenticationReducer.loginFailed,
    isLoggedIn: state.authenticationReducer.isLoggedIn,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeCredentials: payload => dispatch(actionCreators.changeCredentials(payload)),
    login: (data, fn) =>

      dispatch({ type: actionTypes.SAGA_LOGIN, payload: data, history: fn }),
  };
};

Authentication.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

Authentication.defaultProps = {
  history: {
    push: () => { },
  },
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation('translations')(Authentication))
);
