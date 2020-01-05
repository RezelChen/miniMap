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

export default (el, obj) => {
  el.innerHTML = ''   // make sure el is empty
  const g = driver(obj)
  const svg = createSvg({ width: 1000, height: 1000 })
  svg.appendChild(g)
  el.appendChild(svg)
}
