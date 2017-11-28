import {
  RIGHT, LEFT, DOWN, UP,
  LEFT_DOWN, LEFT_UP, RIGHT_UP, RIGHT_DOWN,
  RIGHT_INTER, DOWN_INTER,
  LOGIC_R, LOGIC_L, MAP, ORG, ORG_UP,
  TREE_L, TREE_R, TIME_DOWN, TIME_UP, TIME_H, TIME_V,
  FISH_RIGHT_UP, FISH_LEFT_UP, FISH_LEFT_DOWN, FISH_RIGHT_DOWN
} from './constant'
import { logErr } from './util'

export const getOUTS = (ctx) => {
  switch (ctx) {
    case LOGIC_R:
    case TIME_H:
    case FISH_RIGHT_UP:
    case FISH_RIGHT_DOWN:
      return [RIGHT]
    case LOGIC_L:
    case FISH_LEFT_UP:
    case FISH_LEFT_DOWN:
      return [LEFT]
    case ORG:
    case TREE_L:
    case TREE_R:
    case TIME_DOWN:
    case TIME_V:
      return [DOWN]
    case ORG_UP:
    case TIME_UP:
      return [UP]
    case MAP:
      return [RIGHT, LEFT]
    default:
      logErr('Unknown ctx', getOUTS, ctx)
  }
}

export const getGroupIN = (ctx) => {
  switch (ctx) {
    case LOGIC_R:
    case TIME_H:
      return LEFT
    case LOGIC_L:
      return RIGHT
    case ORG:
    case TIME_V:
      return UP
    case ORG_UP:
      return DOWN
    case TREE_R:
    case TIME_DOWN:
    case FISH_RIGHT_DOWN:
      return LEFT_UP
    case TIME_UP:
    case FISH_RIGHT_UP:
      return LEFT_DOWN
    case TREE_L:
    case FISH_LEFT_DOWN:
      return RIGHT_UP
    case FISH_LEFT_UP:
      return RIGHT_DOWN
    default:
      logErr('Unknown ctx', getGroupIN, ctx)
  }
}

export const getGroupDir = (ctx) => {
  switch (ctx) {
    case LOGIC_R:
    case LOGIC_L:
    case TREE_R:
    case TREE_L:
    case TIME_UP:
    case TIME_DOWN:
      return DOWN
    case ORG:
    case ORG_UP:
      return RIGHT
    case TIME_H:
      return RIGHT_INTER
    case TIME_V:
      return DOWN_INTER
    case FISH_RIGHT_UP:
      return RIGHT_UP
    case FISH_RIGHT_DOWN:
      return RIGHT_DOWN
    case FISH_LEFT_UP:
      return LEFT_UP
    case FISH_LEFT_DOWN:
      return LEFT_DOWN
    default:
      logErr('Unknown ctx', getGroupDir, ctx)
  }
}

export const getIN = (ctx) => {
  switch (ctx) {
    case LOGIC_R:
    case TREE_R:
    case TIME_UP:
    case TIME_DOWN:
    case FISH_RIGHT_UP:
    case FISH_RIGHT_DOWN:
      return LEFT
    case LOGIC_L:
    case TREE_L:
    case FISH_LEFT_UP:
    case FISH_LEFT_DOWN:
      return RIGHT
    case ORG:
      return UP
    case ORG_UP:
      return DOWN
    default:
      logErr('Unknown ctx', getInDir, ctx)
  }
}


export const splitTactic = (arr) => {
  const rightNum = Math.ceil(arr.length / 2)
  const right = arr.slice(0, rightNum)
  const left = arr.slice(rightNum)
  return [right, left]
}