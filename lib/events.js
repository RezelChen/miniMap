const EVENT_MAP = {}

const dispatch = async (e) => {
  const { type } = e
  console.log('hello', e)
  const tag = 'test'
  EVENT_MAP[type] = EVENT_MAP[type] || {}
  EVENT_MAP[type][tag] = EVENT_MAP[type][tag] || []

  const handlers = EVENT_MAP[type][tag]
  for (let i = 0; i < handlers.length; i++) {
    const res = await handlers[i](e)
    if (res === false) {
      e.stopPropagation()
      e.preventDefault()
    }
  }
}

const on = (type, tag, cb) => {
  if (!EVENT_MAP[type]) {
    document.body.addEventListener(type, dispatch)
    EVENT_MAP[type] = {}
  }

  EVENT_MAP[type][tag] = EVENT_MAP[type][tag] || []
  EVENT_MAP[type][tag].push(cb)
}

const off = (type, tag, cb = undefined) => {
  if (!EVENT_MAP[type]) { return }
  if (!EVENT_MAP[type][tag]) { return }
  
  if (cb === undefined) { delete EVENT_MAP[type][tag] }
  else {
    const arr = EVENT_MAP[type][tag]
    const index = arr.indexOf(cb)
    if (index !== -1) { arr.splice(index, 1) }
    if (arr.length === 0) { delete EVENT_MAP[type][tag] }
  }
  
  // update EVENT_MAP if EVENT_MAP[type] is empty
  if (Object.keys(EVENT_MAP[type]).length === 0) {
    delete EVENT_MAP[type]
    document.body.removeEventListener(type, dispatch)
  }
}

export default { on, off }
