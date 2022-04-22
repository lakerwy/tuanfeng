import mxgraph from "@/graph/index";
import { genGraph, destroyGraph, Graph } from "@/graph/Graph";

const {
  mxGraph,
  mxClient,
  mxEvent,
  mxCodec,
  mxUtils,
  mxConstants,
  mxPerimeter,
  mxOutline,
  mxHierarchicalLayout,
  mxCompactTreeLayout
} = mxgraph;

class hgtGraph {
  constructor(targetId, nodes, edges) {
    this.targetId = targetId;
    this.nodes = nodes;
    this.edges = edges;
    if (!this.targetId) {
      return;
    }

    this.graph = null;
    this.parent = null;
    this.layout = null;
    this.outline = null;
    this.outlineContainer = null;

    this.init();
  }

  init() {
    if (!mxClient.isBrowserSupported()) {
      // 判断是否支持mxgraph
      mxUtils.error("Browser is not supported!", 200, false);
    } else {
      // 在容器中创建图表
      let container = document.getElementById(this.targetId);

      this.graph = new mxGraph(container);
      this.parent = this.graph.getDefaultParent();
      this.graph.getModel().beginUpdate();

      //定义布局
      this.layout = new mxHierarchicalLayout(this.graph);

      try {
        this.createNodes();
        this.createEdges();
        this.layout.execute(this.parent);
      } finally {
        // Updates the display
        this.graph.getModel().endUpdate();
      }
      this.setEvent();
      this.setDefaultLayout();
    }
  }

  createNodes() {
    if (!Array.isArray(this.nodes)) {
      return;
    }
    //遍历mxgraphData生成节点
    for (let i = 0; i < this.nodes.length; i++) {
      let text = "类型: " + this.nodes[i][1] + "\n 名称: " + this.nodes[i][0];
      let id = `node${this.nodes[i][0]}`;
      this.graph.insertVertex(
        this.parent,
        id,
        text,
        0,
        0,
        300,
        60,
        "fillColor=#3CAEA3;strokeColor=white;fontStyle=1;fontColor=white;rounded=1;fontSize=15;"
      );
    }
  }

  createEdges() {
    if (!Array.isArray(this.edges)) {
      return;
    }
    for (let i = 0; i < this.edges.length; i++) {
      //寻找到对应的节点id
      let startIndex = `node${this.edges[i][0]}`;
      let endIndex = `node${this.edges[i][1]}`;

      //graph.getModel().getCell()  通过id找到对应的节点node
      let v1 = this.graph.getModel().getCell(startIndex);
      let v2 = this.graph.getModel().getCell(endIndex);
      this.graph.insertEdge(this.parent, null, null, v1, v2, "");
    }
  }

  setCenter(margin = 10) {
    let bounds = this.graph.getGraphBounds();
    let container = this.graph.container;
    container.style.overflow = "hidden";
    this.graph.view.setTranslate(
      -bounds.x - (bounds.width - container.clientWidth) / 2,
      -bounds.y - (bounds.height - container.clientHeight) / 2
    );
    while (
      bounds.width + margin * 2 > container.clientWidth ||
      bounds.height + margin * 2 > container.clientHeight
    ) {
      this.graph.zoomOut();
      bounds = this.graph.getGraphBounds();
    }
    container.style.overflow = "auto";
  }

  setDefaultLayout() {
    this.graph.view.scaleAndTranslate(1, 0, 0);
    this.setCenter();
  }

  setEvent() {
    // Enables panning with left mouse button
    this.graph.panningHandler.useLeftButtonForPanning = true;
    // this.graph.panningHandler.ignoreCell = true;
    this.graph.container.style.cursor = "move";
    this.graph.setPanning(true);

    // 鼠标滚轮，放大缩小
    mxEvent.addMouseWheelListener((evt, up) => {
      let outlineWheel = false;
      var source = mxEvent.getSource(evt);

      while (source != null) {
        if (source == this.graph.view.canvas.ownerSVGElement) {
          outlineWheel = true;
          break;
        }

        source = source.parentNode;
      }

      if (outlineWheel) {
        if (up) {
          this.graph.zoomIn();
        } else {
          this.graph.zoomOut();
        }
      }
    });
  }

  setOutline(targetId) {
    this.outlineContainer = document.getElementById(targetId);
    this.outline = new mxOutline(this.graph, this.outlineContainer);
    mxEvent.addListener(window, "resize", () => {
      this.outline.update();
    });
  }
}
export default hgtGraph;
