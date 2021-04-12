import Vector2 from './Vector2.js'

export default class Renderer {
  constructor(
    ctx,
    backgroundColor = '#000',
    viewportSize = new Vector2(300, 150),
    dpiMultiplier = 1
  ) {
    this.particles = []

    this.lines = []

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

    const particlesWithLetter = this.particles.filter((p) => Boolean(p.letter))
    const particlesWithoutLetter = this.particles.filter(
      (p) => !Boolean(p.letter)
    )

    this._ctx.fillStyle = `rgba(255,255,255,0.7)`
    this._ctx.font = `${30 * this._dpiMultiplier}px monospace`
    for (const particle of particlesWithLetter) {
      this._ctx.fillText(
        particle.letter,
        (particle.position.x - 8) * this._dpiMultiplier,
        (particle.position.y + 10) * this._dpiMultiplier
      )
    }

    this._ctx.fillStyle = `rgba(255,255,255,0.5)`
    this._ctx.beginPath()
    for (const particle of particlesWithoutLetter) {
      this._ctx.moveTo(
        particle.position.x * this._dpiMultiplier,
        particle.position.y * this._dpiMultiplier
      )
      this._ctx.arc(
        particle.position.x * this._dpiMultiplier,
        particle.position.y * this._dpiMultiplier,
        particle.radius * this._dpiMultiplier,
        0,
        Math.PI * 2
      )
    }
    this._ctx.fill()

    this._ctx.lineWidth = 1 * this._dpiMultiplier
    for (const line of this.lines) {
      this._ctx.beginPath()
      this._ctx.strokeStyle = `rgba(255,255,255,${line.alpha})`
      this._ctx.moveTo(
        line.a.x * this._dpiMultiplier,
        line.a.y * this._dpiMultiplier
      )
      this._ctx.lineTo(
        line.b.x * this._dpiMultiplier,
        line.b.y * this._dpiMultiplier
      )
      this._ctx.stroke()
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

    const objectAmount = this.particles.length + this.lines.length

    this._ctx.fillText(
      `${objectAmount.toString()} objects`,
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
