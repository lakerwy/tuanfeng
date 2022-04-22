<!--
 * @Author: 任继民
 * @Date: 2020-12-14 17:20:09
 * @LastEditors: 任继民
 * @LastEditTime: 2021-05-18 19:31:51
 * @Description:指标评估
-->
<template>
  <div class="index-eval">
    <section class="time">
      <a-form layout="inline" :form="pageInfo">
        <a-form-item label="年份">
          <a-select v-model="pageInfo.year" style="width: 150px" placeholder="请选择年份">
            <a-select-option :value="yearlist - index" v-for="(item,index) in 20" :key="index">
              {{yearlist - index}}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </section>
    <section class="indexeval-content">
      <section class="Index-tree">
        <div class="indextree-title">指标监测及分析</div>
        <DataTree
          :defaultProps="defaultProps"
          :expandedKeys="expandedKeys"
          :data="treeData"
          @treeSelect="treeSelect"
        ></DataTree>
      </section>
      <section class="report-data">
        <div class="report-title">
          <h3>指标监测及分析报告</h3>
          <a :href="downloadUrl">下载报告</a>
        </div>
        <div class="showdoc">
          <iframe :src="iframeUrl" width="100%" height="99%" frameborder="0"></iframe>
          <!-- <div  width="100%" height="99%" v-html="docxhtml"></div> -->
        </div>
      </section>
      <section class="tablechart">
        <section class="table-data">
          <!-- <section class="tabl-title">
            <div class="tablelist">
              <div v-for="(item,index) in tablist" :key="index" :class="{tabactive: currentIndex===index}" @click="changeTab(index)">{{item}}</div>
            </div>
            <a-button class="sureBtn">
              确认分析报告
            </a-button>
          </section> -->
          <section class="table-content">
            <div class="ttitle">{{pageInfo.year}}年{{currentTitle}}表</div>
            <a-table
              :columns="columns"
              :data-source="tableData"
              :pagination="false"
              :scroll="{ y: 240 }"
              bordered
            >
              <template slot="rate" slot-scope="text, record">
                <span>{{record.rate? (record.rate*100).toFixed(2): 0}}%</span>
              </template>
            </a-table>
          </section>
        </section>
        <section class="chart-data">
          <div class="chartTitle">{{currentTitle}}</div>
          <section class="chart-content">
            <div id="changeAreaChart" class="changeAreaChart"></div>
          </section>
        </section>
      </section>
    </section>

  </div>
