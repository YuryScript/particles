import Renderer from "./Renderer"
import { ParticleManager } from "./Particle"
import Vector2 from "./Vector2"
import Rectangle from "./Rectangle"
import Line from "./Line"
import QuadTree from "./QuadTree"
import Circle from "./Circle"

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

		this._boundary

		this._quadtree

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

		this._quadtree = new QuadTree(this._boundary, 4)
		const activeParticles = this._particleManager.particles.filter((p) => p.active)
		for (const particle of activeParticles) {
			particle.position.x += particle.velocity.x
			particle.position.y += particle.velocity.y

			this.checkBoundary(particle, this._boundary)
			this._quadtree.insert(particle)
		}

		let lines
		if (this._linkedParticles) {
			lines = this.linkPartiles(this._particleManager.particles, this._distanceToLink)
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
		if (this._deltas.length > this._deltas.length - 1) {
			this._deltas.shift()
		}
		const a = this._deltas.filter((v) => v !== undefined)
	}

	linkPartiles(particles, distanceToLink) {
		const lines = []

		for (let a = 0; a < particles.length - 1; a++) {
			for (let b = a + 1; b < particles.length; b++) {
				const distance = particles[a].position.distance(particles[b].position)
				if (distance < distanceToLink) {
					const line = new Line(
						Vector2.fromVector(particles[a].position),
						Vector2.fromVector(particles[b].position)
					)
					const alpha = 1 - distance / distanceToLink
					line.alpha = alpha
					lines.push(line)
				}
			}
		}

		// for (const particleA of particles) {
		// 	const boundCircle = new Circle(particleA.position.x, particleA.position.y, distanceToLink)
		// 	const inBoundParticles = this._quadtree.queryCircle(boundCircle)

		// 	for (const particleB of inBoundParticles) {
		// 		if (particleA === particleB) {
		// 			continue
		// 		}

		// 		const distance = particleA.position.distance(particleB.position)
		// 		const line = new Line(
		// 			Vector2.fromVector(particleA.position),
		// 			Vector2.fromVector(particleB.position)
		// 		)
		// 		const alpha = 1 - distance / distanceToLink
		// 		line.alpha = alpha
		// 		lines.push(line)
		// 	}
		// }

		return lines
	}

	setSize(width, height) {
		this._canvas.width = width
		this._canvas.height = height

		this._renderer.viewportSize = new Vector2(width, height)
		this._viewport.set(0, 0, width, height)
		this._boundary = new Rectangle(
			-this._distanceToLink,
			-this._distanceToLink,
			width + this._distanceToLink * 2,
			height + this._distanceToLink * 2
		)
		this._quadtree = new QuadTree(this._boundary, 4)
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

		if (settings.staticParticles) {
			for (const coords of settings.staticParticles) {
				const p = this._particleManager.createParticle()
				p.active = false
				p.radius = 0
				p.position.set(settings.renderer.width * coords[0], settings.renderer.height * coords[1])
			}
		}

		this._renderer = new Renderer(this.ctx, settings.renderer.backgroundColor)

		this.setSize(settings.renderer.width, settings.renderer.height)

		if (settings.renderer.linearGradient) {
			const gradient = this.ctx.createLinearGradient(
				settings.renderer.width * settings.renderer.linearGradient.x1,
				settings.renderer.height * settings.renderer.linearGradient.y1,
				settings.renderer.width * settings.renderer.linearGradient.x2,
				settings.renderer.height * settings.renderer.linearGradient.y2,
			);
			gradient.addColorStop(0, settings.renderer.linearGradient.color1);
			gradient.addColorStop(1, settings.renderer.linearGradient.color2);
			this._renderer.gradient = gradient;
		}

		this.debug = settings.debug

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
