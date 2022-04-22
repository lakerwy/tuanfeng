<!--
 * @Author: 任继民
 * @Date: 2020-11-18 16:32:21
 * @LastEditors: 任继民
 * @LastEditTime: 2021-06-18 16:39:38
 * @Description:
-->
<template>
  <div class="serviceaccess-stat">
    <HeaderContent>
      <Form
        ref="searchForm"
        :model="pageInfo"
        inline
        label-position="right"
        :label-width="80"
      >
        <FormItem label="统计时段">
          <Select
            :clearable="true"
            v-model="select"
            @on-change="handleClickSelect"
          >
            <Option value="1">月</Option>
            <Option value="2">天</Option>
            <Option value="3">小时</Option>
          </Select>
        </FormItem>
        <FormItem v-if="select == '1'" label="选择月份">
          <Row>
            <Col
              ><FormItem prop="month">
                <DatePicker
                  type="month"
                  placeholder="选择月份"
                  v-model="pageInfo.month"
                  @on-change="handleClickMonth"
                ></DatePicker>
              </FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem v-if="select == '2'" label="选择日期">
          <Row>
            <Col
              ><FormItem prop="date">
                <DatePicker
                  type="date"
                  placeholder="选择日期"
                  v-model="pageInfo.date"
                  @on-change="handleClickDate"
                ></DatePicker
              ></FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem v-if="select == '3'" label="日期时间">
          <Row>
            <Col span="11">
              <FormItem prop="date">
                <DatePicker
                  type="date"
                  placeholder="选择日期"
                  v-model="pageInfo.date"
                  @on-change="handleClickDateTime"
                ></DatePicker
              ></FormItem>
            </Col>
            <Col span="2" style="text-align: center">-</Col>
            <Col span="11"
              ><FormItem prop="time">
                <TimePicker
                  type="timerange"
                  placement="bottom-end"
                  placeholder="选择时间"
                  style="width: 168px"
                  @on-change="handleClickTime"
                ></TimePicker
              ></FormItem>
            </Col>
          </Row>
        </FormItem>
        <!-- <FormItem label="请求者">
          <Input
            type="text"
            v-model="pageInfo.user_id"
            placeholder="请输入请求者"
          />
        </FormItem> -->
        <FormItem label="服务名称">
          <Input
            type="text"
            v-model="pageInfo.request_service_id"
            placeholder="请输入服务名称"
          />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="initData(1)">查询</Button>&nbsp;
          <!-- <Button @click="handleResetForm('searchForm')">重置</Button> -->
        </FormItem>
      </Form>
    </HeaderContent>
    <Card shadow>
      <!-- <div class="tstatic-num">
        <section v-for="(item,index) in titlelist" :key="index" :style="{'border-top': `3px solid ${item.color}` }">
          <div class="left">
            <img :src="item.img" alt="" srcset="">
          </div>
          <div class="right">
            <div class="title-text">{{item.title}}</div>
            <div class="num-text" :style="{color: item.color}">{{item.num}}</div>
          </div>
        </section>
      </div>
      <div class="tstatic-chart">
        <div class="chart-top">
          <section>
            <div class="chart-title">操作次数统计</div>
            <div style="height:calc(100% - 100px);" id="indicator"></div>
          </section>
          <section>
            <div class="chart-title">响应次数统计</div>
            <div style="height:calc(100% - 100px);" id="activity"></div>
          </section>
        </div>
      </div> -->
      <div class="search-con search-con-top">
        <div class="total">
          <img src="../../../assets/images/icon-total.png" alt="" srcset="" />
          <span class="text">当前数据：</span>
          <span class="num">{{ pageInfo.total }}条</span>
        </div>
      </div>
      <Table border :columns="columns" :data="tableData">
        <template slot="createTime" slot-scope="{ row }">
          <span>{{
            row.createTime ? row.createTime.replace("T", " ") : ""
          }}</span>
        </template>
        <template slot="status" slot-scope="{ row }">
          <div v-if="row.status == '1'">
            <i style="background:green" class="itablestatus"></i>认证成功
          </div>
          <div v-else-if="row.status == '0'">
            <i style="background:#c3cbd6" class="itablestatus"></i>未认证
          </div>
          <div v-else>
            <i style="background:red" class="itablestatus"></i>认证失败
          </div>
        </template>
        <!-- <template slot="action" slot-scope="{ row }">
          <img src="../../../assets/images/shanchu.png" alt="" srcset="" @click="handleModal(row,'view')">
        </template> -->
      </Table>
      <Page
        transfer
        :total="pageInfo.total"
        :current="pageInfo.page"
        :page-size="pageInfo.limit"
        show-elevator
        show-total
        @on-change="handlePage"
        @on-page-size-change="handlePageSize"
      ></Page>
    </Card>
  </div>
