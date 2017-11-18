var s1 = { width: 100, height: 30 }
var s2 = { width: 50, height: 23 }
var s3 = { width: 43, height: 23 }
var s4 = { width: 33, height: 13 }
var s5 = { width: 33, height: 53 }

var initPos = { x: 0, y: 0 }

var roots = {
  structure: 'TIME_H',
  size: s1,
  // boundaries: [
  //   [0, 1],
  //   [1, 2]
  // ],
  children: [
    // { size: s2 },
    {
      size: s2,
      // structure: 'ORG',
      children: [
        {
          size: s4,
          children: [
            {
              size: s4,
              children: [
                {
                  size: s4,
                  children: [
                    { size: s4, },
                    { size: s4, },
                  ]
                },
              ]
            },
            { size: s4, },
          ],
        },
        { size: s4, },
        { size: s4, },
      ],
    },
    {
      size: s5,
      children: [
        { size: s4, },
        { size: s4, },
        { size: s4, },
        { size: s4, },
      ]
    },
    {
      size: s3,
      // structure: 'TREE_L',
      children: [
        { size: s4, },
        { size: s4, },
      ]
    },
    {
      size: s2,
      children: [
        { size: s4, },
        { size: s4, },
        // { size: s4, },
        // { size: s4, },
        // { size: s4, },
      ]
    },
    { size: s2 },
    // { size: s2 },
  ],
}

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

root.struct = MAP
// root.struct = LOGIC_L


const init = () => {
  const g = driver(root)
  const el = document.getElementById('test')
  el.innerHTML = ''
  const svg = SVG(el).spof().style({ display: 'block' })
  svg.add(g)
}

init()