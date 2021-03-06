import {
	AdditiveBlending,
	AmbientLight,
	Color,
	DoubleSide,
	InstancedBufferAttribute,
	InstancedMesh,
	Matrix4,
	Mesh,
	MeshBasicMaterial,
	MultiplyBlending,
	NormalBlending,
	Object3D,
	PlaneGeometry,
	ShaderMaterial,
	SubtractiveBlending,
	Vector3,
	type FileLoader,
	type TextureLoader
} from "three";
import { scene, camera, renderer, size } from "$threejs/scene";
import { add, get } from "$threejs/ressources";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ParticleRenderer } from "../fx/particle";

import GUI from "lil-gui";
import { Emitter } from "$threejs/fx/emitter";
import { AlphaModule, ColorModule } from "$threejs/fx/module";
const gui = new GUI({ container: document.getElementById("debug-gui") });

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
	// renderer.setClearColor(new Color("gray"));

	// controls
	controls = new OrbitControls(camera, renderer.domElement);
	camera.position.z = 15;
	controls.enableDamping = true;
	controls.dampingFactor = 0.05;

	// light
	const light = new AmbientLight(new Color("red"));
	scene.add(light);

	// basic implementation of particle system
	emitter = new Emitter({ emissionRate: 10 });
	// emitter.addModule(new AlphaModule([0.0, 0.1, 1.0], [0, 1, 0]));
	// emitter.addModule(
	// 	new ColorModule(
	// 		[0, 0.15, 0.25, 0.5],
	// 		[new Color("blue"), new Color("orange"), new Color("red"), new Color("gray")]
	// 	)
	// );

	particleRenderer = new ParticleRenderer(75000, get("noise", "texture"));
	scene.add(particleRenderer.instanced);

	// gui
	gui.add(emitter, "emissionRate", 0, 500);
	gui.add(emitter, "lifetime", 0, 10);
	gui.add(emitter, "spawnSize", 0, 5);
	gui.add(emitter, "spawnSpeed", 0, 20);
	gui.addColor(emitter, "spawnColor");
	gui.add(emitter, "spawnAlpha", 0, 1);
	gui.add(emitter, "gravity", 0, 10);
	gui.add(emitter, "variance", 0, 5);
	gui.add(emitter, "blending", {
		Normal: NormalBlending,
		Additive: AdditiveBlending,
		Substractive: SubtractiveBlending
	});
}

export function update(elapsed: number, dt: number) {
	uniforms.uTime.value = dt;
	controls.update();
	// particles
	emitter.update(dt);
	particleRenderer.render(emitter);
}

export function resize(width: number, height: number) {}

export function destroy() {}
