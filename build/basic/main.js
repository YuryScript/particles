import Particles from "../src/Particles.js"

const node = document.getElementById("particles")

const particles = new Particles(node, {
  debug: false,
  particles: {
    amount: 220, // number
    color: "#fff", // string
    createStrategy: "random", // 'random'
    distanceToLink: 150, // number
    linkedParticles: true, // boolean
    maxVelocity: 0.8, // number
    maxRadius: 4 // number
  },
  renderer: {
    transparentBackground: false, // boolean
    backgroundColor: "#186cb6", // string
    width: window.innerWidth, // string
    height: window.innerHeight, // string
  },
})

window.particles = particles
