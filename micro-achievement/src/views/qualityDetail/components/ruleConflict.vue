<template>
  <div class="right image-text">
    <div class="pdf-con ">
      <my-map :id="'conflict'" :isAudit="false" />
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
      pdfSrc: 'http://image.cache.timepack.cn/nodejs.pdf',
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
  // overflow-y: auto;
  position: relative;
}
.map-con {
  width: calc(100% - 674px);
  height: 100%;
  background: #fff;
  position: relative;
}
</style>
