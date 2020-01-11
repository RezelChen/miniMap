import { registRender, registStore } from '../lib/ux'
import render from './layout'
import store from './store'

registRender(render)
registStore(store)

export default {

  mount(el) {},

  initData () {},
}
