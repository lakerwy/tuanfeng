<!--
 * @Author: 任继民
 * @Date: 2021-01-18 13:27:07
 * @LastEditors: 任继民
 * @LastEditTime: 2021-02-23 11:35:15
 * @Description: 来源单位
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
          <a-button type="primary" @click="addData()">
            <template #icon><PlusOutlined /></template>添加来源单位
          </a-button>
        </div>
      </div>
      <a-table :columns="columns" :data-source="dataSource" :pagination="pagination" :loading="loading"   :row-key="record => record.id" bordered>
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
        @ok="submitData"
        @cancel="resetFields"
      >
      <a-form
        ref="ruleForm"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item ref="name" label="数据来源名称" v-bind="validateInfos.sourceName">
          <a-input v-model:value="modelRef.sourceName" />
        </a-form-item>
        <a-form-item ref="name" label="数据来源编码" v-bind="validateInfos.sourceCode">
          <a-input v-model:value="modelRef.sourceCode" />
        </a-form-item>
      </a-form>
      </a-modal>
  </section>
</template>
<script lang="ts">
const columns = [
  {
    title: '数据来源名称',
    dataIndex: 'sourceName',
  },
  {
    title: '数据来源编码',
    ellipsis: true,
    dataIndex: 'sourceCode',
  },
  {
    title: '创建者',
    dataIndex: 'createBy',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
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
import { getSourceUnit,setSourceUnit,updateSourceUnit,deleteSourceUnit } from '../../api/catalog/index'
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
      modalTitle:'新增数据来源',
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    });
    let modelRef = reactive({
      id: '',
        sourceName:'',
        sourceCode: ''
    })
    const rulesRef = reactive({
      sourceName: [
        { required: true, message: '数据来源名称不能为空' },
        { min: 2, max: 20, message: '数据来源名称在2-20个字符之间' },
        { pattern: /^[^\s]*$/, message: '数据来源名称不能输入空格' },
        // { validator: validateInput }
      ],
      sourceCode: [
        { required: true, message: '数据来源编码不能为空' },
        { min: 2, max: 20, message: '数据来源编码在2-20个字符之间' },
        { pattern: /^[^\s]*$/, message: '数据来源编码不能输入空格' },
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
        sourceName: state.formInline.name,
        sourceCode: state.formInline.code,
        current: 1,
        size: 200,
      }
      const { success, body } = await getSourceUnit(params);
      if (success) {
        state.loading = false;
        state.dataSource = setTreeData(body,'pid')
        state.total = body.length;
      }
    }
    const addData = async (text) => {
      state.visible = true;
      state.operationState = 'add';
      state.modalTitle = '新增数据来源';
      modelRef = Object.assign(modelRef,{});
      if (text) {
        state.currentId = text.id
      }
    }
    const editData = async (text) => {
      state.visible = true;
      state.operationState = 'edit';
      state.modalTitle = '编辑数据来源';
      modelRef = Object.assign({},text)
    }
    const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);
    const submitData = async () => {
      validate()
        .then(async () => {
          if (state.operationState === 'add') {
            let params = {
              sourceCode: modelRef.sourceCode,
              sourceName: modelRef.sourceName,
              pid: 0,
            };
            if (state.currentId) {
              params.pid = state.currentId;
            }
            let res = await setSourceUnit(params);
            const { success } = res;
            if (success) {
              message.success('新增数据来源成功！')
              state.visible = false;
              initData();
            }
          }else {
            let params = {
              sourceCode: modelRef.sourceCode,
              sourceName: modelRef.sourceCode,
              id: modelRef.id
            };
            let res = await updateSourceUnit(params);
            const { success } = res;
            if (success) {
              message.success('编辑数据来源成功！')
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
          let res = await deleteSourceUnit(text.id);
          const { success } = res;
          if (success) {
            message.success('数据来源删除成功！')
            initData();
          }
        },
        onCancel() {
          console.log('Cancel');
        },
      });


    }
    return {
      ...toRefs(state),
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
