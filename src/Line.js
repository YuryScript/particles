import Vector2 from "./Vector2";

export default class Line {
	constructor(a = new Vector2(), b = new Vector2()) {
		this.a = a
		this.b = b
	}

	length(line) {
		return Math.sqrt((line.b.x - line.a.x) * (line.b.x - line.a.x) + (line.b.y - line.a.y) * (line.b.y - line.a.y));
	}
}