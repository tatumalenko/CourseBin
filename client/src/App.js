import React, { Component } from 'react';
import axios from 'axios';
import { Route, Link } from 'react-router-dom';

import Signup from './components/sign-up';
import LoginForm from './components/login-form';
import Navbar from './components/navbar';
import Home from './components/home';

class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false,
      username: null,
    };

    this.getUser = this.getUser.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  componentDidMount() {
    this.getUser();
  }


  getUser() {
    axios.get('/user/').then((response) => {
      console.log('Get user response: ');
      console.log(response.data);
      if (response.data.user) {
        console.log('Get User: There is a user saved in the server session: ');

        this.setState({
          loggedIn: true,
          username: response.data.user.username,
        });
      } else {
        console.log('Get user: no user');
        this.setState({
          loggedIn: false,
          username: null,
        });
      }
    });
  }

  updateUser(userObject) {
    this.setState(userObject);
  }

  render() {
    const { state, updateUser, signup } = this;
    return (
      <div className='App'>

        <Navbar updateUser={updateUser} loggedIn={state.loggedIn} />
        {/* greet user if logged in: */}
        {state.loggedIn
          && (
          <p>
Join the party,
            {' '}
            {state.username}
!
          </p>
          )
        }
        {/* Routes to different components */}
        <Route
          exact
          path='/'
          component={Home}
        />
        <Route
          path='/login'
          render={() => (
            <LoginForm
              updateUser={updateUser}
            />
          )}
        />
        <Route
          path='/signup'
          render={() => (
            <Signup
              signup={signup}
            />
          )}
        />

      </div>
    );
  }
}

export default App;
