<template>
  <div
    class="GalleryImage__hero"
    @click.left="clearActiveImage"
  >
    <i
      v-show="!isFirst"
      class="nav-icon nav-icon--left fa fa-angle-left fa-4x"
      @click.stop="cycleBack"
    />
    <img
      :src="activeImage"
      class="GalleryImage__heroImage"
    >
    <i
      v-show="!isLast"
      class="nav-icon nav-icon--right fa fa-angle-right fa-4x"
      @click.stop="cycleForward"
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
      },
      index () {
        return this.$store.getters.activeImageIndex
      },
      isFirst() {
        return this.index === 0
      },
      isLast() {
        return this.index === ( this.$store.state.images.length - 1)
      }
    },
    methods: {
      clearActiveImage () {
        this.$store.commit('clearActiveImage')
        window.history.pushState('','', `/`)
      },
      cycleBack () {
        const image = this.$store.state.images[this.index - 1]
        this.$store.commit('setActiveImage', { image })
        window.history.pushState('','', `/${image.id}`)
      },
      cycleForward () {
        const image = this.$store.state.images[this.index + 1]
        this.$store.commit('setActiveImage', { image })
        window.history.pushState('','', `/${image.id}`)
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
    max-width: 80%;
    max-height: 80%;
  }

  .nav-icon {
    cursor: pointer;
    color: rgba(255, 255, 255, 0.4);
    margin-right: 1rem;
    margin-left: 1rem;
  }

</style>
