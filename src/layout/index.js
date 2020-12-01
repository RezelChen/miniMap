import { render, flattenBranch, imposeTok, exposeConn, calTok, calDuringPos } from './pass'
import { transNode } from './struct'
import { initSVG, renderSVG, SVG_UPDATE_MAP } from '../../lib/svg'
import { ANIMATION, ANIMATION_DURATION } from './config'

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

const animateTok = (tok) => {
  const conns = exposeConn(tok)
  const toks = flattenBranch(tok)
  imposeBeginEndPos(toks)

  initSVG(undefined, { width: 10000, height: 10000 })
  const allToks = [...conns, ...toks]
  render(allToks)
  renderSVG()

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

export const driver = (tok) => {
  tok = imposeTok(tok)
  tok = transNode(tok)
  tok = calTok(tok)
  if (ANIMATION) { return animateTok(tok) }
  else {
    const conns = exposeConn(tok)
    const toks = flattenBranch(tok)
    initSVG(undefined, { width: 10000, height: 10000 })
    render([...conns, ...toks])
    renderSVG()
  }
}

export default (state) => {
  const { el, root } = state
  initSVG(el)
  driver(root)
}
