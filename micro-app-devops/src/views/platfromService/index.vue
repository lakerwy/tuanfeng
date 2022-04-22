<!--
 * @Author: 任继民
 * @Date: 2021-01-28 14:25:47
 * @LastEditors: 任继民
 * @LastEditTime: 2021-01-28 14:44:38
 * @Description: 平台服务巡检
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
        <template #createDate="{record}" >
          <span>{{record.createDate? record.createDate.replace("T", ' '):''}}</span>
        </template>
        <template #operation="{record}">
            <a-tooltip content="编辑" placement="top">
              <img src="../../assets/images/查看icon.png" @click="handleModal(record,'edit')" alt="" srcset="">
            </a-tooltip>
        </template>
      </a-table>
    </a-card>
    <a-modal
        v-model:visible="visible"
        :title="modalTitle"
        ok-text="确认"
        cancel-text="取消"
        @ok="submitData"
      >
      <a-tabs default-active-key="1" @change="tabChange">
        <a-tab-pane key="user" tab="角色信息">
          <a-form
            ref="ruleForm"
            :model="form"
            :rules="rules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-form-item ref="name" label="角色名称" name="username">
              <a-input v-model:value="form.username" />
            </a-form-item>
            <a-form-item ref="name" label="角色编码" name="realname">
              <a-input v-model:value="form.realname" />
            </a-form-item>
            <a-form-item ref="name" label="角色描述" name="phone">
              <a-input v-model:value="form.phone" />
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="org" tab="角色成员" force-render>
          <a-transfer
            :data-source="mockData"
            show-search
            :filter-option="filterOption"
            :target-keys="targetKeys"
            :render="item => item.title"
            @change="handleChange"
            @search="handleSearch"
          />
        </a-tab-pane>
      </a-tabs>
    </a-modal>
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
    title: '服务名称',
    dataIndex: 'serviceName',
  },
  {
    title: 'url真实地址',
    dataIndex: 'url',
    ellipsis: true,
  },
  {
    title: '服务地址1级',
    dataIndex: 'serviceUrlClassification1',
  },
  {
    title: '服务地址2级',
    dataIndex: 'serviceUrlClassification2',
  },
  {
    title: '是否有服务',
    dataIndex: 'isSelf',
  },
  {
    title: '是否需要授权',
    dataIndex: 'isAuth',
  },
  {
    title: '状态',
    dataIndex: 'status',
  },
  {
    title: '创建时间',
    dataIndex: 'createDate',
    slots: { customRender: 'createDate' }
  },
  {
    title: '操作',
    key: 'operation',
    slots: { customRender: 'operation' }
  },
];
import { defineComponent, reactive, onBeforeMount, toRefs } from 'vue';
import { Card,Tabs } from "ant-design-vue";
import Breadcrumb from '../../components/Breadcrumb/index.vue';
import { getServiceInspectiond } from '../../api/platformCheck/index'
export default defineComponent({
  components: {
    Breadcrumb,
    Card,
    Tabs
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
        total:0,
        serviceName:'',
        start: '',
        end: ''
      },
      dataSource:[],
      visible: false,
      modalTitle: '',
      form:{
        name:'',
        code: '',
        remark: ''
      },
      rules: {
        name: [
          { required: true, message: '业务类型名称不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '业务类型名称在2-20个字符之间', trigger: 'blur' },
          { pattern: /^[^\s]*$/, message: '业务类型名称不能输入空格', trigger: 'blur' },
          // { validator: validateInput, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '业务类型编码不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '业务类型编码在2-20个字符之间', trigger: 'blur' },
          { pattern: /^[^\s]*$/, message: '业务类型编码不能输入空格', trigger: 'blur' },
          // { validator: validateInput, trigger: 'blur' }
        ]
      },
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
        serviceName: state.pagination.serviceName,
        start: state.pagination.start,
        end: state.pagination.end,
        current: state.pagination.current,
        size: state.pagination.pageSize,
      }
      const { success, body } = await getServiceInspectiond(params);
      if (success) {
        state.loading = false;
        state.dataSource = body.records;
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
      if (status === 'edit') {
          let params = {
            userid: obj.id
          }
          let res = await getUserByID(params);
          const { success, data } = res;
          if (success) {
            state.form = Object.assign({},data.userInfo);
          }
      }
    }
    const submitData = () => {

    }
    const tabChange = async (value) => {
      let res = null;
      switch(value) {
        case 'user':

          break;
        case 'org':

          break;
        case 'area':
          break;
        default:
          break;
      }
    }
    return {
      ...toRefs(state),
      removeData,
      handleTableChange,
      handleModal,
      submitData,
      tabChange,
      columns,
    };
  }
})
</script>
<style lang="less" scoped>
@import url('../../assets/style/common.less');
</style>
