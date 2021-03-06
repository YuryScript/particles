import Particles from "../Particles.js"

const node = document.getElementById("particles")

const settings = {
  debug: true, // boolean
  resize: true,
  particles: {
    amount: 250, // number
    createStrategy: 'random', // 'random'
    moveDirection: 'random', // 'random' | 'top'  | 'right'  | 'bottom'  | 'left' 
    distanceToLink: 150, // number
    linkedParticles: true, // boolean
    maxVelocity: 0.8, // number
    maxRadius: 4 // number
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
    width: window.innerWidth, // string
    height: window.innerHeight, // string
  },
}

const particles = new Particles(node)
particles.init(settings)
particles.start()

window.particles = particles
