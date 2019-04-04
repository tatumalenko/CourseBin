/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar, Toolbar, Link, Typography, MuiThemeProvider, createMuiTheme,
} from '@material-ui/core';
import axios from 'axios';
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
});

class Navbar extends Component {
  constructor() {
    super();
    this.logout = this.logout.bind(this);
  }

  logout(event) {
    const { updateUser } = this.props;
    event.preventDefault();
    console.log('logging out');
    axios.post('/user/logout').then((response) => {
      console.log(response.data);
      if (response.status === 200) {
        updateUser({
          loggedIn: false,
          username: null,
        });
      }
    }).catch((error) => {
      console.log('Logout error', error);
    });
  }

  render() {
    const { loggedIn, classes } = this.props;

    console.log('navbar render, props: ');
    console.log(this.props);

    return (
      <MuiThemeProvider theme={custTheme}>
        <AppBar position='static'>
          <Toolbar>
            {loggedIn
              ? (
                <span className='navbar-links'>
                  <Typography className={classes.title} variant='h6'>
                    <Link
                      to='#'
                      component={RouterLink}
                      color='secondary'
                      onClick={this.logout}
                    >
                      Logout
                    </Link>
                  </Typography>
                </span>
              ) : (
                <span className='navbar-links'>
                  <Typography className={classes.title} variant='h6'>
                    <Link
                      to='/signup'
                      component={RouterLink}
                      color='secondary'
                    >
                      Signup
                    </Link>
                  </Typography>
                  <Typography className={classes.title} variant='h6'>
                    <Link
                      to='/'
                      component={RouterLink}
                      color='secondary'
                    >
                      Login
                    </Link>
                  </Typography>
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
