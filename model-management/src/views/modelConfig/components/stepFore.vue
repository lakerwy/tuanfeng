<template>
  <div class="step">
    <div class="configContainer">
      <div class="header">
        <div class="saveBut" @click="save">保存</div>
        <div class="title">步骤四：选择报告</div>
      </div>
      <div class="content">
        <div class="leftListBox">
          <div
            :class="index == itemIndex ? 'items itemsC' : 'items'"
            v-for="(item, index) in list"
            :key="index"
            @click="changeItem(index)"
          >
            <div :class="index == itemIndex ? 'imgs imgsC' : 'imgs'"></div>
            <div
              :class="index == itemIndex ? 'fileName fileNameC' : 'fileName'"
            >
              {{ item.name }}
            </div>
            <div
              :class="index == itemIndex ? 'circle circleC' : 'circle'"
            ></div>
          </div>
        </div>
        <div class="rightBox">
          <iframe :src="url" width="100%" height="99%" frameborder="0"></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getTemplateListRequest,
  saveModelStepFourRequest
} from "@/api/modelConfigApi";

export default {
  data() {
    return {
      modelId: null,
      list: [
        {
          id: 0,
          name: "土地资源评价分析报告模板-上报版",
          url: "http://image.cache.timepack.cn/nodejs.pdf"
        }
      ],
      itemIndex: null,
      url: ""
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init(id, data) {
      await this.getTemplateList();
      this.modelId = id;

      if (this.list && this.list.length > 0) {
        let reports = data?.modelReports;
        if (Array.isArray(reports) && reports.length > 0) {
          let report = reports[0];
          let index = this.list.findIndex(x => x.id === report.id);
          this.changeItem(index);
          return;
        }

        this.changeItem(0);
      }
    },
    async getTemplateList() {
      this.list = [];

      let params = { filetype: "pdf" };
      let res = await getTemplateListRequest(params);
      if (res && res.code === 200 && Array.isArray(res.data)) {
        this.list = res.data.map(x => {
          return {
            id: x.id,
            name: x.name,
            filetype: x.filetype,
            url: window.globalUrl.API_MODEL + x.fileurl,
            path: x.savepath
          };
        });
      }
    },
    changeItem(index) {
      let i = index && index > -1 ? index : 0;
      this.itemIndex = i;
      this.url = this.list[i].url;
    },
    async save() {
      if (!this.list && this.itemIndex == null) {
        return;
      }
      let item = this.list[this.itemIndex];
      let data = {
        id: item.id,
        modelid: this.modelId,
        reportname: item.name,
        reporttype: item.filetype,
        reportpath: item.path
      };
      let res = await saveModelStepFourRequest(data);

      if (res.code === 200) {
        this.$message("保存成功！");
      } else {
        this.$message.error(res.msg);
      }
    }
  }
};
</script>

<style lang="less" scoped>
@vw: 19.2vw;
@vh: 10.8vh;

.content {
  width: 100%;
  display: grid;
  padding-top: 30 / @vh;
  grid-template-columns: 300 / @vw 1fr;
  column-gap: 30 / @vw;
  .leftListBox {
    .items {
      width: 100%;
      cursor: pointer;
      height: 138 / @vh;
      border: solid 1px #dddddd;
      position: relative;
      margin-bottom: 22 / @vh;
      .imgs {
        width: 45px;
        height: 56px;
        background: url(../../../assets/imgs/file.png) no-repeat;
        background-size: 45 / @vw;
        margin: 0 auto;
        margin-top: 24 / @vh;
        transition: all 0.5s;
      }
      .imgsC {
        background: url(../../../assets/imgs/file1.png) no-repeat;
      }
      .fileName {
        font-size: 12 / @vh;
        color: #6f7583;
        margin-top: 20 / @vh;
        transition: all 0.5s;
        text-align: center;
      }
      .fileNameC {
        color: #1890ff;
      }
      .circle {
        width: 20px;
        height: 20px;
        position: absolute;
        left: 19 / @vw;
        top: 17 / @vh;
        background: url(../../../assets/imgs/circle.png) no-repeat;
        transition: all 0.5s;
      }
      .circleC {
        background: url(../../../assets/imgs/circle1.png) no-repeat;
      }
    }
    .itemsC {
      border: solid 1px #1890ff;
    }
  }
}
</style>
