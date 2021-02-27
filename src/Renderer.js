import Line from "./Line"
import { Particle } from "./Particle"
import Vector2 from "./Vector2"

export default class Renderer {
  constructor(ctx, backgroundColor = '#000', viewportSize = new Vector2(300, 150)) {
    this._ctx = ctx

    this.particles = []

    this.lines = []

    this.deltas

    this._debug

    this._viewportSize = viewportSize

    this._transparentBackground = false

    this._backgroundColor = backgroundColor

    this._ctx.lineWidth = 1
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

    this._ctx.fillStyle = `rgba(255,255,255,0.5)`
    this._ctx.beginPath()
    for (const object of this.particles) {
      this._ctx.moveTo(object.position.x, object.position.y)
      this._ctx.arc(object.position.x, object.position.y, object.radius, 0, Math.PI * 2)
    }
    this._ctx.fill()

    for (const object of this.lines) {
      this._ctx.beginPath()
      this._ctx.strokeStyle = `rgba(255,255,255,${object.alpha})`
      this._ctx.moveTo(object.a.x, object.a.y)
      this._ctx.lineTo(object.b.x, object.b.y)
      this._ctx.stroke()
    }
    
    if(this._debug) {
      this.drawPerformanceGraphic()
    }
  }

  drawCircle(ctx, x, y, radius, color) {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }

  drawPerformanceGraphic() {
    this._ctx.strokeStyle = `#fff`
    this._ctx.beginPath()
    let offsetX = 0
    const offsetY = 70
    this._ctx.moveTo(offsetX, offsetY - this.deltas[0])
    for(const delta of this.deltas) {
      this._ctx.lineTo(offsetX, offsetY - delta)
      offsetX++
    }
    this._ctx.moveTo(0, offsetY)
    this._ctx.lineTo(this.deltas.length, offsetY)
    this._ctx.fillText('0', this.deltas.length, offsetY + 4, 10)
    this._ctx.moveTo(0, offsetY - 16)
    this._ctx.lineTo(this.deltas.length, offsetY - 16)
    this._ctx.fillText('16', this.deltas.length, offsetY - 16 + 4, 10)
    this._ctx.moveTo(0, offsetY - 33)
    this._ctx.lineTo(this.deltas.length, offsetY - 33)
    this._ctx.fillText('33', this.deltas.length, offsetY - 33 + 4, 10)
    this._ctx.moveTo(0, offsetY - 50)
    this._ctx.lineTo(this.deltas.length, offsetY - 50)
    this._ctx.fillText('50', this.deltas.length, offsetY - 50 + 4, 10)
    this._ctx.stroke()
    this._ctx.fillStyle = `#fff`
    this._ctx.fillText(`${this.deltas[this.deltas.length - 1]?.toString()} ms`, 0, 10, 30)
  }
}
