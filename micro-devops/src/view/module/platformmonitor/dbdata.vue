<template>
  <div>
    <Card shadow>
      <Form ref="searchForm" :model="pageInfo" inline :label-width="80">
        <FormItem label="请求IP地址" prop="requestIp">
          <Input type="text" v-model="pageInfo.username" placeholder="请输入IP地址" />
        </FormItem>
        <FormItem label="请求信息" prop="requestMsg">
          <Input type="text" v-model="pageInfo.username" placeholder="请输入请求信息" />
        </FormItem>
        <FormItem label="开始时间" prop="startDate">
          <DatePicker type="datetime" ref="startDate" @on-change="showTimePanel('startDate')"  v-model="pageInfo.startDate"  placeholder="请输入开始时间"></DatePicker>
        </FormItem>
        <FormItem label="结束时间" prop="endDate">
          <DatePicker type="datetime" ref="endDate" @on-change="showTimePanel('endDate')"  v-model="pageInfo.endDate"  placeholder="请输入开始时间"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSearch(1)">查询</Button>&nbsp;
          <Button type="primary" @click="handleSearch(1)">导出</Button>&nbsp;
          <Button type="primary" @click="handleSearch(1)">上传</Button>&nbsp;
        </FormItem>
      </Form>
      <Table border tooltip :columns="columns" :data="data" :loading="loading">
        <template slot="authTime" slot-scope="{ row }">
          <span>{{row.authTime?row.authTime.replace('T',' '):''}}</span>
        </template>
        <template slot="status" slot-scope="{ row }">
          <div v-if="row.status == '1'"><i style="background:green" class="itablestatus"></i>认证成功</div>
          <div v-else-if="row.status =='0'"><i style="background:#c3cbd6" class="itablestatus"></i>未认证</div>
          <div v-else><i style="background:red" class="itablestatus"></i>认证失败</div>
        </template>
        <template slot="action" slot-scope="{ row }">
          <a  @click="handleModal(row,'delete')">删除</a>
        </template>
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
import { getDbdata, setDbdata, updateDbdata, deleteDbdata, testDbdata } from '@/api/db'
export default {
  name: 'SystemRole',
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
        roleCode: '',
        roleName: ''
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
      formItem: {
        roleId: '',
        roleCode: '',
        roleName: '',
        path: '',
        authMsg: '',
        status: 1,
        menuId: '',
        priority: 0,
        roleDesc: '',
        grantMenus: [],
        grantActions: [],
        expireTime: '',
        isExpired: false,
        userIds: []
      },
      handleStatus: null,
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 65,
          align: 'center'
        },
        {
          title: '数据库地址',
          key: 'address'
        },
        {
          title: '请求信息',
          key: 'connectName',
          tooltip: true
        },
        {
          title: '',
          key: 'dataBaseName'
        },
        {
          title: '',
          key: 'driver'
        },
        {
          title: '端口号',
          key: 'port'
        },
        {
          title: '数据库类型',
          key: 'type'
        },
        {
          title: '数据库用户名',
          key: 'username'
        },
        {
          title: '数据库密码',
          key: 'password'
        },
        {
          title: '创建时间',
          key: 'createDate'
        },
        {
          title: '操作',
          slot: 'action'
        }
      ],
      data: [],
      curentHandle: 'view'
    }
  },
  methods: {
    showTimePanel(refName) {
      this.$refs[refName].onSelectionModeChange('time');
    },
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
    async handleReject () {
      this.$refs.form1.validate(async valid => {
        if (valid) {
          let params = {
            id: this.formItem.id,
            username: this.formItem.username,
            orgId: this.formItem.orgId,
            status: 2,
            authMsg: this.formItem.authMsg
          }
          let res = await userAuthorgUpdataStatus(params)
          if (res.success) {
            this.$Message.success('已拒绝审核!')
            this.handleSearch()
            this.modalVisible = false
          } else {
            this.$Message.info('拒绝审核失败!')
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
        requestIp: this.pageInfo.requestIp,
        requestMsg: this.pageInfo.requestMsg,
        startDate: this.pageInfo.startDate,
        endDate: this.pageInfo.endDate,
        current: this.pageInfo.page,
        size: this.pageInfo.limit
      }
      let res = await getDbdata(params)
      const { success, body } = res
      if (success) {
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
