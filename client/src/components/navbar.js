/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar, Toolbar, MenuItem, IconButton, Menu, MuiThemeProvider, createMuiTheme, Typography,
} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import cyan from '@material-ui/core/colors/cyan';
import '../App.css';

const custTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#571D2E',
    },
    secondary: {
      main: '#A98638',
      light: cyan,
    },
  },
  typography: {
    useNextVariants: true,
  },
});

const styles = theme => ({
  profileIcon: {
    float: 'right',
  },
  menuIcon: {
    float: 'left',
  },
  navbar: {
    width: '100%',
  },
});

class Navbar extends Component {
  constructor() {
    super();
    this.logout = this.logout.bind(this);
    this.state = {
      anchorEl: null,
      anchorElProfile: null,
    };
  }

  handleMenu = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleProfileMenu = (event) => {
    this.setState({ anchorElProfile: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleProfileClose = () => {
    this.setState({ anchorElProfile: null });
  };


  logout(event) {
    event.preventDefault();
    this.props.auth.logout(() => {
      this.forceUpdate();
      this.props.forceAppUpdate();
    });
  }

  render() {
    const { auth, classes } = this.props;
    const { anchorEl, anchorElProfile } = this.state;
    const open = Boolean(anchorEl);
    const openProfile = Boolean(anchorElProfile);

    return (
      <MuiThemeProvider theme={custTheme}>
        <AppBar position='static'>
          <Toolbar>
            {auth.isAuthenticated()
              ? (
                <span className={classes.navbar}>
                  <div className={classes.menuIcon}>
                    <IconButton
                      aria-owns={open ? 'menu-appbar' : undefined}
                      aria-haspopup='true'
                      onClick={this.handleMenu}
                      color='inherit'
                    >
                      <MenuIcon />
                    </IconButton>
                    <Menu
                      id='menu-appbar'
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={open}
                      onClose={this.handleClose}
                    >
                      <MenuItem
                        to='/planner'
                        component={RouterLink}
                        onClick={this.handleClose}
                      >
                        Planner
                      </MenuItem>
                    </Menu>
                  </div>
                  <span className='header-logo'>
                    <Typography
                      to='/'
                      component={RouterLink}
                      variant='h4'
                      inline
                    >
                      CourseBin
                    </Typography>
                  </span>
                  <div className={classes.profileIcon}>
                    <IconButton
                      aria-owns={openProfile ? 'menu-appbar' : undefined}
                      aria-haspopup='true'
                      onClick={this.handleProfileMenu}
                      color='inherit'
                    >
                      <AccountCircle />
                    </IconButton>
                    <Menu
                      id='menu-appbar'
                      anchorEl={anchorElProfile}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={openProfile}
                      onClose={this.handleProfileClose}
                    >
                      <MenuItem
                        to='/dashboard'
                        component={RouterLink}
                        onClick={this.handleProfileClose}
                      >
                        Dashboard
                      </MenuItem>
                      <MenuItem onClick={this.logout}>Logout</MenuItem>
                    </Menu>
                  </div>
                </span>
              ) : (
                <span className={classes.navbar}>
                  <div className={classes.menuIcon}>
                    <IconButton
                      aria-owns={open ? 'menu-appbar' : undefined}
                      aria-haspopup='true'
                      onClick={this.handleMenu}
                      color='inherit'
                    >
                      <MenuIcon />
                    </IconButton>
                    <Menu
                      id='menu-appbar'
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={open}
                      onClose={this.handleClose}
                    >
                      <MenuItem
                        to='/login'
                        component={RouterLink}
                        onClick={this.handleClose}
                      >
                        Login
                      </MenuItem>
                      <MenuItem
                        to='/signup'
                        component={RouterLink}
                        onClick={this.handleClose}
                      >
                        Signup
                      </MenuItem>
                    </Menu>
                  </div>
                </span>
              )
            }
          </Toolbar>
        </AppBar>
      </MuiThemeProvider>
    );
  }
}

Navbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navbar);
