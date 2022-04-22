<!--
 * @Author: 任继民
 * @Date: 2020-11-19 15:40:49
 * @LastEditors: 任继民
 * @LastEditTime: 2021-05-18 14:33:22
 * @Description:
-->
<template>
  <div class="dynamic-eval">
    <breadcrumbs :headHeight="'50px'">
      <section class="search-plan">
        <a-form layout="inline" :form="form">
          <a-form-item label="区域范围">
            <a-select v-model="form.areaScope" style="width: 150px" default-value="" placeholder="请选择区域范围">
              <a-select-option value="">
                请选择区域范围
              </a-select-option>
              <a-select-option v-for="item in dislist" :key="item.id" :value="item.adCode">
                {{item.name}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="评估状态">
            <a-select v-model="form.status" style="width: 150px" default-value="" placeholder="请选择评估状态">
              <a-select-option value="">
                请选择评估状态
              </a-select-option>
              <a-select-option value="0">
                未完成
              </a-select-option>
              <a-select-option value="1">
                已完成
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="评估时间">
            <a-date-picker @change="onChangeTime" />
            <!-- <a-range-picker
              show-time
              format="YYYY/MM/DD HH:mm:ss"
              @change="onChangeTime"
            /> -->
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="initData" style="background: #397DC9;">
              查询
            </a-button>
          </a-form-item>
        </a-form>
        <div class="add-btn">
          <a-button type="primary" icon="plus" @click="addReapp" style="background: #397DC9;">
            新增评估
          </a-button>
        </div>
      </section>
    </breadcrumbs>
    <section class="dynamic-content" v-if="boxdata.length > 0">
      <div
        ref=""
        v-infinite-scroll="handleInfiniteOnLoad"
        class="infinite-container"
        :infinite-scroll-disabled="busy"
        :infinite-scroll-distance="10"
      >
        <div class="boxlist" v-for="item in boxdata" :key="item.id">
          <ContentBox :boxData.sync="item" @updateboxData="updateboxData"/>
        </div>
        <div v-if="loading && !busy" class="demo-loading-container">
          <a-spin />
        </div>
      </div>
    </section>
    <a-empty v-else />
    <a-modal class="access-model" width="90%" v-model="modelVisable" title="新增评估" @ok="handleOk">
      <AddAssess ref="addassess" :arealist="dislist" @onCloseModel="onCloseModel" v-if="modelVisable"/>
    </a-modal>
  </div>
</template>
<script>
import moment from 'moment';
import infiniteScroll from 'vue-infinite-scroll';
import breadcrumbs from '@/components/breadcrumbs/index.vue';
import ContentBox from './components/content-box.vue'
import AddAssess from './addAssess'
import { getDistrict, dynamicEvaluationSearch } from '@/api/dynamicEvaluation'
export default {
  components: {
    breadcrumbs,
    ContentBox,
    AddAssess
  },
  directives: { infiniteScroll },
  data:()=>({
    form:{},
    loading: false,
    busy: false,
    modelVisable: false,
    boxdata: [],
    dislist: [],
    Modaltitle: '新增动态评估'
  }),
  created() {
    this.initData();
  },
    mounted() {
      window.addEventListener("resize", this.changeWidth)
    },
    methods: {
    moment,
    async initData() {
      let dictparams= {
        name: '团风县'
      }
      let dislist = await getDistrict(dictparams);
      if (dislist.code === 200) {
        this.dislist = dislist.data;
      }
      let params = {
        areaScope: this.form.areaScope,
        status: this.form.status,
        time: this.form.time
      };
      let res = await dynamicEvaluationSearch(params);
      const { code, data } = res;
      if (code === 200) {
        this.boxdata = data;
      }
    },
    onChangeTime(date, dateString) {
      this.form.time = dateString;
    },
    handleOk() {
      this.$refs.addassess.addAssess();
      this.initData();
    },
    onCloseModel(value) {
      this.modelVisable = value;
    },
    updateboxData() {
      this.initData();
    },
    handleSubmit() {

    },
    disabledStartDate(current) {
      // Can not select days before today and today
      return current && current < moment().endOf('day');
    },
    disabledRangeTime(_, type) {
      if (type === 'start') {
        return {
          disabledHours: () => this.range(0, 60).splice(4, 20),
          disabledMinutes: () => this.range(30, 60),
          disabledSeconds: () => [55, 56],
        };
      }
      return {
        disabledHours: () => this.range(0, 60).splice(20, 4),
        disabledMinutes: () => this.range(0, 31),
        disabledSeconds: () => [55, 56],
      };
    },
    handleInfiniteOnLoad() {
      // this.loading = true;
      // setTimeout(() => {
      //   for (var i = 0, j = 10; i < j; i++) {
      //     this.boxdata++
      //   }
      //   console.log(this.data)
      //   this.loading = false
      // }, 1000)
    },
    addReapp() {
      this.modelVisable = true;
    },
    changeWidth() {

    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.changeWidth)
  },
}
</script>
<style lang="scss" scoped>
.dynamic-eval{
  .search-plan{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .add-btn {
      margin-right: 50px;
    }
  }
  .ant-empty {
    background: #FFFFFF;
    margin-top: 16px;
    padding: 20px 0;
  }
  .dynamic-content {
    /* margin: 19px 30px 0; */
    height: calc(100vh - 178px);;
    background-color: #FFFFFF;
    overflow-x: auto;
    .infinite-container {
      padding: 20px 0;
      display: grid;
      grid-template-rows: 1fr 1fr 1fr;
      grid-template-columns: repeat(auto-fill, 440px);
      justify-content: center;
      grid-gap: 20px;
      grid-row-gap: 20px;
      max-height: calc(100vh - 178px);
      overflow-y: auto;
      .boxlist {
        padding: 10px 10px;
        // margin: 20px 0;
      }
    }
  }
  .dynamic-content::-webkit-scrollbar {
    /*滚动条整体样式*/
    width : 4px;  /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
    cursor: pointer;
  }
  .dynamic-content::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
    background   : #e8e8e8;
  }
  .dynamic-content::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow   : inset 0 0 5px rgba(68, 68, 68, 0.2);
    border-radius: 10px;
    background   : #ededed;
  }
}
</style>
