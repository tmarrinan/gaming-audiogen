import {Scene, GameObjects } from 'phaser';

class GameScene extends Scene {
    constructor() {
        super('scene-game');

        this.canvas = null;
        this.map = null;
        this.map_layer = null;

        // level (+1 for sky, +2 for ground)
        //  0: cave
        // 12: forest
        // 24: beach
        // 36: grass
        this.level = [ // 16 x 9
            [25, 25, 25, 25, 32, 37, 37, 37, 43, 13, 13, 13, 18, 1, 1, 1],
            [25, 25, 25, 25, 32, 37, 37, 37, 43, 13, 13, 13, 18, 1, 1, 1],
            [25, 25, 25, 25, 32, 37, 37, 37, 43, 13, 13, 13, 18, 1, 1, 1],
            [25, 25, 25, 25, 32, 36, 36, 37, 43, 13, 13, 13, 18, 1, 1, 1],
            [25, 25, 24, 24, 29, 38, 38, 36, 43, 13, 13, 13, 18, 1, 1, 1],
            [24, 24, 26, 26, 35, 38, 38, 38, 40, 13, 13, 13, 18, 1, 1, 1],
            [26, 26, 26, 26, 35, 38, 38, 38, 46, 12, 12, 13, 18, 1, 1, 1],
            [26, 26, 26, 26, 35, 38, 38, 38, 46, 14, 14, 12, 15, 1, 1, 0],
            [26, 26, 26, 26, 35, 38, 38, 38, 46, 14, 14, 14, 21, 0, 0, 2],
        ];
    }

    preload() {
        this.canvas = this.sys.game.canvas;

        this.load.image('tilemap', 'assets/tilemap-gradient.png');
    }
  
    create() {
        this.map = this.make.tilemap({data: this.level, tileWidth: 64, tileHeight: 64});
        const tiles = this.map.addTilesetImage('tilemap');
        this.map_layer = this.map.createLayer(0, tiles, 0, 0);
    }

    update(time, delta) {
        // animation
    }
};

export { GameScene };
