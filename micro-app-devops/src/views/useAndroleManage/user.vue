<!--
 * @Author: 任继民
 * @Date: 2021-01-19 14:29:18
 * @LastEditors: 任继民
 * @LastEditTime: 2021-03-04 16:28:53
 * @Description:用户管理
-->
<template>
  <section>
    <Breadcrumb :BreadHeight='"120px"'>
      <a-form
      layout="inline"
      >
        <a-form-item ref="name" label="用户名">
          <a-input v-model:value="pagination.username" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item ref="name" label="手机号">
          <a-input v-model:value="pagination.phone"   placeholder="请输入手机号" />
        </a-form-item>
        <a-form-item ref="name" label="账号状态">
          <a-select
            v-model:value="pagination.status"
            style="width: 120px"
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="0">失效</a-select-option>
            <a-select-option value="1" >有效</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item ref="name" label="实名认证">
          <a-select
            v-model:value="pagination.authStatus"
            style="width: 120px"
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="0">未认证</a-select-option>
            <a-select-option value="1">认证通过</a-select-option>
            <a-select-option value="2">审核中</a-select-option>
            <a-select-option value="3">认证失败</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            @click.native="initData"
          >
            查询
          </a-button>
        </a-form-item>
      </a-form>
    </Breadcrumb>
    <a-card :loading="loading" class="contentCard">
      <div class="search-con search-con-top">
        <div class="total">
          <img src="../../assets/images/icon-total.png" alt="" srcset="">
          <span class="text">当前数据：</span>
          <span class="num">{{pagination.total}}条</span>
        </div>
        <div>
          <a-button type="primary" @click="handleModal('add')">
            <template #icon><PlusOutlined /></template>新增用户
          </a-button>
        </div>
      </div>
      <a-table :columns="columns" :data-source="dataSource" :pagination="pagination" :loading="loading"  @change="handleTableChange" :row-key="record => record.id" bordered>
        <template #authStatus="{record}">
          <div v-if="record.authStatus =='0'"><i style="background:#c3cbd6" class="itablestatus"></i>未认证</div>
          <div v-else-if="record.authStatus == '1'"><i style="background:green" class="itablestatus"></i>认证通过</div>
          <div v-else-if="record.authStatus =='2'"><i style="background:#39f" class="itablestatus"></i>审核中</div>
          <div v-else-if="record.authStatus =='3'"><i style="background:red" class="itablestatus"></i>认证失败</div>
        </template>
        <template #createDate="{record}" >
          <span>{{record.createDate? record.createDate.replace("T", ' '):''}}</span>
        </template>
        <template #status="{record}">
          {{status}}
          <section class="table-status">
            <div v-if="record.status== '1'">
              <img src="../../assets/images/icon-pass.png" alt="" srcset="">
              <span>有效</span>
            </div>
            <div v-else >
              <img src="../../assets/images/icon-failed.png" alt="" srcset="">
              <span>失效</span>
            </div>
          </section>
        </template>
        <template #operation="{record}">
          <section class="operate-ico">
            <a-tooltip content="编辑" placement="top">
              <img src="../../assets/images/bianji.png" @click="handleModal('edit', record)" alt="" srcset="">
            </a-tooltip>
            <a-tooltip content="详情" placement="top">
              <img src="../../assets/images/查看icon.png" @click="handleModal('view', record)" alt="" srcset="">
            </a-tooltip>
            <a-tooltip content="删除" placement="top">
              <img src="../../assets/images/shanchu.png" @click="handleModal('del', record)" alt="" srcset="">
            </a-tooltip>
            <a-dropdown>
              <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                更多<a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a href="javascript:;">重置密码</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;">删除用户</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </section>
        </template>
      </a-table>
    </a-card>
    <a-modal
      v-model:visible="visible"
      :title="modalTitle"
      ok-text="确认"
      cancel-text="取消"
      @ok="submitData"
      >
      <a-tabs default-active-key="1" @change="tabChange">
        <a-tab-pane key="user" tab="用户信息">
          <a-form
            ref="ruleForm"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-form-item  label="用户名"  v-bind="validateInfos.username">
              <a-input v-model:value="modelRef.username" />
            </a-form-item>
            <a-form-item  label="真实姓名" v-bind="validateInfos.realname">
              <a-input v-model:value="modelRef.realname" />
            </a-form-item>
            <a-form-item  label="手机号码" v-bind="validateInfos.phone">
              <a-input v-model:value="modelRef.phone" />
            </a-form-item>
            <a-form-item  label="邮箱" v-bind="validateInfos.email">
              <a-input v-model:value="modelRef.email" />
            </a-form-item>
            <a-form-item  label="地址" v-bind="validateInfos.address">
              <a-input v-model:value="modelRef.address" />
            </a-form-item>
            <a-form-item  label="账号状态">
              <!-- <a-input v-model:value="form.status" /> -->
              <a-switch v-model:checked="modelRef.status" checked-children="有效" un-checked-children="失效" default-checked />
            </a-form-item>
            <a-form-item  label="头像" >
              <a-upload
                v-model:fileList="fileList"
                name="avatar"
                list-type="picture-card"
                class="useravatar-uploader"
                :show-upload-list="false"
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                :before-upload="beforeUpload"
                @change="handleChange"
              >
                <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
                <div v-else>
                  <!-- todo -->
                  <loading-outlined v-if="loading" />
                  <plus-outlined v-else />
                </div>
              </a-upload>
            </a-form-item>
            <a-form-item  label="备注" v-bind="validateInfos.remark">
              <a-textarea v-model:value="modelRef.remark" showCount :maxlength="100" />
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="org" tab="所属机构">
          <a-tree
            checkable
            v-model:checkedKeys="selectedorgKeys"
            v-model:expandedKeys="expandedKeys"
            :replaceFields="replaceFields"
            :auto-expand-parent="autoExpandParent"
            :tree-data="orgData"
            @check="onOrgCheck"
          />
        </a-tab-pane>
        <a-tab-pane key="area" tab="行政区划">
          <a-tree
            checkable
            v-model:checkedKeys="selecteddirKeys"
            v-model:expandedKeys="expandedKeys"
            :replaceFields="replaceFields"
            :auto-expand-parent="autoExpandParent"
            :tree-data="distData"
            @check="onDireCheck"
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
    title: '用户名',
    dataIndex: 'username',
  },
  {
    title: '真实姓名',
    dataIndex: 'realname',
  },
  {
    title: '认证状态',
    dataIndex: 'authStatus',
    slots: { customRender: 'authStatus' }
  },
  {
    title: '邮箱',
    dataIndex: 'email',
  },
  {
    title: '手机号',
    dataIndex: 'phone',
  },
  {
    title: '账号状态',
    dataIndex: 'status',
    slots: { customRender: 'status' }
  },
  {
    title: '注册时间',
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
import { Card,Tabs, Switch, Modal, message } from "ant-design-vue";
import { PlusOutlined } from '@ant-design/icons-vue'
import { useForm } from '@ant-design-vue/use';
import Breadcrumb from '../../components/Breadcrumb/index.vue';
import { getUserlist, getUserByID, getOrglist, getDistrict, passwdReset, sysAdd, updateUser, delteUser } from '../../api/user/index'
import { setTreeData } from '../../utils/util'
export default defineComponent({
  components: {
    Breadcrumb,
    Card,
    Tabs,
    PlusOutlined,
    Switch,
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
        username: '',
        phone: '',
        status: '',
        authStatus: ''
      },
      currentStatus: 'add',
      visible: false,
      modalTitle: '',
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      autoExpandParent: true,
      replaceFields: {
        key:'id',
        title:'name',
      }
    });
    const stateData = reactive({
      selectedDirlist: [],
      selectedOrglist: [],
      dataSource:[],
      orgData:[],
      distData: [],
      initialOrg: [],
      initialDir: [],
      selectedorgKeys: [],
      expandedKeys:[],
      selecteddirKeys: []
    })
    let modelRef = reactive({
      id: '',
      username: '',
      passwd: '',
      realname: '',
      phone: '',
      email: '',
      address: '',
      status: 1,
      remark: '',
      userPic: '',
    })
    const rulesRef = reactive({
      username: [
        { required: true, whitespace: true, message: '用户名不能为空' },
      ],
      realname: [
        { required: true, message: '真实姓名不能为空' },
        { min: 2, max: 15, message: '真实姓名长度为2到15个字符之间' },
        // { required: true, validator: validateRealName }
      ],
      phone: [
        { required: true,  message: '手机号码不能为空' },
        // { required: true, validator: validateMobile }
      ],
      email: [
        { required: true, type: 'email', message: '邮箱格式不正确' }
      ],
      address: [
        { type:'string', min: 2, max: 156, message: '地址长度为2到156个字符之间' }
      ]
    })
    onBeforeMount(() => {
      initData();
      initOrg();
      initDistrict();
    })
    // 初始化数据
    const initData = async () => {
      state.loading = true;
      let params = {
        username: state.pagination.username,
        phone: state.pagination.phone,
        status: state.pagination.status,
        authStatus: state.pagination.authStatus,
        current: state.pagination.current,
        size: state.pagination.pageSize,
      }
      const { success, data } = await getUserlist(params);
      if (success) {
        state.loading = false;
        stateData.dataSource = data.records;
        state.pagination.total = data.total;
      }
    }
    const initOrg = async () => {
      if (stateData.orgData,length > 0) return;
      let params = {
        authStatus: "",
        code: "",
        current: 1,
        name: "",
        size: 999
      }
      const { success, data } = await getOrglist(params);
      if (success) {
        stateData.orgData = setTreeData(data.records,'parentId');
      }
    }
    const initDistrict = async () => {
      if (stateData.distData,length > 0) return;
      const { success, data } = await getDistrict();
      if (success) {
        stateData.distData = setTreeData(data,'pid');
      }
    }
    const handleTableChange = (pagination) => {
      const pager = { ...state.pagination };
      pager.current = pagination.current;
      state.pagination = pager;
      initData();
    }
    const getCurrentUseInfo = async (info) => {
      stateData.selectedorgKeys = [];
      stateData.selecteddirKeys = [];
      let params = {
        userid: info.id
      }
      let res = await getUserByID(params);
      const { success, data } = res;
      if (success) {
        data.userInfo.status = data.userInfo.status == 1? true: false;
        modelRef = Object.assign(modelRef,data.userInfo);
        stateData.initialOrg = data.userOrgList;
        stateData.initialDir = data.userXzqhList;
        data.userOrgList.forEach(element => {
          element && stateData.selectedorgKeys.push(element.id)
        });
        data.userXzqhList.forEach(element => {
          element && stateData.selecteddirKeys.push(element.id)
        });
      }
    }
    const handleModal = async (status, obj) => {
      switch(status) {
        case 'add':
          state.visible = true;
          state.currentStatus = 'add';
          resetFields();
          break;
        case 'edit':
          state.visible = true;
          state.currentStatus = 'edit';
          modelRef = Object.assign(modelRef,obj)
          getCurrentUseInfo(obj);
          break;
        case 'view':
          state.currentStatus = 'view';
          break;
        case 'resetPwd':
          resetPwd(obj);
          break;
        case 'del':
          delUseData(obj)
          break;
        default:
          break;
      }
    }
    const onOrgCheck = (checkedKeys, {checked, checkedNodes, node, event}) => {
      console.log(checkedKeys, {checked, checkedNodes, node, event})
      stateData.selectedOrglist = checkedNodes;
      stateData.selectedorgKeys = checkedKeys;
    }
    const onDireCheck = (checkedKeys, {checked, checkedNodes, node, event}) => {
      console.log(checkedKeys, {checked, checkedNodes, node, event})
      stateData.selectedDirlist = checkedNodes;
      stateData.selecteddirKeys = checkedKeys;
    }
    const resetPwd = (obj) => {
      Modal.confirm({
        title: '确定重置密码吗？',
        onOk: async () => {
          let params = {
            id: obj.id
          }
          let res = await passwdReset(params)
          if (res.success) {
            message.success('重置成功,默认密码为123456');
          }
        }
      })
    }
    const delUseData = (obj) => {
      Modal.confirm({
        title: '确定删除该用户吗',
        onOk: async () => {
          let params = {
            id: obj.id
          }
          let res = await delteUser(params)
          if (res.success) {
            message.success('删除成功')
            initData();
          } else {
            message.error(res.status.message)
          }
          state.visible = false;
        }
      })
    }
    const addUserData = async () => {
      let params = {
        user: {
          username: modelRef.username,
          passwd: modelRef.passwd,
          realname: modelRef.realname,
          phone: modelRef.phone,
          email: modelRef.email,
          status: modelRef.status ? 1 : 0,
          address: modelRef.address,
          userPic: modelRef.userPic,
          remark: modelRef.remark
        },
        userOrgAdd: [],
        userDatatypeAdd: [],
        userXzquAdd: [],
        userOrgRemove: [],
        userDatatypeRemove: [],
        userXzquRemove: []
      }
      stateData.selectedOrglist.forEach(item => {
        params.userOrgAdd.push(item.props.id)
      })
      stateData.selectedDirlist.forEach(item => {
        params.userXzquAdd.push(item.props.id)
      })
      let res = await sysAdd(params)
      const { success, data } = res
      if (success) {
        message.success(data);
        state.visible = false
        state.loading = false
        initData();
      } else {
        message.info(res.status.message)
        state.loading = false
      }
    }
    const editUserData = async () => {
      let params = {
        user: {
          id: modelRef.id,
          username: modelRef.username,
          realname: modelRef.realname,
          phone: modelRef.phone,
          email: modelRef.email,
          status: modelRef.status ? 1 : 0,
          address: modelRef.address,
          userPic: modelRef.userPic,
          remark: modelRef.remark
        },
        userOrgAdd: [],
        userOrgRemove: [],
        userDatatypeAdd: [],
        userDatatypeRemove: [],
        userXzquAdd: [],
        userXzquRemove: []
      }
      params.userOrgAdd = getVariation(stateData.selectedOrglist,stateData.initialOrg).add;
      params.userOrgRemove = getVariation(stateData.selectedOrglist,stateData.initialOrg).del;
      params.userXzquAdd = getVariation(stateData.selectedDirlist,stateData.initialDir).add;
      params.userXzquRemove = getVariation(stateData.selectedDirlist,stateData.initialDir).del;

      let res = await updateUser(params);
      const { success, data } = res
      if (success) {
        message.success(data)
        state.visible = false
        state.loading = false
        initData();
      } else {
        message.info(res.status.message)
        state.loading = false
      }
    }
    const getVariation = (newValue,oldValue) => {
      const oldkeys = [];
      const newkeys = [];
      const resObj = {
        add: [],
        del: []
      }
      newValue.forEach(item => {
        item && newkeys.push(item.props.id)
      });
      oldValue.forEach(item => {
        item && oldkeys.push(item.id)
      });
      resObj.add = newkeys.filter(function(item) {
        return oldkeys.indexOf(item) == -1
      });

      resObj.del = oldkeys.filter(function(item) {
        return newkeys.indexOf(item) == -1
      });
      return resObj;
    }
    const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);
    const submitData = () => {
      validate()
        .then(async () => {
          if (state.currentStatus === 'add') {
            addUserData()
          }else {
            editUserData()
          }
        })
        .catch(err => {
          console.log('error', err);
        });
    }
    const tabChange = async (value) => {
      let res = null;
      switch(value) {
        case 'user':

          break;
        case 'org':

          break;
        case 'area':
          break;
        default:
          break;
      }
    }
    return {
      ...toRefs(state),
      ...toRefs(stateData),
      initData,
      handleTableChange,
      handleModal,
      onOrgCheck,
      onDireCheck,
      submitData,
      tabChange,
      resetFields,
      validate,
      validateInfos,
      modelRef,
      rulesRef,
      columns,
    };
  }
})
</script>
<style lang="less">
@import url('../../assets/style/common.less');
.useravatar-uploader {
  // width: 56px;
  // height: 56px;
  // border-radius: 28px;
  // border: 1px solid #515a6e;
  .ant-upload-select-picture-card {
    border: none;
    width: 60px;
    height: 60px;
    .anticon-plus {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 56px;
      height: 56px;
      border-radius: 28px;
      border: 1px solid #515a6e;
      svg {
        width: 2em;
        height: 2em;
      }
    }
  }

}
</style>
