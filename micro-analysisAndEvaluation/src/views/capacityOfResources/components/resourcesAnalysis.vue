<template>
  <div class="situation">
    <div class="top">
      <div class="s-title">
        <span class="type">资源评价总览</span>
        <span class="goback">
          <img src="../../../assets/imgs/icon-less.png" alt="">
          <span @click="close">返回</span>
        </span>
      </div>
      <div class="echarts">
        <el-table
          :data="tableData"
          height="96%"
          border
          style="width: 100%">
          <el-table-column
            prop="definetext"
            label="分级名称">
          </el-table-column>
          <el-table-column
            prop="maxvar"
            label="分级">
            <template v-slot="scope">
              <span>{{scope.row.minvar}} - {{scope.row.maxvar}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="value"
            label="值"
            :show-overflow-tooltip="true">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="bottom">
      <div class="s-title">
        <span class="type">资源评价情况分析</span>
      </div>
      <div class="echarts">
        <!-- <el-select style="width: 130px;" v-model="form.importantType">
          <el-option v-for="item in types" :key="item.name" :label="item.name" :value="item.value"></el-option>
        </el-select> -->
        <div style="height:calc(100% - 50px);" id="farm"></div>
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
        {name: '农业耕作条件', value: 0}
      ],
      form: {},
      tableData: []
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
          this.tableData = newV;
          this.$nextTick(() => {
            this.initFarmEcharts(newV);
          })
        }
      },
      immediate: true
    }
  },
  mounted() {
    // this.initFarmEcharts();
  },
  methods: {
    initFarmEcharts(val) {
      let data = [];
      val.map(item => {
        data.push({
          name: item.definetext,
          value: item.value
        })
      })
      this.$set(echartsOptions.totalAnalysisOptions.series[0], 'data', data)
      console.log(echartsOptions.totalAnalysisOptions.series[0], 'data')
      initEcharts('farm', echartsOptions.totalAnalysisOptions)
    },
    close() {
      this.$emit('closeResA')
    }
  }
}
</script>

<style lang="less" scoped>
.situation {
  padding: 0 20px;
  width: 442px;
  // height: 763px;
  height: calc(100% - 50px);
	background-color: #ffffff;
	box-shadow: 0px 0px 3px 0px
		rgba(0, 0, 0, 0.25);
  border-radius: 3px;

  .echarts {
    width: 100%;
    height: calc(100% - 65px);
    // text-align: right;
    .form {
      .el-form-item {
        height: 30px;
        margin-bottom: 20px;
      }
    }
  }

  .top {
    height: 50%;
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
