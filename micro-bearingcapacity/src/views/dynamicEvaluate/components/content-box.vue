<!--
 * @Author: 任继民
 * @Date: 2020-11-19 16:43:51
 * @LastEditors: 任继民
 * @LastEditTime: 2021-05-19 15:17:59
 * @Description:
-->
<template>
  <div class="dynamic-box">
    <section class="title">
      <div class="name">{{boxData.taskName}}</div>
      <div class="title-stauts">
        <a-button v-if="boxData.evaluateStatus==1" class="comp-btn" type="primary">
          评估通过
        </a-button>
        <a-button v-else-if="boxData.evaluateStatus ==0" class="unfin-btn" type="primary">
          评估未完成
        </a-button>
      </div>
    </section>
    <section class="content">
      <div>区域范围: {{boxData.adName}}</div>
      <div>年份: {{boxData.year}}</div>
      <div>预警状态: <span :class="warningStatus(boxData.warningStatus)[1]">{{warningStatus(boxData.warningStatus)[0]}}</span></div>
      <div>农业生产承载规模预警范围: <span :class="warningStatus(boxData.agriculturalProductionStatus)[1]">{{warningStatus(boxData.agriculturalProductionStatus)[0]}}</span></div>
      <div>城镇建设承载规模预警范围: <span :class="warningStatus(boxData.townConstructionStatus)[1]">{{warningStatus(boxData.townConstructionStatus)[0]}}</span></div>
      <div>评估时间: {{boxData.evaluateTime}}</div>
      <div class="btn-list">
        <a-button type="primary" class="detail-btn" @click="toDetail(boxData)">
          查看详情
        </a-button>
        <a-button v-if="boxData.evaluateStatus=='1'" type="primary" class="reapp-btn" @click="reappraisal">
          重新评估
        </a-button>
        <a-button v-else type="primary" class="reapp-btn" @click="startreappraisal">
          开始评估
        </a-button>
        <a-button type="primary" class="del-btn" @click="delData">
          删除
        </a-button>
      </div>
    </section>
  </div>
</template>
<script>
import qs from 'qs';
import { dynamicEvaluationUpdate, dynamicEvaluationDel } from '@/api/dynamicEvaluation'
export default {
  props: {
    boxData: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({

  }),
  methods: {
    toDetail(val) {
      sessionStorage.evalId = this.boxData.id;
      sessionStorage.evalTime = this.boxData.evaluateTime || '';
      this.$router.push({name: 'dynamicDeail',params:{model: val }});
    },
    warningStatus(val) {
      let warnText = '',textClass = '';
      switch(parseInt(val)) {
        case 0:
          warnText = '健康';
          textClass = "text-heath";
          break;
        case 1:
          warnText = '轻警';
          textClass = "text-light";
          break;
        case 2:
          warnText = '重警';
          textClass = "text-weig";
          break;
        default:
          warnText = '健康';
          textClass = "text-heath";
          break;
      }
      return [warnText,textClass];
    },
    async startreappraisal() {
      let that = this;
      this.$confirm({
        title: '开始评估',
        content: `确定要开始评估该条数据吗?`,
        okText: '确认',
        cancelText: '取消',
        async onOk() {
          let params = {
            id: that.boxData.id,
            evaluator: ''
          };
          let res = await dynamicEvaluationUpdate(qs.stringify(params));
          const { code, message } = res;
          if (code === 200) {
            that.$message.success('评估成功！');
            that.$emit('updateboxData');
          }else {
            that.$message.error('评估失败！');
          }
        },
        onCancel() {
          that.$message.info('已取消评估！');
        },
      });
    },
    reappraisal() {
      let that = this;
      this.$confirm({
        title: '重新评估',
        content: `确定要重新评估该条数据吗?`,
        okText: '确认',
        cancelText: '取消',
        async onOk() {
          let params = {
            id: that.boxData.id,
            evaluator: ''
          };
          let res = await dynamicEvaluationUpdate(qs.stringify(params));
          const { code, message } = res;
          if (code === 200) {
            that.$message.success('评估成功！');
            that.$emit('updateboxData');
          }else {
            that.$message.error('评估失败！');
          }
        },
        onCancel() {
          that.$message.info('已取消评估！');
        },
      });
    },
    delData() {
      this.$confirm({
        title: '删除',
        content: `确定要删除该条数据吗?`,
        okText: '确认',
        cancelText: '取消',
        onOk: async () => {
          let params= {
            id: this.boxData.id
          }
          let res = await dynamicEvaluationDel(params);
          const { code, message } = res;
          if (code === 200) {
            this.$message.success('删除成功！');
            this.$emit('updateboxData');
          }else {
            this.$message.error(message)
          }
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
  },

}
</script>
<style lang="scss" scoped>
.dynamic-box {
	width: 440px;
	height: 285px;
	background-color: #f9fdfa;
	border: solid 1px #eeeeee;
  .title {
    height: 52px;
    border-bottom: 1px dotted #cccccc;
    margin: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .name {
      color: rgba(0, 0, 0, 0.85);
      font-weight: bold;
    }
    .title-stauts {
      .comp-btn {
        border: solid 1px #32b16c;
        background-color: #32b16c;
        border-radius: 10px;
      }
      .unfin-btn {
        border: solid 1px #f39800;
        background-color: #f39800;
        border-radius: 10px;
      }
      .nostart-btn {
        border: solid 1px #bfbfbf;
        background-color: #bfbfbf;
        border-radius: 10px;
      }
    }
  }
  .content {
    margin: 0 20px;
    div {
      line-height: 30px;
    }
    .btn-list{
      text-align: right;
      button {
        margin-left: 20px;
      }
      .detail-btn{
        background-color: #e5f3ff;
        border-radius: 6px;
        border: solid 1px #91caff;
        color: #1890ff;
      }
      .reapp-btn{
        background-color: #e9fffe;
        border: solid 1px #7eede7;
        border-radius: 6px;
        color: #01beb3;
      }
      .del-btn {
        background-color: #ffeded;
        border: solid 1px #ffb8b8;
        border-radius: 6px;
        color: #fc5a5a;
      }
    }
  }
}
</style>
