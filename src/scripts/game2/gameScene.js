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
            {x: 250, y: 225},
            {x: 325, y: 325},
            {x: 425, y: 425},
            {x: 500, y: 475},
            {x: 550, y: 475},
            {x: 625, y: 450},
            {x: 700, y: 400},
            {x: 800, y: 400},
            {x: 900, y: 550},
            {x: 1024, y: 550}
        ];
        // this.terrain = [
        //     {x: 0, y: 300},
        //     {x: 200, y: 300},
        //     {x: 216, y: 316},
        //     {x: 232, y: 300},
        //     {x: 300, y: 300},
        //     {x: 500, y: 400},
        //     {x: 600, y: 400},
        //     {x: 616, y: 384},
        //     {x: 632, y: 400},
        //     {x: 700, y: 400},
        //     {x: 900, y: 350},
        //     {x: 1024, y: 350}
        // ];
        this.terrain_bodies = [];
        this.vehicle = null;
        this.weight = 0.0;
        this.max_speed = 0.10;
        this.acceleration = 0.5;

        this.vehicle_parts = {
            wheels: {
                'car-tire': {scale: 0.175, mass: 3.5, friction: 0.250, bounce: 0.30},
                'wagon-wheel': {scale: 0.200, mass: 3.5, friction: 0.005, bounce: 0.05},
                'inner-tube': {scale: 0.275, mass: 1.5, friction: 0.300, bounce: 0.45}
            },
            body: {
                'cardboard-box': {scale: 0.15, mass: 0.5, friction: 0.150},
                'wood-log': {scale: 0.15, mass: 4.0, friction: 0.250},
                'steel-pipe': {scale: 0.15, mass: 8.5, friction: 0.100},
                'cinder-block': {scale: 0.15, mass: 3.5, friction: 0.450},
                'skis': {scale: 0.15, mass: 1.0, friction: 0.001},
                'computer': {scale: 0.15, mass: 0.5, friction: 0.400}
            }
        };
    }

    preload() {
        this.canvas = this.sys.game.canvas;

        // Joints: https://labs.phaser.io/edit.html?src=src\physics\matterjs\chain.js
        // Compound Body: https://github.com/phaserjs/examples/blob/master/public/src/physics/matterjs/compound%20body.js

        this.load.image('car-tire', 'assets/car-tire.png');
        this.load.image('wagon-wheel', 'assets/wagon-wheel.png');
        this.load.image('inner-tube', 'assets/inner-tube.png');
        this.load.image('cardboard-box', 'assets/cardboard-box.png');
        this.load.image('wood-log', 'assets/wood-log.png');
        this.load.image('steel-pipe', 'assets/steel-pipe.png');
        this.load.image('cinder-block', 'assets/cinder-block.png');
        this.load.image('skis', 'assets/skis.png');
        this.load.image('computer', 'assets/computer.png');
    }
  
    create() {
        // background and terrain
        this.graphics = this.add.graphics();
        this.drawBackgroundAndTerrain();

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
                    friction: 0.0015
                },
                false,
                0.01,
                1
            );
            let center_of_mass = Matter.Vector.sub(body.bounds.min, body.position);
            Matter.Body.setPosition(body, { x: Math.abs(center_of_mass.x) + left, y: Math.abs(center_of_mass.y) + top})
            this.terrain_bodies.push(body);
        }

        let vehicle_group = -1; // must be negative number
        let vehicle_pos = {x: 64, y: 8};
        let wheel_a_offset = {x: -28, y: 24};
        let wheel_b_offset = {x: 28, y: 24};
        let body_mass = 7.0;
        let wheel_mass = 3.5;
        let body = this.matter.add.image(vehicle_pos.x, vehicle_pos.y, 'cardboard-box', null, {shape: 'rectangle', mass: body_mass, friction: 0.15});
        body.setScale(0.125);
        body.setCollisionGroup(vehicle_group);
        let wheel_a = this.matter.add.image(vehicle_pos.x + wheel_a_offset.x, vehicle_pos.y + wheel_a_offset.y, 'car-tire', null,
                                            {shape: 'circle', mass: wheel_mass, friction: 0.25});
        wheel_a.setScale(0.175);
        wheel_a.setCollisionGroup(vehicle_group);
        wheel_a.setBounce(0.3);
        let wheel_b = this.matter.add.image(vehicle_pos.x + wheel_b_offset.x, vehicle_pos.y + wheel_b_offset.y, 'car-tire', null,
                                            {shape: 'circle', mass: wheel_mass, friction: 0.25});
        wheel_b.setCollisionGroup(vehicle_group);
        wheel_b.setScale(0.175);
        wheel_b.setBounce(0.3);

        let axel_a = this.matter.add.constraint(body.body, wheel_a.body, 0, 0.2, {pointA: wheel_a_offset});
        let axel_b = this.matter.add.constraint(body.body, wheel_b.body, 0, 0.2, {pointA: wheel_b_offset});

        this.weight = body_mass + 2 * wheel_mass;
        this.vehicle = [body, wheel_a, wheel_b];
    }

    update(time, delta) {
        let scale = 0.1 * this.weight;
        let accel = this.acceleration * scale * (delta / 1000);
        let max_s = this.max_speed;
        let wheel_rear = this.vehicle[1].body;
        let wheel_front = this.vehicle[2].body;

        let new_speed_rear = wheel_rear.angularSpeed;
        if (new_speed_rear < max_s) {
            new_speed_rear = (wheel_rear.angularSpeed <= 0) ? max_s / 10 : wheel_rear.angularSpeed + accel;
            new_speed_rear = Math.min(new_speed_rear, max_s);
        }
        let new_speed_front = wheel_front.angularSpeed;
        if (new_speed_front < max_s) {
            new_speed_front = (wheel_front.angularSpeed <= 0) ? max_s / 10 : wheel_front.angularSpeed + accel;
            new_speed_front = Math.min(new_speed_front, max_s);
        }
        Matter.Body.setAngularVelocity(wheel_rear, new_speed_rear);
        Matter.Body.setAngularVelocity(wheel_front, new_speed_front);
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
