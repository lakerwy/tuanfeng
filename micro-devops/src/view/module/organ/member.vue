<template>
  <div>
    <Card shadow>
      <Form ref="searchForm" :model="pageInfo" inline :label-width="80">
        <FormItem label="用户名" prop="username">
          <Input type="text" v-model="pageInfo.username" placeholder="请输入用户名" />
        </FormItem>
        <FormItem label="手机号码" prop="name">
          <Input type="text" v-model="pageInfo.phone" placeholder="请输入手机号码" />
        </FormItem>
        <FormItem label="认证状态" prop="authStatus">
          <Select v-model="pageInfo.status" style="width:150px">
            <Option>全部</Option>
            <Option value="0">未认证</Option>
            <Option value="1">认证成功</Option>
            <Option value="2">认证失败</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSearch(1)">查询</Button>&nbsp;
          <!-- <Button @click="handleResetForm('searchForm')">重置</Button> -->
        </FormItem>
      </Form>
      <Table border :columns="columns" :data="data" :loading="loading">
        <template slot="authTime" slot-scope="{ row }">
          <span>{{row.authTime?row.authTime.replace('T',' '):''}}</span>
        </template>
        <template slot="status" slot-scope="{ row }">
          <div v-if="row.status == '1'"><i style="background:green" class="itablestatus"></i>认证成功</div>
          <div v-else-if="row.status =='0'"><i style="background:#c3cbd6" class="itablestatus"></i>未认证</div>
          <div v-else><i style="background:red" class="itablestatus"></i>认证失败</div>
        </template>
        <template slot="action" slot-scope="{ row }">
          <a v-if="row.status == '0'" @click="handleModal(row,'handl')">审核</a>
          <a v-else @click="handleModal(row,'view')">详情</a>
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
    <Modal
      v-model="modalVisible"
      title="审核信息"
      width="40"
      class-name="realname-model"
      @on-cancel="modalVisible=false"
      :mask-closable="false"
    >
      <div>
        <Form
          ref="form1"
          :model="formItem"
          label-position="right"
          :rules="formItemRules"
          :label-width="100"
        >
          <FormItem label="真实姓名:">
            <p v-text="formItem.realname"></p>
          </FormItem>
          <FormItem label="机构名称:">
            <p v-text="formItem.orgName"></p>
          </FormItem>
          <FormItem label="审核信息:" prop="authMsg">
            <Input
              v-model="formItem.authMsg"
              type="textarea"
              :row="4"
              placeholder="请输入审核信息"
              :disabled="curentHandle =='view'?true:false"
              :maxlength="50"
              show-word-limit
            />
          </FormItem>
        </Form>
        <div class="drawer-footer" v-if="curentHandle =='handl'">
          <Button type="default" @click="handleReject">拒绝</Button>&nbsp;
          <Button type="primary" @click="handleSubmit" :loading="saving">同意</Button>
        </div>
        <div class="drawer-footer" v-else>
          <Button type="primary" @click="modalVisible = false">确定</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  userAuthorgList,
  userAuthorgbyID,
  userAuthorgUpdataStatus,
  userAuthorgAdd
} from '@/api/organ/index'
import { startWith, listConvertTree, treeData } from '@/libs/util'

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
    const validateInput = (rule, value, callback) => {
      if (!this.checkSpecialKey(value)) {
        callback(new Error('不能含有特殊字符!'))
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
          title: '用户名',
          key: 'username'
        },
        {
          title: '真实姓名',
          key: 'realname'
        },
        {
          title: '手机号码',
          key: 'phone'
        },
        {
          title: '地址',
          key: 'address'
        },
        {
          title: '认证者',
          key: 'authBy'
        },
        {
          title: '机构名称',
          key: 'orgName'
        },
        {
          title: '认证时间',
          slot: 'authTime',
          key: 'authTime'
        },
        {
          title: '认证状态',
          slot: 'status'
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
        username: this.pageInfo.username || '',
        phone: this.pageInfo.phone || '',
        status: this.pageInfo.status || '',
        current: this.pageInfo.page,
        size: this.pageInfo.limit
      }
      let res = await userAuthorgList(params)
      const { success, data, message } = res
      if (success) {
        this.data = data.records
        this.selectMenus = treeData(data.records)
        this.pageInfo.total = data.total
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
