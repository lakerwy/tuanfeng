<!--
 * @Author: 任继民
 * @Date: 2021-01-28 10:33:41
 * @LastEditors: 任继民
 * @LastEditTime: 2021-03-04 16:38:58
 * @Description: 菜单管理
-->
<template>
  <section>
    <Breadcrumb :BreadHeight='"120px"'>
      <a-form
      layout="inline"
      >
        <a-form-item ref="name" label="账号状态">
          <a-select
            v-model:value="pagination.systemId"
            style="width: 120px"
          >
            <a-select-option :value="item.id" v-for="item in systemList" :key="item.id">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item ref="name" label="菜单名称">
          <a-input v-model:value="pagination.username" placeholder="请输入菜单名称" />
        </a-form-item>
        <a-form-item ref="name" label="菜单编码">
          <a-input v-model:value="pagination.phone"   placeholder="请输入菜单编码" />
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
            <template #icon><PlusOutlined /></template>新增菜单
          </a-button>
        </div>
      </div>
      <a-table :columns="columns" :data-source="dataSource" :pagination="false" :loading="loading"  :row-key="record => record.id" bordered>
        <template #system="{record}" >
          <span>{{ record.system.name }}</span>
        </template>
        <template #operation="{record}">
          <section class="operate-ico">
            <img src="../../assets/images/add-icon.png" @click="handleModal('add-next',record)" alt="" srcset="">
            <img src="../../assets/images/bianji.png" @click="handleModal('edit',record)" alt="" srcset="">
            <img src="../../assets/images/shanchu.png" @click="handleModal('del', record)" alt="" srcset="">
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
        <a-form
          ref="ruleForm"
          :model="modelRef"
          :rules="rulesRef"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-item ref="name" label="菜单名称" v-bind="validateInfos.name">
            <a-input v-model:value="modelRef.name" />
          </a-form-item>
          <a-form-item ref="name" label="菜单编码" v-bind="validateInfos.code">
            <a-input v-model:value="modelRef.code" />
          </a-form-item>
          <a-form-item ref="name" label="菜单链接" v-bind="validateInfos.url">
            <a-input v-model:value="modelRef.url" />
          </a-form-item>
          <a-form-item ref="name" label="显示顺序" v-bind="validateInfos.sort">
            <a-input type="number" v-model:value="modelRef.sort" />
          </a-form-item>
          <a-form-item ref="name" label="所属子系统" v-bind="validateInfos.systemId">
            <a-select v-model:value="modelRef.systemId">
              <a-select-option :value="item.id" v-for="item in systemList" :key="item.id">{{item.name}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
    </a-modal>
  </section>
</template>
<script lang="ts">
const columns = [
  {
    title: '菜单名称',
    dataIndex: 'name',
  },
  {
    title: '菜单编码',
    dataIndex: 'code',
  },
  {
    title: '菜单链接',
    dataIndex: 'url',
  },
  {
    title: '显示顺序',
    dataIndex: 'sort',
  },
  {
    title: '所属子系统',
    dataIndex: 'system',
    slots: { customRender: 'system' }
  },
  {
    title: '操作',
    key: 'operation',
    slots: { customRender: 'operation' }
  },
];
import { defineComponent, reactive, onBeforeMount, toRefs, toRaw } from 'vue';
import { Card, Modal, message  } from "ant-design-vue";
import { useForm } from '@ant-design-vue/use';
import { PlusOutlined } from '@ant-design/icons-vue'
import Breadcrumb from '../../components/Breadcrumb/index.vue';
import { systemMenu, selectList, getsystemMenuByID, addSysMenu, updateSysMenu, delSysMenu } from '../../api/menu/index'
import { setTreeData } from '../../utils/util'
import { getMetaDataCategory,setBusinessDir,updateBusinessDir,deleteBusinessDir } from '../../api/catalog/index'
export default defineComponent({
  components: {
    Breadcrumb,
    Card,
    Modal,
    message,
    PlusOutlined
  },
  setup() {
    const state = reactive({
      loading: false,
      pagination: {
        total:0,
        name:'',
        code: '',
        systemId: ''
      },
      currentStatus: 'add',
      dataSource:[],
      systemList: [],
      visible: false,
      modalTitle: '',
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    });
    let modelRef = reactive({
      id: '',
      name: '',
      code: '',
      url: '',
      sort: '',
      systemId: '',
      type: 0,
      parentId: 0,
    })
    const rulesRef = reactive({
      code: [
        { required: true, message: '菜单编码不能为空' },
        { pattern: /^[^\s]*$/, message: '不能输入空格' },
        { pattern:/^[^\u4e00-\u9fa5]+$/, message:'不能包含汉字' },
        { min: 2, max: 32, message: '长度为2-32个字符' },
        // { validator: validateInput }
        // {required: true, validator: validateEn}
      ],
      name: [
        { required: true, message: '菜单名称不能为空' },
        { pattern: /^[^\s]*$/, message: '不能输入空格' },
        { min: 2, max: 20, message: '长度为2-20个字符' },
        // { validator: validateInput }
      ],
      url: [
        { required: true, message: '菜单链接不能为空' },
        { required: true, pattern: /^[^\s]*$/, message: '不能输入空格' }
        // { required: true, validator: validateEn, trigger: "blur" },
      ],
      sort: [
        // { required: true, message: "显示顺序不能为空", trigger: "blur", },
        // { required: true, validator: validateEn }
        // { type:'number', required: true, message: "显示顺序只能为数字", trigger: "blur" },
      ],
      systemId: [
        { required: true, message: '所属子系统不能为空' }
      ],
    })
    onBeforeMount(() => {
      initData();
      initsysData();
    })
    // 初始化数据
    const initData = async () => {
      state.loading = true;
      let tempparams = {
        name: '',
        code: '',
      }
      const res = await getMetaDataCategory(tempparams);

      let params = {
        code: state.pagination.code,
        name: state.pagination.name,
        systemId: state.pagination.systemId,
      }
      const { success, data } = await systemMenu(params);
      if (success) {
        state.loading = false;
        state.dataSource = setTreeData(data,'parentId');
        state.pagination.total = data.length;
      }
    }
    const initsysData = async () => {
      if (state.systemList.length > 0) return;
      let res = await selectList();
      state.systemList = res;
    }
    const getCurrentInfo = async (record) => {
      let params = {
        id: record.id
      }
      let res = await getsystemMenuByID(params);
      const { success, data } = res;
      if (success) {
        if (state.currentStatus === 'edit') {
          modelRef = Object.assign(modelRef,data.systemMenu);
        }else {
          modelRef.systemId = data.systemMenu.systemId;
          modelRef.parentId = data.systemMenu.id;
        }
      }
    }
    const deleteData = (record) => {
      Modal.confirm({
        title: '确定删除该菜单吗',
        onOk: async () => {
          let params = {
            id: record.id
          }
          let res = await delSysMenu(params)
          if (res.success) {
            message.success('删除成功')
            initData();
          } else {
            if (res.status.code === '404') {
              message.error('"删除失败，请先删除下级菜单!')
            }
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
          state.modalTitle = '添加菜单';
          state.visible = true;
          break;
        case 'add-next':
          state.modalTitle = '添加下级菜单';
          resetFields();
          getCurrentInfo(record);
          state.visible = true;
          break;
        case 'edit':
          state.visible = true;
          state.modalTitle = '编辑菜单';
          getCurrentInfo(record);
          break;
        case 'del':
          deleteData(record)
          break;
        default:
          break;
      }
    }
    const addMenuData = async () => {
      let params =  {
        systemMenu: {
          name: modelRef.name,
          code: modelRef.code,
          url: modelRef.url,
          sort: modelRef.sort,
          systemId: modelRef.systemId,
          parentId: modelRef.parentId,
          type: '0'
        },
        attributeList: []
      };
      let res = await addSysMenu(params);
      if (res.success) {
        message.success('新增成功!!')
        initData();
        // initData();
        state.visible = false;
      } else {
        message.error(res.status.message)
      }
    }
    const editMenuData = async () => {
      let params =  {
        systemMenu: {
          id: modelRef.id,
          name: modelRef.name,
          code: modelRef.code,
          url: modelRef.url,
          sort: modelRef.sort,
          systemId: modelRef.systemId,
          parentId: modelRef.parentId,
          type: '0'
        },
        attributeList: []
      }
      let res = await updateSysMenu(params);
      if (res.success) {
        message.success('编辑成功')
        state.visible = false;
        initData();
      } else {
        message.error(res.status.message)
      }
    }
    const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);
    const submitData = () => {
      validate()
        .then(async () => {
          if (state.currentStatus === 'add' || state.currentStatus === 'add-next') {
            addMenuData()
          }else if(state.currentStatus === 'edit') {
            editMenuData();
          }
        })
        .catch(err => {
          console.log('error', err);
        });
    }
    const tabChange = async (value) => {
      let res = null;
      switch(value) {
        case 'add':
          state
          break;
        case 'add-next':

          break;
        case 'edit':
          break;
        case 'del':
          break;
        default:
          break;
      }
    }
    return {
      ...toRefs(state),
      initData,
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
