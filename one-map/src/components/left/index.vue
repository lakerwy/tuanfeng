<!-- 树 -->
<template>
  <div class="left-tree">
    <div class="tree-wrapper" v-show="showTree">
      <div class="tree-title">
        <div>资源目录</div>
      </div>
      <div class="search-box">
        <a-input
          v-model="queryText"
          placeholder="请输入关键字"
          @pressEnter="filterTree"
        >
          <div class="search-icon" slot="suffix"/>
        </a-input>
        <div class="btn search-btn" @click="filterTree">查询</div>
        <div class="btn reset-btn" @click="resetText">重置</div>
      </div>
      <div class="tab-box">
        <div @click="handleTabClick(0)">业务类型</div>
        <div @click="handleTabClick(1)">来源单位</div>
        <!-- <div @click="handleTabClick(1)">组织机构</div> -->
        <div @click="handleTabClick(2)">数据领域</div>
        <!-- <div @click="handleTabClick(2)">应用场景</div> -->
      </div>
      <div class="tree-container">
        <Tree
          v-on="$listeners"
          v-bind="$attrs"
          :type="type"
          :filterText="filterText"
        />
      </div>
    </div>
    <div  class="tree-btn">
      <img v-if="showTree"  @click="handleBtnClick" src="../../assets/imgs/left-arrow.png" class="tree-icon" >
      <img v-else  @click="handleBtnClick" src="../../assets/imgs/right-arrow.png" class="tree-icon" >
      <!-- <div class="tree-icon" :class="{ treeIcon: !showTree }"></div> -->
    </div>
  </div>
</template>

<script>
import Tree from "@/components/tree/index";
export default {
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "label",
      },
      isActive1: true,
      isActive2: false,
      isActive3: false,
      queryText: "",
      filterText: "",
      radio: 3,
      defaultKey: 1,
      checked: false,
      data1: [],
      data: [],
      type: "", //树的类型
    };
  },

  props: ["showTree"],

  components: { Tree },

  created() {},

  computed: {},
  watch: {},
  mounted() {
    this.handleTabClick(0);
  },

  methods: {
    // tab切换
    handleTabClick(i) {
      if (i == 1) {
        this.type = "org";
      } else if (i == 2) {
        this.type = "domain";
      } else {
        this.type = "business";
      }
      let doms = document.querySelectorAll(".tab-box div");
      // 移除所有active的类名
      doms.forEach((item) => item.classList.remove("activeTab"));
      // 指定的添加类名
      doms.forEach((item, index) => {
        if (index == i) {
          item.classList.add("activeTab");
        }
      });
    },
    // 是否展示树
    handleBtnClick() {
      this.$emit("updateMapSize");
    },
    // 过滤树
    filterTree() {
      this.filterText = this.queryText;
    },
    // 重置
    resetText() {
      this.queryText = "";
      this.filterText = this.queryText;
    },
  },
};
</script>
<style lang="less" scoped>
.left-tree {

  display: flex;
  justify-content: flex-start;
  height: 100%;

}
.tree-wrapper {
  width: calc(100% - 12px);
  height: 100%;
  // box-shadow: 0px 0px 8px 0px rgba(57, 75, 125, 0.3);
  background: #fff;
}
.tree-btn {
  width: 30px;
  height: 100%;
  font-size: 0px;

  // border-top-right-radius: 3px;
  // border-bottom-right-radius: 3px;
  // margin: auto 0;
  .tree-icon {
    display: block;
    padding-left: 0px;
    padding-top: 21px;
    cursor: pointer;
  }
}
.tree-title {
  height: 67px;
  padding: 0 20px;
  font-size: 16px;
  line-height: 50px;
  background: #fff;
  border-bottom: 1px solid #eee;
  div {
    text-align: left;
    line-height: 67px;
    font-size: 18px;
    color: #454954;
    font-family: "Microsoft YaHei";
  }
  .active {
    color: rgb(19, 141, 223);
  }
}
.search-box {
  margin: 20px 20px 26px 20px ;
  display: flex;
  justify-content: flex-start;
  /deep/.ant-input-affix-wrapper {
    width: 204px;
    /deep/.ant-input {
      border-radius: 0;
      height: 34px;
    }
    .search-icon{
      width: 14px;
      height: 34px;
      display: inline-block;
      background: url("../../assets/imgs/icon-search.png") no-repeat center;
    }
  }
  .btn {
    cursor: pointer;
    text-align: center;
    line-height: 34px;
    border-radius: 0;
    width: 60px;
    height: 34px;
    border: 1px solid #397DC9;
    span {
      font-weight: 14px;
    }
  }
  .search-btn {
    color: #fff;
    background: #397DC9;
    margin-right: 10px;
  }
  .reset-btn {
    color: #1890ff;
  }
  .reset-btn:focus,
  .reset-btn:hover {
    background: #fff;
    color: #1890ff;
  }
}
.tab-box {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid #eee;
  div {
    width: 100px;
    padding: 5px 0;
    font-size: 14px;
    cursor: pointer;
  }
  .activeTab {
    color: #1890ff;
    border-bottom: 2px solid #1890ff;
  }
}

.tree-container {
  width: 344px;
  text-align: left;
  padding: 10px 20px;
  height: calc(100% - 195px);
  overflow: auto;
}

</style>
