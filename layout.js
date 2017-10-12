
var env = {
  structury: 'ORG',
  pos: { x: 0, y: 0 },
  root: {
    size: { width: 10, height: 20 },
    children: [
      { size: { width: 10, height: 23 } }, 
      { size: { width: 10, height: 23 } },
    ],
  }
}



class Tok {
  constructor (opts) {
    this.size = opts.size
    this.pos = opts.pos
    this.type = opts.type || 'tok'
    this.elts = opts.elts || null
    this.ctx = opts.ctx || null
  }
}

var s1 = { width: 10, height: 20 }
var s2 = { width: 10, height: 23 }
var s3 = { width: 13, height: 13 }

var t1 = new Tok({ size: s1 })
var t2 = new Tok({ size: s2 })
var t3 = new Tok({ size: s3 })
var t5 = new Tok({ size: s2 })

var t4 = new Tok({ elts: [t2, t3] })
var t0 = new Tok({ elts: [t1, t4] })

var applyCheck = (p, toks, ctx) => p(toks, ctx)

var seq = (...ps) => {
  return (toks, ctx) => {

    const loop = (ps, toks, nodes) => {
      if (isNull(ps)) {
        return [nodes, toks]
      } else {
        const [t, r] = applyCheck(car(ps), toks, ctx)
        if (!t) {
          return [false, false]
        } else {
          return loop(cdr(ps), r, merge(nodes, t))
        }
      }
    }

    return loop(ps, toks, [])
  }
}

var all = (p) => {
  return (toks, ctx) => {
    
    const loop = (toks, ctx) => {
      if (isNull(toks)) {
        return [toks, ctx]
      } else {
        const [r, newCtx] = p(toks, ctx)
        return loop(r, newCtx)
      }
    }

    return loop(toks, ctx)
  }
}

var initSize = { width: 0, height: 0 }

var downWR = (toks, size) => {
  const tok = car(toks)
  if (isUndef(tok.size)) { 
    var [r, tokSize] = allRight(tok.elts, initSize)
    tok.size = tokSize
  }
  return downS(toks, size)
}

var RightWD = (toks, size) => {
  console.log(size)
  const tok = car(toks)
  if (isUndef(tok.size)) {
    var [r, tokSize] = allDown(tok.elts, initSize)
    tok.size = tokSize
  }
    return rightS(toks, size)
}

var rightS = (toks, size) => {
  const tok = car(toks)
  const width = tok.size.width + size.width
  const height = Math.max(tok.size.height, size.height)

  const newSize = { width, height }
  return [cdr(toks), newSize]
}


var downS = (toks, size) => {
  const tok = car(toks)
  const width = Math.max(tok.size.width, size.width)
  const height = tok.size.height + size.height

  const newSize = { width, height }
  return [cdr(toks), newSize]
}

var allDown = all(downWR)
var allRight = all(RightWD)

var a= allRight([t0], initSize)
// var a= allDown([t4], initSize)
console.log(a[1])



// var downS = (toks) => {
//   const sizes = toks.map((tok) => isArray(tok) ? downS(tok) : tok)
//   const widthArr = sizes.map((size) => size.width)
//   const heightArr = sizes.map((size) => size.height)

//   const width = Math.max(...widthArr)
//   const height = heightArr.reduce((a, b) => a + b)

//   return { width, height }
// }


const posAdd = (p1, p2) => { return { x: p1.x + p2.x, y: p1.y + p2.y } }
const posSub = (p1, p2) => { return { x: p1.x - p2.x, y: p1.y - p2.y } }



const analyzor = (exp) => {
  switch (exp.type) {
    case DIRECTION:
      return dirAnalyzor(exp)
  }
}

const right = (toks, pos) => {
  const tok = car(toks)
  const newPos = posAdd(pos, { x: tok.size.width, y: 0 })
  tok.pos = pos
  return [cdr(toks), newPos]
}

const middle = (toks, pos) => {
  const tok = car(toks)
}

const dirAnalyzor = (exp) => {
  return (node, pos) => {

  }
}