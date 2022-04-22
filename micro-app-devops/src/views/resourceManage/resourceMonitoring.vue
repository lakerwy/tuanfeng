<!--
 * @Author: 任继民
 * @Date: 2021-03-02 09:53:47
 * @LastEditors: 任继民
 * @LastEditTime: 2021-03-02 10:34:48
 * @Description: 专题监控
-->
<template>
  <section>
    <Breadcrumb />
    <a-card :loading="loading" class="contentCard">
      <div class="search-con search-con-top">
        <div class="total">
          <img src="../../assets/images/icon-total.png" alt="" srcset="">
          <span class="text">当前数据：</span>
          <span class="num">{{pagination.total}}条</span>
        </div>
      </div>
      <a-table :columns="columns" :data-source="dataSource" :pagination="pagination" :loading="loading"  @change="handleTableChange" :row-key="record => record.id" bordered>
        <template #createTime="{record}" >
          <span>{{record.createTime? record.createTime.replace("T", ' '):''}}</span>
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
    title: '使用IP地址',
    dataIndex: 'ip',
  },
  {
    title: '使用IP地址',
    dataIndex: 'ip',
  },
  {
    title: '使用者',
    dataIndex: 'username',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    slots: { customRender: 'createTime' }
  }
];
import { defineComponent, reactive, onBeforeMount, toRefs } from 'vue';
import { Card } from "ant-design-vue";
import Breadcrumb from '../../components/Breadcrumb/index.vue';
import { getserviceMonitoring } from '../../api/services/index';
export default defineComponent({
  components: {
    Breadcrumb,
    Card
  },
  setup() {
    const state = reactive({
      formInline: {
        user: '',
        password: '',
      },
      loading: false,
      pagination: {
        current:1,
        pageSize:10,
        total:0
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
      }
      const { code, body } = await getserviceMonitoring(params);
      if (code === 59009) {
        state.loading = false;
        state.dataSource = body.records;
        state.pagination.total = body.total;
      }
    }
    const handleTableChange = (pagination) => {
      const pager = { ...state.pagination };
      pager.current = pagination.current;
      state.pagination = pager;
      initData();
    }
    return {
      ...toRefs(state),
      handleTableChange,
      columns,
    };
  }
})
</script>
