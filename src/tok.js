class Tok {
  constructor (opts) {
    this.size = opts.size
    this.pos = opts.pos
    this.type = opts.type || 'tok'
    this.elts = opts.elts || []
    this.ctx = opts.ctx || null
    this.align = opts.align || 'middle,middle'
    this.main = opts.main
    this._test = opts._test 
    this.padding = [0, 0, 0, 0]
    this.margin = [0, 0, 0, 0]
    this.enter = 'center'
    this.out = 'center'
  }
}


var createEmptyTok = () => {
  return new Tok({ size: { width: 0, height: 0 }, })
}