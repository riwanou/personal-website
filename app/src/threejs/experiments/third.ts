import { AmbientLight, Color, type FileLoader, type TextureLoader } from "three";
import { scene, camera, renderer, size } from "$threejs/scene";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let controls: OrbitControls;

export function init() {
	// renderer
	renderer.setClearColor(new Color("#0F172A"));

	// controls
	controls = new OrbitControls(camera, renderer.domElement);
	camera.position.z = 1.5;
	controls.enableDamping = true;
	controls.dampingFactor = 0.05;

	// light
	const light = new AmbientLight(new Color("red"));
	scene.add(light);
}

export function load(fileLoader: FileLoader, textureLoader: TextureLoader) {}

export function update(elapsed: number) {}

export function resize(width: number, height: number) {}

export function destroy() {}
