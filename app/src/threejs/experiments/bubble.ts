import type { FileLoader, TextureLoader } from "three";
import { scene, camera, renderer, size } from "$threejs/scene";

export function init() {
	console.log("init");
}

export function load(fileLoader: FileLoader, textureLoader: TextureLoader) {
	console.log("load");
}

export function update(elapsed: number) {}

export function resize(width: number, height: number) {
	console.log("resize");
}

export function destroy() {
	console.log("destroy");
}
