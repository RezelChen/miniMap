



var t1 = new Tok({ size: s1 })
var t2 = new Tok({ size: s2 })
var t3 = new Tok({ size: s3 })
var t5 = new Tok({ size: s2 })

var t4 = new Tok({ elts: [t2, t3], type: 'right' })
var t0 = new Tok({ elts: [t1, t4], type: 'down' })




// ================================================================

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




var down = (toks, size) => {
  const tok = car(toks)
  const width = Math.max(tok.size.width, size.width)
  const height = tok.size.height + size.height

  const newSize = { width, height }
  return [cdr(toks), newSize]
}


var right = (toks, size) => {
  const tok = car(toks)
  const width = tok.size.width + size.width
  const height = Math.max(tok.size.height, size.height)

  const newSize = { width, height }
  return [cdr(toks), newSize]
}



var actionS = (p) => {
  return (tok) => {
    tok.elts.map((elt) => getSize(elt))
    var [r, size] = p(tok.elts, initSize)
    return size
  }
}


var downS = actionS(all(down))
var rightS = actionS(all(right))


// ================================================================



var sizes = tok.elts.map((elt) => getSize(elt))

// adding marginRight
var firSize = sizes[0]
var marginRight = firSize.width / 2
tok.elts.forEach((elt, i) => {
  if (i === 0) { elt.marginRight = 0 }
  else { elt.marginRight = marginRight }
})
sizes = tok.elts.map((elt) => {
  const { width, height } = sizes[i]
  return {
    width: width + elt.marginRight,
    height
  }
})

const widthArr = sizes.map((size) => size.width)
const heightArr = sizes.map((size) => size.height)

const width = Math.max(...widthArr)
const height = heightArr.reduce((a, b) => a + b)

tok.cellHeightArr = heightArr
return { width, height }


// var downLPos = (tok, newPos) => {
//   const p1 = copy(newPos)

//   tok.elts.forEach((elt, i) => {
//     const pos = copy(p1)
//     pos.x -= elt.marginRight
//     setPos(elt, pos)
//     p1.y += tok.cellHeightArr[i]
//   })
// }

// var downRPos = (tok, newPos) => {
//   const p1 = copy(newPos)

//   tok.elts.forEach((elt, i) => {
//     const pos = copy(p1)
//     pos.x += elt.marginLeft
//     setPos(elt, pos)
//     p1.y += tok.cellHeightArr[i]
//   })
// }









// var interDown = (lTok, rTok) => {

//   var totalL = 0
//   var totalR = 0
//   var restL = 0
//   var restR = 0

//   var iter = (l, r) => {
//     if (isNull(r)) { return }
//     var r1 = car(r)

//     totalR += restR
//     var dr = totalL - totalR
//     totalR = Math.max(totalL, totalR)
//     addUpPadding(r1, dr)
//     if (isNull(l)) { return }

//     var rh1 = getSize(r1).height
//     totalR += DDD
//     restR = rh1 - DDD

//     var l1 = car(l)
//     var lh1 = getSize(l1).height

//     totalL += restL
//     var dl = totalR - totalL
//     totalL = Math.max(totalR, totalL)
//     addUpPadding(l1, dl)

//     totalL += DDD
//     restL = lh1 - DDD

//     iter(cdr(l), cdr(r))
//   }

//   if (isNull(lTok.elts) || isNull(rTok.elts)) { return }
//   iter(lTok.elts, rTok.elts)

// }