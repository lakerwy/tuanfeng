<template>
  <div>
    <HeaderContent>
      <Form ref="searchForm"
        :model="pageInfo"
        inline
        :label-width="110">
        <FormItem label="目录名称:" prop="name">
          <Input type="text" v-model="pageInfo.name" placeholder="请输入目录名称"/>
        </FormItem>
        <FormItem label="目录别名:" prop="aliasname">
          <Input type="text" v-model="pageInfo.aliasname" placeholder="请输入目录别名"/>
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
          <Button  icon="md-add" type="primary" @click="handleModal('add')">添加数据目录</Button>
        </div>
      </div>
      <tree-table
        ref="tree"
        height="675"
        :data="selectMenus"
        :columns="columns"
        :load-data="loadData"
        :show-checkbox="showCheckbox"
        :show-header="showHeader"
        :bottom-line="bottomLine"
        :border="border"
        >
        <template slot="createDate" slot-scope="scope">
          <span>{{scope.row.createDate?scope.row.createDate.replace("T", ' '):''}}</span>
        </template>
        <template slot="operation" slot-scope="scope">
          <div class="actionIcon">
            <Tooltip content="添加下级目录" placement="top">
              <img @click="handleModal('add',scope)" src="../../../assets/images/add-icon.png" alt="" srcset="">
            </Tooltip>
            <Tooltip content="编辑" placement="top">
              <img @click="handleModal('edit',scope.row)" src="../../../assets/images/bianji.png" alt="" srcset="">
            </Tooltip>
            <Tooltip content="删除" placement="top">
              <img @click="handleRemove(scope)" src="../../../assets/images/shanchu.png" alt="" srcset="">
            </Tooltip>
          </div>
        </template>
      </tree-table>
      <!--<tree-table
        ref="tree"
        style="max-height:620px;overflow: auto"
        expand-key="name"
        :expand-type="false"
        :is-fold="false"
        :tree-type="true"
        :selectable="true"
        :columns="columns"
        :data="selectMenus">
        <template slot="createDate" slot-scope="scope">
          <span>{{scope.row.createDate?scope.row.createDate.replace("T", ' '):''}}</span>
        </template>
        <template slot="operation" slot-scope="scope">
          <div class="actionIcon">
            <Tooltip content="添加下级目录" placement="top">
              <img @click="handleModal('add',scope.row)" src="../../../assets/images/add-icon.png" alt="" srcset="">
            </Tooltip>
            <Tooltip content="编辑" placement="top">
              <img @click="handleModal('edit',scope.row)" src="../../../assets/images/bianji.png" alt="" srcset="">
            </Tooltip>
            <Tooltip content="删除" placement="top">
              <img @click="handleRemove(scope)" src="../../../assets/images/shanchu.png" alt="" srcset="">
            </Tooltip>
          </div>
        </template>
      </tree-table>-->
    </Card>

    <Modal v-model="modalVisible"
      :title="modalTitle"
      width="500"
      :mask-closable="false"
      @on-cancel="handleReset">
      <div>
        <Tabs @on-click="handleTabClick" :value="current">
          <!-- <TabPane label="角色信息" name="form1"> -->
            <Form style="width:350px" v-show="current == 'form1'" ref="form1" :model="formItem" :rules="formItemRules" :label-width="110" label-position="right">
              <FormItem label="目录名称:" prop="name">
                <Input v-model.trim="formItem.name" placeholder="请输入目录名称" />
              </FormItem>
              <FormItem label="目录别名:" prop="aliasname">
                <Input v-model.trim="formItem.aliasname" placeholder="请输入目录别名" />
              </FormItem>
              <!-- <FormItem label="目录类型:" prop="type">
                <Input v-model="formItem.type" placeholder="请输入目录类型" />
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
    <Modal v-model="modalVisibletree"
      title="父级数据类型"
      width="35"
      :mask-closable="false"
      @on-cancel="modalVisibletree=false">
      <div>
      <tree-table
        ref="tree"
        style="max-height:480px;overflow: auto"
        expand-key="name"
        :expand-type="false"
        :selectType="'radio'"
        :is-fold="false"
        :tree-type="true"
        :selectable="true"
        :selectTr="selectTr"
        @radio-click="selectParent"
        :columns="columns2"
        :data="selectMenus">
      </tree-table>
      <div class="drawer-footer">
        <Button type="default" @click="modalVisibletree=false">取消</Button>&nbsp;
        <Button type="primary" @click="handleParent" :loading="saving">保存</Button>
      </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import TreeTable from '@/components/treeTable/iview-tree-table'
