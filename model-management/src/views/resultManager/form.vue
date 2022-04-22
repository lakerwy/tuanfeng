<template>
  <el-form ref="form" :model="form" class="result-form" :rules="rules">
    <el-row>
      <el-col :span="12">
        <el-form-item label="区划名称" required prop="qhdm">
          <el-select
            value-key="code"
            :value="{naem:form.qhname,code:form.qhdm}"
            clearable
            placeholder="请选择"
            @change="codeChange"
          >
            <el-option
              v-for="item in localRegion"
              :key="item.code"
              :label="item.name"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="模型" required prop="type">
          <el-select
            v-model="form.type"
            clearable
            :disabled="!!form.id"
            placeholder="请选择"
          >
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="年份" prop="year">
          <el-date-picker
            v-model="form.year"
            type="year"
            placeholder="选择年"
            value-format="yyyy"
          >
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <!--<el-form-item label="模型">
          <el-select
            value-key="id"
            v-model="form.modelname"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading"
            @change="modelChange"
          >
            <el-option
              v-for="item in modelList"
              :key="item.id"
              :label="item.name"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item> -->
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="预警状态">
          <el-select
            v-model="form.warningStatus"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in warningStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="超载情况">
          <el-select
            v-model="form.overloadStatus"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in overloadStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <template v-if="form.type === 'Spj41'">
      <el-form-item label="城镇可用水量">
        <el-input v-model="form.czkysl" type="number">
          <template slot="append">亿立方米</template>
        </el-input>
      </el-form-item>
      <el-form-item label="城镇人均需水量">
        <el-input v-model="form.czrjxsl" type="number">
          <template slot="append">立方米/年</template>
        </el-input>
      </el-form-item>
      <el-form-item label="可承载城镇人口规模" type="number">
        <el-input v-model="form.kczczrkgm">
          <template slot="append">万人</template>
        </el-input>
      </el-form-item>
      <el-form-item label="人均城镇建设用地">
        <el-input v-model="form.rjczjsyd" type="number">
          <template slot="append">平方米/年</template>
        </el-input>
      </el-form-item>
      <el-form-item label="可承载城镇建设用地规模">
        <el-input v-model="form.kczczjsydgm" type="number">
          <template slot="append">平方千米</template>
        </el-input>
      </el-form-item>
      <el-form-item label="现状城镇建设用地面积">
        <el-input v-model="form.xzczjsydmj" type="number">
          <template slot="append">平方千米</template>
        </el-input>
      </el-form-item>
    </template>
    <template v-if="form.type === 'Spj42'">
      <el-form-item label="农业用水量">
        <el-input v-model="form.nyysl" type="number">
          <template slot="append">亿立方米</template>
        </el-input>
      </el-form-item>
      <el-form-item label="农业灌溉水有效利用系数">
        <el-input v-model="form.ntggsyxlyxs" type="number"></el-input>
      </el-form-item>
      <el-form-item label="亩均耕地灌溉用水量">
        <el-input v-model="form.mjgdggysl" type="number">
          <template slot="append">立方米/亩</template>
        </el-input>
      </el-form-item>
      <el-form-item label="可承载耕地规模合计">
        <el-input v-model="form.kczgdgmPfqm" type="number">
          <template slot="append">平方千米</template>
        </el-input>
      </el-form-item>
      <el-form-item label="可承载耕地规模合计">
        <el-input v-model="form.kczgdgmWm" type="number">
          <template slot="append">万亩</template>
        </el-input>
      </el-form-item>
      <el-form-item label="可承载耕地规模灌溉耕地面积">
        <el-input v-model="form.kczgdgmGggdmj" type="number">
          <template slot="append">平方千米</template>
        </el-input>
      </el-form-item>
      <el-form-item label="可承载耕地规模雨养耕地面积">
        <el-input v-model="form.kczgdgmYygdmj" type="number">
          <template slot="append">平方千米</template>
        </el-input>
      </el-form-item>
      <el-form-item label="现状耕地面积">
        <el-input v-model="form.xzgdmjPfqm" type="number">
          <template slot="append">平方千米</template>
        </el-input>
      </el-form-item>
      <el-form-item label="现状耕地面积">
        <el-input v-model="form.zxgdmjWm" type="number">
          <template slot="append">万亩</template>
        </el-input>
      </el-form-item>
    </template>
    <template v-if="form.type === 'Spj43'">
      <el-form-item label="可承载耕地规模">
        <el-input v-model="form.kczgdgmPfqm" type="number">
          <template slot="append">平方千米</template>
        </el-input>
      </el-form-item>
      <el-form-item label="可承载耕地规模">
        <el-input v-model="form.kczgdgmWm" type="number">
          <template slot="append">万亩</template>
        </el-input>
      </el-form-item>
      <el-form-item label="现状耕地面积">
        <el-input v-model="form.xzgdmjPfqm" type="number">
          <template slot="append">平方千米</template>
        </el-input>
      </el-form-item>
      <el-form-item label="现状耕地面积">
        <el-input v-model="form.xzgdmjWm" type="number">
          <template slot="append">万亩</template>
        </el-input>
      </el-form-item>
    </template>
    <template v-if="form.type === 'Spj44'">
      <el-form-item label="可承载建设规模">
        <el-input v-model="form.kczjsgm" type="number">
          <template slot="append">平方千米</template>
        </el-input>
      </el-form-item>
      <el-form-item label="现状城镇建设用地面积">
        <el-input v-model="form.xzczjsydm" type="number">
          <template slot="append">平方千米</template>
        </el-input>
      </el-form-item>
    </template>
    <el-form-item class="btn-container">
      <el-button type="primary" @click="onSubmit">确定</el-button>
      <el-button @click="onCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { typeList, warningStatusList, overloadStatusList } from "./type";
