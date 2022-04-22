<template>
  <div class="content">
    <el-form
      class="content-form"
      :inline="true"
      label-width="100px"
      label-position="right"
      :model="form"
      :rules="rules"
      ref="ruleForm"
    >
      <el-form-item label="审查意见：" prop="remarks">
        <el-input
          type="textarea"
          :rows="5"
          :disabled="disabled"
          v-model.trim="form.remarks"
          placeholder="请输入审查意见。"
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
      <el-form-item label="机审结果：">
        <el-input
          :disabled="disabled"
          type="textarea"
          :rows="5"
          v-model="form.machineCheck"
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
        <el-form-item label="附件下载：" prop="uploadFile">
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
</template>

<script>
import { getUploadDataList, getTsyzxList } from "../../api/auditTaskOthers";
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
        machineCheck: "",
        status: ""
        // taskObjId: JSON.parse(sessionStorage.getItem("rowData")).id
      },
      rules: {
        remarks: [
          { required: true, message: "请输入审查意见", trigger: "blur" },
          {
            min: 2,
            max: 100,
            message: "长度在 2 到 100 个字符",
            trigger: "blur"
          }
        ],
        uploadFile: [
          { required: true, message: "请上传审查附件", trigger: "change" }
        ],
        attachmentDescription: [
          { required: true, message: "请输入附件说明", trigger: "blur" },
          {
            min: 2,
            max: 100,
            message: "长度在 2 到 100 个字符",
            trigger: "blur"
          }
        ]
      },
      points: [],
      upLoadName: "",
      downLoadUrl: "",
      rowData: JSON.parse(sessionStorage.getItem("rowData"))
    };
  },
  mounted() {
    if (this.type == "12") {
      this.getDataLIst();
    } else {
      this.getTable();
    }
    if (
      this.$parent.approveReqList[1].status == 0 ||
      this.$parent.approveReqList[1].status == 1
    ) {
      this.form.fileList = this.$parent.fileList1;
      this.form.status = this.$parent.approveReqList[1].status;
      this.form.remarks = this.$parent.approveReqList[1].remarks;
      this.form.attachmentDescription = this.$parent.approveReqList[1].attachmentDescription;
    }
  },
  methods: {
    async getTable() {
      let params = this.rowData.id;
      let res = await getTsyzxList(params);
      if (res.data.code == 0) {
        this.form.machineCheck = res.data.data.machineCheck;
      }
    },
    getDataLIst() {
      this.disabled = true;
      this.isBtn = false;
      // console.log(this.dataList);
      this.dataList.forEach(item => {
        // console.log(item);
        if (item.approveType == 1) {
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
      this.$parent.fileList1 = fileList;
      // if (fileList.length == 1) {
      //   let { uploadFile, ...data } = this.rules; //删除rules中的uploadFile属性
      //   this.rules = data;
      // }
    },
    async getUploadList() {
      let formdata = new FormData();
      formdata.append("file", this.uploadDatas);
      let res = await getUploadDataList(formdata);
      this.form.attachmentId = res.data.data.attachmentId;
      this.$parent.approveReqList[1].attachmentId = this.form.attachmentId;
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
          this.$parent.approveReqList[1].status = 1;
          this.$parent.approveReqList[1].remarks = this.form.remarks;
          this.$parent.approveReqList[1].attachmentDescription = this.form.attachmentDescription;
          // console.log(this.$parent.approveReqList[1]);
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
          this.$parent.approveReqList[1].status = 0;
          this.$parent.approveReqList[1].remarks = this.form.remarks;
          this.$parent.approveReqList[1].attachmentDescription = this.form.attachmentDescription;
          this.isBtn = false;
          this.isPass = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
    // async getSelectDataList() {
    //   let res = await keyPointsList();
    //   // console.log(res);
    //   if ((res.data.msg = "执行成功")) {
    //     this.points = res.data.data;
    //   }
    // }
  }
};
</script>

<style lang="less" scoped>
/deep/ .el-textarea__inner {
  width: 115%;
}
.content {
  padding-right: 31px;
  overflow-y: auto;
  &-form {
    display: flex;
    justify-content: space-around;
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
</style>
