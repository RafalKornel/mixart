export enum BackgroundTile {
  Background = "Background",
  Layer1 = "1",
  Layer2 = "2",
  Layer3 = "3",
  Layer4 = "4",
  Layer5 = "5",
  Layer6 = "6",
  Layer7 = "7",
  Layer8 = "8",
  Foreground = "Foreground",

  // Far = "far",
  // Close = "close"
}

export const backgroundTiles = Object.values(BackgroundTile);

export const gameSettings = {
  playerSpeed: 1.5,
  jumpForce: -0.2,
  attackForce: -0.015,
  catFriction: 0,
  catFrictionAir: 0.05,
  catMass: 10,
  tileWidth: 16,
  width: 320,
  height: 240,

  isFullscreen: true,
  defaultWidth: 320 * 4,
  defaultHeight: 240 * 4,
  // gravity: 500,
  // jumpVelocity: 450,
  // strafeVelocity: 200,
  // platformDistance: 110,
  // platformOffset: 10,
  // joystickModifier: 0.1,
};
