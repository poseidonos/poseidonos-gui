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
import { MuiThemeProvider as ThemeProvider , withStyles } from '@material-ui/core/styles';
import { AppBar, Tabs, Tab } from '@material-ui/core';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import MToolTheme from '../../../theme';
import PowerSensor from '../../../components/SensorComponents/PowerSensor'
import FanSensor from '../../../components/SensorComponents/FanSensor'
import TemperatureSensor from '../../../components/SensorComponents/TemperatureSensor'

const styles = theme => ({
    configurationContainer: {
        display: 'flex',
    },
    appBar:{
        marginTop:theme.spacing(1),
        border:'1px solid gray'
    },
    selectedTab: {
        color: 'rgb(33, 34, 37)',
        borderBottom: `2px solid ${'rgb(33, 34, 37)'}`,
        fontWeight: 600
    }
});

class Sensors extends Component {
    constructor(props) {
        super(props);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.state = {
            value: 0
        };
    }

    componentDidMount() {
    }


    handleTabChange(event, newValue) {
        if (newValue === 'Power') {
            this.componentDidMount();
        }
        this.props.history.push(`/Hardware/Sensors/${newValue}`);
    }

    render() {
        const { classes } = this.props;
        return (
            <ThemeProvider theme={MToolTheme}>
                    <AppBar position="static" color="default" className={classes.appBar} data-testid="Sensors_Component">
                        <Tabs
                            value={this.state.value}
                            onChange={this.handleTabChange}
                        >
                            <Tab data-testid="Sensors_Power" label="Power" key="Power" value="Power" className={(window.location.href.indexOf('Power') > 0 ? classes.selectedTab : null)} />
                            <Tab data-testid="Sensors_Fan" label="Fan" key="Fan" value="Fan" className={(window.location.href.indexOf('Fan') > 0 ? classes.selectedTab : null)} />
                            <Tab data-testid="Sensors_Temperature" label="Temperature" key="Temperature" value="Temperature" className={(window.location.href.indexOf('Temperature') > 0 ? classes.selectedTab : null)} />
                        </Tabs>
                    </AppBar>
                    <Switch>
                    <Route exact path="/Hardware/Sensors/Power" component={PowerSensor} />
                    <Route exact path="/Hardware/Sensors/Fan" component={FanSensor} />
                    <Route exact path="/Hardware/Sensors/Temperature" component={TemperatureSensor} />
                    </Switch>
            </ThemeProvider>
        );
    }
}

const mapStateToProps = () => {
    return {
    };
};
const mapDispatchToProps = () => {
    return {

    };
};

export default withStyles(styles)(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(withRouter(Sensors))
);
