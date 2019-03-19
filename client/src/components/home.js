import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, ButtonToolbar } from 'react-bootstrap';
import StudentForm from './student-form';

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

      <div>

        {showForm
          ? <StudentForm />
          : (
            <div>
              <div className='title-wrapper'>
                <h1>Coursebin</h1>
              </div>
              <Button size='lg' variant='outline-info' onClick={this.handleClick}>Let's Get Started</Button>
            </div>
          )
        }
      </div>


    );
  }
}

export default Home;
