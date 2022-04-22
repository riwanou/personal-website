import { Color, LinearInterpolant } from "three";
import type { Particle } from "./particle";

class Spline {
	interpolant: LinearInterpolant;

	constructor(times: number[], values: number[], sampleValues: number) {
		this.interpolant = new LinearInterpolant(times, values, sampleValues, []);
	}

	get(t: number): number[] {
		return this.interpolant.evaluate(t);
	}
}

abstract class Module {
	abstract update(particle: Particle, t: number, dt: number);
}

/**
 * Alpha over lifetime
 */
class AlphaModule extends Module {
	alphaSpline: Spline;

	constructor(times: number[], alphas: number[]) {
		super();
		this.alphaSpline = new Spline(times, alphas, 1);
	}

	update(particle: Particle, t: number, dt: number): void {
		particle.alpha = this.alphaSpline.get(t)[0];
	}
}

/**
 * Color over lifetime
 */
class ColorModule extends Module {
	colorSpline: Spline;

	constructor(times: number[], colors: Color[]) {
		super();
		const colorsArray = colors.map((color) => color.toArray()).flat();
		this.colorSpline = new Spline(times, colorsArray, 3);
	}

	update(particle: Particle, t: number, dt: number): void {
		particle.color = new Color(...this.colorSpline.get(t));
	}
}

export { Module, AlphaModule, ColorModule };
