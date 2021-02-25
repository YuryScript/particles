import Renderer from "./Renderer"
import { Particle, ParticlePool } from "./Particle"
import Vector2 from "./Vector2"
import Rectangle from "./Rect"

export default class Particles {
	constructor(canvas, settings) {
		this._canvas = canvas

		this.ctx = this._canvas.getContext("2d")

		this._pool = null

		this._renderer = null

		this._boundUpdate = this.update.bind(this)

		this._isRunning = false

		this._viewport = new Rectangle()

		this.processSettings(settings)

		this.start()
		console.log("Particles started!")
	}

	start() {
		this._isRunning = true
		window.requestAnimationFrame(this._boundUpdate)
	}

	stop() {
		this._isRunning = false
	}

	update() {
		const startTime = Date.now()

		for (const particle of this._pool.particles) {
			particle.position.x += particle.velocity.x
			particle.position.y += particle.velocity.y

			this.checkBoundary(particle, this._viewport)
		}

		this._renderer.render()

		if (this._isRunning) {
			window.requestAnimationFrame(this._boundUpdate)
		}

		const endTime = Date.now()
		const delta = endTime - startTime
		// console.log("update", delta, "ms")
	}

	setSize(width, height) {
		this._canvas.width = width
		this._canvas.height = height

		this._renderer.viewportSize = new Vector2(width, height)
		this._viewport.set(0, 0, width, height)
		console.log(this._viewport.top, this._viewport.right, this._viewport.bottom, this._viewport.left);
	}

	processSettings(settings) {
		this._pool = new ParticlePool(settings.particles.amount)

		this._pool.generateParticleRandomly(settings.renderer.width, settings.renderer.height, 3, 3)

		this._renderer = new Renderer(this.ctx, this._pool.particles, settings.renderer.backgroundColor)

		this.setSize(settings.renderer.width, settings.renderer.height)
	}

	checkBoundary(particle, boundary) {
		if (particle.position.x < boundary.left) {
			particle.position.x = boundary.right
		}

		if (particle.position.x > boundary.right) {
			particle.position.x = boundary.left
		}

		if (particle.position.y < boundary.top) {
			particle.position.y = boundary.bottom
		}

		if (particle.position.y > boundary.bottom) {
			particle.position.y = boundary.top
		}
	}
}
