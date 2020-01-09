const ns = 'http://www.w3.org/2000/svg'
const createElement = (type) => document.createElementNS(ns, type)
const createTextElement = document.createTextNode.bind(document)
const getKebabCase = (str) => str.replace(/[A-Z]/g, (i) => '-' + i.toLowerCase())

const diff = (newObj, oldObj) => {
  const created = []
  const updated = []
  const deleted = []

  for (const key in newObj) {
    const newValue = newObj[key]
    const oldValue = oldObj[key]
    if (oldValue === undefined) { created.push(key) }
    else if (newValue !== oldValue) { updated.push(key) }
  }

  for (const key in oldObj) {
    const newValue = newObj[key]
    if (newValue === undefined) { deleted.push(key) }
  }

  return [created, updated, deleted]
}

const removeNode = (node) => {
  for (const id in node.children) { removeNode(node.children[id]) }
  node.tok.remove()
  delete node.children
  delete node.attributes
  delete node.tok
}

const renderNode = (node) => {
  if (node.type === 'txt') {
    node.tok = createTextElement(node.id)
  } else {
    const tok = createElement(node.type)

    for (const key in node.attributes) {
      tok.setAttribute(getKebabCase(key), node.attributes[key])
    }

    for (const cid in node.children) {
      const child = node.children[cid]
      renderNode(child)
      tok.appendChild(child.tok)
    }

    node.tok = tok
  }
}

const compareNode = (node, oldNode) => {
  const tok = oldNode.tok

  const [createdKey, updatedKey, deletedKey] = diff(node.attributes, oldNode.attributes)
  createdKey.forEach((key) => tok.setAttribute(getKebabCase(key), node.attributes[key]))
  updatedKey.forEach((key) => tok.setAttribute(getKebabCase(key), node.attributes[key]))
  deletedKey.forEach((key) => tok.removeAttribute(getKebabCase(key)))

  // TODO Not only the id, but the type of child should be taken into account
  const [createdId, updatedId, deletedId] = diff(node.children, oldNode.children)

  createdId.forEach((id) => {
    const child = node.children[id]
    renderNode(child)
    tok.appendChild(child.tok)
  })
  updatedId.forEach((id) => compareNode(node.children[id], oldNode.children[id]))
  deletedId.forEach((id) => removeNode(oldNode.children[id]))

  delete oldNode.tok
  node.tok = tok
}

const diffNode = (node, oldNode) => {
  if (!oldNode) { renderNode(node) }
  else { compareNode(node, oldNode) }
}

export const createNode = (id, type, attributes = {}) => {
  return { id, type, attributes, children: {} }
}

export const createTextNode = (txt) => {
  return { id: txt, type: 'txt', attributes: {}, children: {} }
}

export const setAttribute = (node, attrs = {}) => Object.assign(node.attributes, attrs)
export const appendChild = (node, child) => node.children[child.id] = child

let OLD_VDOM = null
let BODY = null
let MOUNTED = false

export const mountVisualDOM = (elm) => {
  if (!elm) { return }

  const needMount = !MOUNTED || BODY !== elm
  if (OLD_VDOM) {
    elm.appendChild(OLD_VDOM.tok)
    MOUNTED = true
  }
  BODY = elm
}

export const render = (node) => {
  diffNode(node, OLD_VDOM)
  // save node as OLD VDOM for next render to diff
  OLD_VDOM = node
  mountVisualDOM(BODY)
}
