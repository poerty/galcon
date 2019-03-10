const clear = (ctx) => {
  ctx.clearRect(0, 0, process.env.REACT_APP_BOARD_SIZE, process.env.REACT_APP_BOARD_SIZE);
};

const drawPoints = (ctx, points) => {

  // erase what is on the canvas currently
  // ctx.clearRect(0, 0, process.env.REACT_APP_BOARD_SIZE, process.env.REACT_APP_BOARD_SIZE);

  // draw each point as a rectangle
  points.forEach(point => {
    ctx.fillStyle = point.color;
    ctx.fillRect(point.x, point.y, process.env.REACT_APP_PIXEL_SIZE, process.env.REACT_APP_PIXEL_SIZE);
  });
};

const fixCanvasPixel = (canvas) => {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const bsr = ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio || 1;
  const ratio = dpr / bsr;
  canvas.width = process.env.REACT_APP_BOARD_SIZE * ratio;
  canvas.height = process.env.REACT_APP_BOARD_SIZE * ratio;
  canvas.style.width = `${process.env.REACT_APP_BOARD_SIZE}px`;
  canvas.style.height = `${process.env.REACT_APP_BOARD_SIZE}px`;
  canvas.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0);
};

const getControllPoints = (amount, startPoint, endPoint, distance) => {
  const yDistance = endPoint.y - startPoint.y;
  const xDistance = endPoint.x - startPoint.x;
  const dDistance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
  const controllPoints = [];
  for (let i = -distance * (amount - 1) / 2; i <= distance * (amount - 1) / 2; i += distance) {
    controllPoints.push({
      x: (startPoint.x + endPoint.x) / 2 + i * yDistance / dDistance,
      y: (startPoint.y + endPoint.y) / 2 - i * xDistance / dDistance,
      color: 'red',
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