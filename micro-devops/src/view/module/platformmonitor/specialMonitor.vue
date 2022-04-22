<!--
 * @Author: 任继民
 * @Date: 2020-11-27 13:53:11
 * @LastEditors: 任继民
 * @LastEditTime: 2020-11-27 13:53:14
 * @Description:
-->
<template>
  <div>
    <HeaderContent>
      <Form ref="searchForm" :model="pageInfo" inline :label-width="80">
        <FormItem label="控制类型">
          <Select v-model="pageInfo.user_check_type">
            <Option value="">请选择</Option>
            <Option :value="1">某一用户</Option>
            <Option :value="2">某一ip</Option>
          </Select>
        </FormItem>
        <FormItem label="状态">
          <Select v-model="pageInfo.status">
            <Option value="">请选择</Option>
            <Option :value="1">有效</Option>
            <Option :value="2">已删除</Option>
            <Option :value="3">自动失效</Option>
          </Select>
        </FormItem>
        <FormItem label="开始时间">
            <DatePicker type="datetime" ref="PstartDate" @on-change="showTimePanel('PstartDate')"  v-model="pageInfo.create_date_begin"  placeholder="请输入开始时间"></DatePicker>
        </FormItem>
        <FormItem label="结束时间">
          <DatePicker type="datetime" ref="PendDate" @on-change="showTimePanel('PendDate')"  v-model="pageInfo.create_date_end"  placeholder="请输入结束时间"></DatePicker>
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
            <Icon type="ios-add" />
            <span>添加规则</span>
          </Button>
        </div>
      </div>
      <Table border :columns="columns" :data="data" :loading="loading">
        <template slot="user_check_type" slot-scope="{ row }">
          <span v-if="row.user_check_type==1">某一用户</span>
          <span v-else>某一IP</span>
        </template>
        <template slot="time_limit_start" slot-scope="{ row }">
          <span>{{row.time_limit_start | dateTime}}</span>
        </template>
        <template slot="time_limit_end" slot-scope="{ row }">
          <span>{{row.time_limit_end | dateTime}}</span>
        </template>
        <template slot="create_date" slot-scope="{ row }">
          <span>{{row.create_date | dateTime}}</span>
        </template>
        <template slot="status" slot-scope="{ row }">
            <span v-if="row.status ==1">有效</span>
            <span v-else-if="row.status==2">已删除</span>
            <span v-else-if="row.status==3">自动失效</span>
        </template>
        <template slot="action" slot-scope="{ row }">
          <div class="actionIcon" v-show="row.status == 1">
            <Tooltip content="编辑" placement="top">
              <img src="../../../assets/images/bianji.png" alt="" srcset="" @click="handleModal(row, 'edit')">
            </Tooltip>
            <Tooltip content="删除" placement="top">
              <img src="../../../assets/images/shanchu.png" alt="" srcset="" @click="handleTabClick(row, 'del')">
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
    <Modal v-model="modalVisible" :title="modalTitle" width="602" @on-cancel="handleReset" :mask-closable="false">
      <div>
        <Form
          ref="form1"
          :model="formItem"
          label-position="right"
          :rules="formItemRules"
          :label-width="100"
        >
          <FormItem label="控制类型:" prop="user_check_type">
            <Select v-model="formItem.user_check_type" :disabled="handleStatus =='edit'">
              <Option :value="1">某一用户</Option>
              <Option :value="2">某一ip</Option>
            </Select>
          </FormItem>
          <FormItem label="用户:" prop="user_id_or_ip" v-show="formItem.user_check_type == 1">
            <Select v-model="formItem.user_id_or_ip" :disabled="handleStatus =='edit'">
              <Option v-for="item in allUserlist" :key="item.id" :value="item.username">{{item.username}}</Option>
            </Select>
          </FormItem>
          <FormItem label="IP地址:" prop="user_id_or_ip" v-show="formItem.user_check_type == 2">
            <Input v-model="formItem.user_id_or_ip"  placeholder="请输入IP地址" :disabled="handleStatus =='edit'" />
          </FormItem>
          <FormItem label="所选服务:" prop="service_check_type">
						<Select v-model="formItem.service_check_type" :disabled="handleStatus =='edit'">
							<Option :value="1">某一服务</Option>
							<Option :value="2">所有服务</Option>
						</Select>
          </FormItem>
          <FormItem label="服务列表:" prop="service_id" v-show="formItem.service_check_type==1">
						<Select v-model="formItem.service_id" :disabled="handleStatus =='edit'">
							<Option v-for="item in serverlist" :key="item.id" :value="item.id">{{item.service_name}}</Option>
						</Select>
          </FormItem>
          <FormItem label="限制开始时间:" prop="time_limit_start">
            <DatePicker type="datetime" ref="startDate" @on-change="showTimePanel('startDate')"  v-model="formItem.time_limit_start"  placeholder="请输入限制开始时间"></DatePicker>
          </FormItem>
          <FormItem label="限制结束时间:" prop="time_limit_end">
            <DatePicker type="datetime" ref="endDate" @on-change="showTimePanel('endDate')"  v-model="formItem.time_limit_end"  placeholder="请输入限制结束时间"></DatePicker>
          </FormItem>
          <FormItem label="备注:" prop="remark">
            <Input v-model="formItem.remark" maxlength="200" rows="4" show-word-limit type="textarea" placeholder="请输入备注" />
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
import { getServiceControlList, getAllUser, getServiceControladd, setServicevupdate, serviceControldel } from '@/api/platformMonitor'
import { getServiceList } from '@/api/serveiceRegist'

