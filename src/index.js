import { render, flattenBranch, imposeTok, exposeConn, imposeConnection, calTok } from './pass'
import { transNode } from './struct'
import { createSvg } from '../lib/svg'

export const driver = (tok) => { 
  tok = imposeTok(tok)
  tok = transNode(tok)
  tok = calTok(tok)
  const conns = exposeConn(tok)
  const toks = flattenBranch(tok)
  return render([...conns, ...toks])
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
