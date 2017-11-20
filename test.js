import { driver } from './src/driver'
import { MAP } from './src/constant'
import { rand, isNull } from './src/util'


const getRandColor = () => {
  const randNum = () => rand(100, 150)
  return `rgb(${randNum()}, ${randNum()}, ${randNum()})`
}

// createNode
const c = (c = []) => {
  return { children: c, color: getRandColor() }
}

const render = () => {
  const g = driver(root)
  const el = document.getElementById('test')
  el.innerHTML = ''
  const svg = SVG(el).spof().style({ display: 'block' })
  svg.add(g)
}

const addTopicRandly = () => {

  const iter = (node, depth) => {
    if (isNull(node.children)) { return node.children.push(c()) }
    const index = rand(0, node.children.length - 1)
    if (depth === 0) { return node.children.splice(index, 0, c()) }
    else {
      return iter(node.children[index], depth - 1)
    }
  }

  const depth = rand(1, 3)
  iter(root, depth)
  render()
}

let root
const init = () => {
  root = c([
    c([
      c(),
    ]),
    c([
      c(),
      c([c()]),
      c([
        c(), c(), c()
      ]),
      c(),
    ]),
    c([
      c(), c()
    ]),
    c(),
  ])
  root.struct = MAP
  render()
}

init()
const sel = document.getElementById('sel')
sel.addEventListener('change', (e) => {
  const { value } = e.target
  root.struct = value
  render()
})

const btn = document.getElementById('addBtn')
btn.addEventListener('click', (e) => {
  addTopicRandly()
})