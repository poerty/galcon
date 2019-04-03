import React from 'react';

import { renderWithRedux } from 'functions/testHelper';

import Canvas from 'components/Canvas';

describe('/Components : Canvas', () => {
  test('renders without crash', () => {
    const { container } = renderWithRedux((<Canvas />));
    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeNull();
  });
});
