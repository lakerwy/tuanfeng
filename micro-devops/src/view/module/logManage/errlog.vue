<template>
  <div>
    <HeaderContent :headHeight="'110px'">
      <Form ref="searchForm" :model="pageInfo" inline :label-width="80">
        <!-- <FormItem label="用户ID" prop="userId">
          <Input type="text" v-model="pageInfo.userId" placeholder="请输入用户ID" />
        </FormItem> -->
        <FormItem label="请求IP地址" prop="ip">
          <Input type="text" v-model="pageInfo.ip" placeholder="请输入IP地址" />
        </FormItem>
        <FormItem label="请求信息" prop="msg">
          <Input type="text" v-model="pageInfo.msg" placeholder="请输入请求信息" />
        </FormItem>
        <FormItem label="开始时间" prop="startDate">
          <DatePicker date="yyyy-MM-dd" :options="startOptions" v-model="pageInfo.startDate" type="date"  placeholder="请输入开始时间" @on-change="handleStartTime"	></DatePicker>
        </FormItem>
        <FormItem label="结束时间" prop="endDate">
          <DatePicker date="yyyy-MM-dd" :options="endOptions" v-model="pageInfo.endDate" type="date"  placeholder="请输入结束时间" @on-change="handleEndTime"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSearch(1)">查询</Button>&nbsp;
        </FormItem>
        <FormItem class="errorlogexportitem">
          <Button type="primary" @click="removeData()">删除</Button>&nbsp;
        </FormItem>
        <FormItem class="errorlogbackitem">
          <Button type="primary" @click="handleBackUp(1)">备份日志</Button>&nbsp;
        </FormItem>
        <FormItem class="errorlogexportitem">
          <Upload :action="logUpload" :headers="logheaders" :before-upload="handleUpload"
           :on-success="handleUploadSuccess" :show-upload-list="false" accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
            <div class="errorlogback-upload">
              <img src="../../../assets/images/daoru.png" alt="" srcset="">
              <span>日志恢复</span>
            </div>
          </Upload>
        </FormItem>
      </Form>
    </HeaderContent>
    <Card shadow>
      <div class="search-con search-con-top">
        <div class="total">
          <img src="../../../assets/images/icon-total.png" alt="" srcset="">
          <span class="text">当前数据：</span>
          <span class="num">{{pageInfo.total}}条</span>
        </div>
      </div>
      <Table border tooltip :columns="columns" :data="data" :loading="loading">
        <!-- <template slot="requestMsg" slot-scope="{ row }">
          <Tooltip placement="top" :content="row.requestMsg">
            <span class="ivu-table-cell-tooltip-content">{{row.requestMsg}}</span>
          </Tooltip>
        </template> -->
        <template slot="createDate" slot-scope="{ row }">
          <span>{{row.createDate?row.createDate.replace('T',' '):''}}</span>
        </template>
        <template slot="status" slot-scope="{ row }">
          <div v-if="row.status == '1'"><i style="background:green" class="itablestatus"></i>认证成功</div>
          <div v-else-if="row.status =='0'"><i style="background:#c3cbd6" class="itablestatus"></i>未认证</div>
          <div v-else><i style="background:red" class="itablestatus"></i>认证失败</div>
        </template>
        <!-- <template slot="action" slot-scope="{ row }">
          <img src="../../../assets/images/shanchu.png" alt="" srcset="" @click="handleModal(row,'delete')">
        </template> -->
      </Table>
      <Page
        transfer
        :total="pageInfo.total"
        :current="pageInfo.page"
        :page-size="pageInfo.limit"
        show-elevator

        show-total
        @on-change="handlePage"
        @on-page-size-change="handlePageSize"
      ></Page>
    </Card>
  </div>
</template>

