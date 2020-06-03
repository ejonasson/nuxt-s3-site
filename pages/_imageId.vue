<template>
  <section class="section">
    <div class="container">
      <div class="columns is-centered">
        <div class="column button-column is-narrow">
          <a
            class="button"
            href="/"
            disabled
          >
            Pictures
          </a>
          <a
            class="button"
            href="/videos"
          >
            Videos
          </a>
        </div>
      </div>
    </div>
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

  async asyncData ({ params, error, payload }) {
    if (!payload) {
      const aws = new S3()
      let data = await aws.fetchImages()
      return {
        imageData: data
      }
    }
    return {
      imageData: payload
    }
  },
  computed: {
    images () {
      return this.imageData
    }
  },

  beforeMount() {
    this.$store.commit('setImages', { images: this.imageData })
    if (this.$route.params.imageId) {
      const activeImage = images.find(i => i.id === this.$route.params.imageId)
      if (activeImage) {
        this.$store.commit('setActiveImage', { image: activeImage })
      }
    }
  },

  head () {
    return {
      title: 'Zoe Jonasson'
    }
  },
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

  .button-column {
    margin-bottom: 20px;
  }
</style>
