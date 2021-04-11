import Vector2 from './Vector2.js'

export class Component {}

export class PositionComponent extends Component {
  constructor() {
    this.position = new Vector2(0, 0)
  }
}

export class MovementComponent extends Component {
  constructor() {
    this.velocity = new Vector2(0, 0)

    this.acceleration = new Vector2(0, 0)
  }
}

export class RotationComponent {
  constructor(rotation = 0) {
    this.rotation = rotation
  }
}

export class Scene {
  constructor(systemsToInit = []) {
    this.systems = []
    /** readonly */
    this.entities = []

    this.id = new IdGiver()
  }

  addSystem(System) {
    const system = new System()
    system.scene = this
    this.systems.push(system)
    return this
  }

  getEntities(componentsInclude) {
    return this.entities.filter((entity) => {
      for (const componentName of componentsInclude) {
        let count = 0
        if (entity.components[componentName]) {
          count += 1
          if (count === componentsInclude.length) {
            return true
          }
        }
      }
      return false
    })
  }

  createEntity(name) {
    const newId = this.id.getId()
    const entity = new this(newId, name)
    this.entities.push(component)
    return entity
  }

  removeEntity(entityId) {
    this.entities = this.entities.filter((entity) => entity.id !== entityId)
  }

  update() {
    this.systems.forEach((system) => {
      system.update()
    })
  }
}

export class IdGiver {
  constructor(initialId = 0) {
    this._currentId = initialId
  }

  getId() {
    return this._currentId++
  }
}

export class Entity {
  constructor(id, name = 'Entity') {
    this.id = id

    this.name = name

    this.components = {}
  }

  addComponent(component) {
    this.components[component.name] = component
  }
}

export class MovementSystem {
  constructor(scene) {
    this.scene = scene

    this.components = ['PositionComponent', 'MovementComponent']
  }

  update() {
    this.scene.getEntities(this.components).forEach((entity) => {
      entity.components.MovementComponent.velocity.add(entity.MovementComponent.acceleration)

      entity.components.PositionComponent.position.add(entity.MovementComponent.velocity)
    })
  }
}
