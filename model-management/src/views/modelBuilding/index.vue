<template>
	<div>
		<el-header>
			<bread-crumb :list="breadList"></bread-crumb>
		</el-header>
		<ElContainer class="app-canvas">
			<ElAside class="app-canvas__right">
				<div class="container">
					<div class="title">模型构建</div>
					<div class="treeBox">
						<left-tree v-if="showTree" :data="treeData"></left-tree>
					</div>
				</div>
			</ElAside>
			<ElMain class="app-canvas__main">
				<div class="tool-bar">
					<input @change="readFile" ref="importInput" class="hide" type="file" />
					<ElButton type="text" size="mini" @click="zoomIn">放大</ElButton>
					<ElButton type="text" size="mini" @click="zoomOut">缩小</ElButton>
					<!-- <ElButton type="text" size="mini" @click="importFile">导入</ElButton> -->
					<!-- <ElButton @click="exportFile" type="text" size="mini">导出</ElButton> -->
					<!-- <ElButton @click="logXML" type="text" size="mini">输出XML</ElButton> -->
					<!-- <ElButton type="text" size="mini" @click="del" :disabled="_.isEmpty(selectVertex) && _.isEmpty(selectEdge)">删除</ElButton> -->
					<!-- <ElButton @click="exportPic" type="text" size="mini">导出图片</ElButton> -->
				</div>
				<div id="graphContainer">
					<!-- <ElSelect v-if="normalTypeSelectVisible" class="normal-type-select" :style="{top:normalTypePosition.top,left:normalTypePosition.left}"
					 :value="selectVertex.data.normalType" @input="changeNormalType">
						<ElOption v-for="item in normalTypeOptions" :key="item.label" :label="item.label" :value="item.icon">
							<div class="normal-type-item">
								<img :src="`/images/normal-type/${item.icon}`" :alt="item.icon" />
								<span class="ml8">{{ item.label }}</span>
							</div>
						</ElOption>
					</ElSelect> -->
				</div>
				<div class="collapseBox">
					<div class="collapseLevel" v-for="(item,index) in rightList" :key="index">
						<div class="collapseLevelOne" @click="chooseLevelOne(item.id)">{{item.name}}</div>
						<el-collapse-transition>
							<div class="collapseLevelTwo" v-show="choosenLevelOne == item.id">
								<div class="collapseLevelTwoB" v-for="(item2,index2) in item.children" :key="index2">
									<div class="collapseLevelTwoD" @click="chooseLevelTwo(item2.id)">{{item2.name}}</div>
									<el-collapse-transition>
										<div class="collapseLevelThree"  v-show="choosenLevelTwo == item2.id">
											<div :class="choosenLevelThree==item3.id?'collapseLevelThreeD collapseLevelThreeDC':'collapseLevelThreeD'" v-for="(item3,index3) in item2.children" :key="index3" @click="chooseLevelThree(item3.id)">
												<img v-bind="item3" :id="item3.id" class="element-img" src="../../assets/images/ele/icon1.png" :alt="item3.name">
												<!-- <span class="element-img" :id="item3.id" :title="item3.name">ssss</span> -->
												{{item3.name}}
											</div>
										</div>
									</el-collapse-transition>
								</div>
							</div>
						</el-collapse-transition>
						
					</div>
				</div>
			</ElMain>

			<div class="outline-wrapper">
				<h4>导航器</h4>
				<div id="graphOutline" />
			</div>
			<el-dialog title="属性" :visible.sync="dialogVisible" width="20%" top="16%" :modal="false" :close-on-click-modal="false">
				<div>
					<div class="tablse"></div>
				</div>
			</el-dialog>
		</ElContainer>
	</div>

</template>

<script>
	import {getTreeLists} from '../../api/api.js'
	import leftTree from '../../components/leftTree/index.vue'
	import breadCrumb from '@/components/breadCrumb/index'
	import FileSaver from "file-saver";
	import Panel from "../../components/Panel";
	import headerBox from "../../components/header"
	import mxgraph from "../../graph/index";
	import {
		genGraph,
		destroyGraph,
		Graph
	} from "../../graph/Graph";
	import EdgePanel from "./components/EdgePanel";
	import {
		elements,
		normalTypeOptions
	} from "../../common/data";

	const {
		mxGraph,
		mxClient,
		mxCodec,
		mxConstants,
		mxPerimeter,
		mxHierarchicalLayout,
		mxCompactTreeLayout,
		mxOutline,
		mxEvent,
		mxCell,
		mxGeometry,
		mxUtils,
		mxEventObject,
		mxConnectionHandler,
	} = mxgraph;

	Object.assign(mxEvent, {
		NORMAL_TYPE_CLICKED: "NORMAL_TYPE_CLICKED",
	});

	let graph = null;
	let outline = null;
	let idSeed = 0;

	const insertVertex = (dom, target, x, y) => {
		const src = dom.getAttribute("src");
		const id = Number(dom.getAttribute("id"));
		const nodeRootVertex = new mxCell(
			"",
			new mxGeometry(0, 0, 40, 45),
			`node;image=${src}`
		);
		nodeRootVertex.vertex = true;
		// 自定义的业务数据放在 data 属性
		idSeed++;
		console.log(id)
		nodeRootVertex.data = {
			id: id,
			// element: elements.find((element) => element.id === id),
			normalType: "",
		};

		const title = dom.getAttribute("alt");
		const titleVertex = graph.insertVertex(
			nodeRootVertex,
			null,
			title,
			-0.4,
			1.15,
			80,
			10,
			"constituent=1;whiteSpace=wrap;strokeColor=none;fillColor=none;fontColor=#e6a23c",
			true
		);
		titleVertex.setConnectable(false);

		// const normalTypeVertex = graph.insertVertex(
		//   nodeRootVertex,
		//   null,
		//   null,
		//   0.05,
		//   0.05,
		//   19,
		//   14,
		//   `normalType;constituent=1;fillColor=none;image=/public/images/normal-type/forest.png`,
		//   true
		// );
		// normalTypeVertex.setConnectable(false);

		const cells = graph.importCells([nodeRootVertex], x, y, target);
		if (cells != null && cells.length > 0) {
			graph.setSelectionCells(cells);
		}
	};

	const makeDraggable = (sourceEles) => {
		const dropValidate = function(evt) {
			const x = mxEvent.getClientX(evt);
			const y = mxEvent.getClientY(evt);
			// 获取 x,y 所在的元素
			const elt = document.elementFromPoint(x, y);
			// 如果鼠标落在graph容器
			if (mxUtils.isAncestorNode(graph.container, elt)) {
				return graph;
			}
			// 鼠标落在其他地方
			return null;
		};

		// drop成功后新建一个节点
		
		const dropSuccessCb = function(_graph, evt, target, x, y) {
			insertVertex(this.element, target, x, y);
		};

		Array.from(sourceEles).forEach((ele) => {
			const dragElt = document.createElement("img");
			dragElt.setAttribute("src", ele.getAttribute("src"));
			dragElt.setAttribute("style", "width:30px;height:30px;");
			mxUtils.makeDraggable(
				ele,
				dropValidate,
				dropSuccessCb,
				dragElt,
				null,
				null,
				null,
				true
			);
		});
	};

	const listenGraphEvent = () => {
		graph.addListener(mxEvent.CLICK, (sender, evt) => {
			const cell = evt.properties.cell;
			if (!cell) {
				return;
			}

			const clickNormalType = cell.style.includes("normalType");
			if (clickNormalType) {
				// 使用 mxGraph 事件中心，触发自定义事件
				graph.fireEvent(
					new mxEventObject(mxEvent.NORMAL_TYPE_CLICKED, "cell", cell)
				);
			}
		});
	};

	const setCursor = () => {
		const oldGetCursorForCell = mxGraph.prototype.getCursorForCell;
		graph.getCursorForCell = function(...args) {
			const [cell] = args;
			return cell.style.includes("normalType") ?
				"pointer" :
				oldGetCursorForCell.apply(this, args);
		};
	};

	// const setConnectValidation = () => {
	//   // 连接边校验
	//   mxGraph.prototype.isValidConnection = (source, target) => {
	//     const sourceElementId = source.data.element.id;
	//     const targetElementId = target.data.element.id;
	//     // 如果源点是某某，终点必须是 某某 或 某某
	//     if (sourceElementId === 1) {
	//       return targetElementId === 2 || targetElementId === 3;
	//     }

	//     // 如果终点是某某同理
	//     if (targetElementId === 1) {
	//       return sourceElementId === 2 || sourceElementId === 3;
	//     }

	//     return true;
	//   };
	// };

	const initGraph = () => {
		graph = genGraph(document.getElementById("graphContainer"));
		outline = new mxOutline(graph, document.getElementById("graphOutline"));
		// 将外元素拖拽进画布参考这个例子
		// https://github.com/jinzhanye/mxgraph-demos/blob/master/src/07.drag.html
		makeDraggable(document.getElementsByClassName("element-img"));
		listenGraphEvent();
		setCursor();
		// setConnectValidation();
	};

	export default {
		name: "AppCanvas",

		data() {
			return {
				showTree:false,
				treeData:[],
				rightList:[
					{
						name:'算法集',
						id:1,
						children:[
							{
								name:'预测分析集',
								id:11,
								children:[
									{
										name:'CA预测1',
										id:111
									},
									{
										name:'CA预测2',
										id:112
									},
									{
										name:'CA预测3',
										id:113
									},
								]
							},
							{
								name:'降维分析集',
								id:12
							},
							{
								name:'聚类分析集',
								id:13
							},
							{
								name:'时序分析集',
								id:14
							},
						]
					},
					{
						name:'算法集',
						id:2,
						children:[
							{
								name:'预测分析集',
								id:21,
								children:[
									{
										name:'CA预测',
										id:211
									},
									{
										name:'CA预测',
										id:212
									},
									{
										name:'CA预测',
										id:213
									},
								]
							},
							{
								name:'降维分析集',
								id:22
							},
							{
								name:'聚类分析集',
								id:23
							},
							{
								name:'时序分析集',
								id:24
							},
						]
					}
				],
				breadList: ["运维管理", "模型管理", "模型构建"],
				normalTypeSelectVisible: false,
				normalTypePosition: {
					top: "0",
					left: "0",
				},
				normalTypeOptions,
				elements,
				lists:[],
				selectEdge: {},
				selectVertex: {},
				dialogVisible:false,
				choosenItem:null,
				choosenLevelOne:'',
				choosenLevelTwo:'',
				choosenLevelThree:''
			};
		},

		components: {
			Panel,
			EdgePanel,
			headerBox,
			breadCrumb,
			leftTree
		},

		computed: {
			selectEdgeStyle() {
				if (!_.isEmpty(this.selectEdge)) {
					return graph.getCellStyle(this.selectEdge);
				}
				return {};
			},
		},

		methods: {
			async getTree(){
				var res = await getTreeLists();
				console.log(res)
				if(res.code == 200){
					this.treeData = res.data;
					this.showTree = true;
				}
				
			},
			//选择右侧第一级
			chooseLevelOne(id){
				if(this.choosenLevelOne == id){
					this.choosenLevelOne = "";
				}else{
					this.choosenLevelOne = id;
				}
			},
			//选择右侧第二级
			chooseLevelTwo(id){
				if(this.choosenLevelTwo == id){
					this.choosenLevelTwo = "";
				}else{
					this.choosenLevelTwo = id;
				}
			},
			//选择右侧第三级
			chooseLevelThree(id){
				this.choosenLevelThree = id;
			},
			exportPic() {
				const data = graph.exportPicXML();
				console.log(data);
				// 发送 data 到服务端 ....
				// 服务端如果是使用 Java 可以参考官方这例子
				// https://github.com/jgraph/mxgraph/blob/master/java/test/com/mxgraph/test/mxImageExportTest.java
			},
			logXML() {
				this.$message.info("已经输出，请在控制台查看");
				const xml = graph.exportModelXML();
				console.log(xml);
				console.log("mode:", graph.getModel());
			},
			zoomIn(){
				graph.zoomIn();
			},
			zoomOut(){
				graph.zoomOut();
			},
			//*******
			// File
			//*******
			// 导出、导入功能参考这个例子
			// https://github.com/jgraph/mxgraph/blob/master/javascript/examples/fileio.html
			exportFile() {
				const xml = graph.exportModelXML();
				console.log(xmlToJSON.parseString(xml))
				const blob = new Blob([xml], {
					type: "text/plain;charset=utf-8"
				});
				FileSaver.saveAs(blob, "pocket_monster.xml");
			},
			readFile(evt) {
				const file = evt.target.files[0];
				const reader = new FileReader();
				reader.onload = (e) => {
					const txt = e.target.result;
					graph.importModelXML(txt);
				};
				reader.readAsText(file);
			},
			importFile() {
				this.$refs.importInput.click();
			},
			//
			del() {
				if (!_.isEmpty(this.selectVertex)) {
					graph.deleteSubtree(this.selectVertex);
				} else {
					graph.removeCells([this.selectEdge]);
				}
			},
			//
			ChangeEdgeStyle(key, value) {
				graph.setStyle(this.selectEdge, key, value);
			},
			//************
			// NormalType
			//************
			changeNormalType(val) {
				this.selectVertex.data.normalType = val;
				const normalTypeVertex = this.selectVertex.children[1];
				graph.setStyle(
					normalTypeVertex,
					"image",
					`/public/images/normal-type/${val}`
				);
				this.hideTypeSelect();
			},
			hideTypeSelect() {
				this.normalTypeSelectVisible = false;
			},
			showNormalTypeSelect(sender, evt) {
				const normalTypeDom = graph.getDom(evt.getProperty("cell"));
				const {
					left,
					top
				} = normalTypeDom.getBoundingClientRect();
				this.normalTypePosition.left = `${left - 210}px`;
				this.normalTypePosition.top = `${top - 8}px`;
				this.normalTypeSelectVisible = true;
			},

			handleSelectionChange(selectModel) {
				this.selectVertex = {};
				this.selectEdge = {};
				if (!selectModel.cells.length) {
					return;
				}

				const cell = selectModel.cells[0];

				// 另一种获取当前节点的方法
				// const selectionCell = graph.getSelectionCell();
				// console.log(selectionCell === cell); // true

				if (cell.vertex) {
					this.selectVertex = cell;
				} else {
					this.selectEdge = cell;
				}
			},
			_listenEvent() {
				// 监听自定义事件
				graph.addListener(mxEvent.NORMAL_TYPE_CLICKED, this.showNormalTypeSelect);
				graph.addListener(mxEvent.VERTEX_START_MOVE, this.hideTypeSelect);
				

				// 监听 mxGraph 事件
				const mxGraphSelectionModel = graph.getSelectionModel();
				mxGraphSelectionModel.addListener(
					mxEvent.CHANGE,
					this.handleSelectionChange
				);

				const vm = this;
				graph.addListener(mxEvent.MOVE_CELLS, (sender, evt) => {
					const cell = evt.properties.cells[0];
					console.log(cell)
					const position = Graph.getCellPosition(cell);
					setTimeout(() => {
						vm.$message.info(`节点被移动到 ${JSON.stringify(position)}`);
					}, 1000);
				});
				
				graph.addListener(mxEvent.DOUBLE_CLICK, (sender, evt) => {
					this.dialogVisible = true;
					this.choosenItem = evt.properties.cell.data;
					console.log(this.choosenItem)
				});

				graph.addListener(mxEvent.CELLS_ADDED, (sender, evt) => {
					const cell = evt.properties.cells[0];
					if (graph.isPart(cell)) {
						return;
					}

					if (cell.vertex) {
						this.$message.info("添加了一个节点");
					} else if (cell.edge) {
						this.$message.info("添加了一条线");
						var line = [cell.source.data.id,cell.target.data.id];
						console.log(line)
					}
				});

				graph.addListener(mxEvent.LABEL_CHANGED, (sender, evt) => {
					vm.$message.info(`内容改变为：${evt.getProperty("value")}`);
				});

				graph.addListener(mxEvent.CONNECT_CELL, (sender, evt) => {
					vm.$message.info(`改变了连线`);
				});
			},
			getAllItem(){
				var list = []
				for(var i in this.rightList){
					for(var j in this.rightList[i].children){
						for(var q in this.rightList[i].children[j].children){
							list.push(this.rightList[i].children[j].children[q])
						}
					}
				}
				console.log(list);
				this.lists = list;
			}
		},
		
		mounted() {
			this.getTree()
			this.getAllItem()
			initGraph();
			this._listenEvent();
		},
		
		beforeDestroy() {
			destroyGraph();
		},
	};
</script>

<style lang="less" scoped>
	@vw: 19.2vw;
	@vh: 10.8vh;
	@import "../../assets/style/module/util";

	.el-header {
		width: 100%;
		padding: 1px;
		height: 54/@vh;
		background-color: #fff;
		overflow: hidden;
	}

	.app-canvas {
		#graphContainer {
			position: relative;
			overflow: hidden;
			width: 85%;
			float: left;
			height: 85vh;
			background: #eee url("../../assets/images/grid.gif") 0 0 repeat;
			border-radius: 4px;
		}
		.collapseBox{
			width: 13%;
			margin-right: 1%;
			float: right;
			.collapseLevel{
				width: 100%;
				padding: 1;
				overflow: hidden;
				.collapseLevelOne{
					width: 100%;
					border-bottom: 1px solid #eeeeee;
					height: 42/@vh;
					line-height: 42/@vh;
					font-size: 14/@vh;
					color: #454954;
					background-color: #e6f1ff;
					cursor: pointer;
					text-align: left;
					padding-left: 28/@vw;
					margin-top: 20/@vh;
				}
				.collapseLevelTwo{
					width: 100%;
					border-bottom: 1px solid #eeeeee;
					.collapseLevelTwoB{
						width: 100%;
						.collapseLevelTwoD{
							width: 100%;
							border-bottom: 1px solid #eeeeee;
							height: 42/@vh;
							line-height: 42/@vh;
							font-size: 14/@vh;
							color: #454954;
							background-color: #fff;
							cursor: pointer;
							text-align: left;
							padding-left: 28/@vw;
						}
						.collapseLevelThree{
							width: 100%;
							.collapseLevelThreeD{
								width: 100%;
								height: 34/@vh;
								line-height: 34/@vh;
								color: #6f7583;
								font-size: 14/@vh;
								background-color: #fff;
								cursor: pointer;
								text-align: center;
								&:hover{
									background-color: #e6f1ff;
								}
							}
							.collapseLevelThreeDC{
								background-color: #e6f1ff;
							}
						}
					}
					
				}
				
			}
		}

		&__main {
			.tool-bar {
				display: flex;
				background: #fff;
				padding-left: 10px;
				border-radius: 4px;
				margin-bottom: 10px;
			}

			.normal-type-select {
				position: fixed;
			}
		}

		&__right {
			position: relative;
			padding: 20px 0 0 20px;
			width: 374/@vw;
			background-color: #fff;
			margin-top: 20/@vh;
			.element-panel {
				margin-top: -9px;
			}

			.elements {
				margin-top: 20px;
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;

				.element {
					width: 120px;
					// text-align: center;
					margin-bottom: 10px;

					>img {
						border-radius: 4px;
						cursor: pointer;
						width: 20px;
						height: 20px;
						float: left;
						margin-top: 10px;
					}

					>p {
						color: #333;
						line-height: 40px;
						font-size: 12px;
						float: left;
						padding-left: 4px;
					}
				}
			}
		}

		.outline-wrapper {
			border: 1px solid #dedede;
			background: #fff;
			position: fixed;
			right: 14%;
			top: 14%;
			border-radius: 4px;
			z-index: 10;

			>h4 {
				padding: 6px;
				font-size: 12px;
				border-bottom: 1px solid #e6e6e6;
			}

			#graphOutline {
				width: 200px;
			}
		}
	}
	.tablse{
		width: 96%;
		margin: 0 auto;
		height: 200px;
		border: 1px solid #000;
	}
</style>

<style lang="less">
	
	.normal-type-item {
		display: flex;
		align-items: center;

		&>img {
			width: 20px;
			height: 20px;
			margin-right: 8px;
		}
	}
</style>
