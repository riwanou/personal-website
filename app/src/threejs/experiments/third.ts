import {
	AmbientLight,
	BufferAttribute,
	BufferGeometry,
	Color,
	Points,
	ShaderMaterial,
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

export function load(fileLoader: FileLoader, textureLoader: TextureLoader) {}

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

	// first shader plane
	const folder = gui.addFolder("First object").open();
	const material = new ShaderMaterial({
		uniforms: {
			uColor: { value: [1.0, 0.5, 0.6] },
			uSize: { value: 60.0 * renderer.getPixelRatio() },
			...uniforms
		},
		vertexShader: `
			attribute float aScale;
			uniform float uSize;
			uniform float uTime;
			varying vec2 vUv;

			void main()
			{
				// position
				vec3 pos = position;
				pos.x += cos(uTime * pos.y * aScale * 0.2) * 0.1;
				pos.y -= sin(uTime * pos.x * aScale * 0.11) * 0.12;


				vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
				vec4 viewPosition = viewMatrix * modelPosition;
				vec4 projectedPosition = projectionMatrix * viewPosition;
				gl_Position = projectedPosition;

				// size
				gl_PointSize = uSize * aScale;
				gl_PointSize *= (1.0 / - viewPosition.z);

				vUv = uv;
			}
		`,
		fragmentShader: `
			uniform vec3 uColor;
			varying vec2 vUv;

			void main() 
			{
				float strength = distance(gl_PointCoord, vec2(0.5));
				strength = 1.0 - strength;
				strength = smoothstep(0.5, 1.0, strength);
				gl_FragColor = vec4(uColor, strength);
			}
		`,
		transparent: true,
		depthTest: true,
		depthWrite: false
	});
	let sub = folder.addFolder("Plane");
	sub.addColor(material.uniforms.uColor, "value").name("color");
	sub.add(material.uniforms.uSize, "value", 1.0, 200.0).name("size");

	// particles
	const geometry = new BufferGeometry();
	const count = 5000;
	const distance = 30;

	// attributes
	const positions = new Float32Array(count * 3);
	const scales = new Float32Array(count * 1);
	for (let i = 0; i < count; i++) {
		positions[i * 3] = (Math.random() - 0.5) * distance;
		positions[i * 3 + 1] = (Math.random() - 0.5) * distance;
		positions[i * 3 + 2] = (Math.random() - 0.5) * distance;
		scales[i] = Math.random() * 2;
	}

	// add
	geometry.setAttribute("position", new BufferAttribute(positions, 3));
	geometry.setAttribute("aScale", new BufferAttribute(scales, 1));
	const points = new Points(geometry, material);
	scene.add(points);
}

export function update(elapsed: number) {
	uniforms.uTime.value = elapsed;
	controls.update();
}

export function resize(width: number, height: number) {}

export function destroy() {}
