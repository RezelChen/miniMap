var s1 = { width: 100, height: 30 }
var s2 = { width: 50, height: 23 }
var s3 = { width: 43, height: 23 }
var s4 = { width: 33, height: 13 }
var s5 = { width: 33, height: 53 }

var initPos = { x: 0, y: 0 }

var root = {
  structure: 'TIME_H',
  size: s1,
  // boundaries: [
  //   [0, 1],
  //   [1, 2]
  // ],
  children: [
    // { size: s2 },
    { size: s2,
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
    { size: s5,
      children: [
        { size: s4, },
        { size: s4, },
        { size: s4, },
        { size: s4, },
      ]
    },
    { size: s3,
      // structure: 'TREE_L',
      children: [
        { size: s4, },
        { size: s4, },
      ]
    },
    { size: s2,
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

// var nomalize = (root) => {

// }


var init = (val) => {
  if (val) { root.structure = val }

  // nomalize(root)
  var tok = trans(root, [])
  var size = getSize(tok)
  setOutSize(tok, size)
  setPos(tok, initPos)

  var toks = getToks(tok)
  toks.forEach((t) => reCalPos(t))

  var el = document.getElementById('test')
  el.innerHTML = ''
  initRender(el)

  toks.forEach((t) => render(t))
  renderConn(root)
  // console.log(tok, toks)
}

document.getElementById('sel').value = root.structure
// init()




var drawB = (p1, p2) => {
  console.log('~~')
  var el = document.getElementById('test')
  var svg = SVG(el).spof().style({ display: 'block' })

  var path = new SVG.Path()
  var d = 'M 100 100 C 100 50 150 50 150 100'

  // var d = `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} Z`
  path.attr({ d, stroke: 'black' })

  svg.add(path)
}

drawB()