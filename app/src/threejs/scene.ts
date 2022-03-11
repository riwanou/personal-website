import {
	Scene,
	Clock,
	PerspectiveCamera,
	WebGLRenderer,
	sRGBEncoding,
	FileLoader,
	LoadingManager,
	TextureLoader,
	ShaderMaterial
} from "three";

// ressources
import { disposeRessources } from "./ressources";

// three js main components
export let scene: Scene;
export let camera: PerspectiveCamera;
export let renderer: WebGLRenderer;

// utils objects
export let size = { w: 0, h: 0 };
const clock = new Clock();

export async function createScene(canvas, init: Function, load: Function) {
	// renderer settings
	renderer = new WebGLRenderer({
		antialias: true,
		canvas: canvas,
		preserveDrawingBuffer: true
	});

	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.physicallyCorrectLights = true;
	renderer.outputEncoding = sRGBEncoding;

	// scene and ressources
	scene = new Scene();

	// camera settings
	camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.z = 5;
	scene.add(camera);

	// load ressources
	let loadingManager = new LoadingManager();
	loadingManager.onProgress = () => console.log("loading..");
	loadingManager.onLoad = () => console.log("loading finished!");

	// loaders
	let fileLoader = new FileLoader(loadingManager);
	let textureLoader = new TextureLoader(loadingManager);
	if (load) load(fileLoader, textureLoader);

	// init scene
	if (init) init();
}

export function updateScene(update: Function) {
	const elapsed = clock.getElapsedTime();
	if (update) update(elapsed);
}

export function resizeScene(width: number, height: number, resize: Function) {
	size = { w: width, h: height };
	renderer.setSize(width, height);
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	if (resize) resize(width, height);
}

export function renderScene() {
	renderer.render(scene, camera);
}

export function destroyScene(destroy) {
	disposeRessources();
	if (destroy) destroy();
	renderer.dispose();
}
