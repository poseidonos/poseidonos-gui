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


DESCRIPTION: Alert Management Component for selecting Alert Types
@NAME : index.js
@AUTHORS: Jay Hitesh Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
*/
import React from 'react';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from "@material-ui/lab/TreeItem";
import { FormControlLabel, Checkbox, FormGroup, Grid, Typography, withStyles } from '@material-ui/core';
import './AlertTypes.css';

const styles = (theme => {
  return ({
    alertTypesOuterGrid: {
      border: '1px solid gray',
      maxWidth: '100%',
      overflowY: 'auto',
      overflowX: 'hidden',
      minHeight: '130px',
      maxHeight: '130px',
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
    }
  })
});
const AlertTypes = props => {
  const { classes } = props;
  return (
    <Grid sm={6} xs={12} data-testid="AlertsTypesTag" item container>
      <Grid xs={12} item className={classes.alertTypesOuterGrid}>
        <Typography className={classes.alertTypesHeader} variant="h6">Alert Types</Typography>
        <Grid sm={6} xs={12} item className={classes.alertTypesInnerGrid}>
          {props.alertClusterList
            ? props.alertClusterList.map((cluster, i) => {
              return (
                <TreeView
                  key={cluster._id}
                  defaultCollapseIcon={<ExpandMoreIcon />}
                  defaultExpandIcon={<ChevronRightIcon />}
                  data-testid="ClusterTag"
                >
                  <TreeItem nodeId={cluster.name} label={cluster.name}
                    role="treeitem"
                    onClick={() => {
                      props.selectAlertCluster(cluster, i)
                    }
                    }
                  >
                    {cluster.alertSubCluster
                      ? cluster.alertSubCluster.map((subcluster, j) => {
                        return (
                          <TreeItem key={subcluster.name} nodeId={subcluster.name} label={subcluster.name} role="subtreeitem" onClick={() => {
                            props.selectAlertSubCluster(cluster.name, subcluster, i);
                          }}
                          >
                            <FormGroup row={false} root={classes.root}>
                              {subcluster.alertTypes.map(type => {
                                return (
                                  <FormControlLabel
                                    key={type.type}
                                    control={<Checkbox checked={!(!type.selected)} onChange={() => props.alertTypeSelected(type, i, j)} />}
                                    label={type.type}
                                    data-testid = "alertTypesCheckbox" 
                                    role="formControl"
                                    labelPlacement="end"
                                  />

                                );

                              })}
                            </FormGroup>
                          </TreeItem>
                        );
                      }) : null}
                  </TreeItem>
                </TreeView>
              );
            })
            : null}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(AlertTypes);
