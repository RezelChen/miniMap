import { posAdd, mapFlat, posSub } from '../util'
import { isTopic, Conn, createTok, isGroup, isPhantom } from './tok'
import { TOPIC, GROUP, BRANCH, CONN } from '../constant'
import { calGroup, calBranch, getTopicJoint } from './layoutUtil'
import { createTopic, createPath, createBoundary } from '../../lib/svg'
import Tween from '../../lib/tween'
import { STRUCT_MAP, CONN_GAP } from './config'

const TIMING_FUNCTION = Tween.Quad.easeInOut
export const calDuringPos = (toks, start, during) => {
  toks.forEach((tok) => {
    tok.pos.x = TIMING_FUNCTION(start, tok.beginPos.x, tok.endPos.x, during)
    tok.pos.y = TIMING_FUNCTION(start, tok.beginPos.y, tok.endPos.y, during)
  })
}

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

// =========== exposeConn ===========

export const exposeConn = (tok) => {
  const conns = []

  const getInPosArr = (tok) => {
    switch (tok.type) {
      case TOPIC:
        return [{ tok, pos: tok.getJoint() }]
      case GROUP:
        return mapFlat(tok.elts, getInPosArr)
      case BRANCH:
        const topic = tok.getTopic()
        const pos1 = { tok: topic, pos: posSub(tok.getJoint(), topic.pos) }
        const pos2 = { tok: topic, pos: topic.getJoint() }
        // the path from branch's joint connect to topic
        conns.push(new Conn(pos1, pos2))
        return [pos1]
    }
  }

  const iter = (tok) => {
    switch (tok.type) {
      case TOPIC:
        break
      case GROUP: {
        tok.elts.forEach(iter)
        break
      }
      case BRANCH: {
        const { OUTS, LineStyle } = STRUCT_MAP[tok.struct]
        const [topic, ...others] = tok.elts
        others.forEach(iter)
        others.forEach((t, i) => {
          const dir = OUTS[i]
          const topicOutPos = { tok: topic, pos: getTopicJoint(topic, dir) }
          const branchOutPos = { tok: topic, pos: getTopicJoint(topic, dir, CONN_GAP) }
          const inPosArr = getInPosArr(t)
          // create lines
          conns.push(new Conn(topicOutPos, branchOutPos, { dir }))
          inPosArr.forEach((inPos) => {
            conns.push(new Conn(branchOutPos, inPos, { dir, style: LineStyle }))
          })
        })
      }
      default:
        // TODO log error
    }
  }

  iter(tok)
  return conns
}

//  =========== imposeTok ===========

export const imposeTok = (node, i = 0) => {
  if (node.type == TOPIC) { node.tok = createTok(node) }
  node.children && node.children.forEach((child) => imposeTok(child))
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

// =========== render ===========

export const render = (toks) => {
  toks.forEach((tok) => {
    switch (tok.type) {
      case TOPIC:
        return tok.vdom = createTopic(tok)
      case GROUP:
        return tok.vdom = createBoundary(tok)
      case CONN:
        return tok.vdom = createPath(tok)
      default:
        return
    }
  })
}
