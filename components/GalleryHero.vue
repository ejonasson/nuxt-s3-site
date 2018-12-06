<template>
  <div
    class="GalleryImage__hero"
    @click.left="clearActiveImage"
  >
    <div
      :style="imageStyle"
      class="GalleryImage__heroImage"

    />
  </div>
</template>
<script>
  export default {
    name: 'GalleryHero',
    computed: {
      activeImage () {
        return this.$store.state.activeImage
      },
      imageStyle() {
      return {
        backgroundImage: `url(${this.activeImage})`
      }
    }
    },
    methods: {
      clearActiveImage () {
        this.$store.commit('clearActiveImage')
      }
    }
  }
</script>

<style>
  .GalleryImage__hero {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgb(0, 0, 0, 0.4);
    cursor: pointer;
  }

  .GalleryImage__heroImage {
    width: 80%;
    height: 80%;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
  }
</style>
