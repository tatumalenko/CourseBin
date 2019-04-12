import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Button, MuiThemeProvider, createMuiTheme, Typography,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import cyan from '@material-ui/core/colors/cyan';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Plan from './plan';

import ProgressDonut from './progress-donut';
import SnackbarAlert from './snackbar-alerts';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    marginTop: theme.spacing.unit * 8,
    marginBottom: theme.spacing.unit * 4,
    marginLeft: '4%',
    marginRight: '4%',
    paddingTop: '0',
    paddingBottom: theme.spacing.unit * 2,
  },
  dashboardTitle: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2,
  },
  dashboardHeader: {
    ...theme.mixins.gutters(),
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  planHeader: {
    marginBottom: '-120px',
  },
  leftpaper: {
    ...theme.mixins.gutters(),
    margin: theme.spacing.unit,
    minWidth: '300px',
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  rightpaper: {
    ...theme.mixins.gutters(),
    margin: theme.spacing.unit,
    minWidth: '500px',
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  profile: {
    marginLeft: theme.spacing.unit * 4,
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    textAlign: 'left',
  },
  topPanel: {
    marginBottom: theme.spacing.unit * 4,
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
  constructor(props) {
    super(props);
    this.state = {
      student: null,
      errorMsg: null,
      savedPlan: null,
      savedUnableToAddReasonsMap: null,
    };
    console.log('dashboard auth: ', this.props.auth);
  }

  componentDidMount() {
    console.log('dashboard props: ', this.props);
    this.props.auth.getStudent((student) => {
      this.setState({
        student: student || null,
        errorMsg: !student || null,
      });
    });

    axios.post('/user/plan/example', {})
      .then((response) => {
        this.setState({
          savedPlan: response.data.plan,
          savedUnableToAddReasonsMap: response.data.unableToAddReasonsMap,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    // .finally(() => {
    //   this.setState({ showSpinner: false });
    // });
  }

  calcProgressData() {
    const { student } = this.state;
    if (!student || !student.record) {
      return [ {
        name: 'Academic Progress',
        percent: 0,
        fill: '#00bcd4',
      } ];
    }
    const data = [ {
      name: 'Academic Progress',
      percent: Math.floor(student.record.completedCourses.length / 40 * 100),
      fill: '#00bcd4',
    } ];

    return data;
  }

  render() {
    const { classes } = this.props;
    const { student } = this.state;
    console.log(this.state);
    console.log(this.props);

    const { savedPlan, savedUnableToAddReasonsMap } = this.state;

    return (
      <MuiThemeProvider theme={custTheme}>
        {savedPlan ? (
          <div className={classes.root}>
            <div className={classes.dashboardTitle}>
              <Typography variant='h4'>
                {(student && student.name) ? `${student.name.first}'s Dashboard` : 'Your Dashboard'}
              </Typography>
            </div>
            <Grid container spacing={24} alignContent='space-between' justify='center'>
              <Grid item xs={12} lg={4}>
                <Paper className={classes.leftpaper} elevation={1}>
                  <div className={classes.dashboardHeader}>
                    <Typography variant='h5'>
                      Profile
                    </Typography>
                  </div>
                  <ExpansionPanel className={classes.topPanel} defaultExpanded>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography className={classes.heading}>Summary</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Table className={classes.table}>
                        <TableBody>
                          <TableRow key='name'>
                            <TableCell component='th' scope='row'>
                              Name:
                            </TableCell>
                            <TableCell align='center'>
                              {(student && student.name) ? `${student.name.first} ${student.name.last}` : ''}
                            </TableCell>
                          </TableRow>

                          <TableRow key='id'>
                            <TableCell component='th' scope='row'>
                              ID:
                            </TableCell>
                            <TableCell align='center'>
                              {student && student.id}
                            </TableCell>
                          </TableRow>

                          <TableRow key='degree'>
                            <TableCell component='th' scope='row'>
                              Degree:
                            </TableCell>
                            <TableCell align='center'>
                              {student && student.record && student.record.degree ? 'SOEN' : ''}
                            </TableCell>
                          </TableRow>

                          <TableRow key='option'>
                            <TableCell component='th' scope='row'>
                              Option:
                            </TableCell>
                            <TableCell align='center'>
                              {student && student.record && student.record.degree ? student.record.degree.option : ''}
                            </TableCell>
                          </TableRow>

                          <TableRow key='gpa'>
                            <TableCell component='th' scope='row'>
                              GPA:
                            </TableCell>
                            <TableCell align='center'>
                              {student ? student.gpa : ''}
                            </TableCell>
                          </TableRow>

                          <TableRow key='standing'>
                            <TableCell component='th' scope='row'>
                              Standing:
                            </TableCell>
                            <TableCell align='center'>
                              {student ? student.standing : ''}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>

                  {true
                    ? (
                      <Grid item xs={12} className='donut'>
                        <ProgressDonut data={this.calcProgressData()} />
                      </Grid>
                    )
                    : JSON.stringify(this.calcProgressData())}

                  <div className={classes.dashboardHeader}>
                    <Typography variant='h5'>
                      Academics
                    </Typography>
                  </div>
                  <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography className={classes.heading}>Completed Courses</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Table className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell>Course Code</TableCell>
                            <TableCell align='center'>Grade</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {(student && student.record) && (student.record.completedCourses.length > 0 ? student.record.completedCourses : { code: 'NA', grade: 'NA' }).map((course, i) => (
                            <TableRow key={i}>
                              <TableCell component='th' scope='row'>
                                {course.code}
                              </TableCell>
                              <TableCell align='center'>
                                {course.grade}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>

                </Paper>
              </Grid>
              <Grid item xs={12} lg={8}>
                <Paper className={classes.rightpaper} elevation={1}>
                  <div className={classes.planHeader}>
                    <Typography variant='h5'>
                      Saved Plans
                    </Typography>
                  </div>
                  <Typography variant='body1' />
                  {savedPlan && savedUnableToAddReasonsMap
                    && (
                      <Plan
                        auth={this.props.auth}
                        formData={savedPlan}
                        unableToAddReasonsMap={savedUnableToAddReasonsMap}
                        hideHeader
                        hideNotice
                      />
                    )
                  }
                </Paper>
              </Grid>
            </Grid>
          </div>
        ) : (
          <div className='progress'>
              <Typography variant='h5'>Hold on while we gather your information...</Typography>
              <br />
              <CircularProgress className={classes.progress} />
            </div>
        )}
        {this.state.errorMsg && (
          <SnackbarAlert
            open
            variant='error'
            message='No student record to show!'
            onClose={() => {
              this.setState({
                errorMsg: null,
              });
            }}
          />
        )}
      </MuiThemeProvider>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);
