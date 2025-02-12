# @eleme/flowise-resolver

FlowiseAI 流程图的 GraphQL resolver 生成器。用于解析和操作 FlowiseAI 生成的 map.json 文件。

## 特性

- 🚀 自动生成 GraphQL schema
- 📦 支持节点和边的 CRUD 操作
- 🔒 类型安全的 API
- 📝 完整的 TypeScript 支持
- ⚡️ 高性能的数据处理
- 🛡️ 内置错误处理

## 安装

```bash
pnpm add @eleme/flowise-resolver
```

## 使用示例

### 1. 创建 GraphQL 服务器

```typescript
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { createFlowMapSchema } from '@eleme/flowise-resolver';

async function bootstrap() {
  const app = express();
  const schema = await createFlowMapSchema();

  app.use(
    '/graphql',
    graphqlHTTP({
      schema,
      graphiql: true
    })
  );

  app.listen(4000, () => {
    console.log('GraphQL server running at http://localhost:4000/graphql');
  });
}

bootstrap();
```

### 2. 加载流程图数据

```graphql
mutation LoadMap($map: String!) {
  loadFlowMap(map: $map)
}
```

```typescript
const mapJson = `{
  "nodes": [
    {
      "id": "node1",
      "type": "textInput",
      "data": {
        "name": "文本输入",
        "value": "Hello World"
      },
      "position": { "x": 100, "y": 100 }
    }
  ],
  "edges": [],
  "viewport": {
    "x": 0,
    "y": 0,
    "zoom": 1
  }
}`;

// 执行 mutation
const result = await fetch('/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: `
      mutation LoadMap($map: String!) {
        loadFlowMap(map: $map)
      }
    `,
    variables: {
      map: mapJson
    }
  })
});
```

### 3. 查询流程图数据

```graphql
query GetFlowMap {
  getFlowMap {
    nodes {
      id
      type
      name
      inputs {
        type
        value
        widget
        required
      }
      outputs {
        type
        description
      }
    }
    edges {
      id
      source
      target
      sourceHandle
      targetHandle
    }
    viewport {
      x
      y
      zoom
    }
  }
}
```

### 4. 更新节点数据

```graphql
mutation UpdateNode($id: ID!, $data: String!) {
  updateNode(id: $id, data: $data)
}
```

```typescript
const result = await fetch('/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: `
      mutation UpdateNode($id: ID!, $data: String!) {
        updateNode(id: $id, data: $data)
      }
    `,
    variables: {
      id: 'node1',
      data: JSON.stringify({
        name: '更新后的名称',
        value: '新的值'
      })
    }
  })
});
```

## API 文档

### Queries

- `getFlowMap`: 获取完整的流程图数据
- `getNode(id: ID!)`: 获取指定节点的详细信息

### Mutations

- `loadFlowMap(map: String!)`: 加载流程图数据
- `updateNode(id: ID!, data: String!)`: 更新节点数据
- `updateEdge(id: ID!, data: String!)`: 更新边的数据
- `updateViewport(x: Float!, y: Float!, zoom: Float!)`: 更新视口位置

## 类型定义

### Node

```typescript
interface Node {
  id: string;
  type: string;
  name: string;
  inputs: NodeInput[];
  outputs: NodeOutput[];
  description?: string;
  isCustom?: boolean;
}
```

### Edge

```typescript
interface Edge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}
```

### FlowMap

```typescript
interface FlowMap {
  nodes: Node[];
  edges: Edge[];
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
}
```

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 运行示例
pnpm start:example

# 运行测试
pnpm test
```

## 注意事项

1. **类型安全**
   - 所有的数据操作都是类型安全的
   - 使用 TypeScript 可以获得完整的类型提示

2. **性能优化**
   - 使用内存缓存提高性能
   - 支持批量操作
   - 异步处理大型数据

3. **错误处理**
   - 完整的错误处理机制
   - 详细的错误信息
   - 类型安全的错误返回

## 贡献

欢迎提交 Issue 或 Pull Request 来改进这个包。 