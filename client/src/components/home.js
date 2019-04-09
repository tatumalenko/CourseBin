import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Button, MuiThemeProvider, createMuiTheme, Typography,
} from '@material-ui/core';
import cyan from '@material-ui/core/colors/cyan';

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
class Home extends Component {
  render() {
    return (
      <MuiThemeProvider theme={custTheme}>
        {(
          <div>
            <div className='title-wrapper'>
              <Typography variant='h1'>CourseBin</Typography>
            </div>
            <Button
              id='submit'
              size='large'
              variant='outlined'
              color='primary'
              type='submit'
              component={Link}
              to='/dashboard'
            >
                Head over to your dashboard
            </Button>
            <br />
            <br />
            <Button
              id='submit'
              size='large'
              variant='outlined'
              color='primary'
              type='submit'
              component={Link}
              to='/planner'
            >
                Head over to the planner
            </Button>
          </div>
          )
        }
      </MuiThemeProvider>
    );
  }
}

export default Home;
