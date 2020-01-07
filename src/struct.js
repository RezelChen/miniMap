import { logErr, isNull, isEven, splitTactic, isEmpty, getRandColor } from './util'
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


const transNode0 = (node, struct) => {
  const topic = node.tok
  const OUTS = STRUCT_MAP[struct].OUTS
  const IN = STRUCT_MAP[struct].IN
  topic.IN = STRUCT_MAP[struct].TopicIN

  if (isNull(node.children) || isEmpty(node.children)) { return new Branch({ elts: [topic], OUTS: [], IN, struct }) }
  else {
    switch (struct) {
      case MAP: {
        const [right, left] = splitTactic(node.children)
        const rGroup = transList(right, LOGIC_R)
        const lGroup = transList(left, LOGIC_L)
        return new Branch({ elts: [topic, rGroup, lGroup], OUTS, IN, struct })
      }
      default: {
        const group = transList(node.children, struct)
        return new Branch({ elts: [topic, group], OUTS, IN, struct })
      }
    }
  }
}

export const transNode = (node, ctx = MAP) => {
  if (Array.isArray(node)) { return transList(node, ctx, getRandColor()) }
  else {
    const struct = node.struct || STRUCT_MAP[ctx].Child || ctx
    return transNode0(node, struct)
  }
}

const transInterCreator = (ctxs) => {
  return (node, i) => {
    const ctx = isEven(i) ? ctxs[0] : ctxs[1]
    return transNode(node, ctx)
  }
}

const transList = (nodes, ctx, color) => {

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
        return nodes.map((node) => transNode(node, ctx))
      }
    }
  }

  const toks = getToks(nodes, ctx)
  const IN = STRUCT_MAP[ctx].GroupIN
  const dir = STRUCT_MAP[ctx].GroupDIR

  return new Group({ elts: toks, IN, dir, color, ctx })
}
