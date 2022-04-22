<template>
  <div>
    <HeaderContent>
      <Form ref="searchForm" :model="pageInfo" inline :label-width="80">
        <FormItem label="用户名">
          <Input
            type="text"
            v-model="pageInfo.username"
            placeholder="请输入用户名"
          />
        </FormItem>
        <FormItem label="手机号">
          <Input
            type="text"
            v-model="pageInfo.phone"
            placeholder="请输入手机号码"
          />
        </FormItem>
        <!-- <FormItem label="所属部门:">
          <Input type="text" v-model="pageInfo.orgId" placeholder="请输入所属部门"/>
        </FormItem> -->
        <FormItem label="账号状态">
          <Select v-model="pageInfo.status" style="width:150px;">
            <Option>全部</Option>
            <Option value="0">失效</Option>
            <Option value="1">有效</Option>
          </Select>
        </FormItem>
        <!-- <FormItem label="实名认证">
          <Select v-model="pageInfo.authStatus" style="width:150px;">
            <Option >全部</Option>
            <Option value="0">未认证</Option>
            <Option value="1">认证通过</Option>
            <Option value="2">审核中</Option>
            <Option value="3">认证失败</Option>
          </Select>
        </FormItem> -->
        <FormItem>
          <Button type="primary" @click="handleSearch(1)">查询</Button>&nbsp;
          <!-- <Button @click="handleResetForm('searchForm')">重置</Button> -->
        </FormItem>
      </Form>
    </HeaderContent>
    <Card shadow>
      <div class="search-con search-con-top">
        <div class="total">
          <img
            src="../../../../assets/images/icon-total.png"
            alt=""
            srcset=""
          />
          <span class="text">当前数据：</span>
          <span class="num">{{ pageInfo.total }}条</span>
        </div>
        <div>
          <Button icon="md-add" type="primary" @click="handleModal(null, 'add')"
            >添加用户</Button
          >
          <!--<Button class="search-btn" type="primary" @click="handleModal()">
            <span>添加</span>
          </Button>-->
        </div>
      </div>
      <Table border :columns="columns" :data="data" :loading="loading">
        <template slot="authstatus" slot-scope="{ row }">
          <div v-if="row.authStatus == '0'">
            <i style="background:#c3cbd6" class="itablestatus"></i>未认证
          </div>
          <div v-else-if="row.authStatus == '1'">
            <i style="background:green" class="itablestatus"></i>认证通过
          </div>
          <div v-else-if="row.authStatus == '2'">
            <i style="background:#39f" class="itablestatus"></i>审核中
          </div>
          <div v-else-if="row.authStatus == '3'">
            <i style="background:red" class="itablestatus"></i>认证失败
          </div>
        </template>
        <template slot="createDate" slot-scope="{ row }">
          <span>{{
            row.createDate ? row.createDate.replace("T", " ") : ""
          }}</span>
        </template>
        <template slot="accountstatus" slot-scope="{ row }">
          <section class="table-status">
            <div v-if="row.status == '1'">
              <img
                src="../../../../assets/images/icon-pass.png"
                alt=""
                srcset=""
              />
              <span>有效</span>
            </div>
            <div v-else>
              <img
                src="../../../../assets/images/icon-failed.png"
                alt=""
                srcset=""
              />
              <span>失效</span>
            </div>
          </section>
        </template>
        <template slot="orgNameList" slot-scope="{ row }">
          <span v-for="(item, index) in row.orgNameList" :key="index"
            >{{ item }}<i v-show="index != row.orgNameList.length">,</i></span
          >
        </template>
        <template slot="action" slot-scope="{ row }">
          <div class="actionIcon">
            <Tooltip content="编辑" placement="top">
              <img
                src="../../../../assets/images/bianji.png"
                @click="handleModal(row, 'edit')"
                alt=""
                srcset=""
              />
            </Tooltip>
            <Tooltip content="详情" placement="top">
              <img
                src="../../../../assets/images/查看icon.png"
                @click="handleModal(row, 'showDetail')"
                alt=""
                srcset=""
              />
            </Tooltip>
            <Dropdown
              transfer
              ref="dropdown"
              @on-click="handleClick($event, row)"
            >
              <a href="javascript:void(0)">
                <span>更多</span>
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem name="changepwd">重置密码</DropdownItem>
                <DropdownItem name="deleteUser">删除用户</DropdownItem>
              </DropdownMenu>
            </Dropdown>
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
    <Modal
      v-model="modalVisible"
      :title="modalTitle"
      width="40"
      class-name="user-modal"
      :mask-closable="false"
      @on-cancel="handleReset"
    >
      <div>
        <Tabs @on-click="handleTabClick" :value="current">
          <TabPane label="用户信息" name="form1">
            <Form
              v-show="current == 'form1'"
              ref="form1"
              :model="formItem"
              :rules="formItemRules"
              :label-width="100"
              label-position="right"
              class="user-tree"
            >
              <FormItem label="用户名" prop="username">
                <Input
                  :disabled="handleStatus == 'edit' ? true : false"
                  v-model="formItem.username"
                  placeholder="请输入用户名"
                />
              </FormItem>
              <FormItem label="密码" prop="passwd" v-if="handleStatus == 'add'">
                <Input
                  type="password"
                  :disabled="showDetail ? true : false"
                  v-model="formItem.passwd"
                  placeholder="请输入密码"
                />
              </FormItem>
              <FormItem label="真实姓名" prop="realname">
                <Input
                  :disabled="formItem.userId || showDetail ? true : false"
                  v-model="formItem.realname"
                  placeholder="请输入真实姓名"
                />
              </FormItem>
              <FormItem label="手机号码" prop="phone">
                <Input
                  v-model="formItem.phone"
                  :disabled="showDetail ? true : false"
                  placeholder="请输入手机号码"
                />
              </FormItem>
              <FormItem label="邮箱" prop="email">
                <Input
                  type="email"
                  :disabled="showDetail ? true : false"
                  v-model.trim="formItem.email"
                  placeholder="请输入邮箱"
                />
              </FormItem>
              <FormItem label="地址" prop="address">
                <Input
                  v-model="formItem.address"
                  :disabled="showDetail ? true : false"
                  placeholder="请输入地址"
                />
              </FormItem>
              <FormItem label="账号状态" class="left">
                <i-switch
                  v-model="formItem.status"
                  size="large"
                  :disabled="showDetail ? true : false"
                >
                  <span slot="open">有效</span>
                  <span slot="close">失效</span>
                </i-switch>
              </FormItem>
              <FormItem label="头像" class="left">
                <Upload
                  :action="accredationURL"
                  :headers="uploadHeaders"
                  :show-upload-list="false"
                  :disabled="showDetail ? true : false"
                  :before-upload="beforeUpload"
                  :on-success="handleSuccess"
                  class="avaterUpload"
                  :on-format-error="handleFormatError"
                  :format="['jpg', 'jpeg', 'png', 'bmp', 'gif']"
                >
                  <div v-if="!userPic">
                    <Icon type="ios-add"></Icon>
                  </div>
                  <img v-else :src="userPic" alt="" />
                  <!-- <span @click="cancleAvatar" class="delimg">×</span> -->
                  <!-- <i v-if="!formItem.userPic" class="el-icon-plus"></i> -->
                  <!-- <img v-else :src="formItem.userPic" alt=""> -->
                </Upload>
              </FormItem>
              <FormItem label="备注" prop="remark" class="left">
                <Input
                  v-model="formItem.remark"
                  :disabled="showDetail ? true : false"
                  type="textarea"
                  maxlength="50"
                  show-word-limit
                  placeholder="请输入备注"
                />
              </FormItem>
            </Form>
          </TabPane>
          <TabPane label="所属机构" name="form2">
            <Tree
              class="user-tree"
              v-if="!showDetail"
              :data="orgTreedata"
              ref="orgTreedata"
              show-checkbox
              :render="renderorgTreeData"
            />
            <Tree
              class="user-tree"
              v-else
              :data="hasOrglist"
              ref="orgTreedata"
              :render="renderorgTreeData"
            />
          </TabPane>
          <!--<TabPane label="数据权限" name="form3" >
            <Tree class="user-tree" v-if="!showDetail" :data="treedataType" ref="treedataType" show-checkbox :render="rendertreedataType"/>
            <Tree class="user-tree" v-else :data="hasDataTypelist" ref="treedataType"  :render="rendertreedataType"/>
          </TabPane>-->
          <TabPane label="行政区划" name="form4">
            <Tree
              class="user-tree"
              v-if="!showDetail"
              :data="areaTree"
              ref="areaTree"
              show-checkbox
              :render="renderareaTree"
            />
            <Tree
              class="user-tree"
              v-else
              :data="hasCitylist"
              ref="areaTree"
              :render="renderareaTree"
            />
          </TabPane>
        </Tabs>
        <div class="drawer-footer" v-show="!showDetail">
          <Button type="default" @click="cancelSubmit">取消</Button>&nbsp;
          <Button type="primary" @click="handleSubmit" :loading="saving"
            >保存</Button
          >
        </div>
        <div class="drawer-footer" v-show="showDetail">
          <Button type="primary" @click="modalVisible = false">确定</Button>
        </div>
      </div>
    </Modal>
    <Modal
      v-model="pwdModelVisible"
      title="修改密码"
      width="30"
      :mask-closable="false"
      @on-cancel="pwdModelVisible = false"
    >
      <div>
        <Form
          ref="form2"
          :model="formData"
          :rules="formDataRules"
          :label-width="150"
          style="width:400px"
          label-position="right"
        >
          <FormItem label="用户名">
            <p v-text="selectuserInfo.username"></p>
          </FormItem>
          <FormItem label="原始密码" prop="oldPasswd">
            <Input
              type="password"
              v-model.trim="formData.oldPasswd"
              placeholder="请输入原始密码"
            />
          </FormItem>
          <FormItem label="新密码" prop="newPasswd">
            <Input
              type="password"
              v-model.trim="formData.newPasswd"
              placeholder="请输入新密码"
            />
          </FormItem>
          <FormItem label="再次输入新密码" prop="againPasswd">
            <Input
              type="password"
              v-model.trim="formData.againPasswd"
              placeholder="请输入再次输入新密码"
            />
          </FormItem>
        </Form>
        <div class="drawer-footer">
          <Button type="default" @click="pwdModelVisible = false">取消</Button
          >&nbsp;
          <Button type="primary" @click="handleSubmitPwd" :loading="saving"
            >保存</Button
          >
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import HeaderContent from "@/components/header-content/index";
import store from "@/store";
import {
  getUserlist,
  delteUser,
  getUserByID,
  updateUser,
  sysAdd,
  passwdReset
} from "@/api/user";
// import {getAllRoles} from '@/api/role'
import { getOrglist } from "@/api/organ/index";
import { getDataType } from "@/api/dataType";
import { getDistrict } from "@/api/amd";