import { getModelListByParams } from "../../api/api";
import { getModelResultInfoRequest } from "../../api/modelResultApi";

export default {
  props: ["data", "region"],
  data() {
    return {
      form: {
        qhdm: null,
        type: null,
        year: null,
        modelid: null,
        modelname: null,
        warningStatus: null,
        overloadStatus: null,

        czkysl: null,
        czrjxsl: null,
        kczczrkgm: null,
        rjczjsyd: null,
        kczczjsydgm: null,
        xzczjsydmj: null,

        nyysl: null,
        ntggsyxlyxs: null,
        mjgdggysl: null,
        kczgdgmPfqm: null,
        kczgdgmWm: null,
        kczgdgmGggdmj: null,
        kczgdgmYygdmj: null,
        xzgdmjPfqm: null,
        zxgdmjWm: null,

        // kczgdgmPfqm: null,
        // kczgdgmWm: null,
        // xzgdmjPfqm: null,
        xzgdmjWm: null,

        kczjsgm: null
        // xzczjsydm: null
      },
      typeList: typeList,
      warningStatusList: warningStatusList,
      overloadStatusList: overloadStatusList,
      modelList: [],
      loading: false,
      rules: {
        qhdm: [
          { required: true, message: "请选择区划名称", trigger: "change" }
        ],
        type: [{ required: true, message: "请选择模型", trigger: "change" }],
        year: [{ required: true, message: "请选择年份", trigger: "change" }]
      }
    };
  },
  watch: {
    data() {
      this.setForm();
    }
  },
  computed:{
    localRegion(){
      if (this.region){
        return this.region.map(x => {
          return {
            code:x.code,
            name:x.name,
          }
        })
      }
      return [];
    }
  },
  mounted() {
    this.setForm();
  },
  methods: {
    async setForm() {
      if (this.data) {
        Object.assign(this.form, this.data);
        if (this.data.id && this.data.type) {
          let params = {
            data: this.data.id,
            type: this.data.type
          };
          let res = await getModelResultInfoRequest(params);
          if (res.code == 200) {
            Object.assign(this.form, res.data);
          }
        }
      }
    },
    async remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        let res = await getModelListByParams({ modername: query });
        if (res.code === 200) {
          this.loading = false;
          this.modelList = res.data.map(x => {
            return { id: x.id, name: x.modername };
          });
        }
      } else {
        this.modelList = [];
      }
    },
    modelChange(value) {
      if (value) {
        this.form.modelname = value.name;
        this.form.modelid = value.id;
      }
    },
    codeChange(value) {
      if (value) {
        this.form.qhname = value.name;
        this.form.qhdm = value.code;
      }
    },
    onSubmit() {
      // if (!this.form.modelid){
      //   this.$message.error("请在模型输入框通过搜索获取");
      //   return;
      // }
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit("submit", this.form);
        }
      });
    },
    onCancel() {
      this.$emit("cancel");
    }
  }
};
</script>

<style lang="less">
.result-form {
  .el-col{
    height: 60px;
  }

  .el-form-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .el-form-item__label {
      line-height: unset;
      width: 130px;
    }
    .el-form-item__content {
      width: 100%;
    }
  }
}
</style>
