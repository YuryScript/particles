import Vector2 from "./Vector2";
import Random from "./Random";

export class Particle {
  constructor() {
    this.position = new Vector2();

    this.velocity = new Vector2();

    this.active = false;

    this.radius = 3;
  }
}

export class ParticlePool {
  constructor(size) {
    this.particles = new Array(size);

    this.init(0, size);
  }
  /** [min, max) */
  init(min, max) {
    for (let i = min; i < max; i++) {
      this.particles[i] = new Particle();
    }

    return this;
  }

  resize(newSize) {
    if (this.particles.length === newSize) {
      return;
    }

    const oldSize = this.particles.length;
    this.particles.length = newSize;

    if (oldSize > newSize) {
      this.init(oldSize, newSize);
    }

    return this;
  }

  generateParticleRandomly(maxX, maxY, maxVX, maxVY) {
    for (const particle of this.particles) {
      particle.position.set(Random.intBetween(maxX), Random.intBetween(maxY));
      particle.velocity.set(Random.floatBetween(-maxVX, maxVX), Random.floatBetween(-maxVY, maxVY));
    }
  }
}
