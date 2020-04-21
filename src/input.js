class Input {
  /*
   * @param element: <input/> element
   * @param onSubmit: callback function fired when input submitted
   * @param (optional) defaultStyle: CSS code for styling input element
   */
  constructor({el, defaultStyle}){
    this.onSubmit = null // function
    this.history = []
    this.historyLimit = 50
    this.position = this.history.length

    // Check if element passed
    if(el){
      this.element = document.querySelector(el)
      this.init()
    }else{
      throw Error('No selector passed.')
    }

    if(defaultStyle){
      this.applyStyle(defaultStyle)
    }else if(defaultStyle === false){
      // need no style
    }else{
      this.applyStyle(/* default */)
    }
  }

  init(){
    this.element.focus()
    this.element.addEventListener('keydown', this.keyDownListener.bind(this))
  }

  keyDownListener(e){
    e.stopPropagation()

    const enter = 13, up = 38, down = 40;
    const validKeys = [enter, up, down]

    if(e.keyCode === enter){
      this.submit(e.target.value)

      // fire callback function to outer world
      this.onSubmit(e.target.value)
    }

    if(e.keyCode === up){
      if(this.position > 0){
        this.go(-1)
      }
    }

    if(e.keyCode === down){
      if(this.position < this.history.length){
        this.go(1)
      }
    }

    // if entered key valid, reselect input element
    if(validKeys.indexOf(e.keyCode) > -1){
      setTimeout(() => { this.element.select() }, 10)
    }
  }

  go(n){
    // clone current value
    let current = (' ' + this.element.value).slice(1);

    // change current value to last unique value
    while(current === this.element.value){
      this.position += n
      this.setValue()
    }
  }

  submit(value){
    // limiter
    if(this.history.length >= this.historyLimit){
      this.history.shift()
    }

    // add to history
    this.history.push(value)

    // remove empty string from history
    this.history = this.history.filter(Boolean)

    this.position = this.history.length
  }

  setValue(){
    let value = this.history[this.position]
    if(value){
      this.element.value = this.history[this.position]
    }else{
      this.element.value = ''
    }
  }

  applyStyle(style = 'width: 100%; padding: 0.5rem; position: fixed; bottom: 0; left: 0;'){
    this.element.style = style
  }

  getHistory(){
    return this.history
  }

  disable(value){
    if(value === true){
      this.element.setAttribute('disabled', value)
    }else{
      this.element.removeAttribute('disabled')
    }
  }
}

export default Input