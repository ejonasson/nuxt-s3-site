<template>
  <div class="galleryImage__wrapper">
    <div
      :id="image.Key"
      :style="imageStyle"
      class="galleryImage__image"
      @click.left="makeActive"
    />
  </div>
</template>
<script>
import S3 from '~/services/S3'

export default {
  name: 'GalleryImage',
  props: {
    image: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      imageUrl: ''
    }
  },
  computed: {
    imageStyle() {
      return {
        backgroundImage: `url(${this.image.thumbnailUrl})`
      }
    }
  },
  methods: {
    makeActive() {
      if (this.imageUrl === '') {
        const s3 = new S3()
        this.imageUrl = s3.getPublicUrl(this.image)
      }

      this.$store.commit('setActiveImage', { imageUrl: this.imageUrl })
    }
  }
}
</script>
<style>
  .galleryImage__wrapper {
    cursor: pointer;
    width: 250px;
    height: 250px;
    margin: 0 auto;
  }

  .galleryImage__image {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
  }
</style>
