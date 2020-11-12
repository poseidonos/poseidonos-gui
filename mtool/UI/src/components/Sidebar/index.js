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


DESCRIPTION: <File description> *
@NAME : index.js
@AUTHORS: Jay Hitesh Sanghavi, Aswin K K
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
[06/08/2019] [Aswin] : Chaged to Material UI
*/
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Drawer, List, ListItem, Divider, Paper, Typography, Hidden } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { connect } from 'react-redux';

import SamsungLogo from '../../assets/images/Samsung-logo-blue.png';
import DashboardIconDisabled from '../../assets/images/Dashboard-DIS.png';
import DashboardIconSelected from '../../assets/images/Dashboard-SEL.png';
import StorageIconDisabled from '../../assets/images/Storage-DIS.png';
import StorageIconSelected from '../../assets/images/Storage-SEL.png';
import ConfigurationIconDisabled from '../../assets/images/Configuration-DIS.png';
import ConfigurationIconSelected from '../../assets/images/Configuration-SEL.png';
import PerformanceIconDisabled from '../../assets/images/Performance-DIS.png';
import PerformanceIconSelected from '../../assets/images/Performance-SEL.png';
import HardwareIconDisabled from '../../assets/images/Hardware_DIS.png';
import HardwareIconSelected from '../../assets/images/Hardware_SEL.png';
import MToolTheme from '../../theme';

import './Sidebar.css';

const ulStyle = {
  textDecoration: 'none',
  color: 'rbga(255, 255, 255, 0.8)',
  marginTop:'0px',
  paddingTop:'0px'
};

const drawerWidth = 250;

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
    justifyContent: 'center',
    alignItems: 'flex-end'
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
    color: 'rgba(185, 188, 197)',
    opacity: 1
  },
  sidebarIcon: {
    display: 'block',
    float: 'left',
    marginRight: theme.spacing(1),
    opacity: 1,
  }
}));
const Sidebar = (props) => {
  const classes = useStyles();
  const drawer = (
    <ThemeProvider data-testid ="sidebarTag" theme={MToolTheme}>
    <div className={classes.toolbar} />
      <List className={classes.list} style={ulStyle}>
      <Divider className={classes.listDivider} />
        <NavLink className={classes.link} activeClassName={classes.activeLink} to="/dashboard">
          <ListItem className={classes.sidebarLink}>
            <span>
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
        <NavLink style={ulStyle} to="/volume" className={classes.link} activeClassName={classes.activeLink}>
          <ListItem className={classes.sidebarLink}>
            <span>
              <img
                 className={classes.sidebarIcon}
                src={
                  window.location.href.indexOf('volume') > 0
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
            <span>
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
            <Typography className={classes.sidebarText}>Performance</Typography>
          </ListItem>
        </NavLink>
        <Divider className={classes.listDivider} />
        <NavLink className={classes.link} activeClassName={classes.activeLink} to="/Hardware/Overview">
            <ListItem className={classes.sidebarLink}>
              <span>
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

        <Divider className={classes.listDivider} /> */}
        <NavLink
          style={ulStyle}
          className={classes.link} activeClassName={classes.activeLink}
          to="/ConfigurationSetting/general"
        >
          <ListItem className={classes.sidebarLink}>
            <span>
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
        <Divider className={classes.listDivider} />
        <Divider className={classes.listDivider} />

        {/* <NavLink
          style={ulStyle}
          className={classes.link} activeClassName={classes.activeLink}
          to="/LogManagement"
        >
          <ListItem className={classes.sidebarLink}>
            <span>
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
            src={SamsungLogo}
            style={{ width: '170px' }}
            alt="Samsung Logo"
          />
        </Paper>
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
   bmc_isLoggedIn:state.BMCAuthenticationReducer.bmc_isLoggedIn,
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
