import {
	Color,
	type FileLoader,
	TextureLoader,
	AmbientLight,
	RepeatWrapping,
	Vector2,
	AdditiveBlending
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { scene, camera, renderer, size } from "$threejs/scene";
import { add, get } from "$threejs/ressources";
import { ShaderPlane } from "../shader-plane";

import GUI from "lil-gui";

let controls: OrbitControls;
// updatable shader variables
const uniforms = {
	uTime: { value: 0 }
};

// debug gui
const gui = new GUI({ container: document.getElementById("debug-gui") });

export function load(fileLoader: FileLoader, textureLoader: TextureLoader) {
	add(
		"noise",
		"texture",
		textureLoader.load("noises/noise_13.png", (t) => {
			t.wrapS = RepeatWrapping;
			t.wrapT = RepeatWrapping;
		})
	);
}

export function init() {
	// renderer
	renderer.setClearColor(new Color("gray"));

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
		uniforms: {
			uTexture: { value: get("noise", "texture") },
			uScale: { value: 1 },
			uSpeed: { value: new Vector2(0.6, 0.1) },
			uColor: { value: [0.1, 0.1, 0.1] },
			...uniforms
		},
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

	let folder = gui.addFolder("noise-plane");
	folder.add(plane.uniforms.uScale, "value", 0.1, 2).name("texture scale");
	folder.add(plane.uniforms.uSpeed.value, "y", -1.5, 1.5).name("speed y");
	folder.add(plane.uniforms.uSpeed.value, "x", -1.5, 1.5).name("speed x");
	folder.addColor(plane.uniforms.uColor, "value").name("color");

	scene.add(plane.mesh);

	const plane1 = new ShaderPlane({
		name: "plane1",
		material: plane.material
	});
	plane1.mesh.position.z = 0.001;
	plane1.mesh.scale.setScalar(0.5);

	scene.add(plane1.mesh);

	const colorPlane = new ShaderPlane({
		name: "color-plane",
		uniforms: {
			uBgColor: { value: [0.4, 0.7, 1.0] }
		},
		fragmentVar: `
			uniform vec3 uBgColor;
		`,
		fragmentFunc: `
			color = vec4(uBgColor, 1.0);
		`
	});
	colorPlane.mesh.position.setZ(-0.001);

	folder = gui.addFolder("color-plane");
	folder.addColor(colorPlane.uniforms.uBgColor, "value").name("bg-color1");

	scene.add(colorPlane.mesh);
}

export function update(elapsed: number) {
	uniforms.uTime.value = elapsed;
	controls.update();
}

export function resize(width: number, height: number) {}

export function destroy() {}
