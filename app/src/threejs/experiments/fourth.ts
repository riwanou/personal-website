import {
	AmbientLight,
	Color,
	DoubleSide,
	InstancedBufferAttribute,
	InstancedMesh,
	Matrix4,
	Mesh,
	MeshBasicMaterial,
	Object3D,
	PlaneGeometry,
	ShaderMaterial,
	type FileLoader,
	type TextureLoader
} from "three";
import { scene, camera, renderer, size } from "$threejs/scene";
import { add, get } from "$threejs/ressources";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Emitter, ParticleRenderer } from "../fx/particles";

import GUI from "lil-gui";
const gui = new GUI({ container: document.getElementById("debug-gui") }).close();

let controls: OrbitControls;
const uniforms = {
	uTime: { value: 0 }
};

// particles
let emitter: Emitter;
let particleRenderer: ParticleRenderer;

// load
export function load(fileLoader: FileLoader, textureLoader: TextureLoader) {
	add("noise", "texture", textureLoader.load("particles/smoke_01.png"));
}

export function init() {
	// renderer
	renderer.setClearColor(new Color("#0F172A"));

	// controls
	controls = new OrbitControls(camera, renderer.domElement);
	camera.position.z = 15;
	controls.enableDamping = true;
	controls.dampingFactor = 0.05;

	// light
	const light = new AmbientLight(new Color("red"));
	scene.add(light);

	// basic implementation of particle system
	emitter = new Emitter(5);
	particleRenderer = new ParticleRenderer(75000, get("noise", "texture"));
	scene.add(particleRenderer.instanced);

	// gui
	gui.add(emitter, "emissionRate", 0, 200);
}

export function update(elapsed: number, dt: number) {
	uniforms.uTime.value = dt;
	controls.update();
	// particles
	emitter.update(dt);
	particleRenderer.render(emitter.particles);
}

export function resize(width: number, height: number) {}

export function destroy() {}
