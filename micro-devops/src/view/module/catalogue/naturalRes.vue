<!--
 * @Author: 任继民
 * @Date: 2021-05-12 09:52:23
 * @LastEditors: 任继民
 * @LastEditTime: 2021-05-19 16:46:57
 * @Description:
-->
<template>
  <div>
    <HeaderContent>
      <Form ref="searchForm"
        :model="pageInfo"
        inline
        :label-width="110">
        <FormItem label="自然资源名称:" prop="name">
          <Input type="text" v-model="pageInfo.name" placeholder="请输入目录名称"/>
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
          <Button  icon="md-add" type="primary" @click="handleModal('add')">添加自然资源</Button>
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
        <template slot="createTime" slot-scope="scope">
          <span>{{scope.row.createTime?scope.row.createTime.replace("T", ' '):''}}</span>
        </template>
        <template slot="operation" slot-scope="scope">
          <div class="actionIcon">
            <Tooltip content="添加下级自然资源" placement="top">
              <img @click="handleModal('add',scope.row)" src="../../../assets/images/add-icon.png" alt="" srcset="">
            </Tooltip>
            <Tooltip content="编辑" placement="top">
              <img @click="handleModal('edit',scope.row)" src="../../../assets/images/bianji.png" alt="" srcset="">
            </Tooltip>
            <Tooltip content="删除" placement="top">
              <img @click="handleRemove(scope.row)" src="../../../assets/images/shanchu.png" alt="" srcset="">
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
              <FormItem label="自然资源名称:" prop="resourcesName">
                <Input v-model.trim="formItem.resourcesName" placeholder="请输入自然资源名称" />
              </FormItem>
              <FormItem label="自然资源编码:" prop="resourcesCode">
                <Input v-model.trim="formItem.resourcesCode" placeholder="请输入自然资源编码" />
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
  </div>
</template>

<script>
import TreeTable from '@/components/treeTable/iview-tree-table'
import { getResourTree, setNaturalResour, updateNaturalResour, deleteNaturalResour } from '@/api/catalogue'
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
        resourcesName: [
          { required: true, message: '自然资源名称不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '自然资源名称在2-20个字符之间', trigger: 'blur' },
          { pattern: /^[^\s]*$/, message: '自然资源名称不能输入空格', trigger: 'blur' },
          { validator: validateInput, trigger: 'blur' }
        ],
        resourcesCode: [
          { required: true, message: '自然资源编码不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '自然资源编码在2-20个字符之间', trigger: 'blur' },
          { pattern: /^[^\s]*$/, message: '自然资源编码不能输入空格', trigger: 'blur' },
          { validator: validateInput, trigger: 'blur' }
        ],
      },
      formItem: {
      },
      handleStatus: null,
      selectList: null,
      columns: [
        {
          title: '自然资源名称',
          key: 'resourcesName',
          tree: true
        },
        {
          title: '自然资源编码',
          key: 'resourcesCode'
        },
        // {
        //   title: '目录类型',
        //   key: 'type'
        // },
        {
          title: '创建用户',
          key: 'creatorBy'
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
    treeData(data, pid = "pid") {
      // 删除所有 children,以防止多次调用
      arr.forEach(function (item) {
        delete item.children;
      });
      let map = {}; // 构建map
      arr.forEach((i) => {
        map[i.id] = i; // 构建以area_id为键 当前数据为值
      });

      let treeData = [];
      arr.forEach((child) => {
        const mapItem = map[child[pid]]; // 判断当前数据的pid是否存在map中

        if (mapItem) { // 存在则表示当前数据不是最顶层数据
          // 注意: 这里的map中的数据是引用了arr的它的指向还是arr，当mapItem改变时arr也会改变,踩坑点
          (mapItem.children || (mapItem.children = [])).push(child); // 这里判断mapItem中是否存在children, 存在则插入当前数据, 不存在则赋值children为[]然后再插入当前数据
        } else { // 不存在则是组顶层数据
          treeData.push(child);
        }
      });

      return treeData;
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
      } else {
        this.addChildren = false
      }

      if (data) {
        this.formItem = Object.assign({}, this.formItem, data)
      }
      if (status === 'add' && !data) {
        this.formItem = {}
      }
      if (status === 'add') {
        this.formItem = {};
        this.formItem.id = data.id;
      }
      if (this.current === this.forms[0]) {
        if (status === 'edit') {
          this.modalTitle = '编辑自然资源 - ' + data.name
        } else {
          if (this.addChildren) {
            this.modalTitle = '添加下级自然资源'
          } else if (!this.addChildren) {
            this.modalTitle = '添加自然资源'
          }
        }
        // this.modalTitle = status === 'edit' ? '编辑数据类型 - ' + data.name : '添加数据类型'
        this.modalVisible = true
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
                resourcesCode: this.formItem.resourcesCode,
                resourcesName: this.formItem.resourcesName,
                pid: this.formItem.pid || 0
              }
              let res = await updateNaturalResour(params)
              const { success } = res
              if (success) {
                this.saving = false
                this.$Message.success('保存成功')
                this.handleReset()
                this.handleSearch()
              } else {
                this.saving = false
                this.$Message.info(res.status.message)
              }
            } else {
              let params = {
                resourcesCode: this.formItem.resourcesCode,
                resourcesName: this.formItem.resourcesName,
                pid: this.formItem.id || 0
              }
              console.log(this.formItem.id)
              let res = await setNaturalResour(params)
              const { success } = res
              if (success) {
                this.saving = false
                this.$Message.success('保存成功')
                this.handleReset()
                this.handleSearch()
              } else {
                this.saving = false
                this.$Message.info(res.status.message)
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
      }
      let res = await getResourTree(params)
      const { success, body } = res
      if (success) {
        this.data = body
        this.pageInfo.total = body.length;
        this.selectMenus = createTree(body,'pid')
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
          let params = data.id;
          let res = await deleteNaturalResour(params)
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
