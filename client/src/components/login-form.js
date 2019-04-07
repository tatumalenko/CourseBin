import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Redirect, Link as RouterLink } from 'react-router-dom';
import {
  Button, Grid, Link, TextField, MuiThemeProvider, createMuiTheme, Typography,
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
  typography: {
    useNextVariants: true,
  },
});

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});


class LoginForm extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      redirectTo: null,
      loginError: false,
    };
    this._isMounted = false;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleChange = name => (event) => {
    if (this._isMounted) {
      this.setState({
        [name]: event.target.value,
      });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const { username, password } = this.state;
    const { updateUser } = this.props;

    axios
      .post('/user/login', {
        username,
        password,
      })
      .then((response) => {
        if (response.status === 200) {
          // update App.js state
          updateUser({
            loggedIn: true,
            username: response.data.username,
          });
          // update the state to redirect to home
          if (this._isMounted) {
            this.setState({
              redirectTo: '/',
            });
          }
        }
      }).catch((error) => {
        if (this._isMounted) {
          this.setState({
            username: '',
            password: '',
            redirectTo: null,
            loginError: error,
          });
        }
      });
  }

  render() {
    const { classes } = this.props;
    const {
      redirectTo, loginError,
    } = this.state;
    if (redirectTo) {
      return <Redirect to={{ pathname: redirectTo }} />;
    }

    return (
      <MuiThemeProvider theme={custTheme}>

        <div className='title-wrapper'>
          <Typography variant='h1'>CourseBin</Typography>
        </div>

        <form onSubmit={this.handleSubmit}>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <TextField
                label='Username'
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
                label='Password'
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
            {loginError
              ? (
                <Grid item xs={12}>
                  <Typography id='error' className='error-msg'>
                    {
                      loginError.data
                        ? loginError.data.message.toString()
                        : 'Sorry, this username/password combination is not valid.'
                        + 'Please try again or try signing up.'
                    }
                  </Typography>
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
                Login
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Link
                to='/signup'
                component={RouterLink}
                color='primary'
              >
                Not a user? Signup here!
              </Link>
            </Grid>
          </Grid>
        </form>

      </MuiThemeProvider>
    );
  }
}

LoginForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoginForm);
