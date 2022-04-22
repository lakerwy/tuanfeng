<template>
  <div class="right image-text">
    <div class="pdf-con ">
      <iframe :src="pdfSrc" width="100%" height="99%" frameborder="0"></iframe>
    </div>
  </div>
</template>

<script>
export default {
  props: ["pdfSrc"],
  data() {
    return {};
  },
  components: {}
};
</script>

<style lang="less" scoped>
.pdf-con {
  width: 100%;
  height: 100%;
  background: #fff;
}
</style>
