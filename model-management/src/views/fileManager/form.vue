<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="100px">
    <el-form-item label="名称" prop="name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="文件路径" prop="tbxFile">
      <el-input v-model="form.tbxFile"></el-input>
    </el-form-item>
    <el-form-item label="缩略图路径" prop="imgUrl">
      <el-input v-model="form.imgUrl"></el-input>
    </el-form-item>
    <!-- <el-form-item class="btn-container"> -->
      <div class="btn-container">
        <el-button type="primary" @click="submit">确定</el-button>
      <el-button @click="cancel">取消</el-button>
      </div>

      
    <!-- </el-form-item> -->
  </el-form>
</template>

<script>
import { addETLListRequest, editETLListRequest } from "@/api/etlApi";

export default {
  props: ["data"],
  data() {
    return {
      form: {
        id: "",
        name: "",
        tbxFile: "",
        imgUrl: ""
      },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        tbxFile: [
          { required: true, message: "请输入文件路径", trigger: "blur" }
        ],
        imgUrl: [
          { required: true, message: "请输入缩略图路径", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    data() {
      this.setForm();
    }
  },
  mounted() {
    this.setForm();
  },
  methods: {
    async setForm() {
      if (this.data) {
        Object.assign(this.form, this.data);
      }
    },
    submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res = null;
          if (this.form.id) {
            res = await editETLListRequest(this.form);
          } else {
            res = await addETLListRequest(this.form);
          }

          if (res.status) {
            this.$message("保存成功！");
            this.$emit("submit");
          } else {
            this.$message.error(res.message);
          }
        }
      });
    },
    cancel() {
      this.$emit("cancel");
    }
  }
};
</script>

<style lang="less">
.btn-container {
  text-align: center;
  // .el-form-item__content {
  //   text-align: center;
    
  // }
}
</style>