export default {
  name: 'SystemRole',
  components: {
    HeaderContent
  },
  filters: {
    dateTime: function(val) {
      if (!val) return ''
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
      modalServiceTitle: '',
      saving: false,
      current: 'form1',
      forms: ['form1'],
      selectApis: [],
      selectMenus: [],
      pageInfo: {
        total: 0,
        page: 1,
        limit: 10,
      },
      formItemRules: {
        subjectName: [
          { required: true, message: '专题名称不能为空', trigger: 'blur' },
          { required: true, min: 2, max: 15, message: '专题名称长度为2-15个字符', trigger: 'blur' },
          { required: true, pattern: /^[^\s]*$/, message: '专题名称不能输入空格', trigger: 'blur' },
          { required: true, validator: validateInput, trigger: 'blur' }
        ]
      },
      formItem: {
        subjectName: ''
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
          title: '创建时间',
          key: 'create_date',
          slot: 'create_date'
        },
        {
          title: '备注',
          key: 'remark'
        },
        {
          title: '操作',
          slot: 'action'
        }
      ],
      rowInfo: {
        subjectName: '',
      },
      allUserlist: [],
      serverlist: [],
      data: [],
      currentSubid: null,
      targetKeys:[],
      servicedata: []
    }
  },
  mounted: function () {
    this.handleSearch();
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
    showTimePanel(refName) {
      this.$refs[refName].onSelectionModeChange('time');
    },
    async handleModal (data, status) {
      let res = await getAllUser();
      if (res.status.code == '200') {
        this.allUserlist = res.data;
      }
      let servparams = {
        page: 1,
        create_date_begin: '',
        create_date_end: '',
        rows: 999
      }
      let  serverlist = await getServiceList(servparams);
      this.serverlist = serverlist.rows;
      this.modalVisible = true;
      this.handleStatus = status;
      this.formItem = Object.assign({},data);
      this.modalTitle = status=== 'edit'? '编辑自定义访问规则':'新增自定义访问规则';
    },
    handleResetForm (form) {
      this.$refs[form].resetFields()
    },
    handleTabClick (data, status) {
      if (status === 'del') {
        this.$Modal.confirm({
          title: `确定删除吗？`,
          onOk: async () => {
            let params = {
              ids: data.id,
            }
            let res = await serviceControldel(params)
            if (res.status) {
              this.$Message.success('删除成功')
              this.handleSearch()
            }else {
              this.$Message.error(res.msg)
            }
          }
        })
      }
    },
    handleReset () {
      const newData = {
        subjectName: '',
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
        console.log(valid)
        if (valid) {
          this.saving = true
          if (this.handleStatus === 'edit') {
            let params = {
              id: this.formItem.id,
              time_limit_start: this.$options.filters['dateTime'](this.formItem.time_limit_start),
              time_limit_end: this.$options.filters['dateTime'](this.formItem.time_limit_end),
              user_check_type: this.formItem.user_check_type || '',
              service_check_type: this.formItem.service_check_type || '',
              service_id: this.formItem.service_id || '',
              user_id_or_ip: this.formItem.user_id_or_ip || '',
              remark: this.formItem.remark || ''
            }
            let res = await setServicevupdate(params)
            const { status } = res
            if (status) {
              this.$Message.success('保存成功')
              this.handleReset()
              this.handleSearch()
            }else {
              this.$Message.warning(res.msg)
            }
            this.saving = false
          } else {
            let params = {
              time_limit_start: this.$options.filters['dateTime'](this.formItem.time_limit_start),
              time_limit_end: this.$options.filters['dateTime'](this.formItem.time_limit_end),
              user_check_type: this.formItem.user_check_type || '',
              service_check_type: this.formItem.service_check_type || '',
              service_id: this.formItem.service_id || '',
              user_id_or_ip: this.formItem.user_id_or_ip || '',
              remark: this.formItem.remark || ''
            }
            let res = await getServiceControladd(params)
            const { status } = res
            if (status) {
              this.$Message.success('保存成功')
              this.handleReset()
              this.handleSearch()
            }else {
              this.$Message.warning(res.msg)
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
        page: this.pageInfo.page || 1,
        rows: this.pageInfo.limit || 10,
        user_check_type: this.pageInfo.user_check_type || '',
        status: this.pageInfo.status,
        create_date_begin: this.$options.filters['dateTime'](this.pageInfo.create_date_begin) || '',
        create_date_end: this.$options.filters['dateTime'](this.pageInfo.create_date_end) || ''
      }
      let res = await getServiceControlList(params)
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
  }
}
</script>
