import Renderer from 'Renderer';

export default class Particles {
	constructor(node) {
		this._node = node;

		this.renderer = new Renderer();

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