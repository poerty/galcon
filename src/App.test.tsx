import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { render } from 'react-testing-library';

import galconApp from './modules';
import middlewares from './middlewares';

import App from './App';

describe('Components : App', () => {
  test('renders without crash', () => {
    const store = createStore(galconApp, applyMiddleware(...middlewares));
    render(
      (
        <Provider store={store}>
          <App />
        </Provider>
      ),
    );
  });
});
