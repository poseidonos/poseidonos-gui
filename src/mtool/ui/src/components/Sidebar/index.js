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
import { Drawer, List, ListItem, Paper, Typography, Hidden } from '@material-ui/core';
import { makeStyles, MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import PreloadImage from 'react-preload-image';

import PoseidonLogo from '../../assets/images/Poseidon.png';
import DashboardIconDisabled from '../../assets/images/Dashboard-DIS.png';
import DashboardIconSelected from '../../assets/images/Dashboard-SEL.png';
import StorageIconDisabled from '../../assets/images/Storage-DIS.png';
import StorageIconSelected from '../../assets/images/Storage-SEL.png';
import PerformanceIconDisabled from '../../assets/images/Performance-DIS.png';
import PerformanceIconSelected from '../../assets/images/Performance-SEL.png';
import MToolTheme, { customTheme } from '../../theme';

import './Sidebar.css';

const liStyle = {
  textDecoration: 'none',
  color: 'rbga(255, 255, 255, 0.8)',
};

const ulStyle = {
  ...liStyle,
  marginTop: 0,
  paddingTop: 0
}

const drawerWidth = 200;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  list: {
    marginTop: theme.spacing(1)
  },
  link: {
    padding: theme.spacing(1, 2),
    color: 'rgba(255, 255, 255)',
    display: 'flex',
    alignItems: 'center',
    width: 'inherit',
  },
  sidebarLink: {
    padding: 0,
    '&:hover': {
      background: customTheme.palette.primary.main,
    },
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundImage: `linear-gradient(to bottom, ${customTheme.palette.primary.dark}, ${customTheme.palette.secondary.main})`,
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
    background: 'rgba(0,0,0,0)',
    boxShadow: "none"
  },
  activeLink: {
    backgroundColor: customTheme.palette.secondary.main,
    color: '#fff',
    '&>p': {
      color: '#fff',
    },
    '&:hover': {
      backgroundColor: customTheme.palette.primary.main,
    },
  },
  toolbar: {
    ...theme.mixins.toolbar,
    minHeight: '60px !important'
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
  logoImage: {
    position: "relative",
    height: "94px",
    width: "170px"
  }
}));
const Sidebar = (props) => {
  const classes = useStyles();
  const drawer = (
    <ThemeProvider theme={MToolTheme}>
      <div className={classes.toolbar} />
      <List className={classes.list} style={ulStyle}>
        <ListItem className={classes.sidebarLink}>
          <NavLink className={classes.link} activeClassName={classes.activeLink} to="/dashboard">
            <img
              className={classes.sidebarIcon}
              width="32px"
              height="32px"
              src={
                window.location.href.indexOf('dashboard') > 0
                  ? DashboardIconSelected
                  : DashboardIconDisabled
              }
              alt="Dashboard Icon"
            />
            <Typography className={classes.sidebarText}>Dashboard</Typography>
          </NavLink>
        </ListItem>
        <ListItem className={classes.sidebarLink}>
          <NavLink style={liStyle} to="/storage/array/"
            exact={false}
            className={classes.link}
            activeClassName={classes.activeLink}
          >
            <img
              className={classes.sidebarIcon}
              width="32px"
              height="32px"
              src={
                window.location.href.indexOf('storage') > 0
                  ? StorageIconSelected
                  : StorageIconDisabled
              }
              alt="Storage Icon"
            />
            <Typography className={classes.sidebarText}>Storage</Typography>
          </NavLink>
        </ListItem>
        <ListItem className={classes.sidebarLink}>
          <NavLink style={liStyle} to="/performance" className={classes.link} activeClassName={classes.activeLink}>
            <img
              className={classes.sidebarIcon}
              width="32px"
              height="32px"
              src={
                window.location.href.indexOf('performance') > 0
                  ? PerformanceIconSelected
                  : PerformanceIconDisabled
              }
              alt="Performance Icon"
            />
            <Typography className={classes.sidebarText}>Telemetry</Typography>
          </NavLink>
        </ListItem>
      </List>
      <div className={classes.logoContainer}>
        <Paper className={classes.logoPaper}>
          <PreloadImage
            className={classes.logoImage}
            src={PoseidonLogo}
            lazy
          />
        </Paper>
        <span>PoseidonOS {props.posVersion}</span>
      </div>
    </ThemeProvider>
  );
  if (localStorage.getItem('isLoggedIn')) {
    return (
      <ThemeProvider theme={MToolTheme}>
        <aside>
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
        </aside>
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


export default connect(mapStateToProps)(Sidebar);
