<!--
 * @Author: 任继民
 * @Date: 2020-11-13 17:26:49
 * @LastEditors: 任继民
 * @LastEditTime: 2020-11-14 13:21:48
 * @Description:
-->
<template>
  <div class="chart-data">
    <section class="title">
      <div class="text">评价时间：2020年11月09日</div>
      <div class="btn">
        <a-button type="primary">
          启动分析
        </a-button>
        <a-button type="primary">
          导出报告
        </a-button>
      </div>
    </section>
    <section class="data-table">
      <div class="table-title">生态保护红线预警情况</div>
      <a-table :columns="columns" :data-source="data" bordered :pagination="false">
        <template slot="name" slot-scope="text">
          <div class="customText warning">
            <i class="tag"></i>
            <span>{{text}}</span>
          </div>
        </template>
      </a-table>
    </section>
    <section class="data-chart">
      <div class="chart-title">
        <div class="text-title">城镇建设承载规模</div>
        <div class="select-title">
          <label class="select-label">维度:</label>
          <a-select default-value="现状城镇建设用" style="width: 120px" @change="handleChange">
            <a-select-option value="现状城镇建设用">
              现状城镇建设用
            </a-select-option>
            <a-select-option value="城镇建设用">
              城镇建设用
            </a-select-option>
          </a-select>
        </div>
      </div>
      <BarChart />
    </section>
  </div>
</template>
<script>
const columns = [
  {
    title: '行政区',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' },
  },
  {
    title: '预警等级',
    className: 'column-money',
    dataIndex: 'name1',
    scopedSlots: { customRender: 'name' },
  },
  {
    title: '超载情况',
    dataIndex: 'name2',
    className: 'column-money',
  },
  {
    title: '现状城镇建设用地面积',
    className: 'column-money',
    dataIndex: 'name3',
    scopedSlots: { customRender: 'name' },
  }
];

const data = [
  {
    key: '1',
    name: '团风县',
    name1: '预警',
    name2:'超载',
    name3: '健康',
    name4: '健康'
  },
  {
    key: '1',
    name: '团风县',
    name1: '预警',
    name2:'超载',
    name3: '健康',
    name4: '健康'
  },  {
    key: '1',
    name: '团风县',
    name1: '预警',
    name2:'超载',
    name3: '健康',
    name4: '健康'
  },  {
    key: '1',
    name: '团风县',
    name1: '预警',
    name2:'超载',
    name3: '健康',
    name4: '健康'
  },
  {
    key: '1',
    name: '团风县',
    name1: '预警',
    name2:'超载',
    name3: '健康',
    name4: '健康'
  },  {
    key: '1',
    name: '团风县',
    name1: '预警',
    name2:'超载',
    name3: '健康',
    name4: '健康'
  },  {
    key: '1',
    name: '团风县',
    name1: '预警',
    name2:'超载',
    name3: '健康',
    name4: '健康'
  },
  {
    key: '1',
    name: '团风县',
    name1: '预警',
    name2:'超载',
    name3: '健康',
    name4: '健康'
  },  {
    key: '1',
    name: '团风县',
    name1: '预警',
    name2:'超载',
    name3: '健康',
    name4: '健康'
  },  {
    key: '1',
    name: '团风县',
    name1: '预警',
    name2:'超载',
    name3: '健康',
    name4: '健康'
  },
  {
    key: '1',
    name: '团风县',
    name1: '预警',
    name2:'超载',
    name3: '健康',
    name4: '健康'
  },  {
    key: '1',
    name: '团风县',
    name1: '预警',
    name2:'超载',
    name3: '健康',
    name4: '健康'
  },
];
import BarChart from './barChart'
export default {
  data: () => ({
    data,
    columns,
  }),
  components: {
    BarChart
  },
  methods: {
    handleChange() {

    }
  },
}
</script>
<style>
th.column-money,
td.column-money {
  text-align: right !important;
}
</style>
<style lang="scss" scoped>
.chart-data {
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 482px;
    height: 64px;
    background-color: #ffffff;
    box-shadow: 0px 0px 3px 0px
      rgba(0, 0, 0, 0.25);
    border-radius: 3px;
    margin-bottom: 16px;
    .text {
      font-size: 14px;
      font-weight: bold;
      color: #454954;
      padding-left: 19px;
    }
    .btn {
      margin-right: 20px;
      button:last-child {
        margin-left: 10px;
      }
    }
  }
  .data-table {
    width: 482px;
    height: 340px;
    overflow-y: auto;
    background-color: #ffffff;
    box-shadow: 0px 0px 3px 0px
      rgba(0, 0, 0, 0.25);
    border-radius: 3px;
    margin-bottom: 16px;
    .table-title {
      font-size: 16px;
      font-weight: bold;
      color: #454954;
      padding: 19px 0 15px 18px;
    }
  }
  .data-chart {
    width: 482px;
    height: 280px;
    background-color: #ffffff;
    box-shadow: 0px 0px 3px 0px
      rgba(0, 0, 0, 0.25);
    border-radius: 3px;
    .chart-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .text-title {
        font-size: 16px;
        font-weight: bold;
        color: #454954;
        padding: 19px 0 15px 18px;
      }
      .select-title {
        margin-right: 30px;
        .select-label {
          margin-right: 12px;
        }
      }
    }
  }
}
</style>
