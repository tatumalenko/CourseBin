import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Form, Button, Col } from 'react-bootstrap';
import axios from 'axios';

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      redirectTo: null,
      displayError: false,
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
    console.log(`sign-up handleSubmit, username: ${username}`);
    event.preventDefault();

    // request to server to add a new username/password
    axios.post('/user/', {
      username,
      password,
    })
      .then((response) => {
        if (!response.data.errmsg) {
          console.log('successful signup');
          this.setState({
            redirectTo: '/',
          });
        }
      }).catch((error) => {
        console.log('signup error: ');
        console.log(error.response); // Error response with error message
        this.setState({
          username: '',
          password: '',
          displayError: true,
        });
      });
  }

  render() {
    const {
      username, password, redirectTo, displayError,
    } = this.state;
    if (redirectTo) {
      return <Redirect to={{ pathname: redirectTo }} />;
    }
    return (

      <div>

        <div className='title-wrapper'>
          <h1>Coursebin</h1>
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

            {displayError
              ? (
                <Col xs={2}>
                  <Form.Label id='error' className='error-msg'>
                    The signup process did not work! Please try again.
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
              >
                Sign up

              </Button>
            </Col>
            <Col xs={12}>
              <Form.Label>
                <Link to='/'>
                  Already a user? Login here!
                </Link>
              </Form.Label>
            </Col>
          </Form.Row>
        </Form>
      </div>

    );
  }
}

export default Signup;