<script>
import Cookie from 'js-cookie'
import { getErrorlog,exportErrorlog, delErrorlog } from '@/api/logs'
import  HeaderContent from '@/components/header-content/index'
export default {
  name: 'SystemRole',
  components: {
    HeaderContent
  },
  data () {
    const validateEn = (rule, value, callback) => {
      let reg = /^[_a-zA-Z0-9]+$/
      if (value === '') {
        callback(new Error('角色标识不能为空'))
      } else if (value !== '' && !reg.test(value)) {
        callback(new Error('只允许字母、数字、下划线'))
      } else {
        callback()
      }
    }
    return {
      titles: ['选择接口', '已选择接口'],
      listStyle: {
        width: '240px',
        height: '500px'
      },
      loading: false,
      modalVisible: false,
      modalTitle: '',
      saving: false,
      current: 'form1',
      forms: ['form1'],
      selectApis: [],
      selectMenus: [],
      pageInfo: {
        total: 0,
        page: 1,
        limit: 10,
        startDate: '',
        endDate: ''
      },
      formItemRules: {
        code: [{ required: true, validator: validateEn, trigger: 'blur' }],
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        authMsg: [
          { required: true, message: '审核信息不能为空', trigger: 'blur' },
          { required: true, pattern: /^[^\s]*$/, message: '审核信息不能包含空格', trigger: 'blur' }
        ]
      },
      formItem: {},
      handleStatus: null,
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 65,
          align: 'center'
        },
        // {
        //   title: '用户ID',
        //   width: 200,
        //   key: 'userId'
        // },
        {
          title: '请求IP地址',
          width: 200,
          key: 'requestIp'
        },
        {
          title: '请求信息',
          key: 'requestMsg',
          tooltip: true
          // slot: 'requestMsg'
        },
        {
          title: '创建时间',
          key: 'createDate',
          width: 200,
          slot: 'createDate'
        },
        // {
        //   title: '操作',
        //   width: 150,
        //   slot: 'action'
        // }
      ],
      data: [],
      curentHandle: 'view',
      logUpload: `${window.globalUrl.API_HOME}/sys/error-log/db`,
      logheaders: {
        'J-Token': Cookie.get('j_s_id')
      },
      startOptions: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now();
        }
      },
      endOptions: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now();
        }
      }
    }
  },
  methods: {
    checkSpecialKey (str) {
      var specialKey =
        "[`~!#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'"
      for (var i = 0; i < str.length; i++) {
        if (specialKey.indexOf(str.substr(i, 1)) != -1) {
          return false
        }
      }
      return true
    },
    handleStartTime(value) {
      this.pageInfo.startDate = value;
      this.endOptions = {
        disabledDate:date =>{
          if (this.pageInfo.startDate) {
            return date && date.valueOf() < new Date(this.pageInfo.startDate).getTime()
          }else {
            return date && date.valueOf() > Date.now();
          }
        }
      }
    },
    handleEndTime(value) {
      this.pageInfo.endDate = value;
      this.startOptions = {
        disabledDate:date =>{
          if (this.pageInfo.endDate) {
            return date && date.valueOf() > new Date(this.pageInfo.endDate).getTime() - 86400000
          }else {
            return date && date.valueOf() > Date.now();
          }
        }
      }
    },
    async handleModal (data, status) {
      this.$refs.form1.resetFields()
      this.curentHandle = status
      if (data) {
        this.modalVisible = true
        let params = {
          id: data.id
        }
        let res = await userAuthorgbyID(params)
        if (res.success) {
          this.formItem = res.data[0]
        }
      }
    },
    async handleSubmit () {
      this.$refs.form1.validate(async valid => {
        if (valid) {
          let params = {
            id: this.formItem.id,
            username: this.formItem.username,
            orgId: this.formItem.orgId,
            status: 1,
            authMsg: this.formItem.authMsg
          }
          let res = await userAuthorgUpdataStatus(params)
          if (res.success) {
            this.$Message.success('审核成功!')
            this.handleSearch()
            this.modalVisible = false
          } else {
            this.$Message.info('审核失败!')
          }
        }
      })
    },
    handleResetForm (form) {
      this.$refs[form].resetFields()
    },
    handleTabClick (name) {
      this.current = name
      // this.handleModal();
    },
    handleReset () {
      const newData = {
        roleId: '',
        roleCode: '',
        roleName: '',
        path: '',
        status: 1,
        menuId: '',
        priority: 0,
        roleDesc: '',
        grantMenus: [],
        grantActions: [],
        expireTime: '',
        isExpired: false,
        userIds: []
      }
      this.formItem = newData
      // 重置验证
      this.forms.map(form => {
        this.handleResetForm(form)
      })
      this.current = this.forms[0]
      this.formItem.grantMenus = []
      this.formItem.grantActions = []
      this.modalVisible = false
      this.saving = false
    },
    async removeData() {
      let ModelTitle = '';
      // 所有条件都不传，删除全部
      if (!this.pageInfo.ip && !this.pageInfo.msg && this.pageInfo.startDate ==='' && this.pageInfo.endDate==='') {
        ModelTitle ='确定要删除全部日志吗？'
      }else{
        ModelTitle = '确定根据查询条件删除日志吗？'
      }
      this.$Modal.confirm({
        title: ModelTitle,
        onOk: async () => {
          let params = {
            requestIp: this.pageInfo.ip,
            requestMsg: this.pageInfo.msg,
            startDate: this.pageInfo.startDate,
            endDate: this.pageInfo.endDate,
            userId: this.pageInfo.userId
          }
          let res = await delErrorlog(params)
          const { success, body } = res
          if (success) {
            this.data = body.records
            // this.selectMenus = treeData(data.records)
            this.pageInfo.total = body.total
            this.loading = false
          }
          if (res.success) {
            this.pageInfo.page = 1
            this.$Message.success('删除成功')
            this.handleSearch()
          } else {
            // this.pageInfo.page = 1
          this.$Message.error(res.status.message)
            this.handleSearch()
          }
        }
      })
    },
    async handleSearch (page) {
      if (page) {
        this.pageInfo.page = page
      }
      this.loading = true
      let params = {
        userId: this.pageInfo.userId,
        ip: this.pageInfo.ip,
        msg: this.pageInfo.msg,
        start: this.pageInfo.startDate,
        end: this.pageInfo.endDate,
        current: this.pageInfo.page,
        size: this.pageInfo.limit
      }
      let res = await getErrorlog(params)
      const { success, body } = res
      if (success) {
        this.data = body.records
        // this.selectMenus = treeData(data.records)
        this.pageInfo.total = body.total
        this.loading = false
      }
    },
    async handleBackUp() {
      let params = {
        requestIp: this.pageInfo.requestIp,
        requestMsg: this.pageInfo.requestMsg,
        startDate: this.pageInfo.startDate,
        endDate: this.pageInfo.endDate,
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
    },
    handlePage (current) {
      this.pageInfo.page = current
      this.handleSearch()
    },
    handlePageSize (size) {
      this.pageInfo.limit = size
      this.handleSearch()
    },
    handleUpload(file) {
      if (file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {

      }else {
        this.$Message.info('上传文件格式错误！')
        return false;
      }
    },
    handleUploadSuccess(response, file, fileList) {
      if (response.success) {
        this.$Message.success('日志恢复成功!')
      }else {
        this.$Message.error('日志恢复失败!')
      }
    }
  },
  mounted: function () {
    this.handleSearch()
  }
}
</script>
<style lang="less">
.errorlogbackitem, .errorlogexportitem {
  .ivu-form-item-content {
    margin-left: 20px !important;
  }
}
.errorlogexportitem {
  .errorlogback-upload{
    display: flex;
    align-items: center;
    padding: 0 10px;
    background-color: #1890ff;
    border-color: #1890ff;
    border-radius: 4px;
    color: #ffffff;
    font-size: 14px;
    img {
      margin-right: 8px;
    }
  }
}
</style>
