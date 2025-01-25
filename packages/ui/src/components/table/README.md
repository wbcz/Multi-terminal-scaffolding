# CrossPageTable 跨分页选择表格

基于 Ant Design Table 封装的支持跨分页选择和数据回显的表格组件。

## 特性

- ✨ 支持跨分页选择数据
- 🔄 支持选中数据回显
- 📊 保持与 antd Table 组件的功能一致
- 🎯 支持自定义选择逻辑
- 💫 支持清空选择
- 📝 显示已选择数量

## 安装

```bash
pnpm add @eleme/ui
```

## 使用示例

```tsx
import { CrossPageTable } from '@eleme/ui';

interface DataItem {
  id: number;
  name: string;
  age: number;
}

function MyTable() {
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);

  // 回显数据
  const echoData = [
    { id: 1, name: '张三', age: 25 },
    { id: 2, name: '李四', age: 30 }
  ];

  return (
    <CrossPageTable<DataItem>
      columns={columns}
      dataSource={dataSource}
      pagination={{
        total: 100,
        pageSize: 10
      }}
      total={100}
      selectedKeys={selectedKeys}
      onSelectedChange={setSelectedKeys}
      echoData={echoData}
      rowKey="id"
    />
  );
}
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| selectedKeys | 选中项的 key 数组 | `Key[]` | `[]` |
| onSelectedChange | 选中项变化时的回调 | `(selectedKeys: Key[]) => void` | - |
| total | 数据总数 | `number` | - |
| defaultSelectAll | 是否默认选中当前页所有数据 | `boolean` | `false` |
| echoData | 选中项的回显数据 | `T[]` | `[]` |

其他属性与 antd Table 组件一致。

### 注意事项

1. 数据项必须包含唯一的 `id` 字段作为 key
2. `echoData` 中的数据结构必须与表格数据结构一致
3. 组件内部会自动处理跨分页选择的状态维护

## 最佳实践

1. 配合后端分页使用
```tsx
function MyTable() {
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const response = await fetchData(page, pageSize);
      setData(response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CrossPageTable<DataItem>
      loading={loading}
      columns={columns}
      dataSource={data}
      pagination={{
        onChange: loadData,
        total: 100,
        pageSize: 10
      }}
      total={100}
      selectedKeys={selectedKeys}
      onSelectedChange={setSelectedKeys}
    />
  );
}
```

2. 处理选中数据
```tsx
function MyTable() {
  const handleSelectedChange = (selectedKeys: Key[]) => {
    console.log('选中的数据:', selectedKeys);
    // 可以在这里处理选中数据，比如调用接口等
  };

  return (
    <CrossPageTable<DataItem>
      // ...其他属性
      onSelectedChange={handleSelectedChange}
    />
  );
}
```

3. 使用回显数据
```tsx
function MyTable() {
  // 从后端获取已选中的数据
  const fetchSelectedData = async () => {
    const response = await api.getSelectedItems();
    return response.data;
  };

  return (
    <CrossPageTable<DataItem>
      // ...其他属性
      echoData={fetchSelectedData()}
    />
  );
}
```

## 贡献

欢迎提交 Issue 或 Pull Request 来改进这个组件。 