<template>
  <div class="galleryImage__wrapper">
    <div
      :id="imageId"
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
    imageId: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    thumbnailUrl: {
      type: String,
      default: ''
    }
  },
  computed: {
    imageStyle() {
      return {
        backgroundImage: this.thumbnailUrl !== '' ? `url(${this.thumbnailUrl})` : `url(${this.imageUrl})`
      }
    }
  },
  methods: {
    makeActive() {
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
    margin-left: 15px;
    margin-bottom: 15px;
  }

  .galleryImage__image {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
  }
</style>
