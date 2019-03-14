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
      err: false
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
        this.setState({ err: true });
      });
  }

  render() {
    const { redirectTo, username, password, err } = this.state;
    if (redirectTo) {
      return <Redirect to={{ pathname: redirectTo }} />;
    }
    return (


      <div>

        <div className="title-wrapper">
          <h1>Coursebin</h1>
        </div>

        <Form>
          <Form.Row>
            <Col xs={5}></Col>
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
            <Col xs={5}></Col>
            <Col xs={2}>
              <Form.Control
                placeholder='password'
                type='password'
                name='password'
                value={password}
                onChange={this.handleChange}
              />
            </Col>
            <Col xs={5}></Col>
            <Col xs={5}></Col>
            {err ?
              (<Col xs={2}>
                <Form.Label id="error" className="error-msg">
                  Sorry, this username/password combination is not valid. Please try again or try signing up.
                </Form.Label>
              </Col>)
              : null
            }
          </Form.Row>
          <br />
          <Form.Row>
            <Col xs={12}>
              <Button
                onClick={this.handleSubmit}
                type='submit'
              >Login</Button>
            </Col>
            <Col xs={12}>

              <Form.Label>
                <Link to='/signup'>Not a user? Signup here!</Link>
              </Form.Label>

            </Col>

          </Form.Row>


        </Form>
      </div >

    );
  }
}

export default LoginForm;
