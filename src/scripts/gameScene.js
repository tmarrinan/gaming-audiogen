import { Scene } from 'phaser';

// Levels - note: player jump apporx 96 high
const levels = [
    {
        background: [
            0x291C61,
            0x592880,
            0xE37C2D
        ],
        platforms: [
            // ground
            {x: 0, y: 0, w: '100%', h: 64, color: 0x287C40},
            // platforms
            {x: 224, y: 160, w: 64, h: 32, color: 0xC2C2C2},
            {x: 384, y: 192, w: 192, h: 32, color: 0xC2C2C2},
            {x: 672, y: 128, w: 128, h: 32, color: 0xC2C2C2},
            {x: 96, y: 192, w: 32, h: 32, color: 0xC2C2C2},
            {x: 0, y: 288, w: 64, h: 32, color: 0xC2C2C2},
            {x: 128, y: 384, w: 96, h: 32, color: 0xC2C2C2},
            {x: 352, y: 384, w: 192, h: 32, color: 0xC2C2C2},
            {x: 672, y: 416, w: 192, h: 32, color: 0xC2C2C2},
        ],
        goal: {x: 832, y: 480}
    },
    {
        background: [
            0xACD4F2,
            0x4E8BCC,
            0x483E87
        ],
        platforms: [
            // ground
            {x: 0, y: 0, w: '50%', h: 64, color: 0xF2E6A0},
            {x: '80%', y: 0, w: '20%', h: 64, color: 0xF2E6A0},
            // tree
            {x: 225, y: 64, w: 32, h: 32, color: 0x875810},
            {x: 225, y: 96, w: 32, h: 32, color: 0x875810},
            {x: 225, y: 128, w: 32, h: 32, color: 0x875810},
            {x: 161, y: 128, w: 32, h: 32, color: 0x1b7a21},
            {x: 193, y: 160, w: 32, h: 32, color: 0x1b7a21},
            {x: 225, y: 160, w: 32, h: 32, color: 0x1b7a21},
            {x: 257, y: 160, w: 32, h: 32, color: 0x1b7a21},
            {x: 289, y: 128, w: 32, h: 32, color: 0x1b7a21},
            // cloud
            {x: 442, y: 212, w: 141, h: 32, color: 0xFFFFFF},
            {x: 410, y: 180, w: 205, h: 32, color: 0xFFFFFF},
            // cloud
            {x: 762, y: 244, w: 91, h: 32, color: 0xFFFFFF},
            {x: 730, y: 212, w: 155, h: 32, color: 0xFFFFFF},
            // waterfall
            {x: 960, y: 160, w: 32, h: 256, color: 0x6BCBE8},
            {x: 992, y: 416, w: 32, h: 32, color: 0x6BCBE8},
            // rocks
            {x: 992, y: 128, w: 32, h: 288, color: 0x595c57},
            {x: 928, y: 128, w: 64, h: 32, color: 0x595c57}
        ],
        goal: {x: 992, y: 64}
    },
    {
        background: [
            0x0E0E0E,
            0x101010,
            0x121212,
            0x141414,
            0x161616,
            0x181818,
            0x1A1A1A,
            0x1C1C1C,
            0x421F1A,
            0x381105,
            0x703F23,
            0x381105,
            0x1C1C1C,
            0x1A1A1A
        ],
        platforms: [
            // ground
            {x: 0, y: 0, w: '45%', h: 64, color: 0xE2E2E2},
            {x: '55%', y: 0, w: '45%', h: 64, color: 0xE2E2E2},
            // skull
            {x: 352, y: 416, w: 32, h: 96, color: 0xE2E2E2},
            {x: 640, y: 416, w: 32, h: 96, color: 0xE2E2E2},
            {x: 384, y: 512, w: 256, h: 32, color: 0xE2E2E2},
            {x: 424, y: 192, w: 32, h: 128, color: 0xE2E2E2},
            {x: 496, y: 192, w: 32, h: 128, color: 0xE2E2E2},
            {x: 568, y: 192, w: 32, h: 128, color: 0xE2E2E2},
            {x: 416, y: 384, w: 64, h: 32, color: 0xE2E2E2},
            {x: 416, y: 448, w: 64, h: 32, color: 0xE2E2E2},
            {x: 432, y: 416, w: 32, h: 32, color: 0xE2E2E2},
            {x: 544, y: 384, w: 64, h: 32, color: 0xE2E2E2},
            {x: 544, y: 448, w: 64, h: 32, color: 0xE2E2E2},
            {x: 560, y: 416, w: 32, h: 32, color: 0xE2E2E2},
            // rocks
            {x: 288, y: 224, w: 32, h: 32, color: 0xE2E2E2},
            // stalactites (on cieling)
            {x: 0, y: 544, w: '100%', h: 32, color: 0xE2E2E2},
            {x: 800, y: 512, w: 32, h: 32, color: 0xE2E2E2},
            {x: 832, y: 416, w: 32, h: 128, color: 0xE2E2E2},
            {x: 864, y: 480, w: 32, h: 64, color: 0xE2E2E2},
            // stalagmites (on ground)
            {x: 128, y: 64, w: 32, h: 64, color: 0xE2E2E2},
            {x: 160, y: 64, w: 32, h: 128, color: 0xE2E2E2},
            {x: 192, y: 64, w: 32, h: 32, color: 0xE2E2E2},
            // torches
            {x: 0, y: 64, w: 32, h: 64, color: 0x592E04},
            {x: 0, y: 128, w: 32, h: 32, color: 0xDEA035},
            {x: 384, y: 64, w: 32, h: 64, color: 0x592E04},
            {x: 384, y: 128, w: 32, h: 32, color: 0xDEA035},
            {x: 608, y: 64, w: 32, h: 64, color: 0x592E04},
            {x: 608, y: 128, w: 32, h: 32, color: 0xDEA035},
            {x: 896, y: 64, w: 32, h: 64, color: 0x592E04},
            {x: 896, y: 128, w: 32, h: 32, color: 0xDEA035},
        ],
        goal: {x: 960, y: 64}
    }
]

