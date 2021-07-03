import Particles from '../../src/Particles.js'

const node = document.getElementById('particles')

const settings = {
  debug: true, // boolean
  particles: {
    amount: 150, // number
    distanceToLink: 150, // number
    linkedParticles: true, // boolean
    maxVelocity: 0.8, // number
    maxRadius: 4, // number
  },
  renderer: {
    linearGradient: {
      x1: 0, // number
      y1: 0, // number
      x2: 1, // number
      y2: 1, // number
      color1: '#327fc2', // color
      color2: '#014987', // color
    },
    width: window.innerWidth, // number
    height: window.innerHeight, // number
  },
}

const particles = new Particles(node).init(settings).start()

window.particles = particles
