import { render, flattenBranch, exposeConn, calTok, calDuringPos } from './pass'
import { transNode } from './struct'
import { initSVG, renderSVG, SVG_UPDATE_MAP } from '../../lib/svg'
import { ANIMATION, ANIMATION_DURATION, MIN_CONTAINER_SIZE } from './config'

let LAST_TOKS = {}
const cacheLastToks = (toks) => {
  LAST_TOKS = {}
  toks.forEach((tok) => LAST_TOKS[tok.id] = tok)
}

const imposeBeginEndPos = (toks) => {
  toks.forEach((tok) => {
    const oldTok = LAST_TOKS[tok.id]
    if (oldTok) {
      tok.beginPos = { ...oldTok.pos }
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

  // render element
  initSVG(undefined, cSize)
  render(allToks)
  renderSVG()

  if (ANIMATION) {
    imposeBeginEndPos(toks)
    let start = 0
    const run = () => {
      start++
      calDuringPos(toks, start, ANIMATION_DURATION)
      allToks.forEach((tok) => SVG_UPDATE_MAP[tok.type](tok))
      if (start < ANIMATION_DURATION) { window.requestAnimationFrame(run) }
      else { allToks.forEach((tok) => delete tok.vdom) }
    }
    run()
    cacheLastToks(toks)
  }
}

export default (state) => {
  const { el, root } = state
  initSVG(el)
  driver(root)
}
