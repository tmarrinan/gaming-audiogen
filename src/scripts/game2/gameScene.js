import { Scene } from 'phaser';

class GameScene extends Scene {
    constructor(config) {
        super(config);

        this.canvas = null;
    }

    preload() {
        this.canvas = this.sys.game.canvas;
    }
  
    create() {

    }

    update(time, delta) {

    }
};

