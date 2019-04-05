import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
 Button, MuiThemeProvider, createMuiTheme, Typography 
} from '@material-ui/core';
import cyan from '@material-ui/core/colors/cyan';
import StudentForm from './student-form';

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

class Home extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({
      showForm: true,
    });
  }

  render() {
    const { redirectTo, showForm } = this.state;
    if (redirectTo) {
      return <Redirect to={{ pathname: redirectTo }} />;
    }

    return (
      <MuiThemeProvider theme={custTheme}>
        {showForm
          ? <StudentForm />
          : (
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
                onClick={this.handleClick}
              >
                Let&apos;s Get Started!
              </Button>
            </div>
          )
        }
      </MuiThemeProvider>
    );
  }
}

export default Home;
