import Event from '../../lib/events'
import { dispatch } from '../../lib/ux'
import { TOPIC } from '../constant'

const on = (type, cb) => Event.on(type, TOPIC, cb)
const off = (type, cb) => Event.off(type, TOPIC, cb)

on('dblclick', (e, id) => {
  dispatch('UPDATE_ROOT', id)
  return false
})
