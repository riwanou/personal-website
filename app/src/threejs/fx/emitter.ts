import { Color, NormalBlending, Object3D, Vector3 } from "three";
import type { Blending } from "three";
import type { Module } from "./module";
import type { Particle } from "./particle";
import * as DEFAULT from "./constant";

function random(min = 0.0, max = 1.0): number {
	return Math.random() * (max - min) + min;
}

class Emitter extends Object3D {
	emissionRate: number;
	emissionAcumulator: number;
	particles: Particle[];
	modules: Map<Function, Module>;

	position: Vector3;
	gravity: number;
	variance: number;

	lifetime: number;
	spawnSize: number;
	spawnSpeed: number;
	spawnRotation: number;
	spawnColor: Color;
	spawnAlpha: number;
	blending: Blending;

	constructor({
		emissionRate = DEFAULT.EMISSION_RATE,
		lifetime = DEFAULT.LIFETIME,
		spawnSize = DEFAULT.SIZE,
		spawnSpeed = DEFAULT.SPEED,
		spawnRotation = DEFAULT.ROTATION,
		spawnColor = DEFAULT.COLOR,
		spawnAlpha = DEFAULT.ALPHA,
		gravity = DEFAULT.GRAVITY,
		variance = DEFAULT.VARIANCE
	}) {
		super();

		this.emissionRate = emissionRate;
		this.emissionAcumulator = 1.0 / this.emissionRate;
		this.particles = [];
		this.modules = new Map<Function, Module>();

		this.lifetime = lifetime;
		this.spawnSize = spawnSize;
		this.spawnSpeed = spawnSpeed;
		this.spawnRotation = spawnRotation;
		this.spawnColor = spawnColor;
		this.spawnAlpha = spawnAlpha;
		this.gravity = gravity;
		this.variance = variance;
		this.blending = NormalBlending;
	}

	addModule(module: Module) {
		this.modules.set(module.constructor, module);
	}

	removeModule(moduleClass: Function) {
		this.modules.delete(moduleClass);
	}

	updateModules(particle: Particle, t: number, dt: number) {
		for (const [, module] of this.modules) module.update(particle, t, dt);
	}

	createParticle(): Particle {
		const particle: Particle = {
			position: this.position.clone(),
			velocity: new Vector3(
				random(-this.variance, this.variance),
				this.spawnSpeed,
				random(-this.variance, this.variance)
			).applyQuaternion(this.quaternion),
			acceleration: new Vector3(0, -this.gravity, 0),
			size: this.spawnSize,
			rotation: this.spawnRotation,
			color: this.spawnColor,
			alpha: this.spawnAlpha,
			lifetime: this.lifetime,
			life: this.lifetime
		};
		this.updateModules(particle, 0, 0);
		return particle;
	}

	updateParticles(dt): void {
		for (let i = this.particles.length - 1; i >= 0; i--) {
			const p = this.particles[i];
			p.life -= dt;
			if (p.life <= 0) this.particles.splice(i, 1);
			const t = 1.0 - p.life / p.lifetime;

			p.velocity.add(p.acceleration.clone().multiplyScalar(dt));
			p.position.add(p.velocity.clone().multiplyScalar(dt));
			p.alpha = this.spawnAlpha - t;

			this.updateModules(p, t, dt);
		}
	}

	update(dt) {
		this.updateParticles(dt);
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
