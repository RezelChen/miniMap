import { rand, logErr, posAdd, isDef, getRandColor, getTextSize } from './util'
import { getTopicJoint, getGroupJoint, getBranchJoint } from './layoutUtil'
import { GROUP_PADDING, CONN_GAP, BRANCH_PADDING, FONT_FAMILY } from './config'
import {
  TOPIC, BRANCH, GROUP, CONN,
  LEFT, RIGHT, TOP, BOTTOM
} from './constant'

class Tok {
  constructor (opts) {
    this.pos = { x: 0, y: 0 }
    this.size = opts.size || { width: 0, height: 0 }
    this.text = opts.text

    this.padding = opts.padding || [0, 0, 0, 0]
    this.margin = opts.margin || [0, 0, 0, 0]
    const [top, right, bottom, left] = this.padding
    this.size.width += left + right
    this.size.height += top + bottom

    this.elts = opts.elts || []
    this.elts.forEach((elt) => elt.parent = this)

    this.IN = opts.IN
  }

  getJoint () { logErr('Undefined method', this.getJoint, this) }

}

export class Topic extends Tok {

  constructor (opts) {
    super(opts)
    this.type = TOPIC
    this.color = opts.color
  }

  getJoint () {
    const IN = isDef(this.IN) ? this.IN : this.parent.IN
    return getTopicJoint(this, IN)
  }

  getTopic () { return this }

}

export class Group extends Tok {
  constructor (opts) {
    super(opts)
    this.type = GROUP
    this.dir = opts.dir
    this.color = opts.color
  }

  getJoint() {
    return getGroupJoint(this, this.IN, GROUP_PADDING)
  }

  getTopic () { return this.elts[0] }

  getTopics () { return this.elts.map((t) => t.getTopic()) }

}

export class Branch extends Tok {
  constructor (opts) {
    super(opts)
    this.type = BRANCH
    this.OUTS = opts.OUTS
    this.struct = opts.struct
  }

  getJoint () { return getBranchJoint(this, this.IN, BRANCH_PADDING) }

  getTopic () { return this.elts[0] }

  getOutPoints () {
    const topic = this.getTopic()
    return this.OUTS.map((out) => getTopicJoint(topic, out, CONN_GAP))
  }

  createOutConns () {
    const topic = this.getTopic()
    return this.OUTS.map((out) => {
      const p1 = { tok: topic, pos: getTopicJoint(topic, out) }
      const p2 = { tok: topic, pos: getTopicJoint(topic, out, CONN_GAP) }
      return new Conn(p1, p2)
    })
  }

}

export class Conn {
  constructor (p1, p2, style) {
    this.points = [p1, p2]
    this.type = CONN
    this.style = style
  }

  generate () {
    const posArr = this.points.map((p) => posAdd(p.tok.pos, p.pos))
    return {
      p1: posArr[0],
      p2: posArr[1],
      type: this.type,
      style: this.style,
    }
  }
}

export const isBranch = (tok) => tok.type === BRANCH
export const isGroup = (tok) => tok.type === GROUP
export const isTopic = (tok) => tok.type === TOPIC
export const isPhantom = (tok) => !tok.color

export const createEmptyTok = () => {
  return new Topic({ size: { width: 0, height: 0 }, })
}


export const createRandTok = () => {
  const width = rand(20, 30)
  const height = rand(15, 15)

  // const width = 30
  // const height = 15

  return new Topic({
    size: { width, height },
    margin: [5, 20, 5, 5],
  })
}

export const createTokByLayer = (node, n) => {
  const text = {
    content: node.topic || 'SubTopic',
    fontSize: 15,
    fontFamily: FONT_FAMILY,
  }

  const size = getTextSize(text.content, text)

  // n = Math.min(n, 2)
  // const layerSize = [
  //   { width: 100, height: 50 },
  //   { width: 60, height: 30 },
  //   { width: 40, height: 20 },
  // ]

  return new Topic({
    size: Object.assign({}, size),
    margin: [5, 5, 5, 5],
    color: node.color || getRandColor(),
    text,
    padding: [5, 5, 5, 5]
  })
}
