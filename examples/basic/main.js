import Particles from "../../src/Particles.js"

const node = document.getElementById("particles")

const particles = new Particles(node, {
  debug: true, // boolean
  resize: true,
  particles: {
    amount: 250, // number
    color: "#fff", // color
    createStrategy: "random", // 'random'
    distanceToLink: 150, // number
    linkedParticles: true, // boolean
    maxVelocity: 0.8, // number
    maxRadius: 4 // number
  },
  staticParticles: [],
  renderer: {
    transparentBackground: false, // boolean
    backgroundColor: "#186cb6", // color
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
})

window.particles = particles
