import { isBoundary, isEmpty, removeItem } from './util'
const normalize = (root) => {
  const nodeMap = {}
  const iter = (node) => {
    nodeMap[node.id] = node
    node.children.forEach((child) => child.parent = node.id)
    node.children = node.children.map(iter)
    return node.id
  }
  iter(root)
  return nodeMap
}

export default {
  state: {
    el: null,
    root: null,
    nodeMap: null,
  },
  mutations: {
    SET_CONTAINER (state, el) {
      state.el = el
    },
    SET_ROOT (state, root) {
      state.root = root
    },
    SET_NODE_MAP (state, nodeMap) {
      state.nodeMap = normalize(nodeMap)
    },
    SET_TOPIC (state, id, attrs) {
      const topic = state.nodeMap[id]
      Object.assign(topic, attrs)
    },
    REMOVE_NODE (state, id) {
      if (id == state.root) { return }

      const removeNode = (id) => {
        const node = state.nodeMap[id]
        node.children.forEach(removeNode)
        delete state.nodeMap[id]
      }

      const getRealNode = (id) => {
        const node = state.nodeMap[id]
        const parent = state.nodeMap[node.parent]
        // boundary with only one child should be remove
        if (isBoundary(parent) && parent.children.length == 1) { return getRealNode(parent.id) }
        else { return node }
      }

      const node = getRealNode(id)
      const parent = state.nodeMap[node.parent]

      removeItem(parent.children, node.id)
      removeNode(node.id)
    },
  },
  actions: {
    async INIT_STATE ({ commit }, { el, root }) {
      if (el) { commit('SET_CONTAINER', el) }
      if (root) {
        commit('SET_ROOT', root.id)
        commit('SET_NODE_MAP', root)
      }
    },
    async UPDATE_ROOT ({ commit }, root) {
      commit('SET_ROOT', root)
    },
    async UPDAT_TOPIC ({ commit }, id, attrs) {
      commit('SET_TOPIC', id, attrs)
    },
    async REMOVE_TOPIC ({ commit }, id) {
      commit('REMOVE_NODE', id)
    },
  },
}
