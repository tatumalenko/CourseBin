import React, { Component } from 'react';
import axios from 'axios';

let x;

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      confirmPassword: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleSubmit(event) {
    const { username, password } = this.state;
    console.log('sign-up handleSubmit, username: ');
    console.log(username);
    event.preventDefault();

    // request to server to add a new username/password
    axios.post('/user/', {
      username,
      password,
    })
      .then((response) => {
        if (!response.data.errmsg) {
          console.log('successful signup');
          this.setState({ // redirect to login page
            redirectTo: '/login',
          });
        } else {
          console.log('username already taken');
        }
      }).catch((error) => {
        console.log('signup error: ');
        console.log(error.response); //Error response with error message
      });
  }


  render() {
    const { username, password } = this.state;
    return (
      <div className='SignupForm'>
        <div className="home-body-container container">

          <div className="title-wrapper">
            <h1>Coursebin</h1>
          </div>

          <form className='form-horizontal'>
            <div className='form-group col-xs-12'>
              <input
                className='form-input'
                type='text'
                id='username'
                name='username'
                placeholder='Username'
                value={username}
                onChange={this.handleChange}
              />
            </div>
            <div className='form-group col-xs-12'>
              <input
                className='form-input'
                placeholder='password'
                type='password'
                name='password'
                value={password}
                onChange={this.handleChange}
              />
            </div>
            <div className='form-group col-xs-12'>
              <button
                className='btn btn-primary'
                onClick={this.handleSubmit}
                type='submit'
              >
                Sign up
            </button>
            </div>
          </form>
        </div>
      </div>

    );
  }
}

export default Signup;
