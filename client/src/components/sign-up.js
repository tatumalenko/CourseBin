import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Redirect, Link as RouterLink } from 'react-router-dom';
import {
  Button, Grid, FormLabel, Link, TextField, MuiThemeProvider, createMuiTheme, Typography,
} from '@material-ui/core';
import axios from 'axios';
import cyan from '@material-ui/core/colors/cyan';

const custTheme = createMuiTheme({
  palette: {
    primary: cyan,
    secondary: {
      main: '#571D2E',
      light: '#A98638',
    },
  },
});


const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      redirectTo: null,
      signupError: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = name => (event) => {
    if (this._isMounted) {
      this.setState({
        [name]: event.target.value,
      });
    }
  }

  handleSubmit(event) {
    const { username, password } = this.state;
    console.log(`sign-up handleSubmit, username: ${username}`);
    event.preventDefault();

    // request to server to add a new username/password
    axios.post('/user/', {
      username,
      password,
    })
      .then((response) => {
        if (!response.data.errmsg) {
          console.log('successful signup');
          this.setState({
            redirectTo: '/',
          });
        }
      }).catch((error) => {
        console.log('signup error: ');
        console.log(error.response); // Error response with error message
        this.setState({
          username: '',
          password: '',
          signupError: error.response,
        });
      });
  }

  render() {
    const { classes } = this.props;
    const {
      redirectTo, signupError,
    } = this.state;
    if (redirectTo) {
      return <Redirect to={{ pathname: redirectTo }} />;
    }
    return (
      <MuiThemeProvider theme={custTheme}>
        <div className='title-wrapper'>
          <h1>CourseBin</h1>
        </div>
        <form onSubmit={this.handleSubmit}>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <TextField
                label='Choose Username'
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
                margin='normal'
                variant='outlined'
                onChange={this.handleChange('username')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Choose Password'
                className={classes.textField}
                type='password'
                autoComplete='password'
                InputLabelProps={{
                  shrink: true,
                }}
                margin='normal'
                variant='outlined'
                onChange={this.handleChange('password')}
              />
            </Grid>
            {
              signupError
                ? (
                  <Grid item xs={12}>
                    <FormLabel id='error' className='error-msg'>
                      {signupError.data.message.toString()}
                    </FormLabel>
                  </Grid>
                )
                : null
            }
          </Grid>
          <br />
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <Button
                id='submit'
                size='large'
                variant='outlined'
                color='primary'
                type='submit'
              >
                Sign up
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Link
                to='/'
                component={RouterLink}
                color='primary'
              >
                Already a user? Login here!
              </Link>
            </Grid>
          </Grid>
        </form>
      </MuiThemeProvider>
    );
  }
}

Signup.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Signup);