import { getMetaDataCategory, setMetaDataCategory, updateMetaDataCategory, deleteMtaDataCategory } from '@/api/catalogue'
import { treeData } from '@/libs/util'
import { createTree } from '@/libs/util'
import  HeaderContent from '@/components/header-content/index'
export default {
  name: 'SystemRole',
  components: {
    HeaderContent,
    TreeTable
  },
  data () {
    const validateInput = (rule, value, callback) => {
      if (!this.checkSpecialKey(value)) {
        callback(new Error('不能含有特殊字符!'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      modalVisible: false,
      modalVisibletree: false,
      modalTitle: '',
      saving: false,
      addChildren: false,
      showparent: false,
      showP: false,
      current: 'form1',
      forms: [
        'form1'
      ],
      selectApis: [],
      selectMenus: [],
      pageInfo: {
        total: 0,
        page: 1,
        limit: 200,
        roleCode: '',
        roleName: ''
      },
      selectTr: '',
      formItemRules: {
        name: [
          { required: true, message: '目录名称不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '目录名称在2-20个字符之间', trigger: 'blur' },
          { pattern: /^[^\s]*$/, message: '目录名称不能输入空格', trigger: 'blur' },
          { validator: validateInput, trigger: 'blur' }
        ]
      },
      formItem: {
      },
      handleStatus: null,
      selectList: null,
      columns: [
        {
          title: '目录名称',
          key: 'name',
          tree: true
        },
        {
          title: '目录别名',
          key: 'aliasname'
        },
        // {
        //   title: '目录类型',
        //   key: 'type'
        // },
        {
          title: '创建用户',
          key: 'createUser'
        },
        {
          title: '创建时间',
          key: 'createDate',
          type: 'template',
          template: 'createDate'
        },
        {
          title: '操作',
          type: 'template',
          template: 'operation'
          // minWidth: '200px'
        }
      ],
      columns2: [
        {
          title: '数据类型名称',
          key: 'name',
          id: 'id'
        }
      ],
      data: [],
      alldatalist: null
    }
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
    treeData (data) {
      // debugger
      let cloneData = JSON.parse(JSON.stringify(data)) // 对源数据深度克隆
      let tree = cloneData.filter(father => { // 循环所有项
        father.label = father.name
        father.value = father.parentId
        let branchArr = cloneData.filter(child => {
          return father.id == child.parentId // 返回每一项的子级数组
        })
        if (branchArr.length > 0) {
          father.children = branchArr // 如果存在子级，则给父级添加一个children属性，并赋值
        }
        return father // 返回第一层
      })
      return tree // 返回树形数据
    },
    async handleModal (status, data) {
      console.log(data)
      this.handleStatus = status
      if (data) {
        this.addChildren = true
        if (status == 'edit') {
          if (data.parentId == '0') {
            this.showparent = false
          } else {
            this.showparent = true
          }
        } else {
          this.showparent = false
        }
      } else {
        this.addChildren = false
      }

      if (data) {
        this.formItem = Object.assign({}, this.formItem, data)
      }
      if (status === 'add' && !data) {
        this.formItem = {
          name: ''
        }
      }
      if (status === 'add') {
        this.formItem = {}
      }
      if (this.current === this.forms[0]) {
        if (status === 'edit') {
          this.modalTitle = '编辑目录 - ' + data.name
        } else {
          if (this.addChildren) {
            this.modalTitle = '添加下级目录'
          } else if (!this.addChildren) {
            this.modalTitle = '添加目录'
          }
        }
        // this.modalTitle = status === 'edit' ? '编辑数据类型 - ' + data.name : '添加数据类型'
        this.modalVisible = true
      }
      // this.formItem.status = this.formItem.status + ''
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
        this.$refs[this.current].validate(async (valid) => {
          if (valid) {
            this.saving = true
            if (this.handleStatus === 'edit') {
              let params = {
                id: this.formItem.id,
                name: this.formItem.name,
                code: this.formItem.code,
                aliasname: this.formItem.aliasname,
                parentId: this.formItem.parent_id,
                parentIds: this.formItem.parentIds
              }
              let res = await updateMetaDataCategory(params)
              const { success } = res
              if (success) {
                this.saving = false
                this.$Message.success('保存成功')
                this.handleReset()
                this.handleSearch()
              } else {
                this.saving = false
                this.$Message.info(res.message)
              }

            } else {
              let params = {
                name: this.formItem.name,
                aliasname: this.formItem.aliasname,
                parentId: this.formItem.id || 0
              }
              let res = await setMetaDataCategory(params)
              const { success } = res
              if (success) {
                this.saving = false
                this.$Message.success('保存成功')
                this.handleReset()
                this.handleSearch()
              } else {
                this.saving = false
                this.$Message.info(res.message)
              }

            }
          }
        })
      }
    },
    selectParent (row) {
      this.formItem.parent_id = row.row.id
      this.formItem.parentName = row.row.name
      this.selectTr = row.row.id
    },
    openParentMenu () {
      this.modalVisibletree = true
    },
    handleParent () {
      this.modalVisibletree = false
    },
    async handleSearch (page) {
      if (page) {
        this.pageInfo.page = page
      }
      this.loading = true
      let params = {
        name: this.pageInfo.name || '',
        aliasname: this.pageInfo.aliasname || '',
        current: this.pageInfo.page,
        size: this.pageInfo.limit
      }
      let res = await getMetaDataCategory(params)
      const { success, body } = res
      if (success) {
        this.data = body
        this.pageInfo.total = body.length;
        this.selectMenus = createTree(body,'parentId')
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
          let params = data.row.id;
          let res = await deleteMtaDataCategory(params)
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
  },
  created () {
  }
}
</script>
