<template>
  <div>
    <Card shadow>
      <Form ref="searchForm"
            :model="pageInfo"
            inline
            :label-width="110">
        <FormItem label="用户名" prop="username">
          <Input type="text" v-model="pageInfo.userId" placeholder="请输入用户名"/>
        </FormItem>
        <FormItem label="申请转移部门" prop="name">
          <Input type="text" v-model="pageInfo.orgId" placeholder="请输入申请转移部门"/>
        </FormItem>
        <FormItem label="审核状态" prop="authStatus">
          <Select v-model="pageInfo.authStatus" style="width:150px">
            <Option >全部</Option>
            <Option value="0">未审核</Option>
            <Option value="1">审核通过</Option>
            <Option value="2">未通过</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSearch(1)">查询</Button>&nbsp;
          <!-- <Button @click="handleResetForm('searchForm')">重置</Button> -->
        </FormItem>
      </Form>
      <Table border :columns="columns" :data="data" :loading="loading">
        <template slot="status" slot-scope="{ row }">
          <div v-if="row.authStatus == '0'"><i style="background:#c3cbd6" class="itablestatus"></i>未审核</div>
          <div v-if="row.authStatus == '1'"><i style="background:green" class="itablestatus"></i>审核通过</div>
          <div v-if="row.authStatus == '2'"><i style="background:red" class="itablestatus"></i>未通过</div>
        </template>
        <template slot="action" slot-scope="{ row }">
          <a   @click="handleModal(row)" >详情</a>
        </template>
      </Table>
      <Page transfer :total="pageInfo.total" :current="pageInfo.page" :page-size="pageInfo.limit" show-elevator

            show-total
            @on-change="handlePage" @on-page-size-change='handlePageSize'></Page>
    </Card>

    <Modal v-model="modalVisible"
           :title="modalTitle"
           width="40"
           :mask-closable="false"
           @on-cancel="handleReset">
      <div>
        <Tabs    >
          <TabPane label="机构转移详情" name="form4">
            <Form   ref="form4"   :label-width="100" label-position="right">
              <FormItem label="申请人用户" prop="username">
                <Input v-model="isShow.username"  readonly />
              </FormItem>
              <FormItem label="机构名称" prop="orgName" >
                <Input   v-model="isShow.orgName"   readonly />
              </FormItem>
              <FormItem label="目标用户" prop="targetUserName">
                <Input   v-model="isShow.targetUserName"  readonly />
              </FormItem>
              <FormItem  label="状态" prop="authStatus">
                <span v-if="isShow.authStatus == 0">
                  <Input  value="待审核"  readonly />
                </span>
                <span v-if="isShow.authStatus == 1">
                  <Input  value="审核通过"  readonly />
                </span>
                <span v-if="isShow.authStatus == 2">
                  <Input  value="未通过"  readonly />
                </span>
              </FormItem>
              <FormItem label="材料图片" prop="fileImage">
                <span v-if="isShow.fileImage == null">
                    无
                </span>
                <viewer :images="isShow.fileImage" v-else>
                    <img  :src="isShow.fileImage" alt style="width: 188px;height: 100px;" />
                </viewer>
              </FormItem>
              <FormItem label="审核信息" prop="authMsg" >
                <span v-if="isShow.authStatus == 1||isShow.authStatus == 2">{{isShow.authMsg}}</span>
                <Input  v-model="isShow.authMsg" v-if="isShow.authStatus == 0" type="textarea" maxlength="50" show-word-limit />
              </FormItem>
            </Form>
          </TabPane>
        </Tabs>
        <div class="drawer-footer">
          <Button type="default"  @click="modalVisible=false" v-if="isShow.authStatus == 0">取消</Button>&nbsp;&nbsp;
          <Button type="default"  @click="modalVisible=false" v-if="isShow.authStatus == 1||isShow.authStatus == 2">确定</Button>&nbsp;&nbsp;
          <span v-if="isShow.authStatus == 0">
            <Button type="primary"    @click="save_AuthStatus( isShow.id ,1,'确定审核通过吗?')" >审核通过</Button>&nbsp;
            <Button type="default"    @click="save_AuthStatus( isShow.id ,2,'确定审核不通过吗?')" >不通过</Button>
          </span>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getOruser, AuthUpdateOrgTransfer } from '@/api/organ/transfer'

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
      forms: [
        'form1'
      ],
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
        code: [
          { required: true, validator: validateEn, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
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
          title: '目标用户',
          key: 'targetUserName'
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
          key: 'authTime',
          render: function (h, params) {
            if (params.row.authTime) {
              return h('div', params.row.authTime.replace('T', ' '))
            } else {
              return h('div', '')
            }
          }
        },
        {
          title: '认证状态',
          key: 'authStatus',
          slot: 'status'
        },
        {
          title: '操作',
          slot: 'action'
        }
      ],
      isShow: {
        authMsg: null,
        authStatus: '',
        fileImage: null,
        id: '',
        orgCode: '',
        orgId: '',
        orgName: '',
        targetUser: '',
        targetUserName: '',
        userId: '',
        username: ''
      },
      data: []
    }
  },
  methods: {
    handleModal (data) {
      this.modalVisible = true,
      this.isShow = data
    },
    save_AuthStatus (id, status, msg) {
      this.$Modal.confirm({
        title: msg,
        onOk: async () => {
          let params = {
            id: id,
            userId: this.isShow.userId,
            targetUser: this.isShow.targetUser,
            orgId: this.isShow.orgId,
            authStatus: status,
            authMsg: this.isShow.authMsg
          }
          let res = await AuthUpdateOrgTransfer(params)
          if (res.success) {
            this.$Message.success(res.data)
          } else {
            this.$Message.error(res.status.message)
          }
          this.modalVisible = false
          this.handleSearch(1)
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
        authStatus: this.pageInfo.authStatus || '',
        userId: this.pageInfo.userId || '',
        orgId: this.pageInfo.orgId || '',
        current: this.pageInfo.page,
        size: this.pageInfo.limit
      }
      let res = await getOruser(params)
      const { success, data } = res
      if (success) {
        this.data = data.records
        this.selectMenus = data.records
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
