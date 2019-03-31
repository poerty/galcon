import dotenv from 'dotenv';
dotenv.config();

import 'functions/helper';

import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import galconApp from './reducers';
import thunk from 'redux-thunk';

import App from './App';

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

describe('Counter', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      (
        <Provider store={store}>
          <App />
        </Provider>
      )
      , div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
