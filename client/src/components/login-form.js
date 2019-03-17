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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
      invalid: false,
<<<<<<< HEAD
>>>>>>> 37d606fc13b8e09ecfa456de7d62e6b3d4faeb45
      err: false,
=======
      invalid: false,
>>>>>>> 9f906ef... [#40] Add client side password validation
=======
      invalid: false,
>>>>>>> 9f906ef... [#40] Add client side password validation
=======
      err: false,
>>>>>>> 2434598... [#41] Merged master into branch, fixed conflicts
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

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    if(password.length >= 4 && !(password == username)){
      this.setState({invalid : false});
=======
    this.setState({ invalid: false });
>>>>>>> 37d606fc13b8e09ecfa456de7d62e6b3d4faeb45
=======
    if(password.length >= 4 && !(password == username)){
      this.setState({invalid : false});
>>>>>>> 9f906ef... [#40] Add client side password validation
=======
    this.setState({ invalid: false });
>>>>>>> 2434598... [#41] Merged master into branch, fixed conflicts
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
        this.setState({
          username: '',
          password: '',
          redirectTo: null,
        });
        console.error('Login error: ', error);
        this.setState({ err: true });
      });
  }
<<<<<<< HEAD
  else{
    this.setState({invalid : true});
  }
}
=======
>>>>>>> 2434598... [#41] Merged master into branch, fixed conflicts

  render() {
    const {
      redirectTo, username, password, err, invalid,
    } = this.state;
    if (redirectTo) {
      return <Redirect to={{ pathname: redirectTo }} />;
    }
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    let invalidPassword = ''
    if (this.state.invalid){
      invalidPassword = "Username and Password must be different. Password must be at least 4 characters long.";
=======
    let invalidPassword = '';
    if (invalid) {
      invalidPassword = 'Username and Password must be different. Password must be at least 4 characters long.';
>>>>>>> 37d606fc13b8e09ecfa456de7d62e6b3d4faeb45
=======
    let invalidPassword = ''
    if (this.state.invalid){
      invalidPassword = "Username and Password must be different. Password must be at least 4 characters long.";
>>>>>>> 9f906ef... [#40] Add client side password validation
=======
    let invalidPassword = '';
    if (invalid) {
      invalidPassword = 'Username and Password must be different. Password must be at least 4 characters long.';
>>>>>>> 2434598... [#41] Merged master into branch, fixed conflicts
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
<<<<<<< HEAD
            </Col>
            <Col xs={5} />
            <Col xs={5} />
            {err
              ? (
                <Col xs={2}>
                  <Form.Label id='error' className='error-msg'>
                    Sorry, this username/password combination is not valid. Please try again or try signing up.
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
                Login

              </Button>
            </Col>
            <Col xs={12}>

              <Form.Label>
                <Link to='/signup'>Not a user? Signup here!</Link>
              </Form.Label>

            </Col>

          </Form.Row>


        </Form>
=======
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
        <div>{invalidPassword}</div>
<<<<<<< HEAD
>>>>>>> 9f906ef... [#40] Add client side password validation
=======
>>>>>>> 9f906ef... [#40] Add client side password validation
      </div>

    );
  }
}

export default LoginForm;
