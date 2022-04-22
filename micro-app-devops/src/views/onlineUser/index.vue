<!--
 * @Author: 任继民
 * @Date: 2021-01-28 14:47:39
 * @LastEditors: 任继民
 * @LastEditTime: 2021-02-23 16:18:38
 * @Description:在线用户
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
        <template #loginTime="{record}" >
          <span>{{record.loginTime? record.loginTime.replace("T", ' '):''}}</span>
        </template>
        <template #test="{record}">
          <section class="table-status">
            <div v-if="record.test">
              <img src="../../assets/images/icon-pass.png" alt="" srcset="">
              <span>测试通过</span>
            </div>
            <div v-else >
              <img src="../../assets/images/icon-failed.png" alt="" srcset="">
              <span>测试失败</span>
            </div>
          </section>
        </template>
        <template #operation="{record}">
            <a-tooltip content="测试" placement="top">
              <img src="../../assets/images/查看icon.png" @click="handleModal(record,'test')" alt="" srcset="">
            </a-tooltip>
        </template>
      </a-table>
    </a-card>
  </section>
</template>
<script lang="ts">
const columns = [
  {
    title: '序号',
    width:100,
    customRender: ({text, record, index}) => `${index + 1}`,
  },
  {
    title: '登录用户名',
    dataIndex: 'loginUser',
  },
  {
    title: '登录IP',
    dataIndex: 'ip',
  },
  {
    title: '登录时间',
    dataIndex: 'loginTime',
    slots: { customRender: 'loginTime' }
  },
  {
    title: '登录浏览器',
    dataIndex: 'browser',
  },
  {
    title: '在线时长',
    dataIndex: 'onlineDur',
  },
  {
    title: '操作',
    key: 'operation',
    slots: { customRender: 'operation' }
  },
];
import qs from 'qs';
import { defineComponent, reactive, onBeforeMount, toRefs } from 'vue';
import { Card,Tabs } from "ant-design-vue";
import Breadcrumb from '../../components/Breadcrumb/index.vue';
import { getMonitorUser } from '../../api/monitor/index'
export default defineComponent({
  components: {
    Breadcrumb,
    Card,
    Tabs
  },
  setup() {
    const state = reactive({
      loading: false,
      pagination: {
        current:1,
        pageSize:10,
        total:0,
        username:'',
      },
      dataSource:[],
    });
    onBeforeMount(() => {
      initData();
    })
    // 初始化数据
    const initData = async () => {
      state.loading = true;
      let params = {
        username: state.pagination.username,
        current: state.pagination.current,
        size: state.pagination.pageSize,
      }
      const { success, body } = await getMonitorUser(params);
      if (success) {
        state.loading = false;
        state.dataSource = body.records;
        state.dataSource.forEach(item => {
          let currentTime = new Date().getTime();
          let loginTime = new Date(item.loginTime).getTime();
          item.onlineDur = formatSeconds((currentTime-loginTime)/1000)
        })
        state.pagination.total = body.total;
      }
    }
    const formatSeconds = (value) => {
      let theTime = parseInt(value);// 秒
      let middle = 0; // 分
      let hour = 0; // 小时

      if( theTime > 60) {
        middle = theTime / 60;
        theTime = theTime % 60;
        if( middle > 60) {
          hour = middle / 60;
          middle = middle % 60;
        }
      }
      // @ts-ignore
      let result = "" + parseInt(theTime) + "秒";
      if( middle > 0) {
        // @ts-ignore
        result = "" + parseInt(middle) + "分" + result;
      }
      if( hour > 0) {
        // @ts-ignore
        result = "" + parseInt(hour) + "小时" + result;
      }
      return result;
    }
    return {
      ...toRefs(state),
      columns,
      formatSeconds,
    };
  }
})
</script>
<style lang="less" scoped>
@import url('../../assets/style/common.less');
</style>
