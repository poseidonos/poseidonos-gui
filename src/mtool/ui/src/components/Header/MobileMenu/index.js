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


DESCRIPTION: Menu to be rendered for mobile view
@NAME : i18n.js
@AUTHORS: Aswin K K
@Version : 1.0 *
@REVISION HISTORY
[07/08/2019] [Aswin] : Created Component..........////////////////////
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
              {/* <MenuItem className={classes.nestedMenuItem} onClick={props.renderPopup}>Change Password</MenuItem>
              <Divider /> */}
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