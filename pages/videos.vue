<template>
  <section class="section">
    <div class="container">
      <div class="columns is-centered">
        <div class="column button-column is-narrow">
          <a
            class="button"
            href="/"
          >
            Pictures
          </a>
          <a
            class="button"
            href="/videos"
            disabled
          >
            Videos
          </a>
        </div>
      </div>
    </div>
    <div class="container">
      <p class="bottom-spacing">
        Below is an embedded playlist of Zoe's videos. Newer videos will be first on the playlist.
      </p>
      <div class="embed-container">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube-nocookie.com/embed/videoseries?list=PLgjhLOlS9AzPqFHALIWlpSj8L2Cx2JVUJ"
          frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        />
      </div>
    </div>
  </section>
</template>

<script>
export default {

}
</script>

<style>
    .bottom-spacing {
        margin-bottom: 10px;
    }
    .embed-container {
        position: relative;
        padding-bottom: 56.25%;
        height: 0;
        overflow: hidden;
        max-width: 100%;
    }
    .embed-container iframe, .embed-container object, .embed-container embed {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>
