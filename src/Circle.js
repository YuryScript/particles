import Vector2 from "./Vector2.js";

export default class Circle {
  constructor(x = 0, y = 0, radius = 0) {
    this.position = new Vector2(x, y)

    this.radius = radius
  }

  intersectsPoint(point) {
    return (point.distance(this.position) <= this.radius)
  }
}