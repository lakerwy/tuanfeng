<!--
 * @Author: 任继民
 * @Date: 2021-01-28 11:30:34
 * @LastEditors: 任继民
 * @LastEditTime: 2021-02-26 16:24:03
 * @Description:权限
-->
<template>
  <section>
    <Breadcrumb />
    <a-card :loading="loading" class="contentCard">
      <div class="search-con search-con-top">
        <div class="total">
          <img src="../../assets/images/icon-total.png" alt="" srcset="">
          <span class="text">当前数据：</span>
          <span class="num">{{pagination.total}}条</span>
        </div>
      </div>
      <a-table :columns="columns" :data-source="dataSource" :pagination="pagination" :loading="loading"  @change="handleTableChange" :row-key="record => record.id" bordered>
        <template #createDate="{record}" >
          <span>{{record.createDate? record.createDate.replace("T", ' '):''}}</span>
        </template>
        <template #operation="{record}">
          <section class="operate-ico">
            <a-tooltip content="编辑" placement="top">
              <img src="../../assets/images/bianji.png" @click="handleModal('edit', record)" alt="" srcset="">
            </a-tooltip>
          </section>
        </template>
      </a-table>
    </a-card>
    <a-modal
        v-model:visible="visible"
        width="40%"
        :title="modalTitle"
        ok-text="确认"
        cancel-text="取消"
        @ok="submitData"
      >
      <a-tabs default-active-key="1" @change="tabChange">
        <a-tab-pane key="menu" tab="菜单权限">
          <a-tree
            v-model:checkedKeys="menucheckedKeys"
            :replaceFields="replaceFields"
            checkable
            v-model::expanded-keys="expandedKeys"
            :auto-expand-parent="autoExpandParent"
            :tree-data="menuData"
            @check="onMenuCheck"
          />
        </a-tab-pane>
        <a-tab-pane key="business" tab="业务类型权限" force-render>
          <a-tree
            v-model:checkedKeys="busincheckedKeys"
            :replaceFields="replaceFields"
            checkable
            v-model::expanded-keys="expandedKeys"
            :auto-expand-parent="autoExpandParent"
            :tree-data="businessData"
            @check="onBusinessCheck"
          />
        </a-tab-pane>
        <a-tab-pane key="metaData" tab="成果目录权限" force-render>
          <a-tree
            v-model:checkedKeys="metacheckedKeys"
            :replaceFields="replaceFields"
            checkable
            v-model::expanded-keys="expandedKeys"
            :auto-expand-parent="autoExpandParent"
            :tree-data="metaData"
            @check="onMetaCheck"
          />
        </a-tab-pane>
        <a-tab-pane key="domain" tab="数据领域权限" force-render>
          <a-tree
            v-model:checkedKeys="domaincheckedKeys"
            :replaceFields="replacdoMainFields"
            checkable
            v-model::expanded-keys="expandedKeys"
            :auto-expand-parent="autoExpandParent"
            :tree-data="domainData"
            @check="onDomainCheck"
          />
        </a-tab-pane>
        <a-tab-pane key="unit" tab="来源单位权限" force-render>
          <a-tree
            v-model:checkedKeys="unitcheckedKeys"
            :replaceFields="replaceunitFields"
            checkable
            v-model::expanded-keys="expandedKeys"
            :auto-expand-parent="autoExpandParent"
            :tree-data="unitData"
            @check="onUnitCheck"
          />
        </a-tab-pane>
      </a-tabs>
    </a-modal>
  </section>
