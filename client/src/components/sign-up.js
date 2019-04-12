import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Redirect, Link as RouterLink } from 'react-router-dom';
import {
  Button, Grid, Link, TextField, MuiThemeProvider, createMuiTheme, Typography,
} from '@material-ui/core';
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

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      redirectTo: null,
      signupError: false,
    };
    this._isMounted = false;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    if (this.props.auth.isAuthenticated()) {
      this.props.history.push('/');
    }
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
    const { username, password } = this.state;
    event.preventDefault();

    this.props.auth.signup({ username, password }, (error) => {
      this.setState(state => ({
        username: !error ? state.username : '',
        password: !error ? state.password : '',
        redirectTo: !error ? '/login' : null,
        signupError: error || false,
      }));
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
          <Typography variant='h1'>CourseBin</Typography>
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
                    <Typography id='error' className='error-msg'>
                      {signupError.data.message.toString()}
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
                Sign up
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Link
                className='links'
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
