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
import ThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import CardMedia from '@material-ui/core/CardMedia';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { connect } from 'react-redux';
import Heading from '../../assets/images/Header-logo.png';
import MToolTheme from '../../theme';
import './Authentication.css';
import PoseidonLogo from '../../assets/images/Poseidon.png';
import * as actionTypes from '../../store/actions/actionTypes';
import * as actionCreators from '../../store/actions/exportActionCreators';

const styles = theme => ({
  container: {
    height: '97vh',
    display: 'flex',
  },
  LoginContainer: {
    width: '60%',
    // backgroundImage: 'linear-gradient(to bottom right, #14161f, #304eb1)',
    backgroundImage: 'linear-gradient(to bottom right, #171719, #788595)',
    // backgroundImage: 'linear-gradient(to bottom  , #000000, #f1f0f0)',
    border: '1px solid black',
    height: '500px',
    margin: 'auto',
    alignItems: 'center',
    position: 'relative',
  },

  formControl: {
    float: 'right',
    width: '95px',
    fontSize: '1px',
  },

  cardmedia: {
    backgroundSize: 'auto',
    alt: 'Samsung iBoF Management Tool',
    width: 'auto',
    height: '50px',
    clear: 'right',
    marginBottom: '100px',
  },

  paper: {
    marginTop: theme.spacing(8),
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

  poseidonLogo: {
    margin: 'auto',
    position: 'absolute',
    height: 75,
    width: 'auto',
    marginBottom: '0',
    left: '0',
    bottom: '0',
    right: '0',
    backgroundSize: 'contain',
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

  selectmenu: {
    background: '#202e5e',
    border: 'none',
    outline: 'none',
    marginTop: '5px',
    marginBottom: '10px',
    color: 'rgba(255, 255, 255, 0.87)',
    fontSize: '12px',
    width: '70px',
    paddingRight: '2px',
    textAlignLast: 'center',
    height: '20px',
  },

  select: {
    border: 'none',
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.87)',
    textAlignLast: 'center',
    height: '20px',
    outline: 'none',
    marginTop: '5px',
    marginBottom: '0px',
    width: '70px',
    textDecoration: 'none',
    paddingBottom: '0px',

    '&:before': {
      borderBottom: 'none',
    },

    '&:hover:not(.Mui-disabled):before': {
      borderBottom: 'none',
    },

    '&:after': {
      borderBottom: 'none',
    },
  },

  root: {
    borderBottom: 'none',
  },
  icon: {
    fill: 'white',
  },

  menuText: {
    fontSize: '12px',
    minHeight: '0px',
    textAlign: 'left',
  },

  ul: {
    color: 'rgba(255, 255, 255, 0.87)',
    // background: 'rgba(45, 71, 159, 1)',
    background: 'rgb(111, 122, 137)',

    marginLeft: '-4px',
    borderRadius: '0px',

    '&>ul': {
      paddingTop: '0px',
      textAlign: 'left',
    },
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

class Authentication extends Component {
  constructor(props) {
    super(props);
    localStorage.clear();
    // if (localStorage.getItem('isLoggedIn') === true) {
    //   this.props.history.push('/dashboard');
    // }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    // this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
    this.state = {
      showPassword: false,
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    this.props.i18n.changeLanguage(this.props.lang);
  }

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  // handleLanguageChange = event => {
  //   this.props.changeLanguage(event.target.value);
  //   this.props.i18n.changeLanguage(event.target.value);
  // };

  handleSubmit(event) {
    event.preventDefault();
    const payload= {
      username: this.props.username,
      password: this.props.password,
    }
    this.props.login(payload, this.props.history);
  }

  handleChange(event) {
    const { name, value } = event.target;
    const payload ={
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
        <Container className={classes.container}>
          <Paper xs={12} className={classes.LoginContainer}>
            {/* <FormControl className={classes.formControl}>
              <Select
              
              SelectDisplayProps={{
                'data-testid': 'selectDropdown'
              }}
                value={this.props.lang}
                onChange={this.handleLanguageChange}
                className={classes.select}
                data-testid = "languageSelect"
                MenuProps={{
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left',
                  },
                  getContentAnchorEl: null,
                  classes: {
                    paper: classes.ul,
                  },
                }}
                inputProps={{
                  classes: {
                    root: classes.border,
                    icon: classes.icon,
                  },
                }}
              >
                <MenuItem className={classes.menuText} value={'en'} data-testid = "englishSelect">
                  English
                </MenuItem>
                <MenuItem className={classes.menuText} value={'ko'} data-testid = "koreanSelect">
                  한국어
                </MenuItem>
              </Select>
            </FormControl> */}
            <CardMedia className={classes.cardmedia} image={Heading} />

            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <div className={classes.paper}>
                <form className={classes.form} onSubmit={this.handleSubmit}>
                  <Input
                    required
                    fullWidth
                    data-testid= "usernameInput"
                    id="email"
                    placeholder={t('Username')}
                    InputProps={{
                      className: classes.input,
                     // 'data-testid': "usernameInput"
                    }}
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
                    data-testid= "passwordInput"
                    placeholder={t('Password')}
                    name="password"
                    InputProps={{
                      className: classes.input,
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
                    {t('Login')}
                  </Button>
                </form>
                {this.props.loginFailed ? (
                  <Typography
                    variant="caption"
                    component="span"
                    data-testid = "errorMsg"
                    style={{ marginLeft: '10%;', color: 'red' }}
                  >
                    {t('Login failed! Invalid id or password')}
                  </Typography>
                ) : (
                  <span>&nbsp;</span>
                )}
              </div>
            </Container>
            <CardMedia image={PoseidonLogo} className={classes.poseidonLogo} />
          </Paper>
        </Container>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => {
  return {
    // lang: state.headerLanguageReducer.lang,
    username: state.authenticationReducer.username,
    password: state.authenticationReducer.password,
    loginFailed: state.authenticationReducer.loginFailed,
    isLoggedIn: state.authenticationReducer.isLoggedIn,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // changeLanguage: val => dispatch(actionCreators.changeLanguage(val)),
    changeCredentials: payload => dispatch(actionCreators.changeCredentials(payload)),
    login: (data, fn) =>

    dispatch({ type: actionTypes.SAGA_LOGIN, payload: data, history: fn}),
  };
};

Authentication.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

Authentication.defaultProps = {
  history: {
    push: () => {},
  },
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation('translations')(Authentication))
);