</template>
<script>
const columns = [
  {
    title: '行政区名称',
    dataIndex: 'arcname',
  },
  {
    title: '目标值',
    dataIndex: 'tvalue',
  },
  {
    title: '监测值',
    dataIndex: 'mvalue',
  },
  {
    title: '完成率',
    dataIndex: 'rate',
    scopedSlots: { customRender: 'rate' },
  },
];
import mammoth from 'mammoth';
import DataTree from './tree';
import { initEcharts } from '@/libs/chart';
import echartsOptions from './echartOption';
import { getEvaluationTree, getEvaluationIndexByTree } from '@/api/periodicEvaluation';
import { setTreeData } from '@/libs/libs'
export default {
  components: {
    DataTree
  },
  data: () => ({
    defaultProps: {
      children: 'children',
      title: 'name',
      // key: "code"
    },
    yearlist: (new Date).getFullYear(),
    pageInfo: {
      adCode: '',
      year: (new Date).getFullYear(),
    },
    currentTitle: '生态保护红线内建设用地面积变化统计',
    expandedKeys: [],
    iframeUrl: '',
    downloadUrl: '',
    docxhtml: '',
    tablist: ['统计分析','空间表达'],
    currentIndex:0,
    treeData: [],
    tableData: [],
    columns,
  }),
  mounted() {
    this.initChart();
    this.initData();
  },
  methods: {
    initChart() {
      initEcharts('changeAreaChart',echartsOptions.areaChangeOptions);
    },
    async initData() {
      let res = await getEvaluationTree();
      const { code, data } = res;
      if (code===200) {
        this.treeData = this.setTreeData(data,'pid');
        console.log(this.treeData)
        this.$nextTick(() => {
          this.expandedKeys = ['0-0', '0-0-0', '0-0-0-0'];
        })
      }
    },
    async treeSelect(item) {
      if (item.children) return;
      let params = {
        kpiid: item.kpiid,
        year: this.pageInfo.year
      };
      let res = await getEvaluationIndexByTree(params)
      const { code, data } = res;
      if (code === 200) {
        this.tableData = data.list;
        this.iframeUrl = `https://view.officeapps.live.com/op/view.aspx?src=${window.globalUrl.DYNAMIC_URL}/${data.reportPath}`
        this.downloadUrl = `'${window.globalUrl.DYNAMIC_URL}/${data.reportPath}`
        // this.convertToHtml(`${window.globalUrl.DYNAMIC_URL}/${data.reportPath}`)
        let xName = [], sData = [];
        data.changes.forEach(item => {
          this.currentTitle = item.kpiname;
          xName.push(item.arcname);
          sData.push(item.mvalue)
        });
        this.$set(echartsOptions.areaChangeOptions.xAxis[0], 'data', xName)
        this.$set(echartsOptions.areaChangeOptions.series[0], 'data', sData)
        this.$nextTick(() => {
          this.initChart();
        })
      }
    },
    convertToHtml(url) {
      mammoth.convertToHtml({path: url})
      .then(function(result){
        this.docxhtml = result.value; // The generated HTML
        // var messages = result.messages; // Any messages, such as warnings during conversion
      })
      .done();
    },
    setTreeData(arr,pid) {
      // 删除所有 children,以防止多次调用
      arr.forEach(function (item) {
        delete item.children;
      });
      let map = {}; // 构建map
      arr.forEach((i) => {
        map[i.id] = i; // 构建以area_id为键 当前数据为值
      });

      let treeData = [];
      arr.forEach((child) => {

        const mapItem = map[child[pid]]; // 判断当前数据的pid是否存在map中

        if (mapItem) { // 存在则表示当前数据不是最顶层数据
          // 注意: 这里的map中的数据是引用了arr的它的指向还是arr，当mapItem改变时arr也会改变,踩坑点
          (mapItem.children || (mapItem.children = [])).push(child); // 这里判断mapItem中是否存在children, 存在则插入当前数据, 不存在则赋值children为[]然后再插入当前数据
        } else { // 不存在则是组顶层数据
          treeData.push(child);
        }
      });

      return treeData;
    },
    changeTab(index) {
      this.currentIndex = index;
    },
    downloadDocx() {
      window.open(this.downloadUrl)
    }
  },
}
</script>
<style lang="scss" scoped>
@import '../../../assets/styles/common.scss';
.index-eval {
  .time {
    background: #ffffff;
    padding: 10px 0 10px 30px;
  }
  .indexeval-content {
    display: flex;
    .Index-tree {
      width: 364px;
      height: calc(100vh - 200px);
      background-color: #ffffff;
      .indextree-title {
        font-size: 18px;
        font-weight: bold;
        color: #454954;
        line-height: 18px;
        border-bottom: 1px solid #e8e8e8;
        padding: 21px 0 18px 21px;
      }
      .itemTree {
        padding: 0 0 0 18px;
        width: 364px;
        height: calc(100% - 58px);
      }
    }
    .report-data {
      margin-left: 16px;
      .report-title {
        width: 724px;
        height: 66px;
        background-color: #ffffff;
        box-shadow: 0px 3px 4px 0px
          rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
        h3 {
          font-size: 16px;
          font-weight: bold;
          color: #454954;
          padding-left: 19px;
        }
        button {
          margin-right: 16px;
        }
      }
      .showdoc {
        width: 724px;
        height: 760px;
        iframe {
          width: 100%;
          height: 100%;
        }
      }
    }
    .tablechart {
      margin-left: 16px;
      .table-data {
        /* width: 716px; */
        height: 444px;
        background-color: #ffffff;
        .tabl-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 50px;
          .tablelist {
            display: flex;
            margin-left: 10px;
            div {
              padding: 18px 11px;
              color: #454954;
              font-weight: bold;
              font-size: 16px;
              line-height: 16px;
              border-bottom: 2px solid rgba(0, 0, 0, 0);
            }
            div:hover, .tabactive {
              border-bottom: 2px solid #1890ff;
            }
          }
          .sureBtn {
            margin-right: 20px;
          }
        }
        .table-content {
          .ttitle {
            font-size: 16px;
            font-weight: bold;
            color: #454954;
            padding: 15px 0 15px 21px;
          }
          .ant-table-wrapper {
            padding: 0 21px;
          }
        }
      }
      .chart-data {
        background-color: #ffffff;
        margin-top: 16px;
        .chartTitle {
          font-size: 16px;
          font-weight: bold;
          color: #454954;
          padding: 21px;
        }
        .chart-content {
          .changeAreaChart {
            height: 235px;
          }
        }
      }
    }
  }

}
</style>
