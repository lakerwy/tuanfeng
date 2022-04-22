<!--
 * @Author: 任继民
 * @Date: 2020-12-08 14:27:39
 * @LastEditors: 任继民
 * @LastEditTime: 2021-06-17 09:14:23
 * @Description:
-->
<template>
  <div class="adddynamic-detail">
    <Map :id="'detailspace'" :image="image" class=""/>
    <section class="datatree">
      <section class="addinfo">
        <a-form-model ref="ruleForm" labelAlign="right" :rules="rules" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="评估任务名称" prop="taskName">
            <a-input v-model="form.taskName" />
          </a-form-model-item>
          <a-form-model-item label="行政区" prop="adName">
            <a-select v-model="form.adName" placeholder="请选择行政区" @change="handleChange">
              <a-select-option v-for="item in arealist" :key="item.adCode" :value="item.adCode">
                {{item.name}}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="年份" prop="year">
            <a-select v-model="form.year" placeholder="请选择年份">
              <a-select-option v-for="(item, index) in 20" :key="index" :value="currentYear - index">
                {{currentYear - index}}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="绘制范围">
            <a-button class="draw" type="primary" @click="drawArea">绘制范围</a-button>
          </a-form-model-item>
        </a-form-model>
      </section>
      <section class="selmodel-title">选择模型
        <div v-if="selModel">请选择模型</div>
      </section>
      <section class="tree-data">
        <DataTree
          :checkable="true"
          :defaultProps="defaultProps"
          :data="treeData"
          @treeCheck="treeCheck"
          :onLoadData="onLoadData"
        ></DataTree>
      </section>
    </section>
  </div>
