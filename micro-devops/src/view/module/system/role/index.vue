<template>
  <div>
    <HeaderContent>
      <Form ref="searchForm"
          :model="pageInfo"
          inline
          label-position="right"
          :label-width="80">
        <FormItem label="角色名称">
          <Input type="text" v-model="pageInfo.name" placeholder="请输入角色名称"/>
        </FormItem>
        <FormItem label="角色编码" >
          <Input type="text" v-model="pageInfo.code" placeholder="请输入角色编码"/>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSearch(1)">查询</Button>&nbsp;
          <!-- <Button @click="handleResetForm('searchForm')">重置</Button> -->
        </FormItem>
      </Form>
    </HeaderContent>
    <Card shadow>
      <div class="search-con search-con-top">
        <div class="total">
          <img src="../../../../assets/images/icon-total.png" alt="" srcset="">
          <span class="text">当前数据：</span>
          <span class="num">{{pageInfo.total}}条</span>
        </div>
        <div>
          <Button  icon="md-add" type="primary" @click="addhandleModal()">添加角色</Button>
          <!--<Button class="search-btn" type="primary" @click="addhandleModal()">
            <span>添加</span>
          </Button>-->
        </div>
      </div>
      <Table border :columns="columns" :data="data" :loading="loading">
        <template slot="createDate" slot-scope="{ row }">
          <span>{{row.createDate?row.createDate.replace("T", ' '):''}}</span>
        </template>
        <template slot="action" slot-scope="{ row }">
          <div class="actionIcon">
            <Tooltip content="编辑" placement="top">
              <img src="../../../../assets/images/bianji.png" @click="handleModal(row)" alt="" srcset="">
            </Tooltip>
            <Tooltip content="删除" placement="top">
              <img src="../../../../assets/images/shanchu.png" @click="handleRemove(row)" alt="" srcset="">
            </Tooltip>
          </div>
        </template>
      </Table>
      <Page transfer :total="pageInfo.total" :current="pageInfo.page" :page-size="pageInfo.limit" show-elevator
      show-total
      @on-change="handlePage" @on-page-size-change='handlePageSize'></Page>
    </Card>
    <Modal v-model="modalVisible"
      :title="modalTitle"
      width="760"
      class-name="role-modal"
      :mask-closable="false"
      @on-cancel="handleReset">
      <div>
        <Tabs @on-click="handleTabClick" :value="current">
          <TabPane label="角色信息" name="form1">
            <Form v-show="current == 'form1'" ref="form1" :model="formItem" :rules="formItemRules" :label-width="100" label-position="right">
              <FormItem label="角色名称" prop="name">
                <Input v-model="formItem.name" placeholder="请输入角色名称" />
              </FormItem>
              <FormItem label="角色编码" prop="code">
                <Input :disabled="true" v-model="formItem.code" placeholder="请输入角色编码" />
              </FormItem>
              <FormItem label="角色描述" class="left" prop="remark">
                <Input v-model.trim="formItem.remark" type="textarea" maxlength="50"  show-word-limit  placeholder="请输入角色描述" />
              </FormItem>
            </Form>
          </TabPane>
          <TabPane  label="角色成员" name="form3">
            <Form v-show="current == 'form3'" ref="form2" :model="formItem" >
              <FormItem prop="authorities">
                <Transfer
                  :data="selectUsers"
                  ref="transfer"
                  class="role-tree"
                  :list-style="{width: '45%',height: '480px'}"
                  :titles="titles"
                  :render-format="transferRender"
                  :target-keys="targetKeys"
                  @on-change="handleTransferChange"
                  filterable>
                </Transfer>
              </FormItem>
            </Form>
          </TabPane>
        </Tabs>
        <div class="drawer-footer">
          <Button type="default" @click="handleReset">取消</Button>&nbsp;
          <Button type="primary" @click="handleSubmit" :loading="saving">保存</Button>
        </div>
      </div>
    </Modal>
    <Modal v-model="addmodalVisible"
      title="添加角色"
      width="40"
      :mask-closable="false"
      @on-cancel="handleaddreset">
      <div>
        <Tabs @on-click="handleTabClick" :value="current">
          <TabPane label="角色信息" name="form1">
            <Form  ref="addform" :model="formItem" :rules="formItemRules" :label-width="100" label-position="right">
              <FormItem label="角色名称" prop="name">
                <Input v-model.trim="formItem.name" placeholder="请输入角色名称" />
              </FormItem>
              <FormItem label="角色编码" prop="code">
                <Input v-model.trim="formItem.code" placeholder="请输入角色编码" />
              </FormItem>
              <FormItem label="角色描述" class="left" prop="remark">
                <Input v-model.trim="formItem.remark" type="textarea" placeholder="请输入角色描述"  :maxlength="50"  show-word-limit/>
              </FormItem>
            </Form>
          </TabPane>
        </Tabs>
        <div class="drawer-footer">
          <Button type="default" @click="handleaddreset">取消</Button>&nbsp;
          <Button type="primary" @click="addhandleSubmit" :loading="saving">保存</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import  HeaderContent from '@/components/header-content/index'
