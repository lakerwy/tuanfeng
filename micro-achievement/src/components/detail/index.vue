<template>
<!-- 审查任务详情页面 任务详情展示 -->
  <div class="quality-detail-left">
    <div class="title">
      <el-radio v-model="radio" label="1">{{currentTab.label}}</el-radio>
    </div>
    <div class="content">
      <el-form label-width="120px" label-position="right" :model="form">
        <el-form-item label="审查要点：">
           <el-select style="width: 100%;" v-model="form.checkPoints" placeholder="请选择审查要点">
              <el-option v-for="item in points" :key="item.name" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="审查意见：">
          <el-input type="textarea" :rows="5" v-model="form.suggestion" placeholder="请输入审查意见或导入审查相关附件。"></el-input>
        </el-form-item>
        <el-form-item label="审查附件：">
          <span class="file"><img src="../../assets/imgs/file.png" alt=""> 查看附件</span>
          <span class="file">附件说明</span>
        </el-form-item>
        <el-form-item label="机审结果：" v-if="currentTab.name != 0">
          <el-input type="textarea" :rows="15" v-model="form.result"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      radio: '1',
      form: {
        checkPoints: 0,
        result: '表格中耕地文本上报值与GIS图上实测值相差10公顷。表格中种植园用地文本上报值与GIS图上实测值相差13公顷。表格中其他农业用地文本上报值与GSI图上实测值相差62公顷。表格中小计文本上报值与GIS图上实测值相差23公顷。表格中居住用地文本上报值与GIS图上实测值相差42公顷。表格中道路与交通设施用地文本上报值与GIS图上实测值想相差7公顷。表格中绿地与广场用地文本上报值与GIS图上实测值相差55公顷。表格中区域基础设施用地文本上报值与GIS图上实测值相差51公顷。 '
      },
      points: [
        {name: '用途分类图数一致性', value: 0}
      ]
    }
  },
  props: {
    currentTab: {
      type: Object,
      default: () => {}
    }
  },
  methods:{
    handleClick(){}
  }
}
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
    }
  }
}
</style>
