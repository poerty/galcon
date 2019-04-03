import dotenv from 'dotenv';
dotenv.config();

import 'functions/helper';

import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';
import './index.css';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import middlewares from './middlewares';
import galconApp from './modules';

import App from './App';
import * as serviceWorker from './serviceWorker';

const store = createStore(galconApp, {}, applyMiddleware(...middlewares));

ReactDOM.render(
  (
    <Provider store={store}>
      <App />
    </Provider>
  )
  ,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
