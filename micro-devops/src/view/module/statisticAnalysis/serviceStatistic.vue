<template>
  <div>
    <HeaderContent>
      <Form ref="searchForm" :model="pageInfo" inline :label-width="80">
        <FormItem label="控制类型" prop="user_check_type">
          <Select v-model="pageInfo.user_check_type">
            <Option value="">请选择</Option>
            <Option value="1">某一用户</Option>
            <Option value="2">某一IP</Option>
          </Select>
        </FormItem>
        <FormItem label="状态" prop="status">
          <Select v-model="pageInfo.status">
            <Option value="">请选择</Option>
            <Option value="1">有效</Option>
            <Option value="2">已删除</Option>
            <Option value="3">自动失效</Option>
          </Select>
        </FormItem>
        <FormItem label="开始时间" prop="start">
          <Input type="text" v-model="pageInfo.start" placeholder="请输入开始时间" />
        </FormItem>
        <FormItem label="结束时间" prop="end">
          <Input type="text" v-model="pageInfo.end" placeholder="请输入结束时间" />
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
      </div>
      <Table border :columns="columns" :data="data" :loading="loading">
        <template slot="user_check_type" slot-scope="{ row }">
          <div v-if="row.user_check_type== '0'">某一IP</div>
          <div v-else>某一用户</div>
        </template>
        <template slot="status" slot-scope="{ row }">
          <div v-if="row.status== '1'">有效</div>
          <div v-else-if="row.status== '2'">已删除</div>
          <span v-else>自动失效</span>
        </template>
        <template slot="time_limit_start" slot-scope="{ row }">
          <span>{{row.time_limit_start | formatDate}}</span>
        </template>
        <template slot="time_limit_end" slot-scope="{ row }">
          <span>{{row.time_limit_end | formatDate}}</span>
        </template>
        <template slot="create_date" slot-scope="{ row }">
          <span>{{row.create_date | formatDate}}</span>
        </template>
        <template slot="action" slot-scope="{ row }">
          <a @click="handleModal(row)" v-if="row.status != '0'">详情</a>
          <a @click="handleModal(row)" v-if="row.status == '0'">认证</a>
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
  </div>
</template>

<script>
import  HeaderContent from '@/components/header-content/index'
import { getserviceControlList } from '@/api/serviceInspection'

export default {
  name: 'SystemRole',
  components: {
    HeaderContent
  },
  filters: {
    'formatDate': function(value) {
      if (value != null) {
        let date = new Date(value);
        let getMonth = (date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1);
        let getDate = date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate();
        let getHours = date.getHours() < 10 ? ("0" + date.getHours()) : date.getHours();
        let getMinutes = date.getMinutes() < 10 ? ("0" + date.getMinutes()) : date.getMinutes();
        let getSeconds = date.getSeconds() < 10 ? ("0" + date.getSeconds()) : date.getSeconds();
        return date.getFullYear() + "-" + getMonth + "-" + getDate + " " + getHours + ":" + getMinutes + ":" + getSeconds;
      } else {
        return "";
      }
    }
  },
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
        roleName: '',
      },
      formItemRules: {
        code: [{ required: true, validator: validateEn, trigger: 'blur' }],
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      rowInfoRules: {
        authMsg: [
          { required: true, message: '认证信息不能为空', trigger: 'blur' },
          { required: true, pattern: /^[^\s]*$/, message: '认证信息不能包含空格', trigger: 'blur' }
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
          title: '控制类型',
          key: 'user_check_type',
          slot: 'user_check_type'
        },
        {
          title: '用户名或IP值',
          key: 'user_id_or_ip'
        },
        {
          title: '服务名称',
          key: 'serviceD'
        },
        {
          title: '限制开始时间',
          key: 'time_limit_start',
          slot: 'time_limit_start'
        },
        {
          title: '限制结束时间',
          key: 'time_limit_end',
          slot: 'time_limit_end'
        },
        {
          title: '状态',
          key: 'status',
          slot: 'status'
        },
        {
          title: '备注',
          key: 'remark'
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
      data: []
    }
  },
  methods: {
    handleModal (data) {
      this.modalVisible = true
      this.rowInfo = data
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
            if (this.handleStatus === 'edit') {
              let params = {
                id: this.formItem.id,
                name: this.formItem.name,
                code: this.formItem.code,
                parentId: this.formItem.parentId,
                parentIds: this.formItem.parentIds,
                adminUser: this.formItem.adminUser
              }
              let res = await updateOrg(params)
              const { success, message } = res
              if (success) {
                this.$Message.success('保存成功')
                this.handleReset()
                this.handleSearch()
              }
              this.saving = false
            } else {
              let params = {
                name: this.formItem.name,
                code: this.formItem.code,
                parentId: this.formItem.parentId,
                parentIds: this.formItem.parentIds,
                isDepart: this.formItem.isDepart
              }
              let res = await addOrg(params)
              const { success, message } = res
              if (success) {
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
      if (page) {
        this.pageInfo.page = page
      }
      this.loading = true
      let params = {
        page: this.pageInfo.page,
        create_date_begin: this.pageInfo.create_date_begin,
        create_date_end: this.pageInfo.create_date_end,
        rows: this.pageInfo.limit,
        status: this.pageInfo.status,
        user_check_type: this.pageInfo.user_check_type
      }
      let res = await getserviceControlList(params);
      const { status, rows, total } = res
      if (status) {
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
