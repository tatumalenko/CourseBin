import React, { Component } from 'react';
import concordiaLogo from '../assets/concordia-logo.jpeg';

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
        <div class="home-bottom">
          <img src={concordiaLogo} alt="Concordia University"></img>
        </div>
      </div>
    );
  }
}

export default Home;
