<template>
  <div class="step">
    <div class="configContainer">
      <div class="header">
        <div class="saveBut" @click="save">保存</div>
        <div class="title">步骤三：选择修正参数</div>
      </div>
      <div class="content">
        <template v-if="data">
          <div v-for="(value, name) in data" :key="name">
            <div class="areaTitle">
              {{ name }}
            </div>
            <div class="step-content">
              <div v-for="(c, j) in value" :key="j" class="step-item">
                <div class="step-item-1">
                  <el-select v-model="c.corvalue">
                    <el-option
                      v-for="item in list"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
                <div class="step-item-2">{{ c.definetext }}</div>
                <div class="step-item-3">
                  <input v-model.number="c.minvar" placeholder="最小值" /> --
                  <input v-model.number="c.maxvar" placeholder="最大值" />
                </div>
                <div class="step-item-4">
                  <el-color-picker
                    v-model="c.colorvalue"
                    size="small"
                  ></el-color-picker>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { corValueList } from "./pageData";
import { saveModelStepThreeRequest } from "@/api/modelConfigApi";

export default {
  data() {
    return {
      modelId: null,
      data: null,
      list: corValueList
    };
  },
  mounted() {},
  methods: {
    init(id, data) {
      this.modelId = id;
      this.data = data?.modelRevrules;
    },
    async save() {
      let list = [];
      for (const key in this.data) {
        if (Object.hasOwnProperty.call(this.data, key)) {
          const value = this.data[key];
          let object = {
            ruleGroup: {
              rulename: key,
              modelid: this.modelId,
              rulecount: Array.isArray(value) ? value.length : 0
            },
            ruleList: value
          };
          list.push(object);
        }
      }
      let data = { ruleConfigList: list };
      let res = await saveModelStepThreeRequest(data);

      if (res.code === 200) {
        this.$message("保存成功！");
        this.$emit("next");
      } else {
        this.$message(res.msg);
      }
    }
  }
};
</script>
