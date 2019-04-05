import React, { Component } from 'react';
import { ViewState } from '@devexpress/dx-react-scheduler';
import PropTypes from 'prop-types';
import {
  Scheduler,
  WeekView,
  Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';
import {
  MuiThemeProvider,
  createMuiTheme,
  Button,
  MobileStepper,
  Paper,
  ExpansionPanel,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
} from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import moment from 'moment';
import cyan from '@material-ui/core/colors/cyan';
import { withStyles } from '@material-ui/core/styles';
import ChildBox from './box-child';

const _ = require('lodash');

const burgundy = {
  50: '#571D2E',
  100: '#571D2E',
  200: '#571D2E',
  300: '#571D2E',
  400: '#571D2E',
  500: '#571D2E',
  600: '#571D2E',
  700: '#571D2E',
  800: '#571D2E',
  900: '#571D2E',
  A100: '#571D2E',
  A200: '#571D2E',
  A400: '#571D2E',
  A700: '#571D2E',
};

const theme = createMuiTheme({
  palette: {
    primary: burgundy, secondary: burgundy, error: burgundy,
  },
  typography: {
    useNextVariants: true,
  },
});

const styles = theme => ({
  sequence: {
    backgroundColor: cyan,
  },
});

class Plan extends Component {
  constructor(props) {
    super(props);
    const plan = props.formData;
    this.schedules = plan.schedules;
    this.sequences = plan.sequences;

    this.state = {
      // sequences
      sequenceMap: this.parseSequences(),

      // schedules
      dataFall2019: [],
      fallSchedule: this.schedules.fall,

      // dummy info for the description box component
      // TODO real implementation
      course: 'COMP-472',
      subject: 'Artificial Intelligence',
      lecture: 'LEC LL 1234, Hall building 937',
      tutorial: 'TUT A, Hall building 435 ',
      activeStep: 0,
    };

    this.parseSchedules();

    console.log(this.state);

    this.createDate = this.createDate.bind(this);
    this.createTime = this.createTime.bind(this);
    this.findWeekDayDate = this.findWeekDayDate.bind(this);
    this.findWeekDayDate2 = this.findWeekDayDate2.bind(this);
    this.parseSchedules = this.parseSchedules.bind(this);
    this.parseSequences = this.parseSequences.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleStepChange = this.handleStepChange.bind(this);
  }

  parseSchedules = () => {
    const state = this.state;
    const fallSchedule = state.fallSchedule;

    // Populating the data for all classes
    Object.keys(fallSchedule).forEach((scheduleIndex) => {
      const schedule = state.fallSchedule[scheduleIndex];
      const scheduleSections = schedule.sections;
      scheduleSections.map((section, sectionIndex) => {
        console.log(section);
        console.log(sectionIndex);
        const times = scheduleSections[sectionIndex];
        times.map((time) => {
          const dayOfWeek = time.weekDay;
          const dateStr = '04/09/2018';
          const timeStr = time.startTime;
          const timeEnd = time.endTime;
          const beginDateTime = this.findWeekDayDate({ dayOfWeek, dateStr, timeStr });
          const finishDateTime = this.findWeekDayDate2({ dayOfWeek, dateStr, timeEnd });
          state.dataFall2019.push({
            id: scheduleIndex,
            title: `${section.courseCode} - ${section.code} ${section.kind}`,
            startDate: new Date(beginDateTime.format('MM/DD/YYYY HH:mm:ss')),
            endDate: new Date(finishDateTime.format('MM/DD/YYYY HH:mm:ss')),
          });
        });
      });
    });
  }

  // ******** helper functions to parse schedules for UI *************

  createDate = (dateStr) => {
    const dateParseFormatStr = 'DD/MM/YYYY';
    const date = moment(dateStr, dateParseFormatStr);
    return date;
  };

  createTime = timeStr => moment(timeStr, 'HH:mm:ss');

  // find if weekDay is before or after startDate and return
  // next week's weekDay date if startDate occured after weekDay
  // of that week
  findWeekDayDate = ({ dayOfWeek, dateStr, timeStr }) => {
    const date = this.createDate(dateStr);
    const dateOfWeekDayInSameWeek = this.createDate(dateStr).day(dayOfWeek);
    // if dateOfWeekDayInSameWeek occurs before the date, then it has
    // passed and the actual date with that day of the week will occur
    // in the next week
    const actualDateOfWeekDay = dateOfWeekDayInSameWeek.isBefore(date)
      ? dateOfWeekDayInSameWeek.add(7, 'day')
      : dateOfWeekDayInSameWeek;
    const time = this.createTime(timeStr);
    actualDateOfWeekDay.set({
      hour: time.get('hour'),
      minute: time.get('minute'),
      second: time.get('second'),
    });

    return actualDateOfWeekDay;
  };

  findWeekDayDate2 = ({ dayOfWeek, dateStr, timeEnd }) => {
    const date = this.createDate(dateStr);
    const dateOfWeekDayInSameWeek = this.createDate(dateStr).day(dayOfWeek);
    // if dateOfWeekDayInSameWeek occurs before the date, then it has
    // passed and the actual date with that day of the week will occur
    // in the next week
    const actualDateOfWeekDay = dateOfWeekDayInSameWeek.isBefore(date)
      ? dateOfWeekDayInSameWeek.add(7, 'day')
      : dateOfWeekDayInSameWeek;
    const time = this.createTime(timeEnd);
    actualDateOfWeekDay.set({
      hour: time.get('hour'),
      minute: time.get('minute'),
      second: time.get('second'),
    });
    return actualDateOfWeekDay;
  };

  // ******** parse sequences for UI  *************
  parseSequences = () => {
    const sequences = this.sequences;
    const map = {};
    Object.keys(sequences).forEach((i) => {
      const sequence = sequences[i];
      const term = `${_.startCase(_.toLower(sequence.term))} ${sequence.year}`;
      const courses = sequence.courses;
      if (!map[term]) {
        map[term] = courses;
      }
    });
    return map;
  }


  // ******** functions to dynamically handle state *************
  handleNext = () => {
    this.setState(prevState => ({
      activeStep: prevState.activeStep + 1,
    }));
  };

  handleBack = () => {
    this.setState(prevState => ({
      activeStep: prevState.activeStep - 1,
    }));
  };

  handleStepChange = (activeStep) => {
    this.setState({ activeStep });
  };


  render() {
    const { classes } = this.props;
    const {
      sequenceMap, dataFall2019, fallSchedule, activeStep, course, subject, lecture, tutorial,
    } = this.state;
    const filterDataFall2019 = dataFall2019.filter(el => el.id === activeStep);
    return (
      <div className='plan-container'>
        <Grid container spacing={16}>
          <Grid item xs={12} className='schedule-container'>
            <div className='header-logo plan'>
              <Typography variant='h4'>CourseBin</Typography>
            </div>
            <Typography id='schedule-header' variant='h4'>Here's what we came up with... </Typography>
            <Typography variant='h5'>Schedules</Typography>
            <br />
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Fall 2019</Typography>
              </ExpansionPanelSummary>

              <ExpansionPanelDetails>

                <Grid item xs={3}>
                  <ChildBox
                    titleClass={course}
                    subject={subject}
                    lecture={lecture}
                    tutorial={tutorial}
                  />
                  <br />
                  <ChildBox
                    titleClass={course}
                    subject={subject}
                    lecture={lecture}
                    tutorial={tutorial}
                  />
                  <br />
                  <ChildBox
                    titleClass={course}
                    subject={subject}
                    lecture={lecture}
                    tutorial={tutorial}
                  />
                  <br />
                  <ChildBox
                    titleClass={course}
                    subject={subject}
                    lecture={lecture}
                    tutorial={tutorial}
                  />
                  <br />
                  <ChildBox
                    titleClass={course}
                    subject={subject}
                    lecture={lecture}
                    tutorial={tutorial}
                  />
                </Grid>
                <Grid item xs={9}>
                  <div className='schedule'>
                    <MuiThemeProvider theme={theme}>
                      <Paper>


                        <Scheduler data={filterDataFall2019}>
                          <ViewState currentDate='09/04/2018' />
                          <WeekView
                            excludedDays={[ 0, 6 ]}
                            cellDuration={60}
                            startDayHour={8}
                            endDayHour={24}
                          />
                          <Appointments />

                        </Scheduler>
                        <MobileStepper
                          variant='progress'
                          steps={fallSchedule.length}
                          position='static'
                          activeStep={activeStep}
                          nextButton={(
                            <Button
                              size='small'
                              onClick={this.handleNext}
                              disabled={activeStep === fallSchedule.length - 1}
                            >
                              Next
                              {theme.direction === 'rtl' ? (
                                <KeyboardArrowLeft />
                              ) : (
                                <KeyboardArrowRight />
                              )}
                            </Button>
                          )}
                          backButton={(
                            <Button
                              size='small'
                              onClick={this.handleBack}
                              disabled={activeStep === 0}
                            >
                              {theme.direction === 'rtl' ? (
                                <KeyboardArrowRight />
                              ) : (
                                <KeyboardArrowLeft />
                              )}
                              Back
                            </Button>
                          )}
                        />
                      </Paper>

                    </MuiThemeProvider>
                  </div>
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <br />
            <Typography variant='h5'>Sequences</Typography>
            <br />
            {sequenceMap ? Object.keys(sequenceMap).map(term => (
              <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{term}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.sequence}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Course Code</TableCell>
                        <TableCell align='center'>Course Title</TableCell>
                        <TableCell align='right'>Credits</TableCell>
                      </TableRow>
                    </TableHead>
                    {sequenceMap[term].map(course => (
                      <TableBody key={course.code}>
                        <TableRow>
                          <TableCell>{course.code}</TableCell>
                          <TableCell align='center'>{course.title}</TableCell>
                          <TableCell align='right'>{course.credits}</TableCell>
                        </TableRow>
                      </TableBody>
                    ))}
                  </Table>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            )) : null
            }
          </Grid>
        </Grid>

      </div>
    );
  }
}

Plan.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Plan);
