import { logErr, isNull, isEven, splitTactic } from './util'
import { Branch, Group } from './tok'
import { STRUCT_MAP } from './config'
import {
  BRANCH, TOPIC, GROUP,
  
  MAP, LOGIC_R, LOGIC_L, ORG, ORG_UP,
  TREE_L, TREE_R, TIME_V, TIME_UP, TIME_DOWN, TIME_H_UP, TIME_H_DOWN, TIME_H,
  FISH_RIGHT_UP_IN, FISH_RIGHT_DOWN_IN, FISH_LEFT_UP_IN, FISH_LEFT_DOWN_IN,
  FISH_RIGHT_UP, FISH_RIGHT_DOWN, FISH_LEFT_UP, FISH_LEFT_DOWN,
  FISH_RIGHT, FISH_LEFT,
} from './constant'


export const transNode = (node, ctx = MAP) => {

  const struct = node.struct || STRUCT_MAP[ctx].Child || ctx
  const topic = node.tok

  if (node.children === undefined || isNull(node.children)) { return new Branch({ elts: [topic], OUTS: [] }) }
  else {
    const OUTS = STRUCT_MAP[struct].OUTS

    switch (struct) {
      case MAP: {
        const [right, left] = splitTactic(node.children)
        const rGroup = transList(right, LOGIC_R)
        const lGroup = transList(left, LOGIC_L)
        return new Branch({ elts: [topic, rGroup, lGroup], OUTS })
      }
      default: {
        const group = transList(node.children, struct)
        return new Branch({ elts: [topic, group], OUTS })
      }
    }
  }
}

const transNode0 = (node, ctx) => {
  if (Array.isArray(node)) { return transList(node, ctx) }
  else {
    const IN = STRUCT_MAP[ctx].IN
    const tok = transNode(node, ctx)
    tok.IN = IN
    return tok
  }
}

const transInterCreator = (ctxs) => {
  return (node, i) => {
    const ctx = isEven(i) ? ctxs[0] : ctxs[1]
    return transNode0(node, ctx)
  }
}

const transList = (nodes, ctx) => {

  const getToks = (nodes, ctx) => {
    switch (ctx) {
      case TIME_H: {
        const ctxs = [TIME_H_UP, TIME_H_DOWN]
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

      default: {
        return nodes.map((node) => transNode0(node, ctx))
      }
    }
  }

  const toks = getToks(nodes, ctx)
  const IN = STRUCT_MAP[ctx].GroupIN
  const dir = STRUCT_MAP[ctx].GroupDIR

  return new Group({ elts: toks, IN, dir })
}
