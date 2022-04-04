import { AmbientLight, Color, type FileLoader, type TextureLoader } from "three";
import { scene, camera, renderer, size } from "$threejs/scene";
import { add, get } from "$threejs/ressources";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Emitter } from "../fx/particles";

import GUI from "lil-gui";
const gui = new GUI({ container: document.getElementById("debug-gui") }).close();

let controls: OrbitControls;
const uniforms = {
	uTime: { value: 0 }
};

export function load(fileLoader: FileLoader, textureLoader: TextureLoader) {}

export function init() {
	// renderer
	renderer.setClearColor(new Color("#0F172A"));

	// controls
	controls = new OrbitControls(camera, renderer.domElement);
	camera.position.z = 3.5;
	controls.enableDamping = true;
	controls.dampingFactor = 0.05;

	// light
	const light = new AmbientLight(new Color("red"));
	scene.add(light);

	// basic gui
	// const folder = gui.addFolder("First object").close();

	// basic implementation of particle system
	const emitter = new Emitter();
}

export function update(elapsed: number, dt: number) {
	uniforms.uTime.value = dt;
	controls.update();
}

export function resize(width: number, height: number) {}

export function destroy() {}
