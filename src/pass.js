import { posAdd, mapFlat, isDef, rand } from './util'
import { isTopic, Conn, createTokByLayer, isGroup, isPhantom } from './tok'
import { TOPIC, GROUP, BRANCH, CONN } from './constant'
import { calGroup, calBranch } from './layoutUtil'
import { createRect, createPath,  createGroup, createText, createG } from '../lib/svg'
import { STRUCT_MAP } from './config'


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
    case GROUP: {
      tok.elts.forEach(imposeConnection)
      break
    }
    case BRANCH: {
      const [topic, ...others] = tok.elts
      const outPosArr = tok.getOutPoints().map((point) => {
        return { tok: topic, pos: point }
      })
      const lineStyle = STRUCT_MAP[tok.struct].LineStyle
      others.forEach(imposeConnection)
      others.forEach((t, i) => imposeInPos(t, outPosArr[i], lineStyle))
      topic.connOUTS = tok.createOutConns()
      break
    }
  }

  return tok
}

// TODO Global the connection
const imposeInPos = (tok, outPos, style) => {
  switch (tok.type) {
    case TOPIC: {
      const inPos = { tok, pos: tok.getJoint() }
      tok.connINS.push(new Conn(outPos, inPos, style))
      break
    }
    case GROUP: {
      tok.elts.forEach((t) => imposeInPos(t, outPos, style))
      break
    }
    case BRANCH: {
      const inPos = { tok, pos: tok.getJoint() }
      const [topic, ...others] = tok.elts
      topic.connINS = []
      topic.connINS.push(new Conn(outPos, inPos, style))
      // use the inPos of branch as the outPos of topic
      imposeInPos(topic, inPos)
    }
  }
}

//  =========== imposeTok ===========

export const imposeTok = (node, i = 0) => {
  if (Array.isArray(node)) { return node.forEach((child) => imposeTok(child, i)) }

  const tok = createTokByLayer(node, i)
  node.tok = tok
  node.children && node.children.forEach((child) => imposeTok(child, i + 1))
  return node
}

// =========== flattenBranch ===========

export const flattenBranch = (tok) => {

  const iter = (tok, pos) => {
    tok.pos = posAdd(tok.pos, pos)
    tok.parent = null
    if (isTopic(tok)) { return [tok] }
    else {
      const toks = mapFlat(tok.elts, (t) => iter(t, tok.pos))
      if (isGroup(tok) && !isPhantom(tok)) { return [tok, ...toks] }
      else { return toks }
    }
  }

  const originPos = { x: 0, y: 0 }
  return iter(tok, originPos)
}

// =========== exposeConn ===========
export const exposeConn = (toks) => {
  const genConn = (c) => c.generate()
  const inToks = toks.filter((tok) => isDef(tok.connINS))
  const outToks = toks.filter((tok) => isDef(tok.connOUTS))

  const inConns = mapFlat(inToks, (t) => t.connINS.map(genConn))
  const outConns = mapFlat(outToks, (t) => t.connOUTS.map(genConn))

  return [...inConns, ...outConns, ...toks]
}

// =========== render ===========

export const render = (toks) => {

  const elms = mapFlat(toks, (tok) => {
    switch (tok.type) {
      case TOPIC:
        return [createRect(tok), createText(tok)]
      case GROUP:
        return [createGroup(tok)]
      case CONN:
        return [createPath(tok)]
      default:
        return
    }
  })

  const g = createG(elms)
  return g
}