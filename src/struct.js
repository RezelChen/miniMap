import { logErr, isNull } from './util'
import { Branch, Group } from './tok'
import { getOUTS, getIN, getGroupIN, getGroupDir, splitTactic } from './structUtil'
import {
  BRANCH, TOPIC, GROUP,
  DOWN, RIGHT, LEFT,
  LOGIC_R, LOGIC_L, MAP, ORG, ORG_UP
} from './constant'


export const transNode = (node, ctx = MAP) => {

  ctx = node.struct || ctx
  const topic = node.tok

  if (isNull(node.children)) { return topic }
  else {
    const OUTS = getOUTS(ctx)

    switch (ctx) {

      case LOGIC_R:
      case LOGIC_L:
      case ORG:
      case ORG_UP: {
        const group = transList(node.children, ctx)
        return new Branch({ elts: [topic, group], OUTS })
      }

      case MAP: {
        const [right, left] = splitTactic(node.children)
        const rGroup = transList(right, LOGIC_R)
        const lGroup = transList(left, LOGIC_L)
        return new Branch({ elts: [topic, rGroup, lGroup], OUTS })
      }

      default:
        logErr('Unknown ctx', transTok, ctx)
    }
  }
}

const transList = (nodes, ctx) => {
  const IN = getIN(ctx)
  const gIN = getGroupIN(ctx)
  const dir = getGroupDir(ctx)

  const toks = nodes.map((node) => transNode(node, ctx))
  toks.forEach((tok) => tok.IN = IN)

  return new Group({ elts: toks, IN: gIN, dir })
}
