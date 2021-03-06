import {
	Color,
	type FileLoader,
	TextureLoader,
	AmbientLight,
	RepeatWrapping,
	Vector2,
	AdditiveBlending,
	Group,
	CircleGeometry,
	PlaneGeometry
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { scene, camera, renderer, size } from "$threejs/scene";
import { add, get } from "$threejs/ressources";
import { ShaderObject } from "$threejs/shader-object";

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
	renderer.setClearColor(new Color("#0F172A"));

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
		const plane = new ShaderObject({
			name: "plane",
			blending: AdditiveBlending,
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
		const plane1 = new ShaderObject({
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
		const colorPlane = new ShaderObject({
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

		firstObject.position.set(-0.9, -0.5, 0.0);
		scene.add(firstObject);
	}

	/* Second shader object */
	{
		const secondObject = new Group();
		const secondFolder = gui.addFolder("Second shader object").close();

		/* First plane */
		const circle = new ShaderObject({
			name: "circle",
			geometry: new CircleGeometry(0.5, 50),
			uniforms: {
				uColor: { value: [1.0, 0.7, 0.6] },
				...uniforms
			},
			fragmentVar: `
				uniform vec3 uColor;
			`,
			fragmentFunc: `
				uv += 0.04;
				float barX = step(0.8, mod(uv.y * 10.0, 1.0)) * step(0.4, mod(uv.x * 10.0 - 0.2, 1.0));
				float barY = step(0.8, mod(uv.x * 10.0, 1.0)) * step(0.4, mod(uv.y * 10.0 - 0.2, 1.0));
				float strength = barX + barY;
				color = vec4(uColor, strength);
			`
		});
		let folder = secondFolder.addFolder("Plane");
		folder.addColor(circle.uniforms.uColor, "value").name("color");
		secondObject.add(circle.mesh);

		secondObject.position.set(-0.9, 0.6, 0.0);
		scene.add(secondObject);
	}

	/* Third shader object */
	{
		const thirdObject = new Group();
		const thirdFolder = gui.addFolder("Third shader object").close();

		/* First plane */
		const plane = new ShaderObject({
			name: "pattern",
			geometry: new PlaneGeometry(1, 1, 40),
			uniforms: {
				uColor: { value: [1.0, 0.7, 0.6] },
				...uniforms
			},
			fragmentVar: `
				uniform vec3 uColor;
			`,
			fragmentFunc: `
				uv += 0.04;
				float power = 0.02;
				float speed = 10.0;

				vec2 waved = vec2(
					sin(uv.y * 20.0 + uTime * speed) * power,
					sin(uv.x * 20.0 + uTime) * power
				);
				uv += waved;

				float strength = 0.1 / distance(vec2(uv.x, uv.y * 0.5), vec2(0.5, 0.25));
				vec4 combined = vec4(uColor, strength);

				float bar = 1.0 - abs(uv.x - 0.5) * 3.0;
				combined.a *= bar;

				color = combined;
			`
		});
		let folder = thirdFolder.addFolder("Plane");
		folder.addColor(plane.uniforms.uColor, "value").name("color");
		thirdObject.add(plane.mesh);
		plane.mesh.renderOrder = 1;

		thirdObject.position.set(1.4, -0.3, 0.0);
		scene.add(thirdObject);
	}
	/* Fourth shader object */
	{
		const fourthObject = new Group();
		const fourthFolder = gui.addFolder("Fourth shader object").open();

		/* First plane */
		const plane = new ShaderObject({
			name: "last",
			uniforms: {
				uColor: { value: [0.7, 1.0, 0.6] },
				uSize: { value: 0.4 },
				uFactor: { value: 10.0 },
				uRotation: { value: 0.0 },
				...uniforms
			},
			fragmentVar: `
				uniform vec3 uColor;
				uniform float uSize;
				uniform float uFactor;
				uniform float uRotation;
			`,
			fragmentFunc: `
				uv = rotate(uv, PI * uRotation + uTime * 0.5, vec2(0.5));
				float strength = uSize / distance(vec2(uv.x, (uv.y - 0.5) * uFactor + 0.5), vec2(0.5)); 
				strength *= uSize / distance(vec2((uv.x - 0.5) * uFactor + 0.5, uv.y), vec2(0.5)); 
				strength = smoothstep(0.1, 0.4, strength);
				color = vec4(uColor, strength);
			`
		});
		let folder = fourthFolder.addFolder("Plane");
		folder.addColor(plane.uniforms.uColor, "value").name("color");
		folder.add(plane.uniforms.uSize, "value", 0.01, 2.0).name("size");
		folder.add(plane.uniforms.uFactor, "value", 0.01, 20.0).name("factor");
		folder.add(plane.uniforms.uRotation, "value", 0.0, 2.0).name("rotation");
		fourthObject.add(plane.mesh);

		fourthObject.position.set(0.3, 0.0, 0.0);
		scene.add(fourthObject);
	}
}

export function update(elapsed: number, dt: number) {
	uniforms.uTime.value = elapsed;
	controls.update();
}

export function resize(width: number, height: number) {}

export function destroy() {}
