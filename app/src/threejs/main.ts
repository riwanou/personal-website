import {
	Scene,
	Clock,
	PerspectiveCamera,
	WebGLRenderer,
	BoxGeometry,
	MeshBasicMaterial,
	Mesh
} from "three";

let scene: Scene;
let camera: PerspectiveCamera;
let renderer: WebGLRenderer;

export function createScene(canvas) {
	renderer = new WebGLRenderer({ antialias: true, canvas: canvas });
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	// renderer.setClearColor(0xff0000, 1);

	scene = new Scene();

	camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.z = 5;
	scene.add(camera);

	const geometry = new BoxGeometry();
	const material = new MeshBasicMaterial({ color: 0x00ffff });
	const cube = new Mesh(geometry, material);
	scene.add(cube);
}

export function renderScene() {
	renderer.render(scene, camera);
}

export function destroyScene() {
	renderer.dispose();
}

// const clock = new Clock();

// export function run() {
// 	const elapsedTime = clock.getElapsedTime();

// 	// scene.updateScene(elapsedTime);
// 	// scene.renderScene();

// 	window.requestAnimationFrame(run);
// }
