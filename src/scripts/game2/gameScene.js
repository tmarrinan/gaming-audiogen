import { Scene, Physics } from 'phaser';

const Matter = Physics.Matter.Matter;

class GameScene extends Scene {
    constructor(config) {
        super(config);

        this.canvas = null;
    }

    preload() {
        this.canvas = this.sys.game.canvas;

        console.log(Matter.Body);
        console.log(Matter.Bodies);
    }
  
    create() {

    }

    update(time, delta) {

    }
};

export { GameScene };
