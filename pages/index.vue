<template>
  <section class="section">
    <div class="galleryContainer container">
      <div class="columns full-width">
        <div
          v-for="image in images"
          :key="image.Key"
          class="column is-one-third"
        >
          <gallery-image
            :image-id="image.Key"
            :thumbnail-url="image.thumbnailUrl"
            :image-url="image.publicUrl"
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
  data () {
    return {
      images: []
    }
  },
  async asyncData ({ params }) {
    this.S3 = new S3()
    let images = await this.S3.fetchImages()
    return { images : images }
  },
  head () {
    return {
      title: 'Zoe Jonasson'
    }
  },
  methods: {
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
