<!--
 * @Author: 任继民
 * @Date: 2020-11-18 16:32:21
 * @LastEditors: 任继民
 * @LastEditTime: 2021-06-18 16:51:06
 * @Description:
-->
<template>
  <div class="useraccess-stat">
    <HeaderContent>
      <Form ref="searchForm"
          :model="pageInfo"
          inline
          label-position="right"
          :label-width="90">
        <FormItem label="状态">
          <Select v-model="pageInfo.status" style="width:150px;">
            <Option >全部</Option>
            <Option value="1">有效</Option>
            <Option value="2">已删除</Option>
            <Option value="3">自动失效</Option>
          </Select>
        </FormItem>
        <FormItem label="创建时间起始" prop="startDate">
          <DatePicker date="yyyy-MM-dd" :options="startOptions" v-model="pageInfo.create_date_begin" type="date"  placeholder="请输入开始时间" @on-change="handleStartTime"	></DatePicker>
        </FormItem>
        <FormItem label="创建时间终止" prop="endDate">
          <DatePicker date="yyyy-MM-dd" :options="endOptions" v-model="pageInfo.create_date_end" type="date"  placeholder="请输入结束时间" @on-change="handleEndTime"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="initData(1)">查询</Button>&nbsp;
          <!-- <Button @click="handleResetForm('searchForm')">重置</Button> -->
        </FormItem>
      </Form>
    </HeaderContent>
    <Card shadow>
      <div class="search-con search-con-top">
        <div class="total">
          <img src="../../../assets/images/icon-total.png" alt="" srcset="">
          <span class="text">当前数据：</span>
          <span class="num">{{pageInfo.total}}条</span>
        </div>
      </div>
      <Table border :columns="columns" :data="tableData" :loading="loading">
        <template slot="time_limit_start" slot-scope="{ row }">
          <span>{{row.time_limit_start | dateTime}}</span>
        </template>
        <template slot="time_limit_end" slot-scope="{ row }">
          <span>{{row.time_limit_end | dateTime}}</span>
        </template>
        <template slot="create_date" slot-scope="{ row }">
          <span>{{row.create_date | dateTime}}</span>
        </template>
        <template slot="status" slot-scope="{ row }">
          <div v-if="row.status == '1'"><i style="background:green" class="itablestatus"></i>有效</div>
          <div v-else-if="row.status =='2'"><i style="background:red" class="itablestatus"></i>已删除</div>
          <div v-else-if="row.status =='3'"><i style="background:#39f" class="itablestatus"></i>自动失效</div>
        </template>

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
        <div class="chart-bottom">
          <section>
            <div class="chart-title">流量统计</div>
            <div style="height:calc(100% - 100px);" id="indicator"></div>
          </section>
          <section>
            <div class="chart-title">IP个数</div>
            <div style="height:calc(100% - 100px);" id="activity"></div>
          </section>
        </div>
      </div> -->
    </Card>
  </div>

</template>
<script>
import  HeaderContent from '@/components/header-content/index';
import { getserviceRequestLogIntervalStatistics,getserviceControlList } from '@/api/statistic'
import echartsOptions from './echartOption';
import { initEcharts } from '@/libs/chart'
export default {
  components: {
    HeaderContent
  },
  filters: {
    dateTime: function(val) {
      if (!val) return ''
      const dateee = new Date(val).toJSON();
      let date = new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
      return date;
    }
  },
  data: ()=>({
    titlelist:[
      {title: '总访问数', num: '189765',  img: require('../../../assets/images/img-5.png'),color:'#40d0e5'},
      {title: '访问成功数', num: '6854',  img: require('../../../assets/images/img-6.png'),color:'#3797f8'},
      {title: '访问失败数', num: '542',  img: require('../../../assets/images/img-7.png'),color:'#eda068'},
      // {title: '新增用户', num: '555',  img: require('../../../assets/images/img-8.png'),color:'#26ba9c'},
      // {title: '日活跃用户', num: '555',  img: require('../../../assets/images/img-9.png'),color:'#f48181'},
    ],
    columns:[
      {
        title: '序号',
        type: 'index',
        width: 65,
        align: 'center'
      },
      {
        title: '用户名',
        key: 'user_id_or_ip'
      },
      {
        title: '服务名称',
        key: 'serviceD'
      },
      {
        title: '限制时间开始',
        key: 'time_limit_start',
        slot: 'time_limit_start'
      },
      {
        title: '限制时间结束',
        key: 'time_limit_end',
        slot: 'time_limit_end'
      },
      {
        title: '状态',
        key: 'status',
        slot: 'status',
      },
      {
        title: '备注',
        ellipsis: true,
        key: 'remark',
      },
      {
        title: '创建时间',
        key: 'create_date',
        slot: 'create_date'
      },
    ],
    pageInfo: {
      page: 1,
      limit: 10,
    },
    tableData: [],
    startOptions: {
      disabledDate (date) {
        return date && date.valueOf() > Date.now();
      }
    },
    endOptions: {
      disabledDate (date) {
        return date && date.valueOf() > Date.now();
      }
    }
  }),
  created() {
    this.initData();
  },
  mounted() {
    // this.initChart()
  },
  methods: {
    async initData(page) {
      if (page) {
        this.pageInfo.page = page
      }
      let params = {
        page: this.pageInfo.page || 1,
        rows: this.pageInfo.limit || 10,
        user_check_type: '1',
        status: this.pageInfo.status,
        create_date_begin: this.$options.filters['dateTime'](this.pageInfo.create_date_begin) || '',
        create_date_end: this.$options.filters['dateTime'](this.pageInfo.create_date_end) || ''
      }
      let res = await getserviceControlList(params);
      const { rows, total } = res;
      this.tableData = rows;
      this.pageInfo.total = total;
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
    handlePage (current) {
      this.pageInfo.page = current
      this.initData()
    },
    handlePageSize (size) {
      this.pageInfo.limit = size
      this.initData()
    },
    // initChart() {
    //   initEcharts('indicator', echartsOptions.indicatorAnalysisOptions);
    //   initEcharts('activity',echartsOptions.activityOptions);
    // }
  },
}
</script>
<style lang="less">

</style>
