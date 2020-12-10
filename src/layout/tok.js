import { logErr, uuid, posAdd, isDef, getRandColor, getTextSize } from '../util'
import { getTopicJoint, getGroupJoint, getBranchJoint, getRelPos } from './layoutUtil'
import { CONN_GAP, BRANCH_PADDING, DEFAULT_STYLE } from './config'
import { TOPIC, BRANCH, GROUP, CONN } from '../constant'
import { poolRegister, POOL_MAP } from '../../lib/pool'

const DEFAULT_PADDING = [0, 0, 0, 0]
const DEFAULT_MARGIN = [0, 0, 0, 0]

class Tok {
  constructor (opts) { this.init(opts) }

  init (opts) {
    this.id = opts.id || uuid()
    this.pos = opts.pos || { x: 0, y: 0 }
    this.size = opts.size || { width: 0, height: 0 }

    this.padding = opts.padding || DEFAULT_PADDING
    this.margin = opts.margin || DEFAULT_MARGIN

    this.elts = opts.elts || []
    this.elts.forEach((elt) => elt.parent = this)

    this.IN = opts.IN
  }

  getJoint () { logErr('Undefined method', this.getJoint, this) }

}

export class Topic extends Tok {

  constructor (opts) { super(opts) }

  init (opts) {
    super.init(opts)

    const [top, right, bottom, left] = this.padding
    this.size.width += left + right
    this.size.height += top + bottom

    this.text = opts.text
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
  constructor (opts) { super(opts) }

  init (opts) {
    super.init(opts)
    this.type = GROUP
    this.dir = opts.dir
    this.align = opts.align
    this.color = opts.color
  }

  getJoint() {
    return getGroupJoint(this, this.IN)
  }

  getTopic () { return this.elts[0].getTopic() }

  getTopics () { return this.elts.map((t) => t.getTopic()) }

  getChildJoint (dir) {
    // TODO use dir to get index of elts
    const topic = this.elts[this.elts.length-1]
    const joint = getTopicJoint(topic, dir)
    return posAdd(getRelPos(topic, this), joint)
  }

}

export class Branch extends Tok {
  constructor (opts) { super(opts) }

  init (opts) {
    super.init(opts)
    this.type = BRANCH
    this.OUTS = opts.OUTS
    this.struct = opts.struct
    this.padding = opts.padding || BRANCH_PADDING
  }

  getJoint () { return getBranchJoint(this, this.IN) }

  getTopic () { return this.elts[0] }

  getChildJoint (dir) {
    const topic = this.getTopic()
    const joint = getTopicJoint(topic, dir)
    return posAdd(getRelPos(topic, this), joint)
  }

  getOutPoints () {
    const topic = this.getTopic()
    return this.OUTS.map((out) => getTopicJoint(topic, out, CONN_GAP))
  }

}

export class Conn {
  constructor (id, points, style) { this.init(id, points, style) }

  init (id, points, style) {
    this.id = id
    this.type = CONN
    this.points = points
    this.style = style
  }

  getPoints () {
    return this.points.map((p) => posAdd(p.tok.pos, p.pos))
  }
}

poolRegister(Topic)
poolRegister(Group)
poolRegister(Branch)
poolRegister(Conn)

export const isBranch = (tok) => tok.type === BRANCH
export const isGroup = (tok) => tok.type === GROUP
export const isTopic = (tok) => tok.type === TOPIC
export const isPhantom = (tok) => !tok.color

export const createTok = (node, IN) => {
  const index =  Math.min(node.depth, DEFAULT_STYLE.length - 1)
  const defaultStyle = DEFAULT_STYLE[index]
  const text = { ...defaultStyle.text, ...node.text }
  const size = getTextSize(text.content, text)

  const opts = {
    id: node.id,
    size,
    text,
    color: node.color || getRandColor(),
    margin: node.margin || defaultStyle.margin,
    padding: node.padding || defaultStyle.padding,
    IN,
  }
  return POOL_MAP['Topic'].create(opts)
}
