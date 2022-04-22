<template>
  <div>
    <HeaderContent>
      <Form ref="searchForm" :model="pageInfo" inline :label-width="80">
        <FormItem label="专题名称" prop="name">
          <Input
            type="text"
            v-model="pageInfo.name"
            placeholder="请输入专题名称"
          />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSearch(1)">查询</Button>&nbsp;
        </FormItem>
      </Form>
    </HeaderContent>
    <Card shadow>
      <div class="search-con search-con-top">
        <div class="total">
          <img src="../../../assets/images/icon-total.png" alt="" srcset="" />
          <span class="text">当前数据：</span>
          <span class="num">{{ pageInfo.total }}条</span>
        </div>
        <div>
          <Button icon="md-add" type="primary" @click="handleModal({}, 'add')"
            >添加专题</Button
          >
          <!--<Button class="search-btn" type="primary" @click="handleModal({},'add')">
            <Icon type="ios-add" />
            <span>添加专题</span>
          </Button>-->
        </div>
      </div>
      <Table border :columns="columns" :data="data" :loading="loading">
        <template slot="action" slot-scope="{ row }">
          <div class="actionIcon">
            <Tooltip content="编辑" placement="top">
              <img
                src="../../../assets/images/bianji.png"
                alt=""
                srcset=""
                @click="handleModal(row, 'edit')"
              />
            </Tooltip>
            <Tooltip content="关联服务" placement="top">
              <img
                src="../../../assets/images/bangding.png"
                alt=""
                srcset=""
                @click="handleModal(row, 'editServe')"
              />
            </Tooltip>
            <Tooltip content="删除" placement="top">
              <img
                src="../../../assets/images/shanchu.png"
                alt=""
                srcset=""
                @click="handleTabClick(row, 'del')"
              />
            </Tooltip>
            <Tooltip content="专题申请" placement="top">
              <img
                src="../../../assets/images/shenqing.png"
                alt=""
                srcset=""
                @click="handleModalApply(row)"
              />
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
    <Modal
      v-model="modalVisible"
      :title="modalTitle"
      width="602"
      @on-cancel="handleReset"
      :mask-closable="false"
    >
      <div>
        <Form
          ref="form1"
          :model="formItem"
          label-position="right"
          :rules="formItemRules"
          :label-width="80"
        >
          <FormItem label="专题名称:" prop="subjectName">
            <Input
              v-model="formItem.subjectName"
              placeholder="请输入专题名称"
            />
          </FormItem>
        </Form>
        <div class="drawer-footer">
          <Button type="default" @click="handleReset">取消</Button>&nbsp;
          <Button type="primary" @click="handleSubmit" :loading="saving"
            >保存</Button
          >
        </div>
      </div>
    </Modal>
    <Modal
      v-model="servemodalVisible"
      :title="modalServiceTitle"
      width="602"
      @on-cancel="handleReset"
      :mask-closable="false"
    >
      <div>
        <Form
          ref="form2"
          :model="formItem"
          label-position="right"
          :rules="formItemRules"
          :label-width="80"
        >
          <FormItem label="" prop="subjectName">
            <Transfer
              :data="servicedata"
              :titles="['选择服务', '已选择服务']"
              :target-keys="targetKeys"
              :render-format="renderTransfer"
              @on-change="handleChange"
            >
            </Transfer>
          </FormItem>
        </Form>
        <div class="drawer-footer">
          <Button type="default" @click="handleReset">取消</Button>&nbsp;
          <Button type="primary" @click="handleServeSubmit" :loading="saving"
            >保存</Button
          >
        </div>
      </div>
    </Modal>
    <Modal
      v-model="applymodalVisible"
      :title="applymodalTitle"
      width="602"
      @on-cancel="handleResetApply"
      :mask-closable="false"
    >
      <div>
        <Form
          ref="form3"
          :model="formItem"
          label-position="right"
          :rules="formItemRules"
          :label-width="80"
        >
          <FormItem label="结束时间:" prop="date_end">
            <DatePicker
              date="yyyy-MM-dd"
              :options="endOptions"
              v-model="formItem.date_end"
              type="date"
              placeholder="请输入结束时间"
              @on-change="handleEndTime"
            ></DatePicker>
            <Button
              class="apply"
              type="primary"
              :loading="saving"
              @click="handleApply"
              >申请</Button
            >
          </FormItem>
        </Form>
        <div>
          <Table
            border
            :columns="columnsApply"
            :data="dataApply"
            :loading="loading"
          >
          </Table>
          <Page
        transfer
        :total="total"
        :current="query.current"
        :page-size="query.page"
        show-elevator
        show-total
        @on-change="handlePageApply"
        @on-page-size-change="handlePageSizeApply"
      ></Page>
        </div>
        <div class="drawer-footer">
          <Button type="default" @click="handleResetApply">取消</Button>&nbsp;
          <Button type="primary" @click="handleSubmitApply" :loading="saving"
            >保存</Button
          >
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import HeaderContent from "@/components/header-content/index";
import {
  getpxSubject,
  addpxSubject,
  updatepxSubject,
  getpxSubjectServices,
  updatepxSubjectRelation,
  delpxSubject,
  ApplypxSubject,
  getServiceList,
  ApplypxSubjectList
} from "@/api/serveiceRegist";

