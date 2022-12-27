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

import React, { Component } from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Loader from 'react-loader-spinner';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip
} from '@material-ui/core';
import { AccessTime } from "@material-ui/icons";
import { withStyles, MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import MenuIcon from '@material-ui/icons/Menu';
import MoreIcon from '@material-ui/icons/MoreVert';

import Heading from '../../assets/images/Header-logo.png';
// import Dropdown from './Dropdown';
import AlertDialog from '../Dialog';
import './Header.css';
import Dropdown from './Dropdown';
import MobileMenu from './MobileMenu';
import * as actionTypes from "../../store/actions/actionTypes";
import MToolTheme, { customTheme } from "../../theme";
import * as actionCreators from '../../store/actions/exportActionCreators';
import ChangePassword from "../ChangePassword";
import LinearProgressBarComponent from "../IbofOsOperationComponents/LinearProgressBarComponent"

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundImage: 'linear-gradient(to right, #171719, #788595)',
    boxShadow: 'none',
    height: 62,
    // backgroundColor: theme.palette.primary
  },

  userLink: {
    display: 'flex',
    cursor: 'pointer'
  },
  grow: {
    flexGrow: 1,
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('450')]: {
      flexDirection: 'column'
    }
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
    alignItems: 'center',
  },
  logoImg: {
    cursor: 'default',
  },
  statusHeader: {
    fontSize: 16,
    padding: 5,
    cursor: 'default',
    height: 65
  },
  running: {
    color: customTheme.palette.success.light
  },
  notRunning: {
    color: customTheme.palette.warning.light
  },
  infoOutlined: {
    marginLeft: 4,
    width: 18
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
    alignSelf: 'flex-end',
    marginTop: 2,
    [theme.breakpoints.down('md')]: {
      marginTop: 0
    }
  },
  separator: {
    padding: '0 10px',
    marginTop: '-2px',
  },
  nextSeparator: {
    padding: '0 3px',
    marginTop: '-2px',
  },
  username: {
    maxWidth: 250,
    overflow: "hidden",
    textOverflow: "ellipsis"
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
    marginRight: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  tooltip: {
    backgroundColor: "#f5f5f9",
    opacity: 1,
    color: "rgba(0, 0, 0, 1)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(16),
    border: "1px solid #dadde9",
    "& b": {
      fontWeight: theme.typography.fontWeightMedium,
    },
  },
});
class Header extends Component {
  constructor(props) {
    super(props);
    this.renderDropDown = this.renderDropDown.bind(this);
    this.renderPopup = this.renderPopup.bind(this);
    this.closeDropdown = this.closeDropdown.bind(this);
    this.alertClose = this.alertClose.bind(this);
    this.onHandleSubmit = this.onHandleSubmit.bind(this);
    this.updateDropdown = this.updateDropdown.bind(this);
    // this.printLastTimestamp = this.printLastTimestamp.bind(this);
    this.userLogout = this.userLogout.bind(this);
    // this.goHome = this.goHome.bind(this);
    this.handleMobileMenuOpen = this.handleMobileMenuOpen.bind(this);
    this.handleMobileMenuClose = this.handleMobileMenuClose.bind(this);
    this.OnHandleChange = this.OnHandleChange.bind(this);
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
      alertLink: null,
      alertRemoveCrossButton: false,
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
    this.props.getPOSInfo();
    window.addEventListener("resize", this.updateDropdown);
    // document.addEventListener('mousedown', this.handleClickOutside);
    clearInterval(this.interval);
    const val = this.props.timeintervalue;
    this.interval = setInterval(() => {
      if(this.props.statusCheckDone) {
        this.IsIbofOSRunning();
      }
    }, (val || 4) * 1000);
  }

