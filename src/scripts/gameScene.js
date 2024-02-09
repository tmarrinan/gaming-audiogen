import {Scene, GameObjects } from 'phaser';

class GameScene extends Scene {
    constructor() {
        super('scene-game');

        this.canvas = null;
        this.graphics = null;
        this.background = [
            0xACD4F2,
            0x4E8BCC,
            0x483E87
        ];
        this.platforms = null;
        this.platform_gameobjects = [];
    }

    preload() {
        this.canvas = this.sys.game.canvas;
        this.load.image('platform', 'assets/platform-ninepatch.png');
    }
  
    create() {
        this.graphics = this.add.graphics();
        this.redrawGradient();

        let ground = this.add.nineslice(this.canvas.width / 2, this.canvas.height - 32, 'platform', 0, this.canvas.width, 64, 14, 14, 14, 14);
        ground.tint = 0xFF0000;
        this.platform_gameobjects.push(ground);
        this.platform_gameobjects.push(this.add.nineslice(400, 110, 'platform', 0, 200, 32, 14, 14, 14, 14));
        this.platform_gameobjects.push(this.add.nineslice(50, 250, 'platform', 0, 50, 32, 14, 14, 14, 14));
        this.platform_gameobjects.push(this.add.nineslice(750, 220, 'platform', 0, 100, 32, 14, 14, 14, 14));


        this.platforms = this.physics.add.staticGroup();
        this.platforms.addMultiple(this.platform_gameobjects);
    }

    update(time, delta) {
        
    }

    redrawGradient() {
        this.graphics.clear();
        let start_color, end_color, start_y;
        let num_sections = this.background.length - 1;
        let section_height = this.canvas.height / num_sections;
        for (let i = 0; i < num_sections; i++) {
            start_color = this.background[i];
            end_color = this.background[i + 1];
            start_y = i * section_height;
            this.graphics.fillGradientStyle(start_color, start_color, end_color, end_color, 1);
            this.graphics.fillRect(0, start_y, this.canvas.width, section_height);
        }
    }
};

export { GameScene };
