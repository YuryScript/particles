import Rectangle from './Rectangle.js'
import Vector2 from './Vector2.js'

export default class Grid {
  constructor(
    size = new Vector2(1, 1),
    boundRectangle = new Rectangle(0, 0, 100, 100)
  ) {
    this.rectangles = []

    this.size = size

    this.boundRectangle = boundRectangle

    this.rectWidth = boundRectangle.size.x / size.x
    this.rectHeight = boundRectangle.size.y / size.y

    this.initReactangles(size, boundRectangle)

    console.log(this)
  }

  initReactangles(size) {
    for (let x = 0; x < size.x; x++) {
      for (let y = 0; y < size.y; y++) {
        const rectX = x * this.rectWidth + this.boundRectangle.position.x
        const rectY = y * this.rectHeight + this.boundRectangle.position.y

        this.rectangles.push(
          new BoundRectangle(rectX, rectY, this.rectWidth, this.rectHeight)
        )
      }
    }
  }

  insert(particle) {
    const x = Math.floor(particle.position.x / this.rectWidth)
    const y = Math.floor(particle.position.y / this.rectHeight)

    const rectIndex = x * y
    const foundRect = this.rectangles[rectIndex]

    if (foundRect) {
      foundRect.particles.push(particle)
    }
  }

  getIntersectedRectangles(circle) {
    const left = Math.floor(circle.left / this.rectWidth)
    const right = Math.ceil(circle.right / this.rectWidth)
    const bottom = Math.floor(circle.bottom / this.rectHeight)
    const top = Math.ceil(circle.top / this.rectHeight)

    const boundRectangle = new BoundRectangle(
      left * this.rectWidth,
      top * this.rectHeight,
      (right - left) * this.rectWidth,
      (bottom - top) * this.rectHeight
    )

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
  }
}

export class BoundRectangle extends Rectangle {
  constructor(x, y, width, height, particles = []) {
    super(x, y, width, height)

    this.particles = particles
  }
}
