import Rectangle from "../src/Rectangle.js";
import Vector2 from "../src/Vector2.js";
import { assertEqual } from "./test.js";

export default function testRect() {
  const rect = new Rectangle()

  rect.left = 2

  rect.right = 7

  rect.top = 3

  rect.bottom = 6

  assertEqual('Rectangle left', rect.left, 2)

  assertEqual('Rectangle right', rect.right, 7)

  assertEqual('Rectangle top', rect.top, 3)

  assertEqual('Rectangle bottom', rect.bottom, 6)

  assertEqual('Rectangle center x', rect.center.x, 4.5)

  assertEqual('Rectangle center y', rect.center.y, 4.5)

  const pointContain = [
    new Vector2(3, 4),
    new Vector2(2, 3),
    new Vector2(5, 6),
  ]
 
  for(const point of pointContain) {
    assertEqual(`Rectangle contain point x:${point.x} y:${point.y}`, rect.contains(point), true)
  }

  const pointNotContain = [
    new Vector2(0, 0),
    new Vector2(-100, -100),
    new Vector2(Infinity, 6),
    new Vector2(NaN, -Infinity),
    new Vector2('123', {a:1}),
  ]
 
  for(const point of pointNotContain) {
    assertEqual(`Rectangle contain point x:${point.x} y:${point.y}`, rect.contains(point), false)
  }
};