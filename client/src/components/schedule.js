import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  WeekView,
  Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';


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
const theme = createMuiTheme({ palette: { primary: burgundy, secondary: burgundy, error: burgundy } });


class Schedule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: classes,
    };
  }

  render() {
    const { data } = this.state;

    return (
      <div>
        <div className='header-logo'>
            <h3>CourseBin</h3>
          </div>

        <MuiThemeProvider theme={theme}>
          <Paper>
            <h4> Weekly Schedule </h4>
            <Scheduler data={data}>

              <ViewState currentDate='2018-07-28' />
              <WeekView startDayHour={8} endDayHour={24} />
              <Appointments />
            </Scheduler>
          </Paper>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default Schedule;
