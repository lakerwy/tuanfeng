<template>
  <div class="right image-text">
    <div class="pdf-con ">
      <iframe :src="pdfSrc" width="100%" height="99%" frameborder="0"></iframe>
    </div>
    <div class="map-con">
      <my-map :id="'image-text'" :isAudit="false" />
    </div>
  </div>
</template>


<script>
import myMap  from '../../../components/map/index'
export default {
  data() {
    return {
      pdfSrc: '',
      // pdfSrc: 'http://image.cache.timepack.cn/nodejs.pdf',
    }
  },
  components: {
    myMap
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
  position: relative;
}
</style>
