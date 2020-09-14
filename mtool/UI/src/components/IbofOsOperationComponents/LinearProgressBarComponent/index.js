import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles,withStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    float: 'left',
    marginLeft: '2%',
    width:'20%',
  },
  bar:{
    color:'black',
    backgroundColor:'red',
    borderRadius: 20,
  },
});

const BorderLinearProgress = withStyles({
  root: {
    height: 5,
    backgroundColor: 'darkgray',
  },
  barColorPrimary: {
    backgroundColor: 'white',
  },
  bar: {
    borderRadius: 20,
    backgroundColor: '#6fcd60',
  },
})(LinearProgress);

export default function LinearProgressBarComponent(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <BorderLinearProgress className={classes.bar} variant="determinate" value={props.percent} />
    </div>
  );
}
