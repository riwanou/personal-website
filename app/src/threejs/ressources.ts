import { type Texture, type BufferGeometry, type Mesh, type ShaderMaterial } from "three";

const loaders = new Map([
	["geometry", new Map<string, BufferGeometry>()],
	["material", new Map<string, ShaderMaterial>()],
	["texture", new Map<string, Texture>()],
	["shader", new Map<string, any>()],
	["mesh", new Map<string, Mesh>()]
]);

function dispose(map: Map<string, any>): void {
	for (const [key, value] of map.entries()) if (value.dispose()) value.dispose();
	map.clear();
}

export function disposeRessources() {
	for (const [, ressourceMap] of Object.entries(loaders)) dispose(ressourceMap);
}

export function add(name: string, type: string, obj: any) {
	if (!loaders.has(type)) return console.error("error, format not found to load the ressource");
	loaders.get(type).set(name, obj);
	return obj;
}

export function get(name: string, type: string) {
	if (!loaders.has(type)) return console.error("error, format not found to find the ressource");
	const loader = loaders.get(type);
	if (!loader.has(name)) return console.error(`error, ${name} not found in ${type} loader`);
	return loader.get(name);
}
