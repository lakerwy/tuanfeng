<template>
  <div>
    <Card shadow>
      <Form ref="searchForm" :model="pageInfo" inline :label-width="80">
        <FormItem label="机构名称" prop="name">
          <Input type="text" v-model="pageInfo.name" placeholder="请输入机构名称" />
        </FormItem>
        <FormItem label="机构编码" prop="code">
          <Input type="text" v-model="pageInfo.code" placeholder="请输入机构编码" />
        </FormItem>
        <FormItem label="认证状态">
          <Select v-model="pageInfo.status" style="width:150px;">
            <Option>全部</Option>
            <Option value="0">待认证</Option>
            <Option value="1">认证通过</Option>
            <Option value="2">认证失败</Option>
          </Select>
          <!-- <Input type="text" v-model="pageInfo.authStatus" placeholder="请输入关键字"/> -->
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSearch(1)">查询</Button>&nbsp;
          <!-- <Button @click="handleResetForm('searchForm')">重置</Button> -->
        </FormItem>
      </Form>
      <Table border :columns="columns2" :data="data" :loading="loading">
        <template slot="status" slot-scope="{ row }">
          <div v-if="row.status== '0'"><i style="background:#c3cbd6" class="itablestatus"></i>待认证</div>
          <div v-else-if="row.status== '1'"><i style="background:green" class="itablestatus"></i>认证通过</div>
          <div v-else-if="row.status== '2'"><i style="background:red" class="itablestatus"></i>认证失败</div>
          <span v-else>待认证</span>
        </template>
        <template slot="action" slot-scope="{ row }">
          <a @click="handleModal(row)" v-if="row.status != '0'">详情</a>
          <a @click="handleModal(row)" v-if="row.status == '0'">认证</a>
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
      :title="modalTitle"
      width="40"
      :mask-closable="false"
      @on-cancel="handleReset"
    >
      <div>
        <Tabs>
          <TabPane label="机构详情" name="form3">
            <Form ref="form3" :model="rowInfo" :label-width="100" label-position="right" :rules="rowInfoRules" v-if="modalVisible">
              <FormItem label="机构名称" prop="name">
                <Input v-model="rowInfo.name" readonly />
              </FormItem>
              <FormItem label="机构编码" prop="code">
                <Input v-model="rowInfo.code" readonly />
              </FormItem>
              <FormItem label="申请人" prop="createUser">
                <Input v-model="rowInfo.applyer" readonly />
              </FormItem>
              <FormItem label="三证合一" prop="fileUrl">
                <span v-if="rowInfo.fileUrl == null">无</span>
                <viewer :images="rowInfo.fileUrl" v-else>
                    <img  :src="rowInfo.fileUrl" alt style="width: 188px;height: 100px;" />
                </viewer>
              </FormItem>
              <FormItem label="测绘证书" prop="mappingUrl">
                <span v-if="rowInfo.mappingUrl == null">无</span>
                <viewer :images="rowInfo.mappingUrl" v-else>
                    <img  :src="rowInfo.mappingUrl" alt style="width: 188px;height: 100px;" />
                </viewer>
              </FormItem>
              <FormItem label="其他图片" prop="otherUrl">
                <span v-if="rowInfo.otherUrl == null">无</span>
                <viewer :images="rowInfo.otherUrl" v-else>
                    <img  :src="rowInfo.otherUrl" alt style="width: 188px;height: 100px;" />
                </viewer>
              </FormItem>
              <FormItem label="认证信息" prop="authMsg">
                <Input v-if="rowInfo.status == 0" v-model="rowInfo.authMsg" type="textarea" maxlength="50" show-word-limit />
                <span v-else>{{rowInfo.authMsg}}</span>
              </FormItem>
            </Form>
          </TabPane>
        </Tabs>
        <div class="drawer-footer">
          <span v-if="rowInfo.status == 0">
            <Button type="primary" @click="save_authStatus( rowInfo.id ,1,'确定认证通过吗?')">同意</Button>&nbsp;
            <Button type="default" @click="save_authStatus( rowInfo.id ,2,'确定认证不通过吗?')">拒绝</Button>&nbsp;&nbsp;
          </span>
          <Button type="default" @click="modalVisible=false"  v-if="rowInfo.status == 1||rowInfo.status == 2">确定</Button>
          <Button type="default" @click="modalVisible=false"  v-if="rowInfo.status == 0">取消</Button>
