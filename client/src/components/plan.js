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

// Fake data
const classes = [
  {
    title: 'COMP-346, LECTURE SS',
    // Year, month, day, time (9:30AM)
    startDate: new Date(2018, 6, 25, 9, 30),
    endDate: new Date(2018, 6, 25, 11, 30),
    id: 0,

  },
  {
    title: 'COMP-346, TUTORIAL SS',
    startDate: new Date(2018, 6, 24, 12, 0),
    endDate: new Date(2018, 6, 24, 13, 0),
    id: 1,
  },
  {
    title: 'FNS LECTURE',
    startDate: new Date(2018, 6, 23, 8, 30),
    endDate: new Date(2018, 6, 23, 10, 15),
    id: 3,
  },
  {
    title: 'SOEN-341 LECTURE',
    startDate: new Date(2018, 6, 26, 8, 30),
    endDate: new Date(2018, 6, 26, 10, 15),
    id: 4,
  },
  {
    title: 'SOEN-331 LECTURE',
    startDate: new Date(2018, 6, 27, 11, 30),
    endDate: new Date(2018, 6, 27, 13, 0),
    id: 5,
  },

];
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

    this.state = {
      data: classes,
      class: 'COMP-472',
      subject: 'Artificial Intelligence',
      lecture: 'LEC LL 1234, Hall building 937',
      tutorial: 'TUT A, Hall building 435 ',
      fallSchedule: schedules.fall,
    };
    console.log(this.state.fallSchedule);
  }

  render() {
    const { fallSchedule } = this.state;

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
                        {fallSchedule.length > 0 ? (fallSchedule.map(schedule => (
                          <Scheduler data={schedule.sections}>
                            <ViewState currentDate='2018-07-28' />
                            <WeekView
                              data={schedule.sections}
                              excludedDays={[ 0, 6 ]}
                              cellDuration={60}
                              startDayHour={8}
                              endDayHour={24}
                            />
                            <Appointments />
                          </Scheduler>
                        ))
                        ) : null}
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
