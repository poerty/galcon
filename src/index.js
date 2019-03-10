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

require('dotenv').config();

function addUserId({ getState }) {
  return next => action => {
    // add userId to all action
    action.userId = getState().users.get('id');
    const returnValue = next(action);
    return returnValue;
  };
}

const store = createStore(
  galconApp,
  applyMiddleware(addUserId, thunk)
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
