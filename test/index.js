import render from '../src'
import { getRandColor } from '../src/util'
import parser from './parser'
import * as CONS from '../src/constant'

const STRUCTS = [
  { name: 'MAP', value: CONS.MAP },
  { name: 'LOGIC RIGHT', value: CONS.LOGIC_R },
  { name: 'LOGIC LEFT', value: CONS.LOGIC_L },
  { name: 'ORG', value: CONS.ORG },
  { name: 'ORG UP', value: CONS.ORG_UP },
  { name: 'TREE RIGHT', value: CONS.TREE_R },
  { name: 'TREE LEFT', value: CONS.TREE_L },
  { name: 'TIME VERTICAL', value: CONS.TIME_V },
  { name: 'TIME HORIZON', value: CONS.TIME_H },
  { name: 'FISH RIGHT', value: CONS.FISH_RIGHT },
  { name: 'FISH LEFT', value: CONS.FISH_LEFT },
]

const INIT_TEXT = `
Central Topic
- Main Topic 1
-- Subtopic 1.1
-- Subtopic 1.2
--- 1.2.A Topic 
--- 1.2.B Topic
- Main Topic 2
-- Subtopic 2.1
-- Subtopic 2.2
- Main Topic 3
- Main Topic 4
- Main Topic 5
-- Subtopic 5.1
-- Subtopic 5.2
`.trim()
const TEST_DATA = {
  text: INIT_TEXT,
  struct: STRUCTS[0].value,
}

const setColor = (() => {
  const colors = []
  return (data) => {
    const i = data.depth || 0
    if (colors[i] === undefined) { colors[i] = getRandColor() }
    data.color = colors[i]
    if (data.children) { data.children.forEach(setColor) }
  }
})()

const testEl = document.getElementById('test')
const sel = document.getElementById('sel')
const textEl = document.getElementById('text-area')

const renderTest = () => {
  const root = parser(TEST_DATA.text)
  root.struct = TEST_DATA.struct
  setColor(root)
  const { children } = root
  if (children.length >= 3) {
    root.children = [children[0], children.slice(1, 3), ...children.slice(3)]
  }

  render(testEl, root)
}

sel.onchange = (e) => {
  const { value } = e.target
  TEST_DATA.struct = value
  renderTest()
  sel.value = value
}

textEl.addEventListener('change', (e) => {
  const { value } = e.target
  TEST_DATA.text = value
  renderTest()
})

const getCurrentIndex = () => {
  for (let i = 0; i < STRUCTS.length; i++) {
    if (TEST_DATA.struct === STRUCTS[i].value) {
      return i
    }
  }
}

document.addEventListener('keydown', (e) => {
  if (e.target !== document.body) { return }
  const index = getCurrentIndex()
  // up
  if (e.keyCode === 38) {
    if (index === 0) { return }
    const newStruct = STRUCTS[index-1].value
    sel.onchange({ target: { value: newStruct } })
    event.preventDefault()
  }

  if (e.keyCode === 40) {
    if (index === STRUCTS.length - 1) { return }
    const newStruct = STRUCTS[index+1].value
    sel.onchange({ target: { value: newStruct } })
    event.preventDefault()
  }
})

// init
STRUCTS.forEach((s) => {
  const opt = document.createElement('option')
  opt.innerHTML = s.name
  opt.value = s.value
  sel.appendChild(opt)
})
textEl.value = TEST_DATA.text
renderTest()
