<!--
 * @Author: 任继民
 * @Date: 2020-11-17 10:34:31
 * @LastEditors: 任继民
 * @LastEditTime: 2020-11-20 16:41:02
 * @Description:
-->
<template>
  <div>
    <HeaderContent>
      <Form ref="searchForm" :model="pageInfo" inline :label-width="80">
        <FormItem label="名称" prop="name">
          <Input type="text" v-model="pageInfo.name" placeholder="请输入名称" />
        </FormItem>
        <FormItem label="编码" prop="code">
          <Input type="text" v-model="pageInfo.code" placeholder="请输入连接名称" />
        </FormItem>
        <FormItem label="上级类型" prop="parent_id">
          <Select v-model="pageInfo.parent_id">
            <Option value="">请选择</Option>
            <Option v-for="item in allServiceType" :key="item.code" :value="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="状态" prop="disabled">
          <Select v-model="pageInfo.disabled">
            <Option value="">请选择</Option>
            <Option value="0">启用</Option>
            <Option value="1">禁用</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSearch(1)">查询</Button>&nbsp;
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
          <Button class="search-btn" type="primary" @click="handleModal({},'add')">
            <span>添加分组</span>
          </Button>
        </div>
      </div>
      <Table border :columns="columns" :data="data" :loading="loading">
        <template slot="disabled" slot-scope="{ row }">
          <span v-if="row.disabled == '0'">启用</span>
          <span v-else>禁用</span>
        </template>
        <template slot="create_date" slot-scope="{ row }">
          <span>{{row.create_date | dateTime }}</span>
        </template>
        <template slot="parent_id" slot-scope="{ row }">
          <span>{{row.parent_id | getParent(allServiceType)}}</span>
        </template>
        <template slot="action" slot-scope="{ row }">
          <div class="actionIcon">
            <img src="../../../assets/images/bianji.png" alt="" srcset="" @click="handleModal(row, 'edit')">
            <img v-if="row.disabled == '0'" src="../../../assets/images/stop-icon.png" alt="" srcset="" @click="handleTabClick(row, 'stop')">
            <img v-else src="../../../assets/images/play-icon.png" alt="" srcset="" @click="handleTabClick(row, 'stop')">
            <img src="../../../assets/images/shanchu.png" alt="" srcset="" @click="handleTabClick(row, 'del')">
          </div>
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
    <Modal v-model="modalVisible" :title="modalTitle" width="602" @on-cancel="handleReset" :mask-closable="false">
      <div>
        <Form
          v-show="current == 'form1'"
          ref="form1"
          :model="formItem"
          label-position="right"
          :rules="formItemRules"
          :label-width="100"
        >
          <FormItem label="名称:" prop="name">
            <Input v-model="formItem.name" placeholder="请输入名称" />
          </FormItem>
          <FormItem label="编码:" prop="code">
            <Input v-model="formItem.code" placeholder="请输入编码" />
          </FormItem>
          <FormItem label="上级类型:" prop="parent_id">
            <Select v-model="formItem.parent_id">
              <Option v-for="item in allServiceType" :key="item.code" :value="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="排序:" prop="show_index">
            <Input  v-model="formItem.show_index" placeholder="请输入排序" number/>
          </FormItem>
          <FormItem label="备注:" prop="remark">
            <Input maxlength="200" type="textarea" show-word-limit :rows="4" v-model="formItem.remark" placeholder="请输入备注" />
          </FormItem>
        </Form>
        <div class="drawer-footer">
          <Button type="default" @click="handleReset">取消</Button>&nbsp;
          <Button type="primary" @click="handleSubmit" :loading="saving">保存</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import  HeaderContent from '@/components/header-content/index'
import { getserviceTypeList, getserviceTypeAdd, getserviceTypeUpdate, getserviceTypeDisable,getserviceTypeDelete, getallServiceType } from '@/api/serveiceRegist'

export default {
  name: 'SystemRole',
  components: {
    HeaderContent
  },
  filters: {
    getParent:function(val,list) {
      console.log(list.filter(item => item.id == val))
      return list.filter(item => item.id == val)[0].name;
    },
    dateTime:function(val) {
      const dateee = new Date(val).toJSON();
      let date = new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
      return date;
    }
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
      modalTitle: '',
      saving: false,
      current: 'form1',
      forms: ['form1'],
      selectApis: [],
      selectMenus: [],
      pageInfo: {
        total: 0,
        page: 1,
        limit: 10,
        roleCode: '',
        roleName: ''
      },
      formItemRules: {
        code: [
          { required: true, message: '编码不能为空', trigger: 'blur' },
          { required: true, min: 2, max: 15, message: '长度为2-15个字符', trigger: 'blur' },
          { pattern:/^[^\u4e00-\u9fa5]+$/, message:'不能包含汉字',trigger: 'blur' },
          { required: true, pattern: /^[^\s]*$/, message: '编码不能输入空格', trigger: 'blur' },
          { required: true, validator: validateInput, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
          { required: true, min: 2, max: 15, message: '长度为2-15个字符', trigger: 'blur' },
          { required: true, pattern: /^[^\s]*$/, message: '名称不能输入空格', trigger: 'blur' },
        ],
        show_index: [
          { required: true, type: 'number', message: '排序不能为空或者字符串', trigger: 'blur' },
          // { pattern: /^\d+$/, message: '排序只能输入数字', trigger: 'blur' }
        ],
        parent_id: [
          { required: true, message: '上级类型不能为空', trigger: 'blur' },
        ],
        remark: [
          { pattern: /^[^\s]*$/, message: '备注不能输入空格', trigger: 'blur' },
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
      handleStatus: null,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '编码',
          key: 'code'
        },
        {
          title: '上级类型',
          key: 'parent_id',
          slot: 'parent_id'
        },
        {
          title: '排序',
          key: 'show_index'
        },
        {
          title: '状态',
          key: 'disabled',
          slot: 'disabled'
        },
        {
          title: '创建时间',
          key: 'create_date',
          slot: 'create_date'
        },
        {
          title: '操作',
          slot: 'action'
        }
      ],
      rowInfo: {
        code: '',
        fileUrl: '',
        createUser: '',
        id: '',
        name: '',
        parentId: '',
        parentIds: '',
        status: '',
        authMsg: ''
      },
      data: [],
      allServiceType: null
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
    handleModal (data, status) {
      this.modalVisible = true;
      this.handleStatus = status;
      this.formItem = Object.assign({},data);
      this.modalTitle = status=== 'edit'? '编辑专题授权':'新增专题授权';
    },
    handleResetForm (form) {
      this.$refs[form].resetFields()
    },
    handleTabClick (data, status) {
      if (status === 'stop') {
        this.$Modal.confirm({
          title: `确定要停止${data.name}吗？`,
          onOk: async () => {
            let params = {
              id: data.id
            };
            let res = await getserviceTypeDisable(params)
            if (res.status) {
              this.$Message.success('停止成功')
              this.handleSearch()
            }
          }
        })
      }else {
        this.$Modal.confirm({
          title: `确定删除${data.name}吗？`,
          onOk: async () => {
            let params = {
              id: data.id,
              code: data.codec
            }
            let res = await getserviceTypeDelete(params)
            if (res.status) {
              this.$Message.success('删除成功')
              this.handleSearch()
            }
          }
        })
      }
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
      console.log(this.formItem)
      if (this.current === this.forms[0]) {
        this.$refs[this.current].validate(async valid => {
          if (valid) {
            this.saving = true
            if (this.handleStatus === 'edit') {
              let params = {
                id: this.formItem.id,
                name: this.formItem.name,
                code: this.formItem.code,
                show_index: this.formItem.show_index,
                parent_id: this.formItem.parent_id,
                remark: this.formItem.remark,
              }
              let res = await getserviceTypeUpdate(params)
              const { status } = res
              if (status) {
                this.$Message.success('保存成功')
                this.handleReset()
                this.handleSearch()
              }
              this.saving = false
            } else {
              let params = {
                name: this.formItem.name,
                code: this.formItem.code,
                show_index: this.formItem.show_index,
                parent_id: this.formItem.parent_id,
                remark: this.formItem.remark,
              }
              let res = await getserviceTypeAdd(params)
              const { status } = res
              if (status) {
                this.$Message.success('保存成功')
                this.handleReset()
                this.handleSearch()
              }
              this.saving = false
            }
          }
        })
      }
    },
    async handleSearch (page) {
      let allServiceType = await getallServiceType();
      this.allServiceType = allServiceType;
      if (page) {
        this.pageInfo.page = page
      }
      this.loading = true
      let params = {
        page: this.pageInfo.page || 1,
        rows: this.pageInfo.limit || 10,
        name: this.pageInfo.name || '',
        code: this.pageInfo.code || '',
        parent_id: this.pageInfo.parent_id || '',
        disabled: this.pageInfo.disabled || ''
      }
      let res = await getserviceTypeList(params)
      const { status, rows, total } = res
      if (!status) {
        this.data = rows
        this.pageInfo.total = total
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
