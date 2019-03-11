import React, { Component } from 'react';
import axios from 'axios';
import { Route, Link } from 'react-router-dom';

import Signup from './components/sign-up';
import LoginForm from './components/login-form';
import Navbar from './components/navbar';
import Home from './components/home';

import concordiaLogo from './assets/concordia-logo.jpeg';

class App extends Component {
  constructor() {
    super();
    //must set state to null otherwise UI will load prematurely before server response
    this.state = null;

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

      console.log("SHOULD RELOAD PAGE HERE");
    });
  }

  updateUser(userObject) {
    this.setState(userObject);
  }

  render() {
    const { state, updateUser, signup } = this;

    if (!this.state) {
      //show nothing while waiting for axios response
      return <div />
    }
    return (
      <div className='App'>

        <Navbar updateUser={updateUser} loggedIn={state.loggedIn} />
        {/* greet user if logged in: */}
        {state.loggedIn
          && (

            <Home />
          )
        }
        {/* Routes to different components */}
        {!state.loggedIn && (
          <Route
            exact
            path='/'
            render={() => (
              <LoginForm
                updateUser={updateUser}
              />
            )}
          />
        )
        }
        <Route
          path='/signup'
          component={Signup}
          render={() => (
            <Signup
              signup={signup}
            />
          )}
        />

        <div className="home-bottom">
          <img src={concordiaLogo} alt="Concordia University"></img>
        </div>
      </div>
    );
  }
}

export default App;
