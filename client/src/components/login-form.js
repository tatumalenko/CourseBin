import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Form, Button, Col } from 'react-bootstrap';
import axios from 'axios';

class LoginForm extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      redirectTo: null,
      invalid: false,
      loginError: false,
    };
    this._isMounted = false;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleChange(event) {
    if (this._isMounted) {
      this.setState({
        [event.target.name]: event.target.value,
      });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log('handleSubmit');
    const { username, password } = this.state;
    const { updateUser } = this.props;

    if (this._isMounted) { this.setState({ invalid: false }); }
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
          if (this._isMounted) {
            this.setState({
              redirectTo: '/',
            });
          }
        }
      }).catch((error) => {
        if (this._isMounted) {
          this.setState({
            username: '',
            password: '',
            redirectTo: null,
            loginError: error,
          });
        }
        console.error('Login error: ', error);
      });
  }

  render() {
    const {
      redirectTo, username, password, loginError,
    } = this.state;
    if (redirectTo) {
      return <Redirect to={{ pathname: redirectTo }} />;
    }

    return (
      <div className='home-form-wrapper'>

        <div className='title-wrapper'>
          <h1>CourseBin</h1>
        </div>

        <Form>
          <Form.Row>
            <Col xs={5} />
            <Col xs={2}>
              <Form.Control
                type='text'
                id='username'
                name='username'
                placeholder='Username'
                value={username}
                onChange={this.handleChange}
              />
            </Col>
          </Form.Row>
          <Form.Row>
            <Col xs={5} />
            <Col xs={2}>
              <Form.Control
                placeholder='password'
                type='password'
                name='password'
                value={password}
                onChange={this.handleChange}
              />
            </Col>
            <Col xs={5} />
            <Col xs={5} />
            {loginError
              ? (
                <Col xs={2}>
                  <Form.Label id='error' className='error-msg'>
                    {
                      loginError.data
                        ? loginError.data.message.toString()
                        : 'Sorry, this username/password combination is not valid.'
                        + 'Please try again or try signing up.'
                    }
                  </Form.Label>
                </Col>
              )
              : null
            }
          </Form.Row>
          <br />
          <Form.Row>
            <Col xs={12}>
              <Button
                onClick={this.handleSubmit}
                type='submit'
                variant='outline-info'
                size='lg'
              >
                Login
              </Button>
            </Col>
            <Col xs={12}>
              <Form.Label className='label-info'>
                <Link to='/signup'>Not a user? Signup here!</Link>
              </Form.Label>
            </Col>
          </Form.Row>
        </Form>

      </div>
    );
  }
}

export default LoginForm;
