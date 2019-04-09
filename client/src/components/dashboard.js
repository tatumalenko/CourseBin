import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Button, MuiThemeProvider, createMuiTheme, Typography,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import cyan from '@material-ui/core/colors/cyan';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 4,
    marginLeft: theme.spacing.unit * 4,
    marginRight: theme.spacing.unit * 4,
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
});

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

// eslint-disable-next-line
class Dashboard extends Component {
  state = { expanded: false };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  render() {
    const { classes } = this.props;

    return (
      <MuiThemeProvider theme={custTheme}>

        <div className={classes.root}>

          <Grid container spacing={24}>


            <Grid item xs={6} sm={6} />
            <Paper className={classes.root} elevation={1}>
              <Typography variant='h5' component='h3'>
                Profile
              </Typography>
              <Typography component='p'>
                Personal information:
              </Typography>
            </Paper>

            <Grid item xs={6} sm={6} />
            <Paper className={classes.root} elevation={1}>
              <Typography variant='h5' component='h3'>
                This is a sheet of paper.
              </Typography>
              <Typography component='p'>
                Paper can be used to build surface or other elements for your
                application.
              </Typography>
            </Paper>

          </Grid>

        </div>
      </MuiThemeProvider>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);
