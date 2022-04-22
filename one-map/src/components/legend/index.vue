<template>
  <div class="legend">
    <div class="s-title">
      <span class="type">图例</span>
    </div>
    <div :style="{'maxHeight': maxHeight ? maxHeight + 'px' : 'auto'}" style="overflow-y: scroll;">
      <div class="item" v-for="item in lists" :key="item.color">
        <div class="box" v-if="type === 'box'" :style="{'background': item.color}"></div>
        <img class="img" v-if="type === 'img'" :src="'data:'+item.contentType+ ';base64,' +item.imageData" alt="">
        <span :title="item.label">{{item.label}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  props: {
    lists: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: 'box'
    },
    maxHeight: {
      // 如果需要为当前的legend的加上最大高度
      type: Number
    },
    // regions: {
    //   type: Array,
    //   default: () => []
    // }
  },
  watch: {
    lists: {
      handler: (newV) => {
        // console.log(newV, 'lists')
        return newV
      }
    }
  },
  methods: {
    // regionFormatter(val) {
    //   // 行政区格式化
    //   if(this.regions.length > 0) {
    //     let regions = this.regions;
    //     let res = regions.filter(item => {
    //       return item.code == val
    //     })
    //     return res.length > 0 ? res[0].name : val;
    //   } else {
    //     return val
    //   }
    // },
  }
}
</script>

<style lang="less" scoped>
.legend {
  width: 180px;
  // height: 200px;
  background: #fff;
  padding-bottom: 10px;
  .s-title {
    border-bottom: solid 1px #e8e8e8;
    height: 35px;
    line-height: 35px;
    width: auto;
  }
  .item {
    height: 30px;
    // text-align: center;
    .box {
      width: 20px;
      height: 20px;
      border-radius: 2px;
      display: inline-block;
      margin-left: 20px;
    }
    .img {
      margin-left: 20px;
      vertical-align: super;
    }
    span {
      display: inline-block;
      width: calc(100% - 54px);
      font-size: 12px;
      line-height: 30px;
      color: #454954;
      margin-left: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
