<template>
  <!-- 监测值管理 -->
  <div class="content">
    <div class="content-top">
      <div class="content-top-breadcrumb">
        <bread-crumb :list="breadList"></bread-crumb>
      </div>
      <div class="content-top-select">
        <select-one
          :title="titleOne"
          ref="selectValue"
          :options="nationOptions"
          @changeIndex="handleChange"
        ></select-one>
      </div>
      <div class="content-top-radio">
        <a-radio-group v-model="valueRadio" @change="onChangeRadio">
          <a-radio :valueRadio="1">
            实时
          </a-radio>
          <a-radio :valueRadio="2">
            定期
          </a-radio>
        </a-radio-group>
      </div>
      <div class="content-top-choose">
        <select-one
          :title="titleTwo"
          ref="selectValue1"
          :options="nationOptions"
          @changeIndex="handleChange"
        ></select-one>
      </div>
      <div class="content-top-time">
        <p>监测时间：</p>
        <div class="content-top-time-block">
          <a-range-picker v-model="valueTime" @change="onChangeTime" />
        </div>
      </div>
      <div class="content-top-btn">
        <a-button @click="handleReset" style="margin-right:10px">重置</a-button>
        <a-button type="primary" @click="handleExport">导入</a-button>
      </div>
    </div>
    <div class="content-main">
      <div class="content-main-tree">
        <div class="content-main-tree-box">
          <div class="content-main-tree-box-itemTree">
            <item-tree></item-tree>
          </div>
        </div>
      </div>
      <div class="content-main-table">
        <table-one :chooseList="choosenTitle"></table-one>
      </div>
    </div>
  </div>
</template>

<script>
import breadCrumb from "@/components/breadCrumb/index";
import SelectOne from "@/components/select/selectIndex";
import TableOne from "@/pages/indexManagement/MonitorManagement/component/table";
import itemTree from "@/components/itemTree/searchTree";
export default {
  components: {
    breadCrumb,
    SelectOne,
    TableOne,
    itemTree
  },
  data() {
    return {
      gData: [],
      choosenTitle: "资源环境状况",
      valueTime: [],
      valueRadio: 1,
      titleOne: "选择行政区",
      titleTwo: "监测周期",
      breadList: ["运维管理", "指标值管理", "监测值管理"],
      nationOptions: [
        {
          value: "选项1",
          key: "1"
        },
        {
          value: "选项2",
          key: "2"
        },
        {
          value: "选项3",
          key: "3"
        }
      ]
    };
  },
  methods: {
    onChangeTime(date, dateString) {
      console.log(date, dateString);
    },
    onChangeRadio(e) {
      console.log("radio checked", e.target.value);
    },
    choosenTree(id, title) {
      this.choosenTitle = title;
    },
    //   点击select选择框，改变其选择的值
    handleChange(value) {
      console.log(value);
    },
    //   点击 重置 按钮
    handleReset() {
      this.$refs.selectValue.value = "";
      this.$refs.selectValue1.value = "";
      this.valueRadio = 1;
      this.valueTime = [];
    },
    //   点击 导出 按钮
    handleExport() {},
    // 树形 搜索
    onChange(e) {
      console.log(e.target.value);
    }
  }
};
</script>

<style lang="less" scoped>
* {
  box-sizing: border-box;
}
@vw: 22.2vw;
@vh: 10.8vh;

.content {
  width: 100%;
  &-top {
    width: 100%;
    height: 100px;
    background-color: #fff;
    padding: 1px;
    overflow: hidden;
    white-space: nowrap;
    position: relative;
    &-select {
      position: absolute;
      left: 50px;
      top: 40px;
    }
    &-radio {
      position: absolute;
      left: 465px;
      top: 57px;
    }
    &-choose {
      position: absolute;
      left: 635px;
      top: 40px;
    }
    &-time {
      height: 56px;
      line-height: 56px;
      position: absolute;
      left: 1050px;
      top: 40px;
      p {
        float: left;
      }
      &-block {
        float: left;
      }
    }
    &-btn {
      position: absolute;
      left: 1510px;
      top: 53px;
    }
  }
  &-main {
    width: 1880 / @vw;
    margin-left: 30 / @vw;
    margin-top: 16 / @vh;
    display: flex;
    &-tree {
      width: 374 / @vw;
      height: 830 / @vh;
      background-color: #fff;
      &-box {
        width: 334 / @vw;
        margin-left: 20 / @vw;
        height: 100%;
        &-search {
          height: 76 / @vh;
          width: 100%;
          border-bottom: 1px solid #e8e8e8;
          line-height: 76 / @vh;
        }
        &-itemTree {
          width: 100%;
          margin-top: 20 / @vh;
          height: 734 / @vh;
          overflow: auto;
        }
      }
    }
    &-table {
      width: 1470 / @vw;
      margin-left: 16 / @vw;
      background-color: #fff;
    }
  }
}
</style>
