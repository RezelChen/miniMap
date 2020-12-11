import { POOL_MAP } from '../../lib/pool'
import { initSVG, renderSVG, SVG_UPDATE_MAP } from '../../lib/svg'
import store from '../store'
import { posSub } from '../util'
import { ANIMATION, ANIMATION_DURATION, MIN_CONTAINER_SIZE } from './config'
import { render, flattenBranch, exposeConn, calTok, calDuringPos, calConnDuringPos } from './pass'
import { transNode } from './struct'

const LAST_TOK_POS = {}
const LAST_CONN_POS = {}
const cacheLastToks = (toks) => {
  Object.keys(LAST_TOK_POS).forEach((id) => delete LAST_TOK_POS[id])
  toks.forEach((tok) => LAST_TOK_POS[tok.id] = tok.pos)
}

const cacheLastConns = (conns) => {
  Object.keys(LAST_CONN_POS).forEach((id) => delete LAST_CONN_POS[id])
  conns.forEach((conn) => LAST_CONN_POS[conn.id] = conn.points.map((p) => p.pos))
}

const imposeToksBeginEndPos = (toks) => {
  toks.forEach((tok) => {
    const oldPos = LAST_TOK_POS[tok.id]
    if (oldPos) {
      tok.beginPos = oldPos
      tok.endPos = posSub(tok.pos, oldPos)
    } else {
      tok.beginPos = { x: 0, y: 0 }
      tok.endPos = { ...tok.pos }
    }
    tok.pos = { ...tok.beginPos }
  })
}

const imposeConnsBeginEndPos = (conns) => {
  conns.forEach((conn) => {
    const oldPoints = LAST_CONN_POS[conn.id]
    if (oldPoints) {
      conn.beginPoints = oldPoints
      conn.endPoints = conn.points.map((p, i) => posSub(p.pos, oldPoints[i]))
    } else {
      conn.beginPoints = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }]
      conn.endPoints = conn.points.map((p) => p.pos)
    }
    conn.points = conn.points.map((p, i) => { return { tok: p.tok, pos: { ...conn.beginPoints[i] } } })
  })
}

const calContainerSize = (rootSize) => {
  const width = Math.max(MIN_CONTAINER_SIZE.width, rootSize.width + 100)
  const height = Math.max(MIN_CONTAINER_SIZE.height, rootSize.height + 100)
  return { width, height }
}

const calOriginPos = (containerSize, rootSize) => {
  const x = (containerSize.width - rootSize.width) / 2
  const y = (containerSize.height - rootSize.height) / 2
  return { x, y }
}

export const driver = (rootId) => {
  const node = store.state.nodeMap[rootId]
  const tok = transNode(node)
  calTok(tok)

  // calculate information about container
  const cSize = calContainerSize(tok.size)
  const oPos = calOriginPos(cSize, tok.size)

  // expose all toks that need to be rendered
  const conns = exposeConn(tok)
  const toks = flattenBranch(tok, oPos)
  const allToks = [...conns, ...toks]

  if (ANIMATION) {
    imposeToksBeginEndPos(toks)
    imposeConnsBeginEndPos(conns)
  }

  // render element
  initSVG(undefined, cSize)
  render(allToks)
  renderSVG()

  if (ANIMATION) {
    const start = window.performance.now()
    const run = () => {
      const now = Math.min(Math.ceil(window.performance.now() - start), ANIMATION_DURATION)
      calDuringPos(toks, now, ANIMATION_DURATION)
      calConnDuringPos(conns, now, ANIMATION_DURATION)
      allToks.forEach((tok) => SVG_UPDATE_MAP[tok.type](tok))
      if (now < ANIMATION_DURATION) { window.requestAnimationFrame(run) }
      else {
        allToks.forEach((tok) => delete tok.vdom)
        Object.keys(POOL_MAP).forEach((key) => POOL_MAP[key].finish())
      }
    }
    window.requestAnimationFrame(run)
    cacheLastToks(toks)
    cacheLastConns(conns)
  }
}

export default (state) => {
  const { el, root } = state
  initSVG(el)
  driver(root)
}
