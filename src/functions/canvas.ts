const clear = (ctx: any) => {
  ctx.clearRect(0, 0, getEnv('REACT_APP_BOARD_SIZE'), getEnv('REACT_APP_BOARD_SIZE'));
};

const drawPoints = (ctx: any, points: any) => {

  // erase what is on the canvas currently
  // ctx.clearRect(0, 0, getEnv('REACT_APP_BOARD_SIZE'), getEnv('REACT_APP_BOARD_SIZE'));

  // draw each point as a rectangle
  points.forEach((point: any) => {
    ctx.fillStyle = point.color;
    ctx.fillRect(point.x, point.y, getEnv('REACT_APP_PIXEL_SIZE'), getEnv('REACT_APP_PIXEL_SIZE'));
  });
};

const fixCanvasPixel = (canvas: any) => {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const bsr = ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio || 1;
  const ratio = dpr / bsr;
  canvas.width = parseInt(getEnv('REACT_APP_BOARD_SIZE'), 10) * ratio;
  canvas.height = parseInt(getEnv('REACT_APP_BOARD_SIZE'), 10) * ratio;
  canvas.style.width = `${getEnv('REACT_APP_BOARD_SIZE')}px`;
  canvas.style.height = `${getEnv('REACT_APP_BOARD_SIZE')}px`;
  canvas.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0);
};

const getControllPoints = (
  amount: number,
  startPoint: { x: number; y: number },
  endPoint: { x: number; y: number },
  distance: number) => {
  const yDistance = endPoint.y - startPoint.y;
  const xDistance = endPoint.x - startPoint.x;
  const dDistance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
  const controllPoints = [];
  for (let i = -distance * (amount - 1) / 2; i <= distance * (amount - 1) / 2; i += distance) {
    controllPoints.push({
      color: 'red',
      x: (startPoint.x + endPoint.x) / 2 + i * yDistance / dDistance,
      y: (startPoint.y + endPoint.y) / 2 - i * xDistance / dDistance,
    });
  }
  return controllPoints;
};

export {
  clear,
  drawPoints,
  fixCanvasPixel,
  getControllPoints,
};
