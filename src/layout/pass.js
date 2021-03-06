import { posAdd, mapFlat, posSub } from '../util'
import { isTopic, isGroup, isPhantom } from './tok'
import { TOPIC, GROUP, BRANCH, CONN } from '../constant'
import { calGroup, calBranch, getTopicJoint } from './layoutUtil'
import { createTopic, createPath, createBoundary } from '../../lib/svg'
import Tween from '../../lib/tween'
import { STRUCT_MAP, CONN_GAP } from './config'
import { POOL_MAP } from '../../lib/pool'

const ConnPool = POOL_MAP['Conn']

const TIMING_FUNCTION = Tween.Quad.easeInOut
export const calDuringPos = (toks, start, during) => {
  if (start == during) {
    toks.forEach((tok) => {
      tok.pos.x = tok.beginPos.x + tok.endPos.x
      tok.pos.y = tok.beginPos.y + tok.endPos.y
    })
  } else {
    toks.forEach((tok) => {
      tok.pos.x = TIMING_FUNCTION(start, tok.beginPos.x, tok.endPos.x, during)
      tok.pos.y = TIMING_FUNCTION(start, tok.beginPos.y, tok.endPos.y, during)
    })
  }
}

export const calConnDuringPos = (conns, start, during) => {
  if (start == during) {
    conns.forEach((conn) => {
      conn.points.forEach((point, i) => {
        const begin = conn.beginPoints[i]
        const end = conn.endPoints[i]
        point.pos.x = begin.x + end.x
        point.pos.y = begin.y + end.y
      })
    })
  } else {
    conns.forEach((conn) => {
      conn.points.forEach((point, i) => {
        const begin = conn.beginPoints[i]
        const end = conn.endPoints[i]
        point.pos.x = TIMING_FUNCTION(start, begin.x, end.x, during)
        point.pos.y = TIMING_FUNCTION(start, begin.y, end.y, during)
      })
    })
  }
}

//  =========== calTok ===========

export const calTok = (tok) => {
  switch (tok.type) {
    case TOPIC: return
    case GROUP:
      tok.elts.forEach(calTok)
      calGroup(tok)
      return
    case BRANCH:
      tok.elts.forEach(calTok)
      calBranch(tok)
      return
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
        return [[pos1, pos2]]
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
          inPosArr.forEach(([pos1, pos2]) => {
            const id = `${topicOutPos.tok.id}-${pos2.tok.id}`
            const points = [topicOutPos, branchOutPos, pos1, pos2]
            const conn = ConnPool.create(id, points, LineStyle)
            conns.push(conn)
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

// =========== flattenBranch ===========

export const flattenBranch = (tok, originPos = { x: 0, y: 0 }) => {

  const iter = (tok, pos) => {
    tok.pos = posAdd(tok.pos, pos)
    if (isTopic(tok)) { return [tok] }
    else {
      const toks = mapFlat(tok.elts, (t) => iter(t, tok.pos))
      if (isGroup(tok) && !isPhantom(tok)) { return [tok, ...toks] }
      else { return toks }
    }
  }

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
