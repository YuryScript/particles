import Renderer from './Renderer.js'
import { ParticleManager } from './Particle.js'
import Vector2 from './Vector2.js'
import Rectangle from './Rectangle.js'
import Line from './Line.js'
import QuadTree from './QuadTree.js'
import Circle from './Circle.js'
import Random from './Random.js'
import Grid from './Grid.js'

export default class Particles {
  constructor(canvas) {
    this.canvas = canvas

    this.ctx = this.canvas.getContext('2d')

    this.particleManager = null

    this.dpiMultiplier = null

    this.renderer = null

    this.boundUpdate = this.update.bind(this)

    this.isRunning = false

    this.ticks = 0

    this.deltas = new Array(150)

    this.debug = false

    this.boundary = null

    this.quadTree = null

    this.grid = null

    this.resizeTimeout = null

    this.settings = null

    /** 'default' | 'quadTree' | 'grid' */
    this.method = 'default'
  }

  init(settings) {
    this.settings = settings

    this.particleManager = new ParticleManager()

    for (let a = 0; a < settings.particles.amount; a++) {
      const particle = this.particleManager.createParticle()

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
            Random.floatBetween(
              -settings.particles.maxVelocity / alpha,
              settings.particles.maxVelocity / alpha
            ),
            Random.floatBetween(
              -settings.particles.maxVelocity,
              -settings.particles.maxVelocity / beta
            )
          )
          break
        case 'right':
          velocity.set(
            Random.floatBetween(
              settings.particles.maxVelocity,
              settings.particles.maxVelocity / beta
            ),
            Random.floatBetween(
              -settings.particles.maxVelocity / alpha,
              settings.particles.maxVelocity / alpha
            )
          )
          break
        case 'bottom':
          velocity.set(
            Random.floatBetween(
              -settings.particles.maxVelocity / alpha,
              settings.particles.maxVelocity / alpha
            ),
            Random.floatBetween(
              settings.particles.maxVelocity,
              settings.particles.maxVelocity / beta
            )
          )
          break
        case 'left':
          velocity.set(
            Random.floatBetween(
              -settings.particles.maxVelocity,
              -settings.particles.maxVelocity / beta
            ),
            Random.floatBetween(
              -settings.particles.maxVelocity / alpha,
              settings.particles.maxVelocity / alpha
            )
          )
          break
        default:
        case 'random':
          velocity.set(
            Random.floatBetween(
              -settings.particles.maxVelocity,
              settings.particles.maxVelocity
            ),
            Random.floatBetween(
              -settings.particles.maxVelocity,
              settings.particles.maxVelocity
            )
          )
          break
      }
      particle.velocity = velocity

