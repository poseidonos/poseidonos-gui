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


DESCRIPTION: <File description> *
@NAME : index.js
@AUTHORS: Jay Hitesh Sanghavi 
@Version : 1.0 *
@REVISION HISTORY
[03/06/2019] [Jay] : Prototyping..........////////////////////
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
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Clear from '@material-ui/icons/Clear';
import { Paper, Typography, withStyles, TextField, Button } from '@material-ui/core';
import MaterialTable from 'material-table';

import { Done } from '@material-ui/icons';
import AlertDialog from '../../Dialog';
import { customTheme } from '../../../theme';


const styles = () => ({
  cardHeader: {
    ...customTheme.card.header,
    marginLeft: 0
  },
  editBtn: {
    minWidth: 24,
    borderRadius: 100
  }
});

class VolumeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedVolumes: [],
      open: false,

    };
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  
  handleClickOpen() {
    this.setState({
      open: true,
    });
  }

  handleClose() {
    this.setState({ open: false });
  }

  selectVolumes(volumes) {
    this.setState({
      selectedVolumes: volumes
    })
  }

  onVolumeEdit(value, name, id) {
    this.props.changeField({
      value,
      name,
      id
    });
  }

  render() {
    const { classes } = this.props;
    const volumeTableColumns = [
      {
        title: 'Name',
        field: 'name',
      },
      {
        title: 'Total Size (GB)',
        field: 'size'
      },
      {
        title: 'Used Size ',
        field: 'usedspace',
      },

      {
        title: 'IP Address',
        field: 'ip',
      },
      {
        title: 'Port',
        field: 'subnqn',
      },
      {
        title: 'NQN',
        field: 'subnqn',
      },
      {
        title: 'Max IOPS',
        field: 'maxiops',
        render: rowData => {
          if (rowData.edit) {
             return (
<TextField
              id= {`VolumeList-textfield-maxiops-${ rowData.name}`}
              value={rowData.maxiops}
              type="number"
              inputProps={{
                min: 0,
                'data-testid':`list-vol-maxiops-${rowData.name}`
              }}
              onChange={(e) => this.onVolumeEdit(e.target.value, 'maxiops', rowData.id)}
/>
)
          } 
            return rowData.maxiops === 0 ? 'MAX' : rowData.maxiops;
          
        }
      },
      {
        title: 'Max Bandwidth',
        field: 'maxbw',
        render: rowData => {
          if (rowData.edit) {
             return (
<TextField
              id= {`VolumeList-textfield-maxbw-${ rowData.name}`}
              name="maxbw"
              value={rowData.maxbw}
              type="number"
              inputProps={{
                min: 0,
                'data-testid': `list-vol-maxbw-${rowData.name}`
              }}
              onChange={(e) => this.onVolumeEdit(e.target.value, 'maxbw', rowData.id)}
/>
)
          } 
            return rowData.maxbw === 0 ? 'MAX' : rowData.maxbw;
          
        }
      },
      {
        title: 'Status',
        field: 'status',
      },
      {
        title: 'Update',
        field: 'edit',
        editable: 'never',
        sorting: false,
        render: row => {
          return !row.edit ? (
              <Button
                className={classes.editBtn}
                data-testid={`vol-edit-btn-${row.name}`}
                onClick={() => this.props.editVolume(row)}
                id = {`VolumeList-btn-edit-${ row.name}`}
              >
                <EditIcon />
              </Button>
          ) : (
            <React.Fragment>
              <Button
                className={classes.editBtn}
                data-testid={`vol-edit-save-btn-${row.name}`}
                onClick={() => this.props.saveVolume(row)}
                id = {`VolumeList-btn-done-${ row.name}`}
              >
                <Done />
              </Button>
              <Button
                data-testid={`vol-edit-cancel-btn-${row.name}`}
                className={classes.editBtn}
                onClick={this.props.fetchVolumes}
                id = {`VolumeList-btn-clear-${ row.name}`}
              >
                <Clear />
              </Button>
            </React.Fragment>
          );
        }
      }
      
    ];
    return (
      <Paper data-testid="volumelist-table" id="VolumeList-table">
        {/* <ThemeProvider theme={tableTheme}> */}
        <MaterialTable
          title={(
            <Typography className={classes.cardHeader}>Volume List</Typography>
          )}
          columns={volumeTableColumns}
          data={this.props.volumes}
          options={{
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
            Check: () => <Check id = "VolumeList-icon-check" /> ,
            FirstPage: () => <FirstPage id="VolumeList-icon-firstpage" /> ,
            LastPage: () => <LastPage id="VolumeList-icon-lastpage" />,
            NextPage: () => <ChevronRight id="VolumeList-icon-nextpage" />,
            PreviousPage: () => <ChevronLeft id="VolumeList-icon-previouspage" />,
            Search: () => <Search id="VolumeList-icon-search" /> ,
            ThirdStateCheck: Remove,
            DetailPanel: ChevronRight,
            Export: SaveAlt,
            Filter: FilterList,
            Add,
            Edit: () => <EditIcon id="VolumeList-icon-edit" />,
            Delete: () => <TrashIcon /> ,
            SortArrow: ArrowUpward,
            ResetSearch: ()=> <Clear id="VolumeList-icon-clearsearch" />
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
        {/* </ThemeProvider> */}
        <AlertDialog
          title="Delete Volumes"
          description="Are you sure you want to delete the selected Volumes"
          open={this.state.open}
          handleClose={this.handleClose}
          onConfirm={() => {
            this.handleClose()
            this.props.deleteVolumes(this.state.selectedVolumes);
          }}
        />
      </Paper>
    );
  }
}

VolumeList.propTypes = {
  volumes: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default withStyles(styles)(VolumeList);