</template>
<script>
import GeoJSON from "ol/format/GeoJSON";
import moment from 'moment';
import breadcrumbs from '@/components/breadcrumbs/index.vue';
import Map from '@/components/map/index.vue';
import DataTree from './components/tree.vue';
import myLegend from '@/components/legend/index'
import { drawEvent, removeDrawInteraction } from "@/mapjs/interaction/draw.js";
import { createVectorLayer,removeLayerByAttr } from "@/mapjs/layer.js";
import { GetMxdInfoByType, dynamicEvaluationAdd, getconfiglCzl, selectbyspjype  } from '@/api/dynamicEvaluation'
import Http from "@/utils/request";
import { getTFGeoJSON } from "../../mapjs/getTFGeoJSON";
import { Circle as CircleStyle, Fill, Text, Stroke, Style } from "ol/style";
export default {
  props: {
    arealist: {
      type: Array,
      default: () => []
    }
  },
  components: {
    breadcrumbs,
    Map,
    DataTree,
    myLegend,
  },
  data: ()=>({
    layers: null,
    image: null,
    allLegend: [],
    defaultProps: {
      children: 'children',
      title: 'modername',
      key: "spjtype"
    },
    fieldNames: {
      label: 'name',
      value: 'adCode',
      children: 'children'
    },
    treeData: [],
    labelCol: { span: 7 },
    wrapperCol: { span: 14 },
    currentYear: (new Date).getFullYear(),
    form: {
      name: '',
      region: undefined,
      date1: undefined,
      delivery: false,
      type: [],
      resource: '',
      desc: '',
    },
    geojson: '',
    drawLayer: null,
    drawGeoLayer: null,
    geolist: null,
    modellist: [],
    selModel: false,
    rules: {
      taskName: [
        { required: true, message: '请输入评估任务名称', trigger: 'blur' },
        { min: 3, max: 15, message: '长度为3到15个字符', trigger: 'blur' },
      ],
      adName: [
        { required: true, message: '请选择行政区', trigger: 'blur' },
      ],
      year: [
        { required: true, message: '请选择年份', trigger: 'blur' },
      ]
    }
  }),
  created() {
    this.initGeoData();
    this.initData();
    this.initTreeData();
  },
  methods: {
    async initData() {
      let params = {
        year: '2019',
        maptype: 'spj4'
      };
      let res = await GetMxdInfoByType(params);
      if (res.code === 200) {
        res.data.forEach(item => {
          item.name = item.Name;
          item.key = item.Id;
          item.isLeaf = true;
          // item.class = 'treeList'
        })
      }
    },
    async initTreeData() {
      let params = {
        "year":"2019",
        "maptype":"spj4"
      }
      let res = await getconfiglCzl();
      const { code, data } = res;
      if (code===200) {
        res.data.forEach(item => {
          item.isLeaf = true;
        })
        this.treeData = data;
      }
    },
    onLoadData(treeNode) {
      console.log(treeNode.dataRef)
      return new Promise(resolve => {
        if (treeNode.dataRef.children.length > 0) {
          resolve();
          return;
        }
        setTimeout(async () => {
          let params = {
            spjtype: treeNode.dataRef.spjtype
          }
          let res = await selectbyspjype(params);
          const { code, data } = res;
          if (code===200) {
            data.map(item => {
              item.isLeaf = true;
              item.name = item.modername
            })
            treeNode.dataRef.children = data;
            this.treeData = [...this.treeData];
          }
          resolve();
        }, 200);
      });
    },
    async treeCheck(info,list) {
      console.log(info,list)
      this.modellist = [];
      list.checkedNodes.forEach(item => {
        this.modellist.push({
          modelId: item.data.props.id,
          spjtype: item.data.props.spjtype,
        })
      })
      if(this.modellist.length){
        this.selModel = false;
      }
      // 加载所有的图例
      if (this.allLegend,length === 0) {
        let url = info.MapServerPath + '/legend?f=pjson';
        let res = await Http.get(url);
        this.allLegend = res.layers;
      }
      let params = {
        type:"arcgis",
        url: info.MapServerPath,
        layers: "show:" + info.id,
        layerName: info.id
      }

      this.image = params;
      let legendObj = this.allLegend.filter(item => {
        return item.layerId === info.id
      })
      this.lists = legendObj.length > 0 ? legendObj[0].legend : [];
    },
    handleChange(val) {
      this.form.adCode = val;
      this.form.adName = this.arealist.filter(item => item.adCode == val)[0].name;
      this.addFeatureByArea(val)
    },
    addAssess() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          if(!this.modellist.length){
            this.selModel = true;
            return
          }
          let params = {
            adCode: this.form.adCode,
            adName: this.form.adName,
            taskName: this.form.taskName,
            geojson: this.geojson,
            modelList: this.modellist,
            year: this.form.year
          }
          let res = await dynamicEvaluationAdd(params);
          const { code, message } =  res;
          if (code === 200) {
            this.$message.success('增加评估任务成功！');
            this.form = {
              adCode:'',
              taskName: '',
              year: '',
              modellist: '',
            };
            this.modellist = []
            this.$emit('onCloseModel', false)
            this.$emit('updateboxData');
          }else {
            this.$message.warn(message)
          }
        }
      })

    },
    // 创建空的矢量图层
    createEmptyLayer() {
      let params = {
        type: 0,
      };
      this.drawLayer = createVectorLayer(params); // 开始绘制时创建空的矢量图层
      this.drawLayer.set("layerType", "bufferLayer");
      window.bearingMap.addLayer(this.drawLayer);
    },
    drawArea() {
      removeLayerByAttr(window.bearingMap, "layerType", "bufferLayer");
      // 开始绘制
      this.createEmptyLayer();
      drawEvent({
        map: window.bearingMap,
        layer: this.drawLayer,
        drawType: 'Polygon',
        startCallback: () => {
          // this.limitEvent();
        },
        endCallback: (feature) => {
          this.geojson = new GeoJSON().writeGeometry(feature.getGeometry());
          // this.geojson = [feature];
          // console.log(this.drawFe)
          removeDrawInteraction(window.bearingMap);
          // 设置样式
          //feature.setStyle(style);
        },
      });
    },
    async initGeoData() {
      let res = await getTFGeoJSON();
      if (res) {
        // window.TF_XIAN = res[0];
        this.geolist = res[1];
      }
    },
    // 创建空的矢量图层
    createGeoEmptyLayer() {
      let params = {
        type: 0,
      };
      this.drawGeoLayer = createVectorLayer(params); // 开始绘制时创建空的矢量图层
      this.drawGeoLayer.set("layerType", "geoLayer");
      window.bearingMap.addLayer(this.drawGeoLayer);
    },
    // 将feature添加到地图上
    addFeatureByArea(code) {
      if (!this.geolist.features) return;
      // 先移除之前点击的图层
      removeLayerByAttr(window.monitirMap, "layerType", "geoLayer");
      this.createGeoEmptyLayer();
      this.geolist.features.forEach(item => {
        if (code == item.properties.ad_code) {
          const addFe = new GeoJSON().readFeature(item);
          let style = new Style({
            fill: new Fill({
              //矢量图层填充颜色，以及透明度
              color: '#eda169',
            }),
            stroke: new Stroke({
              color: '#fff', //面的边界线颜色
              width: 2         //边界线宽
            }),
            text: new Text({
              font: "14px 微软雅黑 ",
              text: item.properties.Name,
              offsetX: 0,
              offsetY: 0,
              fill: new Fill({
                color: "#fff",
              }),
            }),
          });
          addFe.setStyle(style);
          this.drawGeoLayer.getSource().addFeature(addFe);
        }
      })
    },
  },
}
</script>
<style lang="scss">
.adddynamic-detail{
  width: 100%;
  height: 100%;
  position: relative;
  .my-map{
    height: calc(90vh - 188px);
    .containerMap{
      padding: 0;
    }
  }
  .datatree {
    width: 442px;
    height: calc(90vh - 280px);
    background-color: #ffffff;
    box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.25);
    border-radius: 3px;
    position: absolute;
    top: 74px;
    left: 51px;
    .addinfo {
      padding-bottom: 0;
      .info-btn {
        .draw {
          margin-left: 16px;
        }
      }
    }
    section {
      font-size: 16px;
      font-weight: bold;
      color: #454954;
      padding: 24px;
    }
    .selmodel-title::before {
      display: inline-block;
      margin-right: 4px;
      color: #f5222d;
      font-size: 14px;
      font-family: SimSun, sans-serif;
      line-height: 1;
      content: '*';
    }
    .selmodel-title {
      padding: 10px 24px;
      position: relative;
      >div {
        position: absolute;
        top: 10px;
        left: 122px;
        font-size: 14px;
        color: #f5222d;
      }
    }
    .tree-data {
      padding: 0 24px;
    }
    .itemTree {
      height: 360px;
    }
  }
  .data-table {
    width: 482px;
    overflow-x: auto;
    height: calc(100vh - 260px);
    background-color: #ffffff;
    box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.25);
    border-radius: 3px;
    position: absolute;
    top: 74px;
    right: 51px;
    .table-title {
      font-size: 16px;
      font-weight: bold;
      color: #454954;
      padding: 19px 0 15px 18px;
    }
  }
}
</style>
