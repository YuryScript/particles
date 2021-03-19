import Vector2 from './Vector2.js'

export class Component {
  
}


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
    this.systemsToInit = systemsToInit

    this.systems = []
    /** readonly */
    this.entities = []

    this.id = new IdGiver()
  }

  init() {
    this.systems = this.systemsToInit.map((System) => {
      const system = new System()
      system.scene = this
      return system
    })
  }

  addSystem(System) {
    const system = new System()
    system.scene = this
    this.systems.push(system)
    return this
  }

  createEntity(name, components) {
    const newId = this.id.getId()
    const entity = new this(newId, name, components)
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
  constructor(id, name = 'Entity', componentsToInit = []) {
    this.id = id
    
    this.name = name

    this._init(componentsToInit)
  }

  _init(componentsToInit) {
    componentsToInit.forEach((Component) => {
      this[Component.name] = new Component()
    })
  }
}

export class MovementSystem {
  constructor(scene) {
    this.scene = scene

    this.entitiesToUpdate = []
  }

  getEntities() {
    this.entitiesToUpdate = this.scene.entities.filter((entity) => {
      return (entity?.PositionComponent && entity?.MovementComponent)
    })
  }

  update() {
    this.getEntities()

    this.entities.forEach((entity) => {
      entity.MovementComponent.velocity.add(entity.MovementComponent.acceleration)
      entity.PositionComponent.position.add(entity.MovementComponent.velocity)
    })
  }
}
