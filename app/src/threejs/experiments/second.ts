import {
	Color,
	DoubleSide,
	Mesh,
	PlaneBufferGeometry,
	RawShaderMaterial,
	type FileLoader,
	TextureLoader,
	AmbientLight,
	AdditiveBlending,
	RepeatWrapping,
	Vector2
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { scene, camera, renderer, size } from "$threejs/scene";
import { add, get } from "$threejs/ressources";

import GUI from "lil-gui";

const vertex = `
	uniform mat4 projectionMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 modelMatrix;
	
	attribute vec2 uv;
    attribute vec3 position;

	varying vec2 vUv;

	uniform float uTime;

    void main()
    {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    	vec4 viewPosition = viewMatrix * modelPosition;
    	vec4 projectedPosition = projectionMatrix * viewPosition;

		vUv = uv;
    	gl_Position = projectedPosition;
    }
`;

const fragment = `
precision mediump float;

uniform sampler2D uTexture;
uniform float uTime;
uniform float uScale;
uniform vec2 uSpeed;
uniform vec3 uColor;

varying vec2 vUv;

void main() {
	vec2 uv = vUv;
	uv.x = vUv.x + uTime * uSpeed.x;
	uv.y = vUv.y + uTime * uSpeed.y;
  	vec4 textureColor = texture2D(uTexture, vec2(uv.x, uv.y) * uScale) * vec4(uColor, 1.0);
  	gl_FragColor = textureColor;
}
`;

let controls: OrbitControls;
// updatable shader variables
const uniforms = {
	uTime: { value: 0 },
	uScale: { value: 1 },
	uSpeed: { value: new Vector2(0.6, 0.1) },
	uColor: { value: [1, 1, 1] }
};

// debug gui
const gui = new GUI({ container: document.getElementById("debug-gui") });
gui.add(uniforms.uScale, "value", 0.1, 2).name("texture scale");
gui.add(uniforms.uSpeed.value, "x", 0.1, 1.5).name("speed x");
gui.add(uniforms.uSpeed.value, "y", 0.1, 1.5).name("speed y");
gui.addColor(uniforms.uColor, "value").name("color");

export function load(fileLoader: FileLoader, textureLoader: TextureLoader) {
	add(
		"circle",
		"texture",
		textureLoader.load("noises/noise_13.png", (t) => {
			t.wrapS = RepeatWrapping;
			t.wrapT = RepeatWrapping;
		})
	);
}

export function init() {
	// renderer
	renderer.setClearColor(new Color("turquoise"));

	// controls
	controls = new OrbitControls(camera, renderer.domElement);
	camera.position.z = 4.5;
	controls.enableDamping = true;
	controls.dampingFactor = 0.05;

	// light
	const light = new AmbientLight(new Color("red"));
	scene.add(light);

	// mesh
	const sides = 30;
	const geometry = add("plane", "geometry", new PlaneBufferGeometry(4, 4, sides, sides));
	// const geometry = add("plane", "geometry", new TubeGeometry());
	// const geometry = add("plane", "geometry", new CylinderGeometry(1.3, 1.7, 3.5));
	const material = add(
		"plane",
		"material",
		new RawShaderMaterial({
			vertexShader: vertex,
			fragmentShader: fragment,
			side: DoubleSide,
			uniforms: {
				uTexture: { value: get("circle", "texture") },
				...uniforms
			},
			transparent: true,
			blending: AdditiveBlending
		})
	);
	const plane = add("plane", "mesh", new Mesh(geometry, material));
	scene.add(plane);
}

export function update(elapsed: number) {
	uniforms.uTime.value = elapsed;
	controls.update();
}

export function resize(width: number, height: number) {}

export function destroy() {}
