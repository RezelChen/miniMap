import { render, flattenBranch, imposeTok, exposeConn, imposeConnection, calTok } from './layout/pass'
import { transNode } from './layout/struct'
import { initSVG, renderSVG } from '../lib/svg'
import { setAttribute } from '../lib/vdom'

export const driver = (tok) => { 
  tok = imposeTok(tok)
  tok = transNode(tok)
  tok = calTok(tok)
  const conns = exposeConn(tok)
  const toks = flattenBranch(tok)
  return render([...conns, ...toks])
}

export default (el, obj) => {
  const svg = initSVG(el)
  driver(obj)
  setAttribute(svg, { width: 2000, height: 2000 })
  renderSVG()
}
