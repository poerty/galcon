import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { render } from 'react-testing-library';

import Canvas from 'components/Canvas';

import galconApp from 'modules';
import middlewares from 'middlewares';

describe('/Components : Canvas', () => {
  test('renders without crash', () => {
    const store = createStore(galconApp, applyMiddleware(...middlewares));
    const { container } = render((
      <Provider store={store}>
        <Canvas />
      </Provider>
    ));
    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeNull();
  });
});
