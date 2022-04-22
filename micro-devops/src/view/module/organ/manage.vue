<template>
  <div>
    <HeaderContent>
      <Form ref="searchForm" :model="pageInfo" inline :label-width="80">
        <FormItem label="机构名称">
          <Input type="text" v-model="pageInfo.name" placeholder="请输入机构名称" />
        </FormItem>
        <FormItem label="机构编码">
          <Input type="text" v-model="pageInfo.code" placeholder="请输入机构编码" />
        </FormItem>
        <FormItem label="认证状态" prop="authStatus">
          <Select v-model="pageInfo.authStatus" style="width:150px;">
            <Option>全部</Option>
            <Option value="0">未认证</Option>
            <Option value="1">已认证</Option>
          </Select>
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
          <img src="../../../assets/images/icon-total.png" alt="" srcset="">
          <span class="text">当前数据：</span>
          <span class="num">{{pageInfo.total}}条</span>
        </div>
        <div>
          <Button  icon="md-add" type="primary" @click="handleModal('add')">添加机构</Button>
        </div>
      </div>
      <tree-table
        ref="tree"
        style="max-height:650px;overflow: auto"
        expand-key="name"
        :expand-type="false"
        :is-fold="false"
        :tree-type="true"
        :selectable="true"
        :columns="columns"
        :data="selectMenus"
      >
        <template slot="createDate" slot-scope="scope">
          <span>{{scope.row.createDate?scope.row.createDate.replace('T',' '):''}}</span>
        </template>
        <template slot="isDepart" slot-scope="scope">
          <span v-if="scope.row.isDepart== '1'">部门</span>
          <span v-else>组织1</span>
        </template>
        <template slot="status" slot-scope="scope">
          <section class="table-status">
            <div v-if="scope.row.authStatus== '1'">
              <img src="../../../assets/images/icon-pass.png" alt="" srcset="">
              <span>已认证</span>
            </div>
            <div v-else >
              <img src="../../../assets/images/icon-failed.png" alt="" srcset="">
              <span>未认证</span>
            </div>
          </section>
        </template>
        <template slot="operation" slot-scope="scope">
          <div class="actionIcon">
            <Tooltip content="添加下级机构" placement="top">
              <img @click="handleModal('add',scope.row )" src="../../../assets/images/add-icon.png" alt="" srcset="">
            </Tooltip>
            <Tooltip content="编辑" placement="top">
              <img @click="handleModal('edit',scope.row )" src="../../../assets/images/bianji.png" alt="" srcset="">
            </Tooltip>
            <!-- <Tooltip content="转移管理员" placement="top">
              <img @click="handleModal('transf',scope.row )" src="../../../assets/images/bangding.png" alt="" srcset="">
            </Tooltip> -->
            <Tooltip content="删除" placement="top">
              <img @click="handleRemove(scope)" src="../../../assets/images/shanchu.png" alt="" srcset="">
            </Tooltip>
          </div>
        </template>
      </tree-table>
    </Card>

    <Modal
      v-model="modalVisible"
      :title="modalTitle"
      width="20"
      :mask-closable="false"
      @on-cancel="handleReset"
    >
      <div>
        <Tabs @on-click="handleTabClick" :value="current">
          <!-- <TabPane label="角色信息" name="form1"> -->
          <Form
            v-show="current == 'form1'"
            ref="form1"
            label-position="right"
            :model="formItem"
            :rules="formItemRules"
            :label-width="100"
          >
            <FormItem label="机构名称:" prop="name">
              <Input v-model="formItem.name" placeholder="请输入机构名称" />
            </FormItem>
            <FormItem label="机构编码:" prop="code">
              <Input :disabled='handleStatus =="edit"?true:false'

                v-model="formItem.code"
                placeholder="请输入机构编码"
              />
            </FormItem>
           <!--  <FormItem label="设为部门:" v-show="addToporg">
              <i-switch v-model="formItem.isDepart">
                <span slot="open">是</span>
                <span slot="close">否</span>
              </i-switch>
            </FormItem> -->
           <!-- <FormItem label="机构管理员:" prop="adminUser" v-if="formItem.isDepart == 1 ">-->
            <!-- <FormItem label="机构管理员:" prop="adminUser" v-if="showAdmin">
              <Input v-model="formItem.adminUser" placeholder="请输入机构管理员id" />
                <Select
								v-if="handleStatus =='add'"
                @keydown.enter.prevent
                ref="selectOption"
                v-model="formItem.adminUser"
                transfer
                filterable
                remote
                :remote-method="remoteMothed"
                :loading="loading"
              >
                <Option
                  v-for="(options, index) in userOption"
                  :key="index"
                  :value="options.value"
                >{{options.label}}</Option>
              </Select>
              <span v-else>{{formItem.username}}</span>
            </FormItem> -->
          </Form>
          <!-- </TabPane> -->
        </Tabs>
        <div class="drawer-footer">
          <Button type="default" @click="handleReset">取消</Button>&nbsp;
          <Button type="primary" @click="handleSubmit" :loading="saving">保存</Button>
        </div>
      </div>
    </Modal>
    <Modal>

    </Modal>
  </div>
