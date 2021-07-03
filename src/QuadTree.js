import Rectangle from './Rectangle.js'

export default class QuadTree {
  constructor(rectangle, capacity) {
    this.rectangle = rectangle

    this.capacity = capacity

    this.points = []

    this.divided = false

    this.northEast = null

    this.northWest = null

    this.southEast = null

    this.southWest = null
  }

  subdivide() {
    const x = this.rectangle.position.x
    const y = this.rectangle.position.y
    const w = this.rectangle.size.x
    const h = this.rectangle.size.y
    const capacity = this.capacity

    this.northEast = new QuadTree(new Rectangle(x, y, w / 2, h / 2), capacity)
    this.northWest = new QuadTree(
      new Rectangle(x + w / 2, y, w / 2, h / 2),
      capacity
    )
    this.southEast = new QuadTree(
      new Rectangle(x, y + h / 2, w / 2, h / 2),
      capacity
    )
    this.southWest = new QuadTree(
      new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2),
      capacity
    )
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
      (this.northEast.insert(point) ||
        this.northWest.insert(point) ||
        this.southEast.insert(point) ||
        this.southWest.insert(point)) ??
      false
    )
  }

  queryCircle(circle) {
    const result = []
    const unseenQuadTree = []

    unseenQuadTree.push(this)

    for (let i = 0; i < unseenQuadTree.length; i++) {
      const quadTree = unseenQuadTree[i]

      if (quadTree.rectangle.intersectsCircle(circle)) {
        for (const p of quadTree.points) {
          if (circle.intersectsPoint(p.position)) {
            result.push(p)
          }
        }

        if (quadTree.divided) {
          unseenQuadTree.push(quadTree.northEast)
          unseenQuadTree.push(quadTree.northWest)
          unseenQuadTree.push(quadTree.southEast)
          unseenQuadTree.push(quadTree.southWest)
        }
      }
    }

    return result
  }

  getAllRectangles() {
    const unseenQuadTree = []

    unseenQuadTree.push(this)

    for (let i = 0; i < unseenQuadTree.length; i++) {
      const quadTree = unseenQuadTree[i]

      if (quadTree.divided) {
        unseenQuadTree.push(quadTree.northEast)
        unseenQuadTree.push(quadTree.northWest)
        unseenQuadTree.push(quadTree.southEast)
        unseenQuadTree.push(quadTree.southWest)
      }
    }

    return unseenQuadTree.map((quadTree) => quadTree.rectangle)
  }

  clear() {
    this.points = []
    this.divided = false
    this.northEast = null
    this.northWest = null
    this.southEast = null
    this.southWest = null
  }
}