</template>
<script lang="ts">
const columns = [
  {
    title: '序号',
    width:100,
    customRender: ({text, record, index}) => `${index + 1}`,
  },
  {
    title: '角色名称',
    dataIndex: 'name',
  },
  {
    title: '角色编码',
    dataIndex: 'code',
  },
  {
    title: '角色描述',
    dataIndex: 'remark',
  },
  {
    title: '创建时间',
    dataIndex: 'createDate',
    slots: { customRender: 'createDate' }
  },
  {
    title: '操作',
    key: 'operation',
    slots: { customRender: 'operation' }
  },
];
import { defineComponent, reactive, onBeforeMount, toRefs } from 'vue';
import { Card,Tabs, Modal, message } from "ant-design-vue";
import { useForm } from '@ant-design-vue/use';
import Breadcrumb from '../../components/Breadcrumb/index.vue';
import { setTreeData } from '../../utils/util';
import { getRoles, getUserByID, findById } from '../../api/user/index'
import { getBusinessDir, getMetaDataCategory, getDataDomain, getSourceUnit } from '../../api/catalog/index'
// TODO
export default defineComponent({
  components: {
    Breadcrumb,
    Card,
    Tabs,
    Modal,
    message
  },
  setup() {
    const state = reactive({
      loading: false,
      pagination: {
        current:1,
        pageSize:10,
        total:0,
        name:'',
        code: ''
      },
      visible: false,
      modalTitle: '',
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      replaceFields: {
        key:'id',
        title:'name',
      },
      replacdoMainFields: {
        key:'id',
        title:'dataName',
      },
      replaceunitFields: {
        key:'id',
        title:'sourceName',
      },
      autoExpandParent: true
    });
    const stateData = reactive({
      expandedKeys: [],
      selectedKeys: [],
      checkedKeys: [],
      dataSource: [],
      menuData:[],
      businessData: [],
      metaData: [],
      domainData: [],
      unitData: [],
      menucheckedKeys:[],
      busincheckedKeys:[],
      metacheckedKeys: [],
      domaincheckedKeys: [],
      unitcheckedKeys: []
    })
    let modelRef= reactive({
      id: '',
      name: '',
      code: '',
      parentId: 0,
      parentIds: 0,
      isDepart: 0,
      adminUser: '',
    })
    const rulesRef = reactive({

    })
    onBeforeMount(() => {
      initData();
    })
    // 初始化数据
    const initData = async () => {
      state.loading = true;
      let params = {
        code: state.pagination.code,
        name: state.pagination.name,
        current: state.pagination.current,
        size: state.pagination.pageSize,
      }
      const { success, data } = await getRoles(params);
      if (success) {
        state.loading = false;
        stateData.dataSource = data.records;
        state.pagination.total = data.total;
      }
    }
    const removeData = async (text) => {
      console.log(text)
    }
    const handleTableChange = (pagination) => {
      const pager = { ...state.pagination };
      pager.current = pagination.current;
      state.pagination = pager;
      initData();
    }
    const getCurrentInfo = async (record) => {
      let params = {
        id: record.id
      };
      let res = await findById(params);
      const { success, data } = res;
      if (success) {
        stateData.menuData = data.allMenuList;
      }
    }
    const onMenuCheck = (checkedKeys, {checked, checkedNodes, node, event}) => {
      console.log(checkedKeys, {checked, checkedNodes, node, event})
      // stateData = checkedNodes;
      stateData.menucheckedKeys = checkedKeys;
    }
    const onBusinessCheck = (checkedKeys, {checked, checkedNodes, node, event}) => {
      console.log(checkedKeys, {checked, checkedNodes, node, event})
      // stateData = checkedNodes;
      stateData.busincheckedKeys = checkedKeys;
    }
    const onMetaCheck = (checkedKeys, {checked, checkedNodes, node, event}) => {
      console.log(checkedKeys, {checked, checkedNodes, node, event})
      // stateData = checkedNodes;
      stateData.metacheckedKeys = checkedKeys;
    }
    const onDomainCheck = (checkedKeys, {checked, checkedNodes, node, event}) => {
      console.log(checkedKeys, {checked, checkedNodes, node, event})
      // stateData = checkedNodes;
      stateData.domaincheckedKeys = checkedKeys;
    }
    const onUnitCheck = (checkedKeys, {checked, checkedNodes, node, event}) => {
      console.log(checkedKeys, {checked, checkedNodes, node, event})
      // stateData = checkedNodes;
      stateData.unitcheckedKeys = checkedKeys;
    }
    const handleModal = async (status, record) => {
      switch(status) {
        case 'edit':
          state.visible = true;
          getCurrentInfo(record)
          break;
        default:
          break;
      }
      state.visible = true;
      if (status === 'edit') {
          let params = {
            userid: record.id
          }
          let res = await getUserByID(params);
          const { success, data } = res;
          if (success) {
            modelRef = Object.assign({},data.userInfo);
          }
      }
    }
    const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);
    const submitData = () => {

    }
    const tabChange = async (value) => {
      switch(value) {
        case 'business':
          let busParams = {
            name: '',
            code: '',
          }
          let busres = await getBusinessDir(busParams);
          if (stateData.businessData.length > 0) return;
          if (busres.success) {
            stateData.businessData = setTreeData(busres.body,'parentId')
          }
          break;
        case 'metaData':
          let metaParams = {
            name: '',
            code: '',
          }
          if (stateData.metaData.length > 0) return;
          let metares = await getMetaDataCategory(metaParams);
          if (metares.success) {
            stateData.metaData = setTreeData(metares.body,'parentId')
          }
          break;
        case 'domain':
          let domainParams = {
            code: '',
            name: '',
          };
          if (stateData.domainData.length > 0) return;
          let domainres = await getDataDomain(domainParams);
          if (domainres.success) {
            stateData.domainData = setTreeData(domainres.body,'pid')
          }
          break;
        case 'unit':
          let unitParams = {
            sourceName: '',
            sourceCode: '',
          };
          if (stateData.unitData.length > 0) return;
          let unitres = await getSourceUnit(unitParams);
          if (unitres.success) {
            stateData.unitData = setTreeData(unitres.body,'pid')
          }
          break;
        default:
          break;
      }
    }
    return {
      ...toRefs(state),
      ...toRefs(stateData),
      removeData,
      handleTableChange,
      handleModal,
      resetFields,
      validate,
      validateInfos,
      modelRef,
      rulesRef,
      submitData,
      tabChange,
      onMenuCheck,
      onBusinessCheck,
      onMetaCheck,
      onDomainCheck,
      onUnitCheck,
      columns,
    };
  }
})
</script>
<style lang="less" scoped>
@import url('../../assets/style/common.less');
</style>
