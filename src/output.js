class Output {
  constructor({el}){
    this.element = document.querySelector(el)
  }

  init(inputHeight){
    this.element.style = `max-height: ${window.innerHeight-inputHeight}px; padding: 0.5rem; overflow-y: scroll; word-wrap: break-word; line-height: 1.5em; letter-spacing: 1px; font-family: sans-serif; padding-right: 20%;`
  }

  print(text){
    this.element.innerHTML += text+'<br>'
  }
}

export default Output