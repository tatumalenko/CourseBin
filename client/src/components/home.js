import React, { Component } from 'react';

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
        <p>
          Welcome, you have logged in successfully!
        </p>
      </div>
    );
  }
}

export default Home;
