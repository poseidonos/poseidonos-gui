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

import React, { Component } from 'react';
import 'react-dropdown/style.css';
import PropTypes from 'prop-types';
import Search from '@material-ui/icons/Search';
import SaveAlt from '@material-ui/icons/SaveAlt';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Add from '@material-ui/icons/Add';
import Check from '@material-ui/icons/Check';
import FilterList from '@material-ui/icons/FilterList';
import Remove from '@material-ui/icons/Remove';
import EditIcon from '@material-ui/icons/EditTwoTone';
import TrashIcon from '@material-ui/icons/Delete';
import ReplayIcon from '@material-ui/icons/Replay';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Clear from '@material-ui/icons/Clear';
import { Paper, Typography, TextField, Button, Switch, Select, MenuItem, Box } from '@material-ui/core';
import { createTheme, withStyles, MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles';
import MaterialTable from 'material-table';

import { Done } from '@material-ui/icons';
import AlertDialog from '../../Dialog';
import { customTheme } from '../../../theme';
import formatBytes from '../../../utils/format-bytes';


const styles = (theme) => ({
  cardHeader: {
    ...customTheme.card.header,
    marginLeft: 0
  },
  editBtn: {
    minWidth: 24,
    borderRadius: 100
  },
  volName: {
    width: "inherit",
    overflow: "hidden",
    textOverflow: "ellipsis",
    [theme.breakpoints.down("md")]: {
      maxWidth: 150,
    },
    "&:hover": {
      width: "auto",
      maxWidth: "calc(100% - 100px)",
      backgroundColor: "white",
      position: "absolute",
      marginTop: -theme.spacing(2),
      zIndex: 1000,
      overflow: "visible",
      wordBreak: "break-all"
    }
  }
});

const RESET_MIN_IOPS_TITLE = "To change minimum bandwidth reset Minimum IOPS"
const RESET_MIN_BW_TITLE = "To change minimum iops reset minimum Bandwidth"
const RESET_MIN_IOPS_DETAILS = "Are you sure want to reset Minimum IOPS?"
const RESET_MIN_BW_DETAILS = "Are you sure want to reset minimum Bandwidth?"
const MINIOPS = "miniops"
const MINBW = "minbw"

class VolumeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedVolumes: [],
      open: false,
      popupOpen: false,
      alertTile: "",
      alertDetails: "",
      resetVolumeRow: {}
    };

    this.theme = createTheme({
      typography: {
        fontSize: 14,
        fontFamily: 'Arial'
      },
      palette: {
        primary: {
          main: '#4caf50',
        },
        secondary: {
          main: 'rgba(0, 0, 0, 0.54)'
        },
      },
    });
    this.showPopup = this.showPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.setState({ open: false });
  }

  handleClickOpen() {
    this.setState({
      open: true,
    });
  }

  onVolumeEdit(value, name, row) {
    const { id } = row;
    if (name === "select-minbw-miniops") {

      if (value === MINIOPS) {
        if (row.oldMinbw > 0) {
          this.setState((state) => {
            return {
              ...state,
              resetVolumeRow: {
                ...state.resetVolumeRow,
                minbw: 0
              }
            }
          })
          this.showPopup(RESET_MIN_BW_TITLE)
        }
        this.props.changeMinType({ id, minType: MINIOPS })
      }
      else if (value === MINBW) {
        if (row.oldMiniops > 0) {
          this.setState((state) => {
            return {
              ...state,
              resetVolumeRow: {
                ...state.resetVolumeRow,
                miniops: 0
              }
            }
          })
          this.showPopup(RESET_MIN_IOPS_TITLE)
        }
        this.props.changeMinType({ id, minType: MINBW })
      }
      return;
    }

    if (name === "minbw-miniops") {
      if (row.minType === MINBW) {
        this.props.changeField({
          value,
          name: MINBW,
          id
        });
        return;
      }

      // making miniops as default
      if (row.minType === "") {
        this.props.changeMinType({ id, minType: MINIOPS })
      }

      this.props.changeField({
        value,
        name: MINIOPS,
        id
      });
      return;
    }

    this.props.changeField({
      value,
      name,
      id
    });
  }

  showPopup(name) {
    if (name === RESET_MIN_BW_TITLE) {
      this.setState({
        popupOpen: true,
        alertTile: RESET_MIN_BW_TITLE,
        alertDetails: RESET_MIN_BW_DETAILS
      });
      return
    }
    this.setState({
      popupOpen: true,
      alertTile: RESET_MIN_IOPS_TITLE,
      alertDetails: RESET_MIN_IOPS_DETAILS
    });
  }

  closePopup() {
    this.setState({
      ...this.state,
      popupOpen: false,
    });
  }

  selectVolumes(volumes) {
    this.setState({
      selectedVolumes: volumes
    })
  }

  render() {
    const { classes } = this.props;
    const cellText = {
      fontSize: 12
    }
    const volumeTableColumns = [
      {
        title: 'Name',
        field: 'name',
        cellStyle: cellText,
        render: rowData => {
          if (rowData.edit) {
            return (
              <TextField
                id={`VolumeList-textfield-name-${rowData.name}`}
                value={rowData.newName}
                inputProps={{
                  min: 0,
                  'data-testid': `list-vol-name-${rowData.name}`
                }}
                onChange={(e) => this.onVolumeEdit(e.target.value, 'newName', rowData)}
              />
            )
          }
          return (
            <Typography className={classes.volName}>
              {rowData.name}
            </Typography>
          );

        }
      },
      {
        title: 'Size Usage',
        render: rowData => `${rowData.usedspace }/${ formatBytes(rowData.size)}`,
        cellStyle: cellText
      },
      {
        title: 'NQN',
        render: rowData => (
          <>
            <Typography variant="body2" displayBlock>NQN: {rowData.subnqn}</Typography>
            <Typography variant="body2" displayBlock>UUID: {rowData.uuid}</Typography>
          </>
        )
      },
      {
        title: 'Max IOPS (KIOPS)',
        field: 'maxiops',
        cellStyle: cellText,
        render: rowData => {
          if (rowData.edit) {
            return (
              <TextField
                id={`VolumeList-textfield-maxiops-${rowData.name}`}
                value={rowData.maxiops}
                type="number"
                inputProps={{
                  min: 0,
                  'data-testid': `list-vol-maxiops-${rowData.name}`
                }}
                onChange={(e) => this.onVolumeEdit(e.target.value, 'maxiops', rowData)}
              />
            )
          }
          return rowData.maxiops === 0 /* istanbul ignore next */ ? 'MAX' : rowData.maxiops;

        }
      },
      {
        title: 'Max Bandwidth (MB/s)',
        field: 'maxbw',
        cellStyle: cellText,
        render: rowData => {
          if (rowData.edit) {
            return (
              <TextField
                id={`VolumeList-textfield-maxbw-${rowData.name}`}
                name="maxbw"
                value={rowData.maxbw}
                type="number"
                inputProps={{
                  min: 0,
                  'data-testid': `list-vol-maxbw-${rowData.name}`
                }}
                onChange={(e) => this.onVolumeEdit(e.target.value, 'maxbw', rowData)}
              />
            )
          }
          return rowData.maxbw === 0 /* istanbul ignore next */ ? 'MAX' : rowData.maxbw;

        }
      },
      {
        title: 'Min Bandwidth / Min IOPS',
        field: 'minbw-miniops',
        cellStyle: cellText,
        customSort: (a, b) => {
          if (a.minType === b.minType)
            return a.minType === MINIOPS ? (a.miniops - b.miniops) : (a.minbw - b.minbw);
          if (a.minType === MINIOPS)
            return 1;
          if (b.minType === MINIOPS)
            return -1;
          if (a.minType === MINBW)
            return 1;
          if (b.minType === MINBW)
            return -1;

          return 0;
        },
        render: rowData => {
          const localStyle = {
            ...cellText,
            display: "flex",
            width: "130px",
            justifyContent: "space-between",
            gap: "4px"
          }

          // showing miniops as default
          const localValue = rowData.minType === MINBW ? rowData.minbw : rowData.miniops;
          const localType = rowData.minType === MINBW ? MINBW : MINIOPS;

          if (rowData.edit) {
            return (
              <Box sx={localStyle}>
                <TextField
                  id={`VolumeList-textfield-minbw-miniops-${rowData.name}`}
                  name="minbw-miniops"
                  value={localValue}
                  type="number"
                  inputProps={{
                    min: 0,
                    'data-testid': `list-vol-minbw-miniops-${rowData.name}`
                  }}
                  onChange={(e) => {
                    this.setState({
                      resetVolumeRow: rowData
                    })
                    this.onVolumeEdit(e.target.value, 'minbw-miniops', rowData)
                  }}
                />
                <Select
                  style={cellText}
                  value={localType}
                  onChange={(e) => {
                    this.setState({
                      resetVolumeRow: rowData
                    })
                    this.onVolumeEdit(e.target.value, 'select-minbw-miniops', rowData)
                  }}
                  inputProps={{
                    name: "select_minbw/iops",
                    id: `VolumeList-select-minbw-miniops${rowData.name}`,
                    "data-testid": `list-vol-select-minbw-miniops-${rowData.name}`,
                  }}
                  SelectDisplayProps={{
                    "data-testid": `list-vol-select-minbw-miniops-${rowData.name}`,
                  }}
                >
                  <MenuItem value={MINIOPS} data-testid={MINIOPS}>
                    KIOPS
                  </MenuItem>
                  <MenuItem value={MINBW} data-testid={MINBW}>
                    MB/s
                  </MenuItem>
                </Select>
              </Box>
            )
          }

          if (rowData.minType === MINBW)
            return `${rowData.minbw} MB/s`
          if (rowData.minType === MINIOPS)
            return `${rowData.miniops} KIOPS`
          return 'MIN';
        }
      },
      {
        title: 'Mount Status',
        field: 'status',
        render: row => (
          <Switch
            size="small"
            disabled={row.edit}
            checked={row.status === "Mounted"}
            onChange={() => this.props.changeMountStatus(row)}
            color="primary"
            inputProps={{
              'aria-label': 'primary checkbox',
              title: `${row.status}: Click to toggle status`,
              'data-testid': `vol-mount-btn-${row.name}`
            }}
            id={`list-vol-togglebtn-${row._id}`}
          />
        )
      },
      {
        title: 'Update',
        field: 'edit',
        editable: 'never',
        sorting: false,
        render: row => {
          return !row.edit ? (
	    <>
            <Button
              className={classes.editBtn}
              data-testid={`vol-edit-btn-${row.name}`}
              onClick={() => this.props.editVolume(row)}
              id={`VolumeList-btn-edit-${row.name}`}
            >
              <EditIcon />
            </Button>
            <Button
              className={classes.editBtn}
              title="Reset QoS"
              data-testid={`vol-reset-qos-btn-${row.name}`}
              onClick={() => this.props.resetQoS(row)}
              id={`VolumeList-reset-qos-edit-${row.name}`}
            >
              <ReplayIcon />
            </Button>
	    </>
          ) : (
            <React.Fragment>
              <Button
                className={classes.editBtn}
                data-testid={`vol-edit-save-btn-${row.name}`}
                onClick={() => this.props.saveVolume(row)}
                id={`VolumeList-btn-done-${row.name}`}
              >
                <Done />
              </Button>
              <Button
                data-testid={`vol-edit-cancel-btn-${row.name}`}
                className={classes.editBtn}
                onClick={this.props.fetchVolumes}
                id={`VolumeList-btn-clear-${row.name}`}
              >
                <Clear />
              </Button>
            </React.Fragment>
          );
        }
      }

    ];
    return (
      // <ThemeProvider theme={MToolTheme}>
      <Paper data-testid="volumelist-table" id="VolumeList-table">
        <ThemeProvider theme={this.theme}>
          <MaterialTable
            title={(
              <Typography className={classes.cardHeader}>Volume List</Typography>
            )}
            columns={volumeTableColumns}
            data={this.props.volumes}
            options={{
              pageSize: 10,
              selection: true,
              showTextRowsSelected: false,
              headerStyle: {
                // backgroundColor: '#71859d',
                // backgroundColor: '#424850',
                backgroundColor: '#788595',
                color: '#FFF'
              },
              selectionProps: rowData => ({
                'data-testid': rowData.name,
                'id': `VolumeList-checkbox-${rowData.name}`,
                inputProps: {
                  'title': rowData.name
                }
              })
            }}
            icons={{
              Check,
              FirstPage: () => <FirstPage id="VolumeList-icon-firstpage" />,
              LastPage: () => <LastPage id="VolumeList-icon-lastpage" />,
              NextPage: () => <ChevronRight id="VolumeList-icon-nextpage" />,
              PreviousPage: () => <ChevronLeft id="VolumeList-icon-previouspage" />,
              Search: () => <Search id="VolumeList-icon-search" />,
              ThirdStateCheck: Remove,
              DetailPanel: ChevronRight,
              Export: SaveAlt,
              Filter: FilterList,
              Add,
              Edit: EditIcon,
              Delete: TrashIcon,
              SortArrow: ArrowUpward,
              ResetSearch: Clear
            }}
            onSelectionChange={(rows) => {
              this.selectVolumes(rows);
            }}
            actions={[
              {
                tooltip: 'Delete',
                icon: TrashIcon,
                iconProps: {
                  'id': "VolumeList-icon-delete"
                },
                onClick: () => { this.handleClickOpen() }
              }
            ]}
          />
        </ThemeProvider>
        <AlertDialog
          title="Delete Volumes"
          description="Deleting the volumes will automatically unmount the mounted volumes first. Are you sure you want to proceed?"
          open={this.state.open}
          handleClose={this.handleClose}
          onConfirm={() => {
            this.handleClose()
            this.props.deleteVolumes(this.state.selectedVolumes);
          }}
        />
        <AlertDialog
          title={this.state.alertTile}
          description={this.state.alertDetails}
          open={this.state.popupOpen}
          handleClose={() => {
            this.props.changeMinType({
              id: this.state.resetVolumeRow.id,
              minType: this.state.resetVolumeRow.minType
            })
            this.closePopup()
          }}
          onConfirm={() => {
            this.closePopup()
            // this.props.saveVolume(this.state.resetVolumeRow);
            this.props.changeResetType({
              id: this.state.resetVolumeRow.id,
              resetType: this.state.resetVolumeRow.minType
            })
          }}
        />
      </Paper>
      // </ThemeProvider>
    );
  }
}

VolumeList.propTypes = {
  volumes: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default withStyles(styles)(VolumeList);
