<template>
  <section class="section">
    <div class="galleryContainer container">
      <div class="columns full-width">
        <div
          v-for="image in images"
          :key="image.Key"
          class="column"
        >
          <gallery-image
            :image="image"
          />
        </div>
      </div>
    </div>
    <gallery-hero
      v-if="$store.getters.hasActiveImage"
    />
  </section>
</template>

<script>
import S3 from '~/services/S3'
import GalleryImage from '~/components/GalleryImage.vue'
import GalleryHero from '~/components/GalleryHero.vue'

export default {
  components: {
    'gallery-image': GalleryImage,
    'gallery-hero': GalleryHero
  },
  async fetch ({ store, params, route }) {
    this.S3 = new S3()
    let images = await this.S3.fetchImages()
    store.commit('setImages', { images })
    if (route.params.imageId) {
      const activeImage = images.find(i => i.id === route.params.imageId)
      if (activeImage) {
        store.commit('setActiveImage', { image: activeImage })
      }
    }
  },

  head () {
    return {
      title: 'Zoe Jonasson'
    }
  },
  computed: {
    images () {
      return this.$store.state.images
    }
  }
}
</script>

<style>
  .galleryContainer {
    display: flex;
  }

  .full-width {
    width: 100%;
    flex-wrap: wrap;
  }
</style>
