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
import type { Emitter } from "./emitter";

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

abstract class Behaviour {
	abstract update(particle: Particle, t: number, dt: number);
}

class LifetimeColor extends Behaviour {
	colorSpline: Spline;

	constructor(times: number[], colors: Color[]) {
		super();
		const colorArray = colors.map((color) => color.toArray()).flat();
		this.colorSpline = new Spline(times, colorArray, 3);
	}

	update(particle: Particle, t: number, dt: number) {
		particle.color = new Color(...this.colorSpline.get(t));
	}
}

class LifetimeAlpha extends Behaviour {
	alphaSpline: Spline;
	constructor(times: number[], alphas: number[]) {
		super();
		this.alphaSpline = new Spline(times, alphas, 1);
	}
	update(particle: Particle, t: number, dt: number) {
		particle.alpha = this.alphaSpline.get(t)[0];
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
			depthTest: false,
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

	render(emitter: Emitter) {
		this.instanced.material.blending = emitter.blending;
		const translates = this.instanced.geometry.getAttribute("translate");
		const colors = this.instanced.geometry.getAttribute("color");
		const infos = this.instanced.geometry.getAttribute("info");
		for (const [i, p] of emitter.particles.entries()) {
			this.instanced.setColorAt(i, new Color(1, 1, 1));
			translates.setXYZ(i, p.position.x, p.position.y, p.position.z);
			colors.setXYZW(i, p.color.r, p.color.g, p.color.b, p.alpha);
			infos.setX(i, p.size);
			infos.setY(i, p.rotation);
		}
		translates.needsUpdate = true;
		colors.needsUpdate = true;
		infos.needsUpdate = true;
		this.instanced.count = emitter.particles.length;
	}
}

export { ParticleRenderer, LifetimeColor, LifetimeAlpha };
export type { Particle };
