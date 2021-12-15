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
import { Menu, MenuItem, makeStyles, withStyles, Collapse, MenuList, Divider } from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { NavLink } from 'react-router-dom';
import PDF from '../../../assets/Samsung_iBOF_Management_Tool_User_Manual.pdf';

const useStyles = makeStyles((theme) => ({
    menuItem: {
      color: '#000'
    },
    root: {
      minWidth: 400
    },
    nestedMenuItem: {
      color: '#000',
      paddingLeft: theme.spacing(4)
    }
}));

const StyledMenu = withStyles(() => ({
  paper: {
    width: 250,
  }
}))(Menu);

const MobileMenu = (props) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    function handleClick() {
      setOpen(!open);
    }

    return (
        <StyledMenu
          anchorEl={props.mobileMoreAnchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          id={props.mobileMenuId}
          keepMounted
          className={classes.root}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={props.isMobileMenuOpen}
          onClose={props.handleMobileMenuClose}
        >
          <MenuItem className={classes.menuItem}><NavLink to="/IbofOsOperations">Poseidon Operations</NavLink></MenuItem>
          <Divider />
          <a href={PDF} target="_blank" rel="noopener noreferrer">
            <MenuItem className={classes.menuItem}>
            <span data-testid="help-link">Help</span>
            </MenuItem>
          </a>          
          <Divider />
          <MenuItem data-testid="menu-expand" button onClick={handleClick} className={classes.menuItem}>
            {props.username}
            {open ? <ExpandLess /> : <ExpandMore />}
          </MenuItem>
          <Divider />
          <Collapse in={open} timeout="auto" unmountOnExit>
            <MenuList disablePadding>
              <NavLink to="/ConfigurationSetting/user">
                <MenuItem className={classes.nestedMenuItem}>User Management</MenuItem>
              </NavLink>
              <Divider />
              <MenuItem className={classes.nestedMenuItem} onClick={props.renderPopup}>Change Password</MenuItem>
              <Divider />
              <MenuItem className={classes.nestedMenuItem} onClick={props.userLogout}>Logout</MenuItem>
              <Divider />
            </MenuList>
          </Collapse>
          {/* <MenuItem className={classes.menuItem}>
            <p>Support</p>
          </MenuItem> */}
        </StyledMenu>
    )
}

export default MobileMenu;