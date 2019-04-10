import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
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
import Divider from '@material-ui/core/Divider';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import ProgressDonut from './progress-donut';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    marginTop: '0',
    marginBottom: theme.spacing.unit * 4,
    marginLeft: '12%',
    marginRight: '12%',
    paddingTop: '0',
    paddingBottom: theme.spacing.unit * 2,
  },
  dashboardTitle: {
    textAlign: 'left',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2,
  },
  dashboardHeader: {
    ...theme.mixins.gutters(),
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  leftpaper: {
    ...theme.mixins.gutters(),
    margin: theme.spacing.unit,
    padding: theme.spacing.unit,
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
    };
  }

  componentDidMount() {
    console.log('dashboard props: ', this.props);
    this.props.auth.getStudent((student) => {
      this.setState({
        student: student || null,
        errorMsg: !student || null,
      });
    });
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
    const { student, errorMsg } = this.state;
    console.log('student: ', student);
    console.log('errorMsg: ', errorMsg);

    return (
      <MuiThemeProvider theme={custTheme}>
        <div className='header-logo'>
          <Typography
            to='/'
            component={RouterLink}
            variant='h4'
          >
            CourseBin

          </Typography>
        </div>

        <div className={classes.root}>
          <div className={classes.dashboardTitle}>
            <Typography variant='h4'>
              Your Dashboard
            </Typography>
          </div>
          <Grid container spacing={24} alignContent='space-between' justify='center' alignItems='center'>
            <Grid item xs={6}>
              <Paper className={classes.leftpaper} elevation={1}>
                <div className={classes.dashboardHeader}>
                  <Typography variant='h5'>
                    Profile
                  </Typography>
                </div>
                <Divider variant='middle' />
                <Grid container spacing={8} alignItems='center'>
                  <Grid item xs>
                    <Typography variant='overline'>
                      Name:
                    </Typography>
                  </Grid>
                  <Grid item xs>
                    <Typography variant='overline'>
                      {student && student.name ? `${student.name.first} ${student.name.last}` : ''}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={8} alignItems='center'>
                  <Grid item xs>
                    <Typography variant='overline'>
                      ID:
                    </Typography>
                  </Grid>
                  <Grid item xs>
                    <Typography variant='overline'>
                      {student ? student.id : ''}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={8} alignItems='center'>
                  <Grid item xs>
                    <Typography variant='overline'>
                      Degree:
                    </Typography>
                  </Grid>
                  <Grid item xs>
                    <Typography variant='overline'>
                      {student && student.record ? 'SOEN' : ''}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={8} alignItems='center'>
                  <Grid item xs>
                    <Typography variant='overline'>
                      Option:
                    </Typography>
                  </Grid>
                  <Grid item xs>
                    <Typography variant='overline'>
                      {student && student.record ? student.record.degree.option : ''}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={8} alignItems='center'>
                  <Grid item xs>
                    <Typography variant='overline'>
                      GPA:
                    </Typography>
                  </Grid>
                  <Grid item xs>
                    <Typography variant='overline'>
                      {student ? student.gpa : ''}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={8} alignItems='center'>
                  <Grid item xs>
                    <Typography variant='overline'>
                      Standing:
                    </Typography>
                  </Grid>
                  <Grid item xs>
                    <Typography variant='overline'>
                      {student ? student.standing : ''}
                    </Typography>
                  </Grid>
                </Grid>

                {student
                  ? (
                    <ProgressDonut data={this.calcProgressData()} />
                  )
                  : JSON.stringify(this.calcProgressData())}

                <div className={classes.dashboardHeader}>
                  <Typography variant='h5'>
                    Academics
                  </Typography>
                </div>

                <Divider variant='middle' />

                <ExpansionPanel>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>Completed Courses</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Course Code</TableCell>
                          <TableCell align='right'>Grade</TableCell>
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
            <Grid item xs={6}>
              <Paper elevation={1}>
                <Typography variant='h5'>
                  Saved Plans
                </Typography>
                <Typography variant='body1'>
                  *Insert Static Plan Here*
                </Typography>
              </Paper>
            </Grid>
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
