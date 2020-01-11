import { render, flattenBranch, imposeTok, exposeConn, imposeConnection, calTok } from './pass'
import { transNode } from './struct'
import { initSVG, renderSVG } from '../../lib/svg'
import { setAttribute } from '../../lib/vdom'

export const driver = (tok) => { 
  tok = imposeTok(tok)
  tok = transNode(tok)
  tok = calTok(tok)
  const conns = exposeConn(tok)
  const toks = flattenBranch(tok)
  return render([...conns, ...toks])
}

export default (state) => {
  const { el, root } = state
  const svg = initSVG(el)
  driver(root)
  setAttribute(svg, { width: 2000, height: 2000 })
  renderSVG()
}
