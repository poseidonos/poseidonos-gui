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

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Drawer, List, ListItem, Divider, Paper, Typography, Hidden } from '@material-ui/core';
import { makeStyles , MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import PoseidonLogo from '../../assets/images/Poseidon.png';
import DashboardIconDisabled from '../../assets/images/Dashboard-DIS.png';
import DashboardIconSelected from '../../assets/images/Dashboard-SEL.png';
import StorageIconDisabled from '../../assets/images/Storage-DIS.png';
import StorageIconSelected from '../../assets/images/Storage-SEL.png';
// import ConfigurationIconDisabled from '../../assets/images/Configuration-DIS.png';
// import ConfigurationIconSelected from '../../assets/images/Configuration-SEL.png';
 import PerformanceIconDisabled from '../../assets/images/Performance-DIS.png';
 import PerformanceIconSelected from '../../assets/images/Performance-SEL.png';
// import HardwareIconDisabled from '../../assets/images/Hardware_DIS.png';
// import HardwareIconSelected from '../../assets/images/Hardware_SEL.png';
import MToolTheme from '../../theme';

import './Sidebar.css';

const ulStyle = {
  textDecoration: 'none',
  color: 'rbga(255, 255, 255, 0.8)',
  marginTop:'0px',
  paddingTop:'0px'
};

const drawerWidth = 200;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  list: {
    marginTop: theme.spacing(1)
  },
  link: {
    color: 'rgba(255, 255, 255)',
    '&>li:hover': {
      background: 'rgb(57, 62, 69)',
      color: '#fff',
      opacity: 1
  },
  },
  sidebarLink: {
    '&:hover': {
      '&>p': {
        color: '#fff',
        opacity: 0.8
      },
      '&>span>img': {
        opacity: 0.8
      }
    },
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#424850',
    color: theme.palette.text.light
  },
  logoContainer: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    color: "#fff",
    flexDirection: "column"
  },
  logoPaper: {
    marginBottom: '5px',
    borderRadius: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#424850',
    boxShadow:"none"
  },
  activeLink: {
    backgroundColor: 'rgb(33, 34, 37)',
    display: 'flex',
    color: '#fff',
    opacity: 1,
    '&>li:hover': {
      backgroundColor: 'rgb(33, 34, 37)',
      opacity: 1,
      color: '#fff',
    },
    '&>li>p': {
      color: '#fff',
      backgroundColor: 'rgb(33, 34, 37)',
      opacity: '1 !important'
    },
    '&>li>span>img': {
      color: '#fff',
      backgroundColor: 'rgb(33, 34, 37)',
      opacity: '1 !important',
    }
  },
  toolbar: theme.mixins.toolbar,
  listDivider: {
    backgroundColor: 'rgb(92, 97, 119)'
  },
  sidebarText: {
    marginLeft: '4px',
    color: 'rgb(185, 188, 197)',
    opacity: 1
  },
  sidebarIcon: {
    display: 'block',
    float: 'left',
    marginRight: theme.spacing(1),
    opacity: 1,
  },
  iconLeft: {
    width: 40
  }
}));
const Sidebar = (props) => {
  const classes = useStyles();
  const drawer = (
    <ThemeProvider theme={MToolTheme}>
    <div className={classes.toolbar} />
      <List className={classes.list} style={ulStyle}>
      <Divider className={classes.listDivider} />
        <NavLink className={classes.link} activeClassName={classes.activeLink} to="/dashboard">
          <ListItem className={classes.sidebarLink}>
            <span className={classes.iconLeft}>
              <img
                className={classes.sidebarIcon}
                src={
                  window.location.href.indexOf('dashboard') > 0
                    ? DashboardIconSelected
                    : DashboardIconDisabled
                }
                alt="l"
              />
            </span>
            <Typography className={classes.sidebarText}>Dashboard</Typography>
          </ListItem>
        </NavLink>
        <Divider className={classes.listDivider} />
        <NavLink style={ulStyle} to="/storage/array/"
          exact={false}
          className={classes.link}
          activeClassName={classes.activeLink}
        >
          <ListItem className={classes.sidebarLink}>
            <span className={classes.iconLeft}>
              <img
                 className={classes.sidebarIcon}
                src={
                  window.location.href.indexOf('storage') > 0
                    ? StorageIconSelected
                    : StorageIconDisabled
                }
                alt="l"
              />
            </span>
            <Typography className={classes.sidebarText}>Storage</Typography>
          </ListItem>
        </NavLink>
	 <Divider className={classes.listDivider} />
        <NavLink style={ulStyle} to="/performance" className={classes.link} activeClassName={classes.activeLink}>
          <ListItem className={classes.sidebarLink}>
            <span className={classes.iconLeft}>
              <img
                className={classes.sidebarIcon}
                src={
                  window.location.href.indexOf('performance') > 0
                    ? PerformanceIconSelected
                    : PerformanceIconDisabled
                }
                alt="l"
              />
            </span>
            <Typography className={classes.sidebarText}>Telemetry</Typography>
          </ListItem>
        </NavLink>
        {/* <Divider className={classes.listDivider} />
        <NavLink className={classes.link} activeClassName={classes.activeLink} to="/Hardware/Overview">
          <ListItem className={classes.sidebarLink}>
            <span className={classes.iconLeft}>
              <img
                className={classes.sidebarIcon}
                src={
                  window.location.href.indexOf('Hardware') > 0
                    ? HardwareIconSelected
                    : HardwareIconDisabled
                }
                alt="l"
              />
            </span>
            <Typography className={classes.sidebarText}>Hardware</Typography>
          </ListItem>
        </NavLink>

        <Divider className={classes.listDivider} /> 
        <NavLink
          style={ulStyle}
          className={classes.link} activeClassName={classes.activeLink}
          to="/ConfigurationSetting/general"
        >
          <ListItem className={classes.sidebarLink}>
            <span className={classes.iconLeft}>
              <img
                 className={classes.sidebarIcon}
                src={
                  window.location.href.indexOf('ConfigurationSetting') > 0
                    ? ConfigurationIconSelected
                    : ConfigurationIconDisabled
                }
                alt="l"
              />
            </span>
            <Typography className={classes.sidebarText}>Configuration</Typography>
          </ListItem>
        </NavLink>
        <Divider className={classes.listDivider} /> */}
        <Divider className={classes.listDivider} />

        {/* <NavLink
          style={ulStyle}
          className={classes.link} activeClassName={classes.activeLink}
          to="/LogManagement"
        >
          <ListItem className={classes.sidebarLink}>
            <span className={classes.iconLeft}>
              <img
                 className={classes.sidebarIcon}
                src={
                  window.location.href.indexOf('LogManagement') > 0
                    ? LogManagementIconSelected
                    : LogManagementIconDisabled
                }
                alt="l"
              />
            </span>
            <Typography className={classes.sidebarText}>Trace</Typography>
          </ListItem>
        </NavLink>
        <Divider className={classes.listDivider} /> */}
      </List>
      <div className={classes.logoContainer}>
        <Paper className={classes.logoPaper}>
          <img
            src={PoseidonLogo}
            style={{ width: '170px' }}
            alt="Poseidon Logo"
          />
        </Paper>
	<span>PoseidonOS {props.posVersion}</span>
      </div>
    </ThemeProvider>
  );
  if (localStorage.getItem('isLoggedIn')) {
    return (
      <ThemeProvider theme={MToolTheme}>
      <Hidden mdUp implementation="css">
        <Drawer
          className={classes.drawer}
          anchor="left"
          variant="temporary"
          classes={{
            paper: classes.drawerPaper,
          }}
          open={props.mobileOpen}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          onClose={props.toggleDrawer}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        open
      >
        {drawer}
      </Drawer>
      </Hidden>
      </ThemeProvider>
    );
  }
  return null;
};

const mapStateToProps = state => {
  return {
   posVersion: state.headerReducer.posVersion
  };
};

const mapDispatchToProps = () => {
  return {

  };
};

export default  
  connect(
    mapStateToProps,
    mapDispatchToProps
    )(Sidebar);
