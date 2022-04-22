<!--
 * @Author: 任继民
 * @Date: 2021-01-18 10:35:11
 * @LastEditors: 任继民
 * @LastEditTime: 2021-03-23 15:50:56
 * @Description:
-->
<template>
  <section>
    <Breadcrumb :BreadHeight='"120px"'>
      <a-form
      layout="inline"
      >
        <a-form-item  label="请求IP地址">
          <a-input v-model:value="pagination.ip" placeholder="请输入请求IP地址" />
        </a-form-item>
        <a-form-item  label="请求信息">
          <a-input v-model:value="pagination.msg"   placeholder="请输入请求信息" />
        </a-form-item>
        <a-form-item  label="请求开始日期">
          <a-date-picker @change="startChange" v-model:value="pagination.start" format="YYYY-MM-DD"/>
        </a-form-item>
        <a-form-item  label="请求结束日期">
          <a-date-picker @change="endChange" v-model:value="pagination.end" format="YYYY-MM-DD"/>
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            @click.native="initData"
          >
            查询
          </a-button>
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            @click.native="handleBackUp"
          >
            备份日志
          </a-button>
        </a-form-item>
        <a-form-item>
          <a-upload
            v-model:file-list="fileList"
            :showUploadList="false"
            name="file"
            :action="logUpload"
            :headers="headers"
            @change="handleChange"
          >
            <a-button>
              <upload-outlined></upload-outlined>
              恢复日志
            </a-button>
          </a-upload>
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
      </div>
      <a-table :columns="columns" :data-source="dataSource" :pagination="pagination" :loading="loading"  @change="handleTableChange" :row-key="record => record.id" bordered>
        <template #operation="{text}">
          <img @click="removeData(text)" src="../../assets/images/shanchu.png" alt="">
        </template>
      </a-table>
    </a-card>
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
    title: '请求IP地址',
    width:240,
    dataIndex: 'requestIp',
  },
  {
    title: '请求信息',
    ellipsis: true,
    dataIndex: 'requestMsg',
  },
  {
    title: '请求时间',
    width:240,
    dataIndex: 'requestTime',
  },
  {
    title: '操作',
    key: 'operation',
    width: 150,
    slots: { customRender: 'operation' }
  },
];
import Cookie from 'js-cookie'
import { defineComponent, reactive, onBeforeMount, toRefs, ref } from 'vue';
import { Card, message } from "ant-design-vue";
import Breadcrumb from '../../components/Breadcrumb/index.vue';
import { getErrorlog, exportErrorlog } from '../../api/log/index';


export default defineComponent({
  components: {
    Breadcrumb,
    Card,
    message
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
        ip: '',
        msg: '',
        start: '',
        end: ''
      },
      dataSource:[],
      headers: {
        'J-Token': Cookie.get('j_s_id')
      },
      logUpload: `${window.globalUrl.API_HOME}/sys/error-log/db`,
    });
    const fileList = ref([]);
    onBeforeMount(() => {
      initData();
    })
    // 初始化数据
    const initData = async () => {
      state.loading = true;
      let params = {
        current: state.pagination.current,
        size: state.pagination.pageSize,
        ip: state.pagination.ip,
        msg: state.pagination.msg,
        start: state.pagination.start,
        end: state.pagination.end
      }
      const { success, body } = await getErrorlog(params);
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
    const getCurrentStyle = (current, today) => {
      const style = {
        border: '',
        borderRadius: ''
      };
      if (current.date() === 1) {
        style.border = '1px solid #1890ff';
        style.borderRadius = '50%';
      }
      return style;
    }
    const startChange = (value, dateString) => {
      state.pagination.start = dateString
    }
    const endChange = (value, dateString) => {
      state.pagination.end = dateString
    }
    const handleBackUp = async () =>{
      let params = {
        ip: state.pagination.ip,
        msg: state.pagination.msg,
        start: state.pagination.start,
        end: state.pagination.end
      }
      let res = await exportErrorlog(params);
      // 创建一个 a 标签，并隐藏 a 标签
      let a = document.createElement("a");
      a.style.display = "none";

      // 对象 URL 绑定到 a 标签上
      a.href = window.URL.createObjectURL(new Blob([res], {type: "application/vnd.ms-excel"}));

      // 给 a 标签添加 download 属性 与 文件名
      a.setAttribute("download", `系统异常日志${new Date().toLocaleString()}.xls`);
      console.log(a)
      // 把 a 标签挂载到 dom 树上并执行 a 标签的 click 事件
      document.body.appendChild(a);
      a.click();

      // 释放我们创建的 url 和 a 标签
      window.URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
    }
    const handleChange = (info) => {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        if (info.file.response.success) {
          message.success(`${info.file.name}导入成功！`);
        }else {
          message.error(`${info.file.name} 导入失败！`);
        }
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败！`);
      }
    }
    return {
      ...toRefs(state),
      fileList,
      initData,
      removeData,
      handleTableChange,
      getCurrentStyle,
      startChange,
      endChange,
      handleBackUp,
      handleChange,
      columns,
    };
  }
})
</script>
<style lang="less" scoped>
@import url('../../assets/style/common.less');
</style>
