import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { schema } from './index.js';

// 商品查询流程示例数据
const productQueryFlow = {
  nodes: [
    {
      id: 'input1',
      type: 'textInput',
      data: {
        name: '商品查询输入',
        description: '用户输入商品查询条件',
        value: '帮我查询价格在100-200之间的手机'
      },
      position: { x: 100, y: 100 }
    },
    {
      id: 'llm1',
      type: 'llmPrompt',
      data: {
        name: 'SQL生成器',
        description: '将自然语言转换为SQL查询',
        prompt: `请将以下商品查询需求转换为SQL查询语句，
                要求：
                1. 只返回SQL语句，不要其他解释
                2. 使用标准SQL语法
                3. 查询 products 表
                4. 表结构：id, name, price, category, description
                
                查询需求：{{input}}`
      },
      position: { x: 300, y: 100 }
    },
    {
      id: 'api1',
      type: 'apiCall',
      data: {
        name: 'SQL执行器',
        description: '执行SQL查询并返回结果',
        url: 'http://localhost:3000/api/query',
        method: 'POST'
      },
      position: { x: 500, y: 100 }
    }
  ],
  edges: [
    {
      id: 'edge1',
      source: 'input1',
      target: 'llm1',
      sourceHandle: 'output',
      targetHandle: 'input'
    },
    {
      id: 'edge2',
      source: 'llm1',
      target: 'api1',
      sourceHandle: 'output',
      targetHandle: 'input'
    }
  ],
  viewport: {
    x: 0,
    y: 0,
    zoom: 1
  }
};

async function bootstrap() {
  const app = express();

  // 添加 GraphQL 端点
  app.use(
    '/graphql',
    graphqlHTTP({
      schema,
      graphiql: true
    })
  );

  // 模拟数据库查询API
  app.post('/api/query', express.json(), (req, res) => {
    // 模拟的商品数据
    const products = [
      { id: 1, name: 'iPhone 13', price: 150, category: '手机', description: '苹果手机' },
      { id: 2, name: 'Redmi Note 12', price: 120, category: '手机', description: '红米手机' },
      { id: 3, name: 'OPPO Reno 8', price: 180, category: '手机', description: 'OPPO手机' },
      { id: 4, name: 'vivo Y93', price: 160, category: '手机', description: 'vivo手机' }
    ];

    try {
      // 这里简化处理，直接返回价格在100-200之间的手机
      const result = products.filter(p => p.price >= 100 && p.price <= 200);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // 添加加载示例数据的端点
  app.post('/load-example', async (req, res) => {
    try {
      // 使用 graphqlHTTP 中间件处理请求
      const handler = graphqlHTTP({
        schema,
        context: { req },
        graphiql: false
      });

      // 加载商品查询流程
      req.body = {
        query: `
          mutation LoadMap($map: String!) {
            loadFlowMap(map: $map)
          }
        `,
        variables: {
          map: JSON.stringify(productQueryFlow)
        }
      };

      return handler(req, res);
    } catch (error) {
      res.status(500).json({ error: 'Failed to load example map' });
    }
  });

  // 启动服务器
  const port = 4000;
  try {
    app.listen(port, '0.0.0.0', () => {
      console.log(`GraphQL server running at http://localhost:${port}/graphql`);
      console.log(`Example data loader available at http://localhost:${port}/load-example`);
      console.log(`Mock API endpoint available at http://localhost:${port}/api/query`);
    }).on('error', (error) => {
      console.error('Server failed to start:', error);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

// 启动服务器
bootstrap().catch(error => {
  console.error('Bootstrap failed:', error);
}); 