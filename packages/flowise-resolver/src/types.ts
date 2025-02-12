import { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLFloat, GraphQLBoolean, GraphQLList, GraphQLNonNull } from 'graphql';

/**
 * 视口类型
 */
export const ViewPortType = new GraphQLObjectType({
  name: 'ViewPort',
  fields: {
    x: { type: new GraphQLNonNull(GraphQLFloat) },
    y: { type: new GraphQLNonNull(GraphQLFloat) },
    zoom: { type: new GraphQLNonNull(GraphQLFloat) }
  }
});

/**
 * 执行结果类型
 */
export const ExecuteResultType = new GraphQLObjectType({
  name: 'ExecuteResult',
  fields: {
    success: { type: new GraphQLNonNull(GraphQLBoolean) },
    result: { type: GraphQLString },
    status: { type: GraphQLString },
    message: { type: GraphQLString }
  }
});

/**
 * FlowiseAI 节点类型
 */
export const IFlowNode = {
  id: String,
  type: String,
  data: {
    name: String
  },
  position: {
    x: Number,
    y: Number
  },
  width: Number,
  height: Number,
  selected: Boolean,
  positionAbsolute: {
    x: Number,
    y: Number
  },
  dragging: Boolean
};

/**
 * FlowiseAI 边类型
 */
export const IFlowEdge = {
  id: String,
  source: String,
  target: String,
  sourceHandle: String,
  targetHandle: String,
  type: String,
  data: Object
};

/**
 * FlowiseAI 流程图类型
 */
export const IFlowMap = {
  nodes: Array,
  edges: Array,
  viewport: {
    x: Number,
    y: Number,
    zoom: Number
  }
};

/**
 * 节点输入类型
 */
export const NodeInputType = new GraphQLObjectType({
  name: 'NodeInput',
  fields: {
    type: { type: new GraphQLNonNull(GraphQLString) },
    value: { type: GraphQLString },
    widget: { type: GraphQLString },
    required: { type: GraphQLBoolean }
  }
});

/**
 * 节点输出类型
 */
export const NodeOutputType = new GraphQLObjectType({
  name: 'NodeOutput',
  fields: {
    type: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString }
  }
});

/**
 * 节点定义类型
 */
export const NodeType = new GraphQLObjectType({
  name: 'Node',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    type: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    inputs: { type: new GraphQLList(NodeInputType) },
    outputs: { type: new GraphQLList(NodeOutputType) },
    description: { type: GraphQLString },
    isCustom: { type: GraphQLBoolean }
  }
});

/**
 * 边定义类型
 */
export const EdgeType = new GraphQLObjectType({
  name: 'Edge',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    source: { type: new GraphQLNonNull(GraphQLString) },
    target: { type: new GraphQLNonNull(GraphQLString) },
    sourceHandle: { type: GraphQLString },
    targetHandle: { type: GraphQLString }
  }
});

/**
 * 流程图定义类型
 */
export const FlowMapType = new GraphQLObjectType({
  name: 'FlowMap',
  fields: {
    nodes: { type: new GraphQLList(NodeType) },
    edges: { type: new GraphQLList(EdgeType) },
    viewport: { type: ViewPortType }
  }
}); 