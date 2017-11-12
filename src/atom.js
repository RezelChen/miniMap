var initSize = { width: 0, height: 0 }
var PADDING = 10


var DDD = 70  // the height of topic
var getHeadH = (tok) => getSize(tok.main).height
var getTokH = (tok) => getSize(tok).height

var interDown = (lTok, rTok) => {
  var addUpPadding = (tok, dr) => {
    console.log('dr', dr)
    if (dr < 0) { return }
    var padding = [dr, 0, 0, 0]
    addPadding(tok, padding)
  }

  var auxiliary = (toks, total) => {
    var tok = car(toks)
    var dh = totalM - total
    addUpPadding(tok, dh)

    totalM = Math.max(totalM, total)
    totalM += getHeadH(tok)
    return total += getTokH(tok)
  }

  var totalL = 0
  var totalR = 0
  var totalM = 0

  var iter = (l, r) => {
    if (isNull(r)) { return }
    totalR = auxiliary(r, totalR)
    if (isNull(l)) { return }
    totalL = auxiliary(l, totalL)
    iter(cdr(l), cdr(r))
  }

  iter(lTok.elts, rTok.elts)
}


var getHeadW = (tok) => getSize(tok.main).width
var getTokW = (tok) => getSize(tok).width




var downS = (tok) => {
  var sizes = tok.elts.map((elt) => getSize(elt))
  const widthArr = sizes.map((size) => size.width)
  const heightArr = sizes.map((size) => size.height)

  const width = Math.max(...widthArr, 0)
  const height = heightArr.reduce((a, b) => a + b, 0)

  tok.cellHeightArr = heightArr
  return { width, height }
}

var downLS = (tok) => {
  // adding paddingRight
  var firSize = getSize(tok.elts[0])
  var paddingRight = firSize.width / 2
  var padding = [0, paddingRight, 0, 0]
  tok.elts.slice(1).forEach((elt) => addPadding(elt, padding))

  return downS(tok)
}

var downRS = (tok) => {
  // adding paddingLeft
  var firSize = getSize(tok.elts[0])
  var paddingLeft = firSize.width / 2
  var padding = [0, 0, 0, paddingLeft]
  tok.elts.slice(1).forEach((elt) => addPadding(elt, padding))
  
  return downS(tok)
}

var downIS = (tok) => {
  var [sTok, cTok] = tok.elts
  var [lTok, rTok] = cTok.elts

  interDown(lTok, rTok)

  // var sSize = getSize(sTok)
  var lSize = getSize(lTok)
  var rSize = getSize(rTok)
  var dw1 = lSize.width - sTok.size.width/2 - sTok.padding[3]
  var dw2 = rSize.width - sTok.size.width/2 - sTok.padding[1]
  var padding1 = [0, Math.abs(dw2), 0, Math.abs(dw1)]
  addPadding(sTok, padding1)

  // if (dw1 > 0) { addPadding(sTok, padding1) }
  // else { addPadding(lTok, padding1) }

  // if (dw2 > 0) { addPadding(sTok, padding2) }
  // else { addPadding(rTok, padding2) }

  
  return downS(tok)
}


// var downIS = (tok) => {
//   var fir = tok.elts[0]
//   var [rToks, lToks] = _splitArr2(tok.elts.slice(1))

// }

var interRight = (uToks, dToks, guToks, gdToks, w0) => {
  var addLeftPadding = (tok, dw) => {
    // console.log('dw', dw)
    if (dw < 0) { return }
    var padding = [0, 0, 0, dw]
    addPadding(tok, padding)
  }

  var getLeftHalf = (tok) => {
    var [t, r, b, left] = tok.padding
    return tok.size.width/2 + left
  }

  var auxiliary = (toks, gToks, total) => {
    var tok = car(toks)
    var gTok = car(gToks)
    var leftW = getLeftHalf(tok)
    var dw = total - totalM

    addLeftPadding(tok, dw)
    addLeftPadding(gTok, totalM-total)
    addLeftPadding(gTok, leftW)

    // totalM = Math.max(totalM, total)
    // total = Math.max(totalM, total)
    
    totalM += getTokW(tok)
    return total += getTokW(gTok)

    // totalM += getHeadW(tok)
    // return total += getTokW(tok)
  }

  var totalU = -w0
  var totalD = -w0
  var totalM = 0

  var iter = (u, d, gu, gd) => {
    if (isNull(u)) { return }
    totalU = auxiliary(u, gu, totalU)
    if (isNull(d)) { return }
    totalD = auxiliary(d, gd, totalD)
    iter(cdr(u), cdr(d), cdr(gu), cdr(gd))
  }

  iter(uToks, dToks, guToks, gdToks)
}

var rightIS = (tok) => {
  var [guTok, mTok, gdTok] = tok.elts

  var sTok = mTok.elts[0]
  var [uToks, dToks] = _splitArr2(mTok.elts.slice(1))


  interRight(uToks, dToks, guTok.elts, gdTok.elts, getSize(sTok).width)

  // var padding1 = [0, 0, 0, -20]
  // var padding2 = [20, 0, 0, 0]
  // addPadding(uTok, padding1)
  // addPadding(dTok, padding2)
  // var h1s = uTok.elts.map((elt) => getHeadH(elt))
  // var h2s = dTok.elts.map((elt) => getHeadH(elt))
  
  return downS(tok)
  // return rightS(tok)
}

var rightS = (tok) => {
  var sizes = tok.elts.map((elt) => getSize(elt))
  const widthArr = sizes.map((size) => size.width)
  const heightArr = sizes.map((size) => size.height)

  const height = Math.max(...heightArr, 0)
  const width = widthArr.reduce((a, b) => a + b, 0)

  tok.cellWidthArr = widthArr
  return { width, height }
}


var downOut = (tok, outSize) => {
  tok.outSize = outSize
  
  const { width, height } = outSize

  // allocSize1(tok.cellHeightArr, height)

  tok.elts.forEach((cell, i) => {
    const height = tok.cellHeightArr[i]
    setOutSize(cell, { width, height })
  })

}

var downLOut = downOut
var downROut = downOut
var downIOut = downOut



var rightOut = (tok, outSize) => {
  tok.outSize = outSize

  const { width, height } = outSize

  // allocSize1(tok.cellWidthArr, width)

  tok.elts.forEach((cell, i) => {
    const width = tok.cellWidthArr[i]
    setOutSize(cell, { width, height })
  })

}


var downPos = (tok, newPos) => {
  var p1 = copy(newPos)

  tok.elts.forEach((cell, i) => {
    const pos = copy(p1)
    setPos(cell, pos)
    p1.y += tok.cellHeightArr[i]
  })
}


var downLPos = downPos
var downRPos = downPos
var downIPos = downPos


var rightPos = (tok, newPos) => {
  const p1 = copy(newPos)

  tok.elts.forEach((cell, i) => {
    const pos = copy(p1)
    setPos(cell, pos)
    p1.x += tok.cellWidthArr[i]
  })
}
