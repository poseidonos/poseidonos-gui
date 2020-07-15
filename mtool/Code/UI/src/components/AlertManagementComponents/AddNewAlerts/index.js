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


DESCRIPTION: Alert Management Component for adding new alert rule/query
@NAME : index.js
@AUTHORS: Jay Hitesh Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
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
          onKeyDown={e => /[+-.,#, ,]$/.test(e.key) && e.preventDefault()}
        />
        <Typography className={classes.formLabel} variant="caption"> -Send Alert Where</Typography>
        <TextField
          required
          disabled
          label="Alert Field"
          id="standard-name"
          value={props.alertRadioButton}
          className={classes.textField}
          margin="none"
        />
      </Grid>
      <Grid sm={6} xs={12} item className={classes.addNewAlertsSecondInnerGrid}>
        <Typography className={classes.formLabelIs} variant="caption">Is</Typography>
        <Select
          className={classes.selectFieldItem}
          onChange={props.onHandleDropdownChange}
          value={props.alertCondition}
          SelectDisplayProps={{ 'data-testid': "selectAddNewAlertsTag" }}
        >
          {props.dropdownCondition ? props.dropdownCondition.map((eachValue) => {
            return (<MenuItem className={classes.selectMenuItem} key={eachValue} value={eachValue} data-testid="selectMenuItemAddNewAlertsTag">{eachValue}</MenuItem>)
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
          onKeyDown={f => /[+-,.,#]$/.test(f.key) && f.preventDefault()}
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
          name="description"
        />
        <ButtonGroup data-testid="ButtonTag" size="small" color="primary" onClick={() => { props.openAlert('Add') }}>
          <Button variant="contained" className={classes.button}>Add</Button>
        </ButtonGroup>

      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(AddNewAlerts);
