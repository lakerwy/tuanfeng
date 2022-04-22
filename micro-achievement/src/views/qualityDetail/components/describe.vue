<template>
  <div class="right image-text">
    <div class="pdf-con ">
      <iframe :src="pdfSrc" width="100%" height="99%" frameborder="0"></iframe>
    </div>
    <div class="map-con">
      <iframe :src="pdfSrc" width="100%" height="99%" frameborder="0"></iframe>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      pdfSrc: 'http://image.cache.timepack.cn/nodejs.pdf',
    }
  },
  components: {

  }
}
</script>

<style lang="less" scoped>
.pdf-con {
  width: 674px;
  height: 100%;
  background: #fff;
  margin-right: 16px;
  overflow-y: auto;
}
.map-con {
  width: calc(100% - 674px);
  height: 100%;
  background: #fff;
  overflow-y: auto;
}
</style>
