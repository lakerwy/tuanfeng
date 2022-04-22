<!--
 * @Author: 任继民
 * @Date: 2021-01-18 10:51:53
 * @LastEditors: 任继民
 * @LastEditTime: 2021-02-23 11:29:12
 * @Description: 数据领域管理
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
          <span class="num">{{pagination.total}}条</span>
        </div>
        <div>
          <a-button type="primary" @click="addData()">
            <template #icon><PlusOutlined /></template>添加数据领域
          </a-button>
        </div>
      </div>
      <a-table :columns="columns" :data-source="dataSource" :pagination="pagination" :loading="loading"  @change="handleTableChange" :row-key="record => record.id" bordered>
        <template #createTime="{record}">
          <span>{{record.createTime?record.createTime.replace("T", ' '):''}}</span>
        </template>
        <template #operation="{text}" >
          <div class="operate-ico">
            <img @click="addData(text)" src="../../assets/images/add-icon.png" alt="" srcset="">
            <img @click="editData(text)" src="../../assets/images/bianji.png" alt="" srcset="">
            <img @click="removeData(text)" src="../../assets/images/shanchu.png" alt="">
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
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item ref="name" label="数据领域名称" v-bind="validateInfos.dataName">
          <a-input v-model:value="modelRef.dataName" @blur="() => {$refs.dataName.onFieldBlur()}"/>
        </a-form-item>
        <a-form-item ref="name" label="数据领域编码" v-bind="validateInfos.dataCode">
          <a-input v-model:value="modelRef.dataCode" />
        </a-form-item>
      </a-form>
    </a-modal>
  </section>
</template>
<script lang="ts">
const columns = [
  {
    title: '数据领域名称',
    dataIndex: 'dataName',
  },
  {
    title: '数据领域编码',
    ellipsis: true,
    dataIndex: 'dataCode',
  },
  {
    title: '创建者',
    dataIndex: 'createBy',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    slots: { customRender: 'createTime' }
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
import { getDataDomain,setDataDomain,updateDataDomain,deleteDataDomain } from '../../api/catalog/index'
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
      pagination: {
        current:1,
        pageSize:10,
        total:0
      },
      dataSource:[],
      operationState: 'add',
      currentId: null,
      modalTitle:'新增数据领域',
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    });
    let modelRef = reactive({
      id: '',
      dataName:'',
      dataCode: ''
    })
    const rulesRef = reactive({
      dataName: [
        { required: true, message: '数据领域称不能为空', whitespace: true },
        { min: 2, max: 20, message: '数据领域名称在2-20个字符之间' },
        { pattern: /^[^\s]*$/, message: '数据领域名称不能输入空格' },
        // { validator: validateInput, trigger: 'blur' }
      ],
      dataCode: [
        { required: true, message: '数据领域编码不能为空', whitespace: true },
        { min: 2, max: 20, message: '数据领域编码在2-20个字符之间' },
        { pattern: /^[^\s]*$/, message: '数据领域编码不能输入空格' },
        // { validator: validateInput, trigger: 'blur' }
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
        current: state.pagination.current,
        size: state.pagination.pageSize,
      }
      const { success, body } = await getDataDomain(params);
      if (success) {
        state.loading = false;
        state.dataSource = setTreeData(body,'pid')
        state.pagination.total = body.length;
      }
    }
    const addData = async (text) => {
      state.visible = true;
      state.operationState = 'add';
      state.modalTitle = '新增数据领域';
      if (text) {
        state.currentId = text.id
      }
    }
    const editData = async (text) => {
      state.visible = true;
      state.operationState = 'edit';
      state.modalTitle = '编辑数据领域';
      modelRef = Object.assign({},text)
    }
    const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);
    const submitData = async () => {
      validate()
        .then(async () => {
          if (state.operationState === 'add') {
            let params = {
              dataCode: modelRef.dataCode,
              dataName: modelRef.dataName,
              pid: 0,
            };
            if (state.currentId) {
              params.pid = state.currentId;
            }
            let res = await setDataDomain(params);
            const { success } = res;
            if (success) {
              message.success('新增数据领域成功！')
              state.visible = false;
              initData();
            }
          }else {
            let params = {
              dataCode: modelRef.dataCode,
              dataName: modelRef.dataName,
              id: modelRef.id
            };
            let res = await updateDataDomain(params);
            const { success } = res;
            if (success) {
              message.success('编辑数据领域成功！')
              state.visible = false;
              initData();
            }
          }
        })
        .catch(err => {
          console.log('error', err);
        });
    }
    const removeData = async (text) => {
      Modal.confirm({
        title: '确定要删除该条数据吗?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
          let res = await deleteDataDomain(text.id);
          const { success } = res;
        },
        onCancel() {
          console.log('Cancel');
        },
      });


    }
    const handleTableChange = (pagination) => {
      const pager = { ...state.pagination };
      pager.current = pagination.current;
      state.pagination = pager;
      initData();
    }
    return {
      ...toRefs(state),
      addData,
      editData,
      removeData,
      handleTableChange,
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
