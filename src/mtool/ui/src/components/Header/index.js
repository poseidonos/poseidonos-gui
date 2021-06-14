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

import React, { Component } from "react";
import { connect } from 'react-redux';

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from '@material-ui/core';
import ThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { withStyles } from '@material-ui/core/styles';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import MenuIcon from '@material-ui/icons/Menu';
import { withRouter } from 'react-router-dom';
import MoreIcon from '@material-ui/icons/MoreVert';
import Loader from 'react-loader-spinner';
import Heading from '../../assets/images/Header-logo.png';
// import Dropdown from './Dropdown';
import AlertDialog from '../Dialog';
import './Header.css';
import Dropdown from './Dropdown';
import MobileMenu from './MobileMenu';
import * as actionTypes from "../../store/actions/actionTypes";
import MToolTheme from "../../theme";
import * as actionCreators from '../../store/actions/exportActionCreators';
import ChangePassword from "../ChangePassword";
import LinearProgressBarComponent from "../IbofOsOperationComponents/LinearProgressBarComponent"

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundImage: 'linear-gradient(to right, #171719, #788595)',
    boxShadow: 'none',
    height:"55px",
    // backgroundColor: theme.palette.primary
  },

  userLink: {
    display: 'flex',
    cursor: 'pointer'
  },
  grow: {
    flexGrow: 1,
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
    alignItems: 'center',
  },
  statusHeader: {
    fontSize: 16,
    padding: 5,
    cursor: 'default',
    height: 65
  },
  sectionNonTiny: {
    display: 'flex',
    [theme.breakpoints.down(500)]: {
      fontSize: 12
    },
    alignItems: 'center',

  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  version: {
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
    marginTop: "2px"
  },
  separator: {
    padding: '0 10px',
    marginTop: '-2px',
  },
  nextSeparator: {
    padding: '0 3px',
    marginTop: '-2px',
  },
  caret: {
    position: 'relative',
    padding: '3px',
    '&:before': {
      content: '',
      position: 'absolute',
      top: 0,
      left: '5px',
      borderTop: '7px solid #eeeeee',
      borderLeft: '7px solid transparent',
      borderRight: '7px solid transparent',
    },
    '&:after': {
      content: '',
      position: 'absolute',
      left: '5px',
      top: 0,
      borderTop: '7px solid #eeeeee',
      borderLeft: '7px solid transparent',
      borderRight: '7px solid transparent',
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
});
class Header extends Component {
  constructor(props) {
    super(props);
    this.renderDropDown = this.renderDropDown.bind(this);
    this.renderPopup = this.renderPopup.bind(this);
    this.closeDropdown = this.closeDropdown.bind(this);
    // this.alertClose = this.alertClose.bind(this);
    // this.onHandleSubmit = this.onHandleSubmit.bind(this);
    this.updateDropdown = this.updateDropdown.bind(this);
    // this.printLastTimestamp = this.printLastTimestamp.bind(this);
    this.userLogout = this.userLogout.bind(this);
    // this.goHome = this.goHome.bind(this);
    this.handleMobileMenuOpen = this.handleMobileMenuOpen.bind(this);
    this.handleMobileMenuClose = this.handleMobileMenuClose.bind(this);
    // this.OnHandleChange = this.OnHandleChange.bind(this);
    this.state = {
      dropdown: false,
      popup: false,
      oldPassword: '',
      newPassword: '',
      msg: '',
      confirmPassword: '',
      userid: localStorage.getItem('userid'),
      alertOpen: false,
      alertType: 'alert',
      title: 'Error',
      style: {
        left: '1000px',
        top: '65px',
      },
      anchorEl: null,
      mobileMoreAnchorEl: null,
      isMobileMenuOpen: false
    };
    this.interval = null;
  }


  componentDidMount() {
    this.props.getIbofOSTimeInterval();
    window.addEventListener("resize", this.updateDropdown);
    // document.addEventListener('mousedown', this.handleClickOutside);
    clearInterval(this.interval);
    const val = this.props.timeintervalue;
    this.interval = setInterval(() => {
      this.IsIbofOSRunning();
    },(val || 4)*1000);
  }

  componentDidUpdate(){
    const val = this.props.timeintervalue;
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.IsIbofOSRunning();
    },(val || 4)*1000);
  }

  componentWillUnmount() {
    // document.removeEventListener('mousedown', this.handleClickOutside);
    window.removeEventListener('resize', this.updateDropdown);
    clearInterval(this.interval);
  }

  // istanbul ignore next
  handleMobileMenuClose() {
    this.setState({
      ...this.state,
      mobileMoreAnchorEl: null,
      isMobileMenuOpen: false
    });
  }

  handleMobileMenuOpen(event) {
    this.setState({
      ...this.state,
      isMobileMenuOpen: true,
      mobileMoreAnchorEl: event.currentTarget
    });

  }

  // Disabling for PoC1

  // onHandleSubmit() {
  //   if (!this.state.oldPassword) {
  //     this.setState({
  //       ...this.state,
  //       msg: 'Enter your old Password',
  //       alertOpen: true,
  //       // title: "Error",
  //       title: 'Change Password',
  //       alertType: 'alert',
  //     });
  //   } else if (!this.state.newPassword || !this.state.confirmPassword) {
  //     this.setState({
  //       ...this.state,
  //       msg: 'Enter a valid Password',
  //       alertOpen: true,
  //       // title: "Error",
  //       title: 'Change Password',
  //       alertType: 'alert',
  //     });
  //   } else if (this.state.newPassword !== this.state.confirmPassword) {
  //     this.setState({
  //       ...this.state,
  //       msg: 'Passwords do not match',
  //       alertOpen: true,
  //       // title: "Error",
  //       title: 'Change Password',
  //       alertType: 'alert',
  //     });
  //   } else {
  //     fetch('/api/v1.0/update_password/', {
  //       method: 'POST',
  //       headers: {
  //         Accept: 'application/json',
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         oldPassword: this.state.oldPassword,
  //         newPassword: this.state.newPassword,
  //         confirmPassword: this.state.confirmPassword,
  //         userid: this.state.userid
  //       }),
  //     }).then(result => {
  //       if (result.status === 200) {
  //         this.setState({
  //           ...this.state,
  //           msg: 'Password changed successfully',
  //           alertOpen: true,
  //           // title: "Success",
  //           title: 'Change Password',
  //           alertType: 'info',
  //         });
  //         this.setState({
  //           dropdown: false,
  //           popup: false,
  //           oldPassword: '',
  //           newPassword: '',
  //           confirmPassword: '',
  //         });
  //       } else if (result.status === 401) {
  //         this.props.history.push('/');
  //       } else {
  //         this.setState({
  //           ...this.state,
  //           msg: 'Error in setting Password',
  //           alertOpen: true,
  //           alertType: 'alert',
  //           // title: "Error"
  //           title: 'Change Password',
  //         });
  //       }
  //     });
  //   }
  // }

  // Disabling For PoC1
  // OnHandleChange(event) {
  //   const { name, value } = event.target;
  //   this.setState({ 
  //     ...this.state, 
  //     [name]: value 
  //   });
  // }

  IsIbofOSRunning() {
    this.props.Get_Is_iBOFOS_Running_Status({push: this.props.history.push, resetIsLoggedIn: this.props.resetIsLoggedIn});
  }

  // istanbul ignore next
  closeDropdown() {
    this.setState({
      ...this.state,
      dropdown: false,
    });
  }

  updateDropdown() {
    const left =
      document.getElementById('user-link').getBoundingClientRect().left - 50;
    this.setState({
      ...this.state,
      style: {
        ...this.state.style,
        left: `${left}px`,
      },
    });
  }

  // Disabling for PoC1
  // alertClose() {
  //   this.setState({
  //     ...this.state,
  //     alertOpen: false,
  //   });
  // }

  // goHome() {
  //   this.props.history.push('/dashboard');
  // }

  // printLastTimestamp(value) {
  //   this.setState({
  //     ...this.state,
  //     timestamp: value,
  //   });
  // }

  userLogout() {
    localStorage.setItem("user", null);
    this.props.resetIsLoggedIn();
    this.props.history.push('/');
  }

  // istanbul ignore next
  renderPopup() {
    const popup = !this.state.popup;
    this.setState({
      ...this.state,
      popup,
      dropdown: false,
      isMobileMenuOpen: false
    });
  }

  renderDropDown(event) {
    const dropdown = !this.state.dropdown;
    this.setState({
      ...this.state,
      dropdown,
      anchorEl: event.currentTarget,
    });
  }

  render() {
    const username = localStorage.getItem('userid');
    const { classes } = this.props;
    const mobileMenuId = 'primary-search-account-menu-mobile';
    return (
      <ThemeProvider data-testid="headerTag" theme={MToolTheme}>
        <AppBar className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              className={classes.menuButton}
              onClick={this.props.toggleDrawer}
              data-testid="sidebar-toggle"
            >
              <MenuIcon />
            </IconButton>
            <img
              src={Heading}
              style={{ cursor: 'default', marginBottom: '0.4rem' }}
              alt="Poseidon Management Tool"
            />
            <Typography className={classes.version} variant="caption" display="block">
              Version 0.2.96
            </Typography>
            <div className={classes.grow} />
              <span
                className={`${classes.statusHeader} ${classes.sectionNonTiny}`}
                title="Poseidon OS last running timestamp"
              >
                Last Updated: {this.props.timestamp === "" ?
                  <Loader type="Bars" color="#FFFFFF" height={20} width={20} /> : this.props.timestamp}
              </span>
              <Typography className={`${classes.separator} ${classes.sectionNonTiny}`}>|</Typography>
              <Typography className={classes.nextSeparator}>Status:</Typography>
              <Typography className={classes.nextSeparator} />
              {this.props.status ? (
                <Typography
                  className={classes.running}
                  style={{ color: 'rgb(61, 249, 50)' }}
                >
                  Running
                </Typography>
              ) : (
                  <Typography
                    className={classes.notRunning}
                    style={{ color: 'rgb(243, 168, 55)'}}
                  >
                    {this.props.OS_Running_Status === "..." ?
                        <Loader type="Bars" color="#FFFFFF" height={20} width={20} /> : this.props.OS_Running_Status}
                  </Typography>
                )}
            <div className={classes.sectionDesktop}>

              {this.props.OS_Running_Status !== 'Not Running' && this.props.OS_Running_Status !== 'Running' ? (
                <LinearProgressBarComponent
                  percent={localStorage.getItem('Rebuilding_Value')}
                />
              ) : null}


              {/* <Typography className={classes.separator}>|</Typography>
              <Typography>
                <a href={PDF} target="_blank" rel="noopener noreferrer">
                  Help
                </a>
              </Typography> */}
              <Typography className={classes.separator}>|</Typography>
              <span
                className={`${classes.userLink} ${
                  window.location.href.indexOf('user') > 0 /* istanbul ignore next */ ? 'active' : ''
                  }`}
	        aria-hidden="true"
                id="user-link"
                data-testid="header-dropdown"
                onClick={this.renderDropDown}
              >
                <Typography>{username}</Typography>
                <ArrowDropDown />
              </span>
              <Dropdown
                anchorEl={this.state.anchorEl}
                dropdown={this.state.dropdown}
                closeDropdown={this.closeDropdown}
                renderPopup={this.renderPopup}
                userLogout={this.userLogout}
              />
              <Typography className={classes.separator}>|</Typography>
              {/* <Typography>
                <select defaultValue="english">
                  <option value="english">English</option>
                </select>
              </Typography>
              <Typography className={classes.separator}>|</Typography>
              <Typography>Support</Typography>
              <Typography className={classes.separator}>|</Typography> */}
            </div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={this.handleMobileMenuOpen}
                color="inherit"
                data-testid="mobile-show-more"
              >
                <MoreIcon />
              </IconButton>
            </div>
            <MobileMenu
              mobileMoreAnchorEl={this.state.mobileMoreAnchorEl}
              mobileMenuId={mobileMenuId}
              isMobileMenuOpen={this.state.isMobileMenuOpen}
              handleMobileMenuClose={this.handleMobileMenuClose}
              renderPopup={this.renderPopup}
              userLogout={this.userLogout}
              username={username}
            />
          </Toolbar>
        </AppBar>
        {/* istanbul ignore next */this.state.popup ? (
          <ChangePassword
            open={this.state.popup}
            oldPassword={this.state.oldPassword}
            confirmPassword={this.state.confirmPassword}
            newPassword={this.state.newPassword}
            OnHandleChange={this.OnHandleChange}
            onConfirm={this.onHandleSubmit}
            handleClose={this.renderPopup}
          />
        ) : null}

        <AlertDialog
          title={this.state.title}
          type={this.state.alertType}
          description={this.state.msg}
          open={this.state.alertOpen}
          handleClose={this.alertClose}
        />
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => {  
  return {
    timestamp: state.headerReducer.timestamp,
    status: state.headerReducer.status,
    OS_Running_Status: state.headerReducer.OS_Running_Status,
    timeintervalue: state.configurationsettingReducer.timeinterval,
  };
}
const mapDispatchToProps = dispatch => {
  return {
    getIbofOSTimeInterval: () => dispatch({ type: actionTypes.SAGA_GET_IBOFOS_TIME_INTERVAL, }),
    Get_Is_iBOFOS_Running_Status: (payload) => dispatch({ type: actionTypes.SAGA_GET_IS_IBOF_OS_RUNNING, payload }),
    resetIsLoggedIn: () => dispatch(actionCreators.resetIsLoggedIn()),
  };
}
export default withStyles(styles)((connect(mapStateToProps, mapDispatchToProps))(withRouter(Header)));
