import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import Paper from '@material-ui/core/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  WeekView,
  Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


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
  ["ENGR 301", "Engineering Management Principles and Economics", 3.00],
  ["SOEN 321", "Information Systems Security", 3.00],
  ["SOEN 490", "Capstone Software Engineering Design Project", 4.00],
  ["COMP 353", "Databases", 4.00]
].map((row, id) => createRow(id, ...row));

function createRow(id, courseNum, courseTitle, credits){
  return {id, courseNum, courseTitle, credits}
}

class Plan extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: classes,
    };
  }

  render() {
    const { data } = this.state;

    return (
      <div className='plan-container'>
        <div className='header-logo'>
          <h3> CourseBin</h3>
        </div>
        <Row>
          <Col xs={2} />
          <Col xs={8} className='schedule-container'>
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Fall 2019</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <div className='schedule'>
                  <MuiThemeProvider theme={theme}>
                    <Paper>
                      <Scheduler data={data}>
                        <ViewState currentDate='2018-07-28' />
                        <WeekView
                          data={data}
                          excludedDays={[ 0, 6 ]}
                          cellDuration={60}
                          startDayHour={8}
                          endDayHour={24}
                        />
                        <Appointments />
                      </Scheduler>
                    </Paper>
                  </MuiThemeProvider>
                </div>
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
                      <TableCell align="center">Course Title</TableCell>
                      <TableCell align="right">Credits</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
          {sequenceRowFall.map(row => (
            <TableRow key={row.id}>
              <TableCell>{row.courseNum}</TableCell>
              <TableCell align="center">{row.courseTitle}</TableCell>
              <TableCell align="right">{row.credits}</TableCell>
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
                      <TableCell align="center">Course Title</TableCell>
                      <TableCell align="right">Credits</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
          {sequenceRowFall.map(row => (
            <TableRow key={row.id}>
              <TableCell>{row.courseNum}</TableCell>
              <TableCell align="center">{row.courseTitle}</TableCell>
              <TableCell align="right">{row.credits}</TableCell>
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
                      <TableCell align="center">Course Title</TableCell>
                      <TableCell align="right">Credits</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
          {sequenceRowFall.map(row => (
            <TableRow key={row.id}>
              <TableCell>{row.courseNum}</TableCell>
              <TableCell align="center">{row.courseTitle}</TableCell>
              <TableCell align="right">{row.credits}</TableCell>
            </TableRow>
          ))}
        </TableBody>
                  </Table>
                </Typography>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Col>
          <Col xs={2} />
        </Row>

      </div>
    );
  }
}

export default Plan;
