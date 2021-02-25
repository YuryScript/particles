export default class Renderer {
  constructor(ctx, objectsToRender = []) {
    this.ctx = ctx;

    this.camera = null;

    this._objectsToRender = objectsToRender;

    this._renderList;

    this._transparentBackground = false;

    this._backgroundColor = "#000";
  }

  render() {
    if (this._transparentBackground) {
      this.ctx.clearRect();
    } else {
      this.ctx.fillStyle = this._backgroundColor;
      this.ctx.fillRect(0, 0, 100, 100);
    }

    // TODO: filter objectsToRender
    this._renderList = this._objectsToRender;

    for (const object of this._renderList) {
      this.drawCircle(
        this.ctx,
        object.position.x,
        object.position.y,
        object.radius,
        "#ccc"
      );
    }
  }

  drawCircle(ctx, x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
