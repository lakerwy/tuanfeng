<template>
  <div class="situation">
    <!-- <div class="top">
      <div class="s-title">
        <span class="type">资源环境承载力总体情况分析</span>
        <span class="goback">
          <img src="../../../assets/imgs/icon-less.png" alt="">
          <span>返回</span>
        </span>
      </div>
      <div class="echarts" id="total"></div>
    </div> -->
    <!-- <el-form class="form" style="display: inline-block;" :model="form" label-width="80px">
        <el-form-item label="纬度">
          <el-select style="width: 130px;" v-model="form.importantType" @change="regionChange">
            <el-option v-for="item in types" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
      </el-form> -->
    <!-- <div style="height:calc(100% - 50px);" id="total"></div> -->
    <div class="bottom">
      <div class="s-title">
        <span class="type">资源环境承载力各指标情况分析</span>
      </div>
      <div class="echarts">
        <el-form
          class="form"
          style="display: inline-block;"
          :model="form"
          label-width="80px"
        >
          <el-form-item label="维度">
            <el-select
              style="width: 130px;"
              v-model="form.importantType"
              @change="typeChange"
            >
              <el-option
                v-for="item in types"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div style="height:calc(100% - 50px);" id="indicator"></div>
      </div>
      <!-- <div>
        暂无数据
      </div> -->
    </div>
    <el-button class="button" type="primary" @click="showData"
      >查看数据列表</el-button
    >

    <!-- 查看数据列表 -->
    <el-dialog
      class="data-dialog"
      :visible.sync="dialogTableVisible"
      width="57%"
      top="10%"
      :show-close="false"
    >
      <div slot="title" class="dialog-title s-title">
        <span class="type">{{ regionName }}{{ analysName }}列表</span>
        <span class="goback" @click="dialogTableVisible = false">
          <img src="../../../assets/imgs/icon-less.png" alt="" />
          <span>返回</span>
        </span>
      </div>
      <el-table :data="gridData" width="100%" height="494px" border>
        <el-table-column prop="qhname" label="行政区"></el-table-column>
        <el-table-column
          v-for="item in types"
          :key="item.value"
          :prop="item.value"
          :label="`${item.name}（${item.unit}）`"
        ></el-table-column>
        <!-- <el-table-column property="mostImportant" label="极重要面积（平方千米）"></el-table-column>
        <el-table-column property="mostProportion" label="极重要比量"></el-table-column>
        <el-table-column property="lessImportant" label="一般重要面积（平方千米）"></el-table-column>
        <el-table-column property="lessProportion" label="一般重要比重"></el-table-column>
        <el-table-column property="important" label="重要面积（平方千米）"></el-table-column>
        <el-table-column property="proportion" label="重要比重"></el-table-column> -->
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="exportData">导出数据</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Csv from "../../../js/utils/csv";
import ExportCsv from "../../../js/utils/export-csv";
import echartsOptions from "./echartsOptions";
import { initEcharts } from "../../../js/chart/util";
import { getRegions } from "../../../js/map/region";
import chartType from "./dict";
export default {
  data() {
    return {
      regionOptions: [],
      gridData: [],
      types: chartType.chartType.townwaterResouce,
      totalEchart: null,
      indicatorEchart: null,
      form: { importantType: "czkysl" },
      dialogTableVisible: false,
      unit: "亿立方米",
      name: ""
    };
  },
  created() {
    this.initRegion();
  },
  mounted() {
    // this.initTotalEcharts();
    // this.initIndicatorEcharts();
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    analysName: {
      type: String,
      default: ""
    },
    regionName: {
      type: String,
      default: "团风县"
    }
  },
  watch: {
    data: {
      handler: function(newV) {
        if (newV.length > 0) {
          this.data = newV;
          this.typeChange(this.types[0].value);
        } else if (newV.length === 0) {
          this.initIndicatorEcharts(newV);
        }
      },
      immediate: true
    },
    analysName: {
      handler: function(newV) {
        if (newV) {
          switch (newV) {
            case "城镇水资源承载规模":
              this.types = chartType.chartType.townwaterResouce;
              this.form.importantType = this.types[0].value;
              break;
            case "城镇土地资源承载规模":
              this.types = chartType.chartType.townland;
              this.form.importantType = this.types[0].value;
              break;
            case "农业水资源承载规模":
              this.types = chartType.chartType.agriculturewaterResouce;
              this.form.importantType = this.types[0].value;
              break;
            case "农业土地资源承载规模":
              this.types = chartType.chartType.agricultureland;
              this.form.importantType = this.types[0].value;
              break;
            default:
              break;
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    async initRegion() {
      // 加载行政区划列表
      let districts = window.globalUrl.districts;
      let town = await getRegions(districts.town.url, districts.town.id);
      let country = await getRegions(districts.county.url, districts.county.id);
      this.regionOptions = country.concat(town);
      this.form.region = this.regionOptions[0].code;
    },
    initTotalEcharts(val) {
      // 加载总体分析图表
      let xian = this.data[0];
      let data = [
        { name: "农业用水量", value: xian.nyysl, unit: "亿立方米" },
        { name: "农业灌溉水有效利用系数", value: xian.ntggsyxlyxs, unit: "" },
        {
          name: "亩均耕地灌溉用水量",
          value: xian.mjgdggysl,
          unit: "立方米/亩"
        },
        {
          name: "可承载耕地规模合计",
          value: xian.kczgdgmPfqm,
          unit: "平方千米"
        },
        { name: "可承载耕地规模合计", value: xian.kczgdgmWm, unit: "万亩" },
        {
          name: "可承载耕地规模灌溉耕地面积",
          value: xian.kczgdgmGggdmj,
          unit: "平方千米"
        },
        {
          name: "可承载耕地规模雨养耕地面积",
          value: xian.kczgdgmYygdmj,
          unit: "平方千米"
        },
        { name: "现状耕地面积", value: xian.xzgdmjPfqm, unit: "平方千米" },
        { name: "现状耕地面积", value: xian.zxgdmjWm, unit: "万亩" }
      ];
      this.$set(echartsOptions.totalAnalysisOptions.series[0], "data", data);
      initEcharts("total", echartsOptions.totalAnalysisOptions);
    },
    initIndicatorEcharts(val) {
      // 加载各指标分析图表
      let nameList = [];
      let data = [];
      let type = this.form.importantType;
      val.map(item => {
        nameList.push(item.qhname);
        data.push(item[type]);
      });
      // console.log(data, "serie");
      this.$set(
        echartsOptions.indicatorAnalysisOptions.xAxis[0],
        "data",
        nameList
      );
      this.$set(
        echartsOptions.indicatorAnalysisOptions.yAxis,
        "name",
        this.unit
      );
      this.$set(
        echartsOptions.indicatorAnalysisOptions.series[0],
        "data",
        data
      );
      this.$set(
        echartsOptions.indicatorAnalysisOptions.series[0],
        "name",
        this.name
      );
      initEcharts("indicator", echartsOptions.indicatorAnalysisOptions);
    },
    regionChange(val) {
      // 切换行政区
    },
    typeChange(val) {
      // 切换纬度
      this.unit = this.types.filter(item => {
        return item.value === val;
      })[0].unit;
      this.name = this.types.filter(item => {
        return item.value === val;
      })[0].name;
      this.$nextTick(() => {
        // console.log(this.data, "data");
        this.initIndicatorEcharts(this.data);
      });
    },
    showData() {
      // 查看数据列表
      this.dialogTableVisible = true;
      this.gridData = this.data;
    },
    exportData() {
      const params = {
        filename: "资源环境承载力各指标情况分析"
      };
      // 导出数据
      if (params.filename) {
        if (params.filename.indexOf(".csv") === -1) {
          params.filename += ".csv";
        }
      } else {
        params.filename = "table.csv";
      }

      let columns = [];
      let datas = [];
      if (params.columns && params.data) {
        columns = params.columns;
        datas = params.data;
      } else {
        columns = this.allColumns;
        if (!("original" in params)) params.original = true;
        datas = params.original ? this.data : this.rebuildData;
      }

      let noHeader = false;
      if ("noHeader" in params) noHeader = params.noHeader;
      let downcolumns = [];
      downcolumns = [{ name: "行政区", value: "qhname" }].concat(this.types);
      console.log(this.types, downcolumns);
      const data = Csv(downcolumns, this.gridData, params, noHeader);
      if (params.callback) params.callback(data);
      else ExportCsv.download(params.filename, data);
    }
  }
};
</script>

<style lang="less" scoped>
.situation {
  width: 442px;
  // height: 763px;
  // height: calc(100% - 30px);
  height: 420px;
  padding: 0 20px;
  background-color: #ffffff;
  box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.25);
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
    height: 40%;
  }
  .bottom {
    // height: 50%;
    height: 90%;
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

  .s-title {
    height: 30px;
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
.data-dialog {
  .el-dialog__body {
    padding: 12px 20px;
  }
}
</style>
