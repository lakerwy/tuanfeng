<template>
  <div class="layer-box">
    <div class="top">
      <div class="s-title">
        <span class="type">图层</span>
      </div>
      <el-radio-group class="group" v-model="radio" @change="changeLayer">
        <el-radio style="width: 100%;" v-for="item in layers" :key="item.id" :label="item.id">{{item.name}}</el-radio>
      </el-radio-group>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      radio: 0
    }
  },
  props: {
    layers: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    layers: {
      handler: function(newV) {
        if(newV.length > 0) {
          this.changeLayer(newV[0].id)
        }
      },
      // immediate: true
    }
  },
  methods: {
    changeLayer(val) {
      // 切换图层
      // debugger
      this.radio = val;
      this.$emit('changeLayer', val)
    },
  }
}
</script>

<style lang="less" scoped>
.layer-box {
  width: 322px;
  // height: 399px;
  height: 50%;
  padding-left: 20px;
	background-color: #ffffff;
	box-shadow: 0px 0px 3px 0px
		rgba(0, 0, 0, 0.25);
  border-radius: 3px;
  .top {
    height: 100%;
    width: 100%;
  }
  .group {
    width: 100%;
    height: calc(100% - 65px);
    overflow-y: auto;
    // display: flex;
    // flex-direction: column;
    // justify-content: space-evenly;
    // align-items: center;
  }
  .el-radio {
    margin-right: 0;
    height: 40px;
  }
}
</style>
