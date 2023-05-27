export const setupCanvas = (canvasElement: HTMLCanvasElement) => {
  canvasElement.width = 640;
  canvasElement.height = 480;

  const ctx = canvasElement.getContext("2d");

  ctx?.ellipse(20, 30, 10, 15, 1, 1, 3);
};
