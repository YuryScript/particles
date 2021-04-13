import Particles from '../../src/Particles.js'

const node = document.getElementById('particles')

const settings = {
  debug: true, // boolean
  resize: true,
  particles: {
    amount: 100, // number
    moveDirection: 'random', // 'random' | 'top'  | 'right'  | 'bottom'  | 'left'
    distanceToLink: 100, // number
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
    dpiMultiplier: 1,
  },
}

const particles = new Particles(node).init(settings).start()

window.particles = particles
