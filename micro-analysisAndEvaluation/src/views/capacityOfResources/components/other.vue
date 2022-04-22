<template>
  <div class="situation">
    <div class="top">
      <div class="s-title">
        <span class="type">分级情况分析</span>
        <span class="goback">
          <img src="../../../assets/imgs/icon-less.png" alt="">
          <span @click="close">返回</span>
        </span>
      </div>
      <div class="echarts">
        <el-form class="form" style="display: inline-block;" :model="form" label-width="80px">
          <!-- <el-form-item>
            <el-select style="width: 130px;" v-model="form.Type">
              <el-option v-for="item in types" :key="item.name" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item> -->
        </el-form>
        <div style="height:calc(100% - 50px);" id="gradient"></div>
      </div>
    </div>
  </div>
</template>

<script>
import echartsOptions from './echartsOptions'
import { initEcharts } from '../../../js/chart/util'
export default {
  data() {
    return {
      types: [
        {name: '农村坡度', value: 0},
      ],
      totalEchart: null,
      indicatorEchart: null,
      form: {}
    }
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    data: {
      handler: function(newV) {
        if(newV.length > 0) {
          this.$nextTick(() => {
            this.initGradientEcharts(newV);
          })
        }
      },
      immediate: true
    }
  },
  mounted() {
    // this.initGradientEcharts();
  },
  methods: {
    initGradientEcharts(val) {
      let nameList = [];
      let data = [];
      val.map(item => {
        let name = item.minvar + '-' + item.maxvar;
        nameList.push(name);
        data.push(item.value);
      })
      this.$set(echartsOptions.analysisOptions.xAxis[0], 'data', nameList);
      this.$set(echartsOptions.analysisOptions.series[0], 'data', data);
      initEcharts('gradient', echartsOptions.analysisOptions)
    },
    close() {
      this.$emit('closeOther')
    }
  }
}
</script>

<style lang="less" scoped>
.situation {
  width: 479px;
  // height: 763px;
  height: 54%;
  padding: 0 20px;
	background-color: #ffffff;
	box-shadow: 0px 0px 3px 0px
		rgba(0, 0, 0, 0.25);
  border-radius: 3px;

  .echarts {
    width: 100%;
    height: calc(100% - 65px);
    text-align: right;
    .form {
      .el-form-item {
        height: 30px;
        margin-bottom: 20px;
      }
    }
  }

  .top {
    height: 100%;
  }
  .bottom {
    height: 50%;
  }
  .button {
    width: 132px;
    height: 34px;
    line-height: 8px;
    border-radius: 4px;
    float: right;
    top: 0;
    right: 0;
  }
}
</style>

<style lang="less">
.form {
  .el-form-item__content {
    height: 30px;
  }
  .el-form-item__label {
    height: 100%;
  }
  .el-input__inner {
    height: 30px;
  }
}
</style>
