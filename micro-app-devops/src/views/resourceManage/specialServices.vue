<!--
 * @Author: 任继民
 * @Date: 2021-02-04 15:10:12
 * @LastEditors: 任继民
 * @LastEditTime: 2021-02-24 10:22:40
 * @Description:专题服务
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
        <div>
          <a-button type="primary" @click="handlerClick('add',{})">
            <template #icon><PlusOutlined /></template>新增专题服务
          </a-button>
        </div>
      </div>
      <a-table :columns="columns" :data-source="dataSource" :pagination="pagination" :loading="loading"  @change="handleTableChange" :row-key="record => record.id" bordered>
        <template #disabled="{record}">
          <span v-if="record.disabled == '0'">启用</span>
          <span v-else>禁用</span>
        </template>
        <template #create_date="{record}">
          <span>{{formatSeconds(record.create_date)}}</span>
        </template>
        <template #operation="{record}">
          <section class="operate-ico">
            <img @click="handlerClick('edit', record)" src="../../assets/images/bianji.png" alt="">
            <img @click="handlerClick('disabled', record)" src="../../assets/images/stop-icon.png" alt="">
            <img @click="handlerClick('del', record)" src="../../assets/images/shanchu.png" alt="">
          </section>
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
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item ref="name" label="名称" v-bind="validateInfos.name">
          <a-input v-model:value="modelRef.name" />
        </a-form-item>
        <a-form-item ref="name" label="编码" v-bind="validateInfos.code">
          <a-input v-model:value="modelRef.code" />
        </a-form-item>
        <a-form-item ref="name" label="排序" v-bind="validateInfos.show_index">
          <a-input type="number" v-model:value="modelRef.show_index" />
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
    title: '序号',
    customRender: ({text, record, index}) => `${index + 1}`,
  },
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '编码',
    className: 'column-money',
    dataIndex: 'code',
  },
  {
    title: '排序',
    dataIndex: 'show_index',
  },
  {
    title: '状态',
    dataIndex: 'disabled',
    slots: { customRender: 'disabled' }
  },
  {
    title: '创建时间',
    dataIndex: 'create_date',
    slots: { customRender: 'create_date' }
  },
  {
    title: '操作',
    key: 'operation',
    slots: { customRender: 'operation' }
  },
];
import { defineComponent, reactive, onBeforeMount, toRefs, toRaw } from 'vue';
import { Card, Modal, message } from "ant-design-vue";
import { PlusOutlined } from '@ant-design/icons-vue'
import { useForm } from '@ant-design-vue/use';
import Breadcrumb from '../../components/Breadcrumb/index.vue';
import { getserviceCategoryList, getserviceCategoryAdd, getserviceCategoryUpdate, getserviceCategoryDisable, getserviceCategoryDelete } from '../../api/services/index'
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
      visible: false,
      loading: false,
      pagination: {
        current:1,
        pageSize:10,
        total:0,
        name: '',
        code: ''
      },
      dataSource:[],
      currentStatus: 'add',
      modalTitle: '编辑专题服务',
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    });
    const rulesRef = reactive({
      code: [
        { required: true, message: '编码不能为空' },
        { required: true, min: 2, max: 15, message: '长度为2-15个字符'  },
        { pattern:/^[^\u4e00-\u9fa5]+$/, message:'不能包含汉字' },
        { required: true, pattern: /^[^\s]*$/, message: '编码不能输入空格' },
        // { required: true, validator: validateInput,  }
      ],
      name: [
        { required: true, message: '名称不能为空',  },
        { required: true, min: 2, max: 15, message: '长度为2-15个字符'  },
        { required: true, pattern: /^[^\s]*$/, message: '名称不能输入空格'  },
      ],
      show_index: [
        { required: true, message: '排序不能为空或者字符串' },
      ],
      remark: [
        { pattern: /^[^\s]*$/, message: '备注不能输入空格' },
      ]
    });
    let modelRef = reactive({
      id: '',
      code: '',
      name: '',
      show_index: '',
      remark: '',
    });
    onBeforeMount(() => {
      initData();
    })
    const formatSeconds = (value) => {
      const dateee = new Date(value).toJSON();
      let date = new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
      return date;
    }
    // 初始化数据
    const initData = async () => {
      state.loading = true;
      let params = {
        page: state.pagination.current,
        rows: state.pagination.pageSize,
        name: state.pagination.name,
        code: state.pagination.code,
      }
      const { status, rows, total } = await getserviceCategoryList(params);
      if (status) {
        state.loading = false;
        state.dataSource = rows;
        state.pagination.total = total;
      }
    }
    const handleTableChange = (pagination) => {
      const pager = { ...state.pagination };
      pager.current = pagination.current;
      state.pagination = pager;
      initData();
    }
    const handlerClick = (status,record) => {
      switch(status) {
        case 'add':
          state.visible = true;
          state.modalTitle = '新增专题服务';
          state.currentStatus = 'add';
          modelRef = Object.assign(modelRef,{});
          break;
        case 'edit':
          state.visible = true;
          state.modalTitle = '编辑专题服务';
          state.currentStatus = 'edit';
          modelRef = Object.assign(modelRef,toRaw(record));
          break;
        case 'del':
          deleteData(record);
          break;
        case 'disabled':
          disabledData(record);
          break;
        default:
          break;
      }
    }
    const deleteData = async (record) => {
      Modal.confirm({
        title: `确定删除${record.name}吗？`,
        onOk: async () => {
          let params = {
            id: record.id,
          }
          let res = await getserviceCategoryDelete(params)
          if (res.status) {
            message.success('删除成功')
            initData();
          }
        }
      })
    }
    const disabledData = async (record) => {
      Modal.confirm({
        title: `确定要${record.status=='1'?'开启':'停止'}${record.name}吗？`,
        onOk: async () => {
          let params = {
            id: record.id
          };
          let res = await getserviceCategoryDisable(params)
          if (res.status) {
            initData();
            message.success(`${record.status == '1'?'开启':'停止'}停止成功`)
          }
        }
      })
    }
    const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);
    const submitData = async () => {
      validate()
        .then(async () => {
          if (state.currentStatus === 'add') {
            let params = {
              name: modelRef.name,
              code: modelRef.code,
              show_index: modelRef.show_index,
              remark: modelRef.remark,
            }
            let res = await getserviceCategoryAdd(params)
            const { status } = res
            if (status) {
              message.success('保存成功')
            }else {
              message.warning(res.msg)
            }
          }else {
            let params = {
              id: modelRef.id,
              name: modelRef.name,
              code: modelRef.code,
              show_index: modelRef.show_index,
              remark: modelRef.remark,
            }
            let res = await getserviceCategoryUpdate(params)
            const { status } = res
            if (status) {
              message.success('保存成功')
            }else {
              message.warning(res.msg)
            }
          }
        })
        .catch(res =>{
          console.log(res);
        })
    }
    return {
      ...toRefs(state),
      handleTableChange,
      modelRef,
      rulesRef,
      resetFields,
      validate,
      validateInfos,
      submitData,
      handlerClick,
      formatSeconds,
      columns,
    };
  }
})
</script>
