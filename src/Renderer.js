import Circle from './Circle.js'
import Line from './Line.js'
import { Particle } from './Particle.js'
import Rectangle from './Rectangle.js'
import Vector2 from './Vector2.js'

export default class Renderer {
  constructor(
    ctx,
    backgroundColor = '#000',
    viewportSize = new Vector2(300, 150)
  ) {
    this.objectToRender = []

    this.deltas = []

    this.gradient = null

    this.ctx = ctx

    this.debug = false

    this.viewportSize = viewportSize

    this.transparentBackground = true

    this.backgroundColor = backgroundColor
  }

  render() {
    this.drawBackground(
      this.ctx,
      this.viewportSize,
      this.transparentBackground,
      this.gradient
    )

    const particles = this.objectToRender.filter(
      (obj) => obj instanceof Particle
    )
    const lines = this.objectToRender.filter((obj) => obj instanceof Line)
    const rectangles = this.objectToRender.filter(
      (obj) => obj instanceof Rectangle
    )
    const circles = this.objectToRender.filter((obj) => obj instanceof Circle)

    this.drawParticles(this.ctx, particles)
    this.drawLines(this.ctx, lines)
    this.drawRectangles(this.ctx, rectangles)
    this.drawCircles(this.ctx, circles)

    if (this.debug) {
      this.drawPerformanceGraphic(this.ctx, this.deltas)
    }
  }

  drawBackground(
    ctx,
    viewportSize,
    transparentBackground,
    gradient,
    dpiMultiplier
  ) {
    if (transparentBackground) {
      ctx.clearRect(0, 0, viewportSize.x, viewportSize.y)
    } else if (gradient) {
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, viewportSize.x, viewportSize.y)
    } else {
      ctx.fillStyle = this.backgroundColor
      ctx.fillRect(0, 0, viewportSize.x, viewportSize.y)
    }
  }

  drawParticles(ctx, particles) {
    ctx.fillStyle = `rgba(255,255,255,0.5)`
    ctx.beginPath()
    for (const particle of particles) {
      ctx.moveTo(particle.position.x, particle.position.y)
      ctx.arc(
        particle.position.x,
        particle.position.y,
        particle.radius,
        0,
        Math.PI * 2
      )
    }
    ctx.fill()
  }

  drawLines(ctx, lines) {
    ctx.lineWidth = 1
    for (const line of lines) {
      ctx.strokeStyle = `rgba(255,255,255,${line.alpha})`
      ctx.beginPath()
      ctx.moveTo(line.a.x, line.a.y)
      ctx.lineTo(line.b.x, line.b.y)
      ctx.stroke()
    }
  }

  drawRectangles(ctx, rectangles) {
    ctx.lineWidth = 0.2
    ctx.strokeStyle = `rgba(255,255,255,1)`
    ctx.beginPath()
    for (const rectangle of rectangles) {
      ctx.rect(
        rectangle.position.x,
        rectangle.position.y,
        rectangle.size.x,
        rectangle.size.y
      )
    }
    ctx.stroke()
  }

  drawCircles(ctx, circles) {
    ctx.lineWidth = 0.2
    ctx.strokeStyle = `rgba(255,255,255,0.5)`
    ctx.beginPath()
    for (const circle of circles) {
      ctx.moveTo(circle.position.x + circle.radius, circle.position.y)
      ctx.arc(
        circle.position.x,
        circle.position.y,
        circle.radius,
        0,
        Math.PI * 2
      )
    }
    ctx.stroke()
  }

  drawPerformanceGraphic(ctx, deltas) {
    const normalize = (val, min, max) => (val - min) / (max - min)

    const raw = deltas.filter((a) => Boolean(a))
    const min = Math.min(...raw)
    const max = Math.max(...raw)

    ctx.lineWidth = 1
    ctx.font = `${16}px monospace`
    ctx.strokeStyle = `#fff`
    ctx.fillStyle = `#fff`

    let offsetX = 0
    const startY = 70

    ctx.beginPath()
    ctx.moveTo(offsetX, startY - deltas[0])
    for (const delta of deltas) {
      const offsetY = startY - 50 * normalize(delta, min, max)
      ctx.lineTo(offsetX, offsetY)
      offsetX += 2
    }

    ctx.moveTo(0, startY)
    ctx.lineTo(deltas.length * 2, startY)
    ctx.fillText(min, deltas.length * 2, startY + 4)

    ctx.moveTo(0, startY - 50)
    ctx.lineTo(deltas.length * 2, startY - 50)
    ctx.fillText(max, deltas.length * 2, startY - 50 + 4)

    ctx.closePath()
    ctx.stroke()

    ctx.fillText(`${this.objectToRender.length.toString()} objects`, 0, 15)
    ctx.fillText(`${deltas[deltas.length - 1]?.toString()} ms`, 150, 15)
  }
}
