import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { render } from 'react-testing-library';
import { fromJS } from 'immutable';
import uuidv4 from 'uuidv4';

import ObjectList from 'models/objectList';
import TowerModel from 'models/tower';

import Tower from 'components/Tower';

import galconApp from 'modules';
import middlewares from 'middlewares';

const REAL_AMOUNT_RATIO: number = parseInt(getEnv('REACT_APP_REALAMOUNT_RATIO'), 10);

describe('/Components : Tower', () => {
  test('renders without crash', () => {
    const userId = uuidv4();
    const towerId = uuidv4();
    const initialState = {
      board: fromJS({
        towers: new ObjectList([{
          id: towerId,
          ownerId: userId,
          level: 1,
          amount: 5,
          realAmount: 5 * REAL_AMOUNT_RATIO,
          style: { top: 200, left: 400 },
        }], TowerModel),
      }),
      users: fromJS({ id: userId }),
    };
    const store = createStore(galconApp, initialState, applyMiddleware(...middlewares));
    const { container } = render((
      <Provider store={store}>
        <Tower key={towerId} id={towerId} />
      </Provider>
    ));
    const tower = container.querySelector('.tower');
    expect(tower).not.toBeNull();
  });
});
