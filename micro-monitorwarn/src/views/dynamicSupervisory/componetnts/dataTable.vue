<!--
 * @Author: 任继民
 * @Date: 2020-12-09 14:29:27
 * @LastEditors: 任继民
 * @LastEditTime: 2021-06-22 16:17:05
 * @Description:
-->
<template>
  <div class="dataTable">
    <section class="title">
      <div class="text">指标概览</div>
      <div class="actionbtn">
        <a-input-search
          placeholder="请输入关键字"
          v-model="searchValue"
          enter-button="查询"
          @search="onSearch"
        />
        <a-button type="primary" @click="exportData">
          导出报告
        </a-button>
        <!-- <a-button type="primary">
          我的监测
        </a-button> -->
      </div>
    </section>
    <section>
      <a-table :columns="columns" :customRow="rowClick" :pagination="false" :data-source="tableData" bordered :scroll="{y: 276 }">
        <template slot="name" slot-scope="text">
          <a>{{ text }}</a>
        </template>
        <template slot="isHealth" slot-scope="isHealth">
          <a-tag :color="isHealth==2?'#eda169':'#87d068'">
            {{ isHealth == 2 ? '预警' : '健康' }}
          </a-tag>
        </template>
        <template slot="operation">
          <span>说明</span>
          <span>图谱</span>
        </template>
      </a-table>
    </section>
  </div>
</template>
<script>
const columns = [
  {
    title: '监测指标',
    width: '280px',
    dataIndex: 'kpiname',
    scopedSlots: { customRender: 'name' },
  },
  {
    title: '预警类型',
    dataIndex: 'isHealth',
    scopedSlots: { customRender: 'isHealth' },
  },
  {
    title: '监测值',
    dataIndex: 'mvalue',
  },
  {
    title: '规划目标值',
    dataIndex: 'targetValue',
  },
  {
    title: '单位',
    dataIndex: 'unit',
  },
  {
    title: '指标属性',
    dataIndex: 'itemtype',
  },
  // {
  //   title: '操作',
  //   dataIndex: 'operation',
  //   scopedSlots: { customRender: 'operation' },
  // },
];
import Csv from '@/libs/csv';
import ExportCsv from '@/libs/export-csv';
export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    boxData: {
      type: Object,
      default: () => {
        name: '指标总数'
        num: '107'
      }
    }
  },
  data: () => ({
    columns,
    searchValue: ''
  }),
  methods: {
    exportData() {
      const params = {
        filename: '指标概览'
      }
      // 导出数据
      if (params.filename) {
        if (params.filename.indexOf('.csv') === -1) {
          params.filename += '.csv';
        }
      } else {
        params.filename = 'table.csv';
      }

      let tempcolumns = [];
      let datas = [];
      if (params.columns && params.data) {
        tempcolumns = params.columns;
        datas = params.data;
      } else {
        tempcolumns = columns;
        if (!('original' in params)) params.original = true;
        datas = params.original ? this.data : this.rebuildData;
      }

      let noHeader = false;
      if ('noHeader' in params) noHeader = params.noHeader;

      const data = Csv(columns, this.tableData, params, noHeader);
      if (params.callback) params.callback(data);
      else ExportCsv.download(params.filename, data);
    },
    // 表格行的点击事件
    rowClick(record, index) {
      return {
        on: {
          click: () => {
            this.$router.push({name: 'singleIndex',params:{kpiName:record}});
          },
        },
      };
    },

    onSearch() {
      this.$emit('onSearch',this.searchValue)
    }
  },
}
</script>
<style lang="scss" scoped>
.dataTable {
  border-radius: 4px;
  /* width: calc(100vw - 800px); */
  height: 420px;
  background-color: #ffffff;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    background-color: #ffffff;
    padding: 0 20px;
    .text {
      font-size: 18px;
      font-weight: bold;
      color: #454954;
    }
    .actionbtn {
      display: flex;
      align-items: center;
      .ant-input-search{
        margin-right: 20px;
      }
      button:last-child {
        margin-left: 10px;
      }
    }
  }
}
</style>
