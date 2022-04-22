<!--
 * @Author: 任继民
 * @Date: 2020-11-30 14:53:39
 * @LastEditors: 任继民
 * @LastEditTime: 2021-06-21 15:41:45
 * @Description:
-->
<template>
  <div class="support-list">
    <a-form layout="inline">
      <a-form-item ref="name" label="区域类型">
        <a-input v-model="pagination.areaType" placeholder="请输入区域类型" />
      </a-form-item>
      <a-form-item ref="name" label="评估时间">
        <!-- <a-date-picker @change="onChange" placeholder="请输入评估时间"/> -->
        <a-range-picker
          @change="onChange"
          :show-time="{
            hideDisabledOptions: true,
            defaultValue: [
              moment('00:00:00', 'HH:mm:ss'),
              moment('11:59:59', 'HH:mm:ss')
            ]
          }"
          format="YYYY-MM-DD HH:mm:ss"
        />
        <!-- <a-input v-model="pagination.time"   placeholder="请输入评估时间" /> -->
      </a-form-item>
      <a-form-item ref="name" label="预警状态">
        <a-select v-model="pagination.warningStatus" style="width: 120px">
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="0">健康</a-select-option>
          <a-select-option value="1">轻警</a-select-option>
          <a-select-option value="2">重警</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click.native="initData" style="background: #397DC9;">
          查询
        </a-button>
      </a-form-item>
    </a-form>
    <div class="v-tablehead">
      <div class="total">
        <img src="../../assets/imgs/icon-total.png" alt="" srcset="" />
        <span class="text">当前数据：</span>
        <span class="num">{{ pageInfo.total }}条</span>
      </div>
    </div>
    <div>
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="pageInfo"
        bordered
        @change="handleTableChange"
      >
        <template slot="warningStatus" slot-scope="warningStatus">
          <div v-if="warningStatus == 0" class="customText success">
            <i class="tag"></i>
            <span>健康</span>
          </div>
          <div v-else-if="warningStatus == 1" class="customText info">
            <i class="tag"></i>
            <span>轻警</span>
          </div>
          <div v-else-if="warningStatus == 2" class="customText warning">
            <i class="tag"></i>
            <span>重警</span>
          </div>
        </template>
        <template slot="overloadFactor" slot-scope="overloadFactor">
          <div v-if="overloadFactor == 'szycz'">
            <span>水资源超载</span>
          </div>
          <div v-else-if="overloadFactor == 'szyljcz'">
            <span>水资源临界超载</span>
          </div>
          <div v-else-if="overloadFactor == 'tdcz'">
            <span>土地超载</span>
          </div>
          <div v-else>
            <span>土地临界超载</span>
          </div>
        </template>
        <template slot="action" slot-scope="text, record">
          <span @click="quesResult(text, record)">结果</span>
          <span style="margin-left: 10px" @click="quesReport(text, record)"
            >报告</span
          >
        </template>
      </a-table>
    </div>
  </div>
</template>
<script>
const columns = [
  {
    title: "区域类型",
    align: "center",
    dataIndex: "areaType"
  },
  {
    title: "区域",
    align: "center",
    dataIndex: "area"
  },
  {
    title: "问题指标",
    align: "center",
    dataIndex: "kpiname"
  },
  {
    title: "预警状态",
    align: "center",
    scopedSlots: { customRender: "warningStatus" },
    dataIndex: "warningStatus"
  },
  {
    title: "评估时间",
    align: "center",
    dataIndex: "evaluateTime"
  },
  {
    title: "超载因子",
    align: "center",
    scopedSlots: { customRender: "overloadFactor" },
    dataIndex: "overloadFactor"
  },
  {
    title: "决策支持建议",
    align: "center",
    dataIndex: "advise"
  },
  {
    title: "决策跟踪",
    align: "center",
    dataIndex: "trace"
  },
  {
    title: "操作",
    align: "center",
    dataIndex: "action",
    scopedSlots: { customRender: "action" }
  }
];

const data = [];
import moment from "moment";
import {
  getDecisionList,
  getQuestionResult,
  getQuestionReport
} from "@/api/decisionsupport";
export default {
  data: () => ({
    data,
    columns,
    pagination: {
      areaType: "",
      time: "",
      warningStatus: ""
    },
    pageInfo: {
      current: 1,
      pageSize: 10,
      total: 0
    }
  }),
  created() {
    this.initData();
  },
  methods: {
    moment,
    async initData() {
      let params = {
        current: this.pageInfo.current,
        size: this.pageInfo.pageSize,
        areaType: this.pagination.areaType,
        warningStatus: this.pagination.warningStatus,
        time: this.pagination.time.toString()
      };
      let res = await getDecisionList(params);
      const { code, data } = res;
      if (code === 200) {
        this.data = data.records;
        console.log(this.data)
        this.pageInfo.total = data.total;
      } else {
        this.$message.warn("获取数据失败，请稍后再试");
      }
    },
    onChange(date, dateString) {
      // console.log(date, dateString);
      if (dateString[0] === "") this.pagination.time = "";
      else this.pagination.time = `${dateString}`;
    },
    handleTableChange(pagination, filters, sorter) {
      this.pageInfo.current = pagination.current;
      this.initData();
    },
    async quesResult(text, record) {
      console.log(text, record);
      let params = {
        deId: record.id
      };
      let res = await getQuestionResult(params);
      const { code } = res;
      if (code == 200) {
        // TODO
      }
    },
    quesReport() {}
  }
};
</script>
<style lang="scss" scoped>
@import url("../../assets/styles/common.scss");
.support-list {
  background-color: #ffffff;
  margin-top: 16px;
  padding: 0 20px;
  .v-tablehead {
    height: 55px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .total {
      display: flex;
      align-items: center;
      .text {
        margin-left: 12px;
        font-size: 14px;
        color: #454954;
      }
      .num {
        color: #1890ff;
        font-size: 14px;
      }
    }
  }
}
.customText {
  .tag {
    width: 8px;
    height: 8px;
    display: inline-block;
    font-size: 14px;
    margin-right: 9px;
  }
}
.warning {
  .tag {
    background-color: #eda169;
  }
  color: #eda169;
}
.success {
  .tag {
    background-color: #5ec26d;
  }
  color: #5ec26d;
}
.info {
  .tag {
    background-color: #f6d641;
  }
  color: #f6d641;
}
</style>
