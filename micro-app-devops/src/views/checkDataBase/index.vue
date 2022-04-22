<!--
 * @Author: 任继民
 * @Date: 2021-01-28 11:35:50
 * @LastEditors: 任继民
 * @LastEditTime: 2021-02-23 13:51:58
 * @Description:数据库巡检
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
              <img src="../../assets/images/ceshi.png" @click="handleModal(record,'test')" alt="" srcset="">
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
    title: '数据库名称',
    dataIndex: 'dataBaseName',
  },
  {
    title: '连接名称',
    dataIndex: 'connectName',
  },
  {
    title: '数据库地址',
    dataIndex: 'address',
  },
  {
    title: '端口号',
    dataIndex: 'port',
  },
  {
    title: '连接状态',
    dataIndex: 'test',
    slots: { customRender: 'test' }
  },
  {
    title: '操作',
    key: 'operation',
    slots: { customRender: 'operation' }
  },
];
import qs from 'qs';
import { defineComponent, reactive, onBeforeMount, toRefs } from 'vue';
import { Card,Tabs, message } from "ant-design-vue";
import Breadcrumb from '../../components/Breadcrumb/index.vue';
import { getdataBases, testconnectionIds } from '../../api/platformCheck/index'
export default defineComponent({
  components: {
    Breadcrumb,
    Card,
    Tabs,
    message
  },
  setup() {
    const state = reactive({
      loading: false,
      pagination: {
        current:1,
        pageSize:10,
        total:0,
        connectName:'',
        dataBaseName: '',
        start: '',
        end: ''
      },
      dataSource:[],
      visible: false,
      modalTitle: '',
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    });
    onBeforeMount(() => {
      initData();
    })
    // 初始化数据
    const initData = async () => {
      state.loading = true;
      let params = {
        connectName: state.pagination.connectName,
        dataBaseName: state.pagination.dataBaseName,
        start: state.pagination.start,
        end: state.pagination.end,
        current: state.pagination.current,
        size: state.pagination.pageSize,
      }
      const { success, body } = await getdataBases(params);
      if (success) {
        state.loading = false;
        // state.dataSource = body.records;
        const idslist = [];
        if (body.records.length ===0) {
          state.dataSource = body.records
        }else {
          body.records.forEach(item => {
            idslist.push(item.id)
          });
          let testRes = await testconnectionIds(qs.stringify({ids: idslist},{ arrayFormat: 'repeat' }));
          const obj = {};
          if (testRes.success){
            testRes.body.map(item=> {
              obj[Object.keys(item)[0]] = Object.values(item)[0];
            })
            body.records.forEach(item => {
              item.test = obj[item.id]
            })
            state.dataSource = body.records
          }
        }
        state.pagination.total = body.total;
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
    const handleModal = async (obj,status) => {
      state.visible = true;
        if (status === 'test') {
        let params = {
          ids: obj.id
        };
        let res = await testconnectionIds(qs.stringify(params))
        if (res.success) {
          if (res.body[0]['1']) {
            obj.test = res.body[0]['1'];
            message.success('测试连接成功！');
          }else {
            message.warning('测试连接失败！');
          }
        }
      }
    }
    return {
      ...toRefs(state),
      removeData,
      handleTableChange,
      handleModal,
      columns,
    };
  }
})
</script>
<style lang="less" scoped>
@import url('../../assets/style/common.less');
</style>
