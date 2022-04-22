<!--
 * @Author: 任继民
 * @Date: 2021-01-28 11:15:26
 * @LastEditors: 任继民
 * @LastEditTime: 2021-03-04 16:46:07
 * @Description: 机构管理
-->
<template>
  <section>
    <Breadcrumb :BreadHeight='"120px"'>
      <a-form
      layout="inline"
      >
        <a-form-item ref="name" label="机构名称">
          <a-input v-model="pagination.name" placeholder="请输入机构名称" />
        </a-form-item>
        <a-form-item ref="name" label="机构编码">
          <a-input v-model="pagination.code"   placeholder="请输入机构编码" />
        </a-form-item>
        <a-form-item ref="name" label="认证状态">
          <a-select
            v-model="pagination.authStatus"
            style="width: 120px"
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="0">未认证</a-select-option>
            <a-select-option value="1">已认证</a-select-option>
          </a-select>
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
        <div>
          <a-button type="primary" @click="handleModal('add')">
            <template #icon><PlusOutlined /></template>新增机构
          </a-button>
        </div>
      </div>
      <a-table :columns="columns" :data-source="dataSource" :pagination="false" :loading="loading"  @change="handleTableChange" :row-key="record => record.id" bordered>
        <template #isDepart="{record}">
          <span v-if="record.isDepart ==0">组织</span>
          <span v-else>机构</span>
        </template>
        <template #authStatus="{record}">
          <div v-if="record.authStatus== '1'">
            <img src="../../assets/images/icon-pass.png" alt="" srcset="">
            <span>已认证</span>
          </div>
          <div v-else >
            <img src="../../assets/images/icon-failed.png" alt="" srcset="">
            <span>未认证</span>
          </div>
        </template>
        <template #createDate="{record}" >
          <span>{{record.createDate? record.createDate.replace("T", ' '):''}}</span>
        </template>
        <template #operation="{record}">
          <section class="operate-ico">
            <img src="../../assets/images/add-icon.png" @click="handleModal('add-next',record)" alt="" srcset="">
            <a-tooltip content="编辑" placement="top">
              <img src="../../assets/images/bianji.png" @click="handleModal('edit', record)" alt="" srcset="">
            </a-tooltip>
            <a-tooltip content="删除" placement="top">
              <img src="../../assets/images/shanchu.png" @click="handleModal('del', record)" alt="" srcset="">
            </a-tooltip>
          </section>
        </template>
      </a-table>
    </a-card>
    <a-modal
        v-model="visible"
        :title="modalTitle"
        ok-text="确认"
        cancel-text="取消"
        @ok="submitData"
      >
        <a-form
          ref="ruleForm"
          :model="form"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-item label="机构名称" v-bind="validateInfos.name">
            <a-input v-model="modelRef.name" />
          </a-form-item>
          <a-form-item label="机构编码" v-bind="validateInfos.code">
            <a-input v-model="modelRef.code" />
          </a-form-item>
          <a-form-item label="机构管理员" v-bind="validateInfos.adminUser">
            <a-select v-model="modelRef.adminUser">
              <a-select-option :value="item.id" v-for="item in userList" :key="item.id">{{item.username}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
    </a-modal>
  </section>
</template>
<script lang="ts">
const columns = [
  {
    title: '机构名称',
    dataIndex: 'name',
  },
  {
    title: '机构编码',
    dataIndex: 'code',
  },
  {
    title: '组织架构',
    dataIndex: 'isDepart',
    slots: { customRender: 'isDepart' }
  },
  {
    title: '认证状态',
    dataIndex: 'authStatus',
    slots: { customRender: 'authStatus' }
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
import { Card,Tabs, Modal, message } from "ant-design-vue";
import { PlusOutlined } from '@ant-design/icons-vue'
import { useForm } from '@ant-design-vue/use';
import Breadcrumb from '../../components/Breadcrumb/index.vue';
import { getUserlist } from '../../api/user/index'
import { getOrglist, getOrgByID, addOrg, updateOrg, deleteOrg } from '../../api/organ/index'
import { setTreeData } from '../../utils/util'
export default defineComponent({
  components: {
    Breadcrumb,
    Card,
    Tabs,
    Modal,
    message,
    PlusOutlined,
  },
  setup() {
    const state = reactive({
      loading: false,
      pagination: {
        current:1,
        pageSize:200,
        total:0,
        name:'',
        code: '',
        authStatus: ''
      },
      dataSource:[],
      userList: [],
      currentStatus: 'add',
      visible: false,
      modalTitle: '',
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    });
    let modelRef= reactive({
      id: '',
      name: '',
      code: '',
      parentId: 0,
      parentIds: 0,
      isDepart: 0,
      adminUser: '',
    })
    const rulesRef = reactive({
      code: [
        { required: true, message: '机构编码不能为空' },
        {
          required: true,
          pattern: /^[^\s]*$/,
          message: '不能输入空格',
          trigger: 'blur'
        },
        { pattern:/^[^\u4e00-\u9fa5]+$/, message:'不能包含汉字' },
        { min: 2, max: 10, message: '长度在2到10个字符' }
      ],
      name: [
        { required: true, message: '机构名称不能为空' },
        {
          required: true,
          pattern: /^[^\s]*$/,
          message: '不能输入空格',
          trigger: 'blur'
        },
        { min: 2, max: 20, message: '长度在2到20个字符' }
      ],
      adminUser: [
        { required: true, message: '机构管理员不能为空' }
      ]
    })
    onBeforeMount(() => {
      initData();
      initUserList();
    })
    // 初始化数据
    const initData = async () => {
      state.loading = true;
      let params = {
        code: state.pagination.code,
        name: state.pagination.name,
        authStatus: state.pagination.authStatus,
        current: state.pagination.current,
        size: state.pagination.pageSize,
      }
      const { success, data } = await getOrglist(params);
      if (success) {
        state.loading = false;
        state.dataSource = setTreeData(data.records,'parentId');
        debugger
        state.pagination.total = data.total;
      }
    }
    const initUserList = async () => {
      if (state.userList.length > 0) return;
      let params = {
        authStatus: "1",
        current: 1,
        orgId: "",
        phone: "",
        size: 200,
        status: "",
        username: "",
      };
      let res = await getUserlist(params)
      const { success, data } = res;
      if (success) {
        state.userList = data.records;
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
    const getCurrentInfo = async (record) => {
      let params = {
        id: record.id
      }
      let res = await getOrgByID(params);
      const { success, data } = res;
      if (success) {
        if (state.currentStatus === 'edit') {
          modelRef = Object.assign(modelRef,data.org);
        }else {
          // debugger
          modelRef.parentId = data.org.id;
        }
      }
    }
    const deleteData = async (record) => {
      Modal.confirm({
        title: '确定删除该菜单吗',
        onOk: async () => {
          let params = {
            id: record.id
          }
          let res = await deleteOrg(params)
          if (res.success) {
            message.success('删除成功')
            initData();
          } else {
            message.error('删除失败！')
          }
          state.visible = false;
        }
      })
    }
    const handleModal = async (status,record) => {
      state.currentStatus = status;
      switch(status) {
        case 'add':
          resetFields();
          state.modalTitle = '添加机构';
          state.visible = true;
          break;
        case 'add-next':
          state.modalTitle = '添加部门';
          resetFields();
          getCurrentInfo(record);
          state.visible = true;
          break;
        case 'edit':
          state.visible = true;
          state.modalTitle = '编辑机构';
          getCurrentInfo(record);
          break;
        case 'del':
          deleteData(record)
          break;
        default:
          break;
      }
    }
    const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);
    const submitData = () => {
      validate()
        .then(async () => {
          if (state.currentStatus === 'add' || state.currentStatus === 'add-next') {
            let params =  {
              name: modelRef.name,
              code: modelRef.code,
              parentId: modelRef.parentId,
              parentIds: modelRef.parentIds,
              isDepart: modelRef.isDepart,
              adminUser: modelRef.adminUser
            };
            let res = await addOrg(params);
            if (res.success) {
              message.success('新增成功')
              initData();
              state.visible = false;
            } else {
              message.error(res.status.message)
            }
          }else if(state.currentStatus === 'edit') {
            let params =  {
                id: modelRef.id,
                name: modelRef.name,
                code: modelRef.code,
                parentId: modelRef.parentId,
                parentIds: modelRef.parentIds,
                adminUser: modelRef.adminUser
            }
            let res = await updateOrg(params);
            if (res.success) {
              message.success('编辑成功')
              state.visible = false;
              initData();
            } else {
              message.error(res.status.message)
            }
          }
        })
        .catch(err => {
          console.log('error', err);
        });
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
      initData,
      removeData,
      handleTableChange,
      handleModal,
      submitData,
      tabChange,
      modelRef,
      rulesRef,
      resetFields,
      validate,
      validateInfos,
      columns,
    };
  }
})
</script>
<style lang="less" scoped>
@import url('../../assets/style/common.less');
</style>
