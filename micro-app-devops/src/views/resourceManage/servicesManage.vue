<!--
 * @Author: 任继民
 * @Date: 2021-01-19 13:56:50
 * @LastEditors: 任继民
 * @LastEditTime: 2021-03-02 08:56:06
 * @Description:服务管理
-->
<template>
  <section class="serviceManage">
    <Breadcrumb />
    <a-card :loading="loading" class="contentCard">
      <div class="search-con search-con-top">
        <div class="total">
          <img src="../../assets/images/icon-total.png" alt="" srcset="">
          <span class="text">当前数据：</span>
          <span class="num">{{pagination.total}}条</span>
        </div>
        <div>
          <a-button type="primary" @click="handleClick('add')">
            <template #icon><PlusOutlined /></template>新增服务
          </a-button>
        </div>
      </div>
      <a-table :columns="columns" :data-source="dataSource" :row-key="record => record.id" @change="handleTableChange" bordered>
        <template #is_self="{record}">
          <span v-if="record.isSelf == '1'">是</span>
          <span v-else>否</span>
        </template>
        <template #is_auth="{record}">
          <span v-if="record.isAuth == '1'">是</span>
          <span v-else>否</span>
        </template>
        <template #status="{record}">
          <span v-if="record.status == '1'">启动</span>
          <span v-else>停止</span>
        </template>
        <template #create_date="{record}" >
          <span>{{record.create_date? record.create_date.replace(".000+0000", ' '):''}}</span>
        </template>
        <template #operation="{record}">
          <section class="operate-ico">
            <img src="../../assets/images/查看icon.png" alt="" srcset="">
            <img src="../../assets/images/bianji.png" alt="" srcset="" @click="handleClick('edit',record)">
            <img v-if="record.status !=1" src="../../assets/images/stop-icon.png" alt="" srcset="" @click="handleClick('stop',record)">
            <img v-else src="../../assets/images/play-icon.png" alt="" srcset="" @click="handleClick('stop',record)">
            <img src="../../assets/images/shanchu.png" alt="" srcset="" @click="handleClick('del',record)">
          </section>
        </template>
      </a-table>
    </a-card>
    <!-- <FormModel :showModal="showModal" v-show="true"/> -->
    <a-modal
      v-model:visible="visible"
      width="60%"
      :title="modalTitle"
      class="serviceModal"
      ok-text="确认"
      cancel-text="取消"
      @cancel="resetFields"
      @ok="onSubmit"
      >
      <a-form
        ref="ruleForm"
        layout="inline"
        :model="modelRef"
        :rules="rulesRef"
        :label-col="labelCol"

      >
          <a-form-item label="服务名称:" v-bind="validateInfos.service_name">
            <a-input v-model:value="modelRef.service_name" @blur="validate('service_name', { trigger: 'blur' }).catch(() => {})" placeholder="请输入服务名称" />
          </a-form-item>
          <a-form-item label="访问方式:" v-bind="validateInfos.method">
            <a-select @change="validate('method', { trigger: 'blur' }).catch(() => {})" v-model:value="modelRef.method" clearable>
              <a-select-option  :value="1" >GET</a-select-option>
              <a-select-option  :value="2" >POST</a-select-option>
              <a-select-option  :value="3" >GET/POST</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="url真实地址:" v-bind="validateInfos.url">
            <a-input @blur="validate('url', { trigger: 'blur' }).catch(() => {})" v-model:value="modelRef.url"  placeholder="请输入url真实地址" />
          </a-form-item>
          <a-form-item label="服务地址1级:" v-bind="validateInfos.service_url_classification1">
            <a-input @blur="validate('service_url_classification1', { trigger: 'blur' }).catch(() => {})" v-model:value="modelRef.service_url_classification1" placeholder="请输入服务地址1级" />
          </a-form-item>
          <a-form-item label="服务地址2级:" v-bind="validateInfos.service_url_classification2">
            <a-input @blur="validate('service_url_classification2', { trigger: 'blur' }).catch(() => {})"  v-model:value="modelRef.service_url_classification2" placeholder="请输入服务地址2级" />
          </a-form-item>
          <a-form-item label="是否需要授权:" v-bind="validateInfos.is_auth">
            <a-select @change="validate('is_auth', { trigger: 'blur' }).catch(() => {})"  v-model:value="modelRef.is_auth"  clearable>
              <a-select-option  :value="1" >是</a-select-option>
              <a-select-option  :value="0" >否</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="是否有服务:" v-bind="validateInfos.is_self">
            <a-select @change="validate('is_self', { trigger: 'blur' }).catch(() => {})"  v-model:value="modelRef.is_self"  clearable>
              <a-select-option  :value="1" >是</a-select-option>
              <a-select-option  :value="0" >否</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="服务分组:" v-bind="validateInfos.category_code">
            <a-select @change="validate('category_code', { trigger: 'blur' }).catch(() => {})" v-model:value="modelRef.category_code" clearable>
              <a-select-option v-for="item in sortServeice" :key="item.code"  :value="item.code" >{{item.name}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="业务场景:" v-bind="validateInfos.type">
            <a-tree-select
              @change="validate('type', { trigger: 'blur' }).catch(() => {})"
              v-model:value="modelRef.type"
              tree-data-simple-mode
              :replaceFields="{key:'id',title: 'name', value: 'id'}"
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="businessData"
              placeholder="请选择业务场景"
            />
          </a-form-item>
          <a-form-item label="数据领域:" v-bind="validateInfos.data_domain">
            <a-tree-select
              v-model:value="modelRef.data_domain"
              @change="validate('data_domain', { trigger: 'blur' }).catch(() => {})"
              :replaceFields="{ key:'id', title: 'dataName', value: 'id' }"
              tree-data-simple-mode
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="DomainData"
              placeholder="请选择数据领域"
            />
          </a-form-item>
          <a-form-item label="来源单位:" v-bind="validateInfos.source_unit">
            <a-tree-select
              v-model:value="modelRef.source_unit"
              @change="validate('source_unit', { trigger: 'blur' }).catch(() => {})"
              tree-data-simple-mode
              :replaceFields="{key:'id',title: 'sourceName', value: 'id'}"
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="sourceUnitData"
              placeholder="请选择来源单位"
            />
          </a-form-item>
          <a-form-item label="源数据:" v-bind="validateInfos.soureName">
            <a-input @blur="validate('soureName', { trigger: 'blur' }).catch(() => {})" v-model:value="modelRef.soureName" placeholder="请选择源数据" @click.native="selectSource" :selectValue="modelRef.soureName" />
          </a-form-item>
          <a-form-item label="服务标准:" v-bind="validateInfos.protocol">
            <a-select @change="validate('protocol', { trigger: 'blur' }).catch(() => {})"  v-model:value="modelRef.protocol" clearable>
              <a-select-option  :value="1" >REST</a-select-option>
              <a-select-option  :value="2" >SOAP</a-select-option>
              <a-select-option  :value="3" >REST/SOAP</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="服务描述:" v-bind="validateInfos.service_desc">
            <a-input @change="validate('service_desc', { trigger: 'blur' }).catch(() => {})"  v-model:value="modelRef.service_desc" placeholder="请输入服务描述" />
          </a-form-item>
          <a-form-item label="参数说明:" v-bind="validateInfos.param_desc">
            <a-input @change="validate('param_desc', { trigger: 'blur' }).catch(() => {})"  v-model:value="modelRef.param_desc" placeholder="请输入参数说明" />
          </a-form-item>
          <a-form-item label="结果描述:" v-bind="validateInfos.result_desc">
            <a-input @change="validate('result_desc', { trigger: 'blur' }).catch(() => {})"  v-model:value="modelRef.result_desc" placeholder="请输入结果描述" />
          </a-form-item>
          <a-form-item label="版本:" v-bind="validateInfos.version">
            <a-input @change="validate('version', { trigger: 'blur' }).catch(() => {})" v-model:value="modelRef.version" placeholder="请输入版本" />
          </a-form-item>
          <a-form-item label="备注:" v-bind="validateInfos.remark">
            <a-input @change="validate('remark', { trigger: 'blur' }).catch(() => {})"  v-model:value="modelRef.remark" placeholder="请输入备注" />
          </a-form-item>
          <a-form-item label="机构名称:" v-bind="validateInfos.org_id">
            <a-select @change="validate('org_id', { trigger: 'blur' }).catch(() => {})"  v-model:value="modelRef.org_id" clearable>
              <a-select-option  v-for="(item,index) in orglistData" :key="index" :value="item.id">{{item.name}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="覆盖范围:" v-bind="validateInfos.coverage">
            <a-input v-model:value="modelRef.coverage" placeholder="请输入覆盖范围" />
          </a-form-item>
          <a-form-item label="投影信息:" v-bind="validateInfos.projection_info">
            <a-input v-model:value="modelRef.projection_info" placeholder="请输入投影信息" />
          </a-form-item>
          <!-- <a-form-item label="图层名称:" v-bind="validateInfos.layer_name">
            <a-input v-model:value="modelRef.layer_name" placeholder="请输入图层名称" />
          </a-form-item> -->
          <!-- <a-form-item label="缩略图:" v-bind="validateInfos.thumbail">
            <a-upload :action="accredationURL" :show-upload-list="false"  :before-upload="beforeUpload" :on-success="handleSuccess" class="avaterUpload" :on-format-error="handleFormatError" :format="['jpg','jpeg','png','bmp','gif']">
              <div v-if="!userPic">
                <Icon type="ios-add"></Icon>
              </div>
              <img v-else :src="userPic" alt="">
            </a-upload>
          </a-form-item> -->
          <!-- <div class="text-title">扩展信息</div>
          <a-form-item label="服务简介:" v-bind="validateInfos.server_brief">
            <a-input v-model:value="modelRef.server_brief" placeholder="请输入服务简介" />
          </a-form-item>
          <a-form-item label="关键字:" v-bind="validateInfos.server_keyword">
            <a-input v-model:value="modelRef.server_keyword" placeholder="请输入关键字" />
          </a-form-item>
          <a-form-item label="服务子类:" v-bind="validateInfos.server_type">
            <a-input v-model:value="modelRef.server_type" placeholder="请输入服务子类" />
          </a-form-item>
          <a-form-item label="主题分类:" v-bind="validateInfos.server_theme">
            <a-input v-model:value="modelRef.server_theme" placeholder="请输入主题分类" />
          </a-form-item>
          <a-form-item label="覆盖区域:" v-bind="validateInfos.server_region">
            <a-input v-model:value="modelRef.server_region" placeholder="请输入覆盖区域" />
          </a-form-item>
          <a-form-item label="图层简介:" v-bind="validateInfos.layer_brief">
            <a-input v-model:value="modelRef.layer_brief" placeholder="请输入图层简介" />
          </a-form-item>
          <a-form-item label="比例尺:" v-bind="validateInfos.layer_scale">
            <a-input v-model:value="modelRef.layer_scale" placeholder="请输入比例尺" />
          </a-form-item>
          <a-form-item label="分辨率:" v-bind="validateInfos.layer_ratio">
            <a-input v-model:value="modelRef.layer_ratio" placeholder="请输入分辨率" />
          </a-form-item>
          <a-form-item label="发布时间:" v-bind="validateInfos.layer_time">
            <a-date-picker v-model:value="modelRef.layer_time" type="date"  placeholder="请选择发布时间" style="width: 200px"></a-date-picker>
          </a-form-item>
          <a-form-item label="源数据获取时间:" v-bind="validateInfos.layer_source_time">
            <a-date-picker v-model:value="modelRef.layer_source_time" type="date"  placeholder="请选择源数据获取时间" style="width: 200px"></a-date-picker>
          </a-form-item>
          <a-form-item label="注册单位:" v-bind="validateInfos.unit_name">
            <a-input v-model:value="modelRef.unit_name" placeholder="请输入注册单位" />
          </a-form-item>
          <a-form-item label="维护单位:" v-bind="validateInfos.maintain_name">
            <a-input v-model:value="modelRef.maintain_name" placeholder="请输入维护单位" />
          </a-form-item>
          <a-form-item label="联系地址:" v-bind="validateInfos.address">
            <a-input v-model:value="modelRef.address" placeholder="请输入联系地址" />
          </a-form-item>
          <a-form-item label="联系人:" v-bind="validateInfos.linkman">
            <a-input v-model:value="modelRef.linkman" placeholder="请输入联系人" />
          </a-form-item>
          <a-form-item label="联系人电话:" v-bind="validateInfos.tel">
            <a-input type="tel" v-model:value="modelRef.tel" placeholder="请输入联系人电话" />
          </a-form-item>
          <a-form-item label="联系人邮箱:" v-bind="validateInfos.mail">
            <a-input type="email" v-model:value="modelRef.mail" placeholder="请输入联系人邮箱" />
          </a-form-item>
          <a-form-item label="更新周期:" v-bind="validateInfos.server_update_period">
            <a-input v-model:value="modelRef.server_update_period" placeholder="请输入更新周期" />
          </a-form-item> -->
      </a-form>
    </a-modal>
    <a-modal
      v-model:visible="sourceVisible"
      width="80%"
      :title="modalTitle"
      class="serviceModal"
      ok-text="确认"
      cancel-text="取消"
      @cancel="resetFields"
      @ok="onSubmit"
    >
      <a-card>
        <a-form :model="sourceInfo" :label-width="80" layout="inline" >
          <a-form-item label="源数据名称">
            <a-input v-model="sourceInfo.name" placeholder="请输入源数据名称" @keyup.enter.native="handleSourceSearch(1)" />
          </a-form-item>
          <a-form-item label="源数据类型">
            <a-select v-model="sourceInfo.type" size="small" style="width:200px" transfer>
              <a-select-option v-for="item in sourceInfo.sourceType.type" :value="item.type" :key="item.type">{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="handleSourceSearch(1)">查询</a-button>&nbsp;
          </a-form-item>
        </a-form>
        <a-table border :columns="sourceColumns" :data-source="sourceData" :pagination="sourceInfo" :loading="loading" :row-key="record => record.id" :customRow="selectSourceData"	@change="handleSourceTableChange" >
          <template slot="createDate" slot-scope="{ row }">
            <span>{{ row.createDate | dateTime }}</span>
          </template>
        </a-table>
      </a-card>
    </a-modal>
  </section>
</template>
<script lang="ts">
const columns = [
  {
    title: '序号',
    customRender: ({text, record, index}) => `${index + 1}`,
  },
  {
    title: '服务名称',
    dataIndex: 'service_name',
  },
  {
    title: '服务分组',
    dataIndex: 'category_code_desc',
  },
  {
    title: '业务场景',
    dataIndex: 'type',
  },
  {
    title: '机构名称',
    dataIndex: 'name',
  },
  {
    title: '服务地址1级',
    dataIndex: 'service_url_classification1',
  },
  {
    title: '服务地址2级',
    dataIndex: 'service_url_classification2',
  },
  {
    title: '是否有服务',
    dataIndex: 'is_self',
    slots: { customRender: 'is_self' }
  },
  {
    title: '是否需要授权',
    dataIndex: 'is_auth',
    slots: { customRender: 'is_auth' }
  },
  {
    title: '状态',
    dataIndex: 'status',
    slots: { customRender: 'status' }
  },
  {
    title: '创建时间',
    dataIndex: 'create_date',
    slots: { customRender: 'create_date' }
  },
  {
    title: '操作',
    key: 'operation',
    slots: { customRender: 'operation' }
  },
];
const sourceColumns = [
  {
    title: '序号',
    customRender: ({text, record, index}) => `${index + 1}`,
  },
  {
    title: '源数据名称',
    dataIndex: 'name'
  },
  {
    title: '源数据别名',
    dataIndex: 'aliasname'
  },
  {
    title: '源数据区域',
    dataIndex: 'region',
  },
  {
    title: '源数据类型',
    dataIndex: 'type',
    tooltip: true
  },
  {
    title: '图层名称',
    dataIndex: 'layername',
    tooltip: true
  },
  {
    title: '图层类型',
    dataIndex: 'layertype',
  },
  {
    title: '创建时间',
    dataIndex: 'createDate',
    width: '200',
    slot: 'createDate'
  },
]
import { defineComponent, reactive, toRefs, onBeforeMount, toRaw } from 'vue';
import { useForm } from '@ant-design-vue/use';
import { Card, Modal, message } from "ant-design-vue";
import { PlusOutlined } from '@ant-design/icons-vue'
import Breadcrumb from '../../components/Breadcrumb/index.vue';
import { getServiceList, getserviceAdd, getServiceUpdate, getenabledServiceCategory, getfindOrgSelect, getServiceStart, getServiceStop, getServiceDeleteById, getViewData } from '../../api/services/index'
import { getSourceUnit, getBusinessDir, getMetaDataCategory, getDataDomain } from '../../api/catalog/index'
import { createTree } from '../../utils/util';
import DirctData from '../../utils/dict'
//  TODO
export default defineComponent({
  components: {
    Breadcrumb,
    Card,
    Modal,
    message,
    PlusOutlined
  },
  setup() {
    const state = reactive({
      pagination:{
        current: 1,
        pageSize: 10,
        total:0
      },
      loading: false,
      modalTitle:'新增数据领域',
      form:{
        dataName:'',
        dataCode: ''
      },
      labelCol: { span: 8 },
      // wrapperCol: { span: 14 },
      replaceFields: {
        key: 'id'
      },
      dataSource:[],
      sourceData: [],
      sourceUnitData: [],
      businessData: [],
      CategoryData: [],
      DomainData: [],
      sortServeice: [],
      orglistData: [],
      sourceInfo: {
        name: null,
        type: null,
        current: 1,
        pageSize: 10,
        total: 0,
        sourceType: DirctData
      },
      visible: false,
      currentStatus: 'add',
      sourceVisible: false,
      showModal: false,
    });
    let modelRef = reactive({
      service_name: '',
      method: '',
      url: '',
      service_url_classification1: '',
      service_url_classification2: '',
      is_auth: '',
      is_self: '',
      category_code: '',
      type: '',
      data_domain: '',
      source_unit: '',
      soureName: '',
      protocol: '',
      service_desc: '',
      param_desc: '',
      result_desc: '',
      version: '',
      remark: '',
      org_id: '',
      coverage: '',
      projection_info: '',
      layer_name: '',
      region: '',
      resource_id: '',
      resource_type: '',
      update_date: '',
      create_date:''
    });
    const rulesRef = reactive({
      service_name: [
        { required: true, message: '服务名称不能为空' },
        { required: true, min: 2, max: 16, message: '长度为2-16个字符' },
        { required: true, pattern: /^[^\s]*$/, message: '服务名称不能输入空格' },
        // { required: true, validator: validateInput }
      ],
      method: [
        { required: true, message: '请选择访问方式', type: 'number' },
      ],
      url: [
        { required: true, message: 'url真实地址不能为空' },
        { required: true, pattern: /^[^\s]*$/, message: 'url真实地址不能输入空格' },
        // { required: true, validator: validateEn, trigger: "blur" },
      ],
      service_url_classification1:[
        { required: true, message: '服务地址1级不能为空' },
        { pattern: /^[^\s]*$/, message: '服务地址1级不能输入空格' },
      ],
      service_url_classification2:[
        { required: true, message: '服务地址2级不能为空' },
        { pattern: /^[^\s]*$/, message: '服务地址2级不能输入空格' },
      ],
      is_auth: [
        { required: true, message: '请选择是否需要授权', type: 'number' },
      ],
      is_self: [
        { required: true, message: '请选择是否有服务',type: 'number' },
      ],
      category_code: [
        { required: true, message: '请选择服务分组' },
      ],
      type: [
        { required: true, message: '请选择业务场景' },
      ],
      datadomain: [
        { required: true, message: '请选择数据领域' },
      ],
      sourceunit: [
        { required: true, message: '请选择来源单位' },
      ],
      protocol: [
        { required: true, message: '请选择服务标准', type: 'number' },
      ],
      service_desc: [
        { pattern: /^[^\s]*$/, message: '服务描述不能输入空格' },
      ],
      param_desc: [
        { pattern: /^[^\s]*$/, message: '参数说明不能输入空格' },
      ],
      result_desc: [
        { pattern: /^[^\s]*$/, message: '结果描述不能输入空格' },
      ],
      version: [
        { required: true, pattern: /^[^\s]*$/, message: '版本不能输入空格' },
      ],
      remark: [
        { pattern: /^[^\s]*$/, message: '备注不能输入空格' },
      ],
      org_id :[
        { required: true, message: '请选择机构名称' },
      ],
      coverage: [
        { pattern: /^[^\s]*$/, message: '覆盖范围不能输入空格' },
      ],
      projection_info: [
        { pattern: /^[^\s]*$/, message: '投影信息不能输入空格' },
      ],
      layer_name: [
        { pattern: /^[^\s]*$/, message: '图层名称不能输入空格' },
      ],
      server_brief: [
        { pattern: /^[^\s]*$/, message: '服务简介不能输入空格' },
      ],
      mail: [
        { pattern: /^[^\s]*$/, message: '联系人邮箱不能输入空格' },
        { type: 'email', message: '联系人邮箱格式不正确' }
      ],
      tel: [
        { pattern: /^([1]\d{10}|([\\(（]?0[0-9]{2,3}[）\\)]?[-]?)?([2-9][0-9]{6,7})+(\\-[0-9]{1,4})?)$/,message: '联系人电话格式错误' }
      ],
      soureName: [
        { required: true, message: '请选择源数据' },
      ]
    });
    onBeforeMount(() => {
      initData();
    });
    const initData = async () => {
      let params = {
        service_name: '',
        page: state.pagination.current,
        rows: state.pagination.pageSize,
        status: '',
        create_date_begin: '',
        create_date_end: '',
        is_auth: '',
        category_code: ''
      }
      const { rows, total } = await getServiceList(params);
      state.dataSource = rows;
      state.pagination.total = total;
    };
    const getSoucreUnitData = async () => {
      if (state.sourceUnitData.length > 0) return;
      let params = {
        sourceName: '',
        sourceCode: '',
        current: 1,
        size: 200,
      }
      const { success, body } = await getSourceUnit(params);
      if (success) {
        state.sourceUnitData = createTree(body,'pid')
      }
    };
    const getBussinessData = async () => {
      if (state.businessData.length > 0) return;
      let params = {
        name: '',
        code: '',
        current: 1,
        size: 200,
      }
      const { success, body } = await getBusinessDir(params);
      if (success) {
        state.businessData = createTree(body,'parentId')
      }
    };
    const getCategoryData = async () => {
      if (state.CategoryData.length > 0) return;
      let params = {
        name: '',
        code: '',
        current: 1,
        size: 200,
      }
      const { success, body } = await getMetaDataCategory(params);
      if (success) {
        state.CategoryData = createTree(body,'parentId')
      }
    };
    const getDomainData = async () => {
      if (state.DomainData.length > 0) return;
      let params = {
        name: '',
        code: '',
        current: 1,
        size: 20,
      }
      const { success, body } = await getDataDomain(params);
      if (success) {
        state.DomainData = createTree(body,'pid')
      }
    };
    const getServiceCategory = async () => {
      if (state.sortServeice.length > 0) return;
      let res = await getenabledServiceCategory();
      state.sortServeice = res;
    };
    const getOrglist = async () => {
      if (state.orglistData.length > 0) return;
      let res = await getfindOrgSelect();
      state.orglistData = res;
    }
    const getSourceData = async () => {
      let params = {
        name: state.sourceInfo.name,
        type: state.sourceInfo.type || 'vector',
        page: state.sourceInfo.current,
        size: state.sourceInfo.pageSize
      };
      let res = await getViewData(params);
      const { searchCount, code, records, total } = res;
      if (searchCount) {
        state.sourceData = records;
        state.sourceInfo.total = total;
      }
    }
    const selectSource = async () => {
      state.sourceVisible = true;
      getSourceData();
    }
    const handleClick =  (status,records) => {
      getSoucreUnitData();
      getBussinessData();
      getCategoryData();
      getDomainData();
      getServiceCategory();
      getOrglist();
      switch(status) {
        case 'add':
          state.visible = true;
          state.modalTitle = '新增服务';
          state.currentStatus = 'add';
          break;
        case 'edit':
          state.visible = true;
          state.currentStatus = 'edit';
          state.modalTitle = '编辑服务';
          modelRef = Object.assign(modelRef,toRaw(records));
          break;
        case 'stop':
          handlerServices(records);
          break;
        case 'del':
          delServices(records);
          break;
        default:
          break;
      }
    };
    const handlerServices = async (records) => {
      Modal.confirm({
        title: `确定要${records.status=='1'?'开启':'停止'}${records.service_name}吗？`,
        onOk: async () => {
          let res = null;
          let params = {
            id: records.id
          };
          if (records.status == '1') {
            res = await getServiceStop(params)
          }else {
            res = await getServiceStart(params)
          }
          if (res.status) {
            initData();
            message.success(`${records.status == '1'?'开启':'停止'}停止成功`)
          }
        }
      })
    }
    const delServices = async (records) => {
      Modal.confirm({
        title: `确定删除${records.service_name}吗？`,
        onOk: async () => {
          let params = {
            id: records.id,
          }
          let res = await getServiceDeleteById(params)
          if (res.status) {
            message.success('删除成功')
            initData();
          }
        }
      })
    }
    const handleTableChange = (pagination) => {
      const pager = { ...state.pagination };
      pager.current = pagination.current;
      state.pagination = pager;
      initData();
    }
    const handleSourceTableChange = (pagination) => {
      const pager = { ...state.sourceInfo };
      pager.current = pagination.current;
      state.sourceInfo = pager;
      getSourceData();
    }
    const selectSourceData = (record) => {
      return {
        onClick: () => {
          modelRef.soureName = record.name
          modelRef.resource_id = record.code;
          modelRef.resource_type = state.sourceInfo.type;
          // 关闭窗口
          state.sourceVisible = false;
        }
      }
    }
    const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);
    const onSubmit = () => {
      validate()
        .then(async () => {
          let res = null;
          if (state.currentStatus === 'add') {
            let params = toRaw(modelRef);
            delete params.create_date;
            delete params.update_date;
            console.log(params)
            res = await getserviceAdd(params);
          }else {
            let params = toRaw(modelRef);
            params.id2 = params.id;
            delete params.create_date;
            delete params.update_date;
            res = await getServiceUpdate(params);
          }
          const { status } = res
          if (status) {
            message.success('保存服务成功!')
            state.visible = false;
            initData();
          } else {
            message.info(res.msg)
          }

        })
        .catch(err => {
          console.log('error', err);
        });
    }
    return {
      ...toRefs(state),
      columns,
      sourceColumns,
      modelRef,
      rulesRef,
      validate,
      resetFields,
      validateInfos,
      selectSource,
      handleClick,
      handleTableChange,
      handleSourceTableChange,
      selectSourceData,
      onSubmit,
    };
  }
})
</script>
<style lang="less">
.serviceModal {
  .ant-modal-content {
    .ant-modal-body {
      .ant-form {
        .ant-row {
          width: 330px;
          margin-bottom: 24px;
          .ant-col {
            width: 120px;
          }
        }
      }
    }
  }
}
</style>
