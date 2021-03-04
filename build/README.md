# Spark Particles
![version](https://img.shields.io/npm/v/spark-particles)
![license](https://img.shields.io/npm/l/spark-particles)
![language](https://img.shields.io/github/languages/top/gelltorn/particles)
![issues](https://img.shields.io/github/issues/gelltorn/particles)
![npm downloads](https://img.shields.io/npm/dt/spark-particles)

Lightweight and fast Particle library written in JavaScript

[Examples](https://gelltorn.github.io/particles/examples/)

## Installation
1. `npm i spark-particles`
2. Done!
## Usage
See Basic example

```javascript
import Particles from "spark-particles"

const node = document.getElementById("particles")

const particles = new Particles(node, {
  debug: false, // boolean
  particles: {
    amount: 250, // number
    color: "#fff", // color
    createStrategy: "random", // 'random'
    distanceToLink: 150, // number
    linkedParticles: true, // boolean
    maxVelocity: 0.8, // number
    maxRadius: 4 // number
  },
  staticParticles: [
    [0.4, 0.4],
    [0.6, 0.4],
    [0.4, 0.6],
    [0.6, 0.6],
  ],
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

```
## Contributing
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D
## History
TODO: Write history
## License
MIT