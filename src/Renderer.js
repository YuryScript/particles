import Circle from './Circle.js'
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
    this.drawBackground(this._ctx, this._viewportSize, this.transparentBackground, this.gradient, this._dpiMultiplier)

    const particles = this.objectToRender.filter((obj) => obj instanceof Particle)
    const lines = this.objectToRender.filter((obj) => obj instanceof Line)
    const rectangles = this.objectToRender.filter((obj) => obj instanceof Rectangle)
    const circles = this.objectToRender.filter((obj) => obj instanceof Circle)

    this.drawParticles(this._ctx, particles, this._dpiMultiplier)
    this.drawLines(this._ctx, lines, this._dpiMultiplier)
    this.drawRectangles(this._ctx, rectangles, this._dpiMultiplier)
    this.drawCircles(this._ctx, circles, this._dpiMultiplier)

    if (this._debug) {
      this.drawPerformanceGraphic(this._ctx, this.deltas, this._dpiMultiplier)
    }
  }

  drawBackground(ctx, viewportSize, transparentBackground, gradient, dpiMultiplier) {
    if (transparentBackground) {
      ctx.clearRect(
        0,
        0,
        viewportSize.x * dpiMultiplier,
        viewportSize.y * dpiMultiplier
      )
    } else if (gradient) {
      ctx.fillStyle = gradient
      ctx.fillRect(
        0,
        0,
        viewportSize.x * dpiMultiplier,
        viewportSize.y * dpiMultiplier
      )
    } else {
      ctx.fillStyle = this._backgroundColor
      ctx.fillRect(
        0,
        0,
        viewportSize.x * dpiMultiplier,
        viewportSize.y * dpiMultiplier
      )
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

  drawRectangles(ctx, rectangles) {
    ctx.lineWidth = 0.2
    ctx.strokeStyle = `rgba(255,255,255,1)`
    ctx.beginPath()
    for (const rectangle of rectangles) {
      ctx.rect(rectangle.position.x, rectangle.position.y, rectangle.size.x, rectangle.size.y)
    }
    ctx.stroke()
  }

  drawCircles(ctx, circles, dpiMultiplier) {
    ctx.lineWidth = 0.2
    ctx.strokeStyle = `rgba(255,255,255,0.5)`
    ctx.beginPath()
    for (const circle of circles) {
      ctx.moveTo(
        circle.position.x + circle.radius * dpiMultiplier,
        circle.position.y * dpiMultiplier
      )
      ctx.arc(
        circle.position.x * dpiMultiplier,
        circle.position.y * dpiMultiplier,
        circle.radius * dpiMultiplier,
        0,
        Math.PI * 2
      )
    }
    ctx.stroke()
  }

  drawPerformanceGraphic(ctx, deltas, dpiMultiplier) {
    const normalize = (val, min, max) => (val - min) / (max - min)

    const raw = deltas.filter((a) => Boolean(a))
    const min = Math.min(...raw)
    const max = Math.max(...raw)

    ctx.lineWidth = 1
    ctx.font = `${16 * dpiMultiplier}px monospace`
    ctx.strokeStyle = `#fff`
    ctx.fillStyle = `#fff`

    let offsetX = 0
    const startY = 70

    ctx.beginPath()
    ctx.moveTo(
      offsetX * dpiMultiplier,
      (startY - deltas[0]) * dpiMultiplier
    )
    for (const delta of deltas) {
      const offsetY = startY - 50 * normalize(delta, min, max)
      ctx.lineTo(
        offsetX * dpiMultiplier,
        offsetY * dpiMultiplier
      )
      offsetX += 2
    }

    ctx.moveTo(0, startY * dpiMultiplier)
    ctx.lineTo(
      deltas.length * 2 * dpiMultiplier,
      startY * dpiMultiplier
    )
    ctx.fillText(
      min,
      deltas.length * 2 * dpiMultiplier,
      (startY + 4) * dpiMultiplier
    )

    ctx.moveTo(0, (startY - 50) * dpiMultiplier)
    ctx.lineTo(
      deltas.length * 2 * dpiMultiplier,
      (startY - 50) * dpiMultiplier
    )
    ctx.fillText(
      max,
      deltas.length * 2 * dpiMultiplier,
      (startY - 50 + 4) * dpiMultiplier
    )

    ctx.closePath()
    ctx.stroke()

    ctx.fillText(
      `${this.objectToRender.length.toString()} objects`,
      0,
      15 * dpiMultiplier
    )
    ctx.fillText(
      `${deltas[deltas.length - 1]?.toString()} ms`,
      150 * dpiMultiplier,
      15 * dpiMultiplier
    )
  }
}
