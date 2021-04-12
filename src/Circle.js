import Vector2 from "./Vector2.js"

export default class Circle {
  constructor(x = 0, y = 0, radius = 0) {
    this.position = new Vector2(x, y)

    this.radius = radius
  }

  get center() {
    return this.position
  }

  set center(value) {
    this.position = value
  }

  get diameter() {
    return this.radius * 2
  }

  set diameter(value) {
    this.radius = value * 0.5
  }

  get left() {
    return this.position.x - this.radius
  }

  set left(value) {
    this.position.x = value + this.radius
  }

  get right() {
    return this.position.x + this.radius
  }

  set right(value) {
    this.position.x = value - this.radius
  }

  get top() {
    return this.position.y + this.radius
  }

  set top(value) {
    this.position.y = value - this.radius
  }

  get bottom() {
    return this.position.y - this.radius
  }

  set bottom(value) {
    this.position.y = value + this.radius
  }

  intersectsPoint(point) {
    return (point.distance(this.position) <= this.radius)
  }
}