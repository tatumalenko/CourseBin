import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import {
  Button, Grid, MuiThemeProvider, createMuiTheme, Typography,
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
  button: {
    marginBottom: '15px',
    width: '225px',
  },
});

// eslint-disable-next-line
class Home extends Component {
  render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={custTheme}>
        {(
          <div>
            <div className='title-wrapper'>
              <Typography variant='h1'>CourseBin</Typography>
            </div>
            <Grid item xs={12}>
              <Button
                className={classes.button}
                id='submit'
                size='large'
                variant='outlined'
                color='primary'
                type='submit'
                component={Link}
                to='/dashboard'
              >
                Head to dashboard
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                className={classes.button}
                id='submit'
                size='large'
                variant='outlined'
                color='primary'
                type='submit'
                component={Link}
                to='/planner'
              >
                Plan my schedule
              </Button>
            </Grid>
          </div>
        )
        }
      </MuiThemeProvider>
    );
  }
}


Home.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Home);
