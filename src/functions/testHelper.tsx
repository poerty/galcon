import React from 'react';
import { render } from 'react-testing-library';
import { Store, AnyAction, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import galconApp from 'modules';
import middlewares from 'middlewares';

export function renderWithRedux(
  ui: React.ReactElement<any>,
  options?: {
    initialState?: any,
    store?: Store<any, AnyAction> & { dispatch: {} },
  },
) {
  const initialState = options && options.initialState ? options.initialState : {};
  const store = options && options.store
    ? options.store
    : createStore(galconApp, initialState, applyMiddleware(...middlewares));
  return {
    ...render(<Provider store={store}> {ui} </Provider>),
    // adding `store` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    store,
  };
}
