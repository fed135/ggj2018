export default {
  width: 8,
  tileWidth: 100,
  tileHeight: 100,
  tiles: {
    0: './assets/sprites/mushroom.png',
    1: './assets/sprites/start.png',
    2: './assets/sprites/end.png',
    3: './assets/sprites/trap1.png',
    4: './assets/sprites/trap2.png',
    5: './assets/sprites/trap3.png',
    6: './assets/sprites/trap4.png',
    7: './assets/sprites/trap5.png',
    8: './assets/sprites/bg.png',
    9: './assets/sprites/block.png',
  },

  map: [
    0, 2, 3, 4, 5, 6, 7, 8,
    1, 8, 9, 8, 8, 8, 9, 8,
    8, 8, 8, 8, 8, 8, 8, 8,
	8, 8, 8, 8, 3, 9, 8, 6,
    8, 8, 8, 8, 8, 8, 8, 8,
	8, 5, 9, 8, 8, 8, 8, 8,
    8, 8, 8, 8, 8, 8, 7, 8,
	9, 8, 8, 4, 8, 8, 8, 8,
    8, 8, 8, 8, 9, 8, 8, 2,
  ],
}