import Line from "./Line.js"
import { Particle } from "./Particle.js"
import Vector2 from "./Vector2.js"

export default class Renderer {
  constructor(ctx, backgroundColor = '#000', viewportSize = new Vector2(300, 150)) {
    this.particles = []

    this.lines = []

    this.deltas

    this.gradient

    this._ctx = ctx

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
    } else if(this.gradient) {
      this._ctx.fillStyle = this.gradient
      this._ctx.fillRect(0, 0, this._viewportSize.x, this._viewportSize.y)
    } else {
      this._ctx.fillStyle = this._backgroundColor
      this._ctx.fillRect(0, 0, this._viewportSize.x, this._viewportSize.y)
    }

    const particlesWithLetter = this.particles.filter((p) => Boolean(p.letter))
    const particlesWithoutLetter = this.particles.filter((p) => !Boolean(p.letter))

    this._ctx.fillStyle = `rgba(255,255,255,0.7)`
    this._ctx.font = '30px monospace'
    for (const particle of particlesWithLetter) {
      this._ctx.fillText(particle.letter, particle.position.x - 8, particle.position.y + 10)
    }


    this._ctx.fillStyle = `rgba(255,255,255,0.5)`
    this._ctx.beginPath()
    for (const particle of particlesWithoutLetter) {
      this._ctx.moveTo(particle.position.x, particle.position.y)
      this._ctx.arc(particle.position.x, particle.position.y, particle.radius, 0, Math.PI * 2)
    }
    this._ctx.fill()

    for (const line of this.lines) {
      this._ctx.beginPath()
      this._ctx.strokeStyle = `rgba(255,255,255,${line.alpha})`
      this._ctx.moveTo(line.a.x, line.a.y)
      this._ctx.lineTo(line.b.x, line.b.y)
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
    this._ctx.font = '16px monospace'
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
    this._ctx.fillText('0', this.deltas.length, offsetY + 4)
    this._ctx.moveTo(0, offsetY - 16)
    this._ctx.lineTo(this.deltas.length, offsetY - 16)
    this._ctx.fillText('16', this.deltas.length, offsetY - 16 + 4)
    this._ctx.moveTo(0, offsetY - 33)
    this._ctx.lineTo(this.deltas.length, offsetY - 33)
    this._ctx.fillText('33', this.deltas.length, offsetY - 33 + 4)
    this._ctx.moveTo(0, offsetY - 50)
    this._ctx.lineTo(this.deltas.length, offsetY - 50)
    this._ctx.fillText('50', this.deltas.length, offsetY - 50 + 4)
    this._ctx.stroke()
    this._ctx.fillStyle = `#fff`
    this._ctx.fillText(`${this.deltas[this.deltas.length - 1]?.toString()} ms`, 0, 10)
  }
}
