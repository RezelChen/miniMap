import {
  mountVisualDOM, render,
  createNode, createTextNode, 
  setAttribute, appendChild,
} from './vdom'

import { ANGLE_VERT, ANGLE_HORI } from '../src/constant'

const uuid = (() => {
  let count = 0
  return () => count++
})()

const CTX = {}
export const initSVG = (elm, attrs) => {
  CTX.SVG = createNode('SVG', 'svg', attrs)
  CTX.PATH_G = createNode('PATH_G', 'g')
  CTX.BOUNDARY_G = createNode('BOUNDARY_G', 'g')
  CTX.TOPIC_G = createNode('TOPIC_G', 'g')
  CTX.TEXT_G = createNode('TEXT_G', 'g')

  appendChild(CTX.SVG, CTX.PATH_G)
  appendChild(CTX.SVG, CTX.BOUNDARY_G)
  appendChild(CTX.SVG, CTX.TOPIC_G)
  appendChild(CTX.SVG, CTX.TEXT_G)

  mountVisualDOM(elm)

  return CTX.SVG
}

export const renderSVG = () => render(CTX.SVG)

const getD = (p1, p2, style) => {
  switch (style) {
    case ANGLE_VERT:
      return `M ${p1.x} ${p1.y} L ${p1.x} ${p2.y} L ${p2.x} ${p2.y}`
    case ANGLE_HORI:
      return `M ${p1.x} ${p1.y} L ${p2.x} ${p1.y} L ${p2.x} ${p2.y}`
    default:
      return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`
  }
}

export const createPath = (tok) => {
  const { p1, p2 } = tok.generate()
  const { style } = tok
  const id = uuid()
  const d = getD(p1, p2, style)

  const node = createNode(id, 'path', {
    stroke: 'black',
    fill: 'none',
    d,
  })
  appendChild(CTX.PATH_G, node)

  return node
}

export const createRect = (tok) => {
  const { pos, size, color } = tok
  const id = uuid()
  const attrs = {
    ...size,
    fill: color,
    transform: `translate(${pos.x} ${pos.y})`,
    rx: 3,
    ry: 3,
  }
  const node = createNode(id, 'rect', attrs)
  appendChild(CTX.TOPIC_G, node)
  return node
}

export const createGroup = (tok) => {
  const node = createRect(tok)
  setAttribute(node, {
    fillOpacity: '0.3',
    rx: 6, 
    ry: 6,
  })
  return node
}

export const createText = (tok) => {
  const { pos, padding } = tok
  const { content, fontSize, fontFamily } = tok.text
  const id = uuid()
  const attrs = {
    transform: `translate(${pos.x + padding[3]} ${pos.y + padding[0]})`,
    fill: '#fff',
    fontSize,
    fontFamily,
    'alignment-baseline': 'before-edge',
    // 'dominant-baseline': 'text-before-edge',
  }
  const node = createNode(id, 'text', attrs)
  const txt = createTextNode(content)
  appendChild(node, txt)
  appendChild(CTX.TEXT_G, node)
  return node
}
