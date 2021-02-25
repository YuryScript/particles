import Renderer from "./Renderer";
import { Particle, ParticlePool } from "./Particle";

export default class Particles {
  constructor(canvas, settings) {
    this._canvas = canvas;

    this._settings = settings || {
      particles: {
        amount: 100, // number
        color: "#fff", // string
        createStrategy: "random", // 'random'
      },
      renderer: {
        transparentBackground: false, // boolean
        backgroundColor: "#000", // string
        width: 800, // number
        height: 600, // number
      },
    };

    this.ctx = this._canvas.getContext("2d");

    this._pool = new ParticlePool(this._settings.particles.amount);

    this.renderer = new Renderer(this.ctx, this._pool.particles);

    this._boundUpdate = this.update.bind(this);

    this._isRunning = false;

    this._timestamp;

    this.setSize(this._settings.renderer.width, this._settings.renderer.height);

    this.start();
    console.log("Particles started!");
  }

  start() {
    this._isRunning = true;
    window.requestAnimationFrame(this._boundUpdate);
  }

  stop() {
    this._isRunning = false;
  }

  update() {
    const currentTime = Date.now();
    if (!this._timestamp) {
      this._timestamp = currentTime;
    }
    const delta = currentTime - this._timestamp;
    this._timestamp = currentTime;
    // console.log("update", delta, "ms");

    for (const particle of this._pool.particles) {
      particle.position.x += particle.velocity.x;
      particle.position.y += particle.velocity.y;
    }

    this.renderer.render();

    if (this._isRunning) {
      window.requestAnimationFrame(this._boundUpdate);
    }
  }

  setSize(width, height) {
    this._settings.renderer.width = width;
    this._settings.renderer.height = height;
    this._canvas.width = width;
    this._canvas.height = height;
  }
}
