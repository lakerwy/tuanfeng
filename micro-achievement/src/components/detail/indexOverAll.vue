<template>
  <!-- 审查任务详情页面 任务详情展示 -->
  <div class="quality-detail-left">
    <div class="title">
      <el-radio v-model="radio" label="1">图文一致性审查</el-radio>
    </div>
    <div class="content">
      <el-form
        label-width="120px"
        label-position="right"
        :model="form"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item label="审查意见：" prop="remarks">
          <el-input
            type="textarea"
            :rows="5"
            v-model.trim="form.remarks"
            placeholder="请输入审查意见。"
            :disabled="disabled"
          ></el-input>
        </el-form-item>
        <el-form-item label="附件说明：" prop="attachmentDescription">
          <el-input
            type="textarea"
            :rows="5"
            :disabled="disabled"
            v-model.trim="form.attachmentDescription"
            placeholder="请输入附件说明。"
          ></el-input>
        </el-form-item>
        <template v-if="!disabled">
          <el-form-item label="审查附件：" prop="uploadFile">
            <span v-if="isUpload" class="file">
              <el-checkbox-group
                v-show="false"
                v-model="form.uploadFile"
              ></el-checkbox-group>
              <el-upload
                class="upload-demo"
                action="#"
                :limit="1"
                :http-request="handleChange"
                :on-exceed="handleExceed"
                :on-change="uploadChange"
              >
                <el-button type="text">上传审查附件</el-button>
              </el-upload>
            </span>
            <span v-else>{{ form.fileList[0].name }}</span>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="审查附件下载：" prop="uploadFile">
            <el-button @click="handleDownLoad" type="text">{{
              upLoadName
            }}</el-button>
          </el-form-item>
        </template>
        <el-form-item label="审查结果：">
          <template v-if="isBtn">
            <el-button type="primary" @click="handleClickPass">通过</el-button>
            <el-button @click="handleClickNoPass">不通过</el-button>
          </template>
          <template v-else>
            <span v-show="isPass">通过</span>
            <span v-show="!isPass">不通过</span>
          </template>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getUploadDataList } from "../../api/auditTaskOthers";
import { downloadFile } from "@/js/utils/downLoad.js";
export default {
  props: ["dataList", "type"],
  data() {
    return {
      disabled: false,
      isBtn: true,
      isUpload: true,
      isPass: "",
      uploadDatas: "",
      radio: "1",
      file: {},
      form: {
        fileList: [],
        keyPointsId: "",
        uploadFile: "",
        remarks: "", //审查意见
        attachmentDescription: "", //附件说明
        status: ""
      },
      rules: {
        remarks: [
          { required: true, message: "请输入审查意见", trigger: "blur" }
        ],
        uploadFile: [
          { required: true, message: "请上传审查附件", trigger: "change" }
        ],
        attachmentDescription: [
          { required: true, message: "请输入附件说明", trigger: "blur" }
        ]
      },
      points: [],
      upLoadName: "",
      downLoadUrl: ""
    };
  },

  mounted() {
    if (this.type == "12") {
      this.getDataLIst();
    }
    if (
      this.$parent.approveReqList[0].status == 0 ||
      this.$parent.approveReqList[0].status == 1
    ) {
      this.form.fileList = this.$parent.fileList0;
      this.form.status = this.$parent.approveReqList[0].status;
      this.form.remarks = this.$parent.approveReqList[0].remarks;
      this.form.attachmentDescription = this.$parent.approveReqList[0].attachmentDescription;
    }
  },
  methods: {
    getDataLIst() {
      this.disabled = true;
      this.isBtn = false;
      // console.log(this.dataList);
      this.dataList.forEach(item => {
        // console.log(item);
        if (item.approveType == 0) {
          this.form.remarks = item.remarks;
          this.form.attachmentDescription = item.attachmentDescription;
          this.upLoadName = item.attachmentFileName;
          this.isPass = item.status;
          this.downLoadUrl = item.attachmentUrl;
        }
      });
    },
    handleDownLoad() {
      downloadFile(this.downLoadUrl, this.upLoadName);
    },
    handleChange(file) {
      this.uploadDatas = file.file;
      this.getUploadList();
    },
    uploadChange(file, fileList) {
      // console.log(file, fileList);
      this.form.fileList = fileList;
      this.form.uploadFile = file;
      this.$parent.fileList0 = fileList;
    },
    async getUploadList() {
      let formdata = new FormData();
      formdata.append("file", this.uploadDatas);
      let res = await getUploadDataList(formdata);
      this.form.attachmentId = res.data.data.attachmentId;
      this.$parent.approveReqList[0].attachmentId = this.form.attachmentId;

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
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$parent.approveReqList[0].status = 1;
          this.$parent.approveReqList[0].remarks = this.form.remarks;
          this.$parent.approveReqList[0].attachmentDescription = this.form.attachmentDescription;
          // console.log(this.$parent.approveReqList[0]);
          this.isBtn = false;
          this.isPass = true;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleClickNoPass() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$parent.approveReqList[0].status = 0;
          this.$parent.approveReqList[0].remarks = this.form.remarks;
          this.$parent.approveReqList[0].attachmentDescription = this.form.attachmentDescription;
          this.isBtn = false;
          this.isPass = false;
          // console.log(this.$parent.approveReqList[0]);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.quality-detail-left {
  min-width: 330px;
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
