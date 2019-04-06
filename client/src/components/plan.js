/* eslint-disable react/destructuring-assignment */
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
    backgroundColor: 'rgba(0, 188, 212, 0.2)',
  },
});

class Plan extends Component {
  constructor(props) {
    super(props);
    const plan = props.formData;
    this.schedules = plan.schedules;
    this.sequences = plan.sequences;
    this.fallStartDate = '09/04/2018';
    this.winterStartDate = '01/07/2019';
    this.summerStartDate = '05/06/2019';
    this.fallDetailMap = {};
    this.winterDetailMap = {};
    this.summerDetailMap = {};

    this.state = {
      // sequences
      sequenceMap: this.parseSequences(),

      // ===== for parsing schedule data for each term ====
      terms: [],

      fallSchedule: [],
      fallSchedulerData: null,
      fallSchedulerArr: [],
      fallCourseInfo: [],
      fallActiveStep: 0,

      winterSchedule: [],
      winterSchedulerData: null,
      winterSchedulerArr: [],
      winterCourseInfo: [],
      winterActiveStep: 0,

      summerSchedule: [],
      summerSchedulerData: null,
      summerSchedulerArr: [],
      summerCourseInfo: [],
      summerActiveStep: 0,

      // dummy info for the description box component
      // TODO real implementation
      course: 'COMP-472',
      subject: 'Artificial Intelligence',
      lecture: 'LEC LL 1234, Hall building 937',
      tutorial: 'TUT A, Hall building 435 ',
    };

    this.createDate = this.createDate.bind(this);
    this.createTime = this.createTime.bind(this);
    this.findWeekDayDate = this.findWeekDayDate.bind(this);
    this.findWeekDayDate2 = this.findWeekDayDate2.bind(this);
    this.parseSchedules = this.parseSchedules.bind(this);
    this.parseScheduleDetails = this.parseScheduleDetails.bind(this);
    this.setScheduleDetailsState = this.setScheduleDetailsState.bind(this);
    this.parseSequences = this.parseSequences.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleStepChange = this.handleStepChange.bind(this);
  }

  componentDidMount(){
    this.parseSchedules();
  }

  parseSchedules = () => {
    const schedules = this.schedules;

    Object.keys(schedules).forEach((term) => {
      const scheduleCollection = schedules[term];
      scheduleCollection.forEach((schedule, scheduleIndex) => {
        const sections = schedule.sections;
        sections.forEach((section, sectionIndex) => {
          if (!_.includes(this.state.terms, term)) {
            this.state.terms.push(_.lowerCase(term));
          }
          sections[sectionIndex].times.forEach((time) => {
            const dayOfWeek = time.weekDay;
            const dateStr = this[`${term}StartDate`];
            const timeStr = time.startTime;
            const timeEnd = time.endTime;
            const beginDateTime = this.findWeekDayDate({ dayOfWeek, dateStr, timeStr });
            const finishDateTime = this.findWeekDayDate2({ dayOfWeek, dateStr, timeEnd });

            this.state[`${term}Schedule`].push({
              title: `${section.courseCode} - ${section.code} ${section.kind}`,
              startDate: beginDateTime.format('YYYY-MM-DD HH:mm'),
              endDate: finishDateTime.format('YYYY-MM-DD HH:mm'),
              id: scheduleIndex,
              section: section,
            });
          });
        });
      });
    });

    this.state.terms.forEach((term, index) => {

      const schedules = this.state[`${term}Schedule`];
      schedules.forEach((schedule, index) =>{
        const scheduler = schedules.filter(el => el.id === index);
        if(scheduler && scheduler.length > 0){
          this.state[`${term}SchedulerArr`].push(scheduler);
        }
      });
            
      const step = this.state[`${term}ActiveStep`];

      //initial schedule view
      const initialView = this.state[`${term}SchedulerArr`][0];
    

      //description box for each course
      const info = this.parseScheduleDetails(initialView, term, step);

      this.setState({
        [`${term}SchedulerData`]: initialView,
        [`${term}CourseInfo`]: info,
      });

    });
  }

  // ******** helper functions to parse schedules for UI *************

  createDate = (dateStr) => {
    const dateParseFormatStr = 'MM/DD/YYYY';
    const date = moment(dateStr, dateParseFormatStr);
    return date;
  };

  createTime = timeStr => moment(timeStr, 'HH:mm');

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

  parseScheduleDetails = (data, term, activeStep) => {
    this[`${term}DetailMap`] = {}; //clear the map each time we go to next schedule      
      data.forEach((schedule) => {
        const section = schedule.section;
        const courseCode = section.courseCode;
        if (courseCode && !this[`${term}DetailMap`][`${courseCode}-${activeStep}`]) {
          const location = section.location;
          const kind = section.kind;
          const description = `${kind} ${section.code} ${location.building} building Room: ${location.room}`;
          const title = section.title;
          if (kind === 'LEC') {
            this[`${term}DetailMap`][`${courseCode}-${activeStep}`] = {
              course: courseCode,
              subject: title,
              lecture: description,
              id: activeStep,
            };
          } else if (kind === 'TUT') {
            this[`${term}DetailMap`][`${courseCode}-${activeStep}`] = {
              course: courseCode,
              subject: title,
              tutorial: description,
              id: activeStep,
            };
          } else if (kind === 'LAB') {
            this[`${term}DetailMap`][`${courseCode}-${activeStep}`] = {
              course: courseCode,
              subject: title,
              lab: description,
              id: activeStep,
            };
          }
        } else {
          const location = section.location;
          const kind = section.kind;
          const description = `${kind} ${section.code}, ${location.building} Building, Room ${location.room}`;
          if (kind === 'LEC') {
            this[`${term}DetailMap`][`${courseCode}-${activeStep}`].lecture = description;
          } else if (kind === 'TUT') {
            this[`${term}DetailMap`][`${courseCode}-${activeStep}`].tutorial = description;
          } else if (kind === 'LAB') {
            this[`${term}DetailMap`][`${courseCode}-${activeStep}`].lab = description;
          }
        }
      });
      const map = this[`${term}DetailMap`];
    const courseDetails = [];
    //push the details into array for UI
    Object.keys(map).forEach((key)=>{
        courseDetails.push(map[key]);
    });
    return courseDetails;
  }

  setScheduleDetailsState = (term) => {
    const map = this[`${term}DetailMap`];
    const courseDetails = [];
    //push the details into array for UI
    Object.keys(map).forEach((key)=>{
        courseDetails.push(map[key]);
    });
    return courseDetails;
  }

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


  // ******** functions to dynamically handle state of carousel *************
  handleNext = (termStep, term) => (event) => {
    event.preventDefault();

    const scheduler = this.state[`${term}SchedulerArr`];
    const i = this.state[`${term}ActiveStep`] + 1;
    const data = scheduler[i];
    const info =  this.parseScheduleDetails(data, term, i);

    this.setState(prevState => ({
      [termStep]: prevState[termStep] + 1,
      [`${term}SchedulerData`]: data,
      [`${term}CourseInfo`]: info,
    }));
  };

  handleBack = (termStep, term) => (event) => {
    event.preventDefault();
    const scheduler = this.state[`${term}SchedulerArr`];
    const i = this.state[`${term}ActiveStep`] - 1;
    const data = scheduler[i];
    const info =  this.parseScheduleDetails(data, term, i);

    this.setState(prevState => ({
      [termStep]: prevState[termStep] - 1,
      [`${term}SchedulerData`]: data,
      [`${term}CourseInfo`]: info,
    }));
  };

  handleStepChange = (activeStep) => {
    this.setState({ activeStep });
  };


  render() {
    const { classes } = this.props;
    const {
      // sequences
      sequenceMap,
      // schedules
      terms,
    } = this.state;

    return (
      <div className='plan-container'>
        <Grid container spacing={16}>
          <Grid item xs={12} className='schedule-container'>
            <div className='header-logo plan'>
              <Typography variant='h4'>CourseBin</Typography>
            </div>
            <Typography id='schedule-header' variant='h4'>
              Here's what we came up with...
            </Typography>
            <Typography variant='h5'>Agenda Views</Typography>
            {terms
              ? terms.map((term, index) => (
                <ExpansionPanel defaultExpanded={index === 0}>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{_.startCase(term)}</Typography>
                  </ExpansionPanelSummary>

                  <ExpansionPanelDetails>
                    <Grid item xs={3}>
                      {this.state[`${term}CourseInfo`].map((courseDetails) => (
                      <ChildBox
                        titleClass={courseDetails.course}
                        subject={courseDetails.subject}
                        lecture={courseDetails.lecture}
                        tutorial={courseDetails.tutorial}
                      />
                      ))}
                    </Grid>
                    <Grid item xs={9}>
                      <div className='schedule'>
                        <MuiThemeProvider theme={theme}>
                          <Paper>
                            <Scheduler data={this.state[`${term}SchedulerData`]}>
                              <ViewState currentDate={this[`${term}StartDate`]} />
                              <WeekView
                                excludedDays={[0, 6]}
                                cellDuration={60}
                                startDayHour={8}
                                endDayHour={24}
                              />
                              <Appointments />
                            </Scheduler>
                            <MobileStepper
                              variant='progress'
                              steps={this.state[`${term}SchedulerArr`].length}
                              position='static'
                              activeStep={this.state[`${term}ActiveStep`]}
                              nextButton={(
                                <Button
                                  size='small'
                                  onClick={this.handleNext(`${term}ActiveStep`, `${term}`)}
                                  disabled={this.state[`${term}ActiveStep`] === this.state[`${term}SchedulerArr`].length - 1}
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
                                  onClick={this.handleBack(`${term}ActiveStep`, `${term}`)}
                                  disabled={this.state[`${term}ActiveStep`] === 0}
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
              )) : null
            }
            <Typography className='plan-header' variant='h5'>Course Sequences</Typography>
            {sequenceMap ? Object.keys(sequenceMap).map(term => (
              <ExpansionPanel>
                <ExpansionPanelSummary className={classes.sequence} expandIcon={<ExpandMoreIcon />}>
                  <Typography>{term}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
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
