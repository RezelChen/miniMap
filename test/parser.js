import { isEmpty } from "../src/util"

let COUNT = 0
const uuid = () => ++COUNT
const isOdd = (n) => n & 1

const BOUNDARY_REG = /\[([\s\S]*?)\]/g
const TOPIC_REG = /^(-+)\s*(.*)$/

const getBoundary = (content) => {
  const arr = []
  let index = 0
  while (true) {
    const match = BOUNDARY_REG.exec(content)
    if (match == null) { arr.push(content.slice(index)); break }  // not boundary part
    arr.push(content.slice(index, match.index))   // not boundary part
    arr.push(match[1])                            // boundary part
    index = match.index + match[0].length
  }

  return arr
}

const getTopic = (line) => {
  if (Array.isArray(line)) { return line.map(getTopic).filter((exp) => exp) }

  const match = TOPIC_REG.exec(line)
  if (match === null) { return null }
  else {
    const title = match[2]
    const depth = match[1].length
    return { id: uuid(), text: { content: title }, children: [], depth }
  }
}

const isTopic = (topic) => topic.depth && topic.children
const isBoundary = Array.isArray

export default (str) => {
  const blocks = getBoundary(str)
  let lines = []
  blocks.forEach((block, i) => {
    const isBoundary = isOdd(i)
    const arr = block.split('\n').map((l) => l.trim()).filter((l) => l !== '')
    if (isBoundary) { lines.push(arr) }
    else { lines = lines.concat(arr) }
  })

  // const lines = str.split('\n').map((l) => l.trim()).filter((l) => l !== '')
  const root = { id: uuid(), text: { content: lines[0] }, children: [], depth: 0 }
  const exps = lines.slice(1).map(getTopic).filter((exp) => exp)

  const iter = (exps, i, ctx) => {
    while (true) {
      // already scan all element, return directly
      if (i === exps.length) { return i }

      const exp = exps[i]
      if (isTopic(exp)) {
        if (exp.depth <= ctx.depth) { return i }
        else {
          ctx.children.push(exp)
          i = iter(exps, i + 1, exp)
        }
      }

      if (isBoundary(exp)) {
        // skip empty boundary
        if (isEmpty(exp)) { i += 1 }
        else {
          // check boundary depth with first element of boundary
          if (exp[0].depth <= ctx.depth) { return i }
          // 
          const ctx1 = { depth: 0, children: [] }
          iter(exp, 0, ctx1)
          ctx.children.push(ctx1.children)
          i += 1
        }
      }
    }
  }

  COUNT = 0   // init COUNT to keep idempotent
  iter(exps, 0, root)
  return root
}
