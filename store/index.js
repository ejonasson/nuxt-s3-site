import Vuex from 'vuex'
import S3 from '~/services/S3'

const createStore = () => {
  return new Vuex.Store({
    state: () => ({
      activeImage: null,
      activeImageKey: '',
      images: []
    }),
    getters: {
      hasActiveImage: state => state.activeImage !== null,
      activeImageIndex: state => state.images.findIndex(image => image.Key === state.activeImageKey)
    },
    mutations: {
      setActiveImage (state, { image }) {
        let imageIndex = state.images.findIndex((stateImage) => stateImage.Key === image.Key)
        if (state.images[imageIndex].imageUrl === undefined) {
          const s3 = new S3()
          state.images[imageIndex].imageUrl = s3.getPublicUrl(image)
        }

        state.activeImage = state.images[imageIndex].imageUrl
        state.activeImageKey = image.Key
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
