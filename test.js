import render from './src'
import { MAP } from './src/constant'
import { rand, isNull, getRandColor } from './src/util'

const root = {
  topic: 'hello',
  struct: MAP,
  children: [
    {
      topic: 'a',
      children: [
        { topic: 'a1' },
        { topic: 'a2', children: [{ topic: 'a2.1' }, { topic: 'a2.2' }] }
      ]
    },
    {
      topic: 'b',
      children: [
        { topic: 'b1' }, 
        { topic: 'b2' }, 
        { topic: 'b3' }
      ]
    },
    {
      topic: 'c',
      children: [{ topic: 'c1' }]
    },
  ]
}

const setColor = (data) => {
  data.color = getRandColor()
  if (data.children) { data.children.forEach(setColor) }
}

const addTopicRandly = (root) => {

  const iter = (node, depth) => {
    const child = { topic: 'ha', color: getRandColor() }

    if (node.children === undefined) { node.children = [] }
    if (isNull(node.children)) { return node.children.push(child) }

    const index = rand(0, node.children.length)
    if (depth === 0) { return node.children.splice(index, 0, child) }
    else { return iter(node.children[index], depth - 1) }
  }

  const depth = rand(0, 4)
  iter(root, depth)
}

const testEl = document.getElementById('test')
const sel = document.getElementById('sel')
const btn = document.getElementById('addBtn')
const renderTest = () => render(testEl, root)

sel.addEventListener('change', (e) => {
  const { value } = e.target
  root.struct = value
  renderTest()
})

btn.addEventListener('click', (e) => {
  addTopicRandly(root)
  renderTest()
})

// init
setColor(root)
renderTest()
