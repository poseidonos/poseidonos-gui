import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    legendItem: {
        display: 'flex',
        alignItems: 'center',
        marginTop: theme.spacing(0.5)
    },
    legend: {
        border: '1px solid #ccc',
        float: 'left',
        width: 20,
        height: 20,
        marginRight: theme.spacing(0.5)
      },
      legendText: {
        marginRight: theme.spacing(3)
      }
}));
const Legend = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.legendItem}>
      <span className={classes.legend} style={{backgroundColor: props.bgColor}} />
      <Typography variant="span" className={classes.legendText} color="secondary">{props.title}</Typography>
    </div>
  )
};

export default Legend;