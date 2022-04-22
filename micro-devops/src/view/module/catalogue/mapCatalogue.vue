<template>
  <div>
    <HeaderContent>
      <Form ref="searchForm"
        :model="pageInfo"
        inline
        :label-width="110">
        <FormItem label="业务类型名称:" prop="name">
          <Input  v-model="pageInfo.name" placeholder="请输入业务类型名称"/>
        </FormItem>
        <FormItem label="业务类型编码:" prop="code">
          <Input  v-model="pageInfo.code" placeholder="请输入业务类型编码"/>
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
          <Button  icon="md-add" type="primary" @click="handleModal('add')">添加业务类型</Button>
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
        <template slot="createDate" slot-scope="scope">
          <span>{{scope.row.createDate?scope.row.createDate.replace("T", ' '):''}}</span>
        </template>
        <template slot="operation" slot-scope="scope">
          <div class="actionIcon">
            <Tooltip content="添加下级业务类型" placement="top">
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
              <FormItem label="业务类型名称:" prop="name">
                <Input v-model.trim="formItem.name" placeholder="请输入业务类型名称" />
              </FormItem>
              <FormItem label="业务类型编码:" prop="code">
                <Input v-model.trim="formItem.code" placeholder="请输入业务类型编码" />
              </FormItem>
              <FormItem label="业务类型备注:" prop="remark">
                <Input v-model.trim="formItem.remark" placeholder="请输入业务类型备注" />
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
  </div>
</template>

<script>
import { getBusinessDir, setBusinessDir, updateBusinessDir, deleteBusinessDir } from '@/api/catalogue'
import  HeaderContent from '@/components/header-content/index'
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
      callback()
    }
    return {
      loading: false,
      modalVisible: false,
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
          { required: true, message: '业务类型名称不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '业务类型名称在2-20个字符之间', trigger: 'blur' },
          { pattern: /^[^\s]*$/, message: '业务类型名称不能输入空格', trigger: 'blur' },
          { validator: validateInput, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '业务类型编码不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '业务类型编码在2-20个字符之间', trigger: 'blur' },
          { pattern: /^[^\s]*$/, message: '业务类型编码不能输入空格', trigger: 'blur' },
          { validator: validateInput, trigger: 'blur' }
        ],
        remark: [
          { min: 2, max: 20, message: '业务类型备注在2-20个字符之间', trigger: 'blur' },
          { pattern: /^[^\s]*$/, message: '业务类型备注不能输入空格', trigger: 'blur' },
          { validator: validateInput, trigger: 'blur' }
        ]
      },
      formItem: {
      },
      handleStatus: null,
      columns: [
        {
          title: '业务类型名称',
          key: 'name'
        },
        {
          title: '业务类型编码',
          key: 'code'
        },
        {
          title: '创建者',
          key: 'createUser'
        },
        {
          title: '创建时间',
          key: 'createDate',
          type: 'template',
          template: 'createDate'
        },
        {
          title: '备注',
          key: 'remark'
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
      if (!str) return true;
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
          return father.id == child.parentId // 返回每一项的子级数组
        })
        if (branchArr.length > 0) {
          father.children = branchArr // 如果存在子级，则给父级添加一个children属性，并赋值
        }
        return father.parentId == '000' // 返回第一层
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
          this.modalTitle = '编辑业务类型 - ' + data.name
        } else {
          if (this.addChildren) {
            this.modalTitle = '添加下级业务类型';
            this.formItem = {};
            this.formItem.id = data.id;
          } else if (!this.addChildren) {
            this.modalTitle = '添加业务类型'
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
                code: this.formItem.code,
                name: this.formItem.name,
                parentId: this.formItem.parentId,
                remark: this.formItem.remark,
                showIndex: 1,
              }
              let res = await updateBusinessDir(params)
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
                code: this.formItem.code,
                parentId: this.formItem.id || '000',
                showIndex:1,
                remark: this.formItem.remark,
              }
              let res = await setBusinessDir(params)
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
      let res = await getBusinessDir(params)
      const { success, body } = res
      if (success) {
        this.data = body
        this.pageInfo.total = body.length;
        this.selectMenus = createTree(body,'parentId');
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
          let res = await deleteBusinessDir(params)
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
