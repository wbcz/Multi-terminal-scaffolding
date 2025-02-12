import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLID, GraphQLBoolean, GraphQLNonNull, GraphQLFloat, GraphQLList } from 'graphql';
import { FlowMapType, NodeType, EdgeType, ViewPortType, ExecuteResultType } from './types.js';

/**
 * FlowMap 数据存储
 */
class FlowMapStore {
  private static instance: FlowMapStore;
  private flowMap: any = null;

  private constructor() {}

  static getInstance() {
    if (!FlowMapStore.instance) {
      FlowMapStore.instance = new FlowMapStore();
    }
    return FlowMapStore.instance;
  }

  getFlowMap() {
    return this.flowMap;
  }

  setFlowMap(map: any) {
    this.flowMap = map;
  }
}

/**
 * 节点解析器
 */
class NodeResolver {
  /**
   * 获取节点基本信息
   */
  static resolveBasicInfo(node: any) {
    return {
      id: node.id,
      type: node.type,
      name: node.data.name,
      description: node.data.description,
      isCustom: node.data.isCustom || false
    };
  }

  /**
   * 解析节点输入配置
   */
  static resolveInputs(node: any) {
    switch (node.type) {
      case 'textInput':
        return [{
          type: 'string',
          value: node.data.value || '',
          widget: 'text',
          required: true
        }];
      case 'llmPrompt':
        return [{
          type: 'string',
          value: node.data.prompt || '',
          widget: 'textarea',
          required: true
        }];
      case 'apiCall':
        return [{
          type: 'string',
          value: node.data.url || '',
          widget: 'text',
          required: true
        }, {
          type: 'string',
          value: node.data.method || 'POST',
          widget: 'select',
          options: ['GET', 'POST', 'PUT', 'DELETE'],
          required: true
        }];
      default:
        return [];
    }
  }

  /**
   * 解析节点输出配置
   */
  static resolveOutputs(node: any) {
    switch (node.type) {
      case 'textInput':
        return [{
          type: 'string',
          description: '输出文本内容'
        }];
      case 'llmPrompt':
        return [{
          type: 'string',
          description: 'AI 生成的回复'
        }];
      case 'apiCall':
        return [{
          type: 'string',
          description: 'API 返回结果'
        }];
      default:
        return [];
    }
  }

  /**
   * 执行节点
   */
  static async executeNode(node: any, inputs: any = {}) {
    switch (node.type) {
      case 'textInput':
        return node.data.value;
      
      case 'llmPrompt':
        // 替换提示词中的变量
        let prompt = node.data.prompt;
        Object.entries(inputs).forEach(([key, value]) => {
          prompt = prompt.replace(`{{${key}}}`, value as string);
        });
        
        // 调用大模型API
        try {
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
              model: 'gpt-3.5-turbo',
              messages: [{
                role: 'user',
                content: prompt
              }]
            })
          });
          
          const data = await response.json();
          return data.choices[0].message.content;
        } catch (error) {
          console.error('Failed to call LLM API:', error);
          throw new Error('大模型调用失败');
        }
      
      case 'apiCall':
        try {
          // 获取API配置
          const { url, method } = node.data;
          
          // 调用API
          const response = await fetch(url, {
            method,
            headers: {
              'Content-Type': 'application/json'
            },
            body: method !== 'GET' ? JSON.stringify(inputs) : undefined
          });
          
          const data = await response.json();
          return JSON.stringify(data);
        } catch (error) {
          console.error('Failed to call API:', error);
          throw new Error('API调用失败');
        }
      
      default:
        return null;
    }
  }
}

/**
 * 边解析器
 */
class EdgeResolver {
  /**
   * 解析边的基本信息
   */
  static resolveBasicInfo(edge: any) {
    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle
    };
  }
}

/**
 * 视口解析器
 */
class ViewportResolver {
  /**
   * 解析视口信息
   */
  static resolveViewport(viewport: any) {
    return {
      x: viewport.x,
      y: viewport.y,
      zoom: viewport.zoom
    };
  }
}

/**
 * 查询解析器
 */
class QueryResolver {
  /**
   * 获取完整流程图
   */
  static async getFlowMap() {
    const store = FlowMapStore.getInstance();
    const flowMap = store.getFlowMap();
    if (!flowMap) return null;

    return {
      nodes: flowMap.nodes.map((node: any) => ({
        ...NodeResolver.resolveBasicInfo(node),
        inputs: NodeResolver.resolveInputs(node),
        outputs: NodeResolver.resolveOutputs(node)
      })),
      edges: flowMap.edges.map((edge: any) => EdgeResolver.resolveBasicInfo(edge)),
      viewport: ViewportResolver.resolveViewport(flowMap.viewport)
    };
  }

  /**
   * 获取单个节点信息
   */
  static async getNode(_, { id }: { id: string }) {
    const store = FlowMapStore.getInstance();
    const flowMap = store.getFlowMap();
    if (!flowMap) return null;

    const node = flowMap.nodes.find((n: any) => n.id === id);
    if (!node) return null;

    return {
      ...NodeResolver.resolveBasicInfo(node),
      inputs: NodeResolver.resolveInputs(node),
      outputs: NodeResolver.resolveOutputs(node)
    };
  }

  /**
   * 执行流程图
   */
  static async executeFlow(_, { input }: { input: string }) {
    const store = FlowMapStore.getInstance();
    const flowMap = store.getFlowMap();
    if (!flowMap) {
      return {
        success: false,
        result: null,
        status: 'error',
        message: '流程图未加载'
      };
    }

    try {
      // 解析输入
      const inputData = JSON.parse(input);
      
      // 找到输入节点
      const inputNode = flowMap.nodes.find((n: any) => n.type === 'textInput');
      if (!inputNode) {
        return {
          success: false,
          result: null,
          status: 'error',
          message: '未找到输入节点'
        };
      }

      // 执行输入节点
      let result = await NodeResolver.executeNode(inputNode, inputData);

      // 找到下一个节点（LLM节点）
      const llmEdge = flowMap.edges.find((e: any) => e.source === inputNode.id);
      if (!llmEdge) {
        return {
          success: false,
          result: null,
          status: 'error',
          message: '未找到连接到LLM的边'
        };
      }

      const llmNode = flowMap.nodes.find((n: any) => n.id === llmEdge.target);
      if (!llmNode) {
        return {
          success: false,
          result: null,
          status: 'error',
          message: '未找到LLM节点'
        };
      }

      // 执行LLM节点
      result = await NodeResolver.executeNode(llmNode, { input: result });

      // 找到API节点
      const apiEdge = flowMap.edges.find((e: any) => e.source === llmNode.id);
      if (!apiEdge) {
        return {
          success: false,
          result: null,
          status: 'error',
          message: '未找到连接到API的边'
        };
      }

      const apiNode = flowMap.nodes.find((n: any) => n.id === apiEdge.target);
      if (!apiNode) {
        return {
          success: false,
          result: null,
          status: 'error',
          message: '未找到API节点'
        };
      }

      // 执行API节点
      result = await NodeResolver.executeNode(apiNode, { content: result });

      return {
        success: true,
        result: result,
        status: 'success',
        message: '流程图执行成功'
      };
    } catch (error) {
      console.error('Flow execution failed:', error);
      return {
        success: false,
        result: null,
        status: 'error',
        message: error.message
      };
    }
  }
}

/**
 * 变更解析器
 */
class MutationResolver {
  /**
   * 加载流程图数据
   */
  static async loadFlowMap(_, { map }: { map: string }) {
    try {
      const store = FlowMapStore.getInstance();
      store.setFlowMap(JSON.parse(map));
      return true;
    } catch (error) {
      console.error('Failed to parse flow map:', error);
      return false;
    }
  }

  /**
   * 更新节点数据
   */
  static async updateNode(_, { id, data }: { id: string; data: string }) {
    const store = FlowMapStore.getInstance();
    const flowMap = store.getFlowMap();
    if (!flowMap) return false;

    try {
      const nodeData = JSON.parse(data);
      const nodeIndex = flowMap.nodes.findIndex((n: any) => n.id === id);
      if (nodeIndex === -1) return false;

      flowMap.nodes[nodeIndex] = {
        ...flowMap.nodes[nodeIndex],
        data: {
          ...flowMap.nodes[nodeIndex].data,
          ...nodeData
        }
      };

      store.setFlowMap(flowMap);
      return true;
    } catch (error) {
      console.error('Failed to update node:', error);
      return false;
    }
  }

  /**
   * 更新边数据
   */
  static async updateEdge(_, { id, data }: { id: string; data: string }) {
    const store = FlowMapStore.getInstance();
    const flowMap = store.getFlowMap();
    if (!flowMap) return false;

    try {
      const edgeData = JSON.parse(data);
      const edgeIndex = flowMap.edges.findIndex((e: any) => e.id === id);
      if (edgeIndex === -1) return false;

      flowMap.edges[edgeIndex] = {
        ...flowMap.edges[edgeIndex],
        ...edgeData
      };

      store.setFlowMap(flowMap);
      return true;
    } catch (error) {
      console.error('Failed to update edge:', error);
      return false;
    }
  }

  /**
   * 更新视口数据
   */
  static async updateViewport(_, { x, y, zoom }: { x: number; y: number; zoom: number }) {
    const store = FlowMapStore.getInstance();
    const flowMap = store.getFlowMap();
    if (!flowMap) return false;

    flowMap.viewport = { x, y, zoom };
    store.setFlowMap(flowMap);
    return true;
  }
}

// 查询类型定义
const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    getFlowMap: {
      type: FlowMapType,
      resolve: QueryResolver.getFlowMap
    },
    getNode: {
      type: NodeType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve: QueryResolver.getNode
    },
    executeFlow: {
      type: ExecuteResultType,
      args: {
        input: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: QueryResolver.executeFlow
    }
  }
});

// 变更类型定义
const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    loadFlowMap: {
      type: GraphQLBoolean,
      args: {
        map: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: MutationResolver.loadFlowMap
    },
    updateNode: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        data: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: MutationResolver.updateNode
    },
    updateEdge: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        data: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: MutationResolver.updateEdge
    },
    updateViewport: {
      type: GraphQLBoolean,
      args: {
        x: { type: new GraphQLNonNull(GraphQLFloat) },
        y: { type: new GraphQLNonNull(GraphQLFloat) },
        zoom: { type: new GraphQLNonNull(GraphQLFloat) }
      },
      resolve: MutationResolver.updateViewport
    }
  }
});

// 创建 Schema
export const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType
}); 