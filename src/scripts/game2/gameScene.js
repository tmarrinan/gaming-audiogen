import { Scene, Physics } from 'phaser';

const Matter = Physics.Matter.Matter;

class GameScene extends Scene {
    constructor(config) {
        super(config);

        this.canvas = null;
        this.graphics = null;
        this.background = [
            0xACD4F2,
            0x4E8BCC,
            0x483E87
        ];
        this.terrain = [
            {x: 0, y: 100},
            {x: 150, y: 150},
            {x: 325, y: 400},
            {x: 500, y: 500},
            {x: 600, y: 475},
            {x: 800, y: 475},
            {x: 900, y: 550},
            {x: 1024, y: 550}
        ];
        this.terrain_bodies = [];
    }

    preload() {
        this.canvas = this.sys.game.canvas;

        console.log(Matter.Body);
        console.log(Matter.Bodies);

        // Joints: https://labs.phaser.io/edit.html?src=src\physics\matterjs\chain.js
        // Compound Body: https://github.com/phaserjs/examples/blob/master/public/src/physics/matterjs/compound%20body.js

        this.load.image('ball', 'assets/ball.png');
    }
  
    create() {
        // background and terrain
        this.graphics = this.add.graphics();
        this.drawBackgroundAndTerrain();

        console.log(this.terrain);
        for (let i = 0; i< this.terrain.length - 1; i++) {
            let v1 = {x: this.terrain[i].x, y: this.terrain[i].y};
            let v2 = {x: this.terrain[i + 1].x, y: this.terrain[i + 1].y};
            let v3 = {x: this.terrain[i + 1].x, y: this.canvas.height};
            let v4 = {x: this.terrain[i].x, y: this.canvas.height};
            let left = v1.x;
            let top = Math.min(v1.y, v2.y);
            let body = this.matter.add.fromVertices(
                0,
                0,
                [v1, v2, v3, v4],
                {
                    label: 'terrain' + i,
                    isStatic: true,
                    friction: 0.01
                },
                false,
                0.01,
                1
            );
            let center_of_mass = Matter.Vector.sub(body.bounds.min, body.position);
            Matter.Body.setPosition(body, { x: Math.abs(center_of_mass.x) + left, y: Math.abs(center_of_mass.y) + top})
            this.terrain_bodies.push(body);
        }

        this.ball = this.matter.add.image(32, 32, 'ball', null, {shape: 'circle', mass: 2.0, friction: 0.01});
    }

    update(time, delta) {

    }

    drawBackgroundAndTerrain() {
        // clear
        this.graphics.clear();
        // background gradient
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
        // terrain
        this.graphics.fillStyle(0x685339);
        this.graphics.beginPath();
        this.terrain.forEach(vert => {
            this.graphics.lineTo(vert.x, vert.y);
        });
        this.graphics.lineTo(this.canvas.width, this.canvas.height);
        this.graphics.lineTo(0, this.canvas.height);
        this.graphics.closePath();
        this.graphics.fillPath();
    }
};

export { GameScene };
