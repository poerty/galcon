const clear = (canvas) => {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, process.env.REACT_APP_BOARD_SIZE, process.env.REACT_APP_BOARD_SIZE);
};

const drawPoints = (canvas, points) => {
  // canvas.getContext('2d').fillRect(20, 20, 100, 100);
  const ctx = canvas.getContext('2d');

  // erase what is on the canvas currently
  // ctx.clearRect(0, 0, process.env.REACT_APP_BOARD_SIZE, process.env.REACT_APP_BOARD_SIZE);

  // draw each point as a rectangle
  points.forEach(point => {
    ctx.fillStyle = point.color;
    ctx.fillRect(point.x, point.y, process.env.REACT_APP_PIXEL_SIZE, process.env.REACT_APP_PIXEL_SIZE);
  });
};

export {
  clear,
  drawPoints,
};