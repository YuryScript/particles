/** Original https://github.com/matteobruni/tsparticles/blob/b6c06ee17d4a0bba9bb1266a2c1a0ed60a0fafc5/core/main/src/Utils/QuadTree.ts */
import Vector2 from "./Vector2"
import Rectangle from "./Rectangle"

export default class QuadTree {
  constructor(rectangle, capacity) {
    this.rectangle = rectangle

    this.capacity = capacity

    this.points = []

    this.divided = false

    this.northEast

    this.northWest

    this.southEast
    
    this.southWest
  }

  subdivide() {
    const x = this.rectangle.position.x
    const y = this.rectangle.position.y
    const w = this.rectangle.size.x
    const h = this.rectangle.size.y
    const capacity = this.capacity

    this.northEast = new QuadTree(new Rectangle(x, y, w / 2, h / 2), capacity)
    this.northWest = new QuadTree(new Rectangle(x + w / 2, y, w / 2, h / 2), capacity)
    this.southEast = new QuadTree(new Rectangle(x, y + h / 2, w / 2, h / 2), capacity)
    this.southWest = new QuadTree(new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2), capacity)
    this.divided = true
  }

  insert(point) {
    if (!this.rectangle.contains(point.position)) {
      return false
    }

    if (this.points.length < this.capacity) {
      this.points.push(point)

      return true
    }

    if (!this.divided) {
      this.subdivide()
    }

    return (
      (this.northEast?.insert(point) ||
        this.northWest?.insert(point) ||
        this.southEast?.insert(point) ||
        this.southWest?.insert(point)) ??
      false
    )
  }

  queryCircle(circle, found) {
    const res = found ?? []

    if (!this.rectangle.intersectsCircle(circle)) {
      return []
    } else {
      for (const p of this.points) {
        if (!circle.intersectsPoint(p.position)) {
          continue
        }

        res.push(p.particle)
      }

      if (this.divided) {
        this.northEast?.query(circle, res)
        this.northWest?.query(circle, res)
        this.southEast?.query(circle, res)
        this.southWest?.query(circle, res)
      }
    }

    return res
  }
}