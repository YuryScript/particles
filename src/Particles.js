import Renderer from "./Renderer"
import { ParticleManager } from "./Particle"
import Vector2 from "./Vector2"
import Rectangle from "./Rect"
import Line from "./Line"

export default class Particles {
	constructor(canvas, settings) {
		this._canvas = canvas

		this.ctx = this._canvas.getContext("2d")

		this._particleManager = null

		this._renderer = null

		this._boundUpdate = this.update.bind(this)

		this._isRunning = false

		this._linkedParticles

		this._distanceToLink

		this._ticks = 0

		this._deltas = new Array(200)

		this._debug = false

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

		for (const particle of this._particleManager.particles) {
			particle.position.x += particle.velocity.x
			particle.position.y += particle.velocity.y

			this.checkBoundary(particle, this._viewport, this._distanceToLink)
		}

		let lines
		if (this._linkedParticles) {
			lines = this.linkPartiles()
		}

		this._renderer.particles = this._particleManager.particles
		this._renderer.lines = lines
		this._renderer.deltas = this._deltas
		this._renderer.render()

		if (this._isRunning) {
			window.requestAnimationFrame(this._boundUpdate)
		}

		this._ticks++

		const endTime = Date.now()
		const delta = endTime - startTime
		this._deltas.push(delta)
		if(this._deltas.length > this._deltas.length - 1) {
			this._deltas.shift()
		}
		const a = this._deltas.filter((v) => v !== undefined)
		// console.info(Math.min(...a), Math.max(...a))
	}

	linkPartiles() {
		const lines = []

		for (let a = 0; a < this._particleManager.particles.length - 1; a++) {
			for (let b = a + 1; b < this._particleManager.particles.length; b++) {
				const distance = this._particleManager.particles[a].position.distance(this._particleManager.particles[b].position)
				if (distance < this._distanceToLink) {
					const line = new Line(
						Vector2.fromVector(this._particleManager.particles[a].position),
						Vector2.fromVector(this._particleManager.particles[b].position)
					)
					const alpha = 1 - distance / this._distanceToLink
					line.alpha = alpha
					lines.push(line)
				}
			}
		}

		return lines
	}

	setSize(width, height) {
		this._canvas.width = width
		this._canvas.height = height

		this._renderer.viewportSize = new Vector2(width, height)
		this._viewport.set(0, 0, width, height)
	}

	get debug() {
		return this._debug
	}

	set debug(v) {
		this._debug = v
		this._renderer._debug = v
	}

	processSettings(settings) {
		this._linkedParticles = settings.particles.linkedParticles

		this._distanceToLink = settings.particles.distanceToLink

		this._particleManager = new ParticleManager(settings.particles.amount)

		this._particleManager.generateParticlesRandomly(
			settings.renderer.width,
			settings.renderer.height,
			this._distanceToLink,
			settings.particles.maxVelocity,
			settings.particles.maxVelocity,
			settings.particles.maxRadius,
		)

		this._renderer = new Renderer(this.ctx, settings.renderer.backgroundColor)

		this.setSize(settings.renderer.width, settings.renderer.height)

		this.debug = settings.debug
			
	}

	checkBoundary(particle, boundary, offset) {
		if (particle.position.x < boundary.left - offset) {
			particle.position.x = boundary.right + offset
		}

		if (particle.position.x > boundary.right + offset) {
			particle.position.x = boundary.left - offset
		}

		if (particle.position.y < boundary.top - offset) {
			particle.position.y = boundary.bottom + offset
		}

		if (particle.position.y > boundary.bottom + offset) {
			particle.position.y = boundary.top - offset
		}
	}
}
