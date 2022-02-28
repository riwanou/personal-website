import {
	Scene,
	Clock,
	PerspectiveCamera,
	WebGLRenderer,
	Mesh,
	sRGBEncoding,
	FileLoader,
	Color,
	SphereGeometry,
	ShaderMaterial,
	PointLight,
	AmbientLight,
	MeshPhongMaterial
} from "three";

// three js main components
let scene: Scene;
let camera: PerspectiveCamera;
let renderer: WebGLRenderer;
let fileLoader: FileLoader;

// utils objects
let size = { w: 0, h: 0 };
const clock = new Clock();

// ressources
const materials = new Map<string, ShaderMaterial>();

// shaders
const shaders = new Map();
async function loadShader(name, path) {
	const res = await fileLoader.loadAsync(path);
	shaders.set(name, res);
}

const uniform = { uTime: { value: 0 } };

export async function createScene(canvas) {
	// renderer settings
	renderer = new WebGLRenderer({
		antialias: true,
		canvas: canvas,
		preserveDrawingBuffer: true,
		alpha: true
	});
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.physicallyCorrectLights = true;
	renderer.outputEncoding = sRGBEncoding;

	// scene and loaders
	scene = new Scene();
	fileLoader = new FileLoader();

	// camera settings
	camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.z = 5;
	scene.add(camera);

	// load shaders
	// await loadShader("basic.vr", "shaders/basic.vr");
	// await loadShader("basic.fa", "shaders/basic.fa");

	// lights
	const ambientLight = new AmbientLight(0xffffff, 0.5);
	scene.add(ambientLight);

	const pointLight = new PointLight(0xffffff, 100);
	pointLight.position.set(20, 17, 25);
	scene.add(pointLight);

	// geometry and materials
	const geometry = new SphereGeometry(2.1, 40, 40);
	const material = new MeshPhongMaterial({ color: new Color("crimson"), shininess: 16 });

	// custom shader code in standart material
	material.onBeforeCompile = (shader) => {
		shader.uniforms = { ...uniform, ...shader.uniforms };
		shader.vertexShader = "uniform float time;\n" + shader.vertexShader;

		// before main function
		shader.vertexShader = shader.vertexShader.replace(
			"#include <common>",
			`
				#include <common>
				uniform float uTime;
				float intensity = 0.1;
				vec2 frequency = vec2(4, 2);
			`
		);

		// in main function
		shader.vertexShader = shader.vertexShader.replace(
			"#include <begin_vertex>",
			`
				#include <begin_vertex>

  				transformed.z += sin(transformed.x * frequency.x + uTime) * intensity;
  				transformed.z += sin(transformed.y * frequency.y + uTime) * intensity;
			`
		);
	};

	const plane = new Mesh(geometry, material);
	scene.add(plane);
}

export function updateScene() {
	const elapsed = clock.getElapsedTime();
	uniform.uTime.value = elapsed;
}

export function resizeScene(width: number, height: number) {
	size = { w: width, h: height };
	renderer.setSize(width, height);
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
}

export function renderScene() {
	renderer.render(scene, camera);
}

export function destroyScene() {
	renderer.dispose();
}
