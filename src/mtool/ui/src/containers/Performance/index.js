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
import { Box } from '@material-ui/core';
import './Performance.css';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { customTheme, PageTheme } from '../../theme';

const styles = () => ({
  content: {
    flexGrow: 1,
  },
  toolbar: customTheme.toolbar,
  iframe: {
    width: "98%",
    height: "calc(100vh - 65px)"
  }
});


class Performance extends Component {
  constructor(props) {
    super(props);

    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    this.interval = null;
    this.state = {
      mobileOpen: false,
    };
  }

  handleDrawerToggle() {
    this.setState({
      mobileOpen: !this.state.mobileOpen
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <ThemeProvider theme={PageTheme}>
        <Box display="flex">
          <Header toggleDrawer={this.handleDrawerToggle} />
          <Sidebar mobileOpen={this.state.mobileOpen} toggleDrawer={this.handleDrawerToggle} />
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <iframe
              title="iframe"
              src="http://107.108.83.97:3500/dashboards"
              className={classes.iframe}
            />
          </main>
        </Box>
      </ThemeProvider>
    );
  }
}

export default withStyles(styles)(Performance);
