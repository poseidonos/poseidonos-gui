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
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from "@material-ui/lab/TreeItem";
import { Grid, Typography, withStyles } from '@material-ui/core';
import './AlertTypes.css';

const styles = (() => {
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
      fontSize: 14,
      height: '25px',
    },
    alertSpacing: {
      marginLeft:"7px",
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
                  <TreeItem className={classes.alertSpacing} nodeId={cluster.name} label={cluster.name}
                    role="treeitem"
                    onClick={() => {
                      props.selectAlertCluster(cluster, i)
                    }
                    }
                  >
                    {/* {cluster.alertSubCluster
                      ? cluster.alertSubCluster.map((subcluster, j) => {
                        return (
                           <TreeItem key={subcluster.name} nodeId={subcluster.name} label={subcluster.name} data-testid={`subtreeitem-${i}-${j}`} role="subtreeitem" onClick={() => {
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
                      }) : null} */}
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
