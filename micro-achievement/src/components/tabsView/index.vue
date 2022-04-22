<template>
<!-- 审查任务一棵树 导航页组件 -->
  <div class="tabs-view">
    <div
      class="tab-item"
      :class="{'active' : current === index}"
      v-for="(item, index) in getTabsLists"
      :key="index"
      @click="chooseTab(index, item)">
      <span>{{item.directoryName}}</span>
      <img src="../../assets/imgs/icon-close.png" alt="" @click.stop="closeTab(index)">
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
export default {
  data() {
    return {
      // tabsLists: [
      //   { name: '国土空间规划数据库建设成果报告', type: 'pic' },
      //   { name: '国土空间规划数据库建设成果报告', type: 'pic' },
      //   { name: '生态保护红线', type: 'pdf' },
      //   { name: '永久基本农田', type: 'excel' },
      //   { name: '永久基本农田', type: 'excel' },
      //   { name: '209876 团风县国土空间总体规划（2020-2035）', type: 'pdf' },
      //   { name: '209876 团风县国土空间总体规划（2020-2035）', type: 'pdf' },
      // ],
      current: 0
    }
  },
  computed: {
    ...mapState('tabs', ['tabsLists', 'currentTab', 'currentIndex']),
    ...mapGetters('tabs', ['getTabsLists', 'getCurrentIndex'])
  },
  watch: {
    getCurrentIndex: {
      handler: function(newV, oldV) {
        // debugger
        this.current = newV;
        // console.log(this.current, 'newV')
      },
      immediate: true
    }
  },
  created() {

  },
  methods: {
    chooseTab(index, item) {
      // 选择当前路由
      // this.current = index;
      this.$store.commit('tabs/setCurrentTab', item);
      this.$store.commit('tabs/setCurrentIndex', index);
    },
    closeTab(index) {
      // 关闭当前路由
      this.$store.commit('tabs/deleteTab', index);
      if(index === this.getCurrentIndex) {
        // 如果当前关闭的是当前选中的，判断当前tab的index，如果刚好在末尾，index不变，否则就是最后一个
        let cIndex = index === (this.getTabsLists.length - 1) ? index : this.getTabsLists.length - 1;
        this.$store.commit('tabs/setCurrentTab', this.getTabsLists[cIndex]);
        this.$store.commit('tabs/setCurrentIndex', cIndex);
      } else {
        // 当前关闭的不是当前选中的，判断删除后的index，如果当前关闭的index小于打开的，贼打开的减一，如果大于打开的，就不变
        let cIndex = index < this.current ? this.current - 1 : this.current;
        this.$store.commit('tabs/setCurrentTab', this.currentTab);
        this.$store.commit('tabs/setCurrentIndex', cIndex);
      }
      // this.tabsLists.splice(index, 1)
    }
  }
}
</script>

<style lang="less" scoped>
.tabs-view {
  min-width: 860px;
  height: 100%;
  display: flex;
  // justify-content: flex-start;
  // align-items: center;
  overflow-x: scroll;
  .tab-item {
    padding: 0 31px 0 20px;
    height: 100%;
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    span {
      // word-break: keep-all;
      white-space: nowrap;
    }
    img {
      margin-left: 15px;
      cursor: pointer;
    }
  }
  .active {
    background-color: #e6f1ff;
  }
}
</style>
