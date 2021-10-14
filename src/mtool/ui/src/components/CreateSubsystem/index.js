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
import { Checkbox } from '@material-ui/core';

const styles = (theme) => ({
    createSubsystemForm: {
        display: 'flex',
        flexDirection: 'column'
    },
    formItem: {
        margin: theme.spacing(1)
    }
});

const CreateSubsystem = (props) => {
    const { classes } = props;
    return (
        <form className={classes.createDiskForm}>
            <FormControl
              className={classes.formItem}
            >
                <TextField
                    label="SUBNQN"
                />
            </FormControl>
            <FormControl
                className={classes.formItem}
                size="small"
            >
                <TextField
                    label="Serial Number"
                />
            </FormControl>
            <FormControl
                className={classes.formItem}
                size="small"
            >
                <TextField
                    label="Model Number"
                />
            </FormControl>

            <FormControl
                className={classes.formItem}
                size="small"
            >
                <TextField
                    label="Maximum Namespaces"
                />
            </FormControl>
            <FormControl
                className={classes.formItem}
                size="small"
            >
                <InputLabel htmlFor="allowAnyHost">
                    Allow Any Host?
                </InputLabel>
                <Checkbox
                    inputProps={{
                        id: "allowAnyHost"
                    }}
                />
                   
            </FormControl>
            <Button
                className={classes.formItem}
                variant="contained"
                color="primary"
            >
                Create Subsystem
            </Button>
        </form>
    );
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
    Create_Disk: (payload) => dispatch({type: actionTypes.SAGA_CREATE_SUBSYSTEM, payload})
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CreateSubsystem));