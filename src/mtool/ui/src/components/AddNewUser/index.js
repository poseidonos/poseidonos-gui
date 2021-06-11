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

import React, {
    Component
} from "react";
import ThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { TextField, Grid, withStyles, Typography, Select, MenuItem, ButtonGroup, Button } from '@material-ui/core';
import MuiPhoneNumber from 'material-ui-phone-number';
import "./AddNewUser.css";
import { PageTheme } from "../../theme"

const styles = (theme => {
    return ({
        addNewUserOuterGrid: {
            maxWidth: '100%',
            flexBasis: '100%',
            justifyContent: 'center',
        },
        addNewUserFirstInnerGrid: {
            border: '1px solid gray',
            paddingBottom: theme.spacing(2),
            backgroundColor: '#fff'
        },
        gridTypography: {
            maxWidth: '100%',
            flexBasis: '100%',
            maxHeight: '5%',
        },
        addNewUserTypography: {
            textAlign: 'left',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#424780',
            margin: theme.spacing(1.5),
        },
        addNewUserSecondInnerGrid: {
            maxWidth: '40%',
            maxHeight: '70%',
            flexBasis: '40%',
        },
        addNewUserThirdInnerGrid: {
            maxWidth: '20%',
            flexBasis: '20%',
            maxHeight: '70%',
        },
        textField: {
            width: '70%',
            [theme.breakpoints.down('xs')]: {
              marginLeft: 0
            }
        },
        fieldContainer: {
            display: 'flex',
            justifyContent: 'center'
        },
        formWrapper: {
            paddingTop: theme.spacing(2)
        },
        textFieldAfterDropdown: {
            marginLeft: theme.spacing(3),
            width: '70%',
            marginTop: theme.spacing(1)
        },
        selectFieldItem: {
            marginTop: theme.spacing(2),
            color: 'black',
            width: '70%',
            textTransform: 'uppercase',
            [theme.breakpoints.down('xs')]: {
              marginLeft: 0
            }
        },
        selectMenuItem: {
            color: 'black',
            textTransform: 'uppercase'
        },
        button: {
            margin: theme.spacing(1),
            paddingTop: '1px',
            color: 'white',
            marginBottom: 0,
            '&:hover': {
                background: 'rgb(94,104,116)',
                // borderColor: 'black',
                color: 'white'
            },
        },
        buttonGroup: {
            alignItems: 'flex-end'
        },
        buttonContainer: {
            justifyContent: 'center'
        }
    })
});

class AddNewUser extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        const { classes } = this.props;
        return (
            <Grid item container sm={6} xs={12} direction="row" className={classes.addNewUserOuterGrid}>

                <Grid item container xs={12} direction="row" className={classes.addNewUserFirstInnerGrid}>
                    <ThemeProvider theme={PageTheme}>
                        <Grid xs={12} item className={classes.gridTypography}>
                            <Typography className={classes.addNewUserTypography} variant="h3">Add New User</Typography>
                        </Grid>
                        <Grid sm={12} md={12} xs={12} item container className={classes.formWrapper}>
                            <Grid sm={6} xs={12} className={classes.fieldContainer}>
                                <TextField className={classes.textField}
                                    required
                                    multiline
                                    rowsMax="1"
                                    inputProps={{
                                      "data-testid": "add-user-name"
                                    }}
                                    margin="none"
                                    value={this.props.username}
                                    name="username"
                                    label="User Name"
                                    placeholder="Enter User Name"
                                    onChange={(event) => this.props.OnHandleChange(event)}
                                    onKeyDown={e => /[+-,#, ,]$/.test(e.key) && e.preventDefault()}
                                />
                            </Grid>
                            <Grid sm={6} xs={12} className={classes.fieldContainer} item>
                                <Select
                                    disabled
                                    className={classes.selectFieldItem}
                                    value="admin"
                                >
                                    <MenuItem className={classes.selectMenuItem} value="admin"> admin </MenuItem>
                                    {/* {this.props.dropdownCondition ? this.props.dropdownCondition.map((eachValue) => {
                            return (<MenuItem className={classes.selectMenuItem} key={eachValue} value={eachValue}>{eachValue}</MenuItem>)
                        }) : null
                        } */}
                                </Select>
                            </Grid>
                            <Grid sm={6} xs={12} className={classes.fieldContainer}>
                                <TextField className={classes.textField}
                                    required
                                    inputProps={{
                                      "data-testid": "add-user-password"
                                    }}
                                    margin="none"
                                    value={this.props.password}
                                    name="password"
                                    type="password"
                                    label="Password"
                                    placeholder="Enter Initial Password"
                                    onChange={this.props.OnHandleChange}
                                    onKeyDown={e => /[+-,#, ,]$/.test(e.key) && e.preventDefault()}
                                />
                            </Grid>
                            <Grid sm={6} xs={12} className={classes.fieldContainer}>
                                <TextField className={classes.textField}
                                    required
                                    inputProps={{
                                      "data-testid": "add-user-confirm-password"
                                    }}
                                    type="password"
                                    margin="none"
                                    value={this.props.confirmpassword}
                                    name="confirmpassword"
                                    label="Confirm Password"
                                    placeholder="Please Confirm Password"
                                    onChange={this.props.OnHandleChange}
                                    onKeyDown={e => /[+-,#, ,]$/.test(e.key) && e.preventDefault()}
                                />
                            </Grid>
                            <Grid sm={6} xs={12} className={classes.fieldContainer}>
                                <MuiPhoneNumber
                                    inputClass={classes.textField}
                                    onChange={(value) => this.props.OnHandleChange({ target: { value, name: 'mobilenumber' } })}
                                    inputProps={{
                                        'data-testid': "add-user-phno",
                                        name: 'mobilenumber',
                                        label: 'Mobile Number',
                                        value: this.props.mobilenumber
                                    }}
                                    required
                                    label="Phone Number"
                                    // onlyCountries={['in', 'kr']}
                                    defaultCountry="kr"
                                />
                            </Grid>
                            <Grid sm={6} xs={12} className={classes.fieldContainer}>
                                <TextField className={classes.textField}
                                    required
                                    multiline
                                    rowsMax="1"
                                    inputProps={{
                                      "data-testid": "add-user-email"
                                    }}
                                    margin="none"
                                    value={this.props.emailid}
                                    name="emailid"
                                    label="Email ID"
                                    placeholder="Enter Email Id"
                                    onChange={this.props.OnHandleChange}
                                    onKeyDown={e => /[+-,#, ,]$/.test(e.key) && e.preventDefault()}
                                />
                            </Grid>
                        </Grid>
                        <Grid sm={12} md={12} xs={12} item container className={classes.buttonContainer}>
                            <ButtonGroup size="small" color="primary" className={classes.buttonGroup}>
                                <Button color="primary" variant="contained" onClick={() => { this.props.openAlert("Cancel") }} className={classes.button}>Cancel</Button>
                                <Button color="primary" variant="contained" onClick={() => { this.props.openAlert("Submit") }} className={classes.button}>Submit</Button>
                            </ButtonGroup>
                        </Grid>
                    </ThemeProvider>
                </Grid>
            </Grid>
        )
    }
}
export default withStyles(styles)(AddNewUser);