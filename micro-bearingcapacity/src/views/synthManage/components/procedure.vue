<!--
 * @Author: 任继民
 * @Date: 2020-11-13 13:44:38
 * @LastEditors: 任继民
 * @LastEditTime: 2021-04-28 09:59:58
 * @Description:
-->
<template>
  <div class="explain">
    <div class="title">综合监管流程</div>
    <div id="container"></div>
  </div>
</template>
<script>
import G6 from '@antv/g6';
// import insertCss from 'insert-css';
export default {
  data: () => ({
  }),
  created() {
    this.$nextTick(() => {
      this.initChart();
    })
  },
  methods: {
    initChart() {
      const data = {
        id: 'root',
        label: '承载规模评价',
        children: [
          {
            id: 'c1',
            label: '农业生产承载规模',
            children: [
              {
                id: 'c1-1',
                label: '耕地承载规模',
                children: [
                  {
                    id: 'c1-1-1',
                    label: '农业生产承载规模',
                  },
                  {
                    id: 'c1-1-2',
                    label: '城镇建设承载规模',
                  },
                ]
              },
              {
                id: 'c1-2',
                label: '渔业承载规模',
                children: [
                  {
                    id: 'c1-2-1',
                    label: '耕地承载规模',
                  },
                  {
                    id: 'c1-2-2',
                    label: '渔业承载规模',
                  },
                ],
              },
            ],
          },
          {
            id: 'c2',
            label: 'c2',
          },
          {
            id: 'c3',
            label: 'c3',
            children: [
              {
                id: 'c3-1',
                label: 'c3-1',
              },
              {
                id: 'c3-2',
                label: 'c3-2',
                children: [
                  {
                    id: 'c3-2-1',
                    label: 'c3-2-1',
                  },
                  {
                    id: 'c3-2-2',
                    label: 'c3-2-2',
                  },
                  {
                    id: 'c3-2-3',
                    label: 'c3-2-3',
                  },
                ],
              },
              {
                id: 'c3-3',
                label: 'c3-3',
              },
            ],
          },
        ],
      };
      G6.registerNode(
        'icon-node',
        {
          options: {
            size: [60, 20],
            stroke: '#91d5ff',
            fill: '#91d5ff',
          },
          draw(cfg, group) {
            const styles = this.getShapeStyle(cfg);
            const { labelCfg = {} } = cfg;

            const w = styles.width;
            const h = styles.height;

            const keyShape = group.addShape('rect', {
              attrs: {
                ...styles,
                x: -w / 2,
                y: -h / 2,
              },
            });

            /**
            * leftIcon 格式如下：
            *  {
            *    style: ShapeStyle;
            *    img: ''
            *  }
            */
            console.log('cfg.leftIcon', cfg.leftIcon);
            if (cfg.leftIcon) {
              const { style, img } = cfg.leftIcon;
              group.addShape('rect', {
                attrs: {
                  x: 1 - w / 2,
                  y: 1 - h / 2,
                  width: 38,
                  height: styles.height - 2,
                  fill: '#8c8c8c',
                  ...style,
                },
              });
            }
            if (cfg.label) {
              group.addShape('text', {
                attrs: {
                  ...labelCfg.style,
                  text: cfg.label,
                  x: 20 - w / 2,
                  y: 25 - h / 2,
                },
              });
            }

            return keyShape;
          },
          update: undefined
        },
        'rect',
      );

      G6.registerEdge('flow-line', {
        draw(cfg, group) {
          const startPoint = cfg.startPoint;
          const endPoint = cfg.endPoint;

          const { style } = cfg;
          const shape = group.addShape('path', {
            attrs: {
              stroke: style.stroke,
              endArrow: style.endArrow,
              path: [
                ['M', startPoint.x, startPoint.y],
                ['L', startPoint.x, (startPoint.y + endPoint.y) / 2],
                ['L', endPoint.x, (startPoint.y + endPoint.y) / 2],
                ['L', endPoint.x, endPoint.y],
              ],
            },
          });

          return shape;
        },
      });

      const defaultStateStyles = {
        hover: {
          stroke: '#1890ff',
          lineWidth: 2,
        },
      };

      const defaultNodeStyle = {
        fill: '#91d5ff',
        stroke: '#40a9ff',
        // radius: 5,
      };

      const defaultEdgeStyle = {
        stroke: '#91d5ff',
        endArrow: {
          path: 'M 0,0 L 12, 6 L 9,0 L 12, -6 Z',
          fill: '#91d5ff',
          d: -20,
        },
      };

      const defaultLayout = {
        type: 'compactBox',
        direction: 'TB',
        getId: function getId(d) {
          return d.id;
        },
        getHeight: function getHeight() {
          return 16;
        },
        getWidth: function getWidth() {
          return 16;
        },
        getVGap: function getVGap() {
          return 40;
        },
        getHGap: function getHGap() {
          return 70;
        },
      };

      const defaultLabelCfg = {
        style: {
          fill: '#000',
          fontSize: 12,
        },
      };

      const width = document.getElementById('container').scrollWidth;
      const height = document.getElementById('container').scrollHeight || 234;
      // 小地图
      // const minimap = new G6.Minimap({
      //   size: [150, 100],
      // });
      const graph = new G6.TreeGraph({
        container: 'container',
        width,
        height,
        linkCenter: true,
        // plugins: [minimap],
        modes: {
          default: ['drag-canvas', 'zoom-canvas'],
        },
        defaultNode: {
          type: 'icon-node',
          size: [120, 40],
          style: defaultNodeStyle,
          labelCfg: defaultLabelCfg,
        },
        defaultEdge: {
          type: 'flow-line',
          style: defaultEdgeStyle,
        },
        nodeStateStyles: defaultStateStyles,
        edgeStateStyles: defaultStateStyles,
        layout: defaultLayout,
      });

      graph.data(data);
      graph.render();
      graph.fitView();

      graph.on('node:mouseenter', (evt) => {
        const { item } = evt;
        graph.setItemState(item, 'hover', true);
      });

      graph.on('node:mouseleave', (evt) => {
        const { item } = evt;
        graph.setItemState(item, 'hover', false);
      });
    }
  },
}
</script>

<style lang="scss" scoped>
.explain {
  height: 234px;
  .title {
    color: #454954;
    font-size: 18px;
    margin: 24px 0 24px 20px;
  }
  p {
    border-bottom: 1px dotted#e9e9e9;
  }
}
</style>
