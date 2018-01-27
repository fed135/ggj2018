import 'pixi';
import 'p2';
import * as Phaser from 'phaser-ce';
import Tilemap = Phaser.Tilemap;
import TilemapLayer = Phaser.TilemapLayer;
import Graphics = Phaser.Graphics;
import CursorKeys = Phaser.CursorKeys;


let currentDataString: string = '';
let cursors: CursorKeys;

const preload = () => {
	game.load.tilemap('map', 'assets/tile_properties.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('tiles', 'assets/gridtiles.png');
};

const create = () => {
	game.physics.startSystem(Phaser.Physics.ARCADE);

	const map = game.add.tilemap('map');

	map.addTilesetImage('tiles');

	// map.setCollisionBetween(1, 12);

	const layer = map.createLayer('Tile Layer 1');

	layer.resizeWorld();

	//  Our painting marker
	const marker = game.add.graphics();
	marker.lineStyle(2, 0xffffff, 1);
	marker.drawRect(0, 0, 32, 32);

	game.input.addMoveCallback(updateMarker(marker, layer), this);
	game.input.onDown.add(getTileProperties(layer, map), this);

	cursors = game.input.keyboard.createCursorKeys();
};

const getTileProperties = (layer: TilemapLayer, map: Tilemap) => () => {
	const x = layer.getTileX(game.input.activePointer.worldX);
	const y = layer.getTileY(game.input.activePointer.worldY);
	const tile = map.getTile(x, y, layer);

	// Note: JSON.stringify will convert the object tile properties to a string
	currentDataString = JSON.stringify(tile.properties);

	tile.properties.wibble = true;
};

const updateMarker = (marker: Graphics, layer: TilemapLayer) => () => {
	marker.x = layer.getTileX(game.input.activePointer.worldX) * 32;
	marker.y = layer.getTileY(game.input.activePointer.worldY) * 32;
};

const update = () => {
	if (cursors.left.isDown) {
		game.camera.x -= 4;
	}
	else if (cursors.right.isDown) {
		game.camera.x += 4;
	}

	if (cursors.up.isDown) {
		game.camera.y -= 4;
	}
	else if (cursors.down.isDown) {
		game.camera.y += 4;
	}

};

const render = () => {
	if (currentDataString) {
		game.debug.text('Tile properties: ' + currentDataString, 16, 550);
	} else {
		game.debug.text('Click on a tile to reveal the properties of the tile', 16, 550);
	}
};

const game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', {
	preload,
	create,
	update,
	render
});
