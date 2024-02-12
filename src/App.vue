<script setup>
import { Game, WEBGL } from 'phaser';
import { reactive, ref, onMounted } from 'vue';
import { GameScene } from './scripts/gameScene';

const BASE_URL = import.meta.env.BASE_URL || '/';

let phaser = {
    canvas: null,
    game: null,
    scene: null
}

let app_state = reactive({
    edit_mode: false
});

function onGameLoaded(data) {
    phaser.scene = phaser.game.scene.scenes[0];
}

function selectLevel(level) {
    if (phaser.scene !== null) {
        phaser.scene.restart(level);
    }
}

function editGame() {
    app_state.edit_mode = true;
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
        <div class="ui" >
            <button type="button" class="primary-btn" @click="selectLevel(0)">Level 1</button>
            <button type="button" class="primary-btn" @click="selectLevel(1)">Level 2</button>
            <button type="button" class="primary-btn" @click="selectLevel(2)">Level 3</button>
            <button type="button" class="primary-btn" @click="selectLevel(3)">Level 4</button>
            <button type="button" class="other-btn" @click="editGame">Custom</button>
            <div v-if="app_state.edit_mode">
                <p>EDIT</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
* {
    font-size: 1rem;
}

#content {
    width: 1050px;
    margin: 0 auto;
}

#canvas {
    display: block;
    width: 1024px;
    height: 576px;
}

.ui {
    text-align: center;
    margin: 1rem;
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
</style>
