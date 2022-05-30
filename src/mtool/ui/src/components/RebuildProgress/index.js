import React from 'react';
import {
	Box,
	Grid,
	LinearProgress,
	Typography
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const styles = (theme) => ({
	root: {
		padding: theme.spacing(2)
	}
});

const RebuildProgress = (props) => {
  const {classes} = props;
  return (
	<Grid container direction="column" className={classes.root}>
	   <Box display="flex" minWidth={200} alignItems="center">
	     <Box width="100%" mr={1}>
	       <LinearProgress variant="determinate" value={props.progress ? props.progress : 0} />
	     </Box>
	     <Box minWidth={35}>
	       <Typography variant="body2" color="textSecondary">
	         {`${props.progress ? Math.round(props.progress) : 0}%`}
	       </Typography>
	     </Box>
	   </Box>
	</Grid>
  );
}

export default withStyles(styles)(RebuildProgress);
