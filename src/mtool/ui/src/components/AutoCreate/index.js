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
 *     * Neither the name of Intel Corporation nor the names of its
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

import {
	Button,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	Link,
	TextField,
	ThemeProvider,
	Typography,
	withStyles
} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import MToolTheme from "../../theme";
import Popup from "../Popup";

const styles = (theme) => ({
    container: {
        marginTop: theme.spacing(1),
        textAlign: 'center',
        padding: theme.spacing(1)
    },
    inputGrid: {
      [theme.breakpoints.down("xs")]: {
        display: "flex",
        justifyContent: "center",
      },
    },
    formControl: {
      margin: theme.spacing(2, 2),
      minWidth: 170,
      width: 200,
      maxWidth: "80%",
      [theme.breakpoints.down("xs")]: {
        margin: theme.spacing(1, 0),
      }
    },
    writeBufferSelect: {
      "&>div>p": {
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }
});

const getFreeDisk = function(disks) {
   const freeDisks = disks && disks.filter ?
       disks.filter(disk => disk.isAvailable) : [];
   if(freeDisks.length > 0) return freeDisks[0].name;
   if(disks && disks.length > 0) return disks[0].name;
   return "";
}

const getFreeDisks = function(disks) {
   const freeDisks = disks && disks.filter ?
       disks.filter(disk => disk.isAvailable) : [];
   return freeDisks.length;
}

const getRaidType = function(raids, value) {
   if(raids) {
     const raid = raids.find(raid => raid.value === value);
     return raid || {};
   }
   return {}
}

const AutoCreate = (props) => {
    const {classes} = props;
    const [dialogOpen, setDialogOpen] = useState(false);
    const [array, setArray] = useState({
      arrayName: "",
      metaDisk: "",
      raidtype: "",
      storageDisks: 0,
      spareDisks: 0
    });
    const [constraints, setConstraints] = useState({
       minStorage: 3,
       minSpare: 0,
       maxStorage: 32,
       maxSpare: 32
    });

    const setDiskConstraints = () => {
      const raidType = getRaidType(props.config.raidTypes, array.raidtype);
      setConstraints({
        minStorage: raidType.minStorageDisks,
        minSpare: raidType.minSpareDisks,
        maxStorage: raidType.maxStorageDisks,
        maxSpare: raidType.maxSpareDisks
      });
    }

    useEffect(() => {
      setArray({
	    arrayName: "",
	    metaDisk: getFreeDisk(props.metadisks),
        raidtype: "RAID5",
        storageDisks: 3,
        spareDisks: 0
      });
      setDiskConstraints();
    }, [props]);

    useEffect(() => {
      setDiskConstraints();
    }, [array, props]);

    const closeDialog = () => setDialogOpen(false);
    const openDialog = () => setDialogOpen(true);
    const handleChange = (event) => {
        setArray({
            ...array,
            [event.target.name]: event.target.value
        });
    }
    const autoCreateArray = () => {
        const raidType = getRaidType(props.config.raidTypes, array.raidtype);
        props.autoCreateArray({
             array,
             freeDisks: getFreeDisks(props.disks),
             selectedRaid: raidType
        });
    };
    return (
        <ThemeProvider theme={MToolTheme}>
            <Paper
                className={classes.container}
                variant="contained"
                color="primary"
            >
                <Typography>Need an Array Created Quickly?</Typography>
                <Button onClick={openDialog} variant="contained" color="primary">Auto-Create</Button>
            </Paper>
	    <Popup
                title="Create Array"
                open={dialogOpen}
                close={closeDialog}
	    >
             <Grid item container justifyContent="center" xs={12} className={classes.inputGrid}>
	       <FormControl className={classes.formControl}>
                <TextField
                  id="auto-array-name"
                  name="arrayName"
                  label="Array Name"
                  value={array.arrayname}
                  onChange={handleChange}
                  inputProps={{
                    "data-testid": "auto-array-name",
                  }}
	          className={classes.formText}
                />
        </FormControl>
             </Grid>
	     <Grid item container justifyContent="center" xs={12} className={classes.inputGrid}>
	       <FormControl className={classes.formControl}>
               <InputLabel htmlFor="writebuffer">Write Buffer Path</InputLabel>
                <Select
                value={array.metaDisk}
                onChange={handleChange}
                inputProps={{
                  name: "metaDisk",
                  id: "auto-writebuffer",
                  "data-testid": "auto-writebuffer-input",
                }}
                SelectDisplayProps={{
                  "data-testid": "auto-writebuffer",
                }}
                className={classes.writeBufferSelect}
                >
                {props.metadisks
                  ? props.metadisks.map((disk) => (
                    <MenuItem key={disk.name} value={disk.name}>
                      <Typography color="secondary">{disk.displayMsg}</Typography>
                    </MenuItem>
                  ))
                  : null}
                </Select>
                <Link href="/operations/devices" align="right">Create Disk</Link>
        </FormControl>
      </Grid>
	    <Grid item container justifyContent="center" xs={12} className={classes.inputGrid}>
	      <FormControl className={classes.formControl}>
              <InputLabel htmlFor="auto-raid">Fault tolerance Level</InputLabel>
              <Select
                value={array.raidtype}
                onChange={handleChange}
                inputProps={{
                  name: "raidtype",
                  id: "auto-raidtype",
                  "data-testid": "auto-raid-select-input",
                }}
                SelectDisplayProps={{
                  "data-testid": "auto-raid-select",
                }}
              >
                {props.config.raidTypes && props.config.raidTypes.map((raid) => (
                  <MenuItem value={raid.value} key={raid.value}>
                    <Typography color="secondary">{raid.label}</Typography>
                  </MenuItem>
                ))}
              </Select>
       </FormControl>
	    </Grid>
	    <Grid item container justifyContent="center" xs={12} className={classes.inputGrid}>
          <span>Total Disks Available: {getFreeDisks(props.disks)}</span>
     </Grid>
        <Grid item container justifyContent="center" xs={12} className={classes.inputGrid}>
	    <FormControl className={classes.formControl}>
                  <TextField
                    id="no-of-storage-disk"
                    label="Number of Storage Disks"
                    name="storageDisks"
                    value={array.storageDisks}
                    onChange={handleChange}
                    type="number"
                    inputProps={{
                      "data-testid": "auto-storage-disks",
                      min: 0
                    }}
                    required
                  />
                  {`Minimum : ${constraints.minStorage}, Maximum : ${constraints.maxStorage}`}
     </FormControl>
        </Grid>
	    <Grid item container justifyContent="center" xs={12} className={classes.inputGrid}>
            <FormControl className={classes.formControl}>
                  <TextField
                    id="no-of-spare-disk"
                    label="Number of Spare Disks"
                    name="spareDisks"
                    value={array.spareDisks}
                    onChange={handleChange}
                    type="number"
                    inputProps={{
                      "data-testid": "auto-spare-disks",
                      min: 0
                    }}
                    required
                  />
                  {`Minimum : ${constraints.minSpare}, Maximum : ${constraints.maxSpare}`}
            </FormControl>
     </Grid>
	    <Grid item container justifyContent="center" xs={12} className={classes.inputGrid}>
	    <Button
                onClick={autoCreateArray}
                variant="contained"
                color="primary"
                data-testid="auto-createarray-btn"
                className={classes.button}
	    >
                Create Array
     </Button>
     </Grid>
     </Popup>
        </ThemeProvider>
    );
};

export default withStyles(styles)(AutoCreate);
