<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="80px">
    <el-form-item label="模型名称" prop="modername">
      <el-input v-model="form.modername"></el-input>
    </el-form-item>
    <el-form-item label="模型编码" prop="moderename">
      <el-input v-model="form.moderename"></el-input>
    </el-form-item>
    <el-form-item label="模型类型" prop="modetype">
      <el-cascader
        :options="types"
        v-model="typeCascader"
        @change="typeChange"
      ></el-cascader>
    </el-form-item>
    <el-form-item label="模型描述">
      <el-input type="textarea" v-model="form.moderndesc"></el-input>
    </el-form-item>
    <el-form-item label="是否公开">
      <el-switch
        v-model="form.ispublic"
        :active-value="1"
        :inactive-value="0"
      ></el-switch>
    </el-form-item>
    <el-form-item label="输出类型">
      <el-radio-group v-model="form.outype">
        <template v-for="(item, index) in outTypes">
          <el-radio :label="item.value" :key="index">{{ item.label }}</el-radio>
        </template>
      </el-radio-group>
    </el-form-item>
    <!-- <el-form-item> -->
      <div class="btn">
        <el-button type="primary" @click="submit">确定</el-button>
      <el-button @click="cancel">取消</el-button>
      </div>
      
    <!-- </el-form-item> -->
  </el-form>
</template>

<script>
import { type, outType } from "./modetype.js";
import { addModelRequest, editModelRequest } from "@/api/modelManagerApi";

export default {
  props: ["data"],
  data() {
    return {
      types: type,
      outTypes: outType,
      typeCascader: null,
      form: {
        id: "",
        modername: "",
        moderename: "",
        moderndesc: "",
        modetype: "",
        spjtype: "",
        ispublic: 0,
        outype: 0
      },
      rules: {
        modername: [{ required: true, message: "请输入名称", trigger: "blur" }],
        moderename: [
          { required: true, message: "请输入编码", trigger: "blur" }
        ],
        modetype: [{ required: true, message: "请选择模型", trigger: "blur" }]
      }
    };
  },
  watch: {
    data() {
      this.init();
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.data) {
        Object.assign(this.form, this.data);

        let array = [this.form.modetype];
        if (this.form.spjtype) {
          array.push(this.form.spjtype);
        }
        this.typeCascader = array;
      }
    },
    typeChange(value) {
      this.form.modetype = value[0];
      this.form.spjtype = value[1];
    },
    submit() {
      if (!this.form.modetype) {
        this.$message.error("请选择类型！");
        return;
      }

      this.$refs.form.validate(async valid => {
        if (valid) {
          this.form.ispublic = this.form.ispublic ? 1 : 0;
          let res = null;
          if (this.form.id) {
            res = await editModelRequest(this.form);
          } else {
            res = await addModelRequest(this.form);
          }

          if (res.code === 200) {
            this.$message("保存成功！");
            this.cancel();
          } else {
            this.$message.error(res.msg);
          }
        }
      });
    },
    cancel() {
      this.$emit("change");
    }
  }
};
</script>

<style lang="less" scoped>
.btn{
  text-align: center;
}
</style>
