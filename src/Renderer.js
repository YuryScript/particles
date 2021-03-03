import Line from "./Line"
import { Particle } from "./Particle"
import Vector2 from "./Vector2"

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

    // TODO
    // const optimized = this.line()
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
    const raw = this.deltas.filter((a) => Boolean(a))
    const min = Math.min(...raw)
    const max = Math.max(...raw)
    this._ctx.font = '16px monospace'
    this._ctx.strokeStyle = `#fff`
    this._ctx.beginPath()
    let offsetX = 0
    const startY = 70
    this._ctx.moveTo(offsetX, startY - this.deltas[0])
    for(const delta of this.deltas) {
      // [0, 50]
      const offsetY = startY - (delta / max * 50)
      this._ctx.lineTo(offsetX,  offsetY)
      offsetX++
    }
    this._ctx.moveTo(0, startY)
    this._ctx.lineTo(this.deltas.length, startY)
    this._ctx.fillText('0', this.deltas.length, startY + 4)
    this._ctx.moveTo(0, startY - 50)
    this._ctx.lineTo(this.deltas.length, startY - 50)
    this._ctx.fillText(max, this.deltas.length, startY - 50 + 4)
    this._ctx.closePath()
    this._ctx.stroke()

    this._ctx.fillStyle = `#fff`
    this._ctx.fillText(`${this.deltas[this.deltas.length - 1]?.toString()} ms (${min}-${max})`, 100, 10)
    this._ctx.fillText(`${this.particles.length.toString()} part`, 0, 10)
  }
}
