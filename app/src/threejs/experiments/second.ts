import {
	Color,
	type FileLoader,
	TextureLoader,
	AmbientLight,
	RepeatWrapping,
	Vector2,
	AdditiveBlending,
	SubtractiveBlending
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { scene, camera, renderer, size } from "$threejs/scene";
import { add, get } from "$threejs/ressources";
import { ShaderPlane } from "../shader-plane";

import GUI from "lil-gui";

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
	const plane = new ShaderPlane({
		name: "plane",
		blending: AdditiveBlending,
		nbVertices: 30,
		uniforms: uniforms,
		fragmentVar: `
			uniform sampler2D uTexture;
			uniform vec3 uColor;
			uniform float uScale;
			uniform vec2 uSpeed;
		`,
		fragmentFunc: `
			uv.x = vUv.x + uTime * uSpeed.x;
			uv.y = vUv.y + uTime * uSpeed.y;
  			color = texture2D(uTexture, vec2(uv.x, uv.y) * uScale) * vec4(uColor, 1.0);
		`
	});

	const plane1 = new ShaderPlane({
		name: "plane1",
		material: plane.material
	});
	plane1.mesh.position.z = 0.2;
	plane1.mesh.scale.setScalar(0.5);

	scene.add(plane.mesh, plane1.mesh);

	const superPlane = new ShaderPlane({
		name: "super-plane",
		blending: SubtractiveBlending,
		uniforms: {
			uTexture: { value: get("circle", "texture") },
			uColor: uniforms.uColor
		},
		fragmentVar: `
			uniform vec3 uColor;
			uniform sampler2D uTexture;
			float scale = 0.2;
		`,
		fragmentFunc: `
  			color = texture2D(uTexture, vec2(uv.x, uv.y) * scale) * vec4(uColor,1.0);
		`
	});
	superPlane.mesh.position.setZ(0.5);
	scene.add(superPlane.mesh);
}

export function update(elapsed: number) {
	uniforms.uTime.value = elapsed;
	controls.update();
}

export function resize(width: number, height: number) {}

export function destroy() {}
