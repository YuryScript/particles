import Particles from "../../src/Particles"

const node = document.getElementById("particles")

window.particles = new Particles(node, {
  debug: true,
  particles: {
    amount: 200, // number
    color: "#fff", // string
    createStrategy: "random", // 'random'
    distanceToLink: 150, // number
    linkedParticles: true, // boolean
  },
  renderer: {
    transparentBackground: false, // boolean
    backgroundColor: "#186cb6", // string
    width: window.innerWidth, // string
    height: window.innerHeight, // string
  },
})
