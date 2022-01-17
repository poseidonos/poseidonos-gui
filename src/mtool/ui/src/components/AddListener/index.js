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
 *     * Neither the name of Samsung Corporation nor the names of its
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

import React, { useState } from 'react';
import { Button, FormControl, MenuItem, Select, TextField, ThemeProvider, withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actionTypes';
import MToolTheme from '../../theme';

const styles = (theme) => ({
    createSubsystemForm: {
        display: 'flex',
        flexDirection: 'column'
    },
    formItem: {
        width: '48%',
        margin: '1%',
        height: 48,
        justifyContent: 'flex-end'
    },
    submitBtn: {
        margin: theme.spacing(1)
    }
});

const defaultListener = {
    "ip": "",
    "port": "1158",
    "type": "tcp"
};

const AddListener = (props) => {
    const [listener, setListener] = useState({
        ...defaultListener,
        nqn: props.nqn
    });

    const onChange = (event) => {
        const { name, value } = event.target;
        setListener({
            ...listener,
            [name]: value
        })
    }

    const { classes } = props;
    return (
        <ThemeProvider theme={MToolTheme}>
            <form>
                <FormControl
                    className={classes.formItem}
                >
                    <TextField
                        label="NQN"
                        value={props.nqn}
                        name="nqn"
                        disabled
                    />
                </FormControl>
                <FormControl
                    className={classes.formItem}
                >
                    <TextField
                        label="IP"
                        value={listener.ip}
                        name="ip"
                        inputProps={{
                            "data-testid": "addListenerIP"
                        }}
                        onChange={onChange}
                    />
                </FormControl>
                <FormControl
                    className={classes.formItem}
                    size="small"
                >
                    <TextField
                        label="Port"
                        value={listener.port}
                        name="port"
                        type="number"
                        onChange={onChange}
                    />
                </FormControl>
                <FormControl
                    className={classes.formItem}
                    size="small"
                >
                    <Select
                        label="Select Type"
                        value={listener.type}
                        name="type"
                        onChange={onChange}
                    >
                        <MenuItem value="tcp">
                            TCP
                        </MenuItem>
                        <MenuItem value="rdma">
                            RDMA
                        </MenuItem>
                    </Select>
                </FormControl>
                <Button
                    className={classes.submitBtn}
                    variant="contained"
                    color="primary"
                    data-testid="addListenerSubmit"
                    onClick={() => props.Add_Listener(listener)}
                >
                    Add Listener
                </Button>
            </form>
        </ThemeProvider>
    );
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
    Add_Listener: (payload) => dispatch({ type: actionTypes.SAGA_ADD_LISTENER, payload })
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AddListener));
