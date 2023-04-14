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

import React from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actionTypes';

const styles = (theme) => ({
    createTransportForm: {
        display: 'flex',
        flexDirection: 'column'
    },
    formItem: {
        margin: theme.spacing(1)
    }
});

const CreateTransport = (props) => {
    const { classes } = props;

    const createTransportSubmit = (event) => {
        event.preventDefault();
        const { transportType, bufCacheSize, numSharedBuf } = event.target.elements;
        props.Create_Transport({
            transportType: transportType.value,
            bufCacheSize: parseInt(bufCacheSize.value, 10),
            numSharedBuf: parseInt(numSharedBuf.value, 10),
        }, props.cleanup);
    }

    return (
        <form className={classes.createTransportForm} onSubmit={createTransportSubmit}>
            <FormControl
                size="small"
                className={classes.formItem}
            >
                <InputLabel htmlFor="transportType">Transport Type</InputLabel>
                <Select
                    inputProps={{
                        id: "transportType",
                        "data-testid": "transportType"
                    }}
                    name="transportType"
                    defaultValue="TCP"
                >
                    <MenuItem value="TCP" data-testid="tcp">
                        TCP
                    </MenuItem>
                </Select>
            </FormControl>
            <FormControl
                className={classes.formItem}
            >
                <TextField
                    label="Buf Cache Size"
                    name="bufCacheSize"
                    type="number"
                    defaultValue={64}
                    inputProps={{
                        "data-testid": "bufCacheSize"
                    }}
                />
            </FormControl>
            <FormControl
                className={classes.formItem}
                size="small"
            >
                <TextField
                    label="Num Shared Buf"
                    name="numSharedBuf"
                    type="number"
                    defaultValue={4096}
                    inputProps={{
                        "data-testid": "numSharedBuf"
                    }}
                />
            </FormControl>
            <Button
                className={classes.formItem}
                variant="contained"
                color="primary"
                type="submit"
                data-testid="CreateTransport"
            >
                Create Transport
            </Button>
        </form>
    );
}


const mapDispatchToProps = (dispatch) => ({
    Create_Transport: (payload, cleanup) => dispatch({type: actionTypes.SAGA_CREATE_TRANSPORT, payload, cleanup})
});

export default connect(null, mapDispatchToProps)(withStyles(styles)(CreateTransport));
