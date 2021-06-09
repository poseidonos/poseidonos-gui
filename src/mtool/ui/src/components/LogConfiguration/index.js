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


DESCRIPTION: Log Configuration
@NAME : index.js
@AUTHORS: Aswin K K
@Version : 1.0 *
@REVISION HISTORY
[17/09/2019] [Aswin] : Created file
*/

import React from 'react';
import { TextField, Divider, InputLabel, Paper, makeStyles, Grid, Typography, Button } from '@material-ui/core';
import {
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const useStyles = makeStyles((theme) => ({
    paper: {
        width: '100%'
    },
    mainHeader: {
        textAlign: 'left',
        color: 'rgba(255, 255, 255, 0.87)',
        fontSize: '14px',
        width: '100%',
        marginLeft: '10px',
        lineHeight: '2',
    },
    title: {
        backgroundColor: '#788595',
        borderRadius: 0,
        justifyContent: 'center',
    },
    btn: {
        height: '1.8rem',
        fontSize: '12px',
        textTransform: 'none',
        marginRight: '10px',
        width: 125,
        marginBottom:theme.spacing(1)
    },
    btnContainer: {
        padding: theme.spacing(2)
    },
    ibofosSettingGrid: {
        marginTop: theme.spacing(3)
    },
    ibofosSettingInputField: {
        marginLeft: theme.spacing(2),
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        color: 'black',
        fontSize: '12px'
    },
    textField: {
        width: 190,
        padding: '0px',
        marginLeft: theme.spacing(2),
    },
    ibofosSettingButton: {
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(2),
        height: '1.8rem',
        fontSize: '12px',
        textTransform: 'none',
        marginRight: '10px',
        width: 70
    },
    gridItem: {
        [theme.breakpoints.down('sm')]: {
            justifyContent: 'center',
            display: 'flex',
        },
    },

    deletetextField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 190,
        marginTop: theme.spacing(2),
        color: 'black',
        background: 'rgb(245,245,245)',
        textDecoration: 'none',
        borderBottom: 'none',

        '&>input': {
            paddingLeft: '4px',
        },
    },
}));

const LogConfiguration = (props) => {
    const classes = useStyles();
    const [selectedStartDate] = React.useState(new Date());
    const [selectedEndDate] = React.useState(new Date());

    function downloadLogs() {
        props.downloadLogs({
            start_date: selectedStartDate,
            end_date: selectedEndDate
        });
    }


    return (
        <Paper className={classes.paper}>
            <Grid xs={12} className={classes.title}>
                <Typography className={classes.mainHeader}>Log Collection Configuration</Typography>
            </Grid>
            <Grid xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid item container justify="center" className={classes.btnContainer}>
                                <Button onClick={downloadLogs} className={classes.btn} color="primary" variant="contained" data-testid= "downloadLogsBtn">
                                    Download log
                                </Button>
                            </Grid>
                </MuiPickersUtilsProvider>
            </Grid>
            <Divider />
            <Grid container>
                <Grid xs={12} className={classes.ibofosSettingGrid}>
                    <InputLabel className={classes.ibofosSettingInputField}>Set Poseidon OS Status Time Interval:</InputLabel>
                    <TextField
                        type="number"
                        inputProps={{
                            // 'data-testid': "ibofosSettingTextField",
                            min: 0,
                        }}
                        name="ibofostimeinterval"
                        onChange={props.OnHandleChange}
                        placeholder="Time Interval"
                        id="standard-required"
                        value={props.ibofostimeinterval}
                        className={classes.textField}
                        label="In Sec"
                        margin="none"
                        data-testid= "ibofosSettingTextField"
                    // onKeyDown={f => /[+-,.,#]$/.test(f.key) && f.preventDefault()}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.ibofosSettingButton}
                        data-testid="setTimeIntervalButton"
                        onClick={() => {
                            props.applyIbofOSTimeInterval()
                        }}
                    >
                        Apply
                    </Button>

                    <TextField
                        inputProps={{
                            'data-testid': "ibofosSettingTextFieldRO",
                            readOnly: true,
                            className: classes.inputText,
                        }}
                        disabled
                        value={props.ibofostimeintervalvalue}
                        className={classes.deletetextField}
                        type="text"
                        margin="none"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        className={classes.ibofosSettingButton}
                        data-testid="deleteTimeIntervalButton"
                        onClick={() => {
                            props.deleteIbofOSTimeInterval()
                        }}
                    >
                        Delete
                    </Button>
                </Grid>


            </Grid>
        </Paper>

    );
}

export default LogConfiguration;
