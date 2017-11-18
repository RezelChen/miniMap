export const isArray = (obj) => obj.length !== undefined
export const isUndef = (v) => v === undefined || v === null
export const isDef = (v) => v !== undefined && v !== null

export const isEven = (n) => n % 2 === 0
export const copy = (obj) => Array.isArray(obj) ? obj.slice() : Object.assign({}, obj)
export const flatten = (arr) => arr.reduce((a, b) => a.concat(b), [])

export const mapFlat = (arr, fn) => flatten(arr.map(fn))

export const posAdd = (p1, p2) => { return { x: p1.x + p2.x, y: p1.y + p2.y } }
export const posSub = (p1, p2) => { return { x: p1.x - p2.x, y: p1.y - p2.y } }

export const isNull = (arr) => arr.length === 0

export const logErr = (description, fn, ...others) => console.error(description)

export const rand = (n, m) => n + parseInt(Math.random() * m)

export const car = (arr) => {
  if (isNull(arr)) {
    logErr(car, 'can not car null', arr)
  }
  return arr[0]
}

export const cdr = (arr) => {
  if (isNull(arr)) {
    logErr(cdr, 'can not cdr null', arr)
  }
  return arr.slice(1)
}

export const cons = (a, arr) => [a, ...arr]


const merge = (...arrList) => {
  return arrList.reduce((arr1, arr2) => {
    return arr1.concat(arr2)
  }, [])
}


// ============ padding margin ============

const paddingSize = (tok) => {
  const [top, right, bottom, left] = tok.padding
  const s = tok.size
  return {
    width: s.width + right + left,
    height: s.height + top + bottom,
  }
}


const marginSize = (tok) => {
  const [top, right, bottom, left] = tok.margin
  const s = paddingSize(tok)
  return {
    width: s.width + right + left,
    height: s.height + top + bottom,
  }
}

const addPadding = (tok, arr) => {
  tok.padding = tok.padding.map((n, i) => n + arr[i])
}

const addMargin = (tok, arr) => {
  tok.margin = tok.margin.map((n, i) => n + arr[i])
}


const sizeSubPadding = (s, padding) => {
  const [top, right, bottom, left] = padding
  return {
    width: s.width - right - left,
    height: s.height - top - bottom,
  }
}

const paddingPos = (pos, padding) => {
  const [top, right, bottom, left] = padding
  return {
    x: pos.x + left,
    y: pos.y + top,
  }
}




// ============ others ============


const _splitArr = (arr) => {
  const rightNum = Math.ceil(arr.length / 2)
  const right = arr.slice(0, rightNum)
  const left = arr.slice(rightNum)
  return [right, left]
}

const _splitArr2 = (arr) => {
  const right = []
  const left = []
  arr.forEach((item, i) => {
    if (isEven(i)) { right.push(item) }
    else { left.push(item) }
  })
  return [right, left]
}

const _combineArr2 = (right, left) => {
  const iter = (right, left, isEven) => {
    if (isNull(left)) { return right }
    if (isNull(right)) { return left }
    if (isEven) { return cons(car(right), iter(cdr(right), left, !isEven)) }
    else { return cons(car(left), iter(right, cdr(left), !isEven)) }
  }

  return iter(right, left, true)
}



// 分配策略: 将多余的长度分配给 arr 的最后一位
const allocSize0 = (arr, x1) => {
  const x0 = arr.reduce((a, b) => a + b, 0)
  const dx = x1 - x0

  arr[arr.length - 1] += dx
}

// 分配策略: 将多余的长度平均分配给 arr 的每一位
const allocSize1 = (arr, x1) => {
  const x0 = arr.reduce((a, b) => a + b, 0)
  const dx = x1 - x0

  const dx_avg = dx / arr.length
  for (let i = 0; i < arr.length; i++) {
    arr[i] += dx_avg
  }
}


const getToks = (tok) => {
  if (tok.type === 'tok') { return [tok] }
  else {
    return flatten(tok.elts.map((t) => getToks(t)))
  }
}

