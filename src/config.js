import {
  RIGHT, LEFT, DOWN, UP,
  LEFT_DOWN, LEFT_UP, RIGHT_UP, RIGHT_DOWN,
  RIGHT_INTER, LEFT_INTER, DOWN_INTER,

  MAP, LOGIC_R, LOGIC_L, ORG, ORG_UP,
  TREE_L, TREE_R, TIME_V, TIME_H, TIME_UP, TIME_DOWN, 
  FISH_RIGHT_UP, FISH_RIGHT_DOWN, FISH_LEFT_UP, FISH_LEFT_DOWN,
  FISH_RIGHT, FISH_LEFT,
} from './constant'

export const STRUCT_MAP = {
  [MAP]: {
    OUTS: [RIGHT, LEFT],
  },
  [LOGIC_R]: {
    IN: LEFT,
    OUTS: [RIGHT],
    GroupIN: LEFT,
    GroupDIR: DOWN,
  },
  [LOGIC_L]: {
    IN: RIGHT,
    OUTS: [LEFT],
    GroupIN: RIGHT,
    GroupDIR: DOWN,
  },
  [ORG]: {
    IN: UP,
    OUTS: [DOWN],
    GroupIN: UP,
    GroupDIR: RIGHT,
  },
  [ORG_UP]: {
    IN: DOWN,
    OUTS: [UP],
    GroupIN: DOWN,
    GroupDIR: RIGHT,
  },
  [TREE_L]: {
    IN: RIGHT,
    OUTS: [DOWN],
    GroupIN: RIGHT_UP,
    GroupDIR: DOWN,
  },
  [TREE_R]: {
    IN: LEFT,
    OUTS: [DOWN],
    GroupIN: LEFT_UP,
    GroupDIR: DOWN,
  },
  [TIME_V]: {
    IN: UP,
    OUTS: [DOWN],
    GroupIN: UP,
    GroupDIR: DOWN_INTER,
  },
  [TIME_H]: {
    IN: LEFT,
    OUTS: [RIGHT],
    GroupIN: LEFT,
    GroupDIR: RIGHT_INTER,
  },
  [TIME_UP]: {
    IN: LEFT,
    OUTS: [UP],
    GroupIN: LEFT_DOWN,
    GroupDIR: DOWN,
  },
  [TIME_DOWN]: {
    IN: LEFT,
    OUTS: [DOWN],
    GroupIN: LEFT_UP,
    GroupDIR: DOWN,
  },
  [FISH_RIGHT_UP]: {
    IN: LEFT,
    OUTS: [RIGHT],
    GroupIN: LEFT_DOWN,
    GroupDIR: RIGHT_UP,
  },
  [FISH_RIGHT_DOWN]: {
    IN: LEFT,
    OUTS: [RIGHT],
    GroupIN: LEFT_UP,
    GroupDIR: RIGHT_DOWN,
  },
  [FISH_LEFT_UP]: {
    IN: RIGHT,
    OUTS: [LEFT],
    GroupIN: RIGHT_DOWN,
    GroupDIR: LEFT_UP,
  },
  [FISH_LEFT_DOWN]: {
    IN: RIGHT,
    OUTS: [LEFT],
    GroupIN: RIGHT_UP,
    GroupDIR: LEFT_DOWN,
  },
  [FISH_RIGHT]: {
    IN: LEFT,
    OUTS: [RIGHT],
    GroupIN: LEFT,
    GroupDIR: RIGHT_INTER,
  },
  [FISH_LEFT]: {
    IN: RIGHT,
    OUTS: [LEFT],
    GroupIN: RIGHT,
    GroupDIR: LEFT_INTER,
  },
}

export const GROUP_PADDING = 30
export const BRANCH_PADDING = 10
export const CONN_GAP = 10
