import Line from "./Line"
import { Particle } from "./Particle"
import Vector2 from "./Vector2"

export default class Renderer {
  constructor(ctx, objectsToRender = [], backgroundColor = '#000', viewportSize = new Vector2(300, 150)) {
    this._ctx = ctx

    this._objectsToRender = objectsToRender

    this._viewportSize = viewportSize

    this._transparentBackground = false

    this._backgroundColor = backgroundColor
  }

  set viewportSize(value) {
    this._viewportSize = value
  }

  get objectsToRender() {
    return this._objectsToRender
  }

  set objectsToRender(value) {
    this._objectsToRender = value
  }

  render() {
    if (this._transparentBackground) {
      this._ctx.clearRect()
    } else {
      this._ctx.fillStyle = this._backgroundColor
      this._ctx.fillRect(0, 0, this._viewportSize.x, this._viewportSize.y)
    }

    for (const object of this._objectsToRender) {
      if (object instanceof Particle) {
        this.drawCircle(
          this._ctx,
          object.position.x,
          object.position.y,
          object.radius,
          `rgba(255,255,255,0.5)`
        )
        continue
      }

      if (object instanceof Line) {
        this._ctx.strokeStyle = `rgba(255,255,255,${object.alpha})`
        this._ctx.lineWidth = 1
        this._ctx.beginPath()
        this._ctx.moveTo(object.a.x, object.a.y)
        this._ctx.lineTo(object.b.x, object.b.y)
        this._ctx.stroke()
        continue
      }
    }
  }

  drawCircle(ctx, x, y, radius, color) {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }
}
