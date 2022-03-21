import {
	Color,
	DoubleSide,
	Mesh,
	PlaneBufferGeometry,
	RawShaderMaterial,
	type FileLoader,
	type TextureLoader
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { scene, camera, renderer, size } from "$threejs/scene";
import { add, get } from "$threejs/ressources";

const vertex = `
	uniform mat4 projectionMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 modelMatrix;
	
	attribute vec2 uv;
    attribute vec3 position;

	varying vec2 vUv;

    void main()
    {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    	vec4 viewPosition = viewMatrix * modelPosition;
    	vec4 projectedPosition = projectionMatrix * viewPosition;

    	gl_Position = projectedPosition;
		vUv = uv;
    }
`;

const fragment = `
	precision mediump float;

	uniform vec3 uColor;
	uniform sampler2D uTexture;

	varying vec2 vUv;

	void main()
	{
	    vec4 textureColor = texture2D(uTexture, vUv);
		vec4 color = mix(textureColor, vec4(uColor, 1.0), 0.5);
	    gl_FragColor = textureColor;
	}
`;

let controls: OrbitControls;

export function init() {
	// renderer
	renderer.setClearColor(new Color("turquoise"));

	// mesh
	const sides = 30;
	const geometry = add("plane", "geometry", new PlaneBufferGeometry(1, 1, sides, sides));
	const material = add(
		"plane",
		"material",
		new RawShaderMaterial({
			vertexShader: vertex,
			fragmentShader: fragment,
			side: DoubleSide,
			uniforms: {
				uTexture: { value: get("circle", "texture") }
			}
		})
	);
	console.log(get("circle", "texture"));
	const plane = add("plane", "mesh", new Mesh(geometry, material));
	scene.add(plane);

	// controls
	controls = new OrbitControls(camera, renderer.domElement);
	camera.position.z = 1.5;
	controls.enableDamping = true;
	controls.dampingFactor = 0.05;
	console.log("init");
}

export function load(fileLoader: FileLoader, textureLoader: TextureLoader) {
	add("circle", "texture", textureLoader.load("particles/circle_05.png"));
	console.log("load");
}

export function update(elapsed: number) {
	// controls.update();
}

export function resize(width: number, height: number) {}

export function destroy() {}
