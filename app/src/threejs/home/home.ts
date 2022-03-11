import {
	AmbientLight,
	Color,
	Mesh,
	MeshPhongMaterial,
	PointLight,
	SphereGeometry,
	type FileLoader,
	type TextureLoader
} from "three";
import { scene, camera, renderer, size } from "$threejs/scene";
import { add, get } from "$threejs/ressources";

export function load(fileLoader: FileLoader, textureLoader: TextureLoader) {}

const uniform = { uTime: { value: 0 } };

export function init() {
	// renderer
	renderer.setClearColor(new Color("#0F172A"));

	// lights
	const ambientLight = new AmbientLight(0xffffff, 0.5);
	scene.add(ambientLight);

	const pointLight = new PointLight(0xffffff, 100);
	pointLight.position.set(20, 17, 25);
	scene.add(pointLight);

	// mesh
	const geometry = add("sphere", "geometry", new SphereGeometry(2.1, 40, 40));
	const material = add(
		"sphere",
		"material",
		new MeshPhongMaterial({ color: new Color("crimson"), shininess: 16 })
	);

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

	const sphere = add("sphere", "mesh", new Mesh(geometry, material));
	scene.add(sphere);
}

export function update(elapsed: number) {
	uniform.uTime.value = elapsed;
}

export function resize(width: number, height: number) {}

export function destroy() {}
