import { posSub, posAdd, logErr, isUndef } from './util'
import { UP, RIGHT, DOWN, LEFT, GROUP, BRANCH } from './constant'

const getDeltaVertical = (tok1, tok2, ratio) => {
  const [tokUp, tokDown] = ratio.y > 0 ? [tok1, tok2] : [tok2, tok1]
  const dir = ratio.y > 0 ? 1 : -1

  const margin = Math.max(tokUp.margin[2], tokDown.margin[0])
  const dy0 = tokUp.size.height - tokUp.getJoint().y
  const dy1 = tokDown.getJoint().y
  const dy = dir * (dy0 + margin + dy1)

  const dx = dy / ratio.y * ratio.x
  return { x: dx, y: dy }
}

const getDeltaHorizon = (tok1, tok2, ratio) => {
  const [tokLeft, tokRight] = ratio.x > 0 ? [tok1, tok2] : [tok2, tok1]
  const dir = ratio.x > 0 ? 1 : -1

  const margin = Math.max(tokLeft.margin[1], tokRight.margin[3])
  const dx0 = tokLeft.size.width - tokLeft.getJoint().x
  const dx1 = tokRight.getJoint().x
  const dx = dir * (dx0 + margin + dx1)

  const dy = dx / ratio.x * ratio.y
  return { x: dx, y: dy }
}

export const calGroup = (tok) => {

  const getRadianFn = (dir) => {
    let radian
    switch (dir) {
      case DOWN:
        radian = 1 / 2 * Math.PI
        return [radian, getDeltaVertical]
      case UP:
        radian = 3 / 2 * Math.PI
        return [radian, getDeltaVertical]
      case RIGHT:
        radian = 0
        return [radian, getDeltaHorizon]
      case LEFT:
        radian = Math.PI
        return [radian, getDeltaHorizon]
    }
  }

  const [radian, fn] = getRadianFn(tok.dir)

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

export const getBranchJoint = (tok, dir) => {
  const topic = tok.getTopic()
  const pos = getRelPos(topic, tok)
  const joint = topic.getJoint()
  const { x, y } = posAdd(pos, joint)
  const { width, height } = tok.size

  // return { x, y }

  switch (dir) {
    case UP:
      return { x, y: 0 }
    case DOWN:
      return { x, y: height }
    case LEFT:
      return { x: 0, y }
    case RIGHT:
      return { x: width, y }
    default:
      logErr('Unknown dir', getBranchJoint, dir)
  }
}

export const getGroupJoint = (tok, dir, delta = 0) => {

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


const calOblique = (toks, radian, getDelta) => {

  const ratio = {
    x: Math.cos(radian),
    y: Math.sin(radian)
  }

  // 计算 pos, 以 firstTok.pos 为基准点
  const datums = [{ x: 0, y: 0 }]
  for (let i = 1; i < toks.length; i++) {
    const dPos = getDelta(toks[i - 1], toks[i], ratio)
    datums.push(posAdd(datums[i - 1], dPos))
  }

  // const datums = toks.map((tok, i) => {

  // })
  // const datums = toks.reduce((datums, tok) => {

  // }, [{ x: 0, y: 0 }])

  // toks.forEach((tok, i) => {
  //   if (i === 0) { tok.pos = { x: 0, y: 0 } }
  //   else {


  //     tok.pos = posAdd(prev.pos, dPos)
  //   }
  // })

  const joints = toks.map((t) => t.getJoint())

  return calToksPos(toks, joints, datums)

  // 位置调整为左上角
  // toks.forEach((t) => { t.pos = posSub(t.pos, t.getJoint()) })

  // // 通过计算 cornerPoint 计算 size
  // const cp = calTotalCornerPoint(toks)
  // const mp = calMarginPoint(toks)

  // const size = {
  //   width: cp.x2 - cp.x1,
  //   height: cp.y2 - cp.y1,
  // }

  // const margin = getMargin(cp, mp)

  // // 重新计算 tok.pos
  // const oPos = { x: cp.x1, y: cp.y1 }
  // toks.forEach((tok) => { tok.pos = posSub(tok.pos, oPos) })
  // // console.log(oPos)
  // // tok.pos = posSub(tok.pos, oPos)

  // return [size, margin]
  // tok.size = size
  // tok.margin = margin
}