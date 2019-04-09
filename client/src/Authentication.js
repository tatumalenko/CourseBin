import axios from 'axios';

export default class Authentication {
  authenticated = false;

  username = null;

  getUser = (cb) => {
    axios.get('/user').then((response) => {
      if (response.data.user) {
        this.authenticated = true;
        this.username = response.data.user.username;
      } else {
        this.authenticated = false;
        this.username = null;
      }
    }).catch((error) => {
      console.error(error);
      this.authenticated = false;
      this.username = null;
    }).finally(() => {
      cb();
    });
  }

  signup = ({ username, password }, cb) => {
    axios.post('/user/', {
      username,
      password,
    })
      .then((response) => {
        if (!response.data.errmsg) {
          cb();
        }
      }).catch((error) => {
        cb(error.response);
      });
  }

  login = ({ username, password }, cb) => {
    axios
      .post('/user/login', {
        username,
        password,
      }).then((response) => {
        if (response.status === 200) {
          this.authenticated = true;
          this.username = response.data.username;
          cb(null);
        }
      }).catch((error) => {
        this.authenticated = false;
        this.username = null;
        cb(error);
      });
  }

  logout = (cb) => {
    axios.post('/user/logout').then((response) => {
      if (response.status === 200) {
        this.authenticated = false;
        this.username = null;
        cb();
      }
    }).catch((error) => {
      console.log('Logout error', error);
    });
  }

  isAuthenticated = () => this.authenticated;
}
