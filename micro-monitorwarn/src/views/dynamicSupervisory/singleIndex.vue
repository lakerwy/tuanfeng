<!--
 * @Author: 任继民
 * @Date: 2020-12-30 11:18:31
 * @LastEditors: 任继民
 * @LastEditTime: 2020-12-31 16:18:19
 * @Description:单指标
-->
<template>
  <div class="single-index">
    <div class="vbreadcrumbs">
      <div class="vbreadcrumbs-ul">
        <div class="back-btn">
          <div class="back" @click="goBack">
            返回
          </div>
        </div>
        <!-- <li>监测评估预警 </li>
        <li class="vbreadcrumbs__divider">/</li>
        <li class="active">单指标</li> -->
      </div>
    </div>
    <Map :id="'singIndexMap'"/>
    <!-- 空间分析 -->
    <section class="spacAnaly" @click="spacAnaly" :class="{'spacAnaly-active': isSpaceActive}" v-if="false">
      <img
        :src="isSpaceActive ? require('../../assets/images/icon-kjfx-hover.png'): require('../../assets/images/icon-kjfx.png')"
        alt="" sizes="" srcset="">
      <span>空间分析</span>
    </section>
    <section class="left-tree" v-if="false">
      <div class="tree-title">监测指标体系</div>
      <DataTree
        :defaultProps="defaultProps"
        :data="treeData"
        @treeSelect="treeSelect"
      ></DataTree>
    </section>
    <section class="data-chart" v-if="!isSpaceActive">
      <section class="data">
        <div class="data-title">
          <div class="text">
            <span>{{ kpiName.kpiname }}</span>
            <span :style="{background: kpiName.isHealth == 2?'#eda169':'#87d068'}">
              {{ kpiName.isHealth == 2 ? '预警' : '健康' }}
            </span>
          </div>
          <div class="detail" v-if="false">详情</div>
        </div>
        <div class="data-content">
          <div v-for="item in datalist" :key="item.id" class="item-list">
            <div class="item-left">
              <i :style="{background: item.color}"></i>
              <span>{{ item.name }}</span>
            </div>
            <div class="item-right">
              <span class="num" :style="{color: item.color}">{{ item.num }}</span>
              <span class="unit">{{ item.unit }}</span>
            </div>
          </div>
        </div>
      </section>
      <section class="chart">
        <a-tabs type="card" class="data-tab">
          <a-tab-pane key="1" tab="监测值变化">
            <a-tabs default-active-key="1" class="item-tab" @change="monChangeTab">
              <a-tab-pane key="1" tab="趋势分析">
                <div id="trendChart" class="chart-content" style="padding-right:10px;"></div>
              </a-tab-pane>
              <a-tab-pane key="2" tab="环比分析">
                <div id="chainChart" class="chart-content" style="padding-left:20px;"></div>
              </a-tab-pane>
              <a-tab-pane key="3" tab="目标比对">
                <div id="targetComChart" class="chart-content"></div>
              </a-tab-pane>
              <a-tab-pane key="4" tab="占目标比例">
                <div id="targetRadioChart" class="chart-content"></div>
              </a-tab-pane>
            </a-tabs>
          </a-tab-pane>
          <a-tab-pane key="2" tab="监测值对比" v-if="false">
            <a-tabs default-active-key="1" class="item-tab" @change="monChangeTab">
              <a-tab-pane key="1" tab="与目标对比">
                <div id="trendChart1" class="chart-content"></div>
              </a-tab-pane>
              <a-tab-pane key="2" tab="环比">
                <div id="chainChart1" class="chart-content"></div>
              </a-tab-pane>
              <a-tab-pane key="3" tab="与目标差值">
                <div id="targetComChart1" class="chart-content"></div>
              </a-tab-pane>
            </a-tabs>
          </a-tab-pane>
        </a-tabs>
      </section>

    </section>

    <section v-else class="spacModel">

      <div class="setyear" v-if="!yearValue">
        <div class="year-text">年份设置</div>
        <div>
          <img src="../../assets/images/icon-提示.png" alt="">
          <p>针对空间类指标，可进行不同年份指标数据调整情况分析</p>
        </div>
      </div>
      <div v-else>
        <a-alert class="error" message="后一年份值必须大于前一年份" type="error" show-icon/>
      </div>

      <div class="last-year">
        <div class="year-text">前一年份</div>
        <a-select style="width: 100%" placeholder="请选择前一年份" @change="handleChange2">
          <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i" :value=i>
            {{ 2000 + i }}
          </a-select-option>
        </a-select>
      </div>
      <div class="follow-year">
        <div class="year-text">后一年份</div>
        <a-select style="width: 100%" placeholder="请选择后一年份" @change="handleChange1">
          <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i" :value=i>
            {{ 2000 + i }}
          </a-select-option>
        </a-select>
      </div>

      <div class="btn-list">
        <a-button>取消</a-button>
        <a-button type="primary" @click="selectError">开始分析</a-button>
      </div>
    </section>
    <!--分析结果  -->

    <!-- 年份滑块   -->
    <section class="slider">
      <a-slider v-model="slidValue" :min="0" :max="4" :marks="marks" :step="null" :default-value="0" :dots="true"
                :tooltip-visible="false" @change="sliderChange"/>
    </section>
  </div>
