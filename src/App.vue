<script setup>
import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { CreateGround } from '@babylonjs/core/Meshes/Builders/groundBuilder';
import { GridMaterial } from '@babylonjs/materials/grid/gridMaterial';


import { reactive, ref, onMounted } from 'vue';

const BASE_URL = import.meta.env.BASE_URL || '/';

let babylon = {
    canvas: null,
    engine: null,
    scene: null,
    camera: null
};

function createScene() {
    // Create a scene
    babylon.scene = new Scene(babylon.engine);
    babylon.scene.clearColor = new Color3(0.1, 0.1, 0.1);

    // Create a camera
    babylon.camera = new ArcRotateCamera('camera', -Math.PI / 2.0,  3.0 * Math.PI / 8.0, 10.0, 
                                         new Vector3(0.0, 2.5, 0.0), babylon.scene);
    babylon.camera.attachControl(babylon.canvas, true);
    
    // Create a light
    const light = new HemisphericLight('light', new Vector3(0, 1, 0), babylon.scene);
    light.intensity = 1.0;
    
    // Create a grid material
    const grid_mat = new GridMaterial('grid', babylon.scene);

    // Built-in 'ground' shape.
    const ground = CreateGround('ground', { width: 10, height: 10, subdivisions: 2 }, babylon.scene);
    ground.material = grid_mat;

    // Render loop
    babylon.engine.runRenderLoop(() => {
        babylon.scene.render();
    });
}

onMounted(async () => {
    babylon.canvas = document.getElementById('canvas');

    const gl2 = babylon.canvas.getContext('webgl2');
    
    // Laptops w/ integrated + discrete GPU: must use settings to 
    // force browser to use high performance GPU
    //
    // For best performance with WebGL2, select OpenGL as rendering
    // backend for ANGLE
    const debug_info = gl2.getExtension("WEBGL_debug_renderer_info");
    const vendor = gl2.getParameter(debug_info.UNMASKED_VENDOR_WEBGL);
    const renderer = gl2.getParameter(debug_info.UNMASKED_RENDERER_WEBGL);
    console.log(vendor);
    console.log(renderer);

    babylon.engine = new Engine(gl2);
    createScene();
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
    width: 100vw;
    height: 100vh;
}
</style>
