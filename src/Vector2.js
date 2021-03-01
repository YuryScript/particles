export default class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }
  /** Create Vector form another Vector */
  static fromVector(vector) {
    return new Vector2(vector.x, vector.y)
  }
  /** Create Vector form array */
  static fromArray(array) {
    return new Vector2(array[0], array[1])
  }
  /** Set the `x` and `y` components of the this Vector to the given `x` and `y` values. */
  set(x, y = x) {
    this.x = x
    this.y = y
    return this
  }
  /** Sets the `x` and `y` values of this object from a given polar coordinate. */
  setToPolar(azimuth, radius = 1) {
    this.x = Math.cos(azimuth) * radius
    this.y = Math.sin(azimuth) * radius
    return this
  }
  /** Check whether this Vector is equal to a given Vector. */
  equals(v) {
    return this.x === v.x && this.y === v.y
  }
  /** Calculate the angle between this Vector and the positive x-axis, in radians. */
  angle() {
    let angle = Math.atan2(this.y, this.x)
    if (angle < 0) {
      angle += 2 * Math.PI
    }
    return angle
  }
  /** Set the angle of this Vector. */
  setAngle(angle) {
    return this.setToPolar(angle, this.length())
  }
  /** Add a given Vector to this Vector. Addition is component-wise. */
  add(src) {
    this.x += src.x
    this.y += src.y
    return this
  }
  /** Subtract the given Vector from this Vector. Subtraction is component-wise. */
  subtract(src) {
    this.x -= src.x
    this.y -= src.y
    return this
  }
  /** Multiplies this Vector by the given Vector. */
  multiply(src) {
    this.x *= src.x
    this.y *= src.y
    return this
  }
  /** Divides this Vector by the given Vector. */
  divide(src) {
    this.x /= src.x
    this.y /= src.y
    return this
  }
  /** Scale this Vector by the given value. */
  scale(value) {
    if (isFinite(value)) {
      this.x *= value
      this.y *= value
    } else {
      this.x = 0
      this.y = 0
    }
    return this
  }
  /** Negate the `x` and `y` components of this Vector. */
  negate() {
    this.x = -this.x
    this.y = -this.y
    return this
  }
  /** Calculate the distance between this Vector and the given Vector. */
  distance(src) {
    const dx = src.x - this.x
    const dy = src.y - this.y

    return Math.sqrt(dx * dx + dy * dy)
  }
  /** Calculate the distance between this Vector and the given Vector, squared. */
  distanceSq(src) {
    const dx = src.x - this.x
    const dy = src.y - this.y

    return dx * dx + dy * dy
  }
  /** Calculate the length (or magnitude) of this Vector. */
  length() {
    const x = this.x
    const y = this.y

    return Math.sqrt(x * x + y * y)
  }
  /** Set the length (or magnitude) of this Vector. */
  setLength(length) {
    return this.normalize().scale(length)
  }
  /** Calculate the length of this Vector squared. */
  lengthSq() {
    const x = this.x
    const y = this.y

    return x * x + y * y
  }
  /** Makes the vector a unit length vector (magnitude of 1) in the same direction. */
  normalize() {
    const x = this.x
    const y = this.y
    let len = x * x + y * y

    if (len > 0) {
      len = 1 / Math.sqrt(len)

      this.x = x * len
      this.y = y * len
    }

    return this
  }
  /** Rotate this Vector to its perpendicular, in the positive direction. */
  normalizeRightHand() {
    const x = this.x

    this.x = this.y * -1
    this.y = x

    return this
  }
  /** Rotate this Vector to its perpendicular, in the negative direction. */
  normalizeLeftHand() {
    const x = this.x

    this.x = this.y
    this.y = x * -1

    return this
  }
  /** Calculate the dot product of this Vector and the given Vector. */
  dot(src) {
    return this.x * src.x + this.y * src.y
  }
  /** Calculate the cross product of this Vector and the given Vector. */
  cross(src) {
    return this.x * src.y - this.y * src.x
  }
  /**Linearly interpolate between this Vector and the given Vector.
   *
   * Interpolates this Vector towards the given Vector.
   * The interpolation percentage, between 0 and 1.
   */
  lerp(src, t = 0) {
    const ax = this.x
    const ay = this.y

    this.x = ax + t * (src.x - ax)
    this.y = ay + t * (src.y - ay)

    return this
  }
  /** Make this Vector the zero vector (0, 0). */
  reset() {
    this.x = 0
    this.y = 0

    return this
  }
  /** Limit the length (or magnitude) of this Vector. */
  limit(max) {
    const len = this.length()

    if (len && len > max) {
      this.scale(max / len)
    }

    return this
  }
  /** Reflect this Vector off a line defined by a normal. */
  reflect(normal) {
    normal = Vector2.fromVector(normal).normalize()

    return this.subtract(normal.scale(2 * this.dot(normal)))
  }
  /** Reflect this Vector across another. */
  mirror(axis) {
    return this.reflect(axis).negate()
  }
  /** Rotate this Vector by an angle amount.
   *
   * The angle to rotate by, in radians.
   */
  rotate(delta) {
    const cos = Math.cos(delta)
    const sin = Math.sin(delta)

    return this.set(cos * this.x - sin * this.y, sin * this.x + cos * this.y)
  }

  toPolar() {
    return {
      p: Math.sqrt(this.x * this.x + this.y * this.y),
      q: Math.atan2(this.y, this.x),
    }
  }
}
