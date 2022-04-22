<template>
  <div class="tool-container">
    <div @click="zoomIn">放大</div>
    <div @click="zoomOut">缩小</div>
    <div @click="home">重置</div>
    <div @click="showOutline"><span v-if="outlineVisible">✔</span>缩略图</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      outlineVisible: true
    };
  },
  methods: {
    zoomIn() {
      this.$parent.graph.graph.zoomIn();
    },
    zoomOut() {
      this.$parent.graph.graph.zoomOut();
    },
    home() {
      this.$parent.graph.setDefaultLayout();
    },
    showOutline() {
      this.outlineVisible = !this.outlineVisible;
      let contaienr = this.$parent.graph.outlineContainer;
      if (contaienr) {
        let display = contaienr.style.display;
        if (display === "none") {
          contaienr.style.display = "unset";
        } else {
          contaienr.style.display = "none";
        }
      }
    }
  }
};
</script>

<style lang="less">
.tool-container {
  display: inline-flex;
  > * {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    transition: 0.1s;
    font-weight: 500;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 4px;
    &:hover {
      color: #409eff;
      border-color: #c6e2ff;
      background-color: #ecf5ff;
    }
    > span {
      margin-right: 5px;
    }
  }
}
</style>
