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
      <MenuItem className={classes.menuItem}><NavLink to="/operations/pos">Poseidon Operations</NavLink></MenuItem>
      <Divider />
      <MenuItem className={classes.menuItem}><NavLink to="/ConfigurationSetting/user">User Management</NavLink></MenuItem>
      <Divider />
      <MenuItem className={classes.menuItem} onClick={props.renderPopup}>Change Password</MenuItem>
      <Divider />
      <MenuItem className={classes.menuItem}>
        <a href={`${PDF}?time=${Date.now()}`} target="_blank" type="application/pdf" className={classes.optionItem} rel="noopener noreferrer">Help</a>
      </MenuItem>
      <Divider />
      <MenuItem className={classes.menuItem} onClick={props.userLogout} data-testid="logoutButton">Logout</MenuItem>
    </Menu>
    );
}

export default Dropdown;
