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
      this.$store.commit('setActiveImage', { image: this.image })
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

  @media only screen and (max-width: 750px) {
    .galleryImage__wrapper {
      width: 100%;
    }
  }

  .galleryImage__image {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
  }
</style>
