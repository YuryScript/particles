import Renderer from "./Renderer";
import { Particle, ParticlePool } from "./Particle";
import Vector2 from "./Vector2";

export default class Particles {
	constructor(canvas, settings) {
		this._canvas = canvas;

		this.ctx = this._canvas.getContext("2d");

		this._pool = null;

		this._renderer = null;

		this._boundUpdate = this.update.bind(this);

		this._isRunning = false;

		this.processSettings(settings);

		this.start();
		console.log("Particles started!");
	}

	start() {
		this._isRunning = true;
		window.requestAnimationFrame(this._boundUpdate);
	}

	stop() {
		this._isRunning = false;
	}

	update() {
		const startTime = Date.now();

		for (const particle of this._pool.particles) {
			particle.position.x += particle.velocity.x;
			particle.position.y += particle.velocity.y;
		}

		this._renderer.render();

		if (this._isRunning) {
			window.requestAnimationFrame(this._boundUpdate);
		}

		const endTime = Date.now();
		const delta = endTime - startTime;
		console.log("update", delta, "ms");
	}

	setSize(width, height) {
		this._canvas.width = width;
		this._canvas.height = height;

		this._renderer.viewportSize = new Vector2(width, height);
	}

	processSettings(settings) {
		console.log(settings);

		this._pool = new ParticlePool(settings.particles.amount);

		this._pool.generateParticleRandomly(settings.renderer.width, settings.renderer.height, 4, 4);

		this._renderer = new Renderer(this.ctx, this._pool.particles, settings.renderer.backgroundColor);

		this.setSize(settings.renderer.width, settings.renderer.height);
	}
}
