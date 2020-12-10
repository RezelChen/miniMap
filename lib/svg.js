import { uuidCreator } from '../src/util'
import {
  mountVisualDOM, render,
  createNode, createTextNode,
  setAttributeImmediately, appendChild,
} from './vdom'

import { TOPIC, GROUP, CONN, BOUNDARY } from '../src/constant'

const uuid = uuidCreator('p-')

const TEXT_ID = 'TEXT_ID'
const TOPIC_RECT_ID = 'TOPIC_RECT_ID'
const FOREIGN_ID = 'FOREIGN_ID'
const CTX = {}

export const initSVG = (elm, attrs) => {
  CTX.SVG = createNode('SVG', 'svg', attrs)
  CTX.PATH_G = createNode('PATH_G', 'g')
  CTX.BOUNDARY_G = createNode('BOUNDARY_G', 'g')
  CTX.TOPIC_G = createNode('TOPIC_G', 'g')

  appendChild(CTX.SVG, CTX.PATH_G)
  appendChild(CTX.SVG, CTX.BOUNDARY_G)
  appendChild(CTX.SVG, CTX.TOPIC_G)

  uuid.init()   // init uuid to make sure it always create the same id for path
  mountVisualDOM(elm)

  return CTX.SVG
}

export const renderSVG = () => render(CTX.SVG)

const getD = ([p1, p2, p3, p4], style) => {
  return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} L ${p4.x} ${p4.y}`
}

export const createPath = (tok) => {
  const d = getD(tok.getPoints(), tok.style)

  // use pseudorandom uuid to create id so the vdom can reuse old element for path
  const node = createNode(uuid(), 'path', {
    stroke: 'black',
    fill: 'none',
    d,
  })
  appendChild(CTX.PATH_G, node)
  return node
}

export const createText = (text, pos, size) => {
  const { content, fontSize, fontFamily } = text
  const attrs = {
    transform: `translate(${pos.x} ${size.height/2})`,
    fill: '#fff',
    fontSize,
    fontFamily,
    'alignment-baseline': 'central',
    // 'alignment-baseline': 'before-edge',
    // 'dominant-baseline': 'text-before-edge',
  }
  // fix text id, so it won't create unnecessary textElement
  const node = createNode(TEXT_ID, 'text', attrs)
  const txt = createTextNode(content)
  appendChild(node, txt)
  return node
}

export const createText1 = (text, pos, size) => {
  const { content, fontSize, fontFamily } = text

  const style = `
    transform: translate(${pos.x}px, 0);
    color: #fff;
    font-size: ${fontSize}px;
    font-family: ${fontFamily};
    line-height:${size.height}px;
  `
  const foreignObject = createNode(FOREIGN_ID, 'foreignObject', size)
  const node = createNode(TEXT_ID, 'p', { style, contenteditable: 'true' })
  const txt = createTextNode(content)
  appendChild(foreignObject, node)
  appendChild(node, txt)
  return foreignObject
}

export const createTopic = (tok) => {
  const { id, pos, size, color, padding } = tok
  const node = createNode(id, 'g', { transform: `translate(${pos.x} ${pos.y})` }, { type: TOPIC })
  const rect = createNode(TOPIC_RECT_ID, 'rect', {
    ...size,
    fill: color,
    rx: 3,
    ry: 3,
  })
  const text = createText(tok.text, { x: padding[3], y: padding[0] }, size)
  appendChild(node, rect)
  appendChild(node, text)
  appendChild(CTX.TOPIC_G, node)
  return node
}

export const createBoundary = (tok) => {
  const { id, pos, size, color } = tok
  const attrs = {
    ...size,
    fill: color,
    transform: `translate(${pos.x} ${pos.y})`,
    fillOpacity: '0.3',
    rx: 6,
    ry: 6,
  }
  const node = createNode(id, 'rect', attrs, { type: BOUNDARY })
  appendChild(CTX.BOUNDARY_G, node)
  return node
}


export const SVG_UPDATE_MAP = {
  [TOPIC]: (tok) => {
    const { pos } = tok
    const attrs = { transform: `translate(${pos.x} ${pos.y})` }
    setAttributeImmediately(tok.vdom, attrs)
  },
  [GROUP]: (tok) => {
    const { pos } = tok
    const attrs = { transform: `translate(${pos.x} ${pos.y})` }
    setAttributeImmediately(tok.vdom, attrs)
  },
  [CONN]: (tok) => {
    const d = getD(tok.getPoints(), tok.style)
    setAttributeImmediately(tok.vdom, { d })
  },
}
