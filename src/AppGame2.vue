<script setup>
import { Game, WEBGL } from 'phaser';
import { reactive, ref, onMounted } from 'vue';
import { GameScene } from './scripts/game2/gameScene';

const BASE_URL = import.meta.env.BASE_URL || '/';

let phaser = {
    canvas: null,
    game: null,
    scene: null
}

function onGameLoaded() {
    phaser.scene = phaser.game.scene.scenes[0];
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
                debug: true
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
    border: solid 1px #000000;;
}
</style>
