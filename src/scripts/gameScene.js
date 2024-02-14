import { Scene } from 'phaser';

// Levels - note: player jump apporx 96 high
import Level1 from './level1';
import Level2 from './level2';
import Level3 from './level3';


class GameScene extends Scene {
    constructor(config) {
        super(config);

        this.current_level = 0;
        this.mode = 'game';

        this.canvas = null;
        this.finished = false;
        this.levels = [
            Level1,
            Level2,
            Level3,
            null
        ];
        this.cursors = null;
        this.graphics = null;
        this.platforms = null;
        this.platform_gameobjects = [];
        this.goal = null;
        this.player = null;
        this.animations = [];
        this.textbox_bg = null
        this.textbox = null;
        this.done_overlay = {bg: null, text: null};

        this.editor = {
            background: [
                0xFFFFFF,
                0x000000
            ]
        }
    }

    preload() {
        this.canvas = this.sys.game.canvas;
        this.load.image('platform', 'assets/platform-ninepatch.png');
        this.load.image('goal', 'assets/goal.png');
        this.load.spritesheet('dude', 'assets/dude.png', {frameWidth: 32, frameHeight: 48});
    }
  
    create() {
        // Game not over
        this.finished = false;

        // Disable collisions with bottom
        this.physics.world.checkCollision.down = false;

        // Initialize keyboard input
        this.cursors = this.input.keyboard.createCursorKeys();

        // Create background graphics (gradient)
        this.graphics = this.add.graphics();
        this.redrawGradient(this.levels[this.current_level].background);

        // Create platforms
        this.levels[this.current_level].platforms.forEach((p) => {
            let x = (typeof p.x === 'string') ? this.canvas.width * (parseFloat(p.x.substring(0, p.x.length - 1)) / 100.0) : p.x;
            let w = (typeof p.w === 'string') ? this.canvas.width * (parseFloat(p.w.substring(0, p.w.length - 1)) / 100.0) : p.w;
            let platform = this.add.nineslice(x + (w / 2), this.canvas.height - (p.y + (p.h / 2)), 'platform', 0, w, p.h, 14, 14, 14, 14);
            platform.tint = p.color;
            this.platform_gameobjects.push(platform);
        });

        this.platforms = this.physics.add.staticGroup();
        this.platforms.addMultiple(this.platform_gameobjects);

        // Create goal
        let goal_pos = this.levels[this.current_level].goal;
        this.goal = this.physics.add.staticImage(goal_pos.x + 16, this.canvas.height - (goal_pos.y + 32), 'goal', 0);
        this.goal.setSize(2, 2);

        // Create player
        this.player = this.physics.add.sprite(100, 475, 'dude');
        this.player.setSize(24, 48);
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.animations.push(this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        }));

        this.animations.push(this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        }));

        this.animations.push(this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        }));

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.overlap(this.player, this.goal, this.goalReached, null, this);

        // Text (win / game over)
        this.done_overlay.bg = this.add.rectangle(this.canvas.width / 2, this.canvas.height / 2, this.canvas.width, this.canvas.height, 0x282828, 1.0);
        this.done_overlay.bg.visible = false;
        const font = {
            color: '#FFFFFF',
            fontFamily: 'monospace',
            fontSize: '64px'
        };
        this.done_overlay.text = this.add.text(this.canvas.width / 2, this.canvas.height / 2, '', font);
        this.done_overlay.text.setOrigin(0.5, 0.5);
        this.done_overlay.text.visible = false;

        this.done_overlay.fade = this.add.tween({
            targets: [
                this.done_overlay.bg,
                this.done_overlay.text
            ],
            duration: 1000,
            alpha: {
                getStart: () => { return 0.0; },
                getEnd: () => { return 0.95; },
            },
            repeat: 0,
            paused: true
        });
    }

    update(time, delta) {
        if (this.mode === 'game' && !this.finished) {
            let time_s = time / 1000;

            // Goal animation
            let goal_pos = this.levels[this.current_level].goal;
            let x = (goal_pos.x + 16) + (2 * Math.cos(time_s * 2 * Math.PI));
            let y = (this.canvas.height - (goal_pos.y + 32)) + (2 * Math.sin(time_s * 2 * Math.PI));
            this.goal.x = x;
            this.goal.y = y;

            // Player - keyboard controls
            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-160);
                this.player.anims.play('left', true);
            }
            else if (this.cursors.right.isDown) {
                this.player.setVelocityX(160);
                this.player.anims.play('right', true);
            }
            else {
                this.player.setVelocityX(0);
                this.player.anims.play('turn');
            }

            if (this.cursors.space.isDown && this.player.body.touching.down) {
                this.player.setVelocityY(-450);
            }

            // Game over
            if (this.player.y > this.canvas.height) {
                this.gameOver();
            }
        }
        else if (this.mode === 'editor') {

        }
    }

    launchEditor() {
        this.mode = 'editor';
        this.clearAssets();

        this.graphics = this.add.graphics();
        this.redrawGradient(this.editor.background);
    }

    restart(level) {
        if (this.levels[level] !== null) {
            // Set level
            this.mode = 'game';
            this.current_level = level;

            // Clear old level assets
            this.clearAssets();

            // Restart
            this.scene.restart();
        }
        else {
            alert('Error: level not created');
        }
    }

    clearAssets() {
        this.graphics.destroy();

        for (let platform of this.platform_gameobjects) {
            platform.destroy();
        }
        this.platform_gameobjects = [];
        
        this.platforms.destroy();

        this.goal.destroy();

        for (let animation of this.animations) {
            animation.destroy();
        }
        this.animations = [];

        this.player.destroy();

        this.done_overlay.bg.destroy();
        this.done_overlay.text.destroy();
    }

    redrawGradient(background) {
        this.graphics.clear();
        let start_color, end_color, start_y;
        let num_sections = background.length - 1;
        let section_height = this.canvas.height / num_sections;
        for (let i = 0; i < num_sections; i++) {
            start_color = background[i];
            end_color = background[i + 1];
            start_y = i * section_height;
            this.graphics.fillGradientStyle(start_color, start_color, end_color, end_color, 1);
            this.graphics.fillRect(0, start_y, this.canvas.width, section_height);
        }
    }

    goalReached() {
        if (!this.finished) {
            this.finished = true;
            console.log('Made it! Finshed level: ' + (this.current_level + 1));

            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
            this.player.anims.play('turn');

            this.done_overlay.text.style.color = '#FFFFFF';
            this.done_overlay.text.text = 'Winner!';
            this.done_overlay.fade.play();
            setTimeout(() => {
                this.done_overlay.bg.visible = true;
                this.done_overlay.text.visible = true;
            }, 50);
        }
    }

    gameOver() {
        if (!this.finished) {
            this.finished = true;
            console.log('Game over! Failed level: ' + (this.current_level + 1));

            this.done_overlay.text.style.color = '#A8231F';
            this.done_overlay.text.text = 'Game Over!';
            this.done_overlay.fade.play();
            setTimeout(() => {
                this.done_overlay.bg.visible = true;
                this.done_overlay.text.visible = true;
            }, 50);
        }
    }

    setEditorBackground(background) {
        this.editor.background = [];
        background.forEach((color) => {
            this.editor.background.push(parseInt(color.substring(1), 16));
        });
        this.redrawGradient(this.editor.background);
    }
};

export { GameScene };
