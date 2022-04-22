<template>
  <!-- 成果质检页面 审查任务管理中心 -->
  <div
    class="audit-container"
    v-loading="loading"
    element-loading-text="文件上传中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div class="p-top">
      <div class="query">
        <el-form
          :model="form"
          :inline="true"
          label-width="120px"
          label-position="left"
        >
          <el-form-item label="行政区级别：">
            <el-select
              clearable
              v-model="form.regionLevel"
              @change="changeRegions"
            >
              <el-option
                v-for="item in levelOption"
                :key="item.name"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.regionLevel" label="行政区：">
            <el-select clearable v-model="form.regions">
              <el-option
                v-for="item in regionOptionsName"
                :key="item.name"
                :label="item.name"
                :value="item.adCode"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态：">
            <el-select clearable v-model="form.approveStatus">
              <el-option
                v-for="item in checkOptions"
                :key="item.name"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input clearable
              v-model="form.keyword"
              placeholder="请输入任务名称关键字查询"
            >
              <!-- <i slot="suffix">
                <img
                  src="../../assets/imgs/query.png"
                  alt
                  class="select-icon"
                />
              </i> -->
            </el-input>
          </el-form-item>
          <el-button style="margin-left: 20px;" type="primary" @click="query"
            >查询</el-button
          >
          <el-button style="margin-left: 20px;" @click="handleReset"
            >重置</el-button
          >
        </el-form>
      </div>
    </div>
    <div class="middle" style="margin-top:20px">
      <el-menu
        :default-active="planType"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="0">总体规划</el-menu-item>
        <el-submenu index="1">
          <template slot="title">详细规划</template>
          <el-menu-item index="3">村庄规划</el-menu-item>
          <el-menu-item index="2">控制性详细规划</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div class="content p-bottom">
      <div class="con-top">
        <div class="total">
          <img src="../../assets/imgs/icon-total.png" alt="" />
          <span
            >当前数据：<span>{{ total }} 条</span></span
          >
        </div>
        <el-button class="add-btn" type="primary" @click="addTask">
          <img src="../../assets/imgs/add-task.png" alt="" />
          <span>新建任务</span>
        </el-button>
      </div>
      <div class="table">
        <el-table
          border
          height="450"
          stripe
          :data="tableData"
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column
            type="index"
            label="标识码"
            width="80px"
          ></el-table-column>
          <el-table-column
            prop="yearVersions"
            label="年份"
            width="100px"
          ></el-table-column>
          <el-table-column
            prop="regionName"
            label="行政区名称"
          ></el-table-column>
          <el-table-column prop="taskName" label="任务名称"></el-table-column>
          <el-table-column prop="orgName" label="组织单位"></el-table-column>
          <el-table-column
            prop="levelsName"
            label="规划层级"
            width="110"
          ></el-table-column>
          <el-table-column prop="unitsName" label="编制单位"></el-table-column>
          <el-table-column prop="createTime" label="创建日期"></el-table-column>
          <el-table-column
            prop="versions"
            label="版本号"
            width="80px"
          ></el-table-column>
          <el-table-column prop="success" label="审核状态" width="100px">
            <template v-slot="scope">
              <img
                v-if="scope.row.approveStatus == '1'"
                class="table-icon"
                src="../../assets/imgs/icon-pass.png"
                alt=""
              />
              <img
                v-else-if="scope.row.approveStatus == '2'"
                class="table-icon"
                src="../../assets/imgs/checking2.png"
                alt=""
              />
              <img
                v-else
                class="table-icon"
                src="../../assets/imgs/icon-failed.png"
                alt=""
              />
              <span>{{ scope.row.approveStatusName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <template>
                <el-button
                  v-if="scope.row.approveStatus !== 2"
                  type="text"
                  @click="handleView(scope.row)"
                  >预览</el-button
                >
                <el-button
                  v-if="scope.row.canApprove == 1"
                  type="text"
                  @click="showDetail(scope.row)"
                  >审核</el-button
                >
                <el-upload
                  v-if="scope.row.approveStatus !== 1"
                  class="upload-demo"
                  action="#"
                  :http-request="handleChange"
                  :before-upload="beforeUpload"
                  :show-file-list="false"
                >
                  <el-button type="text" @click="uploadFiles(scope.row)"
                    >上传文件</el-button
                  >
                </el-upload>
                <el-popover
                  placement="top"
                  title="确认删除吗？"
                  width="200"
                  trigger="click"
                  v-model="scope.row.visible"
                >
                  <div style="text-align: right; margin: 0">
                    <el-button
                      size="mini"
                      type="text"
                      @click="scope.row.visible = false"
                      >取消</el-button
                    >
                    <el-button
                      type="primary"
                      size="mini"
                      @click="deleteTask(scope.row)"
                      >确定</el-button
                    >
                  </div>
                  <el-button style="margin:0 5px" type="text" slot="reference"
                    >删除</el-button
                  >
                </el-popover>

                <!-- <el-button type="text" @click="deleteTask(scope.row)"
                  >删除</el-button
                > -->
                <el-button
                  v-if="scope.row.approveStatus !== 2"
                  type="text"
                  @click="showReport(scope.row)"
                  >查看审核报告</el-button
                >
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager">
        <el-pagination
          background
          @size-change="handleSizeChanges"
          @current-change="handleCurrentChanges"
          :current-page.sync="queryOthers.pageIndex"
          :page-size="queryOthers.pageSize"
          layout="prev, pager, next, sizes, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>

    <el-dialog title="提 示" :visible.sync="centerDialogVisible" width="20%" center>
      <span>
        是否直接通过审核
        <img src="../../assets/imgs/wh.png" alt="">
        </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleFalse">否</el-button>
        <el-button type="primary" @click="handleTrue">是</el-button>
      </span>
    </el-dialog>

    <!-- 新增任务弹窗 -->
    <el-dialog
      class="task-dialog"
      title="新增任务"
      :visible.sync="dialogVisible"
      width="34%"
      top="21vh"
      @close="handleClose"
    >
      <el-form
        ref="submitform"
        label-position="right"
        label-width="120px"
        :model="form"
        :rules="formRule"
      >
        <el-form-item label="成果年份" prop="yearVersions">
          <el-date-picker
            v-model="form.yearVersions"
            type="year"
            placeholder="选择成果年份"
            value-format="yyyy"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="form.taskName"></el-input>
        </el-form-item>

        <el-form-item label="组织单位" prop="orgCode">
          <el-select v-model="form.orgCode" style="width: 100%;">
            <el-option
              v-for="item in orgList"
              :key="item.name"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="编制单位" prop="unitsCode">
          <el-select v-model="form.unitsCode" style="width: 100%;">
            <el-option
              v-for="item in unitList"
              :key="item.sourceName"
              :label="item.sourceName"
              :value="item.sourceCode"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="规划层级" prop="levels">
          <el-select
            v-model="form.levels"
            style="width: 100%;"
            @change="changeRegion"
          >
            <el-option
              v-for="item in planOption"
              :key="item.name"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="form.levels == 2 || form.levels == 3"
          label="行政区名称"
          prop="region"
        >
          <el-select v-model="form.region" style="width: 100%;">
            <el-option
              v-for="item in regionOptionsName"
              :key="item.name"
              :label="item.name"
              :value="item.adCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="form = {}">重 置</el-button>
        <el-button type="primary" @click="submitData">提 交</el-button>
      </span>
    </el-dialog>


  <!-- 查看审查报告弹窗 -->
    <el-dialog
      class="task-dialog"
      title="查看审查报告"
      :visible.sync="dialogVisibleReport"
      width="60%"
    >
      <div class="pdf-con ">
      <iframe :src="pdfSrc" width="100%" height="99%" frameborder="0"></iframe>
    </div>
    </el-dialog>

  </div>
</template>

<script>
import Cookie from "js-cookie";
import {
  getTaskLists,
  addTask,
  deleteTaskById,
  WriteDataPackageFileMetaData
} from "../../api/auditTask";

import { queryArcGISProperties } from "../../js/map/arcgis";
import { getRegions } from "../../js/map/region";
import { dateFormatter } from "../../js/utils/util";
import {
  getTaskOtherLists,
  orgList,
  unitList,
  getAddOtherLists,
  deleteById,
  getNodeById,
  uploadDataList,
  getTrueStateList
} from "../../api/auditTaskOthers.js";
import { getReportList } from "../../api/auditTaskOthers.js";
import fileDownload from "js-file-download";
export default {
  data() {
    return {
      pickerOptions: {
        disabledDate(year) {
          return year.getTime() > Date.now() - 8.64e7;
        }
      },
      // activeIndex: "0",
      loading: false,
      pId: "",
      orgList: [], //组织单位下拉列表
      unitList: [], //编制单位下拉列表
      queryOthers: {
        pageSize: 10,
        pageIndex: 1,
        taskType: 0,
        approveStatus: null, //是否通过0未通过1通过2审核中
        levels: null, //规划层级(2：县级;3：市级)
        region: null, //行政区划代码/编号
        taskName: null //任务名称
      },
      pdfSrc: 'http://baidu.com',
      form: {},
      planType: "",
      planTypes: [
        { label: "国土空间总体规划", value: 0 },
        { label: "专项规划", value: 1 },
        { label: "详细规划", value: 2 },
        { label: "村庄规划", value: 3 }
      ],
      regionOptionsName: [],
      levelOptions: [
        { name: "县级", value: 0 },
        { name: "市级", value: 1 }
      ],
      levelOption: [
        { name: "县级", value: 2 },
        { name: "市级", value: 3 }
      ],
      planOptions: [
        { name: "县级", value: 0 },
        { name: "乡镇", value: 1 }
      ],
      planOption: [
        { name: "县级", value: 2 },
        { name: "乡镇", value: 3 }
      ],
      checkOptions: [
        { name: "通过", value: 1 },
        { name: "未通过", value: 0 },
        { name: "未审核", value: 2 }
      ],
      townList: [],
      countryList: [],
      regionOptions: [
        // { name: '团风县', value: 0 }, { name: '上巴河镇',value: 1 }, { name: '回龙山镇', value: 2 },
        // { name: '方高坪镇', value: 3 }, { name: '总路嘴镇',value: 4 }, { name: '马曹庙镇', value: 5 },
        // { name: '淋山河镇', value: 6 }, { name: '但店镇',value: 7 }, { name: '杜皮乡', value: 8 },
        // { name: '贾庙乡', value: 9 },
      ],
      keyword: "",
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      dialogVisibleReport: false,
      form: {},
      formRule: {
        yearVersions: [
          { required: true, message: "请选择年份", trigger: "change" }
        ],
        taskName: [
          { required: true, message: "请输入任务名称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        organizationCode: [
          { required: true, message: "请输入组织单位", trigger: "blur" }
        ],
        orgCode: [
          { required: true, message: "请选择组织单位", trigger: "blur" }
        ],
        unitsCode: [
          { required: true, message: "请输入编制单位", trigger: "blur" }
        ],
        levels: [
          { required: true, message: "请选择规划级别", trigger: "change" }
        ],
        region: [
          { required: true, message: "请选择行政区名称", trigger: "change" }
        ]
      },
      headers: {
        "J-Token": Cookie.get("j_s_id")
      },
      // ${window.globalUrl.RESOURCE_API}
      uploadUrl: `${window.globalUrl.RESOURCE_API}/v1/task/zip`,
      uploadData: {},
      taskObjId: "",
      uploadDatas: "",
      centerDialogVisible: false,
      id: ""
    };
  },

  created() {
    this.initRegions();
  },
  mounted() {
    if (sessionStorage.getItem("planTypeResults")) {
      this.planType = JSON.parse(sessionStorage.getItem("planTypeResults"));
      this.queryOthers.taskType = JSON.parse(sessionStorage.getItem("planTypeResults"));
    } else {
      this.planType = "0";
      this.queryOthers.taskType = 0;
    }
    this.getOthersList();
    this.getOrgList(); //新建任务-组织单位下拉列表选择框
    this.getUnitList(); //新建任务-编制单位下拉列表选择框
  },
  methods: {
    handleSelect(key, keyPath) {
      // console.log(key, keyPath);
      sessionStorage.setItem("planTypeResults", JSON.stringify(key));
      this.planType = key;
      this.queryOthers.taskType = this.planType;
      this.getOthersList();
    },
    showReport(val) {
      // console.log(val)
      this.dialogVisibleReport=true
      this.pdfSrc=val.resultDocUrl
      // this.getReport(val);
    },
    // 获取报告下载接口数据
    async getReport(val) {
      let params = val.id;
      let res = await getReportList(params);
      // console.log(res);
      if (res.status === 200) {
        this.$notify({
          title: "成功",
          message: "正在下载审查报告，请稍后...",
          type: "success"
        });
        fileDownload(res.data, "成果审核结果附件.doc");
      } else {
        this.$notify.error({
          title: "错误",
          message: "审查报告下载失败，请联系管理员"
        });
      }
    },
    // 行政区名称下拉列表
    async getRegionData() {
      let res = await getNodeById(this.pId);
      this.regionOptionsName = res.data.data;
    },
    // 组织单位下拉列表
    async getOrgList() {
      let res = await orgList();
      this.orgList = res.data.data;
    },
    // 编制单位下拉列表
    async getUnitList() {
      let res = await unitList();
      this.unitList = res.data.data;
    },
    // 除总体规划外的其它列表
    async getOthersList() {
      this.queryOthers.region = this.form.regions;
      this.queryOthers.taskName = this.form.keyword;
      this.queryOthers.approveStatus = this.form.approveStatus;
      let params = this.queryOthers;
      let res = await getTaskOtherLists(params);
      let { records, total } = res.data.data;
      if (res.status === 200) {
        this.tableData = records;
        this.total = total;
      }
    },
    query() {
      // 查询
      this.getOthersList();
    },
    async initRegions() {
      // 初始化行政区域列表
      this.townList = await getRegions(
        window.globalUrl.districts.town.url,
        window.globalUrl.districts.town.id
      );
      this.countryList = await getRegions(
        window.globalUrl.districts.county.url,
        window.globalUrl.districts.county.id
      );
    },
    // 主页面-选择行政区层级
    changeRegions(val) {
      // if (val === 2) {
      //   this.queryOthers.levels = 3;
      //   this.pId = "15_0";
      // } else {
      //   this.queryOthers.levels = 2;
      //   this.pId = "0_15";
      // }
      // this.getRegionData();
            if (val === 2) {
        this.queryOthers.levels = 3;
        this.pId = "15_0";
        this.getRegionData();
      } else if(val===3) {
        this.queryOthers.levels = 2;
        this.pId = "0_15";
      this.getRegionData();
      }else{
        this.form.regions=""
        this.regionOptionsName=[]
      }
    },
    // 新建任务--选择规划层级
    changeRegion(val) {
      if (val === 2) {
        this.pId = "0_15";
      } else {
        this.pId = "15_0";
      }
      this.getRegionData();
    },
    async changeRegionLevel(val) {
      // 切换行政区级别
      if (val === 0) {
        this.regionOptions = this.townList;
      } else {
        this.regionOptions = this.countryList;
      }
    },
    handleSizeChanges(val) {
      // 切换每页显示条数
      this.queryOthers.pageIndex = 1;
      this.queryOthers.pageSize = val;
      this.getOthersList();
    },
    uploadFiles(val) {
      this.taskObjId = val.id;
    },
    beforeUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "zip";
      const extension2 = testmsg === "rar";
      if (!extension && !extension2) {
        this.$notify({
          title: "上传失败",
          message: "上传文件只能是 zip、rar格式!",
          type: "warning"
        });
      }
      return extension || extension2;
    },
    handleChange(file) {
      this.uploadDatas = file.file;
      this.getUploadList();
    },
    async getUploadList() {
      this.loading = true;
      let formdata = new FormData();
      formdata.append("file", this.uploadDatas);
      formdata.append("taskObjId", this.taskObjId);
      let res = await uploadDataList(formdata);
      if (res.data.msg == "执行成功") {
        this.loading = false;
        this.$notify({
          title: "上传成功",
          message: res.data.data,
          type: "success"
        });
        this.getOthersList();
      } else {
        this.loading = false;
        // console.log(res.data);
        this.$notify.error({
          title: "上传失败",
          message: res.data.msg
        });
      }
    },
    uploadFile(item) {
      this.uploadData = {
        taskId: item.row.taskId,
        type: "zip"
      };
      // this.uploadUrl = `htpp:192.168.99.132:13800/v1/task/zip?taskId=${this.uploadData.taskId}?type=zip`
    },

    handleCurrentChanges(val) {
      // 切换当前页
      this.queryOthers.pageIndex = val;
      this.getOthersList();
    },
    // 行政区格式化
    regionFormatter(row, column) {
      let regions = this.countryList.concat(this.townList);
      let res = regions.filter(item => {
        return (item.code = row.area);
      });
      return res.length > 0 ? res[0].name : "";
    },
    // 规划层级格式化
    planLevelFormatter(row, column) {
      let res = this.planOptions.filter(item => {
        return item.value === row.levels;
      });
      return res[0].name;
    },
    // 日期格式化
    dateFormatter(row, column) {
      return dateFormatter(row.createTime);
    },
    addTask() {
      // 新建任务
      this.dialogVisible = true;
    },
    showDetail(val) {
      // console.log(val)
      sessionStorage.setItem("rowData", JSON.stringify(val));
      // console.log(JSON.parse(sessionStorage.getItem("rowData")))
      this.centerDialogVisible = true;
    },
    handleFalse() {
      this.centerDialogVisible = false;
      // console.log(this.planType);
      // 查看审核任务的详情
      if (this.planType === "0") {
        this.$router.push({ name: "detail", params: { type: 11 } });
        // } else if (this.planType === "2") {
        //   this.$router.push({ name: "specialIndex" });
      } else if (this.planType === "2") {
        this.$router.push({ name: "detailIndex", params: { type: 11 } });
      } else if (this.planType === "3") {
        this.$router.push({ name: "villageIndex", params: { type: 11 } });
      }
    },
    handleView(val) {
      // console.log(val)
      sessionStorage.setItem("rowData", JSON.stringify(val));
      if (this.planType === "0") {
        this.$router.push({ name: "detail", params: { type: 12 } });
        // } else if (this.planType === "2") {
        //   this.$router.push({ name: "specialIndex" });
      } else if (this.planType === "2") {
        this.$router.push({ name: "detailIndex", params: { type: 12 } });
      } else if (this.planType === "3") {
        this.$router.push({ name: "villageIndex", params: { type: 12 } });
      }
    },
    handleTrue() {
      this.centerDialogVisible = false;
      this.id = JSON.parse(sessionStorage.getItem("rowData")).id;
      this.getStatePass();
    },
    async getStatePass() {
      let params = {
        taskObjId: this.id
      };
      let res = await getTrueStateList(params);
      if ((res.data.msg = "执行成功")) {
        this.getOthersList();
      }
    },

    async deleteTask(row) {
      // 删除
      let res = await deleteById(row.id);
      let { data } = res;
      if (data.msg == "执行成功") {
        this.$message.success(data.msg);
        this.getOthersList();
      } else {
        this.$message.error("删除失败");
      }
    },
    handleClose() {
      // 弹窗关闭
      this.form = {};
      this.$refs.submitform.resetFields();
    },
    submitData() {
      // 提交数据
      this.$refs.submitform.validate(async valid => {
        if (valid) {
          this.form.taskType = this.planType;
          let params = this.form;
          // console.log(params)
          let res = await getAddOtherLists(params);
          console.log(res);
          if (res.data.code === 0) {
            this.$message.success("新增数据成功");
            this.dialogVisible = false;
            this.form = {};
            this.getOthersList();
          } else {
            this.$message.error(res.data.msg);
          }
        }
      });
    },
    handleReset() {
      this.form = {};
      this.regionOptionsName = [];
      this.queryOthers.levels = null;
      this.getOthersList();
    },

    async handleSuccess(res, file, filelist) {
      // 上传文件成功
      // TODO 调用万树明服务
      if (res.code === "4201") {
        let params = {
          datapackageid: res.content
        };
        let resData = await WriteDataPackageFileMetaData(params);
        const { code } = resData;
        if (code) {
          this.$message.success("上传成功！");
        } else {
          this.$message.error("上传失败！");
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 100%;
}
/deep/ .el-dialog--center .el-dialog__body {
  text-align: center;
}
/deep/ .el-form--inline .el-form-item__label {
  display: inline;
}
.pdf-con {
  height: 600px;
  background: #fff;
  // margin-right: 16px;
  overflow-y: auto;
}
.audit-container {
  background: #f5f5f5;
  height: 100%;
  .p-top {
    .select-icon {
      margin: 10px;
    }
    .el-input {
      margin-left: 10px;
      margin-right: 16px;
    }
  }
  .p-middle {
    margin: 21px 0;
    text-align: left;
    background: #ffffff;
    padding: 0 20px;
    height: 49px;
    line-height: 49px;
  }
  .p-bottom {
    padding: 18px 20px 0;
    overflow-y: auto;
  }
  .content {
    .con-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .total {
        img {
          vertical-align: middle;
          margin-bottom: 2px;
          margin-right: 12px;
        }
        span {
          span {
            color: #1890ff;
          }
        }
      }
      .add-btn {
        width: 102px;
        height: 42px;
        background-color: #1890ff;
        border-radius: 6px;
        padding: 0;
        img {
          margin-right: 7px;
          margin-bottom: 2px;
        }
      }
    }
    .table {
      margin-top: 11px;
      .table-icon {
        margin-right: 7px;
      }
    }
    .pager {
      text-align: right;
      margin-top: 25px;
      margin-bottom: 20px;
    }
  }

  .task-dialog {
    text-align: left;
  }

  .upload-demo {
    display: inline-block;
    margin: 0 5px 0 5px;
  }
}
</style>

<style lang="less">
.table .el-table td,
.el-table th {
  padding: 6px 0;
}
.task-dialog .el-dialog {
  border-radius: 12px;
}
</style>
