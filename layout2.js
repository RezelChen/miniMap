
var gCFn = (child) => {
  if (child.children) {
    var gToks = child.children.map((gChild) => trans(gChild, cons('LOGIC_R', [])))
    return new Tok({ elts: gToks, type: 'down' })
  } else {
    return createEmptyTok()
  }
}

var cFn = (root) => {
  var sTok = new Tok({ size: root.size })
  root._tok = sTok  // 缓存，为后面的 connection 做准备
  sTok.padding = [PADDING, PADDING, PADDING, PADDING]
  sTok.main = sTok

  return sTok
}

var trans = (root, ctx) => {
  if (root.structure) { ctx = cons(root.structure, ctx) }

  var sTok = cFn(root)
  setAlign(sTok, ctx)

  // if (!root.children) { root.children = [] }
  if (!root.children) { return sTok }
  else {
    sTok.ctx = car(ctx)
    
    switch (car(ctx)) {
      case 'ORG':
        var ctoks = root.children.map((child) => trans(child, ctx))
        var ctok = new Tok({ elts: ctoks, type: 'right' })
        return new Tok({ elts: [sTok, ctok], type: 'down' })
      case 'ORG_UP':
        var ctoks = root.children.map((child) => trans(child, ctx))
        var ctok = new Tok({ elts: ctoks, type: 'right' })
        return new Tok({ elts: [ctok, sTok], type: 'down' })
      case 'MAP':
        var [right, left] = _splitArr(root.children)
        var rToks = right.map((child) => trans(child, cons('LOGIC_R', ctx)))
        var lToks = left.map((child) => trans(child, cons('LOGIC_L', ctx)))
        var rTok = new Tok({ elts: rToks, type: 'down' })
        var lTok = new Tok({ elts: lToks, type: 'down' })
        return new Tok({ elts: [lTok, sTok, rTok], type: 'right' })
      case 'LOGIC_R':
        var ctoks = root.children.map((child) => trans(child, ctx))
        var ctok = new Tok({ elts: ctoks, type: 'down' })
        return new Tok({ elts: [sTok, ctok], type: 'right' })
      case 'LOGIC_L':
        var ctoks = root.children.map((child) => trans(child, ctx))
        var ctok = new Tok({ elts: ctoks, type: 'down' })
        return new Tok({ elts: [ctok, sTok], type: 'right' })
      case 'TREE_L':
      //   var cToks = root.children.map((child) => trans(child, ctx))
      //   return new Tok({ 
      //     elts: [sTok, ...cToks], type: 'down_l',
      //     main: sTok, align: 'right:top'
      //   })

        var cToks = root.children.map((child) => trans(child, ctx))
        var lTok = new Tok({ elts: cToks, type: 'down' })
        var rTok = new Tok({ elts: [], type: 'down' })
        var cTok = new Tok({ elts: [lTok, rTok], type: 'right' })
        return new Tok({ elts: [sTok, cTok], type: 'down_l', main: sTok, align: 'right:top' })

      case 'TREE_R':
        // var cToks = root.children.map((child) => trans(child, ctx))
        // return new Tok({
        //   elts: [sTok, ...cToks], type: 'down_r',
        //   main: sTok, align: 'left:top'
        // })

        var cToks = root.children.map((child) => trans(child, ctx))
        var lTok = new Tok({ elts: [], type: 'down' })
        var rTok = new Tok({ elts: cToks, type: 'down' })
        var cTok = new Tok({ elts: [lTok, rTok], type: 'right' })
        return new Tok({ elts: [sTok, cTok], type: 'down_r', main: sTok, align: 'left:top' })
      case 'TIME_V':
        // var [right, left] = _splitArr2(root.children)
        // var rToks = right.map((child) => trans(child, cons('TREE_R', ctx)))
        // var lToks = left.map((child) => trans(child, cons('TREE_L', ctx)))
        // var cToks = _combineArr2(rToks, lToks)
        // return new Tok({ elts: [sTok, ...cToks], type: 'down_inter' })

        var [right, left] = _splitArr2(root.children)
        var rToks = right.map((child) => trans(child, cons('TREE_R', ctx)))
        var lToks = left.map((child) => trans(child, cons('TREE_L', ctx)))
        var rTok = new Tok({ elts: rToks, type: 'down', align: 'middle:top' })
        var lTok = new Tok({ elts: lToks, type: 'down', align: 'middle:top' })
        var cTok = new Tok({ elts: [lTok, rTok], type: 'right'})
        return new Tok({ elts: [sTok, cTok], type: 'down_inter' })
      case 'TIME_H':
        var [up, down] = _splitArr2(root.children)
        var guToks = up.map(gCFn)
        var gdToks = down.map(gCFn)

        guToks.forEach((tok) => tok.align = 'left:bottom')
        gdToks.forEach((tok) => tok.align = 'left:top')
        
        var uToks = up.map(cFn)
        var dToks = down.map(cFn)
        var cToks = _combineArr2(uToks, dToks)

        var mTok = new Tok({ elts: [sTok, ...cToks], type: 'right' })
        var guTok = new Tok({ elts: guToks, type: 'right', align: 'left:bottom' })
        var gdTok = new Tok({ elts: gdToks, type: 'right', align: 'left:top' })
        
        return new Tok({ elts: [guTok, mTok, gdTok], type: 'right_inter' })

        // var uToks = up.map((child) => trans(child, cons('TREE_U', ctx)))
        // var dToks = down.map((child) => trans(child, cons('TREE_D', ctx)))


        // var uTok = new Tok({ elts: uToks, type: 'right', align: 'left:bottom' })
        // var dTok = new Tok({ elts: dToks, type: 'right', align: 'left:top' })
        // var cTok = new Tok({ elts: [uTok, dTok], type: 'down'})
        // return new Tok({ elts: [sTok, ...cToks], type: 'right_inter' })
      case 'TREE_U':
        var cToks = root.children.map((child) => trans(child, cons('LOGIC_R', ctx)))
        return new Tok({ elts: [sTok, ...cToks], type: 'up_r', align: 'left:bottom', main: sTok })
      case 'TREE_D':
        var cToks = root.children.map((child) => trans(child, cons('LOGIC_R', ctx)))
        return new Tok({ elts: [sTok, ...cToks], type: 'down_r',  align: 'left:top', main: sTok })
      case 'MATRIX':
        var cToks = root.children.map((child) => {
          var headTok = new Tok({ size: child.size })
          var cellToks = child.children.map((item) => trans(item, cons('LOGIC_R', ctx)))
          return new Tok({ elts: [headTok, ...cellToks], type: 'right' })
        })
        var cTok = new Tok({ elts: cToks, type: 'down_matrix' })
        return new Tok({ elts: [sTok, cTok], type: 'down' })
    }
  }
}


var setAlign = (sTok, ctx) => {
  switch (car(ctx)) {
    case 'ORG':
      sTok.align = 'middle:top'
      sTok.out = 'bottom'
      sTok.enter = 'top'
      return
    case 'ORG_UP':
      sTok.align = 'middle:bottom'
      sTok.out = 'top'
      sTok.enter = 'bottom'
      return
    case 'MAP':
      sTok.align = 'top:middle'
      sTok.out = 'center'
      return
    case 'LOGIC_R':
      sTok.align = 'left:middle'
      sTok.out = 'right'
      sTok.enter = 'left'
      return
    case 'LOGIC_L':
      sTok.align = 'right:middle'
      sTok.out = 'left'
      sTok.enter = 'right'
      return
    case 'TREE_L':
      sTok.align = 'right:top'
      sTok.out = 'bottom'
      sTok.enter = 'right'
      return
    case 'TREE_R':
      sTok.align = 'left:top'
      sTok.out = 'bottom'
      sTok.enter = 'left'
      return
    case 'TIME_V':
      sTok.align = 'middle:top'
      sTok.out = 'bottom'
      sTok.enter = 'top'
      return
    case 'TIME_H':
      sTok.align = 'middle:middle'
      sTok.out = 'right'
      sTok.enter = 'left'
      return
    case 'TREE_U':
      sTok.align = 'left:bottom'
      sTok.out = 'top'
      sTok.enter = 'left'
      return
    case 'TREE_D':
      sTok.align = 'left:top'
      sTok._test = true
      sTok.out = 'bottom'
      sTok.enter = 'left'
      return
    default:
      sTok.out = 'bottom'
      sTok.enter = 'top'
  }
}


var getSize = (tok) => {
  if (isUndef(tok.size)) {
    var size
    switch (tok.type) {
      case 'right':
        size = rightS(tok)
        break
      case 'down':
        size = downS(tok)
        break
      case 'down_l':
        size = downLS(tok)
        break
      case 'down_r':
        size = downRS(tok)
        break
      case 'down_inter':
        size = downIS(tok)
        break
      case 'right_inter':
        size = rightIS(tok)
        break
      case 'matrix':
        // size = matrixS(tok)
        break
    }
    tok.size = size
  }

  return paddingSize(tok)
}


var fillWithPadding = (tok, outSize) => {
  var getDW = (align, dw) => {
    if (align === 'left' || align === 'top') {
      return [0, dw]
    } else if (align === 'right' || align === 'bottom') {
      return [dw, 0]
    } else {
      return [dw/2, dw/2]
    }
  }

  var { width, height } = getSize(tok)
  var dw = outSize.width - width
  var dh = outSize.height - height

  // console.log(dw, dh)

  const [h, v] = tok.align.split(':')
  var [left, right] = getDW(h, dw)
  var [top, bottom] =getDW(v, dh)

  var padding = [top, right, bottom, left]

  addPadding(tok, padding)
}

var setOutSize = (tok, outSize) => {
  // tok.innerSize = sizeSubPadding(outSize, tok.padding)
  fillWithPadding(tok, outSize)
  outSize = tok.size
  
  switch (tok.type) {
    case 'tok':
      // getSize(tok)
      // tok.outSize = outSize
      return
    case 'right':
      rightOut(tok, outSize)
      return
    case 'down':
    case 'right_inter':
      downOut(tok, outSize)
      return
    case 'down_l':
      downLOut(tok, outSize)
      return
    case 'down_r':
      downROut(tok, outSize)
      return
    case 'down_inter':
      downIOut(tok, outSize)
      return
    case 'matrix':
      matrixOut(tok, outSize)
      return
  }
}


var setPos = (tok, pos) => {
  if (tok._test) {
    console.log('~~~', tok)
  }
  pos = paddingPos(pos, tok.padding)
  tok.pos = pos

  switch (tok.type) {
    case 'right':
      rightPos(tok, pos)
      return
    case 'down':
    case 'right_inter':
      downPos(tok, pos)
      return
    case 'down_l':
      downLPos(tok, pos)
      return
    case 'down_r':
      downRPos(tok, pos)
      return
    case 'down_inter':
      downIPos(tok, pos)
      return
    case 'matrix':
      // matrixPos(tok, pos)
      return
    
  }
}


var reCalPos = (tok) => {
  // var cal = (x, dw, align) => {
  //   if (align === 'left' || align === 'top') {
  //     return x
  //   } else if (align === 'right' || align === 'bottom') {
  //     return x + dw
  //   } else {
  //     return x + dw / 2
  //   }
  // }

  var calCon = (pos, size, conn) => {
    if (conn === 'left') {
      return posAdd(pos, { x: 0, y: size.height/2 })
    }
    if (conn === 'right') {
      return posAdd(pos, { x: size.width, y: size.height / 2 })
    }
    if (conn === 'center') {
      return posAdd(pos, { x: size.width/2, y: size.height / 2 })
    }
    if (conn === 'top') {
      return posAdd(pos, { x: size.width / 2, y: 0 })
    }
    if (conn === 'bottom') {
      return posAdd(pos, { x: size.width / 2, y: size.height })
    }
  }

  // var paddingOutSize = (tok) => {
  //   var [top, right, bottom, left] = tok.padding
  //   var { width, height } = tok.outSize
  //   return {
  //     width: width - left - right,
  //     height: height - top - bottom,
  //   }
  // }
  
  // var { width, height } = paddingOutSize(tok)
  var { width, height } = tok.size
  var { x, y } = tok.pos
  // var dw = width - tok.size.width
  // var dh = height - tok.size.height
  // var newX = tok.pos.x + tok.padding

  // const [h, v] = tok.align.split(':')
  // var newX = cal(x, dw, h)
  // var newY = cal(y, dh, v)
  // tok.pos = { x: newX, y: newY }

  
  if (tok.out) { tok.outP = calCon(tok.pos, tok.size, tok.out) }
  if (tok.enter) { tok.enterP = calCon(tok.pos, tok.size, tok.enter) }
  
  return
}