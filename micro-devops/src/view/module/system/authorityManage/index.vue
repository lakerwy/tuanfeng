<!--
 * @Author: 任继民
 * @Date: 2020-11-18 14:18:08
 * @LastEditors: 任继民
 * @LastEditTime: 2021-05-19 15:48:30
 * @Description:
-->
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
      </div>
      <Table border :columns="columns" :data="data" :loading="loading">
        <template slot="createDate" slot-scope="{ row }">
          <span>{{row.createDate?row.createDate.replace("T", ' '):''}}</span>
        </template>
        <template slot="action" slot-scope="{ row }">
          <img src="../../../../assets/images/bianji.png" @click="handleModal(row)" alt="" srcset="">
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
          <TabPane  label="菜单权限" name="menuform">
            <Form v-show="current == 'menuform'" ref="menuform" :model="formItem"  :label-width="100">
              <Tree class="role-tree" :data="authTreedata" ref="authTreedata" show-checkbox :render="renderAuthTree"/>
            </Form>
          </TabPane>
          <TabPane  label="业务类型权限" name="businessform">
            <Form v-show="current == 'businessform'" ref="businessform" :model="formItem"  :label-width="100">
              <Tree class="role-tree" :data="businessTreedata" ref="businessTreedata" show-checkbox :render="renderAuthTree"/>
            </Form>
          </TabPane>
          <TabPane  label="成果目录权限" name="categoryform">
            <Form v-show="current == 'categoryform'" ref="categoryform" :model="formItem"  :label-width="100">
              <Tree class="role-tree" :data="categoryTreedata" ref="categoryTreedata" show-checkbox :render="renderAuthTree"/>
            </Form>
          </TabPane>
          <TabPane  label="数据领域权限" name="domainform">
            <Form v-show="current == 'domainform'" ref="domainform" :model="formItem"  :label-width="100">
              <Tree class="role-tree" :data="domainTreedata" ref="domainTreedata" show-checkbox :render="renderDomainTree"/>
            </Form>
          </TabPane>
          <TabPane  label="来源单位权限" name="unitform">
            <Form v-show="current == 'unitform'" ref="unitform" :model="formItem"  :label-width="100">
              <Tree class="role-tree" :data="unitTreedata" ref="unitTreedata" show-checkbox :render="renderUnitTree"/>
            </Form>
          </TabPane>
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
import Qs from 'qs';
import  HeaderContent from '@/components/header-content/index'
import { getDataDomain } from '@/api/catalogue'
import { getMetaDataCategory } from '@/api/catalogue'
import { getBusinessDir } from '@/api/catalogue'
import { getSourceUnit } from '@/api/catalogue'
import { getRoles, findById, collections, updateRole, addRole, setBusiness,  setCategory, setDomain, setUnit} from '@/api/role'
import { createTree } from '@/libs/util'
export default {
  name: 'SystemRole',
  data () {
    return {
      loading: false,
      modalVisible: false,
      modalTitle: '分配菜单权限',
      saving: false,
      current: 'menuform',
      forms: [
        'menuform',
        'businessform',
        'categoryform',
        'domainform',
        'unitform'
      ],
      businessTreedata: null,
      categoryTreedata: null,
      domainTreedata: null,
      unitTreedata: null,
      selectApis: [],
      selectMenus: [],
      selectUsers: [],
      pageInfo: {
        total: 0,
        page: 1,
        limit: 10,
        roleCode: '',
        roleName: ''
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
      currentRoleId: null,
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
      columns2: [
        {
          title: '菜单',
          key: 'name',
          minWidth: '250px'
        },
        {
          title: '操作',
          type: 'template',
          template: 'operation',
          minWidth: '200px'
        }
      ],
      data: [],
      authTreedata: null,
      hasMenuList: null,
      hasMenuArr: [],
      addmodalVisible: false,
      leftMovekey: [],
      rightMovekey: [],
      selectTarget: [] // 点击过的菜单
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
    selectedNode(alllist,sellist) {
      const temparr = [];
      sellist.forEach(item => {
        temparr.push(item.id)
      })
      alllist.forEach(item => {
        if (temparr.includes(item.id)) {
          item.checked = true;
        }
      })
    },
    getSelcetId(val) {
      let temparr = [];
      if (val.length > 0) {
        val.forEach(item => {
          temparr.push(item.id)
        })
      }
      return temparr;
    },
    async handleModal (data) {
      this.currentRoleId = data.id;
      let params = {
        id: data.id
      }
      let res = await findById(params)
      const { success } = res
      if (success) {
        this.roleInfo = res.data
        this.formItem = res.data.role
        res.data.allMenuList.forEach(item => {
          item.children = createTree(item.children)
        })
        this.authTreedata = res.data.allMenuList
        this.hasMenuList = res.data.hasMenuList
        this.hasMenuList.forEach(item => {
          this.hasMenuArr.push(item.menuId)
        })
        if (res.data.hasMenuList) {
          this.assignItem(res.data.allMenuList)
        }
        res.data.hasRoleUser.forEach(item => {
          this.targetKeys.push(item.id)
        })
      }
      if (data) {
        this.formItem = Object.assign({}, this.formItem, data)
        this.modalVisible = true
      }
      this.formItem.status = this.formItem.status + ''
    },
    renderAuthTree (h, { root, node, data }) {
      return h('span', data.name)
    },
    renderDomainTree (h, { root, node, data }) {
      return h('span', data.dataName)
    },
    renderUnitTree (h, { root, node, data }) {
      return h('span', data.sourceName)
    },
    handleResetForm (form) {
      this.$refs[form].resetFields()
    },
    async handleTabClick (name) {
      this.current = name;
      let res = null;
      let checkedres = null;
      let modtitle = '';
      let params = {
        current: 1,
        size: 200
      };
      if (!this.selectTarget.includes(name)) {
        this.selectTarget.push(name)
      }
      // console.log(this.selectTarget)
      switch(name) {
        case 'menuform':
          modtitle = '菜单权限';
          break;
        case 'businessform':
          modtitle = '业务类型权限';
          if (!this.businessTreedata) {
            res = await getBusinessDir(params);
            checkedres = await collections({
              roleId: this.currentRoleId,
              type:'business'
            });
            if (res.success) {
              this.businessTreedata = createTree(res.body,'parentId')
            }
            if (checkedres.success) {
              this.selectedNode(res.body,checkedres.body)
            }
          }
          break;
        case 'categoryform':
          modtitle = '成果目录权限';
          if (!this.categoryTreedata) {
            res = await getMetaDataCategory(params);
            checkedres = await collections({
              roleId: this.currentRoleId,
              type:'category'
            });
            if (res.success) {
              this.categoryTreedata = createTree(res.body)
            }
            if (checkedres.success) {
              this.selectedNode(res.body,checkedres.body)
            }
          }
          break;
        case 'domainform':
          modtitle = '数据领域权限';
          if (!this.domainTreedata) {
            res = await getDataDomain(params);
            checkedres = await collections({
              roleId: this.currentRoleId,
              type:'domain'
            });
            if (res.success) {
              this.domainTreedata = createTree(res.body,'pid')
            }
            if (checkedres.success) {
              this.selectedNode(res.body,checkedres.body)
            }
          }
          break;
        case 'unitform':
          modtitle = '来源单位权限';
          if (!this.unitTreedata) {
            res = await getSourceUnit(params);
            checkedres = await collections({
              roleId: this.currentRoleId,
              type:'unit'
            });
            if (res.success) {
              this.unitTreedata = createTree(res.body,'pid')
            }
            if (checkedres.success) {
              this.selectedNode(res.body,checkedres.body)
            }
          }
          break;
        default:
          break;
      }
      this.modalTitle = `分配${modtitle}`;
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
    getSubParams(val) {
      return Qs.stringify({
        ids:  (this.getSelcetId(this.$refs[val].getCheckedNodes()) || []),
        roleId: this.currentRoleId
      },{indices:false});
    },
    async handleSubmit () {
      const promises = [];
      let that = this
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
      params.addMenuList = this.compareArr(this.roleInfo.hasMenuList, this.$refs.authTreedata.getCheckedAndIndeterminateNodes(), 'menuId', true).add
      params.delMenuList = this.compareArr(this.roleInfo.hasMenuList, this.$refs.authTreedata.getCheckedAndIndeterminateNodes(), 'menuId', true).del;
      promises.push(updateRole(params));

      if (this.selectTarget.includes('businessform')) {
        promises.push(setBusiness(this.getSubParams('businessTreedata')))
      }
      if(this.selectTarget.includes('categoryform')) {
        promises.push(setCategory(this.getSubParams('categoryTreedata')))
      }
      if (this.selectTarget.includes('domainform')) {
        promises.push(setDomain(this.getSubParams('domainTreedata')))
      }
      if (this.selectTarget.includes('unitform')) {
        promises.push(setUnit(this.getSubParams('unitTreedata')))
      }

      let res = await Promise.allSettled(promises);

      res.forEach(item => {
        if (!item.value.success) {
          this.$Message.warning(res.status.message)
        }
      })
      this.modalVisible = false
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
      beforeArr = Array.from(new Set(beforeArr))
      afterArr = Array.from(new Set(afterArr))
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
