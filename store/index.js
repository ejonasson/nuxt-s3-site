import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: () => ({
      activeImage: null
    }),
    getters: {
      hasActiveImage: state => state.activeImage !== null
    },
    mutations: {
      setActiveImage (state, { imageUrl }) {
        state.activeImage = imageUrl
      },
      clearActiveImage (state) {
        state.activeImage = null
      }
    }
  })
}

export default createStore