</template>
<script>
import Map from '@/components/map/index.vue';
import {createVectorLayer, removeLayerByAttr} from "@/mapjs/layer.js";
import DataTree from '../periodicEvaluation/components/tree.vue'
import {getBusiness} from '@/api/dynamicSupervisory'
import {createTree} from '@/libs/libs'
import {initEcharts} from '@/libs/chart';
import echartsOptions from './componetnts/echartOption';
import {getTFGeoJSON} from "../../mapjs/getTFGeoJSON";
import GeoJSON from "ol/format/GeoJSON";
import {Icon, Fill, Text, Stroke, Style} from 'ol/style';
import {getViewDetail, getViewTable} from "../../api/dynamicSupervisory";
import {valueTofixed} from "../../utils/utils";

export default {
  components: {
    Map,
    DataTree
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        title: 'name',
        key: "key",
      },
      slidValue: 4,
      kpiName: this.$route.params.kpiName,
      marks: {
        0: `${this.$route.params.kpiName.year-4}年`,
        1: `${this.$route.params.kpiName.year-3}年`,
        2: `${this.$route.params.kpiName.year-2}年`,
        3: `${this.$route.params.kpiName.year-1}年`,
        4: `${this.$route.params.kpiName.year}年`
      },
      datalist: [
        {id: '1', name: '监测值', num: '2429.16  ', color: '#eda169', unit: '平方千米'},
        {id: '2', name: '规划目标', num: '2312.00', color: '#30a5ff', unit: '平方千米'},
        {id: '3', name: '环比增长', num: '0', color: '#5ec26d', unit: '%'},
        {id: '4', name: '增长量', num: '0', color: '#687ce5', unit: '平方千米'},
      ],
      isSpaceActive: false,
      treeData: [],
      year1: '0',
      year2: '0',
      yearValue: false,
      viewMapData: [],
    }
  },
  created() {
    this.getKpiNameData();
  },
  async mounted() {
    await this.initTreeData();
    await this.initGeoData();
    await this.getViewMap(this.kpiName.year);
    await this.monChangeTab('1');
    await this.getChartTable();
  },
  methods: {
    //右侧详情数据
    getKpiNameData(){
      this.datalist[0].num=this.kpiName.mvalue;
      this.datalist[0].unit=this.kpiName.unit;
      this.datalist[1].num=this.kpiName.targetValue;
      this.datalist[1].unit=this.kpiName.unit;
      this.datalist[3].unit=this.kpiName.unit;
    },
    async initTreeData() {
      let res = await getBusiness();
      const {success, body} = res;
      if (success) {
        this.treeData = createTree(body, 'parentId');
      }
    },
    treeSelect() {

    },
    goBack() {
      this.$router.push({name: 'dynamicSupervisory'});
    },
    spacAnaly() {

      console.log(this.isSpaceActive);
      this.isSpaceActive = !this.isSpaceActive;
    },
    handleChange1(value) {
      this.year1 = value;
    },
    handleChange2(value) {
      this.year2 = value;
    },
    selectError() {
      if (this.year2 < this.year1) {
        this.yearValue = false
      } else {
        this.yearValue = true
      }
      // console.log(this.year1)
      // console.log(this.year2)
      // console.log(this.yearValue)
    },
    monChangeTab(activeKey) {
      switch (activeKey) {
        case '1':
          this.$nextTick(() => {
            initEcharts('trendChart', echartsOptions.trendOption);
          })
          break;
        case '2':
          this.$nextTick(() => {
            initEcharts('chainChart', echartsOptions.chainOption);
          })
          break;
        case '3':
          this.$nextTick(() => {
            initEcharts('targetComChart', echartsOptions.targetComOption);
          })
          break;
        case '4':
          this.$nextTick(() => {
            initEcharts('targetRadioChart', echartsOptions.targetRadioOption);
          })
          break;
        default:
          break;
      }
    },
    getTrendMsg(res){
      let year = [], value = [], rator = [], target = [], targetRaio = [];
      res.monitroV.map(item=>{
        year.push(item.year);
        value.push(valueTofixed(item.sum))
      })
      res.tarV.map(item => {
        target.push(item.sum || 0)
      })
      rator[0] = 100;
      for (let i = 1; i < value.length; i++) {
        rator[i] = valueTofixed((value[i]/value[i-1] - 1)*100)
      }
      for(let i= 0; i<value.length; i++){
        if(target[i]){
          targetRaio[i] = valueTofixed((value[i]/target[i])*100)
        } else {
          targetRaio[i] = 0;
        }
      }
      //设置趋势分析
      this.$set(echartsOptions.trendOption.yAxis[0], 'name', this.kpiName.unit)
      this.$set(echartsOptions.trendOption.xAxis, 'data', year)
      this.$set(echartsOptions.trendOption.series[0], 'data', value)
      this.$set(echartsOptions.trendOption.series[1], 'data', rator)
      //设置环比分析
      this.$set(echartsOptions.chainOption.xAxis[0], 'data', year)
      this.$set(echartsOptions.chainOption.series[1], 'data', rator)
      //设置目标比对
      this.$set(echartsOptions.targetComOption.yAxis[0], 'name', this.kpiName.unit)
      this.$set(echartsOptions.targetComOption.xAxis[0], 'data', year)
      this.$set(echartsOptions.targetComOption.series[0], 'data', target)
      this.$set(echartsOptions.targetComOption.series[1], 'data', target)
      //设置占目标比例
      this.$set(echartsOptions.targetRadioOption.yAxis[0], 'data', year)
      this.$set(echartsOptions.targetRadioOption.series[0], 'data', targetRaio)
      initEcharts('trendChart', echartsOptions.trendOption);
    },
    //获取检测值变化信息
    async getChartTable(){
      let params = {
        kpiid: this.kpiName.kpiid,
      }
      let res = await getViewTable(params);
      if(res.code == 200){
        this.chartTableData = res.data;
        this.getTrendMsg(res.data);
      }
    },
    //获取地图上数字
    async getViewMap(year){
      let params = {
        kpiid: this.kpiName.kpiid,
        year: year,
      }
      let res = await getViewDetail(params);
      this.viewMapData = [];
      if(res.code == 200){
        this.viewMapData = res.data;
        this.viewMapData.forEach((item)=>{
          if(item.arcode == '421121'){
            this.datalist[0].num = item.mvalue || 0;
            this.datalist[1].num = item.targetValue || 0;
          }
        })
        this.addFeatureByArea();
      }
    },
    selectArcode(arr,arcode){
      let num;
      arr.forEach(item=>{
        if(item.arcode == arcode){
          num = item.mvalue
        }
      })
      return num;
    },
    sliderChange(value) {
      let sliderYear = this.kpiName.year - (4 - value);
      this.getViewMap(sliderYear);
    },
    // 绘制地图
    async initGeoData() {
      let res = await getTFGeoJSON();
      if (res) {
        this.geolist = res[1];
        // this.addFeatureByArea()
      }
    },
    // 创建空的矢量图层
    createEmptyLayer() {
      let params = {
        type: 0,
      };
      this.drawLayer = createVectorLayer(params); // 开始绘制时创建空的矢量图层
      this.drawLayer.set("layerType", "geoLayer");
      window.monitirMap.addLayer(this.drawLayer);
    },
    // 将feature添加到地图上
    addFeatureByArea() {
      let imgUrl = require("../../assets/images/mark.png")
      // 先移除之前点击的图层
      removeLayerByAttr(window.monitirMap, "layerType", "geoLayer");
      this.createEmptyLayer();
      if (!this.geolist.features) return;
      this.geolist.features.forEach((itm, index) => {
        const addFe = new GeoJSON().readFeature(itm);
        let num = this.selectArcode(this.viewMapData,itm.properties.ad_code) || 0;
        num = valueTofixed(num);
        const colorArr = ['#45819a', '#67aab7', '#d1eeea', '#afe1dd', '#45739a', '#45819a', '#67aab7', '#d1eeea', '#afe1dd', '#45739a'];
        let styleFunction = function (addFe) {
          let style = null;
          style = [
            new Style({
              stroke: new Stroke({
                color: '#000', //面的边界线颜色
                width: 1         //边界线宽
              }),
              text: new Text({
                font: "12px 微软雅黑 ",
                text: itm.properties.Name,
                fill: new Fill({
                  color: "#fff",
                }),
              }),
              fill: new Fill({
                //矢量图层填充颜色，以及透明度
                color: colorArr[index]
              }),
            })
          ]
          let point = addFe.getGeometry().getInteriorPoint();
          style.push(new Style({
            geometry: point,
            image: new Icon({
              anchor: [0.5, 0.96],
              crossOrigin: 'anonymous',
              src: imgUrl,
            }),
            text: new Text({
              font: "12px 微软雅黑 ",
              text: `${num}`,
              offsetX: 0,
              offsetY: -25,
              fill: new Fill({
                color: "#ffffff",
              }),
            }),
          }))
          return style;
        }
        this.drawLayer.getSource().addFeature(addFe);
        addFe.setStyle(styleFunction);
      })

    },
  },
}
</script>
<style lang="scss">
@import '../../assets/styles/common.scss';
// .vbreadcrumbs-ul{
//   height: 1px;
// }
.back-btn {
  position: absolute;
  right: 45px;
  top: 8px;

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

.single-index {
  position: relative;
  width: 100%;
  height: 100%;

  .my-map {
    height: calc(100vh - 174px);

    .containerMap {
      padding: 0 20px 0;
    }
  }

  .spacAnaly {
    position: absolute;
    right: 468px;
    top: 90px;
    width: 104px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    background-color: #ffffff;
    box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.25);
    border-radius: 3px;
    color: #454954;
    font-size: 14px;
    cursor: pointer;

    img {
      margin-right: 8px;
    }
  }

  .spacAnaly-active {
    background-color: #1890ff;
    color: #ffffff;
  }

  .error {
    margin-top: 40px;

  }

  .left-tree {
    position: absolute;
    top: 90px;
    left: 51px;
    width: 342px;
    height: 523px;
    background-color: #ffffff;
    box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.25);
    border-radius: 3px;

    .tree-title {
      font-size: 16px;
      font-weight: bold;
      color: #454954;
      padding: 15px 0 15px 23px;
    }

    .itemTree {
      padding: 0 18px;
      height: calc(100% - 58px);
    }
  }

  .data-chart {
    position: absolute;
    top: 70px;
    right: 80px;

    .data {
      width: 402px;
      height: 208px;
      background-color: #ffffff;
      box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.25);
      border-radius: 3px;

      .data-title {
        display: flex;
        justify-content: space-between;
        padding: 10px 23px;

        .text {
          span:first-child {
            font-size: 16px;
            font-weight: bold;
            color: #454954;
          }

          span:last-child {
            margin-left: 14px;
            display: inline-block;
            width: 44px;
            height: 20px;
            background-color: #eda169;
            border-radius: 4px;
            text-align: center;
            color: #ffffff;
            font-size: 12px;
          }
        }

        .detail {
          font-size: 14px;
          color: #1890ff;
          cursor: pointer;
        }
      }

      .data-content {
        .item-list {
          padding: 0 40px;
          display: flex;
          justify-content: space-between;

          .item-left {
            i {
              display: inline-block;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              margin-right: 11px;
            }

            span {
              color: #6f7583;
              font-size: 14px;
            }
          }

          .item-right {
            .num {
              font-family: DINNextW1G;
              font-size: 24px;
              margin-right: 11px;
            }

            .unit {
              font-size: 12px;
              color: #6f7583;
            }
          }
        }
      }
    }

    .chart {
      width: 402px;
      height: 506px;
      background-color: #ffffff;
      box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.25);
      border-radius: 3px;
      margin-top: 16px;

      .data-tab {
        padding-top: 16px;

        .item-tab {
          .ant-tabs-bar {
            .ant-tabs-tab {
              margin: 0;
            }
          }
        }

        .chart-content {
          height: 372px;

        }
      }
    }
  }

  .spacModel {
    position: absolute;
    top: 90px;
    right: 50px;
    width: 402px;
    height: 252px;
    background-color: #ffffff;
    box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.25);
    border-radius: 3px;

    .setyear, .last-year, .follow-year {
      display: flex;
      justify-content: flex-start;
    }

    .setyear {
      margin-top: 26px;

      .year-text {
        margin-left: 22px;
        margin-right: 17px;
        width: 68px;
        font-size: 16px;
        font-weight: bold;
        color: #454954;
      }

      div:last-child {
        width: 268px;
        display: flex;
        align-items: flex-start;

        img {
          vertical-align: middle;
        }
      }
    }

    .last-year, .follow-year {
      margin-top: 20px;

      .year-text {
        margin-left: 35px;
        margin-right: 17px;
        width: 56px;
      }

      .ant-select {
        width: 268px !important;
      }
    }

    .btn-list {
      margin-top: 20px;
      text-align: right;
      margin-right: 26px;

      button:first-child {
        margin-right: 20px;
      }
    }
  }

  .slider {
    position: absolute;
    bottom: 50px;
    left: 20%;
    width: 600px;
    height: 50px;
    background: rgba(255, 255, 255, 0.9);
    padding: 0 30px;
    box-shadow: 5px 5px 5px gray;
  }
}
</style>
