<template>
  <div>
    <Card shadow>
      <Form ref="searchForm" :model="pageInfo" inline :label-width="80">
        <FormItem label="行政区名称">
          <Input type="text" v-model="pageInfo.name" placeholder="请输入行政区名称" />
        </FormItem>
        <FormItem label="行政区编码">
          <Input type="text" v-model="pageInfo.adCode" placeholder="请输入行政区编码" />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSearch(1)">查询</Button>&nbsp;
          <!-- <Button @click="handleResetForm('searchForm')">重置</Button> -->
        </FormItem>
      </Form>
      <div class="search-con search-con-top">
        <ButtonGroup>
          <Button class="search-btn" type="primary" @click="handleModal('add')">
            <span>添加</span>
          </Button>
        </ButtonGroup>
      </div>
      <tree-table
        ref="tree"
        style="max-height:620px;overflow: auto"
        expand-key="name"
        :expand-type="false"
        :is-fold="false"
        :tree-type="true"
        :selectable="true"
        :columns="columns"
        :data="data"
      >
        <template slot="status" slot-scope="scope">
          <span v-if="scope.row.authStatus== '0'">未认证</span>
          <span v-if="scope.row.authStatus== '1'">已认证</span>
        </template>
        <template slot="operation" slot-scope="scope">
          <a v-show="scope.row.level != 2" @click="handleModal('add',scope.row)">添加下级行政区</a>&nbsp;&nbsp;
          <a @click="handleModal('edit',scope.row)">编辑</a>&nbsp;&nbsp;
          <a @click="handleRemove(scope)">删除</a>
        </template>
      </tree-table>
    </Card>

    <Modal v-model="modalVisible" :title="modalTitle" width="30" @on-cancel="handleReset" :mask-closable="false">
      <div>
        <Tabs @on-click="handleTabClick" :value="current">
          <!-- <TabPane label="角色信息" name="form1"> -->
          <Form
            style="width:350px"
            v-show="current == 'form1'"
            ref="form1"
            :model="formItem"
            label-position="right"
            :rules="formItemRules"
            :label-width="100"
          >
            <FormItem label="行政区名称:" prop="name">
              <Input v-model="formItem.name" placeholder="请输入行政区名称" />
            </FormItem>
            <FormItem label="行政区编码:" prop="adCode">
              <Input v-model="formItem.adCode" placeholder="请输入行政区编码" />
            </FormItem>
            <FormItem label="行政区拼音:" prop="pinyin">
              <Input v-model="formItem.pinyin" placeholder="请输入行政区拼音" />
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
import {
  // getDistrict,
  getFindLike,
  deleteDistrict,
  getDistrictByID,
  updateDistrict,
  addDistrict
} from '@/api/amd'
// import {
//   getAuthorityMenu,
//   getAuthorityRole,
//   grantAuthorityRole
// } from '@/api/authority'

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
      currentHandle: 'add',
      formItemRules: {
        adCode: [
          { required: true, message: '行政区编码不能为空', trigger: 'blur' },
          { required: true, min: 2, max: 20, message: '长度为2-20个字符', trigger: 'blur' },
          { required: true, pattern: /^[0-9]+$/, message: '行政区编码只能输入数字', trigger: 'blur' }

          // { required: true, validator: validateEn, trigger: "blur" }
        ],
        name: [{ required: true, message: '行政区名称不能为空', trigger: 'blur' },
          { required: true, min: 2, max: 20, message: '长度为2-20个字符', trigger: 'blur' },
          { required: true, pattern: /^[^\s]*$/, message: '不能输入空格', trigger: 'blur' },
          { required: true, validator: validateInput, trigger: 'blur' }],
        pinyin: [{ required: true, message: '行政区拼音不能为空', trigger: 'blur' },
          { required: true, pattern: /^[ A-Za-z]*$/, message: '请输入正确行政区拼音格式', trigger: 'blur' }]
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
          title: '行政区名称',
          key: 'name'
        },
        {
          title: '行政区编码',
          key: 'adCode'
        },
        {
          title: '行政区拼音',
          key: 'pinyin'
        },
        {
          title: '操作',
          type: 'template',
          template: 'operation'
        }
      ],
      data: [],
      flatState: []
    }
  },
  methods: {
    checkSpecialKey (str) {
      var specialKey = "[`~!#$^&*=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'"
      for (var i = 0; i < str.length; i++) {
        if (specialKey.indexOf(str.substr(i, 1)) != -1) {
          return false
        }
      }
      return true
    },
    async handleModal (type, data) {
      this.currentHandle = type
      if (data) {
        let params = {
          id: data.id
        }
        let res = await getDistrictByID(params)
        const { success } = res
        if (success) {
          this.formItem = res.data.role
        }
      }

      if (data) {
        this.formItem = Object.assign({}, this.formItem, data)
      }
      if (type === 'add' && data) {
        this.formItem.name = ''
        this.formItem.adCode = ''
        this.formItem.pinyin = ''
        this.formItem.level = parseInt(data.level) + 1
      } else if (type === 'add') {
        this.formItem.level = 0
      }
      console.log(this.formItem)
      if (this.current === this.forms[0]) {
        this.modalTitle =
          type === 'edit' ? '编辑行政区 - ' + data.name : '添加行政区'
        this.modalVisible = true
      }
      this.formItem.status = this.formItem.status + ''
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
            if (this.currentHandle === 'edit') {
              let params = {
                id: this.formItem.id,
                pid: this.formItem.pid,
                pinyin: this.formItem.pinyin,
                adCode: this.formItem.adCode,
                name: this.formItem.name
              }
              let res = await updateDistrict(params)
              const { success } = res
              if (success) {
                this.$Message.success('保存成功')
                this.handleReset()
                this.handleSearch()
              } else {
                this.$Message.info(res.status.message)
              }
              this.saving = false
            } else {
              let params = {
                name: this.formItem.name,
                adCode: this.formItem.adCode,
                pid: this.formItem.id || '',
                pinyin: this.formItem.pinyin,
                level: this.formItem.level
              }
              let res = await addDistrict(params)
              const { success } = res
              if (success) {
                this.$Message.success('保存成功')
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
        adCode: this.pageInfo.adCode || '',
        pid: '',
        level: '',
        current: this.pageInfo.page,
        size: this.pageInfo.limit
      }
      let res = await getFindLike(params)
      const { success, data } = res
      if (success) {
        this.data = this.treeData(data)
        this.pageInfo.total = data.total
        this.loading = false
      }
    },
    treeData (data) {
      // debugger
      let cloneData = JSON.parse(JSON.stringify(data)) // 对源数据深度克隆
      let tree = cloneData.filter(father => {
        // 循环所有项
        let branchArr = cloneData.filter(child => {
          return father.id == child.pid // 返回每一项的子级数组
        })
        if (branchArr.length > 0) {
          father.children = branchArr // 如果存在子级，则给父级添加一个children属性，并赋值
        }
        return father.pid == '' // 返回第一层
      })
      if (tree.length === 0) {
        return data
      }
      return tree // 返回树形数据
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
          let temparr = []
          if (data.row.children) {
            data.row.children.forEach(element => {
              temparr.push(element.id)
            })
          }
          let params = temparr.concat(data.row.id)
          let res = await deleteDistrict(params)
          if (res.success) {
            this.pageInfo.page = 1
            this.$Message.success('删除成功')
            this.handleSearch()
            // params.forEach(item => {
            //   data.bodyData.forEach((itm, idx) => {
            //     if (item === itm.id) {
            //       data.bodyData.splice(idx, 1)
            //     }
            //   })
            // })
            // this.$Message.success('删除成功')
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
