import Rectangle from "./Rectangle"
import Vector2 from "./Vector2"

export default class Grid {
  constructor(size = new Vector2(1, 1), boundRectangle = new Rectangle(0, 0, 100, 100)) {
    this.rectangles = []

    this.size = size

    this.boundRectangle = boundRectangle

    this.width = boundRectangle.size.x / size.x;
    this.height = boundRectangle.size.y / size.y;

    this.initReactangles(size, boundRectangle)
  }

  initReactangles(size) {
    for (let x = 0; x < size.x; x++) {
      for (let y = 0; y < size.y; y++) {
        this.rectangles.push(new BoundRectangle(x * this.width, y * this.height, this.width, this.height))
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
    const result = []

    let left = Math.floor(circle.left / this.width)
    const right = Math.floor(circle.right / this.width)
    const top = Math.floor(circle.top / this.height)
    let bottom = Math.floor(circle.bottom / this.height)
    if (bottom < 0) {
      bottom = 0
    }

    if (left < 0) {
      left = 0
    }

    for (let x = left; x < right; x++) {
      for (let y = bottom; y < top; y++) {
        result.push(this.rectangles[x * y])
      }
    }

    return result
  }

  getIntersectedRectanglesOld(circle) {
    const result = []

    for (let i = 0; i < this.rectangles.length; i++) {
      const rect = this.rectangles[i]

      if (rect.intersectsCircle(circle)) {
        result.push(rect)
      }
    }

    return result
  }

  queryCircle(circle) {
    const result = []

    const rectangles = this.getIntersectedRectangles(circle)

    for (let i = 0; i < rectangles.length; i++) {
      const rect = rectangles[i]

      for (const particle of rect.particles) {

        if (circle.intersectsPoint(particle.position)) {
          result.push(particle)
        }

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
