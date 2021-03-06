import Vector2 from "./Vector2"
import Random from "./Random"

export class Particle {
  constructor() {
    this.position = new Vector2()

    this.velocity = new Vector2()

    this.active = true

    this.letter;

    this.radius = 1
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

  generateParticlesRandomly(partilcesAmount, maxX, maxY, offset, maxVX, maxVY, maxRadius) {
    this.particles = []
    for (let a = 0; a < partilcesAmount; a++) {
      const particle = this.createParticle()
      particle.position.set(Random.intBetween(-offset, maxX + offset), Random.intBetween(-offset, maxY + offset))
      particle.velocity.set(Random.floatBetween(-maxVX, maxVX), Random.floatBetween(-maxVY, maxVY))
      particle.radius = Random.floatBetween(0.2, maxRadius)
    }
  }
}
