import { driver } from './src/driver'
import { LOGIC_R, LOGIC_L, MAP } from './src/constant'


// createNode
const c = (c = []) => {
  return { children: c }
}

const root = c([
  c(),
  c([
    c([
      c(), c(), c(), c(),
    ]),
    c(),
  ]),
  c(),
  c([
    c(), c(), c(),
  ]),
])

const init = (struct = MAP) => {
  root.struct = struct
  const g = driver(root)
  const el = document.getElementById('test')
  el.innerHTML = ''
  const svg = SVG(el).spof().style({ display: 'block' })
  svg.add(g)
}

init()
const sel = document.getElementById('sel')
sel.addEventListener('change', (e) => {
  const { value } = e.target
  init(value)
})