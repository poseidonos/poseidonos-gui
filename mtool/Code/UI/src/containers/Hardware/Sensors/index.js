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


DESCRIPTION: Sensor Page Component Tab
@NAME : index.js
@AUTHORS: Jay Hitesh Sanghavi
@Version : 1.0 
@REVISION HISTORY
[03/11/2019] [Jay] : Prototyping..........////////////////////
*/
import React, { Component } from 'react';
import ThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { withStyles } from '@material-ui/core/styles';
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

const mapStateToProps = state => {
    return {
    };
};
const mapDispatchToProps = dispatch => {
    return {

    };
};

export default withStyles(styles)(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(withRouter(Sensors))
);
