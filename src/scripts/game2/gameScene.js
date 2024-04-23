import { Scene, Physics, Geom } from 'phaser';

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
            {x: -150, y: 50},
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
        this.vehicle_description = null;
        this.vehicle = null;
        this.edit_button = null;
        this.weight = 0.0;
        this.max_speed = 0.10;
        this.acceleration = 0.5;

        this.edit_mode = true;
        this.update_mode_callback = null;
        this.audiogen_mode = 'text';
        this.cursors = null;
        this.play_button = null;
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
                'cinder-block': {scale: 0.075, mass: 3.5, friction: 0.450},
                'skis': {scale: 0.20, mass: 1.0, friction: 0.001},
                'computer': {scale: 0.075, mass: 0.5, friction: 0.400}
            }
        };
        this.editor_add = {type: '', part: ''};
        this.selected_part = null;
        this.editor_vehicle = [];
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
        if (this.edit_mode) {
            this.cursors = this.input.keyboard.createCursorKeys();
            this.input.on('pointerdown', this.onPointerDown, this);
            this.input.on('pointerup', this.onPointerUp, this);
            this.input.on('pointermove', this.onPointerMove, this);

            const font = {
                color: '#FFFFFF',
                backgroundColor: '#54A669',
                fontFamily: 'monospace',
                fontSize: '36px',
                padding: {x: 8, y: 4}
            };
            this.play_button = this.add.text(20, this.canvas.height - 62, 'Play', font);
            
            this.graphics = this.add.graphics();
            let key;
            let i = 0;
            this.vehicle_part_buttons = {};
            for (key in this.vehicle_parts.body) {
                let w = this.textures.get(key).getSourceImage().naturalWidth;
                let h = this.textures.get(key).getSourceImage().naturalHeight;
                let max_dim = Math.max(w, h);
                let scale = 64 / max_dim;
                let row = ~~(i / 3);
                let col = i % 3;
                this.graphics.fillStyle(0x92E9A4, 0.75);
                this.graphics.lineStyle(3, 0x92E9A4, 1.0);
                this.graphics.fillRoundedRect(60 + col * 96, 92 + row * 96, 72, 72, 16);
                this.graphics.strokeRoundedRect(60 + col * 96, 92 + row * 96, 72, 72, 16)
                this.vehicle_part_buttons[key] = {
                    game_object: this.add.image(96 + col * 96, 128 + row * 96, key, 0),
                    bounds: new Geom.Rectangle(60 + col * 96, 92 + row * 96, 72, 72)
                };
                this.vehicle_part_buttons[key].game_object.setScale(scale);
                i++;
            }
            for (key in this.vehicle_parts.wheels) {
                let w = this.textures.get(key).getSourceImage().naturalWidth;
                let h = this.textures.get(key).getSourceImage().naturalHeight;
                let max_dim = Math.max(w, h);
                let scale = 64 / max_dim;
                let row = ~~(i / 3);
                let col = i % 3;
                this.graphics.fillStyle(0x92A4E9, 0.75);
                this.graphics.lineStyle(3, 0x92A4E9, 1.0);
                this.graphics.fillRoundedRect(60 + col * 96, 92 + row * 96, 72, 72, 16);
                this.graphics.strokeRoundedRect(60 + col * 96, 92 + row * 96, 72, 72, 16)
                this.vehicle_part_buttons[key] = {
                    game_object: this.add.image(96 + col * 96, 128 + row * 96, key, 0),
                    bounds: new Geom.Rectangle(60 + col * 96, 92 + row * 96, 72, 72)
                };
                this.vehicle_part_buttons[key].game_object.setScale(scale);
                i++;
            }
            let start_color, end_color, start_y;
            let num_sections = this.background.length - 1;
            let section_height = this.canvas.height / num_sections;
            for (let i = 0; i < num_sections; i++) {
                start_color = this.background[i];
                end_color = this.background[i + 1];
                start_y = i * section_height;
                this.graphics.fillGradientStyle(start_color, start_color, end_color, end_color, 1);
                this.graphics.fillRect(384, start_y, this.canvas.width - 384, section_height);
            }
        }
        else {
            this.input.on('pointerdown', this.onPointerDown, this);

            // background and terrain
            this.graphics = this.add.graphics();
            this.drawBackgroundAndTerrain();

            for (let i = 0; i< this.terrain.length - 1; i++) {
                let v1 = {x: this.terrain[i].x, y: this.terrain[i].y + 1};
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
                        friction: 0.15
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
            let vehicle_pos = {x: 64, y: 16};
            let body_list = [];
            let body_body = [];
            let wheel_list = [];
            this.weight = 0.0;
            this.vehicle_description.forEach((part) => {
                let mass = this.vehicle_parts[part.type][part.part].mass;
                let friction = this.vehicle_parts[part.type][part.part].friction;
                let scale = this.vehicle_parts[part.type][part.part].scale;
                if (part.type === 'body') {
                    let body = this.add.image(part.x, part.y, part.part, 0);
                    body.setScale(scale);
                    body_list.push(body);
                    let body_rect = Matter.Bodies.rectangle(part.x, part.y, part.width, part.height, {mass: mass, friction: friction});
                    body_body.push(body_rect);
                }
                else {
                    let wheel = this.matter.add.image(part.x, part.y, part.part, null, {shape: 'circle', mass: mass, friction: friction});
                    wheel.setCollisionGroup(vehicle_group);
                    wheel.setScale(scale);
                    wheel.setBounce(this.vehicle_parts.wheels[part.part].bounce);
                    wheel.body.slideFactor = 0.0;
                    //wheel.body.pushable = false;
                    wheel_list.push(wheel);
                }
                this.weight += mass;
            });

            let final_body = Matter.Body.create({parts: body_body});
            let offset_x = final_body.centerOffset.x;
            let offset_y = final_body.centerOffset.y;
            body_list.forEach((b)=> {
                b.x -= offset_x;
                b.y -= offset_y;
            });
            let body_container = this.add.container(vehicle_pos.x, vehicle_pos.y, body_list);
            let body_physics = this.matter.add.gameObject(body_container, final_body);
            body_physics.setCollisionGroup(vehicle_group);

            this.wheels = [];
            wheel_list.forEach((wheel) => {
                wheel.body.x -= offset_x;
                wheel.body.x -= offset_y;
                this.matter.add.constraint(body_physics.body, wheel.body, 0, 0.8, {pointA: {x: wheel.x, y: wheel.y}});
                this.wheels.push(wheel.body);
            });

            const font = {
                color: '#FFFFFF',
                backgroundColor: '#A64440',
                fontFamily: 'monospace',
                fontSize: '36px',
                padding: {x: 8, y: 4}
            };
            this.edit_button = this.add.text(this.canvas.width - 20, 20, 'Edit', font);
            this.edit_button.setOrigin(1.0, 0.0);

            //let center_of_mass = Matter.Vector.sub(body_physics.body.bounds.min, body_physics.body.position);
            // console.log(center_of_mass);
            // Matter.Body.setPosition(body_physics.body, { x: 400, y: 400 });
            //Matter.Body.setPosition(body_rect, { x: Math.abs(center_of_mass.x) + 0, y: Math.abs(center_of_mass.y) + 0 })
            //console.log(body_physics.centerOfMass);
            //let compound_body = Matter.Body.create({parts: body_body});
            //body_physics.setExistingBody(compound_body);

            // let body = this.add.container(vehicle_pos.x, vehicle_pos.y, body_list);
            // this.matter.world.add(body);
            // let compound_body = Matter.Body.create({parts: body_body});
            // body.body = compound_body;
            // console.log(body);
            //body.setCollisionGroup(vehicle_group);



            // let wheel_a_offset = {x: -28, y: 24};
            // let wheel_b_offset = {x: 28, y: 24};
            // let body_mass = 7.0;
            // let wheel_mass = 3.5;
            // let body = this.matter.add.image(vehicle_pos.x, vehicle_pos.y, 'cardboard-box', null, {shape: 'rectangle', mass: body_mass, friction: 0.15});
            // body.setScale(0.125);
            // body.setCollisionGroup(vehicle_group);
            // let wheel_a = this.matter.add.image(vehicle_pos.x + wheel_a_offset.x, vehicle_pos.y + wheel_a_offset.y, 'car-tire', null,
            //                                     {shape: 'circle', mass: wheel_mass, friction: 0.25});
            // wheel_a.setScale(0.175);
            // wheel_a.setCollisionGroup(vehicle_group);
            // wheel_a.setBounce(0.3);
            // let wheel_b = this.matter.add.image(vehicle_pos.x + wheel_b_offset.x, vehicle_pos.y + wheel_b_offset.y, 'car-tire', null,
            //                                     {shape: 'circle', mass: wheel_mass, friction: 0.25});
            // wheel_b.setCollisionGroup(vehicle_group);
            // wheel_b.setScale(0.175);
            // wheel_b.setBounce(0.3);

            // let axel_a = this.matter.add.constraint(body.body, wheel_a.body, 0, 0.2, {pointA: wheel_a_offset});
            // let axel_b = this.matter.add.constraint(body.body, wheel_b.body, 0, 0.2, {pointA: wheel_b_offset});

            // this.weight = body_mass + 2 * wheel_mass;
            // this.vehicle = [body, wheel_a, wheel_b];
        }
    }

    update(time, delta) {
        if (this.edit_mode) {

        }
        else {
            let scale = 0.1 * this.weight;
            let accel = this.acceleration * scale * (delta / 1000);
            let max_s = this.max_speed;

            this.wheels.forEach((wheel) => {
                let new_speed = wheel.angularSpeed;
                if (new_speed < max_s) {
                    new_speed = (wheel.angularSpeed <= 0) ? max_s / 10 : wheel.angularSpeed + accel;
                    new_speed = Math.min(new_speed, max_s);
                    Matter.Body.setAngularVelocity(wheel, new_speed);
                }
            });



            // let wheel_rear = this.vehicle[1].body;
            // let wheel_front = this.vehicle[2].body;

            // let new_speed_rear = wheel_rear.angularSpeed;
            // if (new_speed_rear < max_s) {
            //     new_speed_rear = (wheel_rear.angularSpeed <= 0) ? max_s / 10 : wheel_rear.angularSpeed + accel;
            //     new_speed_rear = Math.min(new_speed_rear, max_s);
            // }
            // let new_speed_front = wheel_front.angularSpeed;
            // if (new_speed_front < max_s) {
            //     new_speed_front = (wheel_front.angularSpeed <= 0) ? max_s / 10 : wheel_front.angularSpeed + accel;
            //     new_speed_front = Math.min(new_speed_front, max_s);
            // }
            // Matter.Body.setAngularVelocity(wheel_rear, new_speed_rear);
            // Matter.Body.setAngularVelocity(wheel_front, new_speed_front);
        }
    }

    onPointerDown(pointer) {
        if (this.edit_mode) {
            if (this.play_button.getBounds().contains(pointer.x, pointer.y)) {
                let editor_bounds = {x_min: 9999, x_max: -9999, y_min: 9999, y_max: -9999};
                let part_center_bounds = {x_min: 9999, x_max: -9999, y_min: 9999, y_max: -9999}; 
                this.editor_vehicle.forEach((part) => {
                    let bounds = part.game_object.getBounds();
                    if (bounds.left < editor_bounds.x_min) editor_bounds.x_min = bounds.left;
                    if (bounds.right > editor_bounds.x_max) editor_bounds.x_max = bounds.right;
                    if (bounds.top < editor_bounds.y_min) editor_bounds.y_min = bounds.top;
                    if (bounds.bottom > editor_bounds.y_max) editor_bounds.y_max = bounds.bottom;
                    if (part.game_object.x < part_center_bounds.x_min) part_center_bounds.x_min = part.game_object.x;
                    if (part.game_object.x > part_center_bounds.x_max) part_center_bounds.x_max = part.game_object.x;
                    if (part.game_object.y < part_center_bounds.y_min) part_center_bounds.y_min = part.game_object.y;
                    if (part.game_object.y > part_center_bounds.y_max) part_center_bounds.y_max = part.game_object.y;
                    // let bounds = part.game_object.getBounds();
                    // if (bounds.x < editor_bounds.x_min) editor_bounds.x_min = bounds.x;
                    // if (bounds.x + bounds.width > editor_bounds.x_max) editor_bounds.x_max = bounds.x + bounds.width;
                    // if (bounds.y < editor_bounds.y_min) editor_bounds.y_min = bounds.y;
                    // if (bounds.y + bounds.height > editor_bounds.y_max) editor_bounds.y_max = bounds.y + bounds.height;
                });
                let center_pos = {
                    x: (part_center_bounds.x_min + part_center_bounds.x_max) / 2, 
                    y: (part_center_bounds.y_min + part_center_bounds.y_max) / 2
                };

                let total_mass = 0.0;
                let wheel_type = []
                this.vehicle_description = [];
                this.editor_vehicle.forEach((part) => {
                    let part_properties = this.vehicle_parts[part.type][part.game_object.texture.key];
                    if (part.type === 'wheels') {
                        let wheel_text = '';
                        if (part.game_object.texture.key === 'car-tire') wheel_text = 'car';
                        else if (part.game_object.texture.key === 'wagon-wheel') wheel_text = 'wooden';
                        else if (part.game_object.texture.key === 'inner-tube') wheel_text = 'inner-tube';
                        if (!wheel_type.includes(wheel_text)) {
                            wheel_type.push(wheel_text);
                        }
                    }
                    total_mass += part_properties.mass;
                    let bounds = part.game_object.getBounds();
                    this.vehicle_description.push({
                        type: part.type,
                        part: part.game_object.texture.key,
                        x: Math.round((part.game_object.x - center_pos.x) / 2),
                        y: Math.round((part.game_object.y - center_pos.y) / 2),
                        left: Math.round((part.game_object.x - (bounds.width / 2) - center_pos.x) / 2),
                        top: Math.round((part.game_object.y - (bounds.height / 2) - center_pos.y) / 2),
                        width: Math.round(bounds.width / 2),
                        height: Math.round(bounds.height / 2)
                    });
                });

                // TODO: generate audio here... only clear assets and restart once audio received
                let p = new Promise((resolve, reject) => {
                    if (this.audiogen_mode === 'text') {
                        let weight = 'light';
                        if (total_mass > 6.0) {
                            weight = 'moderate';
                        }
                        else if (total_mass > 15.0) {
                            total_weight = 'heavy';
                        }
                        let wheel_desc = 'no';
                        if (wheel_type.length > 0) {
                            wheel_desc = wheel_type.join(' and ')
                        }
                        let audio_desc = weight + ' vehicle with ' + wheel_desc + ' wheels';
                        resolve({type: 'text', text: audio_desc, image: null});
                    }
                    else if (this.audiogen_mode === 'image') {
                        let x = editor_bounds.x_min - 10;
                        let y = editor_bounds.y_min - 10;
                        let w = editor_bounds.x_max - editor_bounds.x_min + 20;
                        let h = editor_bounds.y_max - editor_bounds.y_min + 20;
                        this.renderer.snapshotArea(x, y, w, h, (image) => {
                            resolve({type: 'image', text: null, image: image.src});
                        }, 'image/png');
                    }
                    else {
                        reject('invalid AudioGen mode: ' + this.audiogen_mode);
                    }
                });

                p.then((upload) => {
                    console.log(upload);
                    let options = {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(upload),
                        method: 'POST'
                    };
                    return fetch('/audiogen', options);
                })
                .then((response) => {
                    return response.blob();
                })
                .then((data) => {
                    const audio_url = URL.createObjectURL(data);

                    this.edit_mode = false;
                    this.clearEditorAssets();
                    this.scene.restart();
                    if (this.update_mode_callback !== null) this.update_mode_callback('play');
                })
                .catch((err) => {
                    console.log(err);
                });
            }
            else {
                let selection = false;
                for (let key in this.vehicle_part_buttons) {
                    if (this.vehicle_part_buttons[key].bounds.contains(pointer.x, pointer.y)) {
                        this.editor_add = {type: pointer.y < 284 ? 'body' : 'wheels', part: key};
                        selection = true;
                    }
                }
                if (!selection) {
                    let i = 0;
                    while (!selection && i < this.editor_vehicle.length) {
                        if (this.editor_vehicle[i].game_object.getBounds().contains(pointer.x, pointer.y)) {
                            this.selected_part = this.editor_vehicle[i].game_object;
                            selection = true;
                        }
                        i++;
                    }
                }
            }
        }
        else {
            if (this.edit_button.getBounds().contains(pointer.x, pointer.y)) {
                this.edit_mode = true;
                this.clearGameAssets();
                this.scene.restart();
                if (this.update_mode_callback !== null) this.update_mode_callback('edit'); 
            }
        }
    }

    onPointerUp(pointer) {
        if (this.edit_mode) {
            this.selected_part = null;
        }
    }

    onPointerMove(pointer) {
        if (this.edit_mode) {
            if (this.editor_add.part !== '' && pointer.x > 384) {
                this.selected_part = this.add.image(pointer.x, pointer.y, this.editor_add.part, 0);
                this.selected_part.setScale(2 * this.vehicle_parts[this.editor_add.type][this.editor_add.part].scale);
                this.editor_vehicle.push({game_object: this.selected_part, type: this.editor_add.type});
                this.editor_add.part = '';
            }
            else if (this.selected_part !== null) {
                this.selected_part.x = pointer.x;
                this.selected_part.y = pointer.y;
            }
        }
    }

    clearEditorAssets() {
        this.graphics.destroy();

        for (let button in this.vehicle_part_buttons) {
            this.vehicle_part_buttons[button].game_object.destroy();
        }
        this.vehicle_part_buttons = null;

        for (let part of this.editor_vehicle) {
            part.game_object.destroy();
        }
        this.editor_vehicle = [];

        this.play_button.destroy();
    }

    clearGameAssets() {
        this.graphics.destroy();

        for (let body of this.terrain_bodies) {
            this.matter.world.remove(body);
        }
        this.terrain_bodies = [];

        this.edit_button.destroy();
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

    setUpdateModeCallback(callback) {
        this.update_mode_callback = callback;
    }

    setAudioGenMethod(mode) {
        this.audiogen_mode = mode;
    }
};

export { GameScene };
