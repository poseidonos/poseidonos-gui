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
import { AppBar, Tabs, Tab } from '@material-ui/core';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import MToolTheme, { customTheme } from '../../theme';
import './ConfigurationSetting.css';
import AlertDialog from '../../components/Dialog';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import UserManagement from './User-Management';

const styles = theme => ({
  configurationContainer: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    width: '100%',
    boxSizing: 'border-box',
    paddingLeft: '24px',
    paddingRight: '13px',
  },
  toolbar: customTheme.toolbar,
  selectedTab: {
    color: 'rgb(33, 34, 37)',
    borderBottom: `2px solid ${'rgb(33, 34, 37)'}`,
    fontWeight: 600
  }
});
class ConfigurationSetting extends Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.state = {
      mobileOpen: false,
      open: false,
      value: 0,
    };
  }

  /*  istanbul ignore next  */
  handleClose() {
    this.setState({
      ...this.state,
      open: false
    })
  }

  handleDrawerToggle() {
    this.setState({
      mobileOpen: !this.state.mobileOpen,
    });
  }

  handleTabChange(event, newValue) {
    /* istanbul ignore if */
    if (newValue === 'general') {
      this.componentDidMount();
    }
    this.props.history.push(`/ConfigurationSetting/${newValue}`);
  }

  render() {
    const { classes } = this.props;
    return (
      <ThemeProvider theme={MToolTheme}>
        <div className={classes.configurationContainer}>
          <Header toggleDrawer={this.handleDrawerToggle} />
          <Sidebar
            mobileOpen={this.state.mobileOpen}
            toggleDrawer={this.handleDrawerToggle}
          />
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <AppBar position="static" color="default">
              <Tabs
                value={this.state.value}
                onChange={this.handleTabChange}
              >
                <Tab data-testid="userTab" label="User" key="user" value="user" className={(window.location.href.indexOf('user') > 0 ? /* istanbul ignore next */ classes.selectedTab : null)} />
              </Tabs>
            </AppBar>
            <Switch>
              <Route path="/ConfigurationSetting/user">
                <UserManagement />
              </Route>
            </Switch>
            <AlertDialog
              title="Update Interval"
              description="Invalid input. Please enter a valid interval"
              type="alert"
              open={this.state.open}
              handleClose={this.handleClose}
            />
          </main>
        </div>
      </ThemeProvider>
    );
  }
}

export default withStyles(styles)(
  connect()(
    withRouter(ConfigurationSetting)
  )
);
