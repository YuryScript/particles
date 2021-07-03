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

    this.renderer = null

    this.boundUpdate = this.update.bind(this)

    this.isRunning = false

    this.ticks = 0

    this.deltas = new Array(150)

    this.debug = false

    this.boundary = null

    this.spatialGrid = null

    this.settings = null

    /** 'default' | 'quadTree' | 'grid' */
    this.method = 'grid'
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
      particle.velocity = velocity

      particle.radius = Random.floatBetween(1, settings.particles.maxRadius)
    }

    this.renderer = new Renderer(
      this.ctx,
      settings.renderer.backgroundColor,
      new Vector2()
    )

    this.renderer.transparentBackground =
      settings.renderer.transparentBackground

    this.setSize(settings.renderer.width, settings.renderer.height)

    this.changeSpatialGridTo(this.method)

    if (settings.renderer.linearGradient) {
      const gradient = this.ctx.createLinearGradient(
        settings.renderer.width * settings.renderer.linearGradient.x1,
        settings.renderer.height * settings.renderer.linearGradient.y1,
        settings.renderer.width * settings.renderer.linearGradient.x2,
        settings.renderer.height * settings.renderer.linearGradient.y2
      )
      gradient.addColorStop(0, settings.renderer.linearGradient.color1)
      gradient.addColorStop(1, settings.renderer.linearGradient.color2)
      this.renderer.gradient = gradient
    }

    this.renderer.debug = settings.debug

    return this
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

    const particles = this.particleManager.particles
    const distanceToLink = this.settings.particles.distanceToLink

    switch (this.method) {
      case 'quadTree':
      case 'grid':
        this.spatialGrid.clear()
        break
      default:
        break
    }

    for (const particle of particles) {
      particle.update()

      this.checkBoundary(particle, this.boundary)

      switch (this.method) {
        case 'quadTree':
        case 'grid':
          this.spatialGrid.insert(particle)
          break
        default:
          break
      }
    }

    let lines = []
    if (this.settings.particles.linkedParticles) {
      lines = this.linkPartiles(particles, distanceToLink)
    }

    const objectToRender = this.spatialGrid
      ? [...particles, ...lines, ...this.spatialGrid.rectangles]
      : [...particles, ...lines]
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
    this.deltas.shift()

    return this
  }

  linkPartiles(particles, distanceToLink) {
    let lines = []

    switch (this.method) {
      case 'quadTree': {
        const seenParticles = []
        for (const particleA of particles) {
          const boundCircle = new Circle(
            particleA.position.x,
            particleA.position.y,
            distanceToLink
          )

          const inBoundParticles = this.spatialGrid.queryCircle(boundCircle)

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
        break
      }
      case 'grid': {
        for (const particle of particles) {
          const pointA = particle.position

          const boundCircle = new Circle(
            particle.position.x,
            particle.position.y,
            distanceToLink
          )

          const inBoundPoints = this.spatialGrid
            .queryCircle(boundCircle)
            .map((a) => a.position)
          // console.log(particle, inBoundParticles)

          for (const pointB of inBoundPoints) {
            if (pointA === pointB) {
              continue
            }

            const distance = pointA.distance(pointB)
            const line = new Line(
              Vector2.fromVector(pointA),
              Vector2.fromVector(pointB)
            )
            const alpha = 1 - distance / distanceToLink
            line.alpha = alpha
            lines.push(line)
          }
        }
        // console.log(lines)
        const filtredLines = []
        for (let i = 0; i < lines.length - 1; i++) {
          const lineA = lines[i]
          let isAdd = true
          for (let j = i + 1; j < lines.length; j++) {
            const lineB = lines[j]
            if (lineA.a.equals(lineB.b) && lineA.b.equals(lineB.a)) {
              isAdd = false
            }
          }
          if (isAdd) {
            filtredLines.push(lineA)
          }
        }
        if (lines.length) filtredLines.push(lines[lines.length - 1])
        lines = filtredLines
        break
      }
      default: {
        for (let a = 0; a < particles.length - 1; a++) {
          for (let b = a + 1; b < particles.length; b++) {
            const distance = particles[a].position.distance(
              particles[b].position
            )
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
        break
      }
    }

    return lines
  }

  oneFrame = this.update

  setSize(width, height) {
    this.canvas.style.width = width.toString() + 'px'
    this.canvas.style.height = height.toString() + 'px'

    this.canvas.width = width
    this.canvas.height = height

    this.renderer.viewportSize = new Vector2(width, height)

    this.boundary = new Rectangle(
      -this.settings.particles.distanceToLink,
      -this.settings.particles.distanceToLink,
      width + this.settings.particles.distanceToLink * 2,
      height + this.settings.particles.distanceToLink * 2
    )

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

  changeSpatialGridTo(gridName) {
    this.method = gridName

    switch (gridName) {
      case 'grid': {
        const gridCellsX = Math.floor(
          this.boundary.size.x / this.settings.particles.distanceToLink / 2.5
        )
        const gridCellsY = Math.floor(
          this.boundary.size.y / this.settings.particles.distanceToLink / 2.5
        )
        this.spatialGrid = new Grid(
          new Vector2(gridCellsX, gridCellsY),
          this.boundary
        )
        break
      }
      case 'quadTree': {
        this.quadTree = new QuadTree(this.boundary, 4)
        break
      }
      default: {
        this.spatialGrid = null
      }
    }
  }
}
