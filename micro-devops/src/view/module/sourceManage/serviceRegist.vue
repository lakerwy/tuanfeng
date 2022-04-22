<template>
  <div class="serviceResgit">
    <HeaderContent>
      <Form ref="searchForm" :model="pageInfo" inline :label-width="80">
        <FormItem label="服务名称">
          <Input type="text" v-model="pageInfo.service_name" placeholder="请输入服务名称" />
        </FormItem>
        <FormItem label="服务分组">
          <Select v-model="pageInfo.category_code" clearable placeholder="请选择服务分组">
            <Option v-for="item in cataloglist" :key="item.code"  :value="item.code" >{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="业务场景">
          <TreeSelect style="width:200px" v-model="pageInfo.type" clearable :treeData="typeList" @on-select-change="selectChange"></TreeSelect>
        </FormItem>
        <FormItem label="是否授权">
          <Select v-model="pageInfo.is_auth" placeholder="请选择是否授权">
            <Option value=" ">请选择</Option>
            <Option :value="1">是</Option>
            <Option :value="2">否</Option>
          </Select>
        </FormItem>
        <FormItem label="状态">
          <Select v-model="pageInfo.status" placeholder="请选择状态">
            <Option value=" ">请选择</Option>
            <Option :value="1">启动</Option>
            <Option :value="2">停止</Option>
            <Option :value="0">删除</Option>
          </Select>
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
          <Button class="search-btn" type="primary" @click="handleModal('add')">
            <span>添加</span>
          </Button>
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
          <span v-if="row.status == '1'">启动</span>
          <span v-else>停止</span>
        </template>
        <template slot="create_date" slot-scope="{ row }">
          <span>{{ row.create_date | dateTime }}</span>
        </template>
        <template slot="action" slot-scope="{ row }">
          <div class="actionIcon">
            <img src="../../../assets/images/查看icon.png" alt="" srcset="" @click="handleModal('info',row)">
            <img src="../../../assets/images/bianji.png" alt="" srcset="" @click="handleModal('edit', row)">
            <img v-if="row.status != '1'" src="../../../assets/images/stop-icon.png" alt="" srcset="" @click="handleTabClick(row, 'stop')">
            <img v-else src="../../../assets/images/play-icon.png" alt="" srcset="" @click="handleTabClick(row, 'stop')">
            <img src="../../../assets/images/shanchu.png" alt="" srcset="" @click="handleTabClick(row,'delete')">
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

    <Modal v-model="modalVisible" :title="modalTitle" width="60%" @on-cancel="handleReset" footer-hide :mask-closable="false" class="serviceResgit-modal">
      <div>
          <Form
            v-show="current == 'form1'"
            ref="form1"
            :inline="true"
            :model="formItem"
            label-position="right"

            :rules="formItemRules"
            :label-width="100"
          >
            <div class="text-title">基本信息</div>
            <FormItem label="服务名称:" prop="service_name">
              <Input v-model="formItem.service_name" placeholder="请输入服务名称" />
            </FormItem>
            <FormItem label="访问方式:" prop="method">
              <Select v-model="formItem.method" filterable clearable>
                <Option  :value="1" >GET</Option>
                <Option  :value="2" >POST</Option>
                <Option  :value="3" >GET/POST</Option>
              </Select>
            </FormItem>
            <FormItem label="url真实地址:" prop="url">
              <Input  v-model="formItem.url"  placeholder="请输入url真实地址" />
            </FormItem>
            <FormItem label="服务地址1级:" prop="service_url_classification1">
              <Input v-model="formItem.service_url_classification1" placeholder="请输入服务地址1级" />
            </FormItem>
            <FormItem label="服务地址2级:" prop="service_url_classification2">
              <Input v-model="formItem.service_url_classification2" placeholder="请输入服务地址2级" />
            </FormItem>
            <FormItem label="是否需要授权:" prop="is_auth">
              <Select v-model="formItem.is_auth" filterable clearable>
                <Option  :value="1" >是</Option>
                <Option  :value="0" >否</Option>
              </Select>
            </FormItem>
            <FormItem label="是否有服务:" prop="is_self">
              <Select v-model="formItem.is_self" filterable clearable>
                <Option  :value="1" >是</Option>
                <Option  :value="0" >否</Option>
              </Select>
            </FormItem>
            <FormItem label="服务分组:" prop="category_code">
              <Select v-model="formItem.category_code" clearable>
                <Option v-for="item in cataloglist" :key="item.code"  :value="item.code" >{{item.name}}</Option>
              </Select>
            </FormItem>
            <FormItem label="业务场景:" prop="type">
              <TreeSelect v-model="formItem.type" clearable :treeData="typeList" @on-select-change="selectChange"></TreeSelect>
            </FormItem>
            <FormItem label="服务标准:" prop="protocol">
              <Select v-model="formItem.protocol" clearable>
                <Option  value="1" >REST</Option>
                <Option  value="2" >SOAP</Option>
                <Option  value="3" >REST/SOAP</Option>
              </Select>
            </FormItem>
            <FormItem label="服务描述:" prop="service_desc">
              <Input v-model="formItem.service_desc" placeholder="请输入服务描述" />
            </FormItem>
            <FormItem label="参数说明:" prop="param_desc">
              <Input v-model="formItem.param_desc" placeholder="请输入参数说明" />
            </FormItem>
            <FormItem label="结果描述:" prop="result_desc">
              <Input v-model="formItem.result_desc" placeholder="请输入结果描述" />
            </FormItem>
            <FormItem label="版本:" prop="version">
              <Input v-model="formItem.version" placeholder="请输入版本" />
            </FormItem>
            <FormItem label="备注:" prop="remark">
              <Input v-model="formItem.remark" placeholder="请输入备注" />
            </FormItem>
            <FormItem label="机构名称:" prop="org_id">
              <Select v-model="formItem.org_id" clearable>
                <Option  v-for="item in orglist" :key="item.code" :value="item.id">{{item.name}}</Option>
              </Select>
            </FormItem>
            <FormItem label="覆盖范围:" prop="coverage">
              <Input v-model="formItem.coverage" placeholder="请输入覆盖范围" />
            </FormItem>
            <FormItem label="投影信息:" prop="projection_info">
              <Input v-model="formItem.projection_info" placeholder="请输入投影信息" />
            </FormItem>
            <FormItem label="图层名称:" prop="layer_name">
              <Input v-model="formItem.layer_name" placeholder="请输入图层名称" />
            </FormItem>
            <FormItem label="缩略图:" prop="thumbail">
              <Upload :action="accredationURL" :show-upload-list="false" :disabled="showDetail?true:false" :before-upload="beforeUpload" :on-success="handleSuccess" class="avaterUpload" :on-format-error="handleFormatError" :format="['jpg','jpeg','png','bmp','gif']">
                <div v-if="!userPic">
                  <Icon type="ios-add"></Icon>
                </div>
                <img v-else :src="userPic" alt="">
              </Upload>
            </FormItem>
            <div class="text-title">扩展信息</div>
            <FormItem label="服务简介:" prop="server_brief">
              <Input v-model="formItem.server_brief" placeholder="请输入服务简介" />
            </FormItem>
            <FormItem label="关键字:" prop="server_keyword">
              <Input v-model="formItem.server_keyword" placeholder="请输入关键字" />
            </FormItem>
            <FormItem label="服务子类:" prop="server_type">
              <Input v-model="formItem.server_type" placeholder="请输入服务子类" />
            </FormItem>
            <FormItem label="主题分类:" prop="server_theme">
              <Input v-model="formItem.server_theme" placeholder="请输入主题分类" />
            </FormItem>
            <FormItem label="覆盖区域:" prop="server_region">
              <Input v-model="formItem.server_region" placeholder="请输入覆盖区域" />
            </FormItem>
            <FormItem label="图层简介:" prop="layer_brief">
              <Input v-model="formItem.layer_brief" placeholder="请输入图层简介" />
            </FormItem>
            <FormItem label="比例尺:" prop="layer_scale">
              <Input v-model="formItem.layer_scale" placeholder="请输入比例尺" />
            </FormItem>
            <FormItem label="分辨率:" prop="layer_ratio">
              <Input v-model="formItem.layer_ratio" placeholder="请输入分辨率" />
            </FormItem>
            <FormItem label="发布时间:" prop="layer_time">
              <DatePicker v-model="formItem.layer_time" type="date"  placeholder="请选择发布时间" style="width: 200px"></DatePicker>
            </FormItem>
            <FormItem label="源数据获取时间:" prop="layer_source_time">
              <DatePicker v-model="formItem.layer_source_time" type="date"  placeholder="请选择源数据获取时间" style="width: 200px"></DatePicker>
            </FormItem>
            <FormItem label="注册单位:" prop="unit_name">
              <Input v-model="formItem.unit_name" placeholder="请输入注册单位" />
            </FormItem>
            <FormItem label="维护单位:" prop="maintain_name">
              <Input v-model="formItem.maintain_name" placeholder="请输入维护单位" />
            </FormItem>
            <FormItem label="联系地址:" prop="address">
              <Input v-model="formItem.address" placeholder="请输入联系地址" />
            </FormItem>
            <FormItem label="联系人:" prop="linkman">
              <Input v-model="formItem.linkman" placeholder="请输入联系人" />
            </FormItem>
            <FormItem label="联系人电话:" prop="tel">
              <Input type="tel" v-model="formItem.tel" placeholder="请输入联系人电话" />
            </FormItem>
            <FormItem label="联系人邮箱:" prop="mail">
              <Input type="email" v-model="formItem.mail" placeholder="请输入联系人邮箱" />
            </FormItem>
            <FormItem label="更新周期:" prop="server_update_period">
              <Input v-model="formItem.server_update_period" placeholder="请输入更新周期" />
            </FormItem>
          </Form>
          <div class="drawer-footer" slot="footer">
            <Button type="default" @click="handleReset">取消</Button>&nbsp;
            <Button type="primary" @click="handleSubmit" :loading="saving">保存</Button>
          </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import  HeaderContent from '@/components/header-content/index'
import { getServiceList, getServiceUpdate, getServiceDeleteById, getServiceStart,getServiceStop, getserviceAdd, getenabledServiceType,getenabledServiceCategory, getfindOrgSelect } from '@/api/serveiceRegist'
import TreeSelect from '@/components/treeSelect/index.vue'
export default {
  name: 'Devices',
  components: {
    HeaderContent,
    TreeSelect
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
      let re = '(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]'
      let reg = new RegExp(re)
      if (value === '') {
        callback(new Error('url真实地址不能为空'))
      } else if (value !== '' && !reg.test(value)) {
        callback(new Error('请输入正确的url真实地址'))
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
      loading: false,
      modalVisible: false,
      modalUserVisible: false,
      modalTitle: '',
      saving: false,
      current: 'form1',
      forms: ['form1'],
      selectUsers: null,
      typeList: null,
      cataloglist: null,
      orglist: null,
      targetKeys: [],
      selectApis: [],
      accredationURL: `${window.globalUrl.API_SERVICE}/service/px-service-register/uploadFile`,
      userPic: null,
      pageInfo: {
        total: 0,
        page: 1,
        limit: 10,
        roleCode: '',
        roleName: ''
      },
      formItemRules: {
        deviceId: [
          { required: true, message: '设备编号不能为空', trigger: 'blur' },
          { required: true, min: 2, max: 16, message: '长度为2-16个字符', trigger: 'blur' },
          { required: true, pattern: /^[^\s]*$/, message: '设备编号不能输入空格', trigger: 'blur' },
          { required: true, validator: validateInput, trigger: 'blur' }
        ],
        service_name: [
          { required: true, message: '服务名称不能为空', trigger: 'blur' },
          { required: true, min: 2, max: 16, message: '长度为2-16个字符', trigger: 'blur' },
          { required: true, pattern: /^[^\s]*$/, message: '服务名称不能输入空格', trigger: 'blur' },
          { required: true, validator: validateInput, trigger: 'blur' }
        ],
        method: [
          { required: true, message: '请选择访问方式', trigger: 'blur' },
        ],
        url: [
          { required: true, message: 'url真实地址不能为空', trigger: 'blur' },
          { required: true, pattern: /^[^\s]*$/, message: 'url真实地址不能输入空格', trigger: 'blur' },
          { required: true, validator: validateEn, trigger: "blur" },
        ],
        service_url_classification1:[
          { required: true, message: '服务地址1级不能为空', trigger: 'blur' },
          { pattern: /^[^\s]*$/, message: '服务名称不能输入空格', trigger: 'blur' },
        ],
        service_url_classification2:[
          { required: true, message: '服务地址2级不能为空', trigger: 'blur' },
          { pattern: /^[^\s]*$/, message: '服务地址2级不能输入空格', trigger: 'blur' },
        ],
        is_auth: [
          { required: true, message: '请选择是否需要授权', trigger: 'blur' },
        ],
        is_self: [
          { required: true, message: '请选择是否有服务', trigger: 'blur' },
        ],
        category_code: [
          { required: true, message: '请选择服务分组', trigger: 'blur' },
        ],
        type: [
          { required: true, message: '请选择业务场景', trigger: 'blur' },
        ],
        protocol: [
          { required: true, message: '请选择服务标准', trigger: 'blur' },
        ],
        service_desc: [
          { pattern: /^[^\s]*$/, message: '服务描述不能输入空格', trigger: 'blur' },
        ],
        param_desc: [
          { pattern: /^[^\s]*$/, message: '参数说明不能输入空格', trigger: 'blur' },
        ],
        result_desc: [
          { pattern: /^[^\s]*$/, message: '参数说明不能输入空格', trigger: 'blur' },
        ],
        version: [
          { pattern: /^[^\s]*$/, message: '版本不能输入空格', trigger: 'blur' },
        ],
        remark: [
          { pattern: /^[^\s]*$/, message: '备注不能输入空格', trigger: 'blur' },
        ],
        org_id :[
          { required: true, message: '请选择机构名称', trigger: 'blur' },
        ],
        coverage: [
          { pattern: /^[^\s]*$/, message: '覆盖范围不能输入空格', trigger: 'blur' },
        ],
        projection_info: [
          { pattern: /^[^\s]*$/, message: '投影信息不能输入空格', trigger: 'blur' },
        ],
        layer_name: [
          { pattern: /^[^\s]*$/, message: '图层名称不能输入空格', trigger: 'blur' },
        ],
        server_brief: [
          { pattern: /^[^\s]*$/, message: '服务简介不能输入空格', trigger: 'blur' },
        ],
        mail: [
          { pattern: /^[^\s]*$/, message: '联系人邮箱不能输入空格', trigger: 'blur' },
          { type: 'email', message: '联系人邮箱格式不正确', trigger: 'blur' }
        ],
        tel: [
          { pattern: /^([1]\d{10}|([\\(（]?0[0-9]{2,3}[）\\)]?[-]?)?([2-9][0-9]{6,7})+(\\-[0-9]{1,4})?)$/,message: '联系人电话格式错误', trigger: 'blur' }
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
          title: '服务分组',
          key: 'category_code_desc'
        },
        {
          title: '服务类型',
          key: 'type_desc',
        },
        {
          title: '机构名称',
          key: 'name',
        },
        {
          title: '服务地址1级',
          key: 'service_url_classification1',
          tooltip: true
        },
        {
          title: '服务地址2级',
          key: 'service_url_classification2',
          tooltip: true
        },
        {
          title: '是否有服务',
          key: 'isSelf',
          slot: 'isSelf'
        },
        {
          title: '是否需要授权',
          key: 'isAuth',
          slot: 'isAuth'
        },
        {
          title: '状态',
          key: 'status',
          slot: 'status'
        },
        {
          title: '创建时间',
          key: 'create_date',
          width: '200',
          slot: 'create_date'
        },
        {
          title: '操作',
          width: '240',
          slot: 'action'
        }
      ],
      handlMethod: 'add',
      data: [],
    }
  },
  created() {
    this.initDatalist();
  },
  mounted: function () {
    this.handleSearch()
  },
  methods: {
    async initDatalist() {
      let typeList = await getenabledServiceType();
      this.typeList = this.treeData(typeList);
      let cataloglist = await getenabledServiceCategory();
      this.cataloglist = cataloglist
      let orglist = await getfindOrgSelect();
      this.orglist = orglist;
    },
    checkSpecialKey (str) {
      var specialKey = "[`~!#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'"
      for (var i = 0; i < str.length; i++) {
        if (specialKey.indexOf(str.substr(i, 1)) != -1) {
          return false
        }
      }
      return true
    },
    renderContent (h, {data }) {
      return h('Option', {
        style:{
          display:'inline-block',
          margin:0
        },
        props: {
          value: data.name
        }
      },data.name)
    },
    // 树复选框发生改变--只能有一个被选中
    selectChange(arr, obj) {
      console.log(arr)
      if (obj.children) {
        return;
      }else {
        this.formItem.type = arr
      }
      console.log(this.formItem.type)
    },
    handleSuccess (res) {
      // debugger
      if (res.success) {
        this.userPic = window.globalUrl.IMG_PREFIX + '/' + res.data
      }
    },
    handleFormatError () {
      this.$Notice.warning({
        title: '上传文件格式错误',
        desc: "上传图片后缀不是'jpg','jpeg','png'"
      })
    },
    async handleModal (status, data) {
      this.handlMethod = status
      if (data) {
        this.formItem = Object.assign({}, this.formItem, data)
      }
      console.log(this.formItem)
      if (this.current === this.forms[0]) {
        this.modalTitle = data ? '编辑服务信息 - ' + data.name : '添加服务信息'
        this.modalVisible = true
      }
      if (status === 'add') {
        this.formItem = {};
      }
    },
    handleResetForm (form) {
      this.$refs[form].resetFields()
    },
    handleTabClick (data, status) {
      if (status === 'stop') {
        this.$Modal.confirm({
          title: `确定要${data.status=='1'?'开启':'停止'}${data.service_name}吗？`,
          onOk: async () => {
            let res = null;
            let params = {
              id: data.id
            };
            if (data.status == '1') {
              res = await getServiceStop(params)
            }else {
              res = await getServiceStart(params)
            }
            if (res.status) {
              this.$Message.success(`${data.status == '1'?'开启':'停止'}停止成功`)
              this.handleSearch()
            }
          }
        })
      }else {
        this.$Modal.confirm({
          title: `确定删除${data.service_name}吗？`,
          onOk: async () => {
            let params = {
              id: data.id,
            }
            let res = await getServiceDeleteById(params)
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
      this.$refs.form1.validate(async valid => {
        if (valid) {
          this.saving = true
          if (this.handlMethod === 'add') {
            let res = await getserviceAdd(this.formItem)
            const { status } = res
            if (status) {
              this.$Message.success('服务注册成功!')
              this.handleReset()
              this.handleSearch()
            } else {
              this.$Message.info(res.msg)
            }
            this.saving = false
          }else {
            let params = {
              name: this.formItem.name,
              deviceId: this.formItem.deviceId,
              deviceDesc: this.formItem.deviceDesc
            }
            let res = await getServiceUpdate(params)
            const { success } = res
            if (success) {
              this.$Message.success('保存成功')
              this.handleReset()
              this.handleSearch()
            } else {
              this.$Message.info(res.status.message)
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
        service_name: this.pageInfo.service_name || '',
        page: this.pageInfo.page || 1,
        rows: this.pageInfo.limit || 10,
        status: this.pageInfo.status || '',
        create_date_begin: this.pageInfo.create_date_begin || '',
        create_date_end: this.pageInfo.create_date_end || '',
        is_auth: this.pageInfo.is_auth || '',
        category_code: this.pageInfo.category_code || '',
      }
      let res = await getServiceList(params)
      const { rows,total } = res
      this.data = rows
      this.pageInfo.total = total
      this.loading = false
    },
    handlePage (current) {
      this.pageInfo.page = current
      this.handleSearch()
    },
    handlePageSize (size) {
      this.pageInfo.limit = size
      this.handleSearch()
    },
    getCheckedAuthorities () {
      const menus = this.$refs['tree'].getCheckedProp('authorityId')
      return menus.concat(this.formItem.grantActions)
    },
    /**
    * 快速生成树形
    */
    treeData(data) {
      //
      let cloneData = JSON.parse(JSON.stringify(data)) // 对源数据深度克隆
      let tree = cloneData.filter(father => { // 循环所有项
        let branchArr = cloneData.filter((child) => {
          return father.id == child.parent_id // 返回每一项的子级数组
        })
        if (branchArr.length > 0) {
          father.children = branchArr // 如果存在子级，则给父级添加一个children属性，并赋值
        }
        return father.parent_id == '000' // 返回第一层
      })
      return tree // 返回树形数据
    }
  }
}
</script>
<style lang="less" scope>
.serviceResgit-modal {
  .ivu-modal-content {
    .ivu-form {
      max-height: 75vh;
      overflow-x: auto;
      margin-bottom: 40px;
      .text-title {
        font-weight: bold;
        color: #525252;
        padding: 0 0 10px 0;
        font-size: 16px;
      }
      .ivu-form-item {
        .ivu-input, .ivu-select-input, .ivu-select {
          width:200px;
        }
        .avaterUpload {
          .ivu-upload {
            div {
              width: 56px;
              height: 56px;
              // border-radius: 28px;
              border: 1px solid #515a6e;
              i {
                font-size: 52px;
              }
            }
            img {
              width: 56px;
              height: 56px;
              border-radius: 28px;
              border: 1px solid #515a6e;
              position: relative;
            }
          }
        }
      }
    }
  }

  ::-webkit-scrollbar {
    width: 6px;
    background-color: #d8d8d8;
  }

  /* 滚动槽 */
  ::-webkit-scrollbar-track {
    border-radius:10px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #bfc1c4;
  }
}
</style>
