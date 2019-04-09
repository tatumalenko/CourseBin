import React, { Component } from 'react';
import {
  Route, Switch, Link, Redirect,
} from 'react-router-dom';

import Signup from './components/sign-up';
import LoginForm from './components/login-form';
import Navbar from './components/navbar';
import Home from './components/home';
import Profile from './components/dashboard';
import StudentForm from './components/student-form';

import concordiaLogo from './assets/concordia-logo.jpeg';

class App extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
  }

  async componentDidMount() {
    this.props.auth.getUser(() => { this.forceUpdate(); });
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { auth } = this.props;
    console.log('apprender', auth);
    if (!this._isMounted) {
      // Show nothing while auth makes async calls
      return <div />;
    }

    return (
      <div className='App'>
        <Navbar auth={auth} forceAppUpdate={() => { this.forceUpdate(); }} />

        <Switch>
          <Route path='/login' render={props => <LoginForm auth={auth} {...props} />} />
          <Route path='/signup' render={props => <Signup auth={auth} {...props} />} />
          <PrivateRoute exact path='/' auth={auth} component={Home} />
          <PrivateRoute path='/planner' auth={auth} component={StudentForm} />
          <PrivateRoute path='/dashboard' auth={auth} component={Profile} />
          <Route path='*' component={() => '404 NOT FOUND'} />
        </Switch>

        <div className='home-bottom'>
          <img src={concordiaLogo} alt='Concordia University' />
        </div>

        <div>
          {JSON.stringify(this.props.auth)}
          {JSON.stringify(this.state)}
        </div>
      </div>
    );
  }
}

const PrivateRoute = ({
  component: Component, auth, ...rest
}) => (
  <Route
    {...rest}
    render={props => (auth.isAuthenticated() ? (
      <Component {...props} />
    ) : (
      <Redirect
        to={{ pathname: '/login', state: { from: props.location } }}
      />
    ))}
  />
);

export default App;
