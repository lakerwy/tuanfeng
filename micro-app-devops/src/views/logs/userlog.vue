<!--
 * @Author: 任继民
 * @Date: 2021-01-08 13:52:09
 * @LastEditors: 任继民
 * @LastEditTime: 2021-03-23 11:33:19
 * @Description:
-->
<template>
  <section>
    <Breadcrumb :BreadHeight='"120px"'>
      <a-form
      layout="inline"
      >
        <a-form-item  label="服务器名称">
          <a-input v-model:value="pagination.request_service_id" placeholder="请输入服务器名称" />
        </a-form-item>
        <a-form-item  label="请求者">
          <a-input v-model:value="pagination.user_id"   placeholder="请输入请求者" />
        </a-form-item>
        <a-form-item  label="请求结果">
          <a-select
            v-model:value="pagination.request_result"
            style="width: 120px"
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="2">失败</a-select-option>
            <a-select-option value="1" >成功</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item  label="请求开始日期">
          <a-date-picker @change="startChange" v-model:value="pagination.request_time_begin" format="YYYY-MM-DD"/>
        </a-form-item>
        <a-form-item  label="请求结束日期">
          <a-date-picker @change="endChange" v-model:value="pagination.request_time_end" format="YYYY-MM-DD"/>
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            @click.native="initData"
          >
            查询
          </a-button>
        </a-form-item>
      </a-form>
    </Breadcrumb>
    <a-card :loading="loading" class="contentCard">
      <div class="search-con search-con-top">
        <div class="total">
          <img src="../../assets/images/icon-total.png" alt="" srcset="">
          <span class="text">当前数据：</span>
          <span class="num">{{pagination.total}}条</span>
        </div>
      </div>
      <a-table :columns="columns" :data-source="tableData" :pagination="pagination" @change="handleTableChange" bordered :row-key="record => record.id">
        <template #request_time="{ record }">
          <span>{{dateTime(record.request_time)}}</span>
        </template>
        <template #request_end_time="{ record }">
          <span>{{dateTime(record.request_end_time)}}</span>
        </template>
        <template #request_result="{ record }">
          <section class="table-status">
            <div v-if="record.request_result == '1'">
              <img src="../../assets/images/icon-pass.png" alt="" srcset="">
              <span>成功</span>
            </div>
            <div v-else>
              <img src="../../assets/images/icon-failed.png" alt="" srcset="">
              <span>失败</span>
            </div>
          </section>
        </template>
      </a-table>
    </a-card>
  </section>
</template>
<script lang="ts">
const columns = [
  {
    title: '序号',
    customRender: ({text, record, index}) => `${index + 1}`,
  },
  {
    title: '服务名称',
    dataIndex: 'service_name'
  },
  {
    title: '请求者',
    dataIndex: 'user_id',
    tooltip: true
  },
  {
    title: '请求者IP',
    dataIndex: 'request_ip'
  },
  {
    title: '请求方式',
    dataIndex: 'request_type'
  },
  {
    title: '请求结果',
    dataIndex: 'request_result',
    slots: { customRender: 'request_result' }
  },
  {
    title: '请求开始时间',
    dataIndex: 'request_time',
    slots: { customRender: 'request_time' }
  },
  {
    title: '请求结束时间',
    dataIndex: 'request_end_time',
    slots: { customRender: 'request_end_time' }
  },
  {
    title: '请求耗时(毫秒)',
    dataIndex: 'request_cost_time'
  }
];
import { defineComponent, reactive, onBeforeMount, computed, toRefs } from 'vue';
import { Card } from "ant-design-vue";
import Breadcrumb from '../../components/Breadcrumb/index.vue';
import { serviceRequestLogList } from '../../api/log/index'
export default defineComponent({
  components: {
    Breadcrumb,
    Card
  },
  setup() {
    const state = reactive({
      loading: true,
      tableData: [],
      pagination: {
        current:1,
        pageSize:10,
        total:0,
        request_service_id: '',
        user_id: '',
        request_result: "",
        request_time_begin: '',
        request_time_end: ''
      },
    });
    const initData = async () => {
      console.log(state.pagination.request_time_begin)
      state.loading = true;
      let params = null;
      if (state.pagination.request_result) {
        params = {
          request_time_begin: state.pagination.request_time_begin,
          request_time_end: state.pagination.request_time_end,
          request_result: state.pagination.request_result,
          request_service_id: state.pagination.request_service_id,
          user_id: state.pagination.user_id,
          page: state.pagination.current,
          rows: state.pagination.pageSize
        }
      }else {
        params = {
          request_time_begin: state.pagination.request_time_begin,
          request_time_end: state.pagination.request_time_end,
          request_service_id: state.pagination.request_service_id,
          user_id: state.pagination.user_id,
          page: state.pagination.current,
          rows: state.pagination.pageSize
        }
      }
      let res = await serviceRequestLogList(params);
      const { rows, total } = res;
      state.tableData = rows;
      state.pagination.total = total;
      state.loading = false;
    }
    onBeforeMount(async () => {
      initData();
    });
    const handleTableChange = (pagination) => {
      const pager = { ...state.pagination };
      pager.current = pagination.current;
      state.pagination = pager;
      initData();
    }
    const dateTime = (val) => {
      const dateee = new Date(val).toJSON();
      let date = new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
      return date;
    }
    const getCurrentStyle = (current, today) => {
      const style = {
        border: '',
        borderRadius: ''
      };
      if (current.date() === 1) {
        style.border = '1px solid #1890ff';
        style.borderRadius = '50%';
      }
      return style;
    }
    const startChange = (value, dateString) => {
      state.pagination.request_time_begin = dateString
    }
    const endChange = (value, dateString) => {
      state.pagination.request_time_end = dateString
    }
    return {
      ...toRefs(state),
      initData,
      handleTableChange,
      getCurrentStyle,
      dateTime,
      startChange,
      endChange,
      columns,
    };
  }
})
</script>
