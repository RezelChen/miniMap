const TOPIC_REG = /^(-+)\s*(.*)$/
const getTopic = (line) => {
  const match = TOPIC_REG.exec(line)
  if (match === null) { return null }
  else {
    const topic = match[2]
    const depth = match[1].length
    return { topic, children: [], depth }
  }
}

export default (str) => {
  const lines = str.split('\n').map((l) => l.trim()).filter((l) => l !== '')
  const root = { topic: lines[0], children: [], depth: 0 }
  const exps = lines.slice(1).map(getTopic).filter((exp) => exp)

  const iter = (i, ctx) => {
    while (true) {
      if (i === exps.length) { return i }
      const exp = exps[i]
      if (exp.depth <= ctx.depth) { return i }
      else {
        ctx.children.push(exp)
        i = iter(i + 1, exp)
      }
    }
  }

  iter(0, root)
  return root
}
