import { posAdd, mapFlat, isDef, rand } from './util'
import { isTopic, Conn, createTokByLayer } from './tok'
import { TOPIC, GROUP, BRANCH, CONN } from './constant'
import { calGroup, calBranch } from './layoutUtil'


//  =========== calTok ===========

export const calTok = (tok) => {
  switch (tok.type) {
    case TOPIC:
      return tok
    case GROUP:
      tok.elts.forEach(calTok)
      calGroup(tok)
      return tok
    case BRANCH:
      tok.elts.forEach(calTok)
      calBranch(tok)
      return tok
    default:
      logErr('Unexpect tok.type', calTok, tok)
  }
}

//  =========== imposeConnection ===========

export const imposeConnection = (tok) => {
  switch (tok.type) {
    case TOPIC:
      break
    case GROUP:
      tok.elts.forEach(imposeConnection)
      break
    case BRANCH:
      const [topic, ...others] = tok.elts
      const outPosArr = tok.getOutPoints().map((point) => {
        return { tok: topic, pos: point }
      })
      others.forEach(imposeConnection)
      others.forEach((t, i) => imposeInPos(t, outPosArr[i]))
      topic.connOUTS = tok.createOutConns()
      break
  }

  return tok
}

const imposeInPos = (tok, outPos) => {
  switch (tok.type) {
    case TOPIC:
      const inPos = { tok, pos: tok.getJoint() }
      tok.conn = new Conn(outPos, inPos)
      break
    case GROUP:
      tok.elts.forEach((t) => imposeInPos(t, outPos))
      break
    case BRANCH:
      const [topic, ...others] = tok.elts
      imposeInPos(topic, outPos)
  }
}

//  =========== imposeTok ===========

export const imposeTok = (node, i = 0) => {
  const tok = createTokByLayer(i)
  node.tok = tok
  node.children.forEach((child) => imposeTok(child, i + 1))
  return node
}

// =========== flattenBranch ===========

export const flattenBranch = (tok) => {

  const iter = (tok, pos) => {
    tok.pos = posAdd(tok.pos, pos)
    tok.parent = null
    if (isTopic(tok)) { return [tok] }
    else { return mapFlat(tok.elts, (t) => iter(t, tok.pos)) }
  }

  const originPos = { x: 0, y: 0 }
  return iter(tok, originPos)
}

// =========== exposeConn ===========
export const exposeConn = (toks) => {
  const conns = toks.filter((tok) => isDef(tok.conn)).map((t) => {
    return t.conn.generate()
    // const { outPos, inPos } = t.conn
    // return {
    //   p1: posAdd(outPos.tok.pos, outPos.pos),
    //   p2: posAdd(inPos.tok.pos, inPos.pos),
    //   type: 'path',
    // }
  })

  const Oconns = mapFlat(toks.filter((tok) => isDef(tok.connOUTS)), (t) => {
    return t.connOUTS.map((c) => {
      return c.generate()
      // return {
      //   p1: posAdd(t.pos, c.p1),
      //   p2: posAdd(t.pos, c.p2),
      //   type: 'path',
      // }
    })
  })

  return [...conns, ...Oconns, ...toks]
}

// =========== render ===========

const getRandColor = () => {
  const randNum = () => rand(100, 155)
  return `rgb(${randNum()}, ${randNum()}, ${randNum()})`
}

const createRect = (tok) => {
  const { x, y } = tok.pos
  const { width, height } = tok.size
  const fill = getRandColor()

  const rect = new SVG.Rect().attr({ width, height, fill })
  rect.translate(x, y).radius(3)
  return rect
}

const createPath = (tok) => {
  const { p1, p2 } = tok
  const d = `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} Z`

  const path = new SVG.Path()
  path.attr({ d, stroke: 'black' })
  return path
}

export const render = (toks) => {

  const Snodes = toks.map((tok) => {
    switch (tok.type) {
      case TOPIC:
        return createRect(tok)
      case CONN:
        return createPath(tok)
      default:
        return
    }
  }).filter(isDef)

  const g = new SVG.G().data('name', "container")
  Snodes.forEach((node) => g.add(node))
  return g
}