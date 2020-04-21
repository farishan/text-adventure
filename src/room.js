class Room {
  constructor({
    id = null,
    name = 'room',
    type = null,
    determinate = 'a',
    short = 'This is a room.',
    long = 'This is a room.',
    light = 100,
    exits = [],
    items = [],
    npcs = [],
  }){
    this.id = id
    this.name = name
    this.type = type
    this.determinate = determinate
    this.short = short
    this.long = long
    this.light = light
    this.items = items
    this.exits = exits
    this.npcs = npcs
  }

  addExit(exit) {
    this.exits.push(exit)
  }
}

export default Room