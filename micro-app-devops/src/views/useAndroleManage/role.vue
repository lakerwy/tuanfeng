<!--
 * @Author: 任继民
 * @Date: 2021-01-28 10:23:37
 * @LastEditors: 任继民
 * @LastEditTime: 2021-03-04 16:30:50
 * @Description: 角色
-->
<template>
  <section>
    <Breadcrumb :BreadHeight='"120px"'>
      <a-form
      layout="inline"
      >
        <a-form-item ref="name" label="角色名称">
          <a-input v-model:value="pagination.name" placeholder="请输入角色名称" />
        </a-form-item>
        <a-form-item ref="name" label="角色编码">
          <a-input v-model:value="pagination.code"   placeholder="请输入角色编码" />
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
            <template #icon><PlusOutlined /></template>新增角色
          </a-button>
        </div>
      </div>
      <a-table :columns="columns" :data-source="dataSource" :pagination="pagination" :loading="loading"  @change="handleTableChange" :row-key="record => record.id" bordered>
        <template #createDate="{record}" >
          <span>{{record.createDate? record.createDate.replace("T", ' '):''}}</span>
        </template>
        <template #operation="{record}">
          <section class="operate-ico">
            <a-tooltip content="编辑" placement="top">
              <img src="../../assets/images/bianji.png" @click="handleModal('edit', record)" alt="" srcset="">
            </a-tooltip>
            <a-tooltip content="删除" placement="top">
              <img src="../../assets/images/shanchu.png" @click="handleModal('del',record)" alt="" srcset="">
            </a-tooltip>
          </section>
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
            :model="modelRef"
            :rules="rulesRef"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-form-item label="角色名称" v-bind="validateInfos.name">
              <a-input v-model:value="modelRef.name" />
            </a-form-item>
            <a-form-item label="角色编码" v-bind="validateInfos.code">
              <a-input v-model:value="modelRef.code" />
            </a-form-item>
            <a-form-item label="角色描述" v-bind="validateInfos.remark">
              <a-input v-model:value="modelRef.remark" />
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="org" tab="角色成员" force-render v-if="currentStatus ==='edit'">
          <a-transfer
            :titles="['选择用户', '已选择用户']"
            :data-source="rolelistData"
            show-search
            :filter-option="filterOption"
            :rowKey="record => record.id"
            :target-keys="targetKeys"
            :render="item => item.username"
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
    title: '角色名称',
    dataIndex: 'name',
  },
  {
    title: '角色编码',
    dataIndex: 'code',
  },
  {
    title: '角色描述',
    dataIndex: 'remark',
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
import { defineComponent, reactive, onBeforeMount, toRefs, toRaw } from 'vue';
import { Card,Tabs, Modal, message } from "ant-design-vue";
import { PlusOutlined } from '@ant-design/icons-vue'
import { useForm } from '@ant-design-vue/use';
import Breadcrumb from '../../components/Breadcrumb/index.vue';
import { getRoles, findById, delById, addRole, updateRole } from '../../api/user/index'
export default defineComponent({
  components: {
    Breadcrumb,
    Card,
    PlusOutlined,
    Tabs
  },
  setup() {
    const state = reactive({
      loading: false,
      pagination: {
        current:1,
        pageSize:10,
        total:0,
        name:'',
        code: ''
      },
      dataSource:[],
      rolelistData: [],
      targetKeys:[],
      currentStatus: '',
      visible: false,
      modalTitle: '',
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    });
    let modelRef = reactive({
      id :'',
      name:'',
      code: '',
      remark: '',
      addUserList: [],
      delUserList: []
    })
    const rulesRef = reactive({
      code: [
        { required: true, message: '角色编码不能为空', trigger: 'blur' },
        { min: 1, message: '角色编码不少于一个字符', trigger: 'blur' },
        { max: 12, message: '角色编码最长为12个字符', trigger: 'blur' },
        { pattern: /^[^\s]*$/, message: '角色编码不能输入空格', trigger: 'blur' },
        { pattern: /^[0-9a-zA-Z_]+$/, message: '角色编码必须是英文数字组合', trigger: 'blur' }
        // {required: true, validator: validateEn, trigger: 'blur'}
      ],
      name: [
        { required: true, message: '角色名称不能为空', trigger: 'blur' },
        { min: 1, message: '角色名称不少于一个字符', trigger: 'blur' },
        { max: 12, message: '角色名称最长为12个字符', trigger: 'blur' },
        { pattern: /^[^\s]*$/, message: '角色名称不能输入空格', trigger: 'blur' },
        // { validator: validateInput, trigger: 'blur' }
      ],
      remark: [{ pattern: /^[^\s]*$/, message: '不能输入空格', trigger: 'blur' }]
    })
    onBeforeMount(() => {
      initData();
    })
    // 初始化数据
    const initData = async () => {
      state.loading = true;
      let params = {
        code: state.pagination.code,
        name: state.pagination.name,
        current: state.pagination.current,
        size: state.pagination.pageSize,
      }
      const { success, data } = await getRoles(params);
      if (success) {
        state.loading = false;
        state.dataSource = data.records;
        state.pagination.total = data.total;
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
    const handleModal = async (status, obj) => {
      switch(status) {
        case 'add':
          state.visible = true;
          state.currentStatus = status;
          state.modalTitle = '新增角色';
          resetFields();
          break;
        case 'edit':
          state.visible = true;
          state.currentStatus = status;
          state.modalTitle = '编辑角色';
          modelRef = Object.assign(modelRef, obj);
          setRolelist(obj);
          break;
        case 'del':
          delData(obj);
          break;
        default:
          break;
      }
    }
    const setRolelist = async (obj) => {
      state.rolelistData = [];
      state.targetKeys = [];
      let params = {
        id: obj.id
      }
      let res = await findById(params);
      const { success, data } = res;
      if (success) {
        data.hasRoleUser.forEach(item => {
          state.rolelistData.push(item);
          state.targetKeys.push(item.id);
        });
        data.notHasRoleUser.forEach(item => {
          state.rolelistData.push(item);
        });
      }
    }
    const delData = async (info) => {
      Modal.confirm({
        title: '确定删除吗？',
        onOk: async () => {
          let params = {
            id: info.id
          }
          let res = await delById(params)
          if (res.success) {
            message.success('删除成功');
            state.visible = false;
            initData();
          }
        }
      })
    }
    const handleChange = (targetKeys, direction, moveKeys) => {
      state.targetKeys = targetKeys;
      modelRef.delUserList = [];
      modelRef.addUserList = [];
      if (direction === 'left') {
        modelRef.delUserList = moveKeys;
      }else if (direction === 'right') {
        modelRef.addUserList = moveKeys;
      }
    }
    const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);
    const submitData = () => {
      validate()
        .then(async () => {
          if (state.currentStatus === 'add') {
            let params = {
              name: modelRef.name,
              code: modelRef.code,
              remark: modelRef.remark
            };
            let res = await addRole(params);
            if (res.success) {
              message.success('添加角色成功!')
              state.visible = false;
              initData()
            } else {
              message.info(res.status.message)
            }
          }else {
            let params = {
              role: {
                id: modelRef.id,
                name: modelRef.name,
                code: modelRef.code,
                remark: modelRef.remark
              },
              addMenuList: [],
              delMenuList: [],
              addUserList: modelRef.addUserList,
              delUserList: modelRef.delUserList
            }
            let res = await updateRole(params);
            if (res.success) {
              message.success('编辑角色成功!')
              state.visible = false;
              initData()
            } else {
              message.info(res.status.message)
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
      handleChange,
      handleModal,
      submitData,
      tabChange,
      resetFields,
      validate,
      validateInfos,
      modelRef,
      rulesRef,
      columns,
    };
  }
})
</script>
<style lang="less" scoped>
@import url('../../assets/style/common.less');
</style>
