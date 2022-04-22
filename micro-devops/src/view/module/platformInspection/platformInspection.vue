<template>
  <div>
    <HeaderContent>
      <Form ref="searchForm" :model="pageInfo" inline :label-width="80">
        <FormItem label="服务名称" prop="serviceName">
          <Input type="text" v-model="pageInfo.serviceName" placeholder="请输入服务名称" />
        </FormItem>
        <FormItem label="开始时间" prop="startDate">
          <DatePicker date="yyyy-MM-dd" :options="startOptions" v-model="pageInfo.start" type="date"  placeholder="请输入开始时间" @on-change="handleStartTime"	></DatePicker>
        </FormItem>
        <FormItem label="结束时间" prop="endDate">
          <DatePicker date="yyyy-MM-dd" :options="endOptions" v-model="pageInfo.end" type="date"  placeholder="请输入结束时间" @on-change="handleEndTime"></DatePicker>
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
        <template slot="isSelf" slot-scope="{ row }">
          <span v-if="row.isSelf == '1'">是</span>
          <span v-else>否</span>
        </template>
        <template slot="isAuth" slot-scope="{ row }">
          <span v-if="row.isAuth == '1'">是</span>
          <span v-else>否</span>
        </template>
        <template slot="status" slot-scope="{ row }">
          <span v-if="row.status == '1'">通过</span>
          <span v-else>未通过</span>
        </template>
        <template slot="createDate" slot-scope="{ row }">
          <span>{{row.createDate? row.createDate.replace("T", ' '):''}}</span>
        </template>
        <template slot="action" slot-scope="{ row }">
          <div class="actionIcon">
            <Tooltip content="详情" placement="top">
              <img @click="handleModal(row)" src="../../../assets/images/查看icon.png" alt="" srcset="">
            </Tooltip>
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
    <Modal v-model="modalVisible"
      title="查看平台服务"
      width="50"
      class-name="user-modal"
      :mask-closable="false"
      >
      <div class="platform-view">
        <div class="list">
          <div>服务名称：<span>{{rowInfo.serviceName}}</span></div>
          <div>url真实地址：<span>{{rowInfo.url}}</span></div>
        </div>
        <div class="list">
          <div>服务地址1级：<span>{{rowInfo.serviceUrlClassification1}}</span></div>
          <div>服务地址2级：<span>{{rowInfo.serviceUrlClassification2}}</span></div>
        </div>
        <!-- <div class="list">
          <div>是否有服务：<span>{{rowInfo.isSelf==1?'是':'否'}}</span></div>
          <div>是否需要授权：<span>{{rowInfo.isAuth==1?'是':'否'}}</span></div>
        </div> -->
        <div class="list">
          <div>状态：<span>{{rowInfo.status==1?'通过':'未通过'}}</span></div>
          <div>服务描述：<span>{{rowInfo.serviceDesc}}</span></div>
        </div>
        <div class="list">
          <div>创建时间：<span>{{rowInfo.createDate? rowInfo.createDate.replace("T", ' '):''}}</span></div>
          <div>更新时间：<span>{{rowInfo.updateDate? rowInfo.updateDate.replace("T", ' '):''}}</span></div>
        </div>
        <div class="list">
          <div>结果描述：<span>{{rowInfo.resultDesc}}</span></div>
          <div>版本号：<span>{{rowInfo.version}}</span></div>
        </div>
        <div class="list">
          <div>备注：<span>{{rowInfo.remark}}</span></div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import  HeaderContent from '@/components/header-content/index'
import { getServiceInspectiond } from '@/api/serviceInspection'

export default {
  name: 'SystemRole',
  components: {
    HeaderContent
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
        roleName: ''
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

      },
      handleStatus: null,
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 65,
          align: 'center'
        },
        {
          title: '服务名称',
          key: 'serviceName'
        },
        {
          title: 'url真实地址',
          key: 'url',
          tooltip: true,
        },
        {
          title: '服务地址1级',
          key: 'serviceUrlClassification1'
        },
        {
          title: '服务地址2级',
          key: 'serviceUrlClassification2'
        },
        // {
        //   title: '是否有服务',
        //   key: 'isSelf',
        //   slot: 'isSelf'
        // },
        // {
        //   title: '是否需要授权',
        //   key: 'isAuth',
        //   slot: 'isAuth'
        // },
        {
          title: '状态',
          key: 'status',
          slot: 'status'
        },
        {
          title: '创建时间',
          key: 'createDate',
          width: '200',
          slot: 'createDate'
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
      startOptions: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now();
        }
      },
      endOptions: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now();
        }
      }
    }
  },
  methods: {
    handleStartTime(value) {
      this.pageInfo.start = value;
      this.endOptions = {
        disabledDate:date =>{
          if (this.pageInfo.start) {
            return date && date.valueOf() < new Date(this.pageInfo.start).getTime()
          }else {
            return date && date.valueOf() > Date.now();
          }
        }
      }
    },
    handleEndTime(value) {
      this.pageInfo.end = value;
      this.startOptions = {
        disabledDate:date =>{
          if (this.pageInfo.end) {
            return date && date.valueOf() > new Date(this.pageInfo.end).getTime() - 86400000
          }else {
            return date && date.valueOf() > Date.now();
          }
        }
      }
    },
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
        serviceName: this.pageInfo.serviceName,
        start: this.pageInfo.start,
        end: this.pageInfo.end,
        current: this.pageInfo.page,
        size: this.pageInfo.limit
      }
      let res = await getServiceInspectiond(params)
      const { success, body } = res
      if (success) {
        this.data = body.records
        this.pageInfo.total = body.total
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
<style lang="less" scoped>
.platform-view {
  .list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    div {
      color: #162d7a ;
      span {
        color: #6a7496;
        display: inline-block;
        word-wrap: break-word;
        word-break: normal;
      }
    }
    div:nth-child(1) {
      width: 30%;
    }
    div:nth-child(2) {
      width: 70%;
    }
  }
}
</style>
