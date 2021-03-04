import r from"./Vector2.js";export default class o{constructor(t=0,i=0,s=0){this.position=new r(t,i),this.radius=s}intersectsPoint(t){return t.distance(this.position)<=this.radius}}
