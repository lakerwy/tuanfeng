<!--
 * @Author: 任继民
 * @Date: 2021-01-18 13:56:50
 * @LastEditors: 任继民
 * @LastEditTime: 2021-02-23 11:37:38
 * @Description: 业务类型
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
            <template #icon><PlusOutlined /></template>添加业务类型
          </a-button>
        </div>
      </div>
      <a-table :columns="columns" :data-source="dataSource" :pagination="pagination" :loading="loading"   :row-key="record => record.id" bordered>
        <template #operation="{record}" >
          <div class="operate-ico">
            <img @click="addData(record)" src="../../assets/images/add-icon.png" alt="" srcset="">
            <img @click="editData(record)" src="../../assets/images/bianji.png" alt="" srcset="">
            <img @click="removeData(record)" src="../../assets/images/shanchu.png" alt="">
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
        <a-form-item ref="name" label="业务类型名称" v-bind="validateInfos.name">
          <a-input v-model:value="modelRef.name" />
        </a-form-item>
        <a-form-item ref="name" label="业务类型编码" v-bind="validateInfos.code">
          <a-input v-model:value="modelRef.code" />
        </a-form-item>
        <a-form-item ref="name" label="备注" v-bind="validateInfos.remark">
          <a-input v-model:value="modelRef.remark" />
        </a-form-item>
      </a-form>
    </a-modal>
  </section>
</template>
<script lang="ts">
const columns = [
  {
    title: '业务类型名称',
    dataIndex: 'name',
  },
  {
    title: '业务类型编码',
    ellipsis: true,
    dataIndex: 'code',
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
    title: '备注',
    dataIndex: 'remark',
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
import { getBusinessDir,setBusinessDir,updateBusinessDir,deleteBusinessDir } from '../../api/catalog/index'
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
      modalTitle:'新增业务类型',
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    });
    let modelRef= reactive({
      id: '',
      name:'',
      code: '',
      remark: ''
    })
    const rulesRef = reactive({
      name: [
        { required: true, message: '业务类型名称不能为空' },
        { min: 2, max: 20, message: '业务类型名称在2-20个字符之间' },
        { pattern: /^[^\s]*$/, message: '业务类型名称不能输入空格' },
        // { validator: validateInput }
      ],
      code: [
        { required: true, message: '业务类型编码不能为空' },
        { min: 2, max: 20, message: '业务类型编码在2-20个字符之间' },
        { pattern: /^[^\s]*$/, message: '业务类型编码不能输入空格' },
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
      const { success, body } = await getBusinessDir(params);
      if (success) {
        state.loading = false;
        state.dataSource = setTreeData(body,'parentId')
        state.total = body.length;
      }
    }
    const addData = async (text) => {
      state.visible = true;
      state.operationState = 'add';
      state.modalTitle = '新增业务类型';
      modelRef = Object.assign(modelRef, {});
      if (text) {
        state.currentId = text.id
      }
    }
    const editData = async (text) => {
      state.visible = true;
      state.operationState = 'edit';
      state.modalTitle = '编辑业务类型';
      modelRef = Object.assign({},text)
    }
    const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);
    const submitData = async () => {
      validate()
        .then(async () => {
          if (state.operationState === 'add') {
            let params = {
              code: modelRef.code,
              name: modelRef.name,
              remark: modelRef.remark,
              parentId: 0,
            };
            if (state.currentId) {
              params.parentId = state.currentId;
            }
            let res = await setBusinessDir(params);
            const { success } = res;
            if (success) {
              message.success('新增业务类型成功！')
              state.visible = false;
              initData();
            }
          }else {
            let params = {
              id: modelRef.id,
              code: modelRef.code,
              name: modelRef.name,
              remark: modelRef.remark,
            };
            let res = await updateBusinessDir(params);
            const { success } = res;
            if (success) {
              message.success('编辑业务类型成功！')
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
          let res = await deleteBusinessDir(text.id);
          const { success } = res;
          if (success) {
            message.success('业务类型删除成功！')
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
