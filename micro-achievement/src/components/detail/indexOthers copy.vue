<template>
  <!-- 审查任务详情页面 任务详情展示 -->
  <div class="quality-detail-left">
    <div class="title">
      <el-radio v-model="radio" label="1">{{ currentTab.label }}</el-radio>
    </div>
    <div class="content">
      <el-form label-width="120px" label-position="right" :model="form">
        <el-form-item label="审查要点：">
          <el-select
            style="width: 100%;"
            v-model="form.keyPointsId"
            placeholder="请选择审查要点"
          >
            <el-option
              v-for="(item, index) in points"
              :key="index"
              :label="item.pointsName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审查意见：">
          <el-input
            type="textarea"
            :rows="5"
            v-model="form.remarks"
            placeholder="请输入审查意见。"
          ></el-input>
        </el-form-item>
        <el-form-item label="审查附件：">
          <span class="file">
            <el-upload
              class="upload-demo"
              action="#"
              :limit="1"
              :http-request="handleChange"
              :on-exceed="handleExceed"
            >
              <el-button type="text">上传审查附件</el-button>
            </el-upload>
          </span>
        </el-form-item>
        <el-form-item label="附件说明：">
          <el-input
            type="textarea"
            :rows="5"
            v-model="form.attachmentDescription"
            placeholder="请输入附件说明。"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="机审结果：">
          <el-input type="textarea" :rows="15" v-model="form.result"></el-input>
        </el-form-item> -->
        <el-form-item label="审查结果：">
          <el-button type="primary" @click="handleClickPass">通过</el-button>
          <el-button @click="handleClickNoPass">不通过</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  keyPointsList,
  getUploadDataList,
  getSubmitList
} from "../../api/auditTaskOthers";
export default {
  data() {
    return {
      uploadDatas: "",
      radio: "1",
      form: {
        keyPointsId: "",
        remarks: "",
        attachmentDescription: "",
        status: "",
        taskObjId: JSON.parse(sessionStorage.getItem("rowData")).id
      },
      points: []
    };
  },
  props: {
    currentTab: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    this.getSelectDataList();
  },
  methods: {
    handleChange(file) {
      this.uploadDatas = file.file;
      this.getUploadList();
    },
    async getUploadList() {
      let formdata = new FormData();
      formdata.append("file", this.uploadDatas);
      let res = await getUploadDataList(formdata);
      this.form.attachmentId = res.data.data.attachmentId;
      if (res.data.msg == "执行成功") {
        this.$message.success("上传成功");
      } else {
        this.$message.error("上传失败！");
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    handleClickPass() {
      this.form.status = 1;
      this.getAudit();
    },
    handleClickNoPass() {
      this.form.status = 0;
      this.getAudit();
    },
    async getAudit() {
      let params = this.form;
      let res = await getSubmitList(params);
      if ((res.data.msg = "执行成功")) {
        this.$router.push({ name: "taskManage" });
      }
    },
    async getSelectDataList() {
      let res = await keyPointsList();
      // console.log(res);
      if ((res.data.msg = "执行成功")) {
        this.points = res.data.data;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.quality-detail-left {
  width: 30%;
  // width: 479px;
  height: 100%;
  background: #fff;
  .title {
    width: 100%;
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
    border-bottom: 1px solid #e8e8e8;
  }
  .content {
    padding-top: 37px;
    padding-right: 31px;
    height: calc(100% - 51px);
    overflow-y: auto;
    .el-form-item:last-child {
      margin-bottom: 0;
    }
    .file {
      font-size: 14px;
      color: #1890ff;
      margin-right: 15px;
      cursor: pointer;
      .upload-demo {
        display: inline-block;
      }
    }
  }
}
</style>
