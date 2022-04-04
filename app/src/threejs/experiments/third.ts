import {
	AdditiveBlending,
	AmbientLight,
	BufferGeometry,
	Color,
	Float32BufferAttribute,
	LinearInterpolant,
	NormalBlending,
	Points,
	ShaderMaterial,
	Vector3,
	type FileLoader,
	type TextureLoader
} from "three";
import { scene, camera, renderer, size } from "$threejs/scene";
import { add, get } from "$threejs/ressources";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import GUI from "lil-gui";
const gui = new GUI({ container: document.getElementById("debug-gui") });

let controls: OrbitControls;
const uniforms = {
	uTime: { value: 0 }
};

export function load(fileLoader: FileLoader, textureLoader: TextureLoader) {
	add("noise", "texture", textureLoader.load("particles/smoke_01.png"));
}

class Spline {
	interpolant: LinearInterpolant;

	constructor(times: number[], values: number[], sampleValues: number) {
		this.interpolant = new LinearInterpolant(times, values, sampleValues, []);
	}

	get(t: number): number[] {
		return this.interpolant.evaluate(t);
	}
}

class Timer {
	fire: Function;
	totalTime: number;
	current: number;

	constructor(time: number, fire: Function) {
		this.totalTime = time;
		this.current = 0;
		this.fire = fire;
		this.fire();
	}

	update(dt) {
		this.current += dt;
		if (this.current > this.totalTime) {
			this.fire();
			this.current = 0;
		}
	}
}

let particles = [];
const geometry = new BufferGeometry();
const alphaSpline = new Spline([0, 0.05, 0.85, 1], [0, 1, 1, 0], 1);
const colorSpline = new Spline(
	[0, 0.5, 1.0],
	[...new Color("blue").toArray(), ...new Color("red").toArray(), ...new Color("green").toArray()],
	3
);
const sizeSpline = new Spline([0, 0.2, 0.5, 1.0], [0.1, 2, 6, 0.8], 1);

const PARTICLE_SPAWN_TIME = 0.2;

function addParticles() {
	for (let i = 0; i < 10; i++) {
		const life = 5;
		particles.push({
			position: new Vector3(
				(Math.random() * 2 - 1) * 0.2,
				Math.random() * 2 - 5,
				(Math.random() * 2 - 1) * 0.2
			).multiplyScalar(0.3),
			size: (Math.random() * 0.5 + 0.5) * 2.0,
			color: new Color(),
			alpha: 1.0,
			life: life,
			lifetime: life,
			rotation: Math.random() * 2.0 * Math.PI,
			velocity: new Vector3(0, 0.5, 0)
		});
	}
}

const spawnParticleTimer = new Timer(PARTICLE_SPAWN_TIME, addParticles);

function updateParticles(dt) {
	for (let p of particles) p.life -= dt;
	particles = particles.filter((p) => p.life > 0.0);

	for (let p of particles) {
		const t = 1.0 - p.life / p.lifetime;
		p.alpha = alphaSpline.get(t)[0];
		p.rotation += dt;
		p.color = new Color(...colorSpline.get(t));
		p.position.add(p.velocity.clone().multiplyScalar(dt));
		p.size = sizeSpline.get(t)[0];
	}

	particles.sort((a, b) => {
		const d1 = camera.position.distanceToSquared(a.position);
		const d2 = camera.position.distanceToSquared(b.position);
		if (d1 > d2) return -1;
		if (d1 < d2) return 1;
		return 0;
	});
}

function updateGeometry() {
	const positions = [];
	const sizes = [];
	const colors = [];
	const angles = [];

	for (const p of particles) {
		positions.push(p.position.x, p.position.y, p.position.z);
		sizes.push(p.size);
		colors.push(p.color.r, p.color.g, p.color.b, p.alpha);
		angles.push(p.rotation);
	}

	geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
	geometry.setAttribute("size", new Float32BufferAttribute(sizes, 1));
	geometry.setAttribute("color", new Float32BufferAttribute(colors, 4));
	geometry.setAttribute("angle", new Float32BufferAttribute(angles, 1));
	geometry.attributes.position.needsUpdate = true;
	geometry.attributes.size.needsUpdate = true;
	geometry.attributes.color.needsUpdate = true;
	geometry.attributes.angle.needsUpdate = true;
}

export function init() {
	// renderer
	renderer.setClearColor(new Color("#0F172A"));
	// renderer.setClearColor(new Color("skyblue"));

	// controls
	controls = new OrbitControls(camera, renderer.domElement);
	camera.position.z = 3.5;
	controls.enableDamping = true;
	controls.dampingFactor = 0.05;

	// light
	const light = new AmbientLight(new Color("red"));
	scene.add(light);

	// first shader plane
	const folder = gui.addFolder("First object").open();
	const material = new ShaderMaterial({
		uniforms: {
			uPointMultiplier: { value: 200 },
			uTexture: { value: get("noise", "texture") },
			...uniforms
		},
		vertexShader: `
			attribute float size;
			attribute float angle;

			uniform float uPointMultiplier;
			uniform float uTime;

			varying vec4 vColor;
			varying vec2 vAngle;

			void main()
			{
				// position
				vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
				gl_Position = projectionMatrix * mvPosition;

				// size
				gl_PointSize = uPointMultiplier * size / gl_Position.z;

				// to fragment shader
				vAngle = vec2(cos(angle), sin(angle));
				vColor = color;
			}
		`,
		fragmentShader: `
			uniform sampler2D uTexture;

			varying vec4 vColor;
			varying vec2 vAngle;

			void main() 
			{
				vec2 coords = (gl_PointCoord - 0.5) * mat2(vAngle.x, vAngle.y, -vAngle.y, vAngle.x) + 0.5;
				gl_FragColor = texture2D(uTexture, coords) * vColor;
			}
		`,
		transparent: true,
		depthWrite: false,
		depthTest: true,
		vertexColors: true,
		blending: AdditiveBlending
	});

	// particles
	const points = new Points(geometry, material);

	// gui
	const colors = { first: [0, 0, 1], second: [1, 0, 0], third: [0, 1, 0] };
	folder.addColor(colors, "first");
	folder.addColor(colors, "second");
	folder.addColor(colors, "third");
	folder.onChange((event) => {
		colorSpline.interpolant.sampleValues = [...colors.first, ...colors.second, ...colors.third];
	});

	// add
	updateGeometry();
	scene.add(points);
}

function step(dt) {
	spawnParticleTimer.update(dt);
	updateParticles(dt);
	updateGeometry();
}

export function update(elapsed: number, dt: number) {
	uniforms.uTime.value = dt;
	controls.update();
	step(dt);
}

export function resize(width: number, height: number) {}

export function destroy() {}
