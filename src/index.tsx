import dotenv from 'dotenv';
dotenv.config();

import 'functions/helper';

import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';
import './index.css';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import galconApp from './modules';
import thunk from 'redux-thunk';

import App from './App';
import * as serviceWorker from './serviceWorker';

function addUserId({ getState }: { getState: () => any }) {
  return (next: (action: any) => any) => (action: any) => {
    // add userId to all action
    action.userId = getState().users.get('id');
    const returnValue = next(action);
    return returnValue;
  };
}

function addTimeStamp() {
  return (next: (action: any) => any) => (action: any) => {
    // add timestamp:now to all action
    if (!action.now) {
      action.now = Math.floor((new Date()).getTime());
    }
    const returnValue = next(action);
    return returnValue;
  };
}

const store = createStore(
  galconApp,
  applyMiddleware(addUserId, addTimeStamp, thunk),
);

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
