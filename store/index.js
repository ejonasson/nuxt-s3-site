import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: () => ({
      activeImage: null,
      images: []
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
      },
      setImages (state, { images }) {
        state.images = images
      },
    }
  })
}

export default createStore
