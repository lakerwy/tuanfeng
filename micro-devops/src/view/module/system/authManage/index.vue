<template>
  <div>
    <HeaderContent>
      <Form ref="searchForm"
            :model="pageInfo"
            inline
            :label-width="80">
        <FormItem label="所属子系统">
          <Select v-model="pageInfo.systemId" filterable clearable>
            <Option v-for="item in subsystem"  :key="item.id" :value="item.id" >{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="菜单名称">
          <Input type="text" v-model="pageInfo.name" placeholder="请输入菜单名称"/>
        </FormItem>
        <FormItem label="菜单编码">
          <Input type="text" v-model="pageInfo.code" placeholder="请输入菜单编码"/>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSearch">查询</Button>&nbsp;
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
          <Button  icon="md-add" type="primary" @click="handleModal('add')">添加菜单</Button>
        </div>
      </div>
      <TreeTable
        ref="tree"
        style="max-height:620px;overflow: auto"
        :data="selectMenus"
        :columns="columns2"
        :load-data="loadData"
        :show-checkbox="showCheckbox"
        :show-header="showHeader"
        :bottom-line="bottomLine"
        :border="border"
        >
        <template slot="type" slot-scope="scope">
          <span v-if="scope.row.type == '0'">菜单</span>
          <span v-else >按钮</span>
        </template>
        <template slot="systemtemp" slot-scope="scope">
          <span>{{scope.row.system.name}}</span>
        </template>
        <template slot="operation" slot-scope="scope">
          <div class="actionIcon">
            <Tooltip content="添加下级菜单" placement="top">
              <img @click="handleModal('addnext',scope.row)" src="../../../../assets/images/add-icon.png" alt="" srcset="">
            </Tooltip>
            <Tooltip content="编辑" placement="top">
              <img @click="handleModal('edit',scope.row)" src="../../../../assets/images/bianji.png" alt="" srcset="">
            </Tooltip>
            <Tooltip content="删除" placement="top">
              <img @click="handleRemove(scope)" src="../../../../assets/images/shanchu.png" alt="" srcset="">
            </Tooltip>
          </div>
        </template>
      </TreeTable>
      <!--<Table border height="570" row-key="id" :columns="columns2" :data="selectMenus" >
        <template slot="type" slot-scope="{ row }">
          <span v-if="row.type == '0'">菜单</span>
          <span v-else >按钮</span>
        </template>
        <template slot="systemtemp" slot-scope="{ row }">
          <span>{{row.system.name}}</span>
        </template>
        <template slot="operation" slot-scope="{ row }">
          <div class="actionIcon">
            <Tooltip content="添加下级菜单" placement="top">
              <img @click="handleModal('addnext',row)" src="../../../../assets/images/add-icon.png" alt="" srcset="">
            </Tooltip>
            <Tooltip content="编辑" placement="top">
              <img @click="handleModal('edit',row)" src="../../../../assets/images/bianji.png" alt="" srcset="">
            </Tooltip>
            <Tooltip content="删除" placement="top">
              <img @click="handleRemove(row)" src="../../../../assets/images/shanchu.png" alt="" srcset="">
            </Tooltip>
          </div>
        </template>
      </Table>-->
    </Card>
    <Modal v-model="modalVisible"
      :title="modalTitle"
      :mask-closable="false"
      width="770"
      @on-cancel="handleReset">
      <div>
        <Tabs @on-click="handleTabClick" :value="current">
          <!-- <TabPane label="角色信息" name="form1"> -->
            <Form v-show="current == 'form1'" ref="form1" :model="formItem" :rules="formItemRules" :label-width="90" inline label-position="right">
              <FormItem label="父级菜单:" v-if="showparentMenu" >
                <span v-if="EditparentStatus">
                  <Input   @click.native="openParentMenu" v-model="formItem.parentName" placeholder="请选择父级菜单" />
                </span>
                <span v-else >
                  <Input v-model="formItem.parentName" placeholder="请选择父级菜单" disabled/>
                </span>
              </FormItem>
              <FormItem label="菜单名称:" prop="name">
                <Input v-model="formItem.name" placeholder="请输入菜单名称" />
              </FormItem>
              <FormItem label="菜单编码:" prop="code">
                <Input v-model="formItem.code" placeholder="请输入菜单编码" />
              </FormItem>
              <FormItem label="菜单链接:" prop="url">
                <Input v-model="formItem.url"  placeholder="请输入菜单链接" />
              </FormItem>
              <FormItem label="显示顺序:" prop="sort">
                <Input v-model="formItem.sort" placeholder="请输入显示顺序" type="number"/>
              </FormItem>
              <FormItem label="所属子系统" prop="systemId"  v-if="showsysMenu">
                <Select v-if="isShowEditSystemStatus" v-model="formItem.systemId" clearable transfer style="width:162px"><!--filterable 是否可搜索-->
                  <Option :title="item.name" :label="item.name" v-for="item in subsystem" :key="item.id" :value="item.id">
                  </Option>
                </Select>
                <Input v-else v-model="formItem.sysName" disabled/>
              </FormItem>
              <!-- <FormItem label="菜单类型:"  prop="type">
                <Select transfer v-model="formItem.type" style="width:162px">
                  <Option value="0" label="菜单"></Option>
                </Select>
              </FormItem> -->
              <!-- <FormItem label="菜单属性:" style="width:100%" prop="attribute">
                <Button  icon="md-add" shape="circle" @click="addInput"></Button>
              </FormItem>
              <div v-for="(item,i) in attributeList" :key="i">
                <FormItem label="菜单属性:">
                  <Input type="text" v-model="item.attributeName" />
                </FormItem>
                <FormItem label="菜单值:">
                  <Input type="text" v-model="item.attributeValue" />
                  <Button style="margin-left:20px"  icon="md-remove" shape="circle" @click="delInputOld(i)"></Button>
                </FormItem>
              </div>
              <div v-for="(item,i) in inputItem" :key="i">
                <FormItem label="菜单属性:">
                  <Input type="text" v-model="attributeName[i]" />
                </FormItem>
                <FormItem label="菜单值:">
                  <Input type="text" v-model="attributeValue[i]" />

                </FormItem>
                 <Button style="margin-left:20px"  icon="md-remove" shape="circle" @click="delInput(i)"></Button>
              </div> -->

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
      title="选择父级菜单"
      width="35"
      :mask-closable="false"
      @on-cancel="modalVisibletree=false">
      <div>
      <tree-table
        v-if="showParent"
        ref="selsecttree"
        style="max-height:480px;overflow: auto"
        expand-key="name"
        :expand-type="false"
        :is-fold="false"
        :tree-type="true"
        :selectTr="selectTr"
        :selectable="true"
        @radio-click="selectParent"
        :columns="columns3"
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
import TreeTable from '@/components/treeTable/iview-tree-table'
import { systemMenu, selectList, getsystemMenuByID, addSysMenu, updateSysMenu, delSysMenu } from '@/api/functionmenu'
import { startWith, listConvertTree, treeData, createTree } from '@/libs/util'

export default {
  name: 'SystemRole',
  components: {
    HeaderContent,
    TreeTable
  },
  data () {
    const validateEn = (rule, value, callback) => {
      console.log(value)
      let reg = new RegExp('^[0-9]*$')
      if (value === '') {
        callback(new Error('显示顺序不能为空'))
      } else if (value !== '' && !reg.test(value)) {
        callback(new Error('显示顺序只能为自然数'))
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
      titles: ['选择接口', '已选择接口'],
      listStyle: {
        width: '240px',
        height: '500px'
      },
      loading: false,
      tableloading: true,
      modalVisible: false,
      modalVisibletree: false,
      modalTitle: '',
      isShowEditSystemStatus: true,
      EditparentStatus: true,
      saving: false,
      current: 'form1',
      forms: [
        'form1'
      ],
      selectApis: [],
      subsystem: null,
      selectMenus: [{}],
      pageInfo: {},
      formItemRules: {
        code: [
          { required: true, message: '菜单编码不能为空', trigger: 'blur' },
          { pattern: /^[^\s]*$/, message: '不能输入空格', trigger: 'blur' },
          { pattern:/^[^\u4e00-\u9fa5]+$/, message:'不能包含汉字',trigger: 'blur' },
          { min: 2, max: 32, message: '长度为2-32个字符', trigger: 'blur' },
          { validator: validateInput, trigger: 'blur' }
          // {required: true, validator: validateEn, trigger: 'blur'}
        ],
        name: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' },
          { pattern: /^[^\s]*$/, message: '不能输入空格', trigger: 'blur' },
          { min: 2, max: 20, message: '长度为2-20个字符', trigger: 'blur' },
          { validator: validateInput, trigger: 'blur' }
        ],
        url: [
          { required: true, message: '菜单链接不能为空', trigger: 'blur' },
          { required: true, pattern: /^[^\s]*$/, message: '不能输入空格', trigger: 'blur' }
          // { required: true, validator: validateEn, trigger: "blur" },
        ],
        sort: [
          // { required: true, message: "显示顺序不能为空", trigger: "blur", },
          { required: true, validator: validateEn, trigger: 'blur' }
          // { type:'number', required: true, message: "显示顺序只能为数字", trigger: "blur" },
        ],
        systemId: [
          { required: true, message: '所属子系统不能为空', trigger: 'change' }
        ],
        // type:[
        //   { required: true, message: "菜单类型不能为空", trigger: "change" },
        // ],
        attribute: [
          { required: false }
        ]
      },
      formItem: {
        roleId: '',
        roleCode: '',
        roleName: '',
        path: '',
        systemId: '',
        status: 1,
        menuId: '',
        priority: 0,
        roleDesc: '',
        grantMenus: [],
        grantActions: [],
        expireTime: '',
        isExpired: false,
        parentName: '0',
        userIds: []
      },
      handleStatus: null,
      attributeName: {},
      attributeValue: {},
      columns2: [
        {
          title: '菜单名称',
          minWidth: '300',
          key: 'name',
          // tree: true
        },
        {
          title: '菜单编码',
          // minWidth: '300',
          key: 'code'
        },
        {
          title: '菜单链接',
          minWidth: '200',
          key: 'url'
        },
        {
          title: '显示顺序',
          // minWidth: '50',
          key: 'sort'
        },
        {
          title: '所属子系统',
          type: 'template',
          minWidth: '180',
          template: 'systemtemp'
        },
        {
          title: '操作',
          minWidth: '50',
          type: 'template',
          template: 'operation'
        }
      ],
      columns3: [
        {
          title: '菜单名称',
          key: 'name'
        }
      ],
      selectTr: '',
      data: [],
      attributeList: {},
      inputItem: [],
      showParent: false,
      showparentMenu: true,
      showsysMenu: true
    }
  },
  created () {
    this.initsystmList()
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
    async initsystmList () {
      let res = await selectList()
      this.subsystem = res
    },
    async handleModal (status, data) {
      this.handleStatus = status
      if (data) {
        let params = {
          id: data.id
        }
        let res = await getsystemMenuByID(params)
        const { success } = res
        if (success) {
          this.formItem = res.data
          this.attributeList = res.data.attributeList
        } else {
          this.$Message.info(res.status.message)
        }
      }
      if (data) {
        this.formItem = Object.assign({}, this.formItem.systemMenu, data)
        this.formItem.sysName = this.formItem.system.name
        if (this.formItem.parentId == 0) {
          this.formItem.parentName = ''
        } else {
          this.data.forEach(element => {
            if (element.id == this.formItem.parentId) {
              this.formItem.parentName = element.name
            }
          })
        }
      }
      if (status === 'edit') {
        this.attributeName = {}
        this.attributeValue = {}
        this.inputItem = []
        this.isShowEditSystemStatus = false
        this.EditparentStatus = false
        this.showsysMenu = true
        console.log(this.formItem.parentId)
        if (this.formItem.parentId == 0) {
          this.showparentMenu = false
        } else {
          this.showparentMenu = true
        }
      }

      if (status === 'add') {
        this.isShowEditSystemStatus = true
        this.EditparentStatus = true
        this.formItem = {}
        this.attributeName = {}
        this.attributeValue = {}
        this.inputItem = []
        this.selectTr = ''
        this.showParent = true
        this.showparentMenu = true
        this.showparentMenu = true
      }

      if (this.current === this.forms[0]) {
        this.modalTitle = data ? '编辑功能菜单 - ' + data.name : '添加功能菜单'
        this.modalVisible = true
      }
      if (status === 'addnext') {
        this.formItem.name = ''
        this.formItem.code = ''
        this.formItem.url = ''
        this.formItem.sort = ''
        this.formItem.type = ''
        this.attributeList = {}
        this.inputItem = []
        this.isShowEditSystemStatus = false
        this.modalTitle = '添加下级菜单'
        if (this.formItem.parentId == 0) {
          this.showparentMenu = false
        } else {
          this.showparentMenu = true
        }
      }
      // this.formItem.status = this.formItem.status + ''
    },
    openParentMenu () {
      this.modalVisibletree = true
    },
    handleResetForm (form) {
      this.showParent = false
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
      this.modalVisible = false
      this.formItem = newData
      // 重置验证
      this.forms.map(form => {
        this.handleResetForm(form)
      })
      this.current = this.forms[0]
      this.formItem.grantMenus = []
      this.formItem.grantActions = []
      this.saving = false
    },
    selectParent (row, index) {
      console.log(row, index)
      this.formItem.parent_id = row.row.id
      this.formItem.parentName = row.row.name
      this.selectTr = row.row.id
    },
    handleParent () {
      this.modalVisibletree = false
    },
    addInput () {
      this.inputItem.push('')
    },
    delInput (index) {
      this.inputItem.splice(index, 1)
    },
    delInputOld (index) {
      this.attributeList.splice(index, 1)
    },
    handleSubmit () {
      if (this.current === this.forms[0]) {
        this.$refs[this.current].validate(async (valid) => {
          if (valid) {
            this.saving = true
            if (this.handleStatus === 'edit') {
              let params = {
                systemMenu: {
                  id: this.formItem.id,
                  name: this.formItem.name,
                  code: this.formItem.code,
                  url: this.formItem.url,
                  sort: this.formItem.sort,
                  systemId: this.formItem.systemId,
                  parentId: this.formItem.parent_id,
                  type: '0'
                },
                attributeList: []
              }
              for (let k in this.attributeName) {
                let temp = {}
                temp.attributeName = this.attributeName[k]
                temp.attributeValue = this.attributeValue[k]
                params.attributeList.push(temp)
              }
              this.attributeList.forEach(element => {
                let temp = {}
                temp.attributeName = element.attributeName
                temp.attributeValue = element.attributeValue
                temp.id = element.id
                temp.menuId = element.menuId
                params.attributeList.push(temp)
              })
              let res = await updateSysMenu(params)
              const { success, message } = res
              if (success) {
                this.$Message.success('保存成功')
                this.handleReset()
                this.handleSearch()
              } else {
                this.$Message.error(res.status.message)
              }
              this.saving = false
            } else if (this.handleStatus === 'addnext' || this.handleStatus === 'add') {
              let params = {
                systemMenu: {
                  name: this.formItem.name,
                  code: this.formItem.code,
                  url: this.formItem.url,
                  sort: this.formItem.sort,
                  systemId: this.formItem.systemId,
                  parentId: this.formItem.parent_id,
                  type: '0'
                },
                attributeList: []
              }
              if (this.handleStatus === 'add') {
                params.systemMenu.parentId = this.formItem.parent_id ? this.formItem.parent_id : 0
              } else {
                params.systemMenu.parentId = this.formItem.id
              }
              for (let k in this.attributeName) {
                let temp = {}
                temp.attributeName = this.attributeName[k]
                temp.attributeValue = this.attributeValue[k]
                params.attributeList.push(temp)
              }
              // for (let i = 0; i < this.attributeName.lnegth; i++) {

              // }
              let res = await addSysMenu(params)
              const { success, message } = res
              console.log(res)
              if (success) {
                this.$Message.success('保存成功')
                this.handleReset()
                this.handleSearch()
              } else {
                this.$Message.error(res.status.message)
              }
              this.saving = false
            }
          }
        })
      }
    },
    async handleSearch () {
      console.log(this.pageInfo)
      this.loading = true
      let params = {
        name: this.pageInfo.name || '',
        code: this.pageInfo.code || '',
        systemId: this.pageInfo.systemId || '',
        current: 1,
        size: 10
      }
      let res = await systemMenu(params)
      const { success, data } = res
      if (success) {
        this.pageInfo.total = data.length;
        this.data = [].concat(data)
        this.selectMenus = createTree(data)
        console.log(this.selectMenus)
        this.loading = false
        this.tableloading = false
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
          let res = await delSysMenu(params)
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
            if ( res.status.code === 404 ) {
              this.$Message.error('删除失败，请先删除下级菜单!')
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
