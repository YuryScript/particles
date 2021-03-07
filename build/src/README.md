# Spark Particles
![version](https://img.shields.io/npm/v/spark-particles?style=for-the-badge)
![license](https://img.shields.io/npm/l/spark-particles?style=for-the-badge)
![language](https://img.shields.io/github/languages/top/gelltorn/particles?style=for-the-badge)
![issues](https://img.shields.io/github/issues/gelltorn/particles?style=for-the-badge)
![npm downloads](https://img.shields.io/npm/dt/spark-particles?style=for-the-badge)
![npm min bundle size](https://img.shields.io/bundlephobia/min/spark-particles?style=for-the-badge)
![npm minzip bundle size](https://img.shields.io/bundlephobia/minzip/spark-particles?style=for-the-badge)

Lightweight and fast Particle library written in JavaScript

Zero Dependencies!

[Examples](https://gelltorn.github.io/particles/examples/)

## Installation
1. `npm i spark-particles --save`
2. Done!
## Usage
See Basic example

```javascript
import Particles from "spark-particles"

const node = document.getElementById("particles")

const canvas = document.getElementById("particles")

const settings = {
  debug: false, // boolean
  resize: true, // boolean
  particles: {
    amount: 250, // number
    moveDirection: 'random', // 'random' | 'top'  | 'right'  | 'bottom'  | 'left' 
    distanceToLink: 150, // number
    linkedParticles: true, // boolean
    maxVelocity: 0.8, // number
    maxRadius: 4 // number
  },
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
}

new Particles(canvas)
  .init(settings)
  .start()

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