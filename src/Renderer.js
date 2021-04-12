import Line from './Line.js'
import { Particle } from './Particle.js'
import Vector2 from './Vector2.js'

export default class Renderer {
  constructor(
    ctx,
    backgroundColor = '#000',
    viewportSize = new Vector2(300, 150),
    dpiMultiplier = 1
  ) {
    this.objectToRender = []

    this.deltas = []

    this.gradient = null

    this._dpiMultiplier = dpiMultiplier

    this._ctx = ctx

    this._debug = false

    this._viewportSize = viewportSize

    this.transparentBackground = true

    this._backgroundColor = backgroundColor
  }

  set viewportSize(value) {
    this._viewportSize = value
  }

  render() {
    if (this.transparentBackground) {
      this._ctx.clearRect(
        0,
        0,
        this._viewportSize.x * this._dpiMultiplier,
        this._viewportSize.y * this._dpiMultiplier
      )
    } else if (this.gradient) {
      this._ctx.fillStyle = this.gradient
      this._ctx.fillRect(
        0,
        0,
        this._viewportSize.x * this._dpiMultiplier,
        this._viewportSize.y * this._dpiMultiplier
      )
    } else {
      this._ctx.fillStyle = this._backgroundColor
      this._ctx.fillRect(
        0,
        0,
        this._viewportSize.x * this._dpiMultiplier,
        this._viewportSize.y * this._dpiMultiplier
      )
    }

    for (const obj of this.objectToRender) {
      if (obj instanceof Particle) {
        this._ctx.fillStyle = `rgba(255,255,255,0.5)`
        this._ctx.beginPath()
        this._ctx.moveTo(
          obj.position.x * this._dpiMultiplier,
          obj.position.y * this._dpiMultiplier
        )
        this._ctx.arc(
          obj.position.x * this._dpiMultiplier,
          obj.position.y * this._dpiMultiplier,
          obj.radius * this._dpiMultiplier,
          0,
          Math.PI * 2
        )
        this._ctx.fill()
      }

      if (obj instanceof Line) {
        this._ctx.lineWidth = 1 * this._dpiMultiplier
        this._ctx.beginPath()
        this._ctx.strokeStyle = `rgba(255,255,255,${obj.alpha})`
        this._ctx.moveTo(
          obj.a.x * this._dpiMultiplier,
          obj.a.y * this._dpiMultiplier
        )
        this._ctx.lineTo(
          obj.b.x * this._dpiMultiplier,
          obj.b.y * this._dpiMultiplier
        )
        this._ctx.stroke()
      }
    }

    if (this._debug) {
      this.drawPerformanceGraphic()
    }
  }

  drawPerformanceGraphic() {
    const normalize = (val, min, max) => (val - min) / (max - min)

    const raw = this.deltas.filter((a) => Boolean(a))
    const min = Math.min(...raw)
    const max = Math.max(...raw)

    this._ctx.font = `${16 * this._dpiMultiplier}px monospace`
    this._ctx.strokeStyle = `#fff`
    this._ctx.fillStyle = `#fff`

    let offsetX = 0
    const startY = 70

    this._ctx.beginPath()
    this._ctx.moveTo(
      offsetX * this._dpiMultiplier,
      (startY - this.deltas[0]) * this._dpiMultiplier
    )
    for (const delta of this.deltas) {
      const offsetY = startY - 50 * normalize(delta, min, max)
      this._ctx.lineTo(
        offsetX * this._dpiMultiplier,
        offsetY * this._dpiMultiplier
      )
      offsetX += 1
    }

    this._ctx.moveTo(0, startY * this._dpiMultiplier)
    this._ctx.lineTo(
      this.deltas.length * this._dpiMultiplier,
      startY * this._dpiMultiplier
    )
    this._ctx.fillText(
      min,
      this.deltas.length * this._dpiMultiplier,
      (startY + 4) * this._dpiMultiplier
    )

    this._ctx.moveTo(0, (startY - 50) * this._dpiMultiplier)
    this._ctx.lineTo(
      this.deltas.length * this._dpiMultiplier,
      (startY - 50) * this._dpiMultiplier
    )
    this._ctx.fillText(
      max,
      this.deltas.length * this._dpiMultiplier,
      (startY - 50 + 4) * this._dpiMultiplier
    )

    this._ctx.closePath()
    this._ctx.stroke()

    this._ctx.fillText(
      `${this.objectToRender.length.toString()} objects`,
      0,
      15 * this._dpiMultiplier
    )
    this._ctx.fillText(
      `${this.deltas[this.deltas.length - 1]?.toString()} ms`,
      130 * this._dpiMultiplier,
      15 * this._dpiMultiplier
    )
  }
}
