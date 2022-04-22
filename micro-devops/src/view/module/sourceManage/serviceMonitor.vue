<!--
 * @Author: 任继民
 * @Date: 2021-04-15 16:15:30
 * @LastEditors: 任继民
 * @LastEditTime: 2021-04-26 14:48:34
 * @Description:专题监控
-->
<template>
  <div>
    <HeaderContent :headHeight="'110px'">
      <Form ref="searchForm" :model="pageInfo" inline :label-width="80">
        <FormItem label="IP地址" prop="ip">
          <Input type="text" v-model="pageInfo.ip" placeholder="请输入IP地址" />
        </FormItem>
        <FormItem label="用户名" prop="ip">
          <Input type="text" v-model="pageInfo.username" placeholder="请输入用户名" />
        </FormItem>
        <FormItem label="专题名称" prop="ip">
          <Input type="text" v-model="pageInfo.subjectName" placeholder="请输入专题名称" />
        </FormItem>
        <!-- <FormItem label="请求信息" prop="msg">
          <Input type="text" v-model="pageInfo.msg" placeholder="请输入请求信息" />
        </FormItem> -->
        <FormItem label="开始时间" prop="startDate">
          <DatePicker date="yyyy-MM-dd" :options="startOptions" v-model="pageInfo.start" type="date"  placeholder="请输入开始时间" @on-change="handleStartTime"	></DatePicker>
        </FormItem>
        <FormItem label="结束时间" prop="end">
          <DatePicker date="yyyy-MM-dd" :options="endOptions" v-model="pageInfo.end" type="date"  placeholder="请输入结束时间" @on-change="handleEndTime"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSearch(1)">查询</Button>&nbsp;
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
          <span>{{row.createTime?row.createTime.replace('T',' '):''}}</span>
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
import { getServicemonitoring, exportErrorlog, delErrorlog } from '@/api/serveiceRegist'
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
        {
          title: 'IP地址',
          width: 200,
          key: 'ip'
        },
        {
          title: '用户名',
          key: 'username',
          tooltip: true
          // slot: 'requestMsg'
        },
        {
          title: '专题名称',
          key: 'subjectName',
          tooltip: true
          // slot: 'requestMsg'
        },
        {
          title: '创建时间',
          key: 'createTime',
          width: 200,
          slot: 'createTime'
        },
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
    async handleSearch (page) {
      if (page) {
        this.pageInfo.page = page
      }
      this.loading = true
      let params = {
        subjectName: this.pageInfo.subjectName,
        ip: this.pageInfo.ip,
        username: this.pageInfo.username,
        start: this.pageInfo.start || null,
        end: this.pageInfo.end  || null,
        current: this.pageInfo.page,
        size: this.pageInfo.limit
      }
      let res = await getServicemonitoring(params)
      const { code, body } = res
      if (code === 59009) {
        this.data = body.records
        // this.selectMenus = treeData(data.records)
        this.pageInfo.total = body.total
        this.loading = false
      }
    },
    handlePage (current) {
      this.pageInfo.page = current
      this.handleSearch()
    },
    handlePageSize (size) {
      this.pageInfo.limit = size
      this.handleSearch()
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
