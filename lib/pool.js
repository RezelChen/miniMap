class Pool {
  constructor (CLASS) {
    this.arr = []
    this.nextIndex = 0
    this._class = CLASS
  }

  create (...args) {
    let obj = this.arr[this.nextIndex]
    if (obj) { obj.init(...args) }
    else {
      obj = new this._class(...args)
      this.arr[this.nextIndex] = obj
    }

    this.nextIndex++
    return obj
  }

  // mark all objects in pool as unused
  finish () {
    this.arr.length = this.nextIndex
    this.nextIndex = 0
  }
}

export const POOL_MAP = {}
export const poolRegister = (CLASS) => POOL_MAP[CLASS.name] = new Pool(CLASS)
