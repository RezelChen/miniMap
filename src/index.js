import { render, flattenBranch, imposeTok, exposeConn, imposeConnection, calTok } from './pass'
import { transNode } from './struct'
import { createSvg } from '../lib/svg'

const run = (tok, passes) => {
  return passes.reduce((t, pass) => pass(t), tok)
}

export const driver = (tok) => {
  return run(tok, [
    imposeTok,
    transNode,
    calTok,
    imposeConnection,
    flattenBranch,
    exposeConn,
    render,
  ])
}

const CANTAINER = {
  width: 690,
  height: 590,
}
export default (el, obj) => {
  el.innerHTML = ''   // make sure el is empty
  const g = driver(obj)
  const svg = createSvg()
  svg.appendChild(g)
  el.appendChild(svg)

  const { width, height } = g.getBBox()
  const maxWidth = Math.max(CANTAINER.width, width)
  const maxHeight = Math.max(CANTAINER.height, height)
  const dx = (maxWidth - width) / 2
  const dy = (maxHeight - height) / 2

  g.setAttribute('transform', `translate(${dx} ${dy})`)
  svg.setAttribute('width', maxWidth)
  svg.setAttribute('height', maxHeight)
}
