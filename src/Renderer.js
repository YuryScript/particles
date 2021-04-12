import Line from './Line.js'
import { Particle } from './Particle.js'
import Rectangle from './Rectangle.js'
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

    const particles = this.objectToRender.filter((obj) => obj instanceof Particle)
    const lines = this.objectToRender.filter((obj) => obj instanceof Line)
    const rectangles = this.objectToRender.filter((obj) => obj instanceof Rectangle)




    if (this._debug) {
      this.drawPerformanceGraphic()
    }
  }

  drawParticles(ctx, particles, dpiMultiplier) {
    ctx.fillStyle = `rgba(255,255,255,0.5)`
    ctx.beginPath()
    for (const particle of particles) {
      ctx.moveTo(
        particle.position.x * dpiMultiplier,
        particle.position.y * dpiMultiplier
      )
      ctx.arc(
        particle.position.x * dpiMultiplier,
        particle.position.y * dpiMultiplier,
        particle.radius * dpiMultiplier,
        0,
        Math.PI * 2
      )
    }
    ctx.fill()
  }

  drawLines(ctx, lines, dpiMultiplier) {
    ctx.lineWidth = 1 * dpiMultiplier
    for (const line of lines) {
      ctx.strokeStyle = `rgba(255,255,255,${line.alpha})`
      ctx.beginPath()
      ctx.moveTo(
        line.a.x * dpiMultiplier,
        line.a.y * dpiMultiplier
      )
      ctx.lineTo(
        line.b.x * dpiMultiplier,
        line.b.y * dpiMultiplier
      )
      ctx.stroke()
    }
  }

  drawRectangles(ctx, rectangles, dpiMultiplier) {
    ctx.lineWidth = 1 * dpiMultiplier
    ctx.strokeStyle = `rgba(255,255,255,1)`
    ctx.beginPath()
    for (const rectangle of rectangles) {
      ctx.rect(rectangle.position.x, rectangle.position.y, rectangle.size.x, rectangle.size.y)
    }
    ctx.stroke()
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
