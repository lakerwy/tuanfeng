<template>
  <div>
    <!-- <HeaderContent>
      <Form ref="searchForm" :model="pageInfo" inline :label-width="80">
        <FormItem label="数据库名称" prop="dataBaseName">
          <Input type="text" v-model="pageInfo.dataBaseName" placeholder="请输入数据库名称" />
        </FormItem>
        <FormItem label="连接名称" prop="connectName">
          <Input type="text" v-model="pageInfo.connectName" placeholder="请输入连接名称" />
        </FormItem>
        <FormItem label="开始时间" prop="startDate">
          <DatePicker date="yyyy-MM-dd" :options="startOptions" v-model="pageInfo.startDate" type="date"  placeholder="请输入开始时间" @on-change="handleStartTime"	></DatePicker>
        </FormItem>
        <FormItem label="结束时间" prop="endDate">
          <DatePicker date="yyyy-MM-dd" :options="endOptions" v-model="pageInfo.endDate" type="date"  placeholder="请输入结束时间" @on-change="handleEndTime"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSearch(1)">查询</Button>&nbsp;
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSearch(1)">刷新</Button>&nbsp;
        </FormItem>
      </Form>
    </HeaderContent> -->
    <Card shadow>
      <div class="search-con search-con-top">
        <div class="total">
          <img src="../../../assets/images/icon-total.png" alt="" srcset="">
          <span class="text">当前数据：</span>
          <span class="num">{{pageInfo.total}}条</span>
        </div>
      </div>
      <Table border :columns="columns" :data="data" :loading="loading">
        <template slot="test" slot-scope="{ row }">
          <section class="table-status">
            <div v-if="row.test">
              <img src="../../../assets/images/icon-pass.png" alt="" srcset="">
              <span>测试通过</span>
            </div>
            <div v-else >
              <img src="../../../assets/images/icon-failed.png" alt="" srcset="">
              <span>测试失败</span>
            </div>
          </section>
        </template>
        <template slot="action" slot-scope="{ row }">
          <div class="actionIcon">
            <!--<Tooltip content="详情" placement="top">
              <img @click="handleModal(row,'show')" src="../../../assets/images/查看icon.png" alt="" srcset="">
            </Tooltip>-->
            <Tooltip content="测试" placement="top">
              <img @click="handleModal(row,'test')" src="../../../assets/images/ceshi.png" alt="" srcset="">
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
  </div>
</template>

<script>
import  HeaderContent from '@/components/header-content/index'
import { getdataBases } from '@/api/serviceInspection'
import { datasourcestat,testconnectionIds } from '@/api/db';
import qs from 'qs';
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
          title: '数据库类型',
          key: 'DbType'
        },
        {
          title: '连接地址',
          width: 550,
          key: 'URL'
        },
        {
          title: '用户名',
          key: 'UserName'
        },
        {
          title: '驱动类名',
          key: 'DriverClassName'
        },
        {
          title: '最大连接数',
          key: 'MaxActive',
          // slot: 'test'
        },
        {
          title: '初始化连接大小',
          key: 'InitialSize',
          // slot: 'test'
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
      dbVisable: false,
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
      this.pageInfo.startDate = value;
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
      this.pageInfo.endDate = value;
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
    handleModal (data, state) {
      this.rowInfo = data;
      if (state==='test') {
        this.testDb(data);
      }
    },
    async testDb(data) {
      let params = {
        ids: data.id
      };
      let res = await testconnectionIds(qs.stringify(params))
      if (res.success) {
        if (res.body[0]['1']) {
          this.$Message.success('测试连接成功！');
        }else {
          this.$Message.warning('测试连接失败！');
        }
      }else {
        this.$Message.warning(res.status.message);
      }
    },
    async handleSearch (page) {
      if (page) {
        this.pageInfo.page = page
      }
      this.loading = true
      // let params = {
      //   connectName: this.pageInfo.connectName,
      //   dataBaseName: this.pageInfo.dataBaseName,
      //   start: this.pageInfo.startDate,
      //   end: this.pageInfo.endDate,
      //   current: this.pageInfo.page,
      //   size: this.pageInfo.limit
      // }
      let res = await datasourcestat()
      const { code, result } = res
      let idslist = [];
      if (code == 2000) {
        this.pageInfo.total = result.length
        // this.data = body.records
        // if (body.records.length ===0) {
        //   this.data = body.records
        // }else {
        //   body.records.forEach(item => {
        //     idslist.push(item.id)
        //   });
        //   let testRes = await testconnectionIds(qs.stringify({ids: idslist},{ arrayFormat: 'repeat' }));
        //   const obj = {};
        //   if (testRes.success){
        //     testRes.body.map(item=> {
        //       obj[Object.keys(item)[0]] = Object.values(item)[0];
        //     })

        //     body.records.forEach(item => {
        //       item.test = obj[item.id]
        //     })
        //     // this.data = body.records
        //   }
        // }
        this.data = result
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
