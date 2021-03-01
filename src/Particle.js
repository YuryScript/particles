import Vector2 from "./Vector2"
import Random from "./Random"

export class Particle {
  constructor() {
    this.position = new Vector2()

    this.velocity = new Vector2()

    this.active = false

    this.radius = 1
  }
}

export class ParticleManager {
  constructor(size) {
    this.particles = new Array(size)

    this.init(0, size)
  }
  
  createPatilce() {
    const newParticle = new Particle()
    this.particles.push(newParticle)
    return newParticle
  }

  /** [min, max) */
  init(min, max) {
    for (let i = min; i < max; i++) {
      this.particles[i] = new Particle()
    }

    return this
  }

  resize(newSize) {
    if (this.particles.length === newSize) {
      return
    }

    const oldSize = this.particles.length
    this.particles.length = newSize

    if (oldSize > newSize) {
      this.init(oldSize, newSize)
    }

    return this
  }

  generateParticlesRandomly(maxX, maxY, offset, maxVX, maxVY, maxRadius) {
    for (const particle of this.particles) {
      particle.position.set(Random.intBetween(-offset, maxX + offset), Random.intBetween(-offset, maxY + offset))
      particle.velocity.set(Random.floatBetween(-maxVX, maxVX), Random.floatBetween(-maxVY, maxVY))
      particle.radius = Random.floatBetween(0.2, maxRadius)
    }
  }
}
