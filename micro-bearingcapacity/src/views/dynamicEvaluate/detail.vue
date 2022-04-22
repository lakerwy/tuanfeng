<!--
 * @Author: 任继民
 * @Date: 2020-11-20 09:58:28
 * @LastEditors: 任继民
 * @LastEditTime: 2021-05-18 09:23:38
 * @Description:
-->
<template>
  <div class="dynamic-detail">
    <breadcrumbs :headHeight="'55px'">
      <section class="search-plan">
        <a-form layout="inline" :form="form">
          <a-form-item label="区域范围">
            {{this.$route.params.model.adName}}
          </a-form-item>
          <a-form-item label="评估任务">
            <a-select v-model="form.taskid" style="width: 150px"  placeholder="请选择评估状态" @change="taskNameChange">
              <a-select-option :value="item.id + ''" v-for="item in evallist" :key="item.id">
                {{item.taskName}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
        <div class="back-btn">
          <div class="back" @click="goBack">
            返回
          </div>
        </div>
      </section>
    </breadcrumbs>
    <Map :id="'detailspace'" :image="image"/>
    <my-legend :lists="lists" :maxHeight="180" :type="'box'" class="myLegend" />
    <section class="datatree">
      <section>承载能力监测预警</section>
      <DataTree
        :defaultProps="defaultProps"
        :data="treeData"
        @treeSelect="treeSelect"
        :defaultExpandedKeys="defaultExpandedKeys"
      ></DataTree>
    </section>
    <section class="right-col">
      <section class="data-action">
        <div class="eval-time">评价时间：{{evalTime}}</div>
        <div class="action-btn">
          <a-button type="primary" @click="startreappraisal">启动分析</a-button>
          <a-button type="primary" @click="exportData">导出报告</a-button>
        </div>
      </section>
      <section class="data-table">
        <div class="table-title">{{currentTitle}}</div>
        <a-table :columns="columns" :data-source="tableData" bordered :pagination="false" :scroll="{ y: 275 }">
          <template slot="warningStatus" slot-scope="warningStatus">
            <div v-if="warningStatus ==0" class="success">
              <i class="tag"></i>
              <span>健康</span>
            </div>
            <div v-else-if="warningStatus==1" class="info">
              <i class="tag"></i>
              <span>轻警</span>
            </div>
            <div v-else class="warning">
              <i class="tag"></i>
              <span>重警</span>
            </div>
          </template>
          <template slot="overloadStatus" slot-scope="overloadStatus">
            <span v-if="overloadStatus==0">不超载</span>
            <span v-else-if="overloadStatus==1">临界超载</span>
            <span v-else>超载</span>
          </template>
          <template slot="name" slot-scope="text">
            <div class="customText warning">
              <i class="tag"></i>
              <span>{{text}}</span>
            </div>
          </template>
        </a-table>
      </section>
      <section class="chart-show">
        <section class="title">
          <div class="text">{{currentTitle}}</div>
          <!-- <div class="select">
            <i>维度:</i>
            <a-select default-value="" style="width: 120px" @change="handleChange">
              <a-select-option :value="item" v-for="(item,index) in selectOptions" :key="index">
                {{item.name}}
              </a-select-option>
            </a-select>
          </div> -->
        </section>
        <Chart :data="tableData" :fieldValue="fieldValue"/>
      </section>
    </section>

  </div>
</template>
<script>
const columns = [
  {
    title: '行政区',
    dataIndex: 'qhname',
    headerAlign: 'center',
    align: 'center'
  },
  {
    title: '预警状态',
    dataIndex: 'warningStatus',
    scopedSlots: { customRender: 'warningStatus' },
    align: 'center'
  },
  {
    title: '超载情况',
    dataIndex: 'overloadStatus',
    scopedSlots: { customRender: 'overloadStatus' },
    align: 'center'
  },
  // {
  //   title: '预警状态',
  //   className: 'column-money',
  //   dataIndex: 'statename',
  //   scopedSlots: { customRender: 'statename' },
  // }
];

// import { mapActions } from 'vuex';
import breadcrumbs from '@/components/breadcrumbs/index.vue';
import Map from '@/components/map/index.vue';
import DataTree from './components/tree.vue';
import myLegend from '@/components/legend/index'
import Chart from './components/chart.vue'
import { GetMxdInfoByType, dynamicEvaluationUpdate, getconfiglCzl, getIntegratedMonitoring, getEvaluationDetail,dynamicEvaluationSearch } from '@/api/dynamicEvaluation'
import Http from "@/utils/request";
import GeoJSON from "ol/format/GeoJSON";
import { getTFGeoJSON } from "../../mapjs/getTFGeoJSON";
import { createVectorLayer, removeLayerByAttr } from "@/mapjs/layer.js";
import { Circle as CircleStyle, Fill, Text, Stroke, Style } from "ol/style";
export default {
  components: {
    breadcrumbs,
    Map,
    DataTree,
    myLegend,
    Chart
  },
  data: ()=>({
    tableData: [],
    evalTime: sessionStorage.evalTime,
    columns,
    layers: null,
    image: null,
    allLegend: [],
    form: {},
    lists: [
      {color: '#5ec26d', desc: '健康', value: 0},
      {color: '#f6d641', desc: '轻警', value: 1},
      {color: '#d19159', desc: '重警', value: 2},
    ],
    defaultProps: {
      children: 'children',
      title: 'title',
      key: "key"
    },
    currentTitle: '水资源约束下城镇建设承载规模',
    evallist: [],
    selectOptions: [],
    treeData: [],
    defaultExpandedKeys: [],
    fieldValue: '',
    detailData: {}
  }),
  created() {
    this.getEvalName();
    // this.initLegend();
  },
  async mounted() {
    await this.initGeoData();
    await this.initTable();
    await this.initData();
  },
  methods: {
    async initData() {
      let res = await getconfiglCzl();
      if (res.code === 200) {
        res.data.forEach(item => {
          item.title = item.modername;
          item.key = item.id;
          item.isLeaf = true;
        })
        this.treeData = res.data;
        console.log(this.treeData)
        this.treeSelect(res.data[0])
      }
    },
    async getEvalName() {
      let res = await dynamicEvaluationSearch();
      const { code, data } = res;
      if (code === 200) {
        this.evallist = data;
        this.form.taskid = sessionStorage.evalId;
      }
    },
    async initTable() {
      let params = {
        id: sessionStorage.evalId
      };
      let res = await getEvaluationDetail(params);
      if (res.code == 200) {
        this.detailData = res.data;
      }
    },
    async treeSelect(info) {
      if (info) {
        this.currentTitle = info.modername;
        this.tableData = this.detailData[info.spjtype];
        this.addFeatureByArea();
        // this.getTableData(info);
      }
      // 加载所有的图例
      // if (this.allLegend,length === 0) {
      //   let url = info.MapServerPath + '/legend?f=pjson';
      //   let res = await Http.get(url);
      //   this.allLegend = res.layers;
      // }
      // let params = {
      //   type:"arcgis",
      //   url: info.MapServerPath,
      //   layers: "show:" + info.id,
      //   layerName: info.id
      // }

      // this.image = params;
      // let legendObj = this.allLegend.filter(item => {
      //   return item.layerId === info.id
      // })
      // this.lists = legendObj.length > 0 ? legendObj[0].legend : [];
    },
    async getTableData(item) {
      let params = {
        adCode: '42',
        type: item.type
      };
      let res =  await getIntegratedMonitoring(params);
      if ( res.code === 200) {
        this.tableData = res.data.data;
        this.selectOptions = [];
        Object.keys(res.data.notes).map((key)=> {
          res.data.notes[key].match(/\（(.+)\）/g);
          let obj = {};
          obj.key = key;
          obj.unit = RegExp.$1;
          obj.name = res.data.notes[key].replace(/\（.*?\）/g,'');
          this.selectOptions.push(obj)
        })
        console.log(this.selectOptions)
        this.fieldValue = this.selectOptions[0]?.key;
      }
    },
    exportData() {
      window.location.href = `${window.globalUrl.DYNAMIC_URL}/file/pdf_export`
    },
    // handleChange(val) {
    //   this.fieldValue = val;
    // },
    async startreappraisal() {
      let that = this;
      this.$confirm({
        title: '开始评估',
        content: `确定要开始评估该条数据吗?`,
        okText: '确认',
        cancelText: '取消',
        async onOk() {
          let params = {
            id: sessionStorage.evalId,
            evaluator: ''
          };
          let res = await dynamicEvaluationUpdate(params);
          const { code, message } = res;
          if (code === 200) {
            that.$message.success('评估成功！');
          }else {
            that.$message.error('评估失败！');
          }
        },
        onCancel() {
          that.$message.info('已取消评估！');
        },
      });
    },
    taskNameChange(val) {
      this.form.taskid = val;
      this.initTable();
      this.initData();
    },
    goBack() {
      sessionStorage.removeItem('evalId');
      sessionStorage.removeItem('evalTime');
      this.$router.push({name: 'dynamicEvaluate'});
    },
    async initGeoData() {
      let res = await getTFGeoJSON();
      if (res) {
        // window.TF_XIAN = res[0];
        this.geolist = res[1];
      }
    },
    // 创建空的矢量图层
    createEmptyLayer() {
      let params = {
        type: 0,
      };
      this.drawLayer = createVectorLayer(params); // 开始绘制时创建空的矢量图层
      this.drawLayer.set("layerType", "geoLayer");
      window.bearingMap.addLayer(this.drawLayer);
    },
    // 将feature添加到地图上
    addFeatureByArea() {
      if (!this.geolist.features) return;
      // 先移除之前点击的图层
      removeLayerByAttr(window.bearingMap, "layerType", "geoLayer");
      this.createEmptyLayer();

      this.tableData.forEach(item => {
        this.geolist.features.forEach(itm => {
          if (item.qhdm == itm.properties.ad_code) {
            const addFe = new GeoJSON().readFeature(itm);
            let tempcoll = '';
            switch(parseInt(item.warning_status)) {
              case 0:
                tempcoll = '#5ec26d';
                break;
              case 1:
                tempcoll = '#f6d641';
                break;
              case 2:
                tempcoll = '#eda169';
                break;
              default:
                tempcoll = '#5ec26d';
                break;
            }
            let style = new Style({
              fill: new Fill({
                //矢量图层填充颜色，以及透明度
                color: tempcoll,
              }),
              stroke: new Stroke({
                color: '#fff', //面的边界线颜色
                width: 2         //边界线宽
              }),
              text: new Text({
                font: "14px 微软雅黑 ",
                text: itm.properties.Name,
                offsetX: 0,
                offsetY: 0,
                fill: new Fill({
                  color: "#fff",
                }),
              }),
            });
            addFe.setStyle(style);
            this.drawLayer.getSource().addFeature(addFe);
          }
        })
      })
    },
  },
}
</script>
<style lang="scss">
.dynamic-detail{
  width: 100%;
  height: 100%;
  position: relative;
  .content {
    .search-plan {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .back-btn {
      margin-right: 20px;
      .back {
        background-color: #e5f2ff;
        border-radius: 4px;
        border: solid 1px #91caff;
        text-align: center;
        font-size: 14px;
        color: #1890ff;
        padding: 4px 19px;
        cursor: pointer;
      }
    }
  }

  .page-tab{
    display: flex;
    justify-content: center;
  }
  .my-map{
    height: calc(100vh - 135px);
    .containerMap{
      padding: 0;
    }
    .map-tools {
      right: 8px;
    }
  }
  .myLegend {
    position: absolute;
    bottom: 84px;
    left: 410px;
  }
  .datatree {
    width: 342px;
    height: calc(100vh - 260px);
    background-color: #ffffff;
    box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.25);
    border-radius: 3px;
    position: absolute;
    top: 65px;
    left: 51px;
    section {
      font-size: 16px;
      font-weight: bold;
      color: #454954;
      padding: 24px;
    }
    .itemTree {
      padding-left: 23px;
      height: calc(100% - 72px);
    }
  }
  .right-col{
    position: absolute;
    top: 65px;
    right: 51px;
    .data-action {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #ffffff;
      box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.25);
      height: 64px;
      border-radius: 3px;
      margin-bottom: 16px;
      .eval-time{
        color: #454954;
        font-weight: bold;
        padding-left: 19px;
      }
      .action-btn{
        padding-right: 20px;
        button:last-child {
          margin-left: 10px;
        }
      }
    }
    .data-table {
      width: 482px;
      background-color: #ffffff;
      box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.25);
      border-radius: 3px;
      .table-title {
        font-size: 16px;
        font-weight: bold;
        color: #454954;
        padding: 19px 0 15px 18px;
      }
    }
    .chart-show {
      margin-top: 16px;
      background-color: #ffffff;
      box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.25);
      border-radius: 3px;
      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 30px 10px 19px;
        .text {
          font-size: 16px;
          font-weight: bold;
          color: #454954;
        }
        .select {
          i {
            color: #6f7583;
            margin-right: 12px;
          }
        }
      }
    }
  }
}
.warning {
  .tag {
    background-color: #eda169;
    display: inline-block;
    width: 8px;
    height: 8px;
    margin-right: 9px;
  }
  color: #eda169;
}
.success {
  .tag {
    background-color: #5ec26d;
    display: inline-block;
    width: 8px;
    height: 8px;
    margin-right: 9px;
  }
  color: #5ec26d
}
.info {
  .tag {
    background-color: #f6d641;
    display: inline-block;
    width: 8px;
    height: 8px;
    margin-right: 9px;
  }
  color: #f6d641
}
</style>
<style>
th.column-money,
td.column-money {
  text-align: center !important;
}
</style>
