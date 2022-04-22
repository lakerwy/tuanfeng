<template>
  <div>
    <HeaderContent>
      <Form ref="searchForm" :model="pageInfo" inline :label-width="80">
        <FormItem label="用户名" prop="username ">
          <Input type="text" v-model="pageInfo.username" placeholder="请输入用户名" />
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
        <template slot="loginTime" slot-scope="{ row }">
          <span>{{row.loginTime?row.loginTime.replace('T',' '):''}}</span>
        </template>
        <template slot="status" slot-scope="{ row }">
          <div v-if="row.status == '1'"><i style="background:green" class="itablestatus"></i>认证成功</div>
          <div v-else-if="row.status =='0'"><i style="background:#c3cbd6" class="itablestatus"></i>未认证</div>
          <div v-else><i style="background:red" class="itablestatus"></i>认证失败</div>
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
import { getMonitorUser } from '@/api/platformMonitor'
import  HeaderContent from '@/components/header-content/index'
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
      formItem: {
        roleId: '',
        roleCode: '',
        roleName: '',
        path: '',
        authMsg: '',
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
          title: '序号',
          type: 'index',
          width: 65,
          align: 'center'
        },
        {
          title: '登录名',
          key: 'loginUser'
        },
        {
          title: '登录IP',
          key: 'ip'
        },
        {
          title: '登录时间',
          key: 'loginTime',
          slot: 'loginTime'
        },
        {
          title: '登录浏览器名',
          key: 'browser'
        },
        {
          title: '在线时长',
          key: 'onlineDur'
        },
        // {
        //   title: '操作',
        //   slot: 'action'
        // }
      ],
      data: [],
      curentHandle: 'view'
    }
  },
  methods: {
    handleResetForm (form) {
      this.$refs[form].resetFields()
    },
    handleTabClick (name) {
      this.current = name
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
        current: this.pageInfo.page,
        size: this.pageInfo.limit,
        username: this.pageInfo.username
      }
      let res = await getMonitorUser(params)
      const { success, body } = res
      if (success) {
        this.data = body.records;
        this.data.forEach(item => {
          let currentTime = new Date().getTime();
          let loginTime = new Date(item.loginTime).getTime();
          item.onlineDur = this.formatSeconds((currentTime-loginTime)/1000)
        })
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
    formatSeconds(value) {
      var theTime = parseInt(value);// 秒
      var middle= 0;// 分
      var hour= 0;// 小时

      if(theTime > 60) {
        middle= parseInt(theTime/60);
        theTime = parseInt(theTime%60);
        if(middle> 60) {
          hour= parseInt(middle/60);
          middle= parseInt(middle%60);
        }
      }
      var result = ""+parseInt(theTime)+"秒";
      if(middle > 0) {
        result = ""+parseInt(middle)+"分"+result;
      }
      if(hour> 0) {
        result = ""+parseInt(hour)+"小时"+result;
      }
      return result;
    }
  },
  mounted: function () {
    this.handleSearch()
  }
}
</script>
