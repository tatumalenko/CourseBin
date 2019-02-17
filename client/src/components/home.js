import React, { Component } from 'react';

class Home extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
  }


  render() {
    const imageStyle = {
      width: 400,
    };
    return (
      <div>
        <p>It's good to be home</p>
        <img
          style={imageStyle}
          src='https://i.ytimg.com/vi/N1icEHtgb3g/maxresdefault.jpg'
          alt="It's good to be home"
        />
      </div>
    );
  }
}

export default Home;
