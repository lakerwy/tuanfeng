<!--
 * @Author: 任继民
 * @Date: 2021-01-11 15:18:59
 * @LastEditors: 任继民
 * @LastEditTime: 2021-03-23 15:59:50
 * @Description: 运维日志
-->
<template>
  <section>
    <Breadcrumb :BreadHeight='"120px"'>
      <a-form
      layout="inline"
      >
        <a-form-item  label="创建者">
          <a-input v-model:value="pagination.creator" placeholder="请输入创建者" />
        </a-form-item>
        <a-form-item  label="类型">
          <a-input v-model:value="pagination.type"   placeholder="请输入类型" />
        </a-form-item>
        <a-form-item  label="请求开始日期">
          <a-date-picker @change="startChange" v-model:value="pagination.start" format="YYYY-MM-DD"/>
        </a-form-item>
        <a-form-item  label="请求结束日期">
          <a-date-picker @change="endChange" v-model:value="pagination.end" format="YYYY-MM-DD"/>
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            @click.native="initData"
          >
            查询
          </a-button>
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            @click.native="handleBackUp"
          >
            备份日志
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
      <a-table :columns="columns" :data-source="dataSource" :pagination="pagination" :loading="loading"  @change="handleTableChange" :row-key="record => record.id" bordered>
        <template #operation="{text}">
          <img @click="removeData(text)" src="../../assets/images/shanchu.png" alt="">
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
    title: '行为',
    dataIndex: 'behavior',
  },
  {
    title: '创建者',
    className: 'column-money',
    dataIndex: 'createBy',
  },
  {
    title: '类型',
    dataIndex: 'type',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    key: 'operation',
    slots: { customRender: 'operation' }
  },
];
import { defineComponent, reactive, onBeforeMount, toRefs } from 'vue';
import { Card, message } from "ant-design-vue";
import Breadcrumb from '../../components/Breadcrumb/index.vue';
import { getDevOpslog } from '../../api/log/index'
export default defineComponent({
  components: {
    Breadcrumb,
    Card,
    message
  },
  setup() {
    const state = reactive({
      loading: false,
      pagination: {
        current:1,
        pageSize:10,
        total:0,
        creator: '',
        type: '',
        start: '',
        end: ''
      },
      dataSource:[]
    });
    onBeforeMount(() => {
      initData();
    })
    // 初始化数据
    const initData = async () => {
      state.loading = true;
      let params = {
        current: state.pagination.current,
        size: state.pagination.pageSize,
        creator: state.pagination.creator,
        type: state.pagination.type,
        start: state.pagination.start,
        end: state.pagination.end
      }
      const { success, body } = await getDevOpslog(params);
      if (success) {
        state.loading = false;
        state.dataSource = body.records;
        state.pagination.total = body.total;
      }else {
        state.loading = false;
        message.error(`查询失败！请稍后再试`)
      }
    }
    const removeData = async (text) => {
      console.log(text)
    }
    const handleTableChange = (pagination) => {
      const pager = { ...state.pagination };
      pager.current = pagination.current;
      state.pagination = pager;
      initData();
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
      state.pagination.start = dateString
    }
    const endChange = (value, dateString) => {
      state.pagination.end = dateString
    }
    return {
      ...toRefs(state),
      initData,
      removeData,
      handleTableChange,
      getCurrentStyle,
      startChange,
      endChange,
      columns,
    };
  }
})
</script>