export default {
  name: "SystemRole",
  components: {
    HeaderContent
  },
  filters: {
    dateTime: function(val) {
      const dateee = new Date(val).toJSON();
      let date = new Date(+new Date(dateee) + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, " ")
        .replace(/\.[\d]{3}Z/, "");
      return date;
    }
  },
  data() {
    const validateInput = (rule, value, callback) => {
      if (!this.checkSpecialKey(value)) {
        callback(new Error("不能含有特殊字符!"));
      } else {
        callback();
      }
    };
    return {
      endOptions: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now();
        }
      },
      loading: false,
      modalVisible: false,
      applymodalVisible: false,
      servemodalVisible: false,
      modalTitle: "",
      modalServiceTitle: "",
      applymodalTitle: "",
      saving: false,
      current: "form1",
      forms: ["form1"],
      selectApis: [],
      selectMenus: [],
      pageInfo: {
        total: 0,
        page: 1,
        limit: 10
      },
      formItemRules: {
        subjectName: [
          { required: true, message: "专题名称不能为空", trigger: "blur" },
          {
            required: true,
            min: 2,
            max: 15,
            message: "专题名称长度为2-15个字符",
            trigger: "blur"
          },
          {
            required: true,
            pattern: /^[^\s]*$/,
            message: "专题名称不能输入空格",
            trigger: "blur"
          },
          { required: true, validator: validateInput, trigger: "blur" }
        ],
        date_end: [
          { required: true, message: "结束时间不能为空", trigger: "blur" }
        ]
      },
      formItem: {
        subjectName: "",
        date_end: ""
      },
      handleStatus: null,
      columns: [
        {
          title: "序号",
          type: "index",
          width: 65,
          align: "center"
        },
        {
          title: "专题名称",
          key: "subjectName"
        },
        // {
        //   title: '专题ID',
        //   key: 'subjectId'
        // },
        {
          title: "操作",
          slot: "action"
        }
      ],
      columnsApply: [
        {
          title: "序号",
          type: "index",
          width: 65,
          align: "center"
        },
        {
          title: "申请用户",
          key: "consumers",
          width: 90,
          align: "center"
        },
        {
          title: "token",
          key: "token",
          align: "center",
          tooltip: true
        },
        {
          title: "有效期",
          key: "endTime",
          width: 110,
          align: "center"
        }
      ],
      rowInfo: {
        subjectName: ""
      },
      data: [],
      dataApply: [],
      currentSubid: null,
      targetKeys: [],
      servicedata: [],
      rowData: "",
      query: {
        current: 1,
        size: 10,
        id: ""
      },
      total:0
    };
  },
  mounted: function() {
    this.handleSearch();
  },
  methods: {
    // 点击申请按钮
    handleApply() {
      this.$refs.form3.validate(async valid => {
        if (valid) {
          this.saving = true;
          let res = await ApplypxSubject(
            this.rowData.subjectId,
            this.formItem.date_end
          );
          const { code } = res;
          if (code === 59007) {
            this.$Message.success(res.message);
            // 获取token表格信息
            this.getTokenList();
          } else {
            this.$Message.warning(res.message);
          }
          this.saving = false;
        }
      });
    },
    // 获取token表格信息
    async getTokenList() {
      this.loading = true;
      this.query.id=this.rowData.subjectId
      let params = this.query;
      let res = await ApplypxSubjectList(params);
      const { code, body } = res;
      if (code === 59008) {
        // this.$Message.success(res.message);
        body.records.forEach(item=>{
          item.endTime=item.endTime.match(/(\S*)T/)[1]
        })
        // 获取token表格信息
        this.dataApply = body.records;
        this.total=body.total
      } else {
        this.$Message.warning(res.message);
      }
      this.loading = false;
    },
    // 点击提交按钮
    handleSubmitApply() {
      this.applymodalVisible = false;
    },
    handleResetApply() {
      this.applymodalVisible = false;
      this.$refs.form3.resetFields();
    },
    handleEndTime(value) {
      if (value) {
        this.formItem.date_end = `${value} 00:00:00`;
      } else {
        this.formItem.date_end = "";
      }
    },
    checkSpecialKey(str) {
      var specialKey =
        "[`~!#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'";
      for (var i = 0; i < str.length; i++) {
        if (specialKey.indexOf(str.substr(i, 1)) != -1) {
          return false;
        }
      }
      return true;
    },
    renderTransfer(item) {
      return item.service_name;
    },
    handleChange(newTargetKeys, direction, moveKeys) {
      this.targetKeys = newTargetKeys;
    },
    async initServiceList(data) {
      let params = {
        service_name: "",
        page: 1,
        rows: 999,
        status: "",
        create_date_begin: "",
        create_date_end: "",
        is_auth: ""
      };
      let res = await getServiceList(params);
      res.rows.forEach(item => {
        item.key = item.id;
      });
      this.servicedata = res.rows;
      let ressel = await getpxSubjectServices({
        subjectId: data.subjectId
      });
      if (ressel.code === 59001) {
        if (ressel.body) {
          ressel.body.forEach(item => {
            this.targetKeys.push(item.id);
          });
        } else {
          this.targetKeys = [];
        }
      }
    },
    handleModal(data, status) {
      if (status === "editServe") {
        this.servemodalVisible = true;
        this.currentSubid = data.subjectId;
        this.initServiceList(data);
        this.modalServiceTitle = "编辑专题服务";
      } else {
        this.modalVisible = true;
        this.handleStatus = status;
        this.formItem = Object.assign({}, data);
        this.modalTitle = status === "edit" ? "编辑专题" : "新增专题";
      }
    },
    handleModalApply(data) {
      this.rowData = data;
      this.applymodalVisible = true;
      this.applymodalTitle = "专题申请";
      this.getTokenList();
    },
    handleResetForm(form) {
      this.$refs[form].resetFields();
    },
    handleTabClick(data, status) {
      if (status === "del") {
        this.$Modal.confirm({
          title: `确定删除${data.subjectName}吗？`,
          onOk: async () => {
            let params = {
              id: data.id
            };
            let res = await delpxSubject(params);
            if (res.code === 59006) {
              this.$Message.success("删除成功");
              this.handleSearch(1);
            } else {
              this.$Message.error(res.message);
            }
          }
        });
      }
    },
    handleReset() {
      const newData = {
        subjectName: ""
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
      this.servemodalVisible = false;
      this.saving = false;
    },
    handleSubmit() {
      this.$refs.form1.validate(async valid => {
        if (valid) {
          this.saving = true;
          if (this.handleStatus === "edit") {
            let params = {
              id: this.formItem.id,
              subjectName: this.formItem.subjectName,
              code: this.formItem.code,
              show_index: this.formItem.show_index,
              remark: this.formItem.remark
            };
            let res = await updatepxSubject(params);
            const { code } = res;
            if (code === 59002) {
              this.$Message.success("保存成功");
              this.handleReset();
              this.handleSearch();
            } else {
              this.$Message.warning(res.msg);
            }
            this.saving = false;
          } else {
            let params = {
              subjectName: this.formItem.subjectName
            };
            let res = await addpxSubject(params);
            const { code } = res;
            if (code === 59003) {
              this.$Message.success("保存成功");
              this.handleReset();
              this.handleSearch();
            } else {
              this.$Message.warning(res.message);
            }
            this.saving = false;
          }
        }
      });
    },
    async handleServeSubmit() {
      let params = {
        serviceId: this.targetKeys,
        subjectId: this.currentSubid
      };
      let res = await updatepxSubjectRelation(params);
      if (res.code === 59004) {
        this.$Message.success("关联专题服务成功");
        this.servemodalVisible = false;
      } else {
        this.$Message.warning(res.status.message);
      }
    },
    async handleSearch(page) {
      if (page) {
        this.pageInfo.page = page;
      }
      this.loading = true;
      let params = {
        page: this.pageInfo.page || 1,
        size: this.pageInfo.limit || 10,
        name: this.pageInfo.name || ""
      };
      let res = await getpxSubject(params);
      const { code, body } = res;
      if (code === 5900) {
        this.data = body.records;
        this.pageInfo.total = body.total;
        this.loading = false;
      }
    },
    handlePage(current) {
      this.pageInfo.page = current;
      this.handleSearch();
    },
    handlePageApply(current) {
      this.query.current = current;
      this.getTokenList();
    },
    handlePageSize(size) {
      this.pageInfo.limit = size;
      this.handleSearch();
    },
    handlePageSizeApply(size) {
      this.query.page = size;
      this.getTokenList();
    }
  }
};
</script>

<style lang="less" scoped>
.apply {
  margin-left: 20px;
}
</style>
