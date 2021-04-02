import Renderer from './Renderer.js'
import { ParticleManager } from './Particle.js'
import Vector2 from './Vector2.js'
import Rectangle from './Rectangle.js'
import Line from './Line.js'
import QuadTree from './QuadTree.js'
import Circle from './Circle.js'
import Random from './Random.js'
import { Entity, PositionComponent, RotationComponent } from './Components.js'

export default class Particles {
  constructor(canvas) {
    this._canvas = canvas

    this._ctx = this._canvas.getContext('2d')

    this._particleManager = null

    this._renderer = null

    this._boundUpdate = this._update.bind(this)

    this._isRunning = false

    this._ticks = 0

    this._deltas = new Array(200)

    this._debug = false

    this._boundary = null

    this._quadtree = null

    this._resizeTimeout = null

    const n = new Entity('Particle', [PositionComponent.create(), RotationComponent.create()])
    console.log(n)
  }

  init(settings) {
    this._settings = settings

    this._particleManager = new ParticleManager()

    for (let a = 0; a < settings.particles.amount; a++) {
      const particle = this._particleManager.createParticle()

      particle.position.set(
        Random.intBetween(
          -settings.particles.distanceToLink,
          settings.renderer.width + settings.particles.distanceToLink
        ),
        Random.intBetween(
          -settings.particles.distanceToLink,
          settings.renderer.height + settings.particles.distanceToLink
        )
      )

      const velocity = new Vector2()
      const alpha = 3
      const beta = 4
      switch (settings.particles.moveDirection) {
        case 'top':
          velocity.set(
            Random.floatBetween(-settings.particles.maxVelocity / alpha, settings.particles.maxVelocity / alpha),
            Random.floatBetween(-settings.particles.maxVelocity, -settings.particles.maxVelocity / beta)
          )
          break
        case 'right':
          velocity.set(
            Random.floatBetween(settings.particles.maxVelocity, settings.particles.maxVelocity / beta),
            Random.floatBetween(-settings.particles.maxVelocity / alpha, settings.particles.maxVelocity / alpha)
          )
          break
        case 'bottom':
          velocity.set(
            Random.floatBetween(-settings.particles.maxVelocity / alpha, settings.particles.maxVelocity / alpha),
            Random.floatBetween(settings.particles.maxVelocity, settings.particles.maxVelocity / beta)
          )
          break
        case 'left':
          velocity.set(
            Random.floatBetween(-settings.particles.maxVelocity, -settings.particles.maxVelocity / beta),
            Random.floatBetween(-settings.particles.maxVelocity / alpha, settings.particles.maxVelocity / alpha)
          )
          break
        default:
        case 'random':
          velocity.set(
            Random.floatBetween(-settings.particles.maxVelocity, settings.particles.maxVelocity),
            Random.floatBetween(-settings.particles.maxVelocity, settings.particles.maxVelocity)
          )
          break
      }
      particle.velocity = velocity

      particle.radius = Random.floatBetween(0, settings.particles.maxRadius)
    }

    if (settings.staticParticles) {
      for (const coords of settings.staticParticles) {
        const p = this._particleManager.createParticle()
        p.active = false
        p.radius = 0
        p.position.set(settings.renderer.width * coords[0], settings.renderer.height * coords[1])
      }
    }

    this._renderer = new Renderer(this._ctx, settings.renderer.backgroundColor)

    this._renderer.transparentBackground = settings.renderer.transparentBackground

    this._setSize(settings.renderer.width, settings.renderer.height)

    if (settings.renderer.linearGradient) {
      const gradient = this._ctx.createLinearGradient(
        settings.renderer.width * settings.renderer.linearGradient.x1,
        settings.renderer.height * settings.renderer.linearGradient.y1,
        settings.renderer.width * settings.renderer.linearGradient.x2,
        settings.renderer.height * settings.renderer.linearGradient.y2
      )
      gradient.addColorStop(0, settings.renderer.linearGradient.color1)
      gradient.addColorStop(1, settings.renderer.linearGradient.color2)
      this._renderer.gradient = gradient
    }

    this.debug = settings.debug

    if (settings.resize) {
      window.addEventListener('resize', this._onResize.bind(this))
    }

    return this
  }

  _onResize() {
    if (this._resizeTimeout) {
      clearTimeout(this._resizeTimeout)
    }
    this._resizeTimeout = setTimeout(() => this._setSize(window.innerWidth, window.innerHeight), 100)
  }

  start() {
    this._isRunning = true
    window.requestAnimationFrame(this._boundUpdate)

    console.info('Spark Partilces started!')
    return this
  }

  stop() {
    this._isRunning = false
    return this
  }

  _update() {
    const startTime = Date.now()

    this._quadtree = new QuadTree(this._boundary, 4)
    const activeParticles = this._particleManager.particles.filter((p) => p.active)
    for (const particle of activeParticles) {
      particle.update()

      this._checkBoundary(particle, this._boundary)
      this._quadtree.insert(particle)
    }

    let lines = []
    if (this._settings.particles.linkedParticles) {
      lines = this._linkPartiles(this._particleManager.particles, this._settings.particles.distanceToLink)
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

    return this
  }

  _linkPartiles(particles, distanceToLink) {
    const lines = []

    for (let a = 0; a < particles.length - 1; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const distance = particles[a].position.distance(particles[b].position)
        if (distance < distanceToLink) {
          const line = new Line(Vector2.fromVector(particles[a].position), Vector2.fromVector(particles[b].position))
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

  oneFrame = this._update

  _setSize(width, height) {
    this._canvas.width = width
    this._canvas.height = height

    this._renderer.viewportSize = new Vector2(width, height)
    this._boundary = new Rectangle(
      -this._settings.particles.distanceToLink,
      -this._settings.particles.distanceToLink,
      width + this._settings.particles.distanceToLink * 2,
      height + this._settings.particles.distanceToLink * 2
    )
    this._quadtree = new QuadTree(this._boundary, 4)

    return this
  }

  get debug() {
    return this._debug
  }

  set debug(v) {
    this._debug = v
    this._renderer._debug = v
  }

  _checkBoundary(particle, boundary) {
    if (particle.position.x < boundary.left) {
      particle.position.x = boundary.right
      return
    }

    if (particle.position.x > boundary.right) {
      particle.position.x = boundary.left
      return
    }

    if (particle.position.y < boundary.top) {
      particle.position.y = boundary.bottom
      return
    }

    if (particle.position.y > boundary.bottom) {
      particle.position.y = boundary.top
    }
  }
}
