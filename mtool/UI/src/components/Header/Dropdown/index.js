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
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, MenuItem, makeStyles, Divider } from '@material-ui/core';
import PDF from '../../../assets/Samsung_iBOF_Management_Tool_User_Manual.pdf';

const useStyles = makeStyles(() => ({
    menuItem: {
      color: '#000'
    },
    optionItem: {
      width: "100%"
    }
})); 

const Dropdown = (props) => {
    const classes = useStyles();

    return (
    <Menu
      id="simple-menu"
      keepMounted
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      getContentAnchorEl={null}
      anchorEl={props.anchorEl}
      open={props.dropdown}
      onClose={props.closeDropdown}
    >
      <MenuItem className={classes.menuItem}><NavLink to="/IbofOsOperations">Poseidon Operations</NavLink></MenuItem>
      <Divider />
      <MenuItem className={classes.menuItem}><NavLink to="/ConfigurationSetting/user">User Management</NavLink></MenuItem>
      <Divider />
      <MenuItem className={classes.menuItem}>
        <a href={PDF} target="_blank" className={classes.optionItem} rel="noopener noreferrer">Help</a>
      </MenuItem>
      <Divider />
      {/* <MenuItem className={classes.menuItem} onClick={props.renderPopup}>Change Password</MenuItem>
      <Divider /> */}
      <MenuItem className={classes.menuItem} onClick={props.userLogout} data-testid="logoutButton">Logout</MenuItem>
    </Menu>
    );
}

export default Dropdown;
