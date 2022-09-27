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
 *     * Neither the name of Samsung Corporation nor the names of its
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

import React, { useState } from 'react';
import { Grid, Typography, withStyles, ThemeProvider } from '@material-ui/core';
import { Add, Check, Clear, FirstPage, LastPage, Search, ChevronRight, ChevronLeft, Remove, ArrowUpward } from '@material-ui/icons';
import MaterialTable from 'material-table';
import { customTheme, TableTheme } from '../../theme';
import Popup from '../Popup';
import AddListener from '../AddListener';

const styles = (theme) => ({
  cardHeader: {
    ...customTheme.card.header,
    marginLeft: 0
  },
  detailText: {
    fontWeight: 600,
    margin: theme.spacing(0, 4)
  },
  internalRow: {
    height: 50,
    padding: theme.spacing(0, 8),
    borderBottom: "1px solid lightgray"
  }
});


const icons = {
  Add,
  FirstPage,
  LastPage,
  NextPage: ChevronRight,
  PreviousPage: ChevronLeft,
  ThirdStateCheck: Remove,
  DetailPanel: ChevronRight,
  SortArrow: ArrowUpward,
  Check,
  Search,
  ResetSearch: Clear
};

const SubsystemDetails = (props) => {
  const { classes } = props;
  const [isPopupOpen, setPopupState] = useState(false);

  const closePopup = () => {
    setPopupState(false);
  }


  const addressColumns = [{
    title: "Target Address",
    field: "targetAddress"
  }, {
    title: "Port",
    field: "transportServiceId"
  }, {
    title: "Family",
    field: "addressFamily"
  }];
  const namespaceColumns = [{
    title: "BDEV Name",
    field: "bdevName"
  }, {
    title: "ID",
    field: "nsid"
  }, {
    title: "UUID",
    field: "uuid"
  }];

  return (
    <ThemeProvider theme={TableTheme}>
      <Grid container spacing={1}>
        <Grid item container md={12} justifyContent="space-between" alignItems="center" className={classes.internalRow}>
          <Typography variant="p" className={classes.detailText}>Max Namespaces: {props.data.maxNamespaces}</Typography>
          <Typography variant="p" className={classes.detailText}>Allow Any Hosts: {props.data.allowAnyHost ? "Yes" : "No"}</Typography>
          <Typography variant="p" className={classes.detailText}>Model No: {props.data.modelNumber}</Typography>
          <Typography variant="p" className={classes.detailText}>Serial No: {props.data.serialNumber}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <MaterialTable
            title={(
              <Typography className={classes.cardHeader}>Namespaces</Typography>
            )}
            columns={namespaceColumns}
            data={props.data.namespaces}
            icons={icons}
            options={{
              maxBodyHeight: 350,
              minBodyHeight: 350,
              headerStyle: {
                backgroundColor: "#788595",
                color: "#FFF",
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <MaterialTable
            title={(
              <Typography className={classes.cardHeader}>Listen Addresses</Typography>
            )}
            actions={[{
              icon: Add,
              tooltip: "Add a Listener",
              isFreeAction: true,
              onClick: () => {
                setPopupState(true);
              }
            }]}
            columns={addressColumns}
            data={props.data.listenAddresses}
            icons={icons}
            options={{
              maxBodyHeight: 350,
              minBodyHeight: 350,
              headerStyle: {
                backgroundColor: "#788595",
                color: "#FFF",
              }
            }}
          />
        </Grid>
      </Grid>
      <Popup
        title="Add Listener"
        open={isPopupOpen}
        close={closePopup}
      >
        <AddListener subnqn={props.data.subnqn} />
      </Popup>

    </ThemeProvider>
  );
}

export default (withStyles(styles)(SubsystemDetails));
