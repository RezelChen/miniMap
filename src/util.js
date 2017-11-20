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

export const getMaxPoint = (...points) => {
  if (points.length === 0) { logErr('Arguments are empty', getMaxPoint) }
  else {
    const ds = points.map((p) => p.x * p.x + p.y * p.y)
    let maxIndex = 0
    let max = ds[0]
    ds.forEach((d, i) => {
      if (d > max) {
        max = d
        maxIndex = i
      }
    })

    return points[maxIndex]
  }
}