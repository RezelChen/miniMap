import { logErr, isNull, isEven, splitTactic } from './util'
import { Branch, Group } from './tok'
import { STRUCT_MAP } from './config'
import {
  BRANCH, TOPIC, GROUP,
  
  MAP, LOGIC_R, LOGIC_L, ORG, ORG_UP,
  TREE_L, TREE_R, TIME_V, TIME_H, TIME_UP, TIME_DOWN, 
  FISH_RIGHT_UP_IN, FISH_RIGHT_DOWN_IN, FISH_LEFT_UP_IN, FISH_LEFT_DOWN_IN,
  FISH_RIGHT_UP, FISH_RIGHT_DOWN, FISH_LEFT_UP, FISH_LEFT_DOWN,
  FISH_RIGHT, FISH_LEFT,
} from './constant'


export const transNode = (node, ctx = MAP) => {

  ctx = node.struct || ctx
  const topic = node.tok

  if (node.children === undefined || isNull(node.children)) { return new Branch({ elts: [topic], OUTS: [] }) }
  else {
    const OUTS = STRUCT_MAP[ctx].OUTS

    switch (ctx) {
      case MAP: {
        const [right, left] = splitTactic(node.children)
        const rGroup = transList(right, LOGIC_R)
        const lGroup = transList(left, LOGIC_L)
        return new Branch({ elts: [topic, rGroup, lGroup], OUTS })
      }
      default: {
        const group = transList(node.children, ctx)
        return new Branch({ elts: [topic, group], OUTS })
      }
    }
  }
}

const transInterCreator = (ctxs) => {
  return (node, i) => {
    const ctx = isEven(i) ? ctxs[0] : ctxs[1]
    const IN = STRUCT_MAP[ctx].IN
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
        const ctxs = [FISH_RIGHT_UP_IN, FISH_RIGHT_DOWN_IN]
        const transNode = transInterCreator(ctxs)
        return nodes.map(transNode)
      }

      case FISH_LEFT: {
        const ctxs = [FISH_LEFT_UP_IN, FISH_LEFT_DOWN_IN]
        const transNode = transInterCreator(ctxs)
        return nodes.map(transNode)
      }

      default: {
        const IN = STRUCT_MAP[ctx].IN
        const Child = STRUCT_MAP[ctx].Child || ctx
        return nodes.map((node) => {
          const tok = transNode(node, Child)
          tok.IN = IN
          return tok
        })
      }
    }
  }

  const toks = getToks(nodes, ctx)
  const IN = STRUCT_MAP[ctx].GroupIN
  const dir = STRUCT_MAP[ctx].GroupDIR

  return new Group({ elts: toks, IN, dir })
}
