<template>
  <div>
    <Card shadow>
      <Form ref="searchForm" :model="pageInfo" inline :label-width="80">
        <FormItem label="用户名">
          <Input type="text" v-model="pageInfo.user" placeholder="请输入用户名" />
        </FormItem>
        <FormItem label="手机号码">
          <Input type="text" v-model="pageInfo.phone" placeholder="请输入手机号码" />
        </FormItem>
        <!--        <FormItem label="部门名称" >
          <Input type="text" v-model="pageInfo.orgId" placeholder="请输入部门名称"/>
        </FormItem>-->
        <FormItem label="认证结果">
          <Select v-model="pageInfo.status" style="width:150px;">
            <Option>全部</Option>
            <Option value="0">待认证</Option>
            <Option value="1">认证通过</Option>
            <Option value="2">认证失败</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSearch(1)">查询</Button>&nbsp;
          <!-- <Button @click="handleResetForm('searchForm')">重置</Button> -->
        </FormItem>
      </Form>
      <Table border :columns="columns" :data="data" :loading="loading">
        <template slot="status" slot-scope="{ row }">
          <div v-if="row.status == '0'"><i style="background:#c3cbd6" class="itablestatus"></i>待认证</div>
          <div v-if="row.status == '1'"><i style="background:green" class="itablestatus"></i>认证通过</div>
          <div v-if="row.status == '2'"><i style="background:red" class="itablestatus"></i>认证失败</div>
        </template>
        <template slot="authTime" slot-scope="{ row }">
          <span>{{row.authTime?row.authTime.replace("T", ' '):''}}</span>
        </template>
        <template slot="action" slot-scope="{ row }">
          <a v-if="row.status == '0'" @click="handleModal(row,'edit')">认证</a>
          <a v-else @click="handleModal(row,'view')">详情</a>
        </template>
      </Table>
      <Page transfer :total="pageInfo.total" :current="pageInfo.page" :page-size="pageInfo.limit" show-elevator
      show-sizer
      show-total
      @on-change="handlePage" @on-page-size-change='handlePageSize'></Page>
    </Card>
    <Modal
      v-model="modalVisible"
      title="认证信息"
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
          <FormItem label="真实姓名:" >
            <p v-text="formItem.realname"></p>
          </FormItem>
          <FormItem label="身份证号码:">
            <p v-text="formItem.idCard"></p>
          </FormItem>
          <FormItem label="身份证正面:">
                <viewer :images="formItem.frontUrl" v-if="formItem.frontUrl">
                    <img  :src="formItem.frontUrl" alt style="width: 188px;height: 100px;" />
                </viewer>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label="身份证反面:">
                <viewer :images="formItem.backUrl" v-if="formItem.backUrl">
                    <img  :src="formItem.backUrl" alt style="width: 188px;height: 100px;" />
                </viewer>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label="认证结果:" v-show="handleStatus == 'view'">
            <span v-if="formItem.status == '0'">待认证</span>
            <span v-if="formItem.status == '1'">认证通过</span>
            <span v-if="formItem.status == '2'">认证失败</span>
          </FormItem>
          <FormItem label="认证信息:" prop="authMsg">
            <Input  :disabled="handleStatus=='view'" v-model="formItem.authMsg"  :maxlength="50"  show-word-limit  type="textarea" :rows="2"  placeholder="请输入认证信息" />
          </FormItem>
        </Form>
        <div class="drawer-footer" v-if="handleStatus !='view'">
          <Button type="default" @click="handleReset" style="margin-right:10px">拒绝</Button>&nbsp;
          <Button type="primary" @click="handleSubmit" :loading="saving">同意</Button>
					<!-- <Button type="default" @click="modalVisible= false">取消</Button> -->
        </div>
        <div class="drawer-footer" v-else>
          <Button type="primary" @click="modalVisible= false">确定</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  getUserAuth,
  getUserAuthByID,
  updateUserAuthStatus
} from '@/api/realname-auth'
import { startWith, listConvertTree } from '@/libs/util'

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
      pageInfo: {
        total: 0,
        page: 1,
        limit: 10,
        roleCode: '',
        roleName: ''
      },
      formItemRules: {
        code: [{ required: true, validator: validateEn, trigger: 'blur' }],
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        authMsg: [{ pattern: /^[^\s]*$/, message: '不能输入空格', trigger: 'blur' }]
      },
      formItem: {
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
      },
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 65,
          align: 'center'
        },
        {
          title: '用户名',
          key: 'user'
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
          title: '认证时间',
          key: 'authTime',
          slot: 'authTime'
        },
        {
          title: '认证者',
          key: 'authBy'
        },
        {
          title: '认证结果',
          slot: 'status'
        },
        {
          title: '操作',
          slot: 'action'
        }
      ],
      handleStatus: 'edit',
      data: []
    }
  },
  methods: {
    async handleModal (data, status) {
      this.modalVisible = true
      this.handleStatus = status
      let params = {
        id: data.id
      }
      let res = await getUserAuthByID(params)
      if (res.success) {
        this.formItem = res.data
      }
    },
    async handleResetForm () {
      let params = {
        id: this.formItem.id,
        status: 2
      }
      let res = await updateUserAuthStatus(params)
      if (res.success) {
        this.$Message.success('审核已被拒绝!')
        this.modalVisible = false
        this.handleSearch()
      }
    },
    async handleSubmit () {
      this.$refs[this.current].validate(async (valid) => {
        if (valid) {
          let params = {
            id: this.formItem.id,
            status: 1,
            authMsg: this.formItem.authMsg
          }
          let res = await updateUserAuthStatus(params)
          if (res.success) {
            this.$Message.success('审核已通过!')
            this.modalVisible = false
            this.handleSearch()
          }
        }
      })
    },
    async handleReset () {
      let params = {
        id: this.formItem.id,
        status: 2,
        authMsg: this.formItem.authMsg
      }
      let res = await updateUserAuthStatus(params)
      if (res.success) {
        this.$Message.success('审核已被拒绝!')
        this.modalVisible = false
        this.handleSearch()
      }
    },
    async handleSearch (page) {
      if (page) {
        this.pageInfo.page = page
      }
      this.loading = true
      let params = {
        user: this.pageInfo.user || '',
        phone: this.pageInfo.phone || '',
        orgId: this.pageInfo.orgId || '',
        status: this.pageInfo.status || '',
        current: this.pageInfo.page,
        size: this.pageInfo.limit
      }
      let res = await getUserAuth(params)
      const { success, data, message } = res
      if (success) {
        this.data = data.records
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
    },
    handleRemove (data) {
      this.$Modal.confirm({
        title: '确定删除吗？',
        onOk: async () => {
          let params = {
            id: data.id
          }
          let res = await deleteDistrict(params)
          if (res.success) {
            this.pageInfo.page = 1
            this.$Message.success('删除成功')
            this.handleSearch()
          }
        }
      })
    },
    getCheckedAuthorities () {
      const menus = this.$refs['tree'].getCheckedProp('authorityId')
      return menus.concat(this.formItem.grantActions)
    },
    transferRender (item) {
      return `<span  title="${item.username}">${item.username}</span>`
    },
    handleTransferChange (newTargetKeys, direction, moveKeys) {
      this.formItem.userIds = newTargetKeys
    },
    handleClick (name, row) {
      switch (name) {
        case 'remove':
          this.handleRemove(row)
          break
      }
    }
  },
  mounted: function () {
    this.handleSearch()
  }
}
</script>
<style lang="less">
.realname-model {
  .ivu-modal-content {
    .ivu-modal-body {
      .ivu-form {
        margin: 0 8%;
        .ivu-form-item-content {
          img {
            width: 20%;
          }
        }
      }
    }
  }
}
</style>
