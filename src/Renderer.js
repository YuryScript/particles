import Vector2 from "./Vector2"

export default class Renderer {
  constructor(ctx, objectsToRender = [], backgroundColor = '#000', viewportSize = new Vector2(300, 150)) {
    this._ctx = ctx

    this._objectsToRender = objectsToRender

    this._renderList

    this._viewportSize = viewportSize

    this._transparentBackground = false

    this._backgroundColor = backgroundColor
  }

  set viewportSize(value) {
    this._viewportSize = value
  }

  render() {
    if (this._transparentBackground) {
      this._ctx.clearRect()
    } else {
      this._ctx.fillStyle = this._backgroundColor
      this._ctx.fillRect(0, 0, this._viewportSize.x, this._viewportSize.y)
    }

    // TODO: filter objectsToRender
    this._renderList = this._objectsToRender

    for (const object of this._renderList) {
      this.drawCircle(
        this._ctx,
        object.position.x,
        object.position.y,
        object.radius,
        "#fff"
      )
    }
  }

  drawCircle(ctx, x, y, radius, color) {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }
}
