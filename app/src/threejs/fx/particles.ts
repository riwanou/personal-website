import {
	AdditiveBlending,
	BufferGeometry,
	Color,
	DoubleSide,
	InstancedBufferAttribute,
	InstancedMesh,
	LinearInterpolant,
	Object3D,
	PlaneGeometry,
	ShaderMaterial,
	Texture,
	Vector3
} from "three";

function random(min = 0.0, max = 1.0): number {
	return Math.random() * (max - min) + min;
}

class Spline {
	interpolant: LinearInterpolant;

	constructor(times: number[], values: number[], sampleValues: number) {
		this.interpolant = new LinearInterpolant(times, values, sampleValues, []);
	}

	get(t: number): number[] {
		return this.interpolant.evaluate(t);
	}
}

interface Particle {
	position: Vector3;
	velocity: Vector3;
	acceleration: Vector3;
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
	alphaSpline: Spline;

	constructor(emissionRate = 1.0) {
		this.emissionRate = emissionRate;
		this.emissionAcumulator = 1.0 / this.emissionRate;
		this.particles = [];
		this.alphaSpline = new Spline([0, 0.1, 0.8, 1.0], [0, 1, 1, 0], 1);
	}

	createParticle(): Particle {
		const life = 3.0;
		return {
			position: new Vector3(random(), random() - 10.0, random()).multiplyScalar(1),
			velocity: new Vector3(2.0, 5.0, 0),
			acceleration: new Vector3(-0.05, 0, 0),
			size: random(2.0, 5.0),
			rotation: random() * Math.PI * 2,
			color: new Color(random(), random(), random()),
			alpha: 0.0,
			life: life,
			lifetime: life
		};
	}

	updateParticles(dt) {
		for (let i = this.particles.length - 1; i >= 0; i--) {
			const p = this.particles[i];

			p.life -= dt;
			if (p.life <= 0) this.particles.splice(i, 1);
			const t = 1.0 - p.life / p.lifetime;

			p.velocity.add(p.acceleration);
			p.position.add(p.velocity.clone().multiplyScalar(dt));
			p.alpha = this.alphaSpline.get(t)[0];
			p.rotation += dt;
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

// rendering the particles
// we use 3D quad here
class ParticleRenderer {
	geometry: BufferGeometry;
	material: ShaderMaterial;
	instanced: InstancedMesh;
	dummy: Object3D;
	count: number;

	constructor(maxParticles = 75000, texture: Texture) {
		this.count = maxParticles;
		this.material = new ShaderMaterial({
			uniforms: {
				uTexture: { value: texture }
			},
			vertexShader: `
                attribute vec4 color;
                attribute vec3 translate;
				attribute vec2 info;
    
                varying vec2 vUv;
                varying vec2 vAngle;
                varying vec4 vColor;
    
                void main() {
					float size = info.x;
					float angle = info.y;

                    vec4 mvPosition = modelViewMatrix * vec4(translate, 1.0);
					mvPosition.xyz += position * size;
                    gl_Position = projectionMatrix * mvPosition;
    
                    vUv = uv;
                    vAngle = vec2(cos(angle), sin(angle));
                    vColor = color;
                }
            `,
			fragmentShader: `
				uniform sampler2D uTexture;

                varying vec2 vUv;
                varying vec2 vAngle;
                varying vec4 vColor;
            
                void main() {
                    vec2 coords = (vUv - 0.5) * mat2(vAngle.x, vAngle.y, -vAngle.y, vAngle.x) + 0.5;
                    gl_FragColor = texture2D(uTexture, coords) * vColor;
                }
            `,
			transparent: true,
			side: DoubleSide,
			depthWrite: false,
			depthTest: true,
			blending: AdditiveBlending
		});

		this.geometry = new PlaneGeometry();
		this.geometry.setAttribute(
			"translate",
			new InstancedBufferAttribute(new Float32Array(this.count * 3), 3)
		);
		this.geometry.setAttribute(
			"color",
			new InstancedBufferAttribute(new Float32Array(this.count * 4), 4)
		);
		this.geometry.setAttribute(
			"info",
			new InstancedBufferAttribute(new Float32Array(this.count), 2)
		);

		this.instanced = new InstancedMesh(this.geometry, this.material, this.count);
		this.dummy = new Object3D();
	}

	render(particles: Particle[]) {
		const translates = this.instanced.geometry.getAttribute("translate");
		const colors = this.instanced.geometry.getAttribute("color");
		const infos = this.instanced.geometry.getAttribute("info");
		for (const [i, p] of particles.entries()) {
			this.instanced.setColorAt(i, new Color(1, 1, 1));
			translates.setXYZ(i, p.position.x, p.position.y, p.position.z);
			colors.setXYZW(i, p.color.r, p.color.g, p.color.b, p.alpha);
			infos.setX(i, p.size);
			infos.setY(i, p.rotation);
		}
		translates.needsUpdate = true;
		colors.needsUpdate = true;
		infos.needsUpdate = true;
		this.instanced.count = particles.length;
	}
}

export { Emitter, ParticleRenderer };
