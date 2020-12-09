import { render, flattenBranch, exposeConn, calTok, calDuringPos } from './pass'
import { transNode } from './struct'
import { initSVG, renderSVG, SVG_UPDATE_MAP } from '../../lib/svg'
import { ANIMATION, ANIMATION_DURATION, MIN_CONTAINER_SIZE } from './config'
import { POOL_MAP } from '../../lib/pool'

let LAST_TOKPOS = {}
const cacheLastToks = (toks) => {
  LAST_TOKPOS = {}
  toks.forEach((tok) => LAST_TOKPOS[tok.id] = tok.pos)
}

const imposeBeginEndPos = (toks) => {
  toks.forEach((tok) => {
    const oldPos = LAST_TOKPOS[tok.id]
    if (oldPos) {
      tok.beginPos = oldPos
      tok.endPos = { x: tok.pos.x - tok.beginPos.x, y: tok.pos.y - tok.beginPos.y }
    }
    else {
      tok.beginPos = { x: 0, y: 0 }
      tok.endPos = { ...tok.pos }
    }
    tok.pos = { ...tok.beginPos }
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

export const driver = (node) => {
  const tok = transNode(node)
  calTok(tok)

  // calculate information about container
  const cSize = calContainerSize(tok.size)
  const oPos = calOriginPos(cSize, tok.size)

  // expose all toks that need to be rendered
  const conns = exposeConn(tok)
  const toks = flattenBranch(tok, oPos)
  const allToks = [...conns, ...toks]

  if (ANIMATION) { imposeBeginEndPos(toks) }

  // render element
  initSVG(undefined, cSize)
  render(allToks)
  renderSVG()

  if (ANIMATION) {
    const start = window.performance.now()
    const run = () => {
      const now = Math.min(Math.ceil(window.performance.now() - start), ANIMATION_DURATION)
      calDuringPos(toks, now, ANIMATION_DURATION)
      allToks.forEach((tok) => SVG_UPDATE_MAP[tok.type](tok))
      if (now < ANIMATION_DURATION) { window.requestAnimationFrame(run) }
      else {
        allToks.forEach((tok) => delete tok.vdom)
        Object.keys(POOL_MAP).forEach((key) => POOL_MAP[key].finish())
      }
    }
    window.requestAnimationFrame(run)
    cacheLastToks(toks)
  }
}

export default (state) => {
  const { el, root } = state
  initSVG(el)
  driver(root)
}
