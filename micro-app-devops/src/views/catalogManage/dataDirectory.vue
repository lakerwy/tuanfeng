<!--
 * @Author: 任继民
 * @Date: 2021-01-18 14:08:27
 * @LastEditors: 任继民
 * @LastEditTime: 2021-03-23 16:56:09
 * @Description: 数据目录
-->
<template>
  <section>
    <Breadcrumb >

    </Breadcrumb>
    <a-card :loading="loading" class="contentCard">
      <div class="search-con search-con-top">
        <div class="total">
          <img src="../../assets/images/icon-total.png" alt="" srcset="">
          <span class="text">当前数据：</span>
          <span class="num">{{total}}条</span>
        </div>
        <div>
          <a-button type="primary" @click="handleModal('add')">
            <template #icon><PlusOutlined /></template>添加数据目录
          </a-button>
        </div>
      </div>
      <a-table :columns="columns" :data-source="dataSource" :pagination="pagination" :loading="loading"   :row-key="record => record.id" bordered>
        <template #operation="{record}" >
          <div class="operate-ico">
            <img @click="handleModal('add', record)" src="../../assets/images/add-icon.png" alt="" srcset="">
            <img @click="handleModal('edit', record)" src="../../assets/images/bianji.png" alt="" srcset="">
            <img @click="handleModal('del', record)" src="../../assets/images/shanchu.png" alt="">
          </div>
        </template>
      </a-table>
    </a-card>
    <a-modal
        v-model:visible="visible"
        :title="modalTitle"
        ok-text="确认"
        cancel-text="取消"
        @cancel="resetFields"
        @ok="submitData"
      >
      <a-form
        ref="ruleForm"
        :model="modelRef"
        :rules="rulesRef"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item ref="name" label="目录名称" v-bind="validateInfos.name">
          <a-input v-model:value="modelRef.name" placeholder="请输入目录名称"/>
        </a-form-item>
        <a-form-item ref="aliasname" label="目录别名" v-bind="validateInfos.aliasname">
          <a-input v-model:value="modelRef.aliasname" placeholder="请输入目录别名"/>
        </a-form-item>
        <a-form-item ref="type" label="目录类型" v-bind="validateInfos.type">
          <a-input v-model:value="modelRef.type" placeholder="请输入目录类型"/>
        </a-form-item>
      </a-form>
      </a-modal>
  </section>
</template>
<script lang="ts">
const columns = [
  {
    title: '目录名称',
    dataIndex: 'name',
  },
  {
    title: '目录别名',
    dataIndex: 'aliasname',
  },
  {
    title: '目录类型',
    dataIndex: 'type',
  },
  {
    title: '创建者',
    dataIndex: 'createUser',
  },
  {
    title: '创建时间',
    dataIndex: 'createDate',
  },
  {
    title: '操作',
    key: 'operation',
    width: 240,
    slots: { customRender: 'operation' }
  },
];
import { defineComponent, reactive, onBeforeMount, toRefs } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { useForm } from '@ant-design-vue/use';
import Breadcrumb from '../../components/Breadcrumb/index.vue';
import { getMetaDataCategory,setMetaDataCategory,updateMetaDataCategory,deleteMetaDataCategory } from '../../api/catalog/index'
import { setTreeData } from '../../utils/util';
import { message, Modal } from 'ant-design-vue';
export default defineComponent({
  components: {
    Breadcrumb,
    Modal,
    PlusOutlined
  },
  setup() {
    const state = reactive({
      formInline: {
        name: '',
        code: '',
      },
      loading: false,
      visible: false,
      pagination: false,
      total: 0,
      dataSource:[],
      operationState: 'add',
      currentId: null,
      modalTitle:'新增数据目录',
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    });
    let modelRef= reactive({
      id: '',
      name:'',
      aliasname:'',
      type: ''
    })
    const rulesRef = reactive({
      name: [
        { required: true, message: '目录名称不能为空' },
        { min: 2, max: 20, message: '目录名称在2-20个字符之间' },
        { pattern: /^[^\s]*$/, message: '目录名称不能输入空格' },
        // { validator: validateInput }
      ],
      aliasname: [
        { required: true, message: '目录别名不能为空' },
        { min: 2, max: 20, message: '目录别名在2-20个字符之间' },
        { pattern: /^[^\s]*$/, message: '目录别名不能输入空格' },
        // { validator: validateInput }
      ]
    })
    onBeforeMount(() => {
      initData();
    })
    // 初始化数据
    const initData = async () => {
      state.loading = true;
      let params = {
        name: state.formInline.name,
        code: state.formInline.code,
      }
      const { success, body } = await getMetaDataCategory(params);
      if (success) {
        state.loading = false;
        state.dataSource = setTreeData(body,'parentId')
        state.total = body.length;
      }
    }
    const handleModal = async (status,record) => {
      switch(status) {
        case 'add':
          addData(record);
          break;
        case 'edit':
          editData(record);
          break;
        case 'del':
          removeData(record)
          break;
        default:
          break;
      }
    }
    const addData = async (text) => {
      state.visible = true;
      state.operationState = 'add';
      state.modalTitle = '新增数据目录';
      modelRef = Object.assign(modelRef,{});
      if (text) {
        state.currentId = text.id
      }
    }
    const editData = async (record) => {
      state.visible = true;
      state.operationState = 'edit';
      state.modalTitle = '编辑数据目录';
      modelRef = Object.assign(modelRef,record)
    }
    const removeData = (text) => {
      Modal.confirm({
        title: '确定要删除该条数据吗?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
          let res = await deleteMetaDataCategory(text.id);
          const { success } = res;
          if (success) {
            message.success('数据目录删除成功！')
            // debugger
            await initData();
          }
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
    const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);
    const submitData = async () => {
      validate()
        .then(async () => {
          if (state.operationState === 'add') {
            let params = {
              aliasname: modelRef.aliasname,
              name: modelRef.name,
              type: modelRef.type,
              parentId: 0,
            };
            if (state.currentId) {
              params.parentId = state.currentId;
            }
            let res = await setMetaDataCategory(params);
            const { success } = res;
            if (success) {
              message.success('新增数据目录成功！')
              state.visible = false;
              await initData();
            }
          }else {
            let params = {
              aliasname: modelRef.aliasname,
              name: modelRef.name,
              type: modelRef.type,
              id: modelRef.id
            };
            let res = await updateMetaDataCategory(params);
            const { success } = res;
            if (success) {
              message.success('编辑数据目录成功！')
              state.visible = false;
              await initData();
            }
          }
        })
        .catch(err => {
          console.log('error', err);
        });
    }
    return {
      ...toRefs(state),
      handleModal,
      addData,
      editData,
      removeData,
      submitData,
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
