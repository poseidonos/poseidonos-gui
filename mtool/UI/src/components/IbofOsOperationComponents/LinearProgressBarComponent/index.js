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
  //   const [completed, setCompleted] = [50,100]

  //   React.useEffect(() => {
  //     function progress() {
  //       setCompleted(oldCompleted => {
  //         if (oldCompleted === 100) {
  //           return 0;
  //         }
  //         const diff = Math.random() * 10;
  //         return Math.min(oldCompleted + diff, 100);
  //       });
  //     }

  // const timer = setInterval(progress, 500);
  //     return () => {
  //       clearInterval(timer);
  //     };
  //   }, []);

  return (
    <div className={classes.root}>
      <BorderLinearProgress className={classes.bar} variant="determinate" value={props.percent} />
      {/* <br />
      <LinearProgress color="secondary" variant="determinate" value={completed} /> */}
    </div>
  );
}
