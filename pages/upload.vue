<template>
  <section class="section">
    <div class="container">
      <div class="field">
        <div class="label">AWS Key</div>
        <input
          v-model="awsKey"
          type="text"
          class="input"
          placeholder="AWS Key"
        >
      </div>
      <div class="field">
        <div class="label">AWS Secret</div>
        <input
          v-model="awsSecret"
          type="text"
          class="input"
          placeholder="AWS Secret"
        >
      </div>
      <button
        class="button"
        @click="saveKeys"
      >
        Save Keys
      </button>
      <div class="file has-margin-top">
        <label class="file-label">
          <input
            class="file-input"
            type="file"
            name="resume"
            @change="upload"
          >
          <span class="file-cta">
            <span class="file-label">
              {{ uploadText }}
            </span>
          </span>
        </label>
      </div>
    </div>
  </section>
</template>

<script>
import S3 from '~/services/S3'
import DynamoDB from '~/services/DynamoDB'
import GalleryImage from '~/components/GalleryImage.vue'
import GalleryHero from '~/components/GalleryHero.vue'

export default {
  components: {
    'gallery-image': GalleryImage,
    'gallery-hero': GalleryHero
  },
  data () {
    return {
      awsKey: '',
      awsSecret: '',
      isUploading: false
    }
  },
  head () {
    return {
      title: 'Upload'
    }
  },
  computed: {
    uploadText() {
      return this.isUploading ? 'Uploading...' : 'Select Image'
    }
  },
  mounted () {
    this.awsKey = window.localStorage.getItem('awsKey');
    this.awsSecret = window.localStorage.getItem('awsSecret');
  },
  methods: {
    saveKeys() {
      window.localStorage.setItem('awsKey', this.awsKey)
      window.localStorage.setItem('awsSecret', this.awsSecret)
    },
    upload(e) {
      this.isUploading = true;
      let file = e.currentTarget.files[0]
      let s3 = new S3()
      s3.upload(file, () => {
        this.isUploading = false
      })
      let dynamoDB = new DynamoDB()
      dynamoDB.saveFileData(file)
    }
  }
}
</script>

<style>
  .has-margin-top {
    margin-top: 2rem;
  }
</style>
