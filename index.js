const typeOf = value => {
  const type = typeof value;
  switch(type) {
    case 'object':
      return value === null
        ? 'null'
        : Object.prototype.toString.call(value).match(/^\[object (.*)\]$/)[1].toLowerCase()
    case 'function':
      return 'Function';
    default:
      return type;
  }
}

export default class TypedArray extends Array {
  constructor(type, ...args) {
    super(...args)
    args.forEach(val => {
      if (typeOf(val) !== type.name.toLowerCase()) {
        throw new Error(`Unexpected type ${type.name} in TypedArray<${type.name}>`)
      }
    })
    Object.defineProperty(this, 'type', { writable: false, value: type })
    Object.defineProperty(this, 'values', { get: () => [...args] })
  }

  *[Symbol.iterator]() {
    for (const val of this.values) {
      yield val
    }
  }

  [Symbol.toPrimitive](hint) {
    if (hint === 'number') {
      this.values.reduce((xs, x) => xs + x)
    }
    return this.toString()
  }

  get [Symbol.toStringTag]() {
    return `TypedArray<${this.type.name}>`
  }

  toString() {
    return `TypedArray<${this.type.name}>${this.toString()}`
  }

  toJSON() {
    return JSON.stringify(this.values)
  }
}