  componentDidUpdate() {
    const val = this.props.timeintervalue;
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      if(this.props.statusCheckDone) {
        this.IsIbofOSRunning();
      }
    }, (val || 4) * 1000);
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

  onHandleSubmit() {
    if (!this.state.oldPassword) {
      this.setState({
        ...this.state,
        msg: 'Enter your old Password',
        alertOpen: true,
        // title: "Error",
        title: 'Change Password',
        alertType: 'alert',
      });
    } else if (!this.state.newPassword || !this.state.confirmPassword) {
      this.setState({
        ...this.state,
        msg: 'Enter a valid Password',
        alertOpen: true,
        // title: "Error",
        title: 'Change Password',
        alertType: 'alert',
      });
    } else if (this.state.newPassword !== this.state.confirmPassword) {
      this.setState({
        ...this.state,
        msg: 'Passwords do not match',
        alertOpen: true,
        // title: "Error",
        title: 'Change Password',
        alertType: 'alert',
      });
    } else if (this.state.newPassword.length < 8 || this.state.newPassword.length > 64) {
      this.setState({
        ...this.state,
        msg: 'Password length should be between 8-64 characters',
        alertOpen: true,
        // title: "Error",
        title: 'Change Password',
        alertType: 'alert',
      });
    } else if (this.state.oldPassword === this.state.newPassword) {
      this.setState({
        ...this.state,
        msg: 'New Password cannot be same as old password',
        alertOpen: true,
        title: 'Change Password',
        alertType: 'alert',
      });
    } else {
      fetch('/api/v1.0/update_password/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldPassword: this.state.oldPassword,
          newPassword: this.state.newPassword,
          confirmPassword: this.state.confirmPassword,
          userid: this.state.userid
        }),
      }).then(result => {
        if (result.status === 200) {
          this.setState({
            ...this.state,
            msg: 'Password changed successfully',
            alertOpen: true,
            title: 'Change Password',
            alertType: 'info',
            alertLink: '/',
            alertRemoveCrossButton: true,
          });
          this.setState({
            dropdown: false,
            popup: false,
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
          localStorage.setItem("user", null);
          this.props.resetIsLoggedIn();
        } else if (result.status === 401) {
          this.props.history.push('/');
        } else {
          this.setState({
            ...this.state,
            msg: 'Error in setting Password',
            alertOpen: true,
            alertType: 'alert',
            // title: "Error"
            title: 'Change Password',
          });
        }
      });
    }
  }

  // Disabling For PoC1
  OnHandleChange(event) {
    const { name, value } = event.target;
    this.setState({
      ...this.state,
      [name]: value
    });
  }

  IsIbofOSRunning() {
    this.props.Get_Is_iBOFOS_Running_Status({ push: this.props.history.push, resetIsLoggedIn: this.props.resetIsLoggedIn });
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
  alertClose() {
    this.setState({
      ...this.state,
      alertOpen: false,
    });
  }

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
    localStorage.removeItem('token');
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
      isMobileMenuOpen: false,
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
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
      <ThemeProvider theme={MToolTheme}>
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
            <div className={classes.logoContainer}>
              <img
                src={Heading}
                className={classes.logoImg}
                alt="Poseidon Management Tool"
              />
              <Typography className={classes.version} variant="caption" display="block">
                v0.16.0-rc4
              </Typography>
            </div>
            <div className={classes.grow} />

            <Typography className={classes.nextSeparator}>Status:</Typography>
            <Typography className={classes.nextSeparator} />
            {this.props.status ? (
              <Typography
                className={classes.running}
              >
                Running
              </Typography>
            ) : null}
            {!this.props.status && this.props.OS_Running_Status === "..." ?
              <Loader type="Bars" color="#FFFFFF" height={20} width={20} /> : null}
            {!this.props.status && this.props.OS_Running_Status !== "..." ? (
              <Typography
                className={classes.notRunning}
              >
                {this.props.OS_Running_Status}
              </Typography>
            ) : null}
            <Tooltip
              title={(
                <>
                  PoseidonOS Last Active Time:
                  {this.props.timestamp === "..." ?
                    <Loader type="Bars" color="primary" height={20} width={20} /> :
                    (
                      <>
                        <br />
                        {this.props.timestamp}
                      </>
                    )
                  }
                  {!this.props.timestamp ? "NA" : ""}
                </>
              )}
              classes={{
                tooltip: classes.tooltip,
              }}
            >
              <AccessTime className={classes.infoOutlined} />
            </Tooltip>
            <div className={classes.sectionDesktop}>
              {this.props.OS_Running_Status !== 'Not Running' && this.props.OS_Running_Status !== 'Running' ? (
                <LinearProgressBarComponent
                  percent={localStorage.getItem('Rebuilding_Value')}
                />
              ) : null}
              <Typography className={classes.separator}>|</Typography>
              <span
                className={`${classes.userLink} ${window.location.href.indexOf('user') > 0 /* istanbul ignore next */ ? 'active' : ''
                  }`}
                aria-hidden="true"
                id="user-link"
                data-testid="header-dropdown"
                onClick={this.renderDropDown}
              >
                <Tooltip title={username}>
                  <Typography className={classes.username}>{username}</Typography>
                </Tooltip>
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
          link={this.state.alertLink}
          removeCrossButton={this.state.alertRemoveCrossButton}
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
    statusCheckDone: state.headerReducer.isStatusCheckDone
  };
}
const mapDispatchToProps = dispatch => {
  return {
    getIbofOSTimeInterval: () => dispatch({ type: actionTypes.SAGA_GET_IBOFOS_TIME_INTERVAL, }),
    getPOSInfo: () => dispatch({ type: actionTypes.SAGA_GET_POS_INFO }),
    Get_Is_iBOFOS_Running_Status: (payload) => dispatch({ type: actionTypes.SAGA_GET_IS_IBOF_OS_RUNNING, payload }),
    resetIsLoggedIn: () => dispatch(actionCreators.resetIsLoggedIn()),
  };
}
export default withStyles(styles)((connect(mapStateToProps, mapDispatchToProps))(withRouter(Header)));
