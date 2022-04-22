<!--
 * @Author: 任继民
 * @Date: 2021-02-04 16:24:39
 * @LastEditors: 任继民
 * @LastEditTime: 2021-02-05 11:24:40
 * @Description: 专题权限
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
          <a-button type="primary" @click="handlerClick('add')">
            <template #icon><PlusOutlined /></template>新增专题
          </a-button>
        </div>
      </div>
      <a-table :columns="columns" :data-source="dataSource" :pagination="pagination" :loading="loading"  @change="handleTableChange" :row-key="record => record.id" bordered>
        <template #disabled="{record}">
          <span v-if="record.disabled == '0'">启用</span>
          <span v-else>禁用</span>
        </template>
        <template #operation="{record}">
          <section class="operate-ico">
            <img @click="handlerClick('edit', record)" src="../../assets/images/bianji.png" alt="">
            <img @click="handlerClick('changePermis', record)" src="../../assets/images/bangding.png" alt="">
            <img @click="handlerClick('del', record)" src="../../assets/images/shanchu.png" alt="">
          </section>
        </template>
      </a-table>
    </a-card>
    <!-- 新增编辑modal -->
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
        <a-form-item label="专题名称" v-bind="validateInfos.subjectName">
          <a-input v-model:value="modelRef.subjectName" />
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 权限modal -->
    <a-modal
        v-model:visible="permisssvisible"
        title="编辑专题权限服务"
        ok-text="确认"
        cancel-text="取消"
        @cancel="resetFields"
        @ok="changePermission"
      >
        <a-transfer
          :titles="['选择服务', '已选择服务']"
          :data-source="serverlist"
          show-search
          :filter-option="filterOption"
          :rowKey="record => record.id"
          :target-keys="targetKeys"
          :render="item => item.service_name"
          @change="handleChange"
          @search="handleSearch"
        />
    </a-modal>
  </section>
</template>
<script lang="ts">
const columns = [
  {
    title: '序号',
    width: 100,
    customRender: ({text, record, index}) => `${index + 1}`,
  },
  {
    title: '专题名称',
    dataIndex: 'subjectName',
  },
  {
    title: '操作',
    key: 'operation',
    slots: { customRender: 'operation' }
  },
];
import { defineComponent, reactive, onBeforeMount, toRefs, toRaw } from 'vue';
import { Card, Modal, message } from "ant-design-vue";
import { useForm } from '@ant-design-vue/use';
import { PlusOutlined } from '@ant-design/icons-vue'
import Breadcrumb from '../../components/Breadcrumb/index.vue';
import { getpxSubject, getServiceList, delpxSubject, getpxSubjectServices, updatepxSubjectRelation,addpxSubject, updatepxSubject } from '../../api/services/index'
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
      permisssvisible: false,
      loading: false,
      pagination: {
        current:1,
        pageSize:10,
        total:0,
        name: '',
        code: ''
      },
      currentCubjectId: null,
      currentStatus: '',
      dataSource:[],
      targetKeys: [],
      serverlist: [],
      modalTitle: '',
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    });
    const rulesRef = reactive({
      subjectName: [
        { required: true, message: '名称不能为空', trigger: 'blur' },
        { required: true, min: 2, max: 15, message: '长度为2-15个字符', trigger: 'blur' },
        { required: true, pattern: /^[^\s]*$/, message: '名称不能输入空格', trigger: 'blur' },
      ]
    });
    let modelRef = reactive({
      id: '',
      subjectName: '',
    });
    onBeforeMount(() => {
      initData();
    })
    // 初始化数据
    const initData = async () => {
      state.loading = true;
      let params = {
        page: state.pagination.current,
        rows: state.pagination.pageSize,
        name: state.pagination.name,
      }
      const { code, body } = await getpxSubject(params);
      if (code === 5900) {
        state.loading = false;
        state.dataSource = body.records;
        state.pagination.total = body.total;
      }
    }
    const handleTableChange = (pagination) => {
      const pager = { ...state.pagination };
      pager.current = pagination.current;
      state.pagination = pager;
      initData();
    }
    const handlerClick = (status,record) => {
      state.currentStatus =  status;
      switch(status) {
        case 'add':
          state.visible = true;
          state.modalTitle = '新增专题权限'
          modelRef.subjectName =  '';
          break;
        case 'edit':
          state.visible = true;
          state.modalTitle = '编辑专题权限'
          modelRef = Object.assign(modelRef,toRaw(record));
          break;
        case 'changePermis':
          state.permisssvisible = true;
          state.currentCubjectId = record.subjectId;
          getServerlist();
          getCurrentServerlist(record);
          break;
        case 'del':
          deleteData(record);
          break;
        default:
          break;
      }
    }
    const getCurrentServerlist = async (record) => {
      let params = {
        subjectId: record.subjectId
      };
      let res = await getpxSubjectServices(params);
      const { code, body } = res
      if (code ===59001) {
        if (body) {
          body.forEach(item => {
            state.targetKeys.push(item.id);
          })
        }else {
          state.targetKeys = [];
        }
      }
    }
    const getServerlist = async () => {
      if (state.serverlist.length > 0) return;
      let params = {
        service_name: '',
        page: 1,
        rows: 999,
        status: '',
        create_date_begin: '',
        create_date_end: '',
      };
      let res = await getServiceList(params);
      const { rows } = res;
      state.serverlist = rows;
    }
    const deleteData = async (record) => {
      Modal.confirm({
        title: `确定删除${record.subjectName}吗？`,
        onOk: async () => {
          let params = {
            id: record.id,
          }
          let res = await delpxSubject(params)
          if (res.code === 59006) {
            initData();
          }else {
            message.error('删除失败！')
          }
        }
      })
    }
    const changePermission = async () => {
      let params = {
        serviceId: state.targetKeys,
        subjectId: state.currentCubjectId
      }
      let res = await updatepxSubjectRelation(params);
      const { code } = res;
      if (code === 59003) {
        message.success('保存成功')
        initData();
      }else {
        message.warning('修改专题服务失败！')
      }
    }
    const handleChange = (targetKeys) => {
      state.targetKeys = targetKeys;
    }
    const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);
    const submitData = async () => {
      validate()
        .then(async () => {
          if (state.currentStatus === 'add') {
            let params = {
              subjectName: modelRef.subjectName
            };
            let res = await addpxSubject(params);
              if (res.code === 59003) {
                state.visible = false;
                message.success('新增成功')
                initData();
              }else {
                message.warning(res.msg)
              }
          }else if(state.currentStatus === 'edit') {
            let params = {
              id: modelRef.id,
              subjectName: modelRef.subjectName
            };
            let res = await updatepxSubject(params);
            if (res.code === 59002) {
              state.visible = false;
              message.success('编辑成功')
              initData();
            }else {
              message.warning(res.msg)
            }
          }
        })
        .catch(err => {
          console.log('error', err);
        });
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
      changePermission,
      handlerClick,
      handleChange,
      columns,
    };
  }
})
</script>