</template>

<script>
import  HeaderContent from '@/components/header-content/index'
import { getOrglist, getOrgByID, addOrg, updateOrg, deleteOrg } from '@/api/organ/index'
import { getUserlist } from '@/api/user'
import { createTree } from '@/libs/util'
import { setTimeout } from 'timers'

export default {
  name: 'SystemRole',
  components: {
    HeaderContent
  },
  data () {
    // const validateEn = (rule, value, callback) => {
    //   let reg = /^[_a-zA-Z0-9]+$/
    //   if (value === '') {
    //     callback(new Error('角色标识不能为空'))
    //   } else if (value !== '' && !reg.test(value)) {
    //     callback(new Error('只允许字母、数字、下划线'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      titles: ['选择接口', '已选择接口'],
      listStyle: {
        width: '240px',
        height: '500px'
      },
      loading: false,
      modalVisible: false,
      modalTitle: '',
      addChildren: false,
      saving: false,
      current: 'form1',
      forms: ['form1'],
      selectApis: [],
      selectMenus: [],
      pageInfo: {
        total: 0,
        page: 1,
        limit: 200,
        roleCode: '',
        roleName: ''
      },
      formItemRules: {
        code: [
          { required: true, message: '机构编码不能为空', trigger: 'blur' },
          {
            required: true,
            pattern: /^[^\s]*$/,
            message: '不能输入空格',
            trigger: 'blur'
          },
          { pattern:/^[^\u4e00-\u9fa5]+$/, message:'不能包含汉字',trigger: 'blur' },
          { min: 2, max: 10, message: '长度在2到10个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '机构名称不能为空', trigger: 'blur' },
          {
            required: true,
            pattern: /^[^\s]*$/,
            message: '不能输入空格',
            trigger: 'blur'
          },
          { min: 2, max: 20, message: '长度在2到20个字符', trigger: 'blur' }
        ],
        // adminUser: [
        //   { required: true, message: '机构管理员不能为空', trigger: 'blur' }
        // ]
      },
      formItem: {
        adminUser: null,
        name: null,
        code: null,
        roleId: '',
        roleCode: '',
        roleName: '',
        path: '',
        isDepart: 1,
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
      addToporg: false,
      userOption: [],
      columns: [
        {
          title: '机构名称',
          width: '200',
          key: 'name'
        },
        {
          title: '机构编码',
          key: 'code'
        },
        {
          title: '组织架构',
          type: 'template',
          template: 'isDepart'
        },
        {
          title: '创建时间',
          type: 'template',
          template: 'createDate'
        },
        {
          title: '认证状态',
          type: 'template',
          template: 'status'
        },
        {
          title: '操作',
          type: 'template',
          template: 'operation'
        }
      ],
      data: [],
      showAdmin: false
    }
  },
  methods: {
    async handleModal (status, data) {
      this.handleStatus = status
      if (data) {
        this.addChildren = true
        let params = {
          id: data.id
        }
        let res = await getOrgByID(params)
        const { success } = res
        if (success) {
          this.formItem = res.data
          // let that = this;
          // this.$nextTick(() => {
          //   this.$refs.selectOption.query = res.data.username;
          // });
        } else {
          this.$Message.info(res.status.message)
        }
      } else {
        this.addChildren = false
      }
      if (!data && status === 'add') {
        this.formItem.isDepart = 0
        this.showAdmin = false
        this.addToporg = false
      } else {
        this.addToporg = true
      }
      if (status === 'edit') {
        this.addToporg = false
        let params = {
          username: '',
          phone: '',
          orgId: '',
          status: '',
          authStatus: '',
          current: 1,
          size: 200
        }
        let res = await getUserlist(params)
        const list = res.data.records.map(item => {
          return {
            value: item.id,
            label: item.username
          }
        })
        this.userOption = list
      }
      if (data) {
        this.formItem = Object.assign({}, this.formItem, data)
        // this.formItem.isDepart = this.formItem.isDepart == 1 ? true : false;
        this.showAdmin = false
      }
      if (status === 'add') {
        this.formItem.name = null
        this.formItem.code = null
        this.formItem.adminUser = null
      }
      if (this.current === this.forms[0]) {
        if (status === 'edit') {
          this.showAdmin = true
          this.formItem.username = this.formItem.username
          this.modalTitle = '编辑机构 - ' + data.name
          if (!this.formItem.username) {
            this.showAdmin = false
          }
        } else {
          if (this.addChildren) {
            this.modalTitle = '添加下级机构'
            this.showAdmin = true
          } else {
            this.modalTitle = '添加机构'
          }
        }
        // this.modalTitle = (status==="edit") ? "编辑机构 - " + data.name : "添加机构";
        this.modalVisible = true
      }

      // this.formItem.status = this.formItem.status + ''
    },
    remoteMothed (query) {
      if (query !== '') {
        this.loading = true
        setTimeout(async () => {
          this.loading = false
          let params = {
            username: '',
            phone: '',
            orgId: '',
            status: '',
            authStatus: '1',
            current: 1,
            size: 200
          }
          let res = await getUserlist(params)
          const list = res.data.records.map(item => {
            return {
              value: item.id,
              label: item.username
            }
          })
          this.userOption = list.filter(
            item => (item.label.toLowerCase().indexOf(query.toLowerCase()) > -1 && item.label !== 'admin')
          )
        }, 200)
      } else {
        this.userOption = []
      }
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
        name: null,
        code: null,
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
                adminUser: 'admin'
              }
              let res = await updateOrg(params)
              const { success, message } = res
              if (success) {
                this.$Message.success('保存成功')
                this.$forceUpdate()
                this.handleReset()
                this.handleSearch()
              } else {
                this.$Message.info(res.status.message)
              }
              console.log(params)
              this.saving = false
            } else {
              let params = {
                name: this.formItem.name,
                code: this.formItem.code,
                parentId: this.formItem.id || 0,
                parentIds: this.formItem.parentIds || 0,
                isDepart: this.formItem.isDepart ? 1 : 0,
                adminUser: 'admin'
              }
              let res = await addOrg(params)
              const { success, message } = res
              if (success) {
                this.$Message.success('保存成功')
                this.$forceUpdate()
                this.handleReset()
                this.handleSearch()
              } else {
                this.$Message.info(res.status.message)
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
        authStatus: this.pageInfo.authStatus || '',
        current: this.pageInfo.page,
        size: this.pageInfo.limit
      }
      let res = await getOrglist(params)
      const { success, data, message } = res
      if (success) {
        this.data = data.records
        this.selectMenus = createTree(data.records)
        this.pageInfo.total = data.records.length;
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
            id: data.row.id
          }
          let res = await deleteOrg(params)
          if (res.success) {
            // data.bodyData.forEach((itm, idx) => {
            //   if (itm.id === data.row.id) {
            //     data.bodyData.splice(idx, 1)
            //   }
            // })
            // this.$Message.success('删除成功')
            this.pageInfo.page = 1
            this.$Message.success('删除成功')
            this.handleSearch()
          } else {
            if (res.status.code === 404) {
              this.$Message.warning("当前机构有下级机构，不能删除")
              // this.$Message.warning(res.status.message)
            }
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
