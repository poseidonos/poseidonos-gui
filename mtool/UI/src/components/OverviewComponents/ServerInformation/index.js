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

DESCRIPTION: Overview Page Server Component
@NAME : index.js
@AUTHORS: Jay Hitesh Sanghavi
@Version : 1.0 
@REVISION HISTORY
[03/11/2019] [Jay] : Prototyping..........////////////////////
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import ThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { createMuiTheme } from "@material-ui/core";
import { customTheme } from '../../../theme';
import * as actionTypes from '../../../store/actions/actionTypes';

const formTheme = createMuiTheme({
  ...customTheme,
  typography: {
      fontSize: '12px'
  },
  overrides: {
    MuiInput: {
      // Name of the styleSheet
      underline: {
        '&:hover:not($disabled):before': {
          borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
        },
        '&:after': {
            borderBottom: 0
        }
      },
    },
  },
});

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    serverOuterGrid: {
        maxWidth: '100%',
        minHeight: '140px',
        overflowY: 'auto',
        overflowX: 'hidden',
        justifyContent: 'left',
        background: '#fff'
    },
    serverInfoHeader: {
        textAlign: 'left',
        color: 'rgba(255, 255, 255, 0.87)',
        fontSize: '14px',
        borderRadius: '0px',
        width: '100%',
        marginLeft: '10px',
        lineHeight: '1.5',
    },
    overviewPaper: {
        width: '100%',
    },

    serverCard: {
        backgroundColor: '#788595',
        justifyContent: 'center',
        maxWidth: '100%',
        maxHeight: '24px',
        flexBasis: '100%'
    },

    SpecifyServerCard: {
        borderRadius: '0px',
        boxShadow: 'none',
    },
    textField: {
        color: "black",
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 230,
    },

});

class ServerInformation extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchServerInfo();
    }
  
    render() {
        const { classes } = this.props;
        return (
            <Card className={classes.SpecifyServerCard}>
                <Grid container className={classes.serverOuterGrid}>
                        <ThemeProvider theme={formTheme}>
                    <Grid className={classes.serverCard}>
                        <Typography className={classes.serverInfoHeader}>
                            Server Information
                        </Typography>
                    </Grid>
                    <TextField
                    onFocus={event => {
        event.target.select()
      }}
                        className={classes.textField}
                        id="standard-required"
                        margin="none"
                        value={this.props.model ==="" ? "NA": this.props.model}
                        label="Model"
                        // disabled
                         InputProps={{
                            readOnly: true,
                             classes: {
                            input: classes.textField
                         }
                    }}
                    />


                    <TextField className={classes.textField}
                    onFocus={event => {
        event.target.select()
      }}
                        id="standard-required"
                        margin="none"
                        // disabled
                        value={this.props.manufacturer ===""? "NA": this.props.manufacturer}
                        label="Manufacturer"
                         InputProps={{
                             readOnly: true,
                             autoFocus :false,
                             classes: {
                            input: classes.textField
                         }
                    }}
                    />
                    <TextField className={classes.textField}
                    onFocus={event => {
        event.target.select()
      }}
                        id="standard-required"
                        margin="none"
                        value={this.props.servermac ===""?"NA":this.props.servermac}
                        label="BMC MAC Address"
                        // disabled
                         InputProps={{
                             readOnly: true,
                             classes: {
                            input: classes.textField
                         }
                    }}
                    />
                    <TextField className={classes.textField}
                    onFocus={event => {
        event.target.select()
      }}
                        id="standard-required"
                        margin="none"
                        value={this.props.serverip === "" ? "NA":this.props.serverip}
                        // disabled
                        label="BMC IP Address"
                         InputProps={{
                            readOnly: true,
                             classes: {
                            input: classes.textField
                         }
                    }}
                    />
                    <TextField className={classes.textField}
                    onFocus={event => {
        event.target.select()
      }}
                        id="standard-required"
                        margin="none"
                        value={this.props.firmwareversion==="" ?"NA": this.props.firmwareversion}
                        label="BMC Firmware Version"
                        // disabled
                         InputProps={{
                             readOnly: true,
                             classes: {
                            input: classes.textField
                         }
                    }}
                    />
                    <TextField className={classes.textField}
                    onFocus={event => {
        event.target.select()
      }}
                        id="standard-required"
                        margin="none"
                        value={this.props.serialno==="" ? "NA": this.props.serialno}
                        label="Serial Number"
                       // disabled
                         InputProps={{
                             readOnly: true,
                             classes: {
                            input: classes.textField
                         }
                    }}
                    />
                        </ThemeProvider>
                </Grid>
            </Card>
        );
    }
}

const mapStateToProps = state => {
    return {
        model:  state.hardwareOverviewReducer.model,
        manufacturer: state.hardwareOverviewReducer.manufacturer,
        servermac: state.hardwareOverviewReducer.servermac,
        serverip: state.hardwareOverviewReducer.serverip,
        firmwareversion: state.hardwareOverviewReducer.firmwareversion,
        serialno: state.hardwareOverviewReducer.serialno,
        hostname: state.hardwareOverviewReducer.hostname,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        fetchServerInfo: () => dispatch({ type: actionTypes.SAGA_HARDWARE_OVERVIEW_FETCH_SERVER_INFORMATION }),
    };
}

export default withStyles(styles)((connect(mapStateToProps, mapDispatchToProps))(((ServerInformation))));