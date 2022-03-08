import { Color, type FileLoader, type TextureLoader } from "three";
import { scene, camera, renderer, size } from "$threejs/scene";

export function init() {
	renderer.setClearColor(new Color("pink"));
}

export function load(fileLoader: FileLoader, textureLoader: TextureLoader) {}

export function update(elapsed: number) {}

export function resize(width: number, height: number) {}

export function destroy() {}