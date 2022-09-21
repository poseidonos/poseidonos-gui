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
import { withStyles, MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles';
import { AppBar, Box, Tab, Tabs, Grid, Typography } from '@material-ui/core';
import { Switch, Redirect, Route, withRouter } from 'react-router-dom';
import MToolTheme, { customTheme } from '../../theme';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Grafana from './Grafana';
import TelemetryConfiguration from './Configuration';

const styles = (theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    paddingTop: "10px",
    paddingLeft: "35px",
    paddingRight: "24px",
    width: "calc(100% - 256px)",
    boxSizing: "border-box",
  },
  titleContainer: {
    marginTop: theme.spacing(1),
  },
  pageHeader: customTheme.page.title,
  toolbar: customTheme.toolbar,
  selectedTab: customTheme.tab.selected,
});

class Performance extends Component {
  constructor(props) {
    super(props);

    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.interval = null;
    this.state = {
      mobileOpen: false
    };
  }

  handleTabChange(event, value) {
    if (value === "grafana") {
      this.setState({ activeTab: "grafana" });
      this.props.history.push("/performance/grafana");
    } else {
      this.setState({ activeTab: "configure"});
      this.props.history.push("/performance/configure");
    }
  }

  handleDrawerToggle() {
    this.setState({
      mobileOpen: !this.state.mobileOpen
    });
  }

  render() {
    const { classes } = this.props;
    const url = `http://${window.location.hostname}:3500/datasources`
    return (
      <ThemeProvider theme={MToolTheme}>
        <Box display="flex">
          <Header toggleDrawer={this.handleDrawerToggle} />
          <Sidebar mobileOpen={this.state.mobileOpen} toggleDrawer={this.handleDrawerToggle} />
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Grid container spacing={3}>
              <Grid container spacing={3} className={classes.titleContainer}>
                <Grid xs={12} item>
                  <Typography className={classes.pageHeader} variant="h6">
                    Storage Management
                  </Typography>
                </Grid>
              </Grid>
              <AppBar style={{ zIndex: 50 }} position="relative" color="default">
                <Tabs
                  value={this.state.activeTab}
                  onChange={this.handleTabChange}
                >
                  <Tab label="configure" value="configure" className={(window.location.href.indexOf('configure') > 0 ? /* istanbul ignore next */ classes.selectedTab : null)}>
                    Configure
                  </Tab>
                  <Tab label="grafana" value="grafana" className={(window.location.href.indexOf('grafana') > 0 ? /* istanbul ignore next */ classes.selectedTab : null)}>
                    Grafana
                  </Tab>
                </Tabs>
              </AppBar>
              <Switch>
                <Redirect exact from="/performance" to="/performance/configure" />
                <Route path="/performance/configure">
                  <TelemetryConfiguration />
                </Route>
                <Route path="/performance/grafana">
                  <Grafana url={url} />
                </Route>
              </Switch>
            </Grid>
          </main>
        </Box>
      </ThemeProvider>
    );
  }
}

export default withStyles(styles)(withRouter(Performance));
