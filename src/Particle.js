import Vector2 from './Vector2.js'

export class Particle {
  constructor() {
    this.position = new Vector2()

    this.velocity = new Vector2()

    this.radius = 1
  }

  update() {
    this.position.add(this.velocity)
  }
}

export class ParticleManager {
  constructor() {
    this.particles = []
  }

  createParticle() {
    const newParticle = new Particle()
    this.particles.push(newParticle)
    return newParticle
  }
}
