import {
	Color,
	type FileLoader,
	TextureLoader,
	AmbientLight,
	RepeatWrapping,
	Vector2,
	AdditiveBlending,
	Group
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
	camera.position.z = 1.5;
	controls.enableDamping = true;
	controls.dampingFactor = 0.05;

	// light
	const light = new AmbientLight(new Color("red"));
	scene.add(light);

	/* First shader object */

	{
		const firstObject = new Group();
		const firstFolder = gui.addFolder("First shader object").close();

		/* First noise plane */
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
		let folder = firstFolder.addFolder("Noise plane 1");
		folder.add(plane.uniforms.uScale, "value", 0.1, 2).name("texture scale");
		folder.add(plane.uniforms.uSpeed.value, "y", -1.5, 1.5).name("speed y");
		folder.add(plane.uniforms.uSpeed.value, "x", -1.5, 1.5).name("speed x");
		folder.addColor(plane.uniforms.uColor, "value").name("color");
		firstObject.add(plane.mesh);

		/* Second noise plane */
		const plane1 = new ShaderPlane({
			name: "plane1",
			blending: AdditiveBlending,
			uniforms: {
				uTexture: { value: get("noise", "texture") },
				uScale: { value: 0.8 },
				uSpeed: { value: new Vector2(0.2, 0.4) },
				uColor: { value: [0.1, 0.1, 0.1] }
			},
			vertex: plane.vertex,
			fragment: plane.fragment
		});
		folder = firstFolder.addFolder("Noise plane 2");
		folder.add(plane1.uniforms.uScale, "value", 0.1, 2).name("texture scale");
		folder.add(plane1.uniforms.uSpeed.value, "y", -1.5, 1.5).name("speed y");
		folder.add(plane1.uniforms.uSpeed.value, "x", -1.5, 1.5).name("speed x");
		folder.addColor(plane1.uniforms.uColor, "value").name("color");
		plane1.mesh.position.z = 0.001;
		plane1.mesh.scale.setScalar(0.6);
		firstObject.add(plane1.mesh);

		/* Color plane */
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
		folder = firstFolder.addFolder("Color plane");
		folder.addColor(colorPlane.uniforms.uBgColor, "value").name("bg-color1");
		firstObject.add(colorPlane.mesh);

		firstObject.position.setX(-1.1);
		scene.add(firstObject);
	}

	/* Second shader object */

	{
		const secondObject = new Group();
		const secondFolder = gui.addFolder("Second shader object").open();

		/* First plane */
		const plane = new ShaderPlane({
			name: "plane",
			nbVertices: 10,
			uniforms: {
				uColor: { value: [1.0, 0.7, 0.6] },
				...uniforms
			},
			fragmentVar: `
				uniform vec3 uColor;
			`,
			fragmentFunc: `
				// color = vec4(uColor, 1.0);
				color = vec4(uv, 1.0, 1.0);
			`
		});
		let folder = secondFolder.addFolder("Noise plane 1");
		folder.addColor(plane.uniforms.uColor, "value").name("color");
		secondObject.add(plane.mesh);

		secondObject.position.setX(0.4);
		scene.add(secondObject);
	}
}

export function update(elapsed: number) {
	uniforms.uTime.value = elapsed;
	controls.update();
}

export function resize(width: number, height: number) {}

export function destroy() {}
