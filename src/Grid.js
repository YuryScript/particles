import Rectangle from './Rectangle.js'
import Vector2 from './Vector2.js'

export default class Grid {
  constructor(
    size = new Vector2(1, 1),
    boundRectangle = new Rectangle(0, 0, 100, 100)
  ) {
    this.rectangles = []

    this.boundRectangles = []

    this.size = size

    this.boundRectangle = boundRectangle

    this.width = boundRectangle.size.x / size.x
    this.height = boundRectangle.size.y / size.y

    this.initReactangles(size, boundRectangle)
  }

  initReactangles(size) {
    for (let x = 0; x < size.x; x++) {
      for (let y = 0; y < size.y; y++) {
        this.rectangles.push(
          new BoundRectangle(
            x * this.width,
            y * this.height,
            this.width,
            this.height
          )
        )
      }
    }
  }

  insert(particle) {
    const x = Math.floor(particle.position.x / this.width)
    const y = Math.floor(particle.position.y / this.height)

    const rectIndex = x * y
    const foundRect = this.rectangles[rectIndex]

    if (foundRect) {
      foundRect.particles.push(particle)
    }
  }

  getIntersectedRectangles(circle) {
    const left = Math.floor(circle.left / this.width)
    const right = Math.ceil(circle.right / this.width)
    const bottom = Math.floor(circle.bottom / this.height)
    const top = Math.ceil(circle.top / this.height)

    const boundRectangle = new BoundRectangle(
      left * this.width,
      top * this.height,
      (right - left) * this.width,
      (bottom - top) * this.height
    )

    this.boundRectangles.push(boundRectangle)

    for (let x = left; x < right; x++) {
      for (let y = bottom; y < top; y++) {
        const foundRect = this.rectangles[x * y]
        if (foundRect) {
          boundRectangle.particles = [
            ...boundRectangle.particles,
            ...foundRect.particles,
          ]
        }
      }
    }

    return boundRectangle
  }

  queryCircle(circle) {
    const result = []

    const boundRectangle = this.getIntersectedRectangles(circle)

    if (!boundRectangle) {
      return result
    }

    for (const particle of boundRectangle.particles) {
      if (circle.intersectsPoint(particle.position)) {
        result.push(particle)
      }
    }

    return result
  }

  clear() {
    for (const rect of this.rectangles) {
      rect.particles = []
    }
    this.boundRectangles = []
  }
}

export class BoundRectangle extends Rectangle {
  constructor(x, y, width, height, particles = []) {
    super(x, y, width, height)

    this.particles = particles
  }
}
