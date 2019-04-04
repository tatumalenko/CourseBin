import React, { Component } from 'react';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  WeekView,
  Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  MuiThemeProvider,
  createMuiTheme,
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
import moment from "moment";
import MobileStepper from "@material-ui/core/MobileStepper";
import Button from "@material-ui/core/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import ChildBox from './box-child';

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
});

class Plan extends Component {
  constructor(props) {
    super(props);
    const plan = props.formData;
    const schedules = plan.schedules;
    const sequences = plan.sequences;

    const createDate = (dateStr) => {
      const dateParseFormatStr = 'DD/MM/YYYY';
      const date = moment(dateStr, dateParseFormatStr);
      return date;
    };

    const createTime = (timeStr) => moment(timeStr, "HH:mm:ss");

    const createTime2 = (timeEnd) => moment(timeEnd, "HH:mm:ss");

    const createDateTime = (dateStr, timeStr) => {
      const date = createDate(dateStr);
      const time = createTime(timeStr);
      date.set({
        hour: time.get('hour'),
        minute: time.get('minute'),
        second: time.get('second'),
      });
      return date;
    };

    const createDateTime2 = (dateStr, timeEnd) => {
      const date = createDate(dateStr);
      const time = createTime(timeEnd);
      date.set({
        hour: time.get('hour'),
        minute: time.get('minute'),
        second: time.get('second'),
      });
      return date;
    };

    // find if weekDay is before or after startDate and return
    // next week's weekDay date if startDate occured after weekDay
    // of that week
    const findWeekDayDate = ({ dayOfWeek, dateStr, timeStr }) => {
      const date = createDate(dateStr);
      const dateOfWeekDayInSameWeek = createDate(dateStr).day(dayOfWeek);
      // if dateOfWeekDayInSameWeek occurs before the date, then it has
      // passed and the actual date with that day of the week will occur
      // in the next week
      const actualDateOfWeekDay = dateOfWeekDayInSameWeek.isBefore(date)
        ? dateOfWeekDayInSameWeek.add(7, 'day')
        : dateOfWeekDayInSameWeek;
      const time = createTime(timeStr);
      actualDateOfWeekDay.set({
        hour: time.get('hour'),
        minute: time.get('minute'),
        second: time.get('second'),
      });

      return actualDateOfWeekDay;
    };

    const findWeekDayDate2 = ({ dayOfWeek, dateStr, timeEnd }) => {
      const date = createDate(dateStr);
      const dateOfWeekDayInSameWeek = createDate(dateStr).day(dayOfWeek);
      // if dateOfWeekDayInSameWeek occurs before the date, then it has
      // passed and the actual date with that day of the week will occur
      // in the next week
      const actualDateOfWeekDay = dateOfWeekDayInSameWeek.isBefore(date)
        ? dateOfWeekDayInSameWeek.add(7, 'day')
        : dateOfWeekDayInSameWeek;
      const time = createTime(timeEnd);
      actualDateOfWeekDay.set({
        hour: time.get('hour'),
        minute: time.get('minute'),
        second: time.get('second'),
      });
      return actualDateOfWeekDay;
    };


    this.state = {
      availableSequences: [],
      dataFall2019: [],
      class: 'COMP-472',
      subject: 'Artificial Intelligence',
      lecture: 'LEC LL 1234, Hall building 937',
      tutorial: 'TUT A, Hall building 435 ',
      fallSchedule: schedules.fall,
      activeStep: 0,
    };
    console.log(this.state.fallSchedule);


    for (let i = 0; i < sequences.length; i++) {
      this.state.availableSequences.push({
        code: sequences[i].courses[0].code,
        title: sequences[i].courses[0].title,
        credits: sequences[i].courses[0].credits,
      });
    }
    // Populating the data for all classes
    this.state.fallSchedule && this.state.fallSchedule.map((schedule, scheduleIndex) => {
      this.state.fallSchedule[scheduleIndex].sections.map((section, sectionIndex) => {
        this.state.fallSchedule[scheduleIndex].sections[sectionIndex].times.map((time, timeIndex) => {
          const dayOfWeek = time.weekDay;
          const dateStr = '04/09/2018';
          const timeStr = time.startTime;
          const timeEnd = time.endTime;

          const beginDateTime = findWeekDayDate({ dayOfWeek, dateStr, timeStr });
          const finishDateTime = findWeekDayDate2({ dayOfWeek, dateStr, timeEnd });


          this.state.dataFall2019.push({
            id: scheduleIndex,
            title: `${section.courseCode} - ${section.code} ${section.kind}`,
            startDate: new Date(beginDateTime.format('MM/DD/YYYY HH:mm:ss')),
            endDate: new Date(finishDateTime.format('MM/DD/YYYY HH:mm:ss')),


          });
        });
      });
    });

    const appointments = [
      {
        title: 'Website Re-Design Plan',
        startDate: new Date(2018, 5, 25, 9, 30),
        endDate: new Date(2018, 5, 25, 11, 30),
        location: 'Room 1',
      },
      {
        title: 'Book Flights to San Fran for Sales Trip',
        startDate: new Date(2018, 5, 25, 12, 0),
        endDate: new Date(2018, 5, 25, 13, 0),
        id: 1,
        location: 'Room 1',
      },
      {
        title: 'Install New Router in Dev Room',
        startDate: new Date(2018, 5, 25, 14, 30),
        endDate: new Date(2018, 5, 25, 15, 30),
        id: 2,
        location: 'Room 2',
      },
    ];
    console.log(appointments);
    console.log(this.state.dataFall2019);
    for (let i = 0; i < sequences.length; i++) {
      this.state.availableSequences.push({
        code: sequences[i].courses[0].code,
        title: sequences[i].courses[0].title,
        credits: sequences[i].courses[0].credits,
      });
    }
  }

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
    const { dataFall2019, fallSchedule, activeStep } = this.state;
    const filterDataFall2019 = dataFall2019.filter((el) => {
      return el.id == activeStep
    });
    return (
      <div className='plan-container'>
        <div className='header-logo'>
          <Typography variant='h4'>CourseBin</Typography>
        </div>
        <Grid container spacing={16}>
          <Grid item xs={12} className='schedule-container'>
            <Typography id='schedule-header' variant='h4'>Here's what we came up with... </Typography>
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Fall 2019</Typography>
              </ExpansionPanelSummary>

              <ExpansionPanelDetails>

                <Grid item xs={3}>
                  <ChildBox
                    titleClass={this.state.class}
                    subject={this.state.subject}
                    lecture={this.state.lecture}
                    tutorial={this.state.tutorial}
                  />
                  <br />
                  <ChildBox
                    titleClass={this.state.class}
                    subject={this.state.subject}
                    lecture={this.state.lecture}
                    tutorial={this.state.tutorial}
                  />
                  <br />
                  <ChildBox
                    titleClass={this.state.class}
                    subject={this.state.subject}
                    lecture={this.state.lecture}
                    tutorial={this.state.tutorial}
                  />
                  <br />
                  <ChildBox
                    titleClass={this.state.class}
                    subject={this.state.subject}
                    lecture={this.state.lecture}
                    tutorial={this.state.tutorial}
                  />
                  <br />
                  <ChildBox
                    titleClass={this.state.class}
                    subject={this.state.subject}
                    lecture={this.state.lecture}
                    tutorial={this.state.tutorial}
                  />
                </Grid>
                <Grid item xs={9}>
                  <div className='schedule'>
                    <MuiThemeProvider theme={theme}>
                      <Paper>


                        <Scheduler data={filterDataFall2019}>
                          <ViewState currentDate='09/04/2018' />
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
                          steps={fallSchedule.length}
                          position='static'
                          activeStep={activeStep}
                          nextButton={(
                            <Button
                              size="small"
                              onClick={this.handleNext}
                              disabled={activeStep === fallSchedule.length - 1}
                            >
                              Next
                                {theme.direction === "rtl" ? (
                                <KeyboardArrowLeft />
                              ) : (
                                  <KeyboardArrowRight />
                                )}
                            </Button>
                          )}
                          backButton={(
                            <Button
                              size="small"
                              onClick={this.handleBack}
                              disabled={activeStep === 0}
                            >
                              {theme.direction === "rtl" ? (
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
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Winter 2020</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                  sit amet blandit leo lobortis eget.
                </Typography>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Summer 2020</Typography>
              </ExpansionPanelSummary>
            </ExpansionPanel>
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Fall 2020</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Course Code</TableCell>
                        <TableCell align='center'>Course Title</TableCell>
                        <TableCell align='right'>Credits</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.availableSequences.slice(0, 5).map(row => (
                        <TableRow key={row.id}>
                          <TableCell>{row.code}</TableCell>
                          <TableCell align='center'>{row.title}</TableCell>
                          <TableCell align='right'>{row.credits}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Typography>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Winter 2021</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Course Code</TableCell>
                        <TableCell align='center'>Course Title</TableCell>
                        <TableCell align='right'>Credits</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.availableSequences.slice(5, 10).map(row => (
                        <TableRow key={row.id}>
                          <TableCell>{row.code}</TableCell>
                          <TableCell align='center'>{row.title}</TableCell>
                          <TableCell align='right'>{row.credits}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Typography>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Summer 2021</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Course Code</TableCell>
                        <TableCell align='center'>Course Title</TableCell>
                        <TableCell align='right'>Credits</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.availableSequences.slice(10, 15).map(row => (
                        <TableRow key={row.id}>
                          <TableCell>{row.code}</TableCell>
                          <TableCell align='center'>{row.title}</TableCell>
                          <TableCell align='right'>{row.credits}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Typography>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Grid>
        </Grid>

      </div>
    );
  }
}

export default Plan;
