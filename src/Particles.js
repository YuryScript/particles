import Renderer from 'Renderer';

export default class Particles {
	constructor(canvasNode) {
		this._node = canvasNode;

		this.ctx = this._node.getContext('2d');

		this.renderer = new Renderer(this.ctx);

		this._boundUpdate = this.update.bind(this);

		this._isRunning;

		this.start();
	}

	start() {
		this._isRunning = true;
		window.requestAnimationFrame(this._boundUpdate);
	}

	stop() {
		this._isRunning = false;
	}

	update() {
		this.renderer.render();

		if (this._isRunning) {
			window.requestAnimationFrame(this._boundUpdate);
		}
	}
}