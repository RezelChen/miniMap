const ns = 'http://www.w3.org/2000/svg'
const create = document.createElementNS.bind(document)

export const createRect = (tok) => {
  const { pos, size, color } = tok
  const rect = create(ns, 'rect')

  rect.setAttribute('width', size.width)
  rect.setAttribute('height', size.height)
  rect.setAttribute('fill', color)
  rect.setAttribute('transform', `translate(${pos.x} ${pos.y})`)

  rect.setAttribute('rx', 3)
  rect.setAttribute('ry', 3)
  return rect
}

export const createGroup = (tok) => {
  const rect = createRect(tok)
  rect.setAttribute('fill-opacity', '0.3')
  rect.setAttribute('rx', 6)
  rect.setAttribute('ry', 6)
  return rect
}


export const createPath = (tok) => {
  const { p1, p2 } = tok
  const d = `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} Z`

  const path = create(ns, 'path')
  path.setAttribute('d', d)
  path.setAttribute('stroke', 'black')
  return path
}

export const createText = (tok) => {
  const { pos, padding } = tok
  const { content, fontSize, fontFamily } = tok.text

  const opts = {
    transform: `translate(${pos.x + padding[3]} ${pos.y + padding[0]})`,
    fill: '#fff',
    'font-size': fontSize,
    'font-family': fontFamily,
    'alignment-baseline': 'before-edge',
    // 'dominant-baseline': 'text-before-edge',
  }

  const el = create(ns, 'text')
  const txt = document.createTextNode(content)
  el.appendChild(txt)

  Object.keys(opts).forEach((key) => el.setAttribute(key, opts[key]))
  return el
}


export const createG = (elms = []) => {
  const g = create(ns, 'g')
  elms.forEach((el) => g.appendChild(el))
  return g
}

export const createSvg = (opts = {}) => {
  const svg = create(ns, 'svg')
  Object.keys(opts).forEach((key) => svg.setAttribute(key, opts[key]))
  return svg
}

