import { Scene } from 'phaser';

// Levels - note: player jump apporx 96 high
import Level1 from './level1';
import Level2 from './level2';
import Level3 from './level3';
// background color to "mood" description
import { ColorArrayToMoodDescription } from './color2mood'


class GameScene extends Scene {
    constructor(config) {
        super(config);

        this.current_level = 0;
        this.mode = 'game';
        this.musicgen_mode = 'image';

        this.canvas = null;
        this.finished = false;
        this.levels = [
            Level1,
            Level2,
            Level3,
            null
        ];
        this.music = null;
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
            ],
            goal_pos: {x: 0, y: 0},
            platform_gameobjects: [],
            selected: null,
            prev_selected: null,
            change_callback: null
        }
    }

    preload() {
        this.canvas = this.sys.game.canvas;
        this.load.image('platform', 'assets/platform-ninepatch.png');
        this.load.image('selection', 'assets/selection-ninepatch.png');
        this.load.image('goal', 'assets/goal.png');
        this.load.spritesheet('dude', 'assets/dude.png', {frameWidth: 32, frameHeight: 48});

        this.load.audio('music-grass', ['assets/grasslands_loop.wav']);
        this.load.audio('music-beach', ['assets/beach_loop.wav']);
        this.load.audio('music-cave', ['assets/cave_loop.wav']);
    }
  
    create() {
        // Game not over
        this.finished = false;

        // Load audio
        const music_tracks = ['music-grass', 'music-beach', 'music-cave', 'music-beach'];
        this.music = this.sound.add(music_tracks[this.current_level]);
        this.music.loop = true;
        this.music.play();

        // Disable collisions with bottom
        this.physics.world.checkCollision.down = false;

        // Initialize keyboard input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.on('pointerdown', this.onPointerDown, this);
        this.input.on('pointerup', this.onPointerUp, this);
        this.input.on('pointermove', this.onPointerMove, this);

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

    setEditorChangeCallback(editor_change_callback) {
        this.editor.change_callback = editor_change_callback;
    }

    launchEditor(goal_grid) {
        this.mode = 'editor';
        this.clearAssets();
        this.resetEditor();

        this.graphics = this.add.graphics();
        this.redrawGradient(this.editor.background);

        this.editor.goal_pos.x = goal_grid.x * 8;
        this.editor.goal_pos.y = goal_grid.y * 8;
        this.goal = this.add.image(this.editor.goal_pos.x + 16, this.canvas.height - (this.editor.goal_pos.y + 32), 'goal', 0);
        this.goal.depth = 500;
    }

    onPointerDown(pointer) {
        if (this.mode === 'editor') {
            if (this.goal.getBounds().contains(pointer.x, pointer.y)) {
                this.editor.selected = {
                    type: 'goal',
                    game_object: this.goal,
                    highlight: null,
                    offset: {x: pointer.x - this.goal.x, y: pointer.y - this.goal.y},
                    init_position: {
                        left: this.goal.x - (this.goal.width / 2), 
                        top: this.goal.y - (this.goal.height / 2)
                    },
                    index: -1
                };
            }
            else {
                // check if selecting existing platform
                let selected_platform = null;
                let selected_index = -1;
                this.editor.platform_gameobjects.forEach((platform_go, index) => {
                    if (platform_go.getBounds().contains(pointer.x, pointer.y)) {
                        selected_platform = platform_go;
                        selected_index = index;
                    }
                });
                if (selected_platform !== null) {
                    this.editor.selected = {
                        type: 'platform',
                        game_object: selected_platform,
                        highlight: this.add.nineslice(selected_platform.x, selected_platform.y, 'selection', 0,
                                                      selected_platform.width + 8, selected_platform.height + 8, 4, 4, 4, 4),
                        offset: {x: pointer.x - selected_platform.x, y: pointer.y - selected_platform.y},
                        init_position: {
                            left: selected_platform.x - (selected_platform.width / 2),
                            top: selected_platform.y - selected_platform.height / 2
                        },
                        index: selected_index
                    };
                }
                else { // create new platform
                    let x = (Math.floor(pointer.x / 8)) * 8;
                    let y = (Math.floor(pointer.y / 8)) * 8;
                    let new_platform = this.add.nineslice(x + 16, y + 16, 'platform', 0, 32, 32, 14, 14, 14, 14);
                    this.editor.platform_gameobjects.push(new_platform);
                    let selection = this.add.nineslice(x + 16, y + 16, 'selection', 0, 40, 40, 4, 4, 4 ,4);
                    this.editor.selected = {
                        type: 'new-platform',
                        game_object: new_platform,
                        highlight: selection,
                        offset: {x: pointer.x - new_platform.x, y: pointer.y - new_platform.y},
                        init_position: {left: new_platform.x - 16, top: new_platform.y - 16},
                        index: this.editor.platform_gameobjects.length - 1
                    };
                }
            }
        }
    }

    onPointerUp(pointer) {
        if (this.editor.selected !== null) {
            if (this.editor.selected.highlight !== null) {
                this.editor.selected.highlight.destroy();
            }
            this.editor.prev_selected = {
                index: this.editor.selected.index,
                color: this.editor.selected.game_object.tint
            };
            this.editor.selected = null;

            if (this.editor.change_callback !== null) {
                this.editor.change_callback(this.editor.prev_selected);
            }
        }
    }

    onPointerMove(pointer) {
        if (this.mode === 'editor' && this.editor.selected !== null) {
            if (this.editor.selected.type === 'goal' || this.editor.selected.type === 'platform') {
                this.editor.selected.game_object.x = (Math.round((pointer.x - this.editor.selected.offset.x) / 8)) * 8;
                this.editor.selected.game_object.y = (Math.round((pointer.y - this.editor.selected.offset.y) / 8)) * 8;
                if (this.editor.selected.highlight !== null) {
                    this.editor.selected.highlight.x = this.editor.selected.game_object.x;
                    this.editor.selected.highlight.y = this.editor.selected.game_object.y;
                }
            }
            else if (this.editor.selected.type === 'new-platform') {
                let start_x, start_y, end_x, end_y;
                if (pointer.x >= this.editor.selected.init_position.left) {
                    start_x = this.editor.selected.init_position.left;
                    end_x = (Math.ceil(pointer.x / 8)) * 8;
                }
                else {
                    start_x = (Math.floor(pointer.x / 8)) * 8;
                    end_x = this.editor.selected.init_position.left + 32;
                }
                if (pointer.y >= this.editor.selected.init_position.top) {
                    start_y = this.editor.selected.init_position.top;
                    end_y = (Math.ceil(pointer.y / 8)) * 8;
                }
                else {
                    start_y = (Math.floor(pointer.y / 8)) * 8;
                    end_y = this.editor.selected.init_position.top + 32;
                }

                let new_width = Math.max(end_x - start_x, 32);
                let new_height = Math.max(end_y - start_y, 32);
                this.editor.selected.game_object.x = start_x + (new_width / 2);
                this.editor.selected.game_object.y = start_y + (new_height / 2);
                this.editor.selected.game_object.width = new_width;
                this.editor.selected.game_object.height = new_height;

                this.editor.selected.highlight.x = this.editor.selected.game_object.x;
                this.editor.selected.highlight.y = this.editor.selected.game_object.y;
                this.editor.selected.highlight.width = new_width + 8;
                this.editor.selected.highlight.height = new_height + 8;
            }
        }
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

            // setTimeout(() => {
            //     this.renderer.snapshot((image) => {
            //         // download
            //         let mime_type = 'image/png';
            //         var img_url = image.src;
            //         var dl_link = document.createElement('a');
            //         dl_link.download = 'phaser_snapshot.png';
            //         dl_link.href = img_url;
            //         dl_link.dataset.downloadurl = [mime_type, dl_link.download, dl_link.href].join(':');
            //         document.body.appendChild(dl_link);
            //         dl_link.click();
            //         document.body.removeChild(dl_link);
            //     }, 'image/png');
            // }, 2000);
        }
        else {
            alert('Error: level not created');
        }
    }

    clearAssets() {
        this.music.destroy();

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

    resetEditor() {
        this.editor.background = [
            0xFFFFFF,
            0x000000
        ];
        this.editor.goal_pos = {x: 0, y: 0};
        this.editor.platform_gameobjects = [];
        this.editor.selected = null;
        this.editor.prev_selected = null;
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

    setEditorPlatformColor(index, color) {
        this.editor.platform_gameobjects[index].tint = parseInt(color.substring(1), 16);
    }

    removeEditorPlatform(index) {
        this.editor.platform_gameobjects[index].destroy();
        this.editor.platform_gameobjects.splice(index, 1);
    }

    saveCustomLevel() {
        this.levels[3] = {
            background: [],
            platforms: [],
            goal: {x: this.goal.x - 16, y: this.canvas.height - (this.goal.y + 32)}
        };

        this.editor.background.forEach((value) => {
            this.levels[3].background.push(value);
        });
        this.editor.platform_gameobjects.forEach((platform) => {
            this.levels[3].platforms.push({
                x: platform.x - (platform.width / 2),
                y: this.canvas.height - (platform.y + (platform.height / 2)),
                w: platform.width,
                h: platform.height,
                color: platform.tint
            });
        });

        // create description for audio generator
        let upload = {};
        let p = new Promise((resolve, reject) => {
            if (this.musicgen_mode === 'text') {
                let mood = ColorArrayToMoodDescription(this.editor.background);
                let audio_desc = '90s game vibe with ' + mood + ' chiptunes and 8-bit melodies';
                resolve({type: 'text', text: audio_desc, image: null});
            }
            else if (this.musicgen_mode === 'image') {
                this.renderer.snapshot((image) => {
                    console.log(image.src);
                    resolve({type: 'image', text: null, image: image.src});
                }, 'image/png');
            }
            else {
                reject('invalid MusicGen mode: ' + this.musicgen_mode);
            }
        });

        p.then((upload) => {
            let options = {
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(upload),
                method: 'POST'
            };
            return fetch('/musicgen', options);
        })
        .then((response) => {
            return response.text(); // change to blob / whatever type audio is
        })
        .then((data) => {
            console.log(data);
        })
        .catch((err) => {
            console.log(err);
        });
    }
};

export { GameScene };
