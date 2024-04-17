<script setup>
import { Game, WEBGL } from 'phaser';
import { reactive, ref, onMounted } from 'vue';
import { GameScene } from './scripts/game2/gameScene';

const BASE_URL = import.meta.env.BASE_URL || '/';

let phaser = {
    canvas: null,
    game: null,
    scene: null
};

let app_state = reactive({
    edit_mode: true,
    gen_method: 'text'
});

function onGameLoaded() {
    phaser.scene = phaser.game.scene.scenes[0];
    phaser.scene.setUpdateModeCallback(onGameModeChange);
}

function onGameModeChange(mode) {
    if (mode === 'edit') {
        app_state.edit_mode = true;
    }
    else {
        app_state.edit_mode = false;
    }
}

function updateAudioGenMethod() {
    phaser.scene.setAudioGenMethod(app_state.gen_method);
}

onMounted(() => {
    phaser.canvas = document.getElementById('canvas');

    const config = {
        type: WEBGL,
        width: 1024,
        height: 576,
        canvas: phaser.canvas,
        physics: {
            default: 'matter',
            matter: {
                gravity: {
                    y: 1.0
                },
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
        <div id="ui" v-if="app_state.edit_mode">
            <label>Audio Generation Method:</label>
            <input type="radio" name="gen-type" value="text" v-model="app_state.gen_method" checked @change="updateAudioGenMethod" />
            <label>Text Description</label>
            <input type="radio" name="gen-type" value="image" v-model="app_state.gen_method" @change="updateAudioGenMethod" />
            <label>Image</label>
        </div>
    </div>
</template>

<style scoped>
* {
    font-size: 1rem;
}

label {
    font-size: 1rem;
    margin: 0;
}

input {
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
</style>
