import render from '../src'
import { MAP } from '../src/constant'
import { getRandColor } from '../src/util'
import parser from './parser'

const INIT_TEXT = `Central Topic
- Main Topic 1
-- Subtopic 1.1
-- Subtopic 1.2
--- 1.2.A Topic 
--- 1.2.B Topic
- Main Topic 2
-- Subtopic 2.1
-- Subtopic 2.2
- Main Topic 3`
const TEST_DATA = {
  text: INIT_TEXT,
  struct: MAP,
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

sel.addEventListener('change', (e) => {
  const { value } = e.target
  TEST_DATA.struct = value
  renderTest()
})

textEl.addEventListener('change', (e) => {
  const { value } = e.target
  TEST_DATA.text = value
  renderTest()
})

// init
textEl.value = TEST_DATA.text
renderTest()