&nbsp;&nbsp;
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  AuthOrgList,
  AuthOrgbyID,
  AuthOrgUpdataStatus
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
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      rowInfoRules: {
        authMsg: [
          { required: true, message: '认证信息不能为空', trigger: 'blur' },
          { required: true, pattern: /^[^\s]*$/, message: '认证信息不能包含空格', trigger: 'blur' }
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
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '机构名称',
          key: 'name'
        },
        {
          title: '机构编码',
          key: 'code'
        },
        {
          title: '创建时间',
          key: 'createDate'
        },
        {
          title: '认证状态',
          key: 'authStatus'
        },
        {
          title: '操作',
          slot: 'action'
        }
      ],
      columns2: [
        {
          title: '序号',
          type: 'index',
          width: 65,
          align: 'center'
        },
        {
          title: '机构名称',
          key: 'name'
        },
        {
          title: '机构编码',
          key: 'code'
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
          slot: 'status',
          key: 'status',
          width: 100
        },
        {
          title: '认证者',
          key: 'authBy'
        },
        {
          title: '操作',
          slot: 'action'
        }
      ],
      rowInfo: {
        code: '',
        fileUrl: '',
        createUser: '',
        id: '',
        name: '',
        parentId: '',
        parentIds: '',
        status: '',
        authMsg: ''
      },
      data: []
    }
  },
  methods: {
    handleModal (data) {
      this.modalVisible = true
      this.rowInfo = data
    },
    save_authStatus (id, status, msg) {
      this.$refs.form3.validate(async valid => {
        if (valid) {
          this.$Modal.confirm({
            title: msg,
            onOk: async () => {
              let params = {
                id: id,
                status: status,
                authMsg: this.rowInfo.authMsg
              }
              let res = await AuthOrgUpdataStatus(params)
              if (res.success) {
                this.$Message.success('提交成功!')
              } else {
                this.$Message.info('提交失败!')
              }
              this.modalVisible = false
              this.handleSearch(1)
            }
          })
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
    handleSubmit () {
      if (this.current === this.forms[0]) {
        this.$refs[this.current].validate(async valid => {
          if (valid) {
            this.saving = true
            if (this.handleStatus === 'edit') {
              let params = {
                id: this.formItem.id,
                name: this.formItem.name,
                code: this.formItem.code,
                parentId: this.formItem.parentId,
                parentIds: this.formItem.parentIds,
                adminUser: this.formItem.adminUser
              }
              let res = await updateOrg(params)
              const { success, message } = res
              if (success) {
                this.$Message.success('保存成功')
                this.handleReset()
                this.handleSearch()
              }
              this.saving = false
            } else {
              let params = {
                name: this.formItem.name,
                code: this.formItem.code,
                parentId: this.formItem.parentId,
                parentIds: this.formItem.parentIds,
                isDepart: this.formItem.isDepart
              }
              let res = await addOrg(params)
              const { success, message } = res
              if (success) {
                this.$Message.success('保存成功')
                this.handleReset()
                this.handleSearch()
              }
              this.saving = false
            }
          }
        })
      }
    },
    async handleSearch (page) {
      if (page) {
        this.pageInfo.page = page
      }
      this.loading = true
      let params = {
        name: this.pageInfo.name || '',
        code: this.pageInfo.code || '',
        status: this.pageInfo.status || '',
        current: this.pageInfo.page,
        size: this.pageInfo.limit
      }
      let res = await AuthOrgList(params)
      const { success, data, message } = res
      if (success) {
        this.data = data.records
        this.pageInfo.total = res.data.total
        // this.selectMenus = treeData(data.records);
        // console.log(this.selectMenus)
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
          let res = await deleteOrg(params)
          if (res.success) {
            this.pageInfo.page = 1
            this.$Message.success('删除成功')
            this.handleSearch()
          }
        }
      })
    }
  },
  mounted: function () {
    this.handleSearch()
  }
}
</script>
