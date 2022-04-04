import { Color, Vector3 } from "three";

function random(min = 0.0, max = 1.0): number {
	return Math.random() * (max - min) + min;
}

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
	emissionRate: number;
	emissionAcumulator: number;
	particles: Particle[];

	constructor(emissionRate = 1.0) {
		this.emissionRate = emissionRate;
		this.emissionAcumulator = 1.0 / this.emissionRate;
		this.particles = [];
	}

	createParticle(): Particle {
		const life = 5.0;
		return {
			position: new Vector3(random(), random(), random()).multiplyScalar(10),
			velocity: new Vector3(0, 5, 0),
			size: random(0.5, 1.0),
			rotation: random() * Math.PI * 2,
			color: new Color(random(), random(), random()),
			alpha: 1.0,
			life: life,
			lifetime: life
		};
	}

	updateParticle() {}

	update(dt) {
		if (this.emissionRate > 0.0) {
			this.emissionAcumulator += dt;
			const n = Math.floor(this.emissionRate * this.emissionAcumulator);
			this.emissionAcumulator -= n / this.emissionRate;
			for (let i = 0; i < n; i++) {
				const p = this.createParticle();
				this.particles.push(p);
			}
		}
	}
}

export { Emitter };
