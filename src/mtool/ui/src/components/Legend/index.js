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
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(0.5)
  },
  legend: {
    border: '1px solid #aaa',
    float: 'left',
    width: 12,
    height: 12,
    marginLeft: theme.spacing(1.5),
    marginRight: theme.spacing(0.5)
  },
  legendText: {
    // marginRight: theme.spacing(3),
    fontSize: 12,
  },
  legendValue: {
    paddingRight: theme.spacing(0.5),
  }
}));
const Legend = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.legendItem} style={props.value || props.value === 0 ? { alignItems: "baseline" } : {}}>
      <span className={classes.legend} style={{ backgroundColor: props.bgColor }} />
      {
        (props.value || props.value === 0) &&
        (
          <Typography className={classes.legendValue} color="secondary" variant="h6">
            {props.value}
          </Typography>
        )
      }
      <Typography className={classes.legendText} color="secondary">{props.title}</Typography>
    </div>
  )
};

export default Legend;