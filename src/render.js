
var getFill = () => {
  var rand = () => parseInt(Math.random() * 255)
  return `rgb(${rand()}, ${rand()}, ${rand()})`
}

var initRender = (el) => {
  var svg = SVG(el).spof().style({ display: 'block' });
  var container = svg.group().data('name', "container");
  var connection = new SVG.G().data('name', "connection")
  container.add(connection)
  window.container = container
  window.connection = connection
}

var render = (tok) => {
  var g = new SVG.G()
  var path = new SVG.Path()
  g.add(path)
  window.container.add(g)

  tok.path = path.node
  path.node.tok = tok // for test

  var { x, y } = tok.pos
  var { width, height } = tok.size
  
  const d1 = `M ${x} ${y} l ${width} 0 l 0 ${height} l ${-width} 0 Z`
  var fill = getFill()

  path.attr({ d: d1, fill: fill })
}

var drawConn = (p1, p2) => {
  var path = new SVG.Path()
  var d = `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} Z`
  path.attr({ d, stroke: 'black' })
  return path  
}

var renderConn = (root) => {
  var _render = (p, c) => {
    var path = drawConn(p.outP, c.enterP)
    window.connection.add(path)
  }

  if (root.children) {
    root.children.forEach((child) => _render(root._tok, child._tok))
    root.children.forEach((child) => renderConn(child))
  }
}