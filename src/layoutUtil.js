import { posSub, posAdd, logErr, isUndef, isDef, getMaxPoint } from './util'
import {
  UP, RIGHT, DOWN, LEFT,
  GROUP, BRANCH,
  LEFT_UP, LEFT_DOWN, RIGHT_DOWN, RIGHT_UP
} from './constant'

// TODO this is almost the same as getDatums, should be combined together.
const getPaddingV = (ratio, dy, cj) => {
  const dir = ratio.y > 0 ? 1 : -1
  dy = dir * dy
  const dir0 = ratio.x < 0 ? 1 : -1
  const dx = dir0 * cj.x + (dy / ratio.y * ratio.x)
  return { x: dx, y: dy }
}

const getPaddingH = (ratio, dx, cj) => {
  const dir = ratio.x > 0 ? 1 : -1
  dx = dir * dx
  const dir0 = ratio.y < 0 ? 1 : -1
  const dy = dir0 * cj.y + (dx / ratio.x * ratio.y)
  return { x: dx, y: dy }
}

const getPaddingFn = (dir) => {
  switch (dir) {
    case DOWN:
    case UP:
      return getPaddingV
    case RIGHT:
    case LEFT:
    case RIGHT_DOWN:
    case RIGHT_UP:
    case LEFT_UP:
    case LEFT_DOWN:
      return getPaddingH
  }
}

export const getPadding = (dir, delta, cj = { x: 0, y: 0 }) => {
  const fn = getPaddingFn(dir)
  const radian = getRadian(dir)
  const ratio = {
    x: Math.cos(radian),
    y: Math.sin(radian)
  }

  return fn(ratio, delta, cj)
}

const getDeltaV = (tok1, tok2, ratio) => {
  const [tokUp, tokDown] = ratio.y > 0 ? [tok1, tok2] : [tok2, tok1]
  const dir = ratio.y > 0 ? 1 : -1

  const margin = Math.max(tokUp.margin[2], tokDown.margin[0])
  const dy0 = tokUp.size.height - tokUp.getJoint().y
  const dy1 = tokDown.getJoint().y
  const dy = dir * (dy0 + margin + dy1)

  const dx = dy / ratio.y * ratio.x
  return { x: dx, y: dy }
}

const getDeltaV0 = (tok1, tok2, ratio) => {
  const [tokUp, tokDown] = ratio.y > 0 ? [tok1, tok2] : [tok2, tok1]
  const dir = ratio.y > 0 ? 1 : -1

  const margin = Math.max(tokUp.margin[2], tokDown.margin[0])
  const dy0 = tokUp.getTopic().size.height - tokUp.getJoint().y
  const dy1 = tokDown.getJoint().y
  const dy = dir * (dy0 + margin + dy1)

  const dx = dy / ratio.y * ratio.x
  return { x: dx, y: dy }
}

const getDeltaH = (tok1, tok2, ratio) => {
  const [tokLeft, tokRight] = ratio.x > 0 ? [tok1, tok2] : [tok2, tok1]
  const dir = ratio.x > 0 ? 1 : -1

  const margin = Math.max(tokLeft.margin[1], tokRight.margin[3])
  const dx0 = tokLeft.size.width - tokLeft.getJoint().x
  const dx1 = tokRight.getJoint().x
  const dx = dir * (dx0 + margin + dx1)

  const dy = dx / ratio.x * ratio.y
  return { x: dx, y: dy }
}


const getDeltaH0 = (tok1, tok2, ratio) => {
  const [tokLeft, tokRight] = ratio.x > 0 ? [tok1, tok2] : [tok2, tok1]
  const dir = ratio.x > 0 ? 1 : -1

  const margin = Math.max(tokLeft.margin[1], tokRight.margin[3])
  const dx0 = tokLeft.getTopic().size.width - tokLeft.getJoint().x
  const dx1 = tokRight.getJoint().x
  const dx = dir * (dx0 + margin + dx1)

  const dy = dx / ratio.x * ratio.y
  return { x: dx, y: dy }
}

const getDatumsCreator = (getDelta) => {
  return (toks, ratio) => {
    const datums = [{ x: 0, y: 0 }]
    for (let i = 1; i < toks.length; i++) {
      const dPos = getDelta(toks[i - 1], toks[i], ratio)
      datums.push(posAdd(datums[i - 1], dPos))
    }
    return datums
  }
}

const getDatumsInterCreator = (getDelta, getDelta0) => {
  return (toks, ratio) => {
    const d0 = { x: 0, y: 0 }
    if (toks.length === 0) { return [] }
    if (toks.length === 1) { return [d0] }
    else {
      const d1 = posAdd(d0, getDelta0(toks[0], toks[1], ratio))
      const datums = [d0, d1]
      for (let i = 2; i < toks.length; i++) {
        const t0 = toks[i - 2]
        const t1 = toks[i - 1]
        const t2 = toks[i]

        const d0 = datums[i - 2]
        const d1 = datums[i - 1]

        const d2 = getMaxPoint(
          posAdd(d0, getDelta(t0, t2, ratio)),
          posAdd(d1, getDelta0(t1, t2, ratio)),
        )
        datums.push(d2)
      }
      return datums
    }
  }
}

const getDatumsHorizon = getDatumsCreator(getDeltaH)
const getDatumsVertical = getDatumsCreator(getDeltaV)
const getDatumsHorizonInter = getDatumsInterCreator(getDeltaH, getDeltaH0)
const getDatumsVerticalInter = getDatumsInterCreator(getDeltaV, getDeltaV0)

const getRadian = (dir) => {
  switch (dir) {
    case DOWN:
      return 1 / 2 * Math.PI
    case UP:
      return 3 / 2 * Math.PI
    case RIGHT:
      return 0
    case LEFT:
      return Math.PI
    case RIGHT_DOWN:
      return 1 / 3 * Math.PI
    case LEFT_DOWN:
      return 2 / 3 * Math.PI
    case LEFT_UP:
      return 4 / 3 * Math.PI
    case RIGHT_UP:
      return 5 / 3 * Math.PI
  }
}

const getDatumsFn = (dir, isInter = false) => {
  const [datumsVert, datumsHori] = isInter ? 
    [getDatumsVerticalInter, getDatumsHorizonInter] :
    [getDatumsVertical, getDatumsHorizon]
  
  switch (dir) {
    case DOWN:
    case UP:
    case RIGHT_DOWN:
    case LEFT_DOWN:
    case LEFT_UP:
    case RIGHT_UP:
      return datumsVert
    case RIGHT:
    case LEFT:
      return datumsHori
  }
}

export const calGroup = (tok) => {

  const [direction, inter] = tok.dir.split('-')
  const radian = getRadian(direction)
  const fn = getDatumsFn(direction, isDef(inter))

  const [size, margin] = calOblique(tok.elts, radian, fn)
  tok.size = size
  tok.margin = margin
  return tok
}

export const calBranch = (tok) => {
  const [topic, ...others] = tok.elts

  // outPoints 相对与 topic 位置
  const outPoints = tok.getOutPoints()
  const originPoint = { x: 0, y: 0 }
  const datums = [originPoint, ...outPoints]

  const otherJoints = others.map((t) => t.getJoint())
  const joints = [originPoint, ...otherJoints]

  const [size, margin] = calToksPos(tok.elts, joints, datums)
  tok.size = size
  tok.margin = margin
  return tok
}

const getRelPos = (tok, relTok) => {

  const iter = (t, pos) => {
    if (isUndef(t)) { return logErr('Rel is not ancestor', getRelPos, relTok, tok) }
    if (t === relTok) { return pos }
    else { return iter(t.parent, posAdd(t.pos, pos)) }
  }

  return iter(tok, { x: 0, y: 0 })
}

export const getBranchJoint = (tok, dir, delta = 0) => {
  const topic = tok.getTopic()
  const pos = getRelPos(topic, tok)
  const joint = topic.getJoint()
  const { x, y } = posAdd(pos, joint)
  const { width, height } = tok.size

  switch (dir) {
    case UP:
      return { x, y: -delta }
    case DOWN:
      return { x, y: height + delta }
    case LEFT:
      return { x: -delta, y }
    case RIGHT:
      return { x: width + delta, y }
    default:
      logErr('Unknown dir', getBranchJoint, dir)
  }
}

export const getGroupJoint = (tok, dir, delta = { x: 0, y: 0 }) => {
  const { width, height } = tok.size
  const dx = delta.x
  const dy = delta.y
  switch (dir) {
    case LEFT_UP:
      return { x: dx, y: dy }
    case LEFT_DOWN:
      return { x: dx, y: height + dy }
    case RIGHT_UP:
      return { x: width + dx, y: dy }
    case RIGHT_DOWN:
      return { x: width + dx, y: height + dy }
  }

  const fackToks = tok.getTopics().map((topic) => {
    return {
      pos: getRelPos(topic, tok),
      size: topic.size,
    }
  })

  const cp = calTotalCornerPoint(fackToks)
  const tSize = getSize(cp)
  const x = cp.x1 + tSize.width / 2
  const y = cp.y1 + tSize.height / 2


  switch (dir) {
    case UP:
      return { x, y: dy }
    case DOWN:
      return { x, y: height + dy }
    case LEFT:
      return { x: dx, y }
    case RIGHT:
      return { x: width + dx, y }

    default:
      logErr('Unknown dir', getGroupJoint, dir)
  }
}

export const getTopicJoint = (tok, dir, delta = 0) => {
  const { width, height } = tok.size

  switch (dir) {
    case UP:
      return { x: width / 2, y: -delta }
    case DOWN:
      return { x: width / 2, y: height + delta }
    case LEFT:
      return { x: -delta, y: height / 2 }
    case RIGHT:
      return { x: width + delta, y: height / 2 }

    default:
      logErr('Unknown dir', getTopicJoint, dir)
  }
}

export const calMarginPoint = (toks) => {
  const marginPoint = { x1: Infinity, x2: -Infinity, y1: Infinity, y2: -Infinity }

  toks.forEach((tok) => {
    const { x1, x2, y1, y2 } = getCornerPoint(tok)
    const [top, right, bottom, left] = tok.margin

    marginPoint.x1 = Math.min(marginPoint.x1, x1 - left)
    marginPoint.y1 = Math.min(marginPoint.y1, y1 - top)
    marginPoint.x2 = Math.max(marginPoint.x2, x2 + right)
    marginPoint.y2 = Math.max(marginPoint.y2, y2 + bottom)
  })

  return marginPoint
}


export const calTotalCornerPoint = (toks) => {
  const cornerPoint = { x1: Infinity, x2: -Infinity, y1: Infinity, y2: -Infinity }

  toks.forEach((tok) => {
    const { x1, x2, y1, y2 } = getCornerPoint(tok)
    cornerPoint.x1 = Math.min(cornerPoint.x1, x1)
    cornerPoint.y1 = Math.min(cornerPoint.y1, y1)
    cornerPoint.x2 = Math.max(cornerPoint.x2, x2)
    cornerPoint.y2 = Math.max(cornerPoint.y2, y2)
  })

  return cornerPoint
}


const getCornerPoint = (tok) => {
  const x1 = tok.pos.x
  const y1 = tok.pos.y
  const x2 = x1 + tok.size.width
  const y2 = y1 + tok.size.height
  return { x1, x2, y1, y2 }
}


const getSize = (cp) => {
  return {
    width: cp.x2 - cp.x1,
    height: cp.y2 - cp.y1,
  }
}

const getMargin = (cp, mp) => {
  const left = -(mp.x1 - cp.x1)
  const top = -(mp.y1 - cp.y1)
  const right = mp.x2 - cp.x2
  const bottom = mp.y2 - cp.y2
  return [top, right, bottom, left]
}


const calToksPos = (toks, joints, datums) => {

  toks.forEach((tok, i) => {
    tok.pos = posSub(datums[i], joints[i])
  })

  // 通过计算 cornerPoint 计算 size
  const cp = calTotalCornerPoint(toks)
  const mp = calMarginPoint(toks)

  // 重新计算 tok.pos
  const oPos = { x: cp.x1, y: cp.y1 }
  toks.forEach((tok) => { tok.pos = posSub(tok.pos, oPos) })

  const size = getSize(cp)
  const margin = getMargin(cp, mp)

  return [size, margin]
}


const calOblique = (toks, radian, getDatums) => {

  const ratio = {
    x: Math.cos(radian),
    y: Math.sin(radian)
  }

  const datums = getDatums(toks, ratio)
  const joints = toks.map((t) => t.getJoint())

  return calToksPos(toks, joints, datums)

}
