<!--
 * @Author: 任继民
 * @Date: 2020-11-30 14:53:20
 * @LastEditors: 任继民
 * @LastEditTime: 2021-06-22 14:43:11
 * @Description:
-->
<template>
  <div class="quest-supp">
    <div class="quest-content">
      <QuestList @questList="questList"/>
    </div>
    <div class="content-list">
      <section class="suggest-btn">
        <a-button type="primary" icon="message" @click="hanldSuggest" style="background: #397DC9;">决策建议</a-button>
      </section>
      <div class="chart-list">
        <div class="quest-trend-left" v-for="(item,index) in listItem" :key="index">
          <questionChart :chartTitle="item" :mapid="'trendChart'+index"/>
        </div>
      </div>
    <!--<div class="v-tablehead">
      <div class="total">
        <img src="../../assets/imgs/icon-total.png" alt="" srcset="">
        <span class="text">当前数据：</span>
        <span class="num">{{pageInfo.total}}条</span>
      </div>
    </div>-->
    </div>

    <!-- <div class="quest-trend-left">
      <questionChart :chartTitle="'现状城镇建设用地面积历年变化趋势'" :mapid="'trendChart'"/>
      <questionChart :chartTitle="'水资源约束下城镇承载规模历年变化趋势'" :mapid="'writetrendChart'"/>
    </div>
    <div class="quest-trend-right">
      <questionChart :chartTitle="'城镇建设承载规模历年变化趋势'" :mapid="'trendChartR'"/>
      <questionChart :chartTitle="'土地资源约束下城镇建设承载规模历年变化趋势'" :mapid="'writetrendChartR'"/>
    </div> -->
    <a-modal
      title="决策支持建议"
      :visible="modalVisible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model :model="form" layout="horizontal" :rules="rules" ref="ruleForm">
        <a-form-model-item label="选择超载因子" class="suggest-yz" prop="factor">
          <a-select v-model="form.factor"  placeholder="选择超载因子"  style="width: 300px"
           >
            <a-select-option value="szycz">
              水资源超载
            </a-select-option>
            <a-select-option value="szyljcz">
              水资源临界超载
            </a-select-option>
            <a-select-option value="tdcz" >
              土地超载
            </a-select-option>
            <a-select-option value="tdljcz">
              土地临界超载
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item prop="advise">
          <div>请输入建议</div>
          <a-textarea v-model="form.advise" placeholder="请输入建议" :auto-size="{ minRows: 4, maxRows: 6 }" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import qs from 'qs'
import QuestList from './components/questionlist.vue';
import questionChart from './components/questionChart.vue';
import echartsOptions from './components/echartOption';
import { initEcharts } from '@/libs/chart';
import { getQuestionDetails, setDecisionSuggest } from '@/api/decisionsupport'
export default {
  components: {
    QuestList,
    questionChart
  },
  data: () => ({
    pageInfo: {
      current: 1,
      pageSize: 10,
      total: 0
    },
    form: {},
    listItem: [],
    confirmLoading: false,
    modalVisible: false,
    rules: {
      factor: [
        { required: true, message: '请选择超载因子', trigger: 'blur' },
      ],
      // advise: [
      //   { required: true, message: 'Please select Activity zone', trigger: 'change' }
      // ],
    },
  }),
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      initEcharts('trendChart',echartsOptions.trendOptions);
      initEcharts('writetrendChart',echartsOptions.writeOptions);
      initEcharts('trendChartR',echartsOptions.trendlineOptions);
      initEcharts('writetrendChartR',echartsOptions.lineOptions);
    },
    async questList(item) {
      this.form.questionId = item.id;
      this.form = item;
      let params = {
        questionId: item.id
      };
      let res = await getQuestionDetails(params);
      const { code, data } = res;
      if (code ===200) {
        this.listItem = Object.keys(data);
        const objData = {};
        this.listItem.forEach((item,index) => {
          objData[`Name${index}`] = [];
          objData[`Data${index}`] = [];
          data[item].forEach(itm => {
            objData[`Name${index}`].push(itm.year);
            objData[`Data${index}`].push(itm.xzczjsydmj)
          })
        })
        this.$nextTick(() => {
          this.listItem.forEach( (item,index)=> {
            let regex1 = /\（(.+?)\）/g;
            let yAxiName = item.match(regex1);
            this.$set(echartsOptions.writeOptions.xAxis[0], 'data', objData[`Name${index}`]);
            this.$set(echartsOptions.writeOptions.series[0], 'data', objData[`Data${index}`]);
            this.$set(echartsOptions.writeOptions.series[0], 'name', item);
            initEcharts(`trendChart${index}`, echartsOptions.writeOptions);
          });
        })
      }else {
        this.listItem = [];
      }
    },
    hanldSuggest() {
      this.modalVisible = true;
    },
    handleOk() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          let params = {
            advise: this.form.advise,
            factor: this.form.factor,
            questionId: this.form.questionId
          };
          let res = await setDecisionSuggest(qs.stringify(params));
          const { code, message } = res;
          if (code===200) {
            this.$message.success('保存成功');
            this.modalVisible = false;
          }else{
            this.$message.warn(message);
          }
        }
      })
    },
    handleCancel() {
      this.modalVisible = false;
    }
  },
}
</script>
<style lang="scss" scoped>
.quest-supp {
  display: flex;
  .quest-content{
    margin: 0 16px;
  }
  .content-list {
    width: 100%;
    .suggest-btn {
      background: #ffffff;
      text-align: right;
      padding: 5px 0;
    }
    .chart-list {
      display: flex;
      justify-content: space-between;
      flex-flow: wrap;
      height: calc(100vh - 180px);
      background: #ffffff;
      .quest-trend-left{
        margin-left: 20px;
        margin-right: 20px;
        section {
          height: 259px;
          div {
            height: 259px;
            width: 518px;
          }
        }
      }
    }
  }


  .quest-trend-right {
    margin-right: 20px;
    height: calc(100vh - 224px);
    width: 40%;
    section {
      height: 50%;
    }
  }
}
.suggest-yz {
  display: flex;
}
</style>
