<!--  -->
<template>
  <div>
    <div class="sthx" v-show="showSthx">
      <Dialog
        title="生态保护红线统计"
        @handleOk="handleOk"
        @handleCancel="handleCancel"
      >
        <template v-slot:content>
          <div class="content">
            <div class="select-wrapper">
              <span style="line-height: 30px; padding-right: 8px">年份:</span>
              <a-select
                v-model="searchYear"
                placeholder="请选择年份"
                style="width: 200px"
                @change="selectYear"
                ><a-select-option
                  v-for="item in years"
                  :key="item.id"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </div>
            <div class="select-wrapper">
              <span style="line-height: 30px; padding-right: 8px">类型:</span>
              <a-select style="width: 202px" v-model="searchType">
                <a-select-option value="">
                  全部
                </a-select-option>
                <a-select-option v-for="item in options" :key="item.hxdm" :value="item.hxmc">
                  {{item.hxmc}}
                </a-select-option>
              </a-select>
              <!-- <a-cascader
                change-on-select
                v-model="searchType"
                :options="options"
                placeholder="请选择类型"
                @change="selectType"
                style="width: 200px"
              /> -->
            </div>
          </div>
        </template>
      </Dialog>
    </div>
    <sthx-chart :chartOptions="chartOptions" ref="chart"></sthx-chart>
  </div>
</template>

<script>
import Dialog from "../dialog";
import qs from "qs";
import axios from 'axios'
import {
  getStbhhxType,
  getStbhhxData,
  getTgcgcyData,
} from "@/api/statistics.js";
import SthxChart from "../charts/sthxChart";
export default {
  name: "",
  data() {
    return {
      showSthx: false,
      searchYear: undefined,
      searchType: undefined,
      options: [],
      years: [],
      chartOptions: {},
    };
  },

  props: ["map"],
  watch: {
    map(val) {
      if (val) {
        this.map = val;
      }
    },
    showSthx(val) {
      if(!val) {
        this.$refs.chart.show = false
      }
    }
  },
  components: { Dialog, SthxChart },

  created() {},

  computed: {},

  async mounted() {
    this.makeYears();
    this.getStbhhxType();
  },

  methods: {
    selectYear() {},
    selectType() {},
    async handleOk() {
      let params = {
        year: this.searchYear + "",
        hxlx: this.searchType,
        // hxyjl: this.searchType && this.searchType[this.searchType.length - 1],
        // jsonCallBack: "?",
      };
      //let body = qs.stringify(params);
      let res = await getStbhhxData(params);
      if (res.code == 200) {
        if ( res.data.length === 0) {
          this.$message.info('暂无数据！');
          return;
        }
        let chartData = res.data;
        this.chartOptions = {
          title: this.searchType,
          data: chartData,
        };
      }else {
        this.$message.error(res.msg);
      }
    },
    handleCancel() {
      this.chartOptions = {};
      (this.searchType = undefined), (this.showSthx = false);
    },
    // 获取生态红线统计类型
    async getStbhhxType() {
      let data = await getStbhhxType();
      // console.log(8888, data);
      if (data.code == 200) {
        // let keys = Object.keys(data.data);
        // let arr = [];
        // keys.forEach((i, j) => {
        //   let children = [];
        //   let arr1 = data.data[i];
        //   if (Array.isArray(arr1)) {
        //     arr1.forEach((a, b) => {
        //       children.push({
        //         label: a,
        //         value: a,
        //       });
        //     });
        //   } else {
        //     children.push({
        //       label: arr1,
        //       value: arr1,
        //     });
        //   }
        //   arr.push({
        //     label: i,
        //     value: i,
        //     children,
        //   });
        // });
        this.options = data.data;
      }
      console.log(this.options)
    },
    // 生成年份
    makeYears() {
      let date = new Date();
      let nowYear = date.getFullYear();
      this.searchYear = nowYear;
      let oldYear = nowYear - 10;
      let arr = [];
      for (let i = nowYear; i <= nowYear && i >= oldYear; i--) {
        arr.push({
          id: i,
          value: i,
          label: i + "",
        });
      }
      this.years = arr;
    },
  },
};
</script>
<style lang='less' scoped>
.sthx {
  position: absolute;
  top: 100px;
  left: 20px;
}
.select-wrapper {
  margin-top: 20px;
  margin-left: 20px;
  text-align: left;
}
/deep/.ant-cascader-menus {
  width: 200px !important;
}
</style>
