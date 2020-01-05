import { logErr, isNull, isEven } from './util'
import { Branch, Group } from './tok'
import { getOUTS, getIN, getGroupIN, getGroupDir, splitTactic } from './structUtil'
import {
  BRANCH, TOPIC, GROUP,
  DOWN, RIGHT, LEFT,
  MAP, LOGIC_R, LOGIC_L, ORG, ORG_UP,
  TREE_L, TREE_R, TIME_H, TIME_UP, TIME_DOWN, TIME_V,
  FISH_RIGHT_UP, FISH_LEFT_UP, FISH_LEFT_DOWN, FISH_RIGHT_DOWN,
  FISH_RIGHT, FISH_LEFT,
} from './constant'


export const transNode = (node, ctx = MAP) => {

  ctx = node.struct || ctx
  const topic = node.tok

  if (node.children === undefined || isNull(node.children)) { return new Branch({ elts: [topic], OUTS: [] }) }
  else {
    const OUTS = getOUTS(ctx)

    switch (ctx) {

      case LOGIC_R:
      case LOGIC_L:
      case ORG:
      case ORG_UP:
      case TREE_L:
      case TREE_R:
      case TIME_H:
      case TIME_V:
      case TIME_UP:
      case TIME_DOWN:
      case FISH_RIGHT_UP:
      case FISH_RIGHT_DOWN:
      case FISH_LEFT_UP:
      case FISH_LEFT_DOWN:
      case FISH_RIGHT:
      case FISH_LEFT: {
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

const transInterCreator = (ctxs) => {
  const INs = ctxs.map(getIN)
  return (node, i) => {
    const ctx = isEven(i) ? ctxs[0] : ctxs[1]
    const IN = isEven(i) ? INs[0] : INs[1]
    const tok = transNode(node, ctx)
    tok.IN = IN
    return tok
  }
}

const transList = (nodes, ctx) => {

  const getToks = (nodes, ctx) => {
    switch (ctx) {
      case TIME_H: {
        const ctxs = [TIME_UP, TIME_DOWN]
        const transNode = transInterCreator(ctxs)
        return nodes.map(transNode)
      }

      case TIME_V: {
        const ctxs = [TREE_R, TREE_L]
        const transNode = transInterCreator(ctxs)
        return nodes.map(transNode)
      }

      case FISH_RIGHT: {
        const ctxs = [FISH_RIGHT_UP, FISH_RIGHT_DOWN]
        const transNode = transInterCreator(ctxs)
        return nodes.map(transNode)
      }

      case FISH_LEFT: {
        const ctxs = [FISH_LEFT_UP, FISH_LEFT_DOWN]
        const transNode = transInterCreator(ctxs)
        return nodes.map(transNode)
      }

      case TIME_UP:
      case TIME_DOWN: {
        const IN = getIN(ctx)
        return nodes.map((node) => {
          const tok = transNode(node, LOGIC_R)
          tok.IN = IN
          return tok
        })
      }

      default: {
        const IN = getIN(ctx)
        return nodes.map((node) => {
          const tok = transNode(node, ctx)
          tok.IN = IN
          return tok
        })
      }
    }
  }

  const gIN = getGroupIN(ctx)
  const dir = getGroupDir(ctx)
  const toks = getToks(nodes, ctx)

  return new Group({ elts: toks, IN: gIN, dir })
}
