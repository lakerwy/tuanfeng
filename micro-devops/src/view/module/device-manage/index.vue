<template>
  <div>
    <Card shadow>
      <Form ref="searchForm" :model="pageInfo" inline :label-width="80">
        <FormItem label="设备名称">
          <Input type="text" v-model="pageInfo.name" placeholder="请输入设备名称" />
        </FormItem>
        <FormItem label="设备编号">
          <Input type="text" v-model="pageInfo.deviceId" placeholder="请输入设备编号" />
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
        <template slot="createTime" slot-scope="{ row }">
          <span>{{row.createTime? row.createTime.replace("T", ' '):''}}</span>
        </template>
        <template slot="action" slot-scope="{ row }">
          <a @click="handleModal('edit',row)">编辑</a>&nbsp;&nbsp;
          <a @click="handleModal('allo',row)">分配</a>&nbsp;&nbsp;
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

    <Modal v-model="modalVisible" :title="modalTitle" width="600" @on-cancel="handleReset" :mask-closable="false">
      <div>
        <Tabs @on-click="handleTabClick" :value="current">
          <Form
            style="width:450px"
            v-show="current == 'form1'"
            ref="form1"
            :model="formItem"
            label-position="right"
            :rules="formItemRules"
            :label-width="100"
          >
            <FormItem label="设备名称:" prop="name">
              <Input v-model="formItem.name" placeholder="请输入设备名称" />
            </FormItem>
            <FormItem label="设备编号:" prop="deviceId">
              <Input v-model="formItem.deviceId" placeholder="请输入设备编号" />
            </FormItem>
            <FormItem label="设备描述:" prop="deviceDesc">
              <Input  v-model="formItem.deviceDesc" type="textarea" :row="4" placeholder="请输入设备描述" maxlength="500" show-word-limit />
            </FormItem>
          </Form>
        </Tabs>
        <div class="drawer-footer">
          <Button type="default" @click="handleReset">取消</Button>&nbsp;
          <Button type="primary" @click="handleSubmit" :loading="saving">保存</Button>
        </div>
      </div>
    </Modal>
    <Modal v-model="modalUserVisible"
      :title="modalTitle"
      width="40"
      :mask-closable="false"
      @on-cancel="modalUserVisible=false">
      <div>
        <Tabs>
          <TabPane label="分配用户">
            <Transfer
              :data="selectUsers"
              :list-style="{width: '45%',height: '480px'}"
              :titles="['选择用户', '已选择用户']"
              :render-format="transferRender"
              :target-keys="targetKeys"
              @on-change="handleTransferChange"
              filterable>
            </Transfer>
          </TabPane>
        </Tabs>
        <div class="drawer-footer">
          <Button type="default" @click="modalUserVisible=false">取消</Button>&nbsp;
          <Button type="primary" @click="handleSubmit" :loading="saving">保存</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { devicelist, deviceById, delDevice, addDevice, updateDevice, deviceToUser } from '@/api/device'

