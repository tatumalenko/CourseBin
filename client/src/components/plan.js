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
import ChildBox from './box-child';
import moment from "moment";
import MobileStepper from "@material-ui/core/MobileStepper";
import Button from "@material-ui/core/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";




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

  const sequenceRowFall = [
    [ 'ENGR 301', 'Engineering Management Principles and Economics', 3.00 ],
    [ 'SOEN 321', 'Information Systems Security', 3.00 ],
    [ 'SOEN 490', 'Capstone Software Engineering Design Project', 4.00 ],
    [ 'COMP 353', 'Databases', 4.00 ],
  ].map((row, id) => createRow(id, ...row));

  function createRow(id, courseNum, courseTitle, credits) {
    return {
      id, courseNum, courseTitle, credits,
    };
  }


class Plan extends Component {
  constructor(props) {
    super(props);
    const plan = props.formData;
    const schedules = plan.schedules;
    const sequences = plan.sequences;
    
    const createDate = dateStr => {
      const dateParseFormatStr = "DD/MM/YYYY";
      const date = moment(dateStr, dateParseFormatStr);
      return date;
    };
    
    const createTime = timeStr => {
      return moment(timeStr, "HH:mm:ss");
    };

    const createTime2 = timeEnd => {
      return moment(timeEnd, "HH:mm:ss");
    };
    
    const createDateTime = (dateStr, timeStr) => {
      const date = createDate(dateStr);
      const time = createTime(timeStr);
      date.set({
        hour: time.get("hour"),
        minute: time.get("minute"),
        second: time.get("second")
      });
      return date;
    };

    const createDateTime2 = (dateStr, timeEnd) => {
      const date = createDate(dateStr);
      const time = createTime(timeEnd);
      date.set({
        hour: time.get("hour"),
        minute: time.get("minute"),
        second: time.get("second")
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
    ? dateOfWeekDayInSameWeek.add(7, "day")
    : dateOfWeekDayInSameWeek;
      const time = createTime(timeStr);
        actualDateOfWeekDay.set({
        hour: time.get("hour"),
        minute: time.get("minute"),
        second: time.get("second")
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
    ? dateOfWeekDayInSameWeek.add(7, "day")
    : dateOfWeekDayInSameWeek;
    const time = createTime(timeEnd);
    actualDateOfWeekDay.set({
        hour: time.get("hour"),
        minute: time.get("minute"),
        second: time.get("second")
      });
      return actualDateOfWeekDay;
     };


    this.state = {
      dataFall2019: [],
      class: 'COMP-472',
      subject: 'Artificial Intelligence',
      lecture: 'LEC LL 1234, Hall building 937',
      tutorial: 'TUT A, Hall building 435 ',
      fallSchedule: schedules.fall,
      activeStep: 0
    };
    console.log(this.state.fallSchedule);
    
    //Populating the data for all classes
    this.state.fallSchedule && this.state.fallSchedule.map( (schedule, scheduleIndex) => {
      this.state.fallSchedule[scheduleIndex].sections.map((section, sectionIndex) => {
         this.state.fallSchedule[scheduleIndex].sections[sectionIndex].times.map((time, timeIndex) => {

          let dayOfWeek = time.weekDay;
          let dateStr = "04/09/2018";
          let timeStr = time.startTime;
          let timeEnd = time.endTime;

          let beginDateTime = findWeekDayDate({ dayOfWeek, dateStr, timeStr });
          let finishDateTime = findWeekDayDate2({ dayOfWeek, dateStr, timeEnd });

          
          this.state.dataFall2019.push({
            id: scheduleIndex,
            title: section.courseCode + ' - ' + section.code + ' '+ section.kind,
            startDate: new Date(beginDateTime.format("MM/DD/YYYY HH:mm:ss")),
            endDate: new Date(finishDateTime.format("MM/DD/YYYY HH:mm:ss"))
            
            
          })
        })

      })
      
    }
    )

    const appointments = [
      {
        title: "Website Re-Design Plan",
        startDate: new Date(2018, 5, 25, 9, 30),
        endDate: new Date(2018, 5, 25, 11, 30),
        location: "Room 1"
      },
      {
        title: "Book Flights to San Fran for Sales Trip",
        startDate: new Date(2018, 5, 25, 12, 0),
        endDate: new Date(2018, 5, 25, 13, 0),
        id: 1,
        location: "Room 1"
      },
      {
        title: "Install New Router in Dev Room",
        startDate: new Date(2018, 5, 25, 14, 30),
        endDate: new Date(2018, 5, 25, 15, 30),
        id: 2,
        location: "Room 2"
      }
    ];
    console.log(appointments);
    console.log(this.state.dataFall2019);

    
    
  
  }

  handleNext = () => {
    this.setState(prevState => ({
      activeStep: prevState.activeStep + 1
    }));
  };

  handleBack = () => {
    this.setState(prevState => ({
      activeStep: prevState.activeStep - 1
    }));
  };

  handleStepChange = activeStep => {
    this.setState({ activeStep });
  };
    


  render() {
    const {dataFall2019, fallSchedule, activeStep} = this.state;
    const filterDataFall2019 = dataFall2019.filter(function (el) {
      return el.id == activeStep
    });
    return (
      <div className='plan-container'>
        <div className='header-logo'>
          <h3> CourseBin</h3>
        </div>
        <Grid container spacing={16}>
          <Grid item xs={2} />
          <Grid item xs={8} className='schedule-container'>
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
                            <ViewState currentDate="09/04/2018" />
                            <WeekView
                              excludedDays={[ 0, 6 ]}
                              cellDuration={60}
                              startDayHour={8}
                              endDayHour={24}
                            />
                            <Appointments />
                    
                          </Scheduler>
                          <MobileStepper
                            variant="progress"
                            steps={fallSchedule.length}
                            position="static"
                            activeStep={activeStep}
                            nextButton={
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
                            }
                            backButton={
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
                            }
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
                      {sequenceRowFall.map(row => (
                        <TableRow key={row.id}>
                          <TableCell>{row.courseNum}</TableCell>
                          <TableCell align='center'>{row.courseTitle}</TableCell>
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
                      {sequenceRowFall.map(row => (
                        <TableRow key={row.id}>
                          <TableCell>{row.courseNum}</TableCell>
                          <TableCell align='center'>{row.courseTitle}</TableCell>
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
                      {sequenceRowFall.map(row => (
                        <TableRow key={row.id}>
                          <TableCell>{row.courseNum}</TableCell>
                          <TableCell align='center'>{row.courseTitle}</TableCell>
                          <TableCell align='right'>{row.credits}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Typography>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Grid>
          <Grid item xs={2} />
        </Grid>

      </div>
    );
  }
}

export default Plan;
