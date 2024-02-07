import {Scene, GameObjects } from 'phaser';

class GameScene extends Scene {
    constructor() {
        super('scene-game');

        this.canvas = null;
        this.environments = {
            forest: {
                ground_color: '#4B2F0B',
                sky_color: '#69A9C9'
            },
            cave: {
                ground_color: '#707070',
                sky_color: '#202020'
            }
        }

        // test
        this.textbox = null;
        this.ground = [ // 16 tiles wide
            {height: 0, type: 'forest'},
            {height: 1, type: 'forest'},
            {height: 2, type: 'forest'},
            {height: 2, type: 'forest'},
            {height: 1, type: 'forest'},
            {height: 0, type: 'forest'},
            {height: 0, type: 'cave'},
            {height: 0, type: 'cave'},
            {height: 0, type: 'cave'},
            {height: 0, type: 'cave'},
            {height: 0, type: 'forest'},
            {height: 0, type: 'forest'},
            {height: 0, type: 'forest'},
            {height: 0, type: 'forest'},
            {height: 0, type: 'forest'},
            {height: 0, type: 'forest'}
        ];
    }

    preload() {
        this.canvas = this.sys.game.canvas;

        this.load.image('forest', 'assets/forest-ground.png');
        this.load.image('cave', 'assets/cave-ground.png');
    }
  
    create() {
        this.textbox = this.add.text(
            this.canvas.width / 2,
            this.canvas.height / 2,
            'Welcome to Phaser x Vite!',
            {
                color: '#FFFFFF',
                fontFamily: 'monospace',
                fontSize: '26px'
            }
        );
    
        this.textbox.setOrigin(0.5, 0.5);

        this.ground.forEach((item, index) => {
            let ground_tile = this.add.image(64 * index, this.canvas.height - ((item.height + 1) * 64), item.type);
            ground_tile.setOrigin(0, 0);
        });
    }

    update(time, delta) {
        if (!this.textbox) {
            return;
        }
    
        this.textbox.rotation += 0.0005 * delta;
    }
};

export { GameScene };
