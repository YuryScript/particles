import Rectangle from "./Rectangle"
import Vector2 from "./Vector2"

export default class Grid {
  constructor(size = new Vector2(1, 1), boundRectangle = new Rectangle(0, 0, 100, 100)) {
    this.rectangles = []

    this.size = size

    this.boundRectangle = boundRectangle

    this.initReactangles(size, boundRectangle)
  }

  initReactangles(size, boundRectangle) {
    for (let x = 0; x < size.x; x++) {
      for (let y = 0; y < size.y; y++) {
        const width = boundRectangle.size.x / size.x;
        const height = boundRectangle.size.y / size.y;
        this.rectangles.push(new BoundRectangle(x * width, y * height, width, height))
      }
    }
  }

  insert(particle) {
    const foundRect = this.rectangles.find((rect) => rect.contains(particle.position))
    if (foundRect) {
      foundRect.particles.push(particle)
      return true
    }
    return false
  }

  getIntersectedRectangles(circle) {
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