      particle.radius = Random.floatBetween(1, settings.particles.maxRadius)
    }

    if (settings.staticParticles) {
      for (const coords of settings.staticParticles) {
        const p = this.particleManager.createParticle()
        p.active = false
        p.radius = 0
        p.position.set(
          settings.renderer.width * coords[0],
          settings.renderer.height * coords[1]
        )
      }
    }

    if (settings.renderer.dpiMultiplier) {
      this.dpiMultiplier = settings.renderer.dpiMultiplier
    } else {
      this.dpiMultiplier = 1
    }

    this.renderer = new Renderer(
      this.ctx,
      settings.renderer.backgroundColor,
      new Vector2(),
      this.dpiMultiplier
    )

    this.renderer.transparentBackground =
      settings.renderer.transparentBackground

    this.setSize(settings.renderer.width, settings.renderer.height)

    if (settings.renderer.linearGradient) {
      const gradient = this.ctx.createLinearGradient(
        settings.renderer.width *
        settings.renderer.linearGradient.x1 *
        this.dpiMultiplier,
        settings.renderer.height *
        settings.renderer.linearGradient.y1 *
        this.dpiMultiplier,
        settings.renderer.width *
        settings.renderer.linearGradient.x2 *
        this.dpiMultiplier,
        settings.renderer.height *
        settings.renderer.linearGradient.y2 *
        this.dpiMultiplier
      )
      gradient.addColorStop(0, settings.renderer.linearGradient.color1)
      gradient.addColorStop(1, settings.renderer.linearGradient.color2)
      this.renderer.gradient = gradient
    }

    this.renderer.debug = settings.debug

    if (settings.resize) {
      window.addEventListener('resize', this.onResize.bind(this))
    }

    return this
  }

  onResize() {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout)
    }
    this.resizeTimeout = setTimeout(
      () => this.setSize(window.innerWidth, window.innerHeight),
      100
    )
  }

  start() {
    this.isRunning = true
    window.requestAnimationFrame(this.boundUpdate)

    console.info('Spark Partilces started!')
    return this
  }

  stop() {
    this.isRunning = false
    return this
  }

  update() {
    const startTime = Date.now()

    if (this.method === 'quadTree') {
      this.quadTree = new QuadTree(this.boundary, 4)
    }
    if (this.method === 'grid') {
      this.grid.clear()
    }

    const activeParticles = this.particleManager.particles.filter((p) => p.active)

    for (const particle of activeParticles) {
      particle.update()

      this.checkBoundary(particle, this.boundary)

      if (this.method === 'quadTree') {
        this.quadTree.insert(particle)
      }

      if (this.method === 'grid') {
        this.grid.insert(particle)
      }
    }

    let lines = []
    if (this.settings.particles.linkedParticles) {
      lines = this.linkPartiles(
        this.particleManager.particles,
        this.settings.particles.distanceToLink
      )
    }

    const objectToRender = [...this.particleManager.particles, ...lines]
    this.renderer.objectToRender = objectToRender
    this.renderer.deltas = this.deltas
    this.renderer.render()

    if (this.isRunning) {
      window.requestAnimationFrame(this.boundUpdate)
    }

    this.ticks++

    const endTime = Date.now()
    const delta = endTime - startTime
    this.deltas.push(delta)
    if (this.deltas.length > this.deltas.length - 1) {
      this.deltas.shift()
    }

    return this
  }

  linkPartiles(particles, distanceToLink) {
    const lines = []

    if (this.method === 'default') {
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
    }

    if (this.method === 'quadTree') {
      const seenParticles = []
      for (const particleA of particles) {
        const boundCircle = new Circle(particleA.position.x, particleA.position.y, distanceToLink)

        const inBoundParticles = this.quadTree.queryCircle(boundCircle)

        seenParticles.push(particleA)

        for (const particleB of inBoundParticles) {
          if (seenParticles.find((value) => value === particleB)) {
            continue
          }

          const distance = particleA.position.distance(particleB.position)
          const line = new Line(
            Vector2.fromVector(particleA.position),
            Vector2.fromVector(particleB.position)
          )
          const alpha = 1 - distance / distanceToLink
          line.alpha = alpha
          lines.push(line)
        }
      }
    }

    if (this.method === 'grid') {
      const seenParticles = []
      for (const particleA of particles) {
        const boundCircle = new Circle(particleA.position.x, particleA.position.y, distanceToLink)

        const inBoundParticles = this.grid.queryCircle(boundCircle)

        seenParticles.push(particleA)

        for (const particleB of inBoundParticles) {
          if (seenParticles.find((value) => value === particleB)) {
            continue
          }

          const distance = particleA.position.distance(particleB.position)
          const line = new Line(
            Vector2.fromVector(particleA.position),
            Vector2.fromVector(particleB.position)
          )
          const alpha = 1 - distance / distanceToLink
          line.alpha = alpha
          lines.push(line)
        }
      }
    }

    return lines
  }

  oneFrame = this.update

  setSize(width, height) {
    this.canvas.style.width = width.toString() + 'px'
    this.canvas.style.height = height.toString() + 'px'

    this.canvas.width = width * this.dpiMultiplier
    this.canvas.height = height * this.dpiMultiplier

    this.renderer.viewportSize = new Vector2(width, height)

    this.boundary = new Rectangle(
      -this.settings.particles.distanceToLink,
      -this.settings.particles.distanceToLink,
      width + this.settings.particles.distanceToLink * 2,
      height + this.settings.particles.distanceToLink * 2
    )
    this.quadTree = new QuadTree(this.boundary, 4)

    const gridX = Math.floor(this.boundary.size.x / this.settings.particles.distanceToLink / 2.5)
    const gridY = Math.floor(this.boundary.size.y / this.settings.particles.distanceToLink / 2.5)
    this.grid = new Grid(new Vector2(gridX, gridY), this.boundary)

    return this
  }

  checkBoundary(particle, boundary) {
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