export default {
  name: 'Devices',
  data () {
    const validateEn = (rule, value, callback) => {
      let re = '(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]'
      let reg = new RegExp(re)
      if (value === '') {
        callback(new Error('系统路径不能为空'))
      } else if (value !== '' && !reg.test(value)) {
        callback(new Error('请输入正确的系统路径'))
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
      modalUserVisible: false,
      modalTitle: '',
      saving: false,
      current: 'form1',
      forms: ['form1'],
      selectUsers: null,
      targetKeys: [],
      selectApis: [],
      pageInfo: {
        total: 0,
        page: 1,
        limit: 10,
        roleCode: '',
        roleName: ''
      },
      formItemRules: {
        deviceId: [
          { required: true, message: '设备编号不能为空', trigger: 'blur' },
          { required: true, min: 2, max: 16, message: '长度为2-16个字符', trigger: 'blur' },
          { required: true, pattern: /^[^\s]*$/, message: '设备编号不能输入空格', trigger: 'blur' },
          { required: true, validator: validateInput, trigger: 'blur' }
          // { required: true, validator: validateEn, trigger: "blur" },
        ],
        name: [
          { required: true, message: '设备名称不能为空', trigger: 'blur' },
          { required: true, min: 2, max: 16, message: '长度为2-16个字符', trigger: 'blur' },
          { required: true, pattern: /^[^\s]*$/, message: '设备名称不能输入空格', trigger: 'blur' },
          { required: true, validator: validateInput, trigger: 'blur' }
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
          title: '设备名称',
          key: 'name'
        },
        {
          title: '设备编号',
          key: 'deviceId'
        },
        {
          title: '设备描述',
          key: 'deviceDesc',
          tooltip: true
        },
        {
          title: '创建者',
          key: 'createUser'
        },
        {
          title: '创建时间',
          key: 'createTime',
          slot: 'createTime'
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
      let res = null
      if (data) {
        let params = {
          id: data.id
        }
        res = await deviceById(params)
        const { success } = res
        if (success) {
          this.formItem = res.data
        }
      }

      if (data) {
        this.formItem = Object.assign({}, this.formItem, data)
      }
      console.log(this.formItem)
      if (this.current === this.forms[0]) {
        this.modalTitle = data ? '编辑设备信息 - ' + data.name : '添加设备信息'
        this.modalVisible = true
      }
      if (status === 'allo') {
        this.targetKeys = []
        this.selectUsers = []
        this.modalUserVisible = true
        this.modalVisible = false
        this.selectUsers = [...res.data.hasPosAllotUser, ...res.data.notHasPosUser]
        this.selectUsers.forEach(item => {
          item.key = item.id
          item.label = item.username
        })
        res.data.hasPosAllotUser.forEach(item => {
          this.targetKeys.push(item.id)
        })
      }
      if (status === 'add') {
        this.formItem = {}
      }
    },
    transferRender (item) {
      return `<span  title="${item.username}">${item.username}</span>`
    },
    handleTransferChange (newTargetKeys, direction, moveKeys) {
      console.log(newTargetKeys)
      this.targetKeys = newTargetKeys
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
              deviceId: this.formItem.deviceId,
              deviceDesc: this.formItem.deviceDesc
            }
            let res = await updateDevice(params)
            const { success, message } = res
            if (success) {
              this.$Message.success('修改设备信息成功!')
              this.handleReset()
              this.handleSearch()
            } else {
              this.$Message.info(res.status.message)
            }
            this.saving = false
          } else if (this.handlMethod === 'allo') {
            console.log(this.formItem)
            let params = {
              posId: this.formItem.posInfo.id,
              delUseridList: [],
              addUseridList: []
            }
            params.addUseridList = this.compareArr(this.formItem.hasPosAllotUser, this.targetKeys).add
            params.delUseridList = this.compareArr(this.formItem.hasPosAllotUser, this.targetKeys).del
            let res = await deviceToUser(params)
            const { success, message } = res
            if (success) {
              this.modalUserVisible = false
              this.$Message.success('分配成功!')
              this.handleReset()
              this.handleSearch()
            } else {
              this.$Message.info(res.status.message)
            }
            this.saving = false
          } else {
            let params = {
              name: this.formItem.name,
              deviceId: this.formItem.deviceId,
              deviceDesc: this.formItem.deviceDesc
            }
            let res = await addDevice(params)
            const { success, message } = res
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
    },
    compareArr (befArr, aftArr, id = 'id', flag = false) {
      let resObj = {
        add: [],
        del: []
      }
      const cenObj = {}
      let beforeArr = [], afterArr = []
      befArr.forEach(item => {
        beforeArr.push(item[id])
      })
      if (flag) {
        aftArr.forEach(item => {
          afterArr.push(item.id)
        })
      } else {
        afterArr = aftArr
      }

      for (let index = 0; index < beforeArr.length; index++) {
        cenObj[beforeArr[index]] = beforeArr[index]
      }
      for (let index = 0; index < afterArr.length; index++) {
        if (!cenObj[afterArr[index]]) {
          resObj.add.push(afterArr[index])
        } else {
          delete cenObj[afterArr[index]]
        }
      }
      for (let k in cenObj) {
        resObj.del.push(k)
      }
      return resObj
    },
    async handleSearch (page) {
      if (page) {
        this.pageInfo.page = page
      }
      this.loading = true
      let params = {
        name: this.pageInfo.name || '',
        deviceId: this.pageInfo.deviceId || '',
        current: this.pageInfo.page || 1,
        size: this.pageInfo.limit || 10
      }
      let res = await devicelist(params)
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
          let res = await delDevice(params)
          if (res.success) {
            this.$Message.success('删除设备成功')
            this.handleSearch()
          } else {
            this.$Message.error('删除设备失败!')
          }
        }
      })
    },
    getCheckedAuthorities () {
      const menus = this.$refs['tree'].getCheckedProp('authorityId')
      return menus.concat(this.formItem.grantActions)
    },
    //     transferRender(item) {
    //       return `<span  title="${item.username}">${item.username}</span>`;
    //     },
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
