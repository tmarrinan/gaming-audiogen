import {Scene, GameObjects } from 'phaser';

class GameScene extends Scene {
    constructor() {
        super('scene-game');

        this.textbox = GameObjects.Text || undefined;
    }
  
    create() {
        this.textbox = this.add.text(
            window.innerWidth / 2,
            window.innerHeight / 2,
            'Welcome to Phaser x Vite!',
            {
                color: '#FFFFFF',
                fontFamily: 'monospace',
                fontSize: '26px'
            }
        );
    
        this.textbox.setOrigin(0.5, 0.5);
    }

    update(time, delta) {
        if (!this.textbox) {
            return;
        }
    
        this.textbox.rotation += 0.0005 * delta;
    }
};

export { GameScene };
