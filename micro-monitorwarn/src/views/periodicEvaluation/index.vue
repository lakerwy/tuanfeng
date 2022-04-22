<!--
 * @Author: 任继民
 * @Date: 2020-12-09 16:27:35
 * @LastEditors: 任继民
 * @LastEditTime: 2021-04-22 19:50:09
 * @Description: 定期评估
-->
<template>
  <div class="per-eval">
    <div class="vbreadcrumbs">
      <!-- <ul class="vbreadcrumbs-ul">
        <li>监测评估预警 </li>
        <li class="vbreadcrumbs__divider">/</li>
        <li>定期评估</li>
        <li class="vbreadcrumbs__divider">/</li>
        <li class="active" v-if="currentIndex===0">地区评估</li>
        <li class="active" v-else-if="currentIndex===1">评估进度</li>
        <li class="active" v-else-if="currentIndex===2">指标评估</li>
        <li class="active" v-else-if="currentIndex===3">分类汇总</li>
      </ul> -->
      <!-- <div class="btn-list" v-if="currentIndex===2 || currentIndex===3">
        <a-button type="primary">
          报告版本管理
        </a-button>
        <a-button type="primary">
          生成报告
        </a-button>
      </div> -->
    </div>
    <div class="perdeval-content">
      <div class="left-menulist">
        <div class="empty-div"></div>
        <div class="menulist" v-for="(item, index) in menulist" :key="item.id" @click="menuClick(item,index)" :class="currentIndex === index ? 'selectMenu': ''">
          <div class="name-text">
            <span>{{item.name}}</span>
          </div>
          <img :src="currentIndex === index ? require('../../assets/images/sel-menu-bg.png'):require('../../assets/images/menu-bg.png')" alt="" srcset="">
        </div>
      </div>
      <div class="right-content">
        <AreaAssess v-if="currentIndex===0"/>
        <EvalProgress v-else-if="currentIndex===1"/>
        <Indexeval v-else-if="currentIndex===2"/>
        <Subtotal v-else-if="currentIndex===3"/>
      </div>
    </div>
  </div>
</template>
<script>
import AreaAssess from './components/areaAssess';
import EvalProgress from './components/evalProgress';
import Indexeval from './components/Indexeval'
import Subtotal from './components/Subtotal';

export default {
  components: {
    AreaAssess,
    EvalProgress,
    Indexeval,
    Subtotal
  },
  data: () => ({
    menulist:[
      {id: '1', name: '地区评估', },
      {id: '2', name: '评估进度',},
      {id: '3', name: '指标评估', },
      {id: '4', name: '分类汇总',}
    ],
    currentIndex: 0,
  }),
  methods: {
    menuClick(item,index) {
      this.currentIndex = index;
    },
  },
}
</script>
<style lang="scss" scoped>
@import '../../assets/styles/common.scss';
.per-eval {
  .vbreadcrumbs {
    .vbreadcrumbs-ul {
      margin: 0;
    }
    .btn-list {
      button:last-child {
        margin: 0 30px 0 20px;
      }
    }
  }

  .perdeval-content {
    display: flex;
    justify-content: flex-start;
    .left-menulist {
      height: 100%;
      width: 34px;
      border-left: 4px solid #1890ff;
      margin-right: 16px;
      .empty-div {
        height: 34px;
      }
      .menulist {
        position: relative;
        z-index: 1;
        cursor: pointer;
        .name-text {
          position: absolute;
          width: 14px;
          font-size: 14px;
          font-weight: bold;
          top: 28px;
          left: 8px;
          color: #6f7583;
        }
      }
      .menulist:first-child {
        margin-bottom: -8px;
      }
      .selectMenu{
        z-index: 2;
        .name-text {
          color: #ffffff;
        }
      }
    }
    .right-content {
      width: calc(100%);
    }
  }
}
</style>
