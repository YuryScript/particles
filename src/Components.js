import Vector2 from './Vector2.js'

export class Component {
  static create(...args) {
    const component = new this(...args)
    this.components.push(component)
    return component
  }

  static remove(componentA) {
    this.components = this.components.filter((componentB) => componentA !== componentB)
  }
}

export class PositionComponent extends Component {
  constructor(position = new Vector2()) {
    super()
    this.position = position
  }

  static components = []
}

export class RotationComponent extends Component {
  constructor(rotation = 0) {
    super()
    this.rotation = rotation
  }

  static components = []
}

export class Entity {
  constructor(name = 'Entity', components = []) {
    this.name = name

    this.components = components
  }
}

