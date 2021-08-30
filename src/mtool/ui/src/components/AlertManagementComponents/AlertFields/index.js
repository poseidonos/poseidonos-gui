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
import { FormControlLabel, Radio, RadioGroup, Grid, Typography, withStyles } from '@material-ui/core';
import './AlertFields.css';


const styles = (theme => {
  return ({
    radioGroup:{
      display:'flex',
      flexDirection:'column',
      marginLeft:theme.spacing(1)
    },
    alertTypesOuterGrid: {
      border: '1px solid gray',
      maxWidth: '100%',
      minHeight: '130px',
      maxHeight: '130px',
      overflowY: 'auto',
      overflowX: 'hidden',
      background: '#fff'
    },
    alertTypesInnerGrid: {
      maxWidth: '100%',
    },
    alertTypesHeader: {
      backgroundColor: '#788595',
      color: 'white',
      paddingLeft: '5px',
      paddingTop: '3px',
      fontSize: 14,
      height: '25px',
    },
    radioButtonClass: {
      margin: theme.spacing(1, 0),
    }
  })
});

const AlertFields = props => {
  const { classes } = props;
  return (
    <Grid sm={6} xs={12} item container data-testid = "AlertFieldsTag">
      <Grid xs={12} item className={classes.alertTypesOuterGrid}>
        <Typography className={classes.alertTypesHeader} variant="h6">Alert Fields</Typography>
        <Grid sm={6} xs={12} item className={classes.alertTypesInnerGrid}>
          <input name="alertRadioButton" onChange={props.onHandleChange} data-testid="alert-hidden-radio-button-group" style={{display: "none"}} />
          <RadioGroup
            name="alertRadioButton"
            data-testid="alert-radio-btn-group"
            className={classes.radioGroup}
            onChange={props.onHandleChange}
          >
            {props.alertClusterList && props.alertClusterList[props.radioindex] && props.alertClusterList[props.radioindex].alertFields &&
              props.alertClusterName 
              ? props.alertClusterList[props.radioindex].alertFields.map(
                (alertField) => {
                  return (
                    alertField !== 'NA' ?
                      (
                        <FormControlLabel
                          key = {alertField}
                          control={<Radio data-testid = "alertFieldRadioTag" />}
                          checked={props.alertRadioButton === alertField}
                          value={alertField}
                          label={alertField}
                          labelPlacement="end"
                        />
                      )
                      : alertField);
                }
              )
              : null}
          </RadioGroup>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(AlertFields);
