require('dotenv').config();

import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';
import './index.css';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import galconApp from './reducers';
import thunk from 'redux-thunk';

import App from './App';
import * as serviceWorker from './serviceWorker';


function addUserId({ getState }: { getState: Function }) {
  return (next: Function) => (action: any) => {
    // add userId to all action
    action.userId = getState().users.get('id');
    const returnValue = next(action);
    return returnValue;
  };
}

function addTimeStamp() {
  return (next: Function) => (action: any) => {
    // add timestamp:now to all action
    action.now = (new Date()).getTime() / 1000;
    const returnValue = next(action);
    return returnValue;
  };
}

const store = createStore(
  galconApp,
  applyMiddleware(addUserId, addTimeStamp, thunk)
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