</template>
<script>
import HeaderContent from "@/components/header-content/index";
import { getserviceRequestLogIntervalStatistics } from "@/api/statistic";
import echartsOptions from "./echartOption";
import { initEcharts } from "@/libs/chart";

Date.isLeapYear = function(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};
Date.getDaysInMonth = function(year, month) {
  return [
    31,
    Date.isLeapYear(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31
  ][month];
};
Date.prototype.isLeapYear = function() {
  return Date.isLeapYear(this.getFullYear());
};
Date.prototype.getDaysInMonth = function() {
  return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
};
Date.prototype.addMonths = function(value) {
  var n = this.getDate();
  this.setDate(1);
  this.setMonth(this.getMonth() + value);
  this.setDate(Math.min(n, this.getDaysInMonth()));
  return this;
};
Date.prototype.addDays = function(d) {
  this.setDate(this.getDate() + d);
  return this;
};
export default {
  components: {
    HeaderContent
  },
  data: () => ({
    titlelist: [
      {
        title: "总服务数",
        num: "189765",
        img: require("../../../assets/images/img-5.png"),
        color: "#40d0e5"
      },
      {
        title: "成功数",
        num: "6854",
        img: require("../../../assets/images/img-6.png"),
        color: "#3797f8"
      },
      {
        title: "失败数",
        num: "542",
        img: require("../../../assets/images/img-7.png"),
        color: "#eda068"
      }
      // {title: '新增用户', num: '555',  img: require('../../../assets/images/img-8.png'),color:'#26ba9c'},
      // {title: '日活跃用户', num: '555',  img: require('../../../assets/images/img-9.png'),color:'#f48181'},
    ],
    columns: [
      {
        title: "序号",
        type: "index",
        width: 65,
        align: "center"
      },
      // {
      //   title: "请求者",
      //   key: "user_id"
      // },
      {
        title: "服务名称",
        key: "service_name"
      },
      {
        title: "请求成功次数",
        key: "success_count"
      },
      {
        title: "请求失败次数",
        key: "fail_count"
      },
      {
        title: "请求总次数",
        key: "total_count"
      }
    ],
    pageInfo: {
      page: 1,
      limit: 10
    },
    select: "",
    request_time_begin: null,
    request_time_end: null,
    tableData: [],
    month_begin: "",
    date_begin: "",
    date_time: ""
  }),
  created() {
    this.initData();
  },
  mounted() {
    // this.initChart()
  },
  methods: {
    // 统计时段
    handleClickSelect(val) {
      this.request_time_begin = "";
      this.request_time_end = "";
      this.pageInfo.month = "";
      this.pageInfo.date = "";
      this.pageInfo.time = "";
    },
    // 选择月份
    handleClickMonth(val) {
      if (val) {
        this.month_begin = val;
        this.request_time_begin =
          this.month_begin + "-" + "01" + " " + "00:00:00";
        var date = this.pageInfo.month;
        date.setDate(1);
        date = date.addMonths(1);
        date = date.addDays(-1);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        this.request_time_end =
          year + "-" + month + "-" + day + " " + "23:59:59";
      } else {
        this.request_time_begin = null;
        this.request_time_end = null;
      }
    },
    // 选择日期
    handleClickDate(val) {
      if (val) {
        this.request_time_begin = val + " " + "00:00:00";
        this.request_time_end = val + " " + "23:59:59";
      } else {
        this.request_time_begin = null;
        this.request_time_end = null;
      }
    },
    // 选择日期与时间
    handleClickDateTime(val) {
      if (val) {
        this.date_begin = val;
      } else {
        this.date_begin = "";
      }
    },
    handleClickTime(val) {
      if (val && this.date_begin) {
        this.request_time_begin = this.date_begin + " " + val[0];
        this.request_time_end = this.date_begin + " " + val[1];
      } else {
        this.request_time_begin = null;
        this.request_time_end = null;
      }
    },
    async initData(page) {
      if (page) {
        this.pageInfo.page = page;
      }
      let params = {
        page: this.pageInfo.page,
        request_time_begin: this.request_time_begin,
        request_time_end: this.request_time_end,
        q_statisticsType: 1,
        user_id: this.pageInfo.user_id,
        request_service_id: this.pageInfo.request_service_id,
        rows: this.pageInfo.limit
      };
      let res = await getserviceRequestLogIntervalStatistics(params);
      const { rows, total } = res;
            let newArr=rows.filter(item=>{
        return item.service_id!="小计" && item.service_id!="总计"
      })
      this.tableData = newArr;
        let a=[]
      rows.forEach(item => {
        if(item.service_id=="小计" || item.service_id=="总计"){
          a.push(item)
        }
      });
      // console.log(a.length)
      this.pageInfo.total = total-a.length;
      // let total = 0, succTotal = 0,failTotal = 0, userNum = 0
      // rows.forEach(item => {
      //   total += item.total_count
      //   succTotal += item.success_count;
      //   failTotal += item.fail_count;
      // });
      // this.titlelist[0].num = total;
      // this.titlelist[1].num = succTotal;
      // this.titlelist[2].num = failTotal;
    },
    // initChart() {
    //   initEcharts('indicator', echartsOptions.indicatorAnalysisOptions);
    //   initEcharts('activity',echartsOptions.activityOptions);
    // }
    handlePage(current) {
      this.pageInfo.page = current;
      this.initData();
    },
    handlePageSize(size) {
      this.pageInfo.limit = size;
      this.initData();
    }
  }
};
</script>
<style lang="less">
.serviceaccess-stat {
  // .ivu-card {
  //   background-color: #f5f5f5;
  //   .ivu-card-body {
  //     padding: 0;
  //     .tstatic-num {
  //       display: flex;
  //       justify-content: flex-start;
  //       align-items: center;
  //       section {
  //         width: 33.33%;
  //         height: 170px;
  //         background-color: #ffffff;
  //         margin-right: 20px;
  //         display: flex;
  //         justify-content: flex-start;
  //         align-items: center;
  //         .left {
  //           width: 32%;
  //           text-align: center;
  //           // height: 100%;
  //         }
  //         .right {
  //           width: 68%;
  //           height: 100%;
  //           .title-text{
  //             margin-top: 36px;
  //             font-size: 18px;
  //             color: #454954;
  //           }
  //           .num-text {
  //             margin-top: 21px;
  //             font-size: 48px;
  //           }
  //         }
  //       }
  //       section:last-child {
  //         margin-right: 0;
  //       }
  //     }
  //     .tstatic-chart {
  //       div {
  //         margin-top: 20px;
  //         section {
  //           height: 572px;
  //           width: 50%;
  //           background-color: #ffffff;
  //           .chart-title {
  //             padding: 18px 0 0 22px;
  //             color: #454954;
  //             font-size: 16px;
  //           }
  //         }
  //         section:last-child {
  //           margin-left: 21px;
  //         }
  //       }
  //       .chart-top, .chart-bottom {
  //         display: flex;
  //         justify-content: flex-start;
  //         align-items: center;
  //       }
  //     }
  //   }
  // }
}
</style>
