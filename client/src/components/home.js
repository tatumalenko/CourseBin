import React, { Component } from 'react';
import StudentForm from './student-form';

class Home extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
  }


  render() {

    return (
      <div className="home-body-container container">
        <div className="title-wrapper">
          <h1>Coursebin</h1>
        </div>
        <Route
          path='/student-form'
          component={StudentForm}
          render={() => (
            <StudentForm
            />
          )}
        />
      </div>


    );
  }
}

export default Home;
