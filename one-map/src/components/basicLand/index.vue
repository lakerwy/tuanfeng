<!--  -->
<template>
  <div>
    <div class="jbnt" v-show="showJbnt">
      <Dialog
        title="永久基本农田统计"
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
                ><a-select-option
                  v-for="item in years"
                  :key="item.id"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </div>
          </div>
        </template>
      </Dialog>
    </div>
    <jbnt-chart :chartOptions="chartOptions" ref="chart"></jbnt-chart>
  </div>
</template>

<script>
import Dialog from "../dialog";
import { getYjjbntData } from "@/api/statistics.js";
import JbntChart from "../charts/jbntChart";
export default {
  name: "variancePattern",
  data() {
    return {
      showJbnt: false,
      searchYear: undefined,
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
    showJbnt(val) {
      if(!val) {
        this.$refs.chart.jbntShow = false
      }
    }
  },
  components: { Dialog, JbntChart },

  created() {},

  computed: {},

  mounted() {
    this.makeYears();
  },

  methods: {
    selectType() {},
    async handleOk() {
      let params = {
        staticyear: this.searchYear
      };
      let res = await getYjjbntData(params);
      // console.log(res);
      if (res.code == 200) {
        if ( res.data.length === 0) {
          this.$message.info('暂无数据！');
          return;
        }
        let data = res.data;
        this.chartOptions = {
          title: "",
          data,
        };
      }else {
        this.chartOptions = {};
        this.$message.info(res.msg);
      }
    },
    handleCancel() {
      this.chartOptions = {}
      this.showJbnt = false;
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
.jbnt {
  position: absolute;
  top: 100px;
  left: 20px;
}
.select-wrapper {
  margin-top: 20px;
  margin-left: 20px;
  text-align: left;
}
</style>
