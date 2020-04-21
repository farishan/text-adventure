/*
# TODO
- apply material design / any design system for best reading exp
*/

import Input from './input'
import Output from './output'
import Room from './room'
import Game from './game'
import disk from './simpleville.json'

// TODO: disk factory
const loadDisk = (data) => {
  data.rooms.map(j => new Room(j))
  return data
}

const game = new Game()
const input = new Input({ el: '#input' })
const output = new Output({ el: '#output' })

window.onload = function(){ connect(input, game, output, disk) }

// TODO: connector object
function connect(input, game, output, disk){
  input.onSubmit = onSubmit
  output.init(input.element.offsetHeight)
  output.print('Hello World !')
  game.init(loadDisk(disk))
  game.onSubmit = onSubmit

  function onSubmit(value, silence){
    game.applyInput(value, function(response){
      // fake delay
      setTimeout(function(){
        print(response)
      }, 0)
    }, silence)
  }

  function print(value){
    output.print(value)
    output.element.scrollTop = output.element.scrollHeight
  }
}
