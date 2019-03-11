import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';

class LoginForm extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      redirectTo: null,
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
    event.preventDefault();
    console.log('handleSubmit');
    const { username, password } = this.state;
    const { updateUser } = this.props;

    axios
      .post('/user/login', {
        username,
        password,
      })
      .then((response) => {
        console.log('Login response: ', response);
        if (response.status === 200) {
          // update App.js state
          updateUser({
            loggedIn: true,
            username: response.data.username,
          });
          // update the state to redirect to home
          this.setState({
            redirectTo: '/',
          });
        }
      }).catch((error) => {
        console.error('Login error: ', error);
        document.getElementById("error").innerHTML = "Sorry, this username/password" +
        " combination is not valid. Please try again or try signing up."
      });
  }

  render() {
    const { redirectTo, username, password } = this.state;
    if (redirectTo) {
      return <Redirect to={{ pathname: redirectTo }} />;
    }
    return (
      <div>
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
            <div id="error" class="error-msg"></div>
            <div className='form-group col-xs-12'>
              <button
                className='btn btn-primary'
                onClick={this.handleSubmit}
                type='submit'
              >
                Login

            </button>
            </div>
            <Link to='/signup'>
              <p class="register-msg">Not a user? Signup here!</p>
            </Link>
          </form>

        </div>

      </div>
    );
  }
}

export default LoginForm;
