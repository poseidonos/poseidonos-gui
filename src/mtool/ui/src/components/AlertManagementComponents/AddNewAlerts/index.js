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

import React from 'react';
import { TextField, withStyles, Grid, Typography, Select, MenuItem, ButtonGroup, Button } from '@material-ui/core';
import './AddNewAlerts.css';


const styles = (theme => {
  return ({
    addNewAlertsOuterGrid: {
      border: '1px solid gray',
      maxWidth: '100%',
      minHeight: '140px',
      maxHeight: '140px',
      overflowY: 'auto',
      justifyContent: 'center',
      background: '#fff'
    },
    addNewAlertsFirstInnerGrid: {
      maxWidth: '58%',
      flexBasis: '58%',
      marginTop: theme.spacing(2),
    },
    addNewAlertsSecondInnerGrid: {
      maxWidth: '42%',
      marginTop: theme.spacing(2),
    },
    addNewAlertsThirdInnerGrid: {
      maxWidth: '100%',
      flexBasis: '100%',
      marginBottom: theme.spacing(2)
    },
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      maxWidth: '100%'
    },
    textField: {
      marginLeft: theme.spacing(2),
      width: '36%',
    },
    formLabel: {
      marginTop: theme.spacing(2.7),
      marginLeft: theme.spacing(1.7),
      marginRight: theme.spacing(1.7),
      display: 'inline-flex',
      justifyContent: 'center',
      width: '18%',
      fontSize: 12
    },
    description: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      marginTop: theme.spacing(1),
      width: '90%',
      overflowY: 'auto'
    },
    formLabelIs: {
      marginTop: theme.spacing(2.7),
      marginRight: theme.spacing(1.7),
      display: 'inline-flex',
      justifyContent: 'center',
      width: '5%',
      marginLeft: '0px'
    },
    selectFieldItem: {
      color: 'black',
      width: '50%'
    },
    selectMenuItem: {
      color: 'black',
    },
    button: {
      float: 'right',
      marginTop: theme.spacing(3.5),
      marginLeft: theme.spacing(2),
      textTransform: 'none',
      paddingTop: '1px',
      background: '#788595',
      minWidth: '55px',
      maxHeight: '25px',
      color: 'white',
      '&:hover': {
        background: 'rgb(94,104,116)',
        // borderColor: 'black',
        color: 'white'
      }
    },
  })
});


const AddNewAlerts = props => {
  const { classes } = props;
  return (
    <Grid container spacing={1 / 2} direction="row" className={classes.addNewAlertsOuterGrid} data-testid="addNewAlertsTag">
      <Grid sm={6} xs={12} item container className={classes.addNewAlertsFirstInnerGrid}>
        <TextField className={classes.textField}
          required
          multiline
          rowsMax="1"
          id="standard-required"
          margin="none"
          value={props.alertName}
          name="alertName"
          label="Alert Name"
          placeholder="Enter Alert Name"
          onChange={props.onHandleChange}
          inputProps={{'data-testid': "alert-create-name"}}
          onKeyDown={e => /[+-.,#, ,]$/.test(e.key) && /* istanbul ignore next */ e.preventDefault()}
        />
        <Typography className={classes.formLabel} variant="caption"> -Send Alert Where</Typography>
        {/* <TextField
          required
          disabled
          label="Alert Field"
          id="standard-name"
          value={props.alertRadioButton}
          className={classes.textField}
          margin="none"
        /> */}
        <Select
          className={classes.textField}
          onChange={props.onHandleChange}
          name="alertRadioButton"
          value={props.alertRadioButton}
        >
          {props.alertTypes ? props.alertTypes.map((type) => (
            <MenuItem value={type}>{type}</MenuItem>
          )) : null}
        </Select>
      </Grid>
      <Grid sm={6} xs={12} item className={classes.addNewAlertsSecondInnerGrid}>
        <Typography className={classes.formLabelIs} variant="caption">Is</Typography>
        <Select
          className={classes.selectFieldItem}
          onChange={props.onHandleDropdownChange}
          value={props.alertCondition}
          SelectDisplayProps={{ 'data-testid': "selectAddNewAlertsTag" }}
          inputProps={{
            'data-testid': "alert-add-select-condition"
          }}
        >
          {props.dropdownCondition ? props.dropdownCondition.map((eachValue) => {
            return (<MenuItem className={classes.selectMenuItem} key={eachValue} value={eachValue} data-testid={eachValue}>{eachValue}</MenuItem>)
          }) : null
          }
        </Select>
        <TextField
          inputProps={{
          'data-testid':"Alert_Range_TextField"
          }}
          required
          multiline
          rowsMax="1"
          name="alertRange"
          onChange={props.onHandleChange}
          placeholder="Please specify a value in % eg.10"
          id="standard-required"
          value={props.alertRange}
          className={classes.textField}
          label="Value"
          margin="none"
          onKeyDown={f => /[+-,.,#]$/.test(f.key) && /* istanbul ignore next */ f.preventDefault()}
        />
      </Grid>
      <Grid sm={6} xs={12} item className={classes.addNewAlertsThirdInnerGrid}>
        <TextField
          id="standard-multiline-flexible"
          label="Description"
          multiline
          rowsMax="1"
          className={classes.description}
          margin="none"
          onChange={props.onHandleChange}
          placeholder="Enter your message here - This will be the subject of your email"
          value={props.description}
          inputProps={{
            'data-testid': "alert-add-new-description"
          }}
          name="description"
        />
        <ButtonGroup data-testid="ButtonTag" size="small" color="primary" onClick={() => { props.openAlert('Add') }}>
          <Button variant="contained" data-testid="alert-add-btn" className={classes.button}>Add</Button>
        </ButtonGroup>

      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(AddNewAlerts);
