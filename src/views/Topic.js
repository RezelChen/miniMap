import Event from '../../lib/events'
import { dispatch } from '../../lib/ux'
import { TOPIC } from '../constant'
import store from '../store'

const on = (type, cb) => Event.on(type, TOPIC, cb)
const off = (type, cb) => Event.off(type, TOPIC, cb)

window.store = store

on('dblclick', (e, id) => {
  // dispatch('UPDAT_TOPIC', id, { text: { content: 'Hello World' } })
  // dispatch('UPDATE_ROOT', id)
  // const parentId = store.state.nodeMap[id].parent
  dispatch('REMOVE_TOPIC', id)
  return false
})
