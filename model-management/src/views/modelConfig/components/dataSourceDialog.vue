<template>
  <el-dialog title="配置数据" :visible.sync="dialogVisible" width="30%">
    <div class="item">
      <span>数据类型：&nbsp;</span>
      <el-radio v-model="dataType" label="0">矢量</el-radio>
      <el-radio v-model="dataType" label="1">栅格</el-radio>
    </div>
    <div class="item">
      <span>图层名称：&nbsp;</span>
      <el-select v-model="name" clearable>
        <template v-if="data">
          <el-option
            v-for="(item, index) in data"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </template>
      </el-select>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ["data"],
  data() {
    return {
      dialogVisible: false,
      dataType: "0",
      name: null
    };
  },
  methods: {
    changeVisible(bool) {
      if (bool != null) {
        this.dialogVisible = bool;
      } else {
        this.dialogVisible = !this.dialogVisible;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.item + .item {
  margin-top: 10px;
}
</style>
