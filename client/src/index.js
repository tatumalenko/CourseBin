
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'; // don't need to specify localhost url in axios http address
import App from './App';
import Authentication from './Authentication';

// style
import './index.css';

const auth = new Authentication();

ReactDOM.render(
  <BrowserRouter>
    <App auth={auth} />
  </BrowserRouter>,
  document.getElementById('root'),
);
