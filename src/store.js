const normalize = (root) => {
  const nodeMap = {}
  const iter = (node) => {
    nodeMap[node.id] = node
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
      state.nodeMap = nodeMap
    },
  },
  actions: {
    async INIT_STATE ({ commit }, { el, root }) {
      if (el) { commit('SET_CONTAINER', el) }
      if (root) {
        commit('SET_ROOT', root.id)
        commit('SET_NODE_MAP', normalize(root))
      }
    },
    async UPDATE_ROOT ({ commit }, root) {
      commit('SET_ROOT', root)
    },
  },
}
