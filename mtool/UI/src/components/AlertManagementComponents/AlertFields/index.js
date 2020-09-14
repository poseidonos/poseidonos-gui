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


DESCRIPTION: Alert Management Component for selecting Alert Fields
@NAME : index.js
@AUTHORS: Jay Hitesh Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
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
      fontSize: '14px',
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
