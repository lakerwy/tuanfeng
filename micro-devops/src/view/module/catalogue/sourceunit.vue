<template>
  <div>
    <HeaderContent>
      <Form ref="searchForm"
        :model="pageInfo"
        inline
        :label-width="110">
        <FormItem label="来源单位名称:" prop="name">
          <Input type="text" v-model="pageInfo.name" placeholder="请输入来源单位名称"/>
        </FormItem>
        <FormItem label="来源单位编码:" prop="code">
          <Input type="text" v-model="pageInfo.code" placeholder="请输入来源单位编码"/>
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
          <Button  icon="md-add" type="primary" @click="handleModal('add')">添加来源单位</Button>
        </div>
      </div>
      <tree-table
        ref="tree"
        expand-key="name"
        :expand-type="false"
        :is-fold="false"
        :tree-type="true"
        :selectable="true"
        :columns="columns"
        :data="selectMenus">
        <template slot="createTime" slot-scope="scope">
          <span>{{scope.row.createTime?scope.row.createTime.replace("T", ' '):''}}</span>
        </template>
        <template slot="operation" slot-scope="scope">
          <div class="actionIcon">
            <Tooltip content="添加下级来源" placement="top">
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
      </tree-table>
      <div class="paddingbtm"></div>
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
              <FormItem label="数据来源名称:" prop="sourceName">
                <Input v-model.trim="formItem.sourceName" placeholder="请输入数据来源名称" />
              </FormItem>
              <FormItem label="数据来源编码:" prop="sourceCode">
                <Input v-model.trim="formItem.sourceCode" placeholder="请输入数据来源编码" />
              </FormItem>
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
import  HeaderContent from '@/components/header-content/index'
import { getSourceUnit, setSourceUnit, updateSourceUnit, deleteSourceUnit } from '@/api/catalogue'
import { createTree } from '@/libs/util'
export default {
  name: 'SystemRole',
  components: {
    HeaderContent
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
        sourceName: [
          { required: true, message: '数据来源名称不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '数据来源名称在2-20个字符之间', trigger: 'blur' },
          { pattern: /^[^\s]*$/, message: '数据来源名称不能输入空格', trigger: 'blur' },
          { validator: validateInput, trigger: 'blur' }
        ],
        sourceCode: [
          { required: true, message: '数据来源编码不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '数据来源编码在2-20个字符之间', trigger: 'blur' },
          { pattern: /^[^\s]*$/, message: '数据来源编码不能输入空格', trigger: 'blur' },
          { validator: validateInput, trigger: 'blur' }
        ]
      },
      formItem: {
      },
      handleStatus: null,
      columns: [
        {
          title: '数据来源名称',
          key: 'sourceName'
        },
        {
          title: '数据来源编码',
          key: 'sourceCode'
        },
        {
          title: '创建者',
          key: 'createBy'
        },
        {
          title: '创建时间',
          key: 'createTime',
          type: 'template',
          template: 'createTime'
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
        let branchArr = cloneData.filter(child => {
          return father.id == child.pid // 返回每一项的子级数组
        })
        if (branchArr.length > 0) {
          father.children = branchArr // 如果存在子级，则给父级添加一个children属性，并赋值
        }
        return father.pid == '0' // 返回第一层
      })
      return tree // 返回树形数据
    },
    async handleModal (status, data) {
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
        // this.showP = (data.parentId=='0')? false : true ;
        // let params = {
        //   id: data.id
        // }
        // let res = await getDataTypeByID(params)
        // const { success } = res
        // if (success) {
        //   this.formItem = res.data
        // } else {
        //   this.$Message.info(res.status.message)
        // }
      } else {
        this.addChildren = false
      }

      if (data) {
        this.formItem = Object.assign({}, this.formItem, data)
      }
      if (status === 'add' && !data) {
          this.formItem = {}
      }
      if (this.current === this.forms[0]) {
        if (status === 'edit') {
          this.modalTitle = '编辑数据来源 - ' + data.sourceName
        } else {
          if (this.addChildren) {
            this.modalTitle = '添加下级来源';
            this.formItem = {};
            this.formItem.id = data.id;
          } else if (!this.addChildren) {
            this.modalTitle = '添加来源'
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
                sourceCode: this.formItem.sourceCode,
                sourceName: this.formItem.sourceName,
                pid: this.formItem.pid,
              }
              let res = await updateSourceUnit(params)
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
                sourceName: this.formItem.sourceName,
                sourceCode: this.formItem.sourceCode,
                pid: this.formItem.id || 0
              }
              let res = await setSourceUnit(params)
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
        code: this.pageInfo.code || '',
        current: this.pageInfo.page,
        size: this.pageInfo.limit
      }
      let res = await getSourceUnit(params)
      const { success, body } = res
      if (success) {
        this.data = body
        this.pageInfo.total = body.length;
        this.selectMenus = createTree(body,'pid');
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
          let res = await deleteSourceUnit(params)
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
