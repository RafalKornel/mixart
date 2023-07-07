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
  playerSpeed: 2,
  tileWidth: 16,
  width: 320,
  height: 240,
};