import { getRoles, findById, delById, updateRole, addRole, removeRole } from '@/api/role'
import { createTree } from '@/libs/util'
export default {
  name: 'SystemRole',
  data () {
    const validateEn = (rule, value, callback) => {
      let reg = /^[_a-zA-Z0-9]+$/
      if (value === '') {
        callback(new Error('角色描述不能为空'))
      } else if (value !== '' && !reg.test(value)) {
        callback(new Error('只允许字母、数字、下划线'))
      } else {
        callback()
      }
    }
    var validateInput = (rule, value, callback) => {
      if (!this.checkSpecialKey(value)) {
        callback(new Error('不能含有特殊字符!'))
      } else {
        callback()
      }
    }
    return {
      titles: ['选择用户', '已选择用户'],
      loading: false,
      modalVisible: false,
      modalTitle: '',
      saving: false,
      current: 'form1',
      forms: [
        'form1',
        'form2',
      ],
      selectUsers: [],
      pageInfo: {
        total: 0,
        page: 1,
        limit: 10,
        roleCode: '',
        roleName: ''
      },
      formItemRules: {
        code: [
          { required: true, message: '角色编码不能为空', trigger: 'blur' },
          { min: 1, message: '角色编码不少于一个字符', trigger: 'blur' },
          { max: 12, message: '角色编码最长为12个字符', trigger: 'blur' },
          { pattern: /^[^\s]*$/, message: '角色编码不能输入空格', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z_]+$/, message: '角色编码必须是英文数字组合', trigger: 'blur' }
          // {required: true, validator: validateEn, trigger: 'blur'}
        ],
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' },
          { min: 1, message: '角色名称不少于一个字符', trigger: 'blur' },
          { max: 12, message: '角色名称最长为12个字符', trigger: 'blur' },
          { pattern: /^[^\s]*$/, message: '角色名称不能输入空格', trigger: 'blur' },
          { validator: validateInput, trigger: 'blur' }
        ],
        remark: [{ pattern: /^[^\s]*$/, message: '不能输入空格', trigger: 'blur' }]
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
        id: []
      },
      roleInfo: null,
      targetKeys: [],
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 65,
          align: 'center'
        },
        {
          title: '角色名称',
          key: 'name'
        },
        {
          title: '角色编码',
          key: 'code'
        },
        {
          title: '角色描述',
          key: 'remark'
        },
        {
          title: '创建时间',
          key: 'createDate',
          slot: 'createDate'
        },
        {
          title: '操作',
          slot: 'action'
          // fixed: 'right',
        }
      ],
      data: [],
      hasMenuList: null,
      hasMenuArr: [],
      addmodalVisible: false,
      leftMovekey: [],
      rightMovekey: []
    }
  },
  components: {
    HeaderContent
  },
  methods: {
    checkSpecialKey (str) {
      var specialKey = "[`~!#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'"
      for (var i = 0; i < str.length; i++) {
        if (specialKey.indexOf(str.substr(i, 1)) != -1) {
          return false
        }
      }
      return true
    },
    assignItem (data) {
      data.forEach((item) => {
        if (item.children && item.children.length > 0) {
          this.assignItem(item.children)
        } else {
          if (this.hasMenuArr.includes(item.id)) {
            delete this.hasMenuArr[this.hasMenuArr.indexOf(item.id)]
            item.checked = true
          }
        }
      })
    },
    async handleModal (data) {
      let params = {
        id: data.id
      }
      let res = await findById(params)
      const { success } = res
      if (success) {
        this.roleInfo = res.data
        this.formItem = res.data.role
        this.selectUsers = [...res.data.notHasRoleUser, ...res.data.hasRoleUser]
        this.selectUsers.forEach(item => {
          item.key = item.id
          item.label = item.username
          if (item.username === 'admin') {
            item.disabled = true
            item.label = `${item.username}(超级用户)`
            console.log(item)
          }
        })
        res.data.hasRoleUser.forEach(item => {
          this.targetKeys.push(item.id)
        })
      }
      if (data) {
        this.formItem = Object.assign({}, this.formItem, data)
        this.modalVisible = true
      }
      console.log(this.$refs.transfer.$refs.left.query)
      if (this.current === this.forms[0]) {
        this.modalTitle = data ? '编辑角色 - ' + data.name : '添加角色'
      }
      if (this.current === this.forms[1]) {
        this.modalTitle = data ? '角色成员 - ' + data.name : '角色成员'
      }
      this.formItem.status = this.formItem.status + ''
      if (this.$refs.transfer) {
        this.$refs.transfer.$refs.left.query = ''
        this.$refs.transfer.$refs.right.query = ''
      }
    },
    addhandleModal () {
      this.formItem = {}
      this.addmodalVisible = true
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
      let that = this
      this.$refs['form1'].validate(async (valid) => {
        if (valid) {
          let params = {
            role: {
              id: that.formItem.id,
              name: that.formItem.name,
              code: that.formItem.code,
              remark: that.formItem.remark
            },
            addMenuList: [],
            delMenuList: [],
            addUserList: [],
            delUserList: []
          }
          params.addUserList = this.rightMovekey
          params.delUserList = this.leftMovekey
          let res = await updateRole(params)
          const { success } = res
          if (success) {
            this.$Message.success('角色信息修改成功!')
            this.handleSearch()
            this.rightMovekey = []
            this.leftMovekey = [] // 提交成功后清空穿梭值
            this.modalVisible = false
          } else {
            this.$Message.info(res.status.message)
          }
        }
      })
    },
    handleaddreset () {
      this.formItem = {
        name: '',
        code: '',
        remark: ''
      }
      this.addmodalVisible = false
      this.$refs.addform.resetFields()
    },
    addhandleSubmit () {
      this.$refs['addform'].validate(async (valid) => {
        if (valid) {
          let params = {
            name: this.formItem.name,
            code: this.formItem.code,
            remark: this.formItem.remark
          }
          let res = await addRole(params)
          const { success } = res
          if (success) {
            this.$Message.success('添加角色成功!')
            this.addmodalVisible = false
            this.handleSearch()
          } else {
            this.$Message.info(res.status.message)
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
        name: this.pageInfo.name || '',
        code: this.pageInfo.code || '',
        current: this.pageInfo.page,
        size: this.pageInfo.limit
      }
      let res = await getRoles(params)
      const { success, data } = res
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
          let res = await delById(params)
          if (res.success) {
            this.pageInfo.page = 1
            this.$Message.success('删除成功')
            this.handleSearch()
          }
        }
      })
    },
    transferRender (item) {
      return `<span  title="${item.label}">${item.label}</span>`
    },
    handleTransferChange (newTargetKeys, direction, moveKeys) {
      if (direction === 'left') {
        this.leftMovekey = moveKeys
      } else if (direction === 'right') {
        this.rightMovekey = moveKeys
      }
      this.targetKeys = newTargetKeys
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
.role-tree {
  height:550px;
  overflow-y: auto;
  padding-bottom: 10px;
}
.role-modal {
  .ivu-modal {
    .ivu-modal-body {
      max-height: 600px;
    }
  }
}
.left{
  .ivu-form-item-label{
   padding-left:10px;
 }
}
</style>