class GameScene extends Scene {
    constructor(config) {
        super(config);

        this.current_level = 0;

        this.canvas = null;
        this.finished = false;
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
        this.redrawGradient();

        // Create platforms
        levels[this.current_level].platforms.forEach((p) => {
            let x = (typeof p.x === 'string') ? this.canvas.width * (parseFloat(p.x.substring(0, p.x.length - 1)) / 100.0) : p.x;
            let w = (typeof p.w === 'string') ? this.canvas.width * (parseFloat(p.w.substring(0, p.w.length - 1)) / 100.0) : p.w;
            let platform = this.add.nineslice(x + (w / 2), this.canvas.height - (p.y + (p.h / 2)), 'platform', 0, w, p.h, 14, 14, 14, 14);
            platform.tint = p.color;
            this.platform_gameobjects.push(platform);
        });

        this.platforms = this.physics.add.staticGroup();
        this.platforms.addMultiple(this.platform_gameobjects);

        // Create goal
        let goal_pos = levels[this.current_level].goal;
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
        if (!this.finished) {
            let time_s = time / 1000;

            // Goal animation
            let goal_pos = levels[this.current_level].goal;
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
    }

    restart(level) {
        // Set level
        this.current_level = level;

        // Clear old level assets
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

        // Restart
        this.scene.restart();
    }

    redrawGradient() {
        this.graphics.clear();
        let start_color, end_color, start_y;
        let background = levels[this.current_level].background;
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
            console.log(this.done_overlay.text.style.color);
            this.done_overlay.fade.play();
            setTimeout(() => {
                this.done_overlay.bg.visible = true;
                this.done_overlay.text.visible = true;
            }, 50);
        }
    }
};

export { GameScene };
