import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
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
      });
  }

  render() {
    const { redirectTo, username, password } = this.state;
    if (redirectTo) {
      return <Redirect to={{ pathname: redirectTo }} />;
    }
    return (
      <div>
        <h4>Login</h4>
        <form className='form-horizontal'>
          <div className='form-group'>
            <div className='col-1 col-ml-auto'>
              <label className='form-label' htmlFor='username'>Username: </label>
            </div>
            <div className='col-3 col-mr-auto'>
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
          </div>
          <div className='form-group'>
            <div className='col-1 col-ml-auto'>
              <label className='form-label' htmlFor='password'>Password: </label>
            </div>
            <div className='col-3 col-mr-auto'>
              <input
                className='form-input'
                placeholder='password'
                type='password'
                name='password'
                value={password}
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className='form-group '>
            <div className='col-7' />
            <button
              className='btn btn-primary col-1 col-mr-auto'

              onClick={this.handleSubmit}
              type='submit'
            >
Login

            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default LoginForm;