import { treeData } from "@/libs/util";
import { createTree } from "@/libs/util";
export default {
  name: "SystemUser",
  components: {
    HeaderContent
  },
  data() {
    const validateEn = (rule, value, callback) => {
      let reg = /^[_a-zA-Z0-9]+$/;
      let reg2 = /^.{4,18}$/;
      if (this.handleStatus == "add") {
        this.data.forEach(item => {
          if (value == item.username) {
            callback(new Error("登录名已存在，请重新输入"));
          }
        });
      }
      // 长度为4到18个字符
      if (value === "") {
        callback(new Error("登录名不能为空"));
      } else if (value !== "" && !reg.test(value)) {
        callback(new Error("只允许字母、数字、下划线"));
      } else if (value !== "" && !reg2.test(value)) {
        callback(new Error("长度4到18个字符"));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      let reg2 = /^.{6,18}$/;
      let reg3 = /^[^\s]*$/;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value !== "" && !reg2.test(value)) {
        callback(new Error("密码长度为6到18个字符"));
      } else {
        callback();
      }
    };
    const validateagainPass = (rule, value, callback) => {
      let reg2 = /^.{6,18}$/;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value !== this.formData.newPasswd) {
        callback(new Error("两次输入的密码不一致!"));
      } else {
        callback();
      }
    };
    const validateRealName = (rule, value, callback) => {
      let reg2 = /[\u4E00-\u9FA5\uf900-\ufa2d]{2,6}$/;
      if (value !== "" && !reg2.test(value)) {
        callback(new Error("真实姓名必须为汉字"));
      } else {
        callback();
      }
    };
    const validateMobile = (rule, value, callback) => {
      let reg = /^1[3456789]\d{9}$/;
      // if (this.handleStatus == "add") {
      this.data.forEach(item => {
        if (value == item.phone) {
          callback(new Error("手机号已存在，请重新输入"));
        }
      });
      // }
      if (value !== "" && !reg.test(value)) {
        callback(new Error("手机号码格式不正确"));
      } else {
        callback();
      }
    };
    const validateEmail = (rule, value, callback) => {
      // if (this.handleStatus == "add") {
      this.data.forEach(item => {
        if (value == item.email) {
          callback(new Error("邮箱已存在，请重新输入"));
        }
      });
      if (value !== "") {
        callback();
      }
    };
    return {
      loading: false,
      saving: false,
      modalVisible: false,
      modalTitle: "",
      current: "form1",
      forms: ["form1", "form2", "form3", "form4"],
      selectMenus: [],
      selectRoles: [],
      pageInfo: {
        page: 1,
        limit: 10,
        sort: "createTime",
        order: "desc"
      },
      accredationURL: `${window.globalUrl.API_HOME}/sys/t-user/uploadFile`,
      uploadHeaders: { "J-Token": Cookies.get("j_s_id") },
      formItemRules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { required: true, validator: validateEn, trigger: "blur" }
        ],
        passwd: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {
            required: true,
            min: 6,
            max: 18,
            message: "密码长度为6到18个字符",
            trigger: "blur"
          },
          {
            required: true,
            pattern: /^[^\s]*$/,
            message: "密码不能输入空格",
            trigger: "blur"
          }
          // {required: true, validator: validatePass, trigger: 'change'}
        ],
        realname: [
          { required: true, message: "真实姓名不能为空", trigger: "blur" },
          {
            min: 2,
            max: 15,
            message: "真实姓名长度为2到15个字符之间",
            trigger: "blur"
          },
          { required: true, validator: validateRealName, trigger: "blur" }
        ],
        phone: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          { required: true, validator: validateMobile, trigger: "blur" }
        ],
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          {
            type: "email",
            message: "邮箱格式不正确",
            trigger: "blur"
          },
          { validator: validateEmail, trigger: "blur" }
        ],
        address: [
          {
            min: 2,
            max: 156,
            message: "地址长度为2到156个字符之间",
            trigger: "blur"
          }
        ]
      },
      formItem: {
        userId: "",
        userName: "",
        nickName: "",
        password: "",
        passwordConfirm: "",
        status: 1,
        companyId: "",
        email: "",
        mobile: "",
        userType: "normal",
        userDesc: "",
        avatar: "",
        phone: "",
        email: "",
        address: "",
        grantRoles: [],
        grantActions: [],
        grantMenus: [],
        expireTime: "",
        isExpired: false,
        realname: ""
      },
      formDataRules: {
        oldPasswd: [
          { required: true, message: "原始密码不能为空", trigger: "blur" }
        ],
        newPasswd: [
          { required: true, message: "新密码不能为空", trigger: "blur" },
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        againPasswd: [
          { required: true, message: "新密码不能为空", trigger: "blur" },
          { required: true, validator: validateagainPass, trigger: "blur" }
        ]
      },
      formData: {
        oldPasswd: "",
        newPasswd: "",
        againPasswd: ""
      },
      userPic: "",
      columns: [
        {
          title: "序号",
          type: "index",
          width: 65,
          align: "center"
        },
        {
          title: "用户名",
          key: "username"
        },
        {
          title: "真实姓名",
          key: "realname"
        },
        // {
        //   title: '认证状态',
        //   slot: 'authstatus',
        //   key: 'status'
        // },
        {
          title: "邮箱",
          key: "email"
        },
        {
          title: "手机号",
          key: "phone"
        },
        {
          title: "账号状态",
          slot: "accountstatus",
          key: "status"
        },
        // {
        //   title: '所属部门',
        //   key: 'orgNameList',
        //   slot: 'orgNameList',
        //   width: 150
        // },
        {
          title: "注册时间",
          key: "createDate",
          slot: "createDate"
        },
        {
          title: "操作",
          slot: "action"
          // fixed: 'right',
        }
      ],
      handleStatus: "add",
      currentUseData: null,
      data: [],
      currentObj: {},
      orgTreedata: null,
      treedataType: null,
      areaTree: null,
      pwdModelVisible: false,
      selectuserInfo: {},
      showDetail: false,
      hasOrglist: [],
      hasDataTypelist: [],
      hasCitylist: []
    };
  },
  methods: {
    async getUserInfo() {
      store.dispatch("getUserInfo").then(res => {});
    },
    async handleModal(data, status) {
      this.modalVisible = true;
      this.current = this.forms[0];
      if (data) {
        let params = {
          userid: data.id
        };
        let res = await getUserByID(params);
        if (res.success) {
          this.formItem = res.data;
          this.formItem = Object.assign({}, this.formItem, data);
          this.userPic = res.data.userInfo.userPic;
          this.handleStatus = "edit";
          this.currentUseData = data;
          this.formItem.status = this.formItem.status == 1;
        }
      } else {
        this.handleStatus = "add";
        this.userPic = "";
        this.formItem = {};
        this.formItem.status = false;
      }

      this.setFormTitle(data, status);
      let orgparams = {
        name: "",
        code: "",
        authStatus: "",
        current: 1,
        size: 999
      };
      let orgres = await getOrglist(orgparams);
      this.currentObj.userOrgList = orgres.data.records;
      // orgres.data.records.forEach((item) => {
      //   if (item.isDepart =='0') {
      //     item.disabled = true;
      //   }
      // })
      if (this.formItem.userOrgList) {
        this.formItem.userOrgList.forEach(element => {
          orgres.data.records.forEach(item => {
            if (element.id == item.id && element.parentId != 0) {
              item.checked = true;
            }
          });
        });
      }
      this.orgTreedata = treeData(orgres.data.records);
      let datatypeparams = {
        name: "",
        code: "",
        authStatus: "",
        current: 1,
        size: 999
      };
      let datatyperes = await getDataType(datatypeparams);
      if (this.formItem.userDatatypeList) {
        this.formItem.userDatatypeList.forEach(element => {
          datatyperes.data.records.forEach(item => {
            if (element.id == item.id) {
              item.checked = true;
            }
          });
        });
      }
      this.currentObj.userDatatypeList = datatyperes.data.records;
      this.treedataType = treeData(datatyperes.data.records);

      let areaparams = {
        name: "",
        adCode: "",
        current: 1,
        size: 999
      };
      let areares = await getDistrict(areaparams);
      this.currentObj.userXzqhList = areares.data;
      if (this.formItem.userXzqhList) {
        this.formItem.userXzqhList.forEach(element => {
          areares.data.forEach(item => {
            if (element.id == item.id) {
              item.checked = true;
            }
          });
        });
      }
      this.areaTree = this.treeData(areares.data);
      if (status === "showDetail") {
        this.showDetail = true;
        // this.modalTitle = '用户详情'
        this.hasOrglist = createTree(this.formItem.userOrgList);
        this.hasDataTypelist = createTree(this.formItem.userDatatypeList);
        this.hasCitylist = createTree(this.formItem.userXzqhList, "pid");
        let nodes = [];
        let temparr = [];
        this.hasCitylist.map(item => {
          temparr = temparr.concat(
            this.findAllParent(item, areares.data, nodes)
          );
        });
        console.log(temparr);
        let hash = [];
        let parentNodes = temparr.reduceRight((item, index) => {
          hash[index.id] ? "" : (hash[index.id] = true && item.push(index));
          return item;
        }, []);
        // console.log(parentNodes);
        this.formItem.userXzqhList = this.formItem.userXzqhList.concat(
          parentNodes
        );
        // console.log(this.formItem.userXzqhList);
        this.hasCitylist = createTree(this.formItem.userXzqhList, "pid");
      } else {
        this.showDetail = false;
      }
    },
    setFormTitle(value, status) {
      switch (status) {
        case "add":
          this.modalTitle = "添加用户";
          break;
        case "edit":
          this.modalTitle = "编辑用户 - " + value.username;
          break;
        case "showDetail":
          this.modalTitle = value.username + " - 用户详情";
          break;
        default:
          break;
      }
    },
    treeData(data) {
      // debugger
      let cloneData = JSON.parse(JSON.stringify(data)); // 对源数据深度克隆
      let tree = cloneData.filter(father => {
        // 循环所有项
        let branchArr = cloneData.filter(child => {
          return father.id == child.pid; // 返回每一项的子级数组
        });
        if (branchArr.length > 0) {
          father.children = branchArr; // 如果存在子级，则给父级添加一个children属性，并赋值
        }
        return father.pid == ""; // 返回第一层
      });
      return tree; // 返回树形数据
    },
    findParent(node, parentNodes, tree) {
      for (let i = 0; i < tree.length; i++) {
        let item = tree[i];
        if (item.id === node.pid) {
          parentNodes.push(item);
          return;
        }
        if (item.children && item.children.length > 0) {
          this.findParent(node, parentNodes, item.children);
        }
      }
    },
    findAllParent(node, tree, parentNodes = [], index = 0) {
      if (!node || node.pid === "") {
        return;
      }
      this.findParent(node, parentNodes, tree);
      let parentNode = parentNodes[index];
      this.findAllParent(parentNode, tree, parentNodes, ++index);
      return parentNodes;
    },
    handleResetForm(form) {
      this.$refs[form].resetFields();
    },
    handleFormatError() {
      this.$Notice.warning({
        title: "上传文件格式错误",
        desc: "上传图片后缀不是'jpg','jpeg','png'"
      });
    },
    handleSuccess(res, file) {
      // debugger
      if (res.success) {
        this.userPic = window.globalUrl.IMG_PREFIX + "/" + res.data;
      }
    },
    beforeUpload() {},
    cancleAvatar() {
      this.userPic = "";
    },
    cancelSubmit() {
      this.modalVisible = false;
      this.$nextTick(() => {
        this.$refs["form1"].resetFields();
      });
    },
    handleReset() {
      const newData = {
        userId: "",
        userName: "",
        nickName: "",
        password: "",
        passwordConfirm: "",
        status: 1,
        companyId: "",
        email: "",
        mobile: "",
        userType: "normal",
        userDesc: "",
        avatar: "",
        grantRoles: [],
        grantMenus: [],
        grantActions: [],
        expireTime: "",
        isExpired: false
      };
      this.formItem = newData;
      // 重置验证
      this.forms.map(form => {
        this.handleResetForm(form);
      });
      this.current = this.forms[0];
      this.formItem.grantMenus = [];
      this.formItem.grantActions = [];
      this.modalVisible = false;
      this.saving = false;
    },
    handleSubmit() {
      this.$refs.form1.validate(async valid => {
        if (valid) {
          if (this.handleStatus == "add") {
            this.saving = true;
            let params = {
              user: {
                username: this.formItem.username,
                passwd: this.formItem.passwd,
                realname: this.formItem.realname,
                phone: this.formItem.phone,
                email: this.formItem.email,
                status: this.formItem.status ? 1 : 0,
                address: this.formItem.address,
                userPic: this.userPic,
                remark: this.formItem.remark
              },
              userOrgAdd: [],
              userDatatypeAdd: [],
              userXzquAdd: [],
              userOrgRemove: [],
              userDatatypeRemove: [],
              userXzquRemove: []
            };
            params.userOrgAdd = this.getArrid(
              this.$refs.orgTreedata.getCheckedNodes(true)
            );
            params.userXzquAdd = this.getArrid(
              this.$refs.areaTree.getCheckedNodes(true)
            );
            // params.userDatatypeAdd = this.getArrid(this.$refs.treedataType.getCheckedNodes())
            params.userOrgAdd.forEach((item, index) => {
              this.currentObj.userOrgList.forEach(itm => {
                if (item == itm.id && itm.isDepart == 0) {
                  params.userOrgAdd.splice(index, 1);
                }
              });
            });
            let res = await sysAdd(params);
            const { success, data } = res;
            if (success) {
              this.$Message.success(data);
              this.modalVisible = false;
              this.saving = false;
            } else {
              this.$Message.info(res.status.message);
              this.saving = false;
            }
          } else {
            this.saving = true;
            let params = {
              user: {
                id: this.formItem.id,
                username: this.formItem.username,
                realname: this.formItem.realname,
                phone: this.formItem.phone,
                email: this.formItem.email,
                status: this.formItem.status ? 1 : 0,
                address: this.formItem.address,
                userPic: this.userPic,
                remark: this.formItem.remark
              },
              userOrgAdd: [],
              userOrgRemove: [],
              userDatatypeAdd: [],
              userDatatypeRemove: [],
              userXzquAdd: [],
              userXzquRemove: []
            };
            // console.log(this.$refs.orgTreedata.getCheckedNodes(true))
            params.userOrgAdd = this.compareArrA(
              this.formItem.userOrgList,
              this.$refs.orgTreedata.getCheckedNodes(true)
            ).add;
            params.userOrgRemove = this.compareArrA(
              this.formItem.userOrgList,
              this.$refs.orgTreedata.getCheckedNodes(true)
            ).del;
            // params.userDatatypeAdd = this.compareArr(this.formItem.userDatatypeList, this.$refs.treedataType.getCheckedNodes(true)).add
            // params.userDatatypeRemove = this.compareArr(this.formItem.userDatatypeList, this.$refs.treedataType.getCheckedNodes(true)).del
            params.userXzquAdd = this.compareArr(
              this.formItem.userXzqhList,
              this.$refs.areaTree.getCheckedNodes(true)
            ).add;
            params.userXzquRemove = this.compareArr(
              this.formItem.userXzqhList,
              this.$refs.areaTree.getCheckedNodes(true)
            ).del;
            params.userOrgAdd.forEach((item, index) => {
              this.currentObj.userOrgList.forEach(itm => {
                if (item == itm.id && itm.isDepart == 0) {
                  params.userOrgAdd.splice(index, 1);
                }
              });
            });
            // params.userOrgRemove.forEach((item,index) => {
            //   this.formItem.userOrgList.forEach(itm => {
            //     if ( item == itm.id && itm.isDepart !=0 ) {
            //       params.userOrgRemove.splice(index,1);
            //     }
            //   })
            // })
            let res = await updateUser(params);
            const { success, data } = res;
            if (success) {
              this.$Message.success(data);
              this.modalVisible = false;
              this.saving = false;
            } else {
              this.$Message.info(res.status.message);
              this.saving = false;
            }
          }
          this.handleSearch();
        } else {
          this.current = "form1";
        }
      });
    },
    handleSubmitPwd() {
      this.$refs.form1.validate(async valid => {
        if (valid) {
          changePasswd;
          let params = {
            id: this.selectuserInfo.id,
            oldPasswd: this.formData.oldPasswd,
            newPasswd: this.formData.newPasswd
          };
          let res = await changePasswd(params);
          if (res.success) {
            this.pwdModelVisible = false;
            this.$Message.success("修改密码成功!");
          } else {
            this.$Message.info(res.status.message);
          }
        } else {
          this.$Message.info("请检验提交参数!");
        }
      });
    },
    getArrid(arr, id = "id") {
      let temparr = [];
      arr.forEach(element => {
        temparr.push(element[id]);
      });
      return temparr;
    },
    compareArr(befArr, aftArr, id = "id") {
      // debugger
      let resObj = {
        add: [],
        del: []
      };
      const cenObj = {};
      let beforeArr = [],
        afterArr = [];
      befArr.forEach(item => {
        beforeArr.push(item[id]);
      });
      aftArr.forEach(item => {
        afterArr.push(item.id);
      });
      for (let index = 0; index < beforeArr.length; index++) {
        cenObj[beforeArr[index]] = beforeArr[index];
      }
      for (let index = 0; index < afterArr.length; index++) {
        if (!cenObj[afterArr[index]]) {
          resObj.add.push(afterArr[index]);
        } else {
          delete cenObj[afterArr[index]];
        }
      }
      for (let k in cenObj) {
        resObj.del.push(k);
      }
      return resObj;
    },
    compareArrA(befArr, aftArr, id = "id") {
      let resObj = {
        add: [],
        del: []
      };
      const cenObj = {};
      let beforeArr = [],
        afterArr = [];
      befArr.forEach(item => {
        if (item.isDepart != "0") {
          beforeArr.push(item[id]);
        }
      });
      aftArr.forEach(item => {
        if (item.isDepart != "0") {
          afterArr.push(item.id);
        }
      });
      for (let index = 0; index < beforeArr.length; index++) {
        cenObj[beforeArr[index]] = beforeArr[index];
      }
      for (let index = 0; index < afterArr.length; index++) {
        if (!cenObj[afterArr[index]]) {
          resObj.add.push(afterArr[index]);
        } else {
          delete cenObj[afterArr[index]];
        }
      }
      for (let k in cenObj) {
        resObj.del.push(k);
      }
      return resObj;
    },
    renderorgTreeData(h, { root, node, data }) {
      // return h('span',data.name)
      if (data.isDepart == 0) {
        data.disabled = true;
        return h("span", data.name + "(组织)");
      } else {
        return h("span", data.name);
      }
      // return h('span',data.name)
      // if (data.isDepart == 0) {
      //   return h('span',data.name)
      // }
      // else {
      //   return h('span',[
      //     h('checkbox',{props:{ value :data.id},on:{'on-change':(val,node) =>{
      //       this.checkedOrg(val,data)
      //     }}}),
      //     h('span',data.name)
      //   ])
      // }
    },
    rendertreedataType(h, { root, node, data }) {
      return h("span", data.name);
    },
    renderareaTree(h, { root, node, data }) {
      return h("span", data.name);
    },
    checkedOrg(val, data) {
      console.log(val, data);
    },
    async handleSearch(page) {
      console.log(this.pageInfo);
      this.loading = true;
      if (page) {
        this.pageInfo.page = page;
      }
      let params = {
        username: this.pageInfo.username,
        phone: this.pageInfo.phone,
        orgId: this.pageInfo.orgId,
        status: this.pageInfo.status,
        authStatus: this.pageInfo.authStatus,
        current: this.pageInfo.page,
        size: this.pageInfo.limit
      };
      let res = await getUserlist(params);
      if (res.success) {
        this.data = res.data.records;
        this.pageInfo.total = res.data.total;
        this.loading = false;
      }
    },
    handlePage(current) {
      this.pageInfo.page = current;
      this.handleSearch();
    },
    handlePageSize(size) {
      this.pageInfo.limit = size;
      this.handleSearch();
    },
    handleClick(name, row) {
      this.selectuserInfo = row;
      switch (name) {
        case "deleteUser":
          this.$Modal.confirm({
            title: "确定删除该用户吗",
            onOk: async () => {
              let params = {
                id: row.id
              };
              let res = await delteUser(params);
              if (res.success) {
                this.pageInfo.page = 1;
                this.$Message.success("删除成功");
                this.handleSearch();
              } else {
                // this.pageInfo.page = 1
                this.$Message.error(res.status.message);
                this.handleSearch();
              }
            }
          });
          break;
        case "changepwd":
          this.$Modal.confirm({
            title: "确定重置密码吗",
            onOk: async () => {
              let params = {
                id: row.id
              };
              let res = await passwdReset(params);
              if (res.success) {
                this.pageInfo.page = 1;
                this.$Message.success("重置成功,默认密码为123456");
                this.handleSearch();
              }
            }
          });
          break;
      }
    },
    handleTabClick(name) {
      this.current = name;
      // if (this.handleStatus == 'edit') {
      //   this.handleModal(this.currentUseData);
      // }else {
      // this.handleModal();
      // }
    }
  },
  mounted: function() {
    this.handleSearch();
    // this.getUserInfo();
  }
};
</script>
<style lang="less">
.user-modal {
  .ivu-modal {
    .ivu-modal-body {
      max-height: 600px;
    }
  }
}
.user-tree {
  height: 575px;
  overflow-y: auto;
  padding-bottom: 10px;
}
.avaterUpload {
  .ivu-upload {
    div {
      width: 56px;
      height: 56px;
      border-radius: 28px;
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
.left {
  .ivu-form-item-label {
    padding-left: 10px;
  }
}
</style>
