<script setup>
import { Game, WEBGL } from 'phaser';
import { reactive, ref, onMounted } from 'vue';
import { GameScene } from './scripts/game1/gameScene';

const BASE_URL = import.meta.env.BASE_URL || '/';

let phaser = {
    canvas: null,
    game: null,
    scene: null
}

let app_state = reactive({
    edit_mode: false,
    gradient_colors: [
        '#000000',
        '#FFFFFF'
    ],
    platforms: [],
    goal: {x: 64, y: 36},
    selected_platform: {
        index: -1,
        color: '#FFFFFF'
    },
    gen_method: 'text'
});

function onEditorChange(data) {
    // TODO: add GUI for selecting platform color and for deleting platform
    //       if idx < 0, then no platform to edit
    app_state.selected_platform.index = data.index;
    app_state.selected_platform.color = '#' + data.color.toString(16).padStart(6, '0');
}

function onGameLoaded(data) {
    phaser.scene = phaser.game.scene.scenes[0];
    phaser.scene.setEditorChangeCallback(onEditorChange)
}

function selectLevel(level) {
    if (phaser.scene !== null) {
        app_state.edit_mode = false;
        phaser.scene.restart(level);
    }
}

function editGame() {
    if (phaser.scene !== null) {
        app_state.edit_mode = true;
        app_state.gradient_colors = [
            '#000000',
            '#FFFFFF'
        ];
        app_state.platforms = [];
        app_state.goal = {x: 64, y: 36};

        phaser.scene.launchEditor(app_state.goal);
    }
}

function updateGradientColorCount(event) {
    let num_colors = parseInt(event.target.value);

    // remove colors
    if (num_colors < app_state.gradient_colors.length) {
        let num_remove = app_state.gradient_colors.length - num_colors;
        app_state.gradient_colors.splice(app_state.gradient_colors.length - num_remove, num_remove);
    }
    // add colors
    else if (num_colors > app_state.gradient_colors.length) {
        let num_add = num_colors - app_state.gradient_colors.length;
        for (let i = 0; i < num_add; i++) {
            app_state.gradient_colors.push('#FFFFFF');
        }
    }

    phaser.scene.setEditorBackground(app_state.gradient_colors);
}

function updateGradient() {
    phaser.scene.setEditorBackground(app_state.gradient_colors);
}

function updatePlatformColor() {
    phaser.scene.setEditorPlatformColor(app_state.selected_platform.index, app_state.selected_platform.color);
}

function deletePlatform() {
    phaser.scene.removeEditorPlatform(app_state.selected_platform.index);
}

function updateAudioGenMethod() {
    phaser.scene.setAudioGenMethod(app_state.gen_method);
}

function saveCustomLevel() {
    phaser.scene.saveCustomLevel();
}

function backgroundGradientCSS() {
    let css = 'linear-gradient(90deg, ';
    app_state.gradient_colors.forEach((color, index) => {
        let stop = (100.0 * (index / (app_state.gradient_colors.length - 1))).toFixed(1) + '%';
        css += color + ' ' + stop;
        if (index !== (app_state.gradient_colors.length - 1)) {
            css += ', ';
        }
    });
    css += ');';
    return css;
} 

onMounted(() => {
    phaser.canvas = document.getElementById('canvas');

    const config = {
        type: WEBGL,
        width: 1024,
        height: 576,
        canvas: phaser.canvas,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 981 },
                debug: false
            }
        },
        scene: [
            GameScene
        ],
        callbacks: {
            postBoot: onGameLoaded
        }
    };

    phaser.game = new Game(config);
});
</script>

<template>
    <div id="content">
        <canvas id="canvas"></canvas>
        <div id="ui" >
            <button type="button" class="primary-btn" @click="selectLevel(0)">Level 1</button>
            <button type="button" class="primary-btn" @click="selectLevel(1)">Level 2</button>
            <button type="button" class="primary-btn" @click="selectLevel(2)">Level 3</button>
            <button type="button" class="primary-btn" @click="selectLevel(3)">Custom Level</button>
            <button type="button" class="other-btn" @click="editGame">Create Level</button>
            <div id="editor" v-if="app_state.edit_mode">
                <h3>Level Editor</h3>
                <div id="editor-widgets">
                    <div class="widget-row">
                        <label>Background:</label>
                        <div id="gradient" :style="'background: ' + backgroundGradientCSS()"></div>
                    </div>
                    <div class="widget-row">
                        <div class="indent"></div>
                        <label>Number of Colors: </label>
                        <input type="number" min="2" max="8" value="2" style="width: 4rem;" @change="updateGradientColorCount" />
                    </div>
                    <div class="widget-row" v-for="(color, i) in app_state.gradient_colors">
                        <div class="indent"></div>
                        <label>Color {{ i }}:</label>
                        <input type="color" v-model="app_state.gradient_colors[i]" @change="updateGradient" />
                    </div>
                    <div class="widget-row" v-if="app_state.selected_platform.index >= 0">
                        <label>Plartform:</label>
                        <input type="color" v-model="app_state.selected_platform.color" @change="updatePlatformColor" />
                        <button type="button" @click="deletePlatform">Remove</button>
                    </div>
                    <div class="widget-row">
                        <label>Music Generation Method:</label>
                        <input type="radio" name="gen-type" value="text" v-model="app_state.gen_method" checked @change="updateAudioGenMethod" />
                        <label>Text Description</label>
                        <input type="radio" name="gen-type" value="image" v-model="app_state.gen_method" @change="updateAudioGenMethod" />
                        <label>Image</label>
                    </div>
                    <div class="widget-row">
                        <button type="button" @click="saveCustomLevel">Save</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
* {
    font-size: 1rem;
}

h3 {
    font-size: 1.2rem;
    font-weight: bold;
}

label {
    font-size: 1rem;
    margin: 0;
}

input, button {
    margin: 0 0 0 1rem;
}

#content {
    width: 1050px;
    margin: 0 auto;
}

#canvas {
    display: block;
    width: 1024px;
    height: 576px;
    border: solid 1px #000000;;
}

#ui {
    text-align: center;
    margin: 1rem;
}

#editor {
    margin-top: 1.5rem;
}

#editor-widgets {
    text-align: left;
}

#gradient {
    display: inline-block;
    width: 24rem;
    height: 2rem;
    border: solid 1px #000000;
    margin: 0 0 0 1rem;
}

.primary-btn {
    background-color: #1A5DB5;
    color: #FFFFFF;
    padding:0.25rem 1rem;
    margin: 0 1rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
}

.primary-btn:hover {
    background-color: #164E96;
}

.other-btn {
    background-color: #A9A9A9;
    color: #000000;
    padding: 0.25rem 1rem;
    margin: 0 1rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
}

.other-btn:hover {
    background-color: #8F8F8F;
}

.widget-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 1rem;
}

.indent {
    margin: 0 4rem 0 0;
}
</style>
