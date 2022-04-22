<template>
  <div>
    <Card shadow>
      <Form ref="searchForm" :model="pageInfo" inline :label-width="80">
        <FormItem label="子系统名称">
          <Input type="text" v-model="pageInfo.name" placeholder="请输入子系统名称" />
        </FormItem>
        <FormItem label="子系统编码">
          <Input type="text" v-model="pageInfo.code" placeholder="请输入子系统编码" />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSearch(1)">查询</Button>&nbsp;
          <!-- <Button @click="handleResetForm('searchForm')">重置</Button> -->
        </FormItem>
      </Form>
      <div class="search-con search-con-top">
        <ButtonGroup>
          <Button type="primary" @click="handleModal('add')">
            <span>添加</span>
          </Button>
        </ButtonGroup>
      </div>
      <Table border :columns="columns" :data="data" :loading="loading">
        <template slot="action" slot-scope="{ row }">
          <a @click="handleModal('edit',row)">编辑</a>&nbsp;&nbsp;
          <a @click="handleRemove(row)">删除</a>
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

    <Modal v-model="modalVisible" :title="modalTitle" width="20" @on-cancel="handleReset" :mask-closable="false">
      <div>
        <Tabs @on-click="handleTabClick" :value="current">
          <Form
            v-show="current == 'form1'"
            ref="form1"
            :model="formItem"
            label-position="right"
            :rules="formItemRules"
            :label-width="100"
          >
            <FormItem label="子系统名称:" prop="name">
              <Input v-model="formItem.name" placeholder="请输入子系统名称" />
            </FormItem>
            <FormItem label="子系统编码:" prop="code">
              <Input v-model="formItem.code" placeholder="请输入子系统编码" />
            </FormItem>
            <FormItem label="子系统路径:" prop="url">
              <Input v-model="formItem.url" placeholder="请输入子系统路径" />
            </FormItem>
            <FormItem label="子系统备注:" prop="remark" class="remark">
              <Input v-model="formItem.remark" maxlength="150" show-word-limit type="textarea" placeholder="请输入子系统备注"/>
            </FormItem>
          </Form>
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
  getsubSys,
  getsubSysByID,
  addsubSysBy,
  updatesubSysBy,
  deletesubSysBy
} from '@/api/subsystem'
import { startWith, listConvertTree } from '@/libs/util'

export default {
  name: 'SystemRole',
  data () {
    const validateEn = (rule, value, callback) => {
      let re = '(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]'
      let reg = new RegExp(re)
      if (value === '') {
        callback(new Error('子系统路径不能为空'))
      } else if (value !== '' && !reg.test(value)) {
        callback(new Error('请输入正确的子系统路径'))
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
    const validateRemark = (rule, value, callback) => {
      let remark = /^[^\s]*$/
      let reg = new RegExp(remark)
      if (value === '') {
        callback()
      } else {
        if (!reg.test(value)) {
          callback(new Error('子系统备注不能输入空格'))
        } else {
          callback()
        }
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
      formItemRules: {
        code: [
          { required: true, message: '子系统编码不能为空', trigger: 'blur' },
          { required: true, min: 2, max: 15, message: '长度为2-15个字符', trigger: 'blur' },
          { pattern:/^[^\u4e00-\u9fa5]+$/, message:'不能包含汉字',trigger: 'blur' },
          { required: true, pattern: /^[^\s]*$/, message: '子系统编码不能输入空格', trigger: 'blur' },
          { required: true, validator: validateInput, trigger: 'blur' }
          // { required: true, validator: validateEn, trigger: "blur" },
        ],
        name: [
          { required: true, message: '子系统名称不能为空', trigger: 'blur' },
          { required: true, min: 2, max: 20, message: '长度为2-20个字符', trigger: 'blur' },
          { required: true, pattern: /^[^\s]*$/, message: '子系统名称不能输入空格', trigger: 'blur' },
          { required: true, validator: validateInput, trigger: 'blur' }
        ],
        url: [
          { required: true, message: '子系统路径不能为空', trigger: 'blur' },
          { required: true, pattern: /^[^\s]*$/, message: '子系统路径不能输入空格', trigger: 'blur' },
          { required: true, validator: validateEn, trigger: 'blur' }
        ],
        remark: [
          { required: false, message: '子系统备注不能为空', trigger: 'blur' },
          { min: 0, max: 150, message: '长度为0-150个字符', trigger: 'blur' },
          // {required: true, pattern:/^[^\s]*$/, message: '子系统备注不能输入空格', trigger: 'blur'}
          { required: true, validator: validateRemark, trigger: 'blur' }
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
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 65,
          align: 'center'
        },
        {
          title: '子系统名称',
          key: 'name'
        },
        {
          title: '子系统编码',
          key: 'code'
        },
        {
          title: '子系统路径',
          key: 'url'
        },
        {
          title: '子系统备注',
          key: 'remark'
        },
        {
          title: '操作',
          slot: 'action'
        }
      ],
      handlMethod: 'add',
      data: []
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
    async handleModal (status, data) {
      this.handlMethod = status
      if (data) {
        let params = {
          id: data.id
        }
        let res = await getsubSysByID(params)
        const { success } = res
        if (success) {
          this.formItem = res.data.role
        }
      }

      if (data) {
        this.formItem = Object.assign({}, this.formItem, data)
      }
      // console.log(this.formItem);
      if (this.current === this.forms[0]) {
        this.modalTitle = data ? '编辑子系统 - ' + data.name : '添加子系统'
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
      this.$refs.form1.validate(async valid => {
        if (valid) {
          this.saving = true
          if (this.handlMethod === 'edit') {
            let params = {
              id: this.formItem.id,
              name: this.formItem.name,
              code: this.formItem.code,
              url: this.formItem.url,
              remark: this.formItem.remark
            }
            let res = await updatesubSysBy(params)
            const { success, data } = res
            if (success) {
              this.$Message.success(data)
              this.handleReset()
              this.handleSearch()
            } else {
              this.$Message.info(res.status.message)
            }
            this.saving = false
          } else {
            let params = {
              name: this.formItem.name,
              code: this.formItem.code,
              url: this.formItem.url,
              remark: this.formItem.remark
            }
            let res = await addsubSysBy(params)
            const { success, data } = res
            if (success) {
              this.$Message.success(data)
              this.handleReset()
              this.handleSearch()
            } else {
              this.$Message.info(res.status.message)
            }
            this.saving = false
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
        url: this.pageInfo.url || '',
        current: this.pageInfo.page || 1,
        size: this.pageInfo.limit || 10
      }
      let res = await getsubSys(params)
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
          let params = []
          params.push(data.id)
          let res = await deletesubSysBy(params)
          if (res.success) {
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
.remark{
 .ivu-form-item-label{
   padding-left:10px;
 }
}

</style>
