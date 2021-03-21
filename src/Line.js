import Vector2 from './Vector2.js'

export default class Line {
  constructor(a = new Vector2(), b = new Vector2()) {
    this.a = a
    this.b = b
  }

  length() {
    return Math.sqrt((this.b.x - this.a.x) * (this.b.x - this.a.x) + (this.b.y - this.a.y) * (this.b.y - this.a.y))
  }
}
