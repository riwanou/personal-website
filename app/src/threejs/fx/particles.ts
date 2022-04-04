import type { Color, Vector3 } from "three";

interface Particle {
	position: Vector3;
	velocity: Vector3;
	size: number;
	rotation: number;
	color: Color;
	alpha: number;
	life: number;
	lifetime: number;
}

class Emitter {
	constructor() {
		console.log("emitter constructor");
	}

	createParticle() {}
	updateParticle() {}
}

export { Emitter };
