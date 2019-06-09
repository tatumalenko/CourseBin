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

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      redirectToReferrer: false,
      loginError: false,
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

  handleDemoSubmit = (event) => {
    event.preventDefault();
    const username = '444444';
    const password = 'abc123';

    this.props.auth.login({ username, password }, (error) => {
      this.setState({
        username: '',
        password: '',
        redirectToReferrer: !error,
        loginError: error,
      });
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { username, password } = this.state;

    this.props.auth.login({ username, password }, (error) => {
      this.setState({
        username: '',
        password: '',
        redirectToReferrer: !error,
        loginError: error,
      });
    });
  }

  render() {
    const { classes } = this.props;
    const { from } = this.props.location.state || { from: { pathname: '/' } };

    const {
      redirectToReferrer, loginError,
    } = this.state;

    if (redirectToReferrer) {
      return (
        <Redirect to={from} />
      );
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
                className='links'
                to='/signup'
                component={RouterLink}
                color='primary'
              >
                Not a user? Signup here!
              </Link>
            </Grid>
          </Grid>
          <form onSubmit={this.handleDemoSubmit}>
            <Grid container spacing={16}>
              <Grid item xs={12} />
              <Grid item xs={12} />
              <Grid item xs={12} />
              <Grid item xs={12}>
                <Button
                  id='submit'
                  color='secondary'
                  size='large'
                  variant='contained'
                  type='submit'
                >
                  Demo App
                </Button>
              </Grid>
            </Grid>
          </form>
        </form>

      </MuiThemeProvider>
    );
  }
}

LoginForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoginForm);
