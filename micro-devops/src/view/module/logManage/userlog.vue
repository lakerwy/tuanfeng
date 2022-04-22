<!--
 * @Author: 任继民
 * @Date: 2020-11-17 15:22:40
 * @LastEditors: 任继民
 * @LastEditTime: 2021-01-05 16:32:44
 * @Description:
-->
<template>
  <div>
    <HeaderContent>
      <Form ref="searchForm" :model="pageInfo" inline :label-width="80">
        <FormItem label="服务名称" prop="request_service_id">
          <Input type="text" v-model="pageInfo.request_service_id" placeholder="请输入服务名称" />
        </FormItem>
        <FormItem label="请求者" prop="user_id">
          <Input type="text" v-model="pageInfo.user_id" placeholder="请输入请求者" />
        </FormItem>
        <FormItem label="请求结果" prop="request_result">
         <Select v-model="pageInfo.request_result" style="width:100px">
          <Option value="">请选择</Option>
          <Option value="1">成功</Option>
          <Option value="2">失败</Option>
         </Select>
        </FormItem>
        <FormItem label="创建时间" prop="startDate">
          <DatePicker date="yyyy-MM-dd" :options="startOptions" v-model="pageInfo.startDate" type="date"  placeholder="请输入创建时间" @on-change="handleStartTime"	></DatePicker>
        </FormItem>
        <FormItem label="结束时间" prop="endDate">
          <DatePicker date="yyyy-MM-dd" :options="endOptions" v-model="pageInfo.endDate" type="date"  placeholder="请输入结束时间" @on-change="handleEndTime"></DatePicker>
        </FormItem>
        <!-- <FormItem label="创建时间" prop="startDate">
          <DatePicker type="datetime" ref="startDate" @on-change="showTimePanel('startDate')"  v-model="pageInfo.startDate"  placeholder="请输入开始时间"></DatePicker>
        </FormItem>
        <FormItem label="结束时间" prop="endDate">
          <DatePicker type="datetime" ref="endDate" @on-change="showTimePanel('endDate')"  v-model="pageInfo.endDate"  placeholder="请输入开始时间"></DatePicker>
        </FormItem> -->
        <FormItem>
          <Button type="primary" @click="handleSearch(1)">查询</Button>&nbsp;
          <!--<Button type="primary" @click="handleSearch(1)">导出</Button>&nbsp;-->
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
      <Table border tooltip :columns="columns" :data="data" :loading="loading">
        <template slot="request_time" slot-scope="{ row }">
          <span>{{row.request_time | dateTime}}</span>
        </template>
        <template slot="request_result" slot-scope="{ row }">
          <section class="table-status">
            <div v-if="row.request_result == '1'">
              <img src="../../../assets/images/icon-pass.png" alt="" srcset="">
              <span>成功</span>
            </div>
            <div v-else>
              <img src="../../../assets/images/icon-failed.png" alt="" srcset="">
              <span>失败</span>
            </div>
          </section>
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
import { serviceRequestLogList } from '@/api/logs'
import  HeaderContent from '@/components/header-content/index'
export default {
  name: 'SystemRole',
  components: {
    HeaderContent
  },
  filters: {
    dateTime: function(val) {
      const dateee = new Date(val).toJSON();
      let date = new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
      return date;
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
      titles: ['选择接口', '已选择接口'],
      listStyle: {
        width: '240px',
        height: '500px'
      },
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
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        authMsg: [
          { required: true, message: '审核信息不能为空', trigger: 'blur' },
          { required: true, pattern: /^[^\s]*$/, message: '审核信息不能包含空格', trigger: 'blur' }
        ]
      },
      formItem: {},
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
          key: 'service_name'
        },
        {
          title: '请求者',
          key: 'user_id',
          tooltip: true
        },
        {
          title: '请求者IP',
          key: 'request_ip'
        },
        {
          title: '请求方式',
          key: 'request_type'
        },
        {
          title: '请求结果',
          key: 'request_result',
          slot: 'request_result'
        },
        {
          title: '请求开始时间',
          key: 'request_time',
          slot: 'request_time'
        },
        {
          title: '请求耗时(毫秒)',
          key: 'request_cost_time'
        }
      ],
      data: [],
      curentHandle: 'view',
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
      if(value){
        this.pageInfo.startDate = `${value} 00:00:00`;
      }else{
        this.pageInfo.startDate =""
      }
      this.endOptions = {
        disabledDate:date =>{
          if (this.pageInfo.startDate) {
            return date && date.valueOf() < new Date(this.pageInfo.startDate).getTime()
          }else {
            return date && date.valueOf() > Date.now();
          }
        }
      }
    },
    handleEndTime(value) {
      if(value){
        this.pageInfo.endDate = `${value} 00:00:00`;
      }else{
        this.pageInfo.endDate = "";
      }
      this.startOptions = {
        disabledDate:date =>{
          if (this.pageInfo.endDate) {
            return date && date.valueOf() > new Date(this.pageInfo.endDate).getTime() - 86400000
          }else {
            return date && date.valueOf() > Date.now();
          }
        }
      }
    },
    checkSpecialKey (str) {
      var specialKey =
        "[`~!#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'"
      for (var i = 0; i < str.length; i++) {
        if (specialKey.indexOf(str.substr(i, 1)) != -1) {
          return false
        }
      }
      return true
    },
    async handleModal (data, status) {
      this.$refs.form1.resetFields()
      this.curentHandle = status
      if (data) {
        this.modalVisible = true
        let params = {
          id: data.id
        }
        let res = await userAuthorgbyID(params)
        if (res.success) {
          this.formItem = res.data[0]
        }
      }
    },
    async handleSubmit () {
      this.$refs.form1.validate(async valid => {
        if (valid) {
          let params = {
            id: this.formItem.id,
            username: this.formItem.username,
            orgId: this.formItem.orgId,
            status: 1,
            authMsg: this.formItem.authMsg
          }
          let res = await userAuthorgUpdataStatus(params)
          if (res.success) {
            this.$Message.success('审核成功!')
            this.handleSearch()
            this.modalVisible = false
          } else {
            this.$Message.info('审核失败!')
          }
        }
      })
    },
    async handleReject () {
      this.$refs.form1.validate(async valid => {
        if (valid) {
          let params = {
            id: this.formItem.id,
            username: this.formItem.username,
            orgId: this.formItem.orgId,
            status: 2,
            authMsg: this.formItem.authMsg
          }
          let res = await userAuthorgUpdataStatus(params)
          if (res.success) {
            this.$Message.success('已拒绝审核!')
            this.handleSearch()
            this.modalVisible = false
          } else {
            this.$Message.info('拒绝审核失败!')
          }
        }
      })
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
    async handleSearch (page) {
      if (page) {
        this.pageInfo.page = page
      }
      this.loading = true
      let params = {
        request_service_id: this.pageInfo.request_service_id,
        user_id: this.pageInfo.user_id,
        request_time_begin: this.pageInfo.startDate,
        request_result: this.pageInfo.request_result,
        request_time_end: this.pageInfo.endDate,
        page: this.pageInfo.page,
        rows: this.pageInfo.limit
      }
      let res = await serviceRequestLogList(params)
      const { status, rows, total } = res
      if (!status) {
        this.data = rows
        // this.selectMenus = treeData(data.records)
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
    }
  },
  mounted: function () {
    this.handleSearch()
  }
}
</script>
