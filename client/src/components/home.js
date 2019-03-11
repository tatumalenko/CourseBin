import React, { Component } from 'react';
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

    console.log(this.state.showForm);
  }


  render() {

    return (

      <div className="home-body-container container">

        {this.state.showForm ?
          <StudentForm /> :
          <div>
            <div className="title-wrapper">
              <h1>Coursebin</h1>
            </div>
            <button onClick={this.handleClick}>Let's Get Started</button>
          </div>
        }
      </div>


    );
  }
}

export default Home;
