class Game {
  constructor(){
    this.rooms = []
    this.currentRoom = {}
    this.roomsById = {}
    this.roomIds = []
    this.onSubmit = null

    // !directions & shortDirections must be in the same order
    this.directions = [
      'north',
      'northeast',
      'east',
      'southeast',
      'south',
      'southwest',
      'west',
      'northwest'
    ]

    this.shortDirections = [
      'n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'
    ]
  }

  init(disk) {
    this.rooms = disk.rooms
    // normalize rooms
    this.normalize(this.rooms)
    this.currentRoom = this.roomsById[disk.initialRoom]

    window.addEventListener('keydown', function(e){
      if(e.keyCode === 13){
        let input = document.getElementById('input')
        if(input){
          input.focus()
        }
      }
    })
  }

  setRoom(room_id) {
    this.currentRoom = this.roomsById[room_id]
  }

  /*
   * Inspired by @okaybenji/text-engine
   * https://github.com/okaybenji/text-engine/blob/master/index.js
   */
  applyInput(value, callback, silence) {
    const _this = this
    const copy = value
    const splitedCopy = copy.split(' ').filter(x => x !== '');
    const loweredValue = value.toLowerCase()
    const splitedValues = loweredValue.split(' ').filter(x => x !== '');
    let command = splitedValues[0];
    const room = this.currentRoom;
    const tier = splitedValues.length
    const isDirection = this.directions.indexOf(command)
    const isShortDirection = this.shortDirections.indexOf(command)

    // movement conversion
    if(isShortDirection > -1){
      command = this.directions[isShortDirection]
    }
    console.log(command)

    // dont show user's input if silenced
    // and user doesn't want to say something
    if(!silence && command !== 'say'){ callback(`<br>> ${value}`) }

    // nested strategy pattern
    // 1st tier based on # of args in user input
    // 2nd tier based on 1st arg (command)
    const commandTier = {
      1: {
        glance() {
          const sentence = `${room.determinate} ${room.short}`
          callback(sentence)
        },
        look() {
          let exits = ''
          // TODO: ordering standard exits (LPC)
          room.exits.map((e, index) => exits+=`${e.direction}${index < room.exits.length-1 ? ', ' : ''}`)
          console.log(room.exits)
          const sentence = `${room.long} <br>Exits: ${exits}`
          callback(sentence)
        },
        say() {
          if(splitedValues.length === 1){
            callback(`<br>Say what?`)
          }else{
            splitedCopy.shift()
            const sentence = splitedCopy.join(' ')
            callback(`<br>You say: ${sentence}`)
          }
        }
      },
      2: {
        look() {
          let item = _this.currentRoom.items.find(i => i.name === splitedValues[1])
          if(item && item.name){
            callback(`${item.description}`)
          }else{
            callback(`No such thing.`)
          }
        }
      },
      3: {
        look() {
          callback(`You look ${splitedValues[2]}.`)
        }
      }
    }

    if(isDirection > -1 || isShortDirection > -1){
      this.move(command)
    }
    else if(command === 'say'){
      this.execute(commandTier[1][command])
    }
    else if(splitedValues.length > 0 && splitedValues.length < 4){
      this.execute(commandTier[tier][command], () => {
        callback(`What?`)
      })
    }
    else if(splitedValues.length > 3){
      callback(`Please enter 1-3 words only.`)
    }
    else{
      callback(`...`)
    }
  }

  execute(command, callback) {
    console.log(command)
    if(command){
      command()
    }else{
      callback()
    }
  }

  validateDirection(direction) {
    const exit = this.currentRoom.exits.find(e => e.direction === direction)
    return exit && exit.room_id ? exit.room_id : false
  }

  move(direction) {
    let room_id = this.validateDirection(direction)
    if(room_id){
      // set new room and execute 'look'
      this.setRoom(room_id)
      this.onSubmit('look', true)
    }else{
      this.onSubmit('', true)
    }
  }

  normalize(rooms) {
    for (let index = 0; index < rooms.length; index++) {
      const room = rooms[index];
      this.roomsById[room.id] = room
      this.roomIds.push(room.id)
    }
  }
}

export default Game