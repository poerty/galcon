import React from 'react';
import { fireEvent } from 'react-testing-library';
import { fromJS } from 'immutable';
import uuidv4 from 'uuidv4';

import { renderWithRedux } from 'functions/testHelper';

import TowerModel, { TowerList } from 'models/tower';

import Tower from 'components/Tower';

import towerInfos from 'datas/tower';

const REAL_AMOUNT_RATIO: number = parseInt(getEnv('REACT_APP_REALAMOUNT_RATIO'), 10);
// const MAX_TOWER_LEVEL: number = parseInt(getEnv('REACT_APP_MAX_TOWER_LEVEL'), 10);

// multiple tower testing will be done in /Layouts : Towers
describe('/Components : Tower', () => {
  const userId = uuidv4();
  const towerId = uuidv4();
  const initialTowerLevel = 1;
  const initialTowerAmount = 20;
  const initialTower = new TowerModel({
    id: towerId,
    ownerId: userId,
    level: initialTowerLevel,
    amount: initialTowerAmount,
    realAmount: initialTowerAmount * REAL_AMOUNT_RATIO,
    style: { top: 200, left: 400 },
  });

  test('renders without crash', () => {
    const initialState = {
      board: fromJS({ towers: new TowerList([initialTower]) }),
      users: fromJS({ id: userId }),
    };
    const { getByTestId } = renderWithRedux(
      (<Tower key={towerId} id={towerId} />),
      { initialState },
    );
    const tower = getByTestId('tower');
    const towerAmount = getByTestId('towerAmount');

    expect(tower).not.toBeNull();
    expect(tower).toBeInTheDocument();
    expect(tower).toContainElement(towerAmount);
    expect(towerAmount).not.toBeNull();
    expect(towerAmount.innerHTML).toBe(initialTowerAmount.toString());
  });

  describe('/Events : mouseDown', () => {
    test('it should set attack from tower when mouseDown', () => {
      const initialState = {
        board: fromJS({
          towers: new TowerList([initialTower]),
          selected: { percentage: 1.0 },
        }),
        users: fromJS({ id: userId }),
      };
      const { getByTestId, store } = renderWithRedux(
        (<Tower key={towerId} id={towerId} />),
        { initialState },
      );
      const tower = getByTestId('tower');

      let selectedFromTowerId = store.getState().board.getIn(['selected', 'from']);
      expect(selectedFromTowerId).not.toBe(towerId);

      // Event : mouseDown
      fireEvent.mouseDown(tower!);

      selectedFromTowerId = store.getState().board.getIn(['selected', 'from']);
      expect(selectedFromTowerId).toBe(towerId);
    });
  });

  describe('/Events : doubleClick', () => {
    test('it should not upgrade tower with not enough(zero) amount', () => {
      const now = Math.floor((new Date()).getTime());
      const amount0Tower = initialTower.setAmount(0, now);

      const initialState = {
        board: fromJS({ towers: new TowerList([amount0Tower]) }),
        users: fromJS({ id: userId }),
      };
      const { getByTestId } = renderWithRedux(
        (<Tower key={towerId} id={towerId} />),
        { initialState },
      );
      const tower = getByTestId('tower');
      const towerAmount = getByTestId('towerAmount');

      expect(tower.className.includes(`tower-${initialTowerLevel}`)).toBeTruthy();
      expect(towerAmount.innerHTML).toBe('0');

      // Event : doubleClick
      fireEvent.doubleClick(tower!);

      expect(tower.className.includes(`tower-${initialTowerLevel}`)).toBeTruthy();
      expect(towerAmount.innerHTML).toBe('0');
    });

    test('it should upgrade tower with enough amount', () => {
      const initialState = {
        board: fromJS({ towers: new TowerList([initialTower]) }),
        users: fromJS({ id: userId }),
      };
      const { getByTestId } = renderWithRedux(
        (<Tower key={towerId} id={towerId} />),
        { initialState },
      );
      const tower = getByTestId('tower');
      const towerAmount = getByTestId('towerAmount');

      expect(tower.className.includes(`tower-${initialTowerLevel}`)).toBeTruthy();
      expect(towerAmount.innerHTML).toBe(initialTowerAmount.toString());

      // Event : doubleClick
      fireEvent.doubleClick(tower!);

      expect(tower.className.includes(`tower-${initialTowerLevel + 1}`)).toBeTruthy();
      const newTowerAmount = initialTowerAmount - towerInfos[initialTowerLevel].upgradeCost;
      expect(towerAmount.innerHTML).toBe(newTowerAmount.toString());
    });
  });
});
