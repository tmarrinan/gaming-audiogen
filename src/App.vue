<script setup>
import { Game, WEBGL } from 'phaser';
import { reactive, ref, onMounted } from 'vue';
import { GameScene } from './scripts/gameScene.js';

const BASE_URL = import.meta.env.BASE_URL || '/';

let phaser = {
    canvas: null,
    game: null
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
                gravity: { y: 0 },
                // debug: true
            }
        },
        scene: [
            GameScene
        ]
    };

    phaser.game = new Game(config);
});
</script>

<template>
    <canvas id="canvas"></canvas>
</template>

<style scoped>
* {
    font-size: 1rem;
}

#canvas {
    display: block;
    width: 1024px;
    height: 576px;
}
</style>
