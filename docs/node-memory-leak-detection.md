# Node.js 内存泄漏检测和定位指南

## 检测工具和方法

### 1. 内存使用监控

#### 使用 Node.js 内置工具
```javascript
// 获取内存使用情况
const used = process.memoryUsage();
console.log({
  rss: `${Math.round(used.rss / 1024 / 1024 * 100) / 100} MB`,
  heapTotal: `${Math.round(used.heapTotal / 1024 / 1024 * 100) / 100} MB`,
  heapUsed: `${Math.round(used.heapUsed / 1024 / 1024 * 100) / 100} MB`,
  external: `${Math.round(used.external / 1024 / 1024 * 100) / 100} MB`,
});
```

#### 使用监控系统
```javascript
const monitor = require('node-monitor');

// 定期收集内存指标
setInterval(() => {
  const metrics = {
    memory: process.memoryUsage(),
    time: Date.now()
  };
  monitor.collect(metrics);
}, 5000);
```

### 2. 堆快照分析

#### 使用 heapdump 生成堆快照
```javascript
const heapdump = require('heapdump');

// 生成堆快照
function saveHeapSnapshot() {
  const filename = `heap-${Date.now()}.heapsnapshot`;
  heapdump.writeSnapshot(filename, (err) => {
    if (err) console.error('Failed to save heap snapshot:', err);
    else console.log('Heap snapshot saved to:', filename);
  });
}

// 定期生成快照或在特定条件下生成
if (process.memoryUsage().heapUsed > 1024 * 1024 * 1024) { // 1GB
  saveHeapSnapshot();
}
```

### 3. 实时性能分析

#### 使用 Clinic.js
```bash
# 安装 clinic
npm install -g clinic

# 运行应用并分析
clinic doctor -- node app.js

# 生成火焰图
clinic flame -- node app.js

# 堆内存分析
clinic heap -- node app.js
```

## 自动化检测方案

### 1. 内存泄漏检测服务
```javascript
export class MemoryMonitor {
  private readonly threshold: number;
  private readonly checkInterval: number;

  constructor(thresholdMB: number = 1024, intervalMS: number = 5000) {
    this.threshold = thresholdMB * 1024 * 1024;
    this.checkInterval = intervalMS;
    this.startMonitoring();
  }

  private startMonitoring() {
    setInterval(() => {
      const used = process.memoryUsage();
      
      if (used.heapUsed > this.threshold) {
        this.handleHighMemoryUsage(used);
      }
    }, this.checkInterval);
  }

  private handleHighMemoryUsage(memoryUsage: NodeJS.MemoryUsage) {
    // 发送告警，可以对接告警系统
    console.error(`Memory threshold exceeded:`, {
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      time: new Date().toISOString()
    });
    
    // 可以在这里触发堆快照生成
    heapdump.writeSnapshot(`./heapdump-${Date.now()}.heapsnapshot`);
  }
}
```

### 2. 集成到 PM2
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'app',
    script: 'app.js',
    max_memory_restart: '1G',
    node_args: [
      '--max-old-space-size=2048',
      '--trace-warnings',
      '--trace-gc',
      '--trace-gc-verbose'
    ],
    env: {
      NODE_OPTIONS: '--inspect'
    }
  }]
};
```

## 定位内存泄漏

### 1. 使用 Chrome DevTools 分析堆快照
1. 打开 Chrome DevTools
2. 加载 heapsnapshot 文件
3. 分析对象引用关系
4. 查找可疑的内存增长

### 2. 代码插桩
```javascript
class MemoryTracker {
  constructor() {
    this.tracked = new WeakMap();
  }

  track(object, info) {
    this.tracked.set(object, {
      stack: new Error().stack,
      time: Date.now(),
      info
    });
  }

  getInfo(object) {
    return this.tracked.get(object);
  }
}

const tracker = new MemoryTracker();

// 在可疑代码处添加跟踪
function suspectFunction() {
  const obj = {/* large object */};
  tracker.track(obj, 'Created in suspectFunction');
  return obj;
}
```

### 3. 内存使用记录
```javascript
class MemoryLogger {
  constructor() {
    this.logs = [];
    this.startTime = Date.now();
  }

  log(event) {
    const memory = process.memoryUsage();
    this.logs.push({
      time: Date.now() - this.startTime,
      event,
      memory: {
        heapUsed: memory.heapUsed,
        heapTotal: memory.heapTotal,
        rss: memory.rss
      },
      stack: new Error().stack
    });
  }

  analyze() {
    // 分析内存使用趋势
    return this.logs.map((log, index) => {
      if (index === 0) return log;
      const prev = this.logs[index - 1];
      return {
        ...log,
        diff: {
          heapUsed: log.memory.heapUsed - prev.memory.heapUsed,
          heapTotal: log.memory.heapTotal - prev.memory.heapTotal,
          rss: log.memory.rss - prev.memory.rss
        }
      };
    });
  }
}
```

## 最佳实践

### 1. 监控策略
- 设置合理的内存告警阈值
- 定期生成和分析堆快照
- 实施多级告警机制
- 保留历史数据用于趋势分析

### 2. 诊断流程
1. 确认内存泄漏现象
2. 收集内存使用数据
3. 生成堆快照
4. 分析对象引用
5. 定位问题代码
6. 验证修复效果

### 3. 预防措施
- 代码审查关注内存使用
- 压力测试包含内存指标
- 建立内存基准线
- 定期进行性能分析

## 工具推荐

1. **内存分析**
- node-heapdump：生成堆快照
- node-memwatch：内存泄漏检测
- v8-profiler：CPU 和内存分析

2. **监控系统**
- PM2：进程管理和监控
- New Relic：APM 工具
- DataDog：监控和告警

3. **分析工具**
- Chrome DevTools：堆快照分析
- Clinic.js：性能分析套件
- 0x：火焰图生成

## 常见问题定位

### 1. 事件监听器泄漏
```javascript
// 问题代码
class MyEmitter extends EventEmitter {
  constructor() {
    super();
    this.on('data', this.handleData);
  }
}

// 修复方案
class MyEmitter extends EventEmitter {
  constructor() {
    super();
    this.handleData = this.handleData.bind(this);
    this.on('data', this.handleData);
  }

  destroy() {
    this.removeListener('data', this.handleData);
  }
}
```

### 2. 缓存未清理
```javascript
// 错误示例
class Cache {
  private data: Map<string, any> = new Map();
  
  public set(key: string, value: any) {
    this.data.set(key, value);
  }
  // 没有清理机制，可能导致内存持续增长
}

// 正确示例
class Cache {
  private data: Map<string, any> = new Map();
  private readonly maxSize: number;

  constructor(maxSize: number = 1000) {
    this.maxSize = maxSize;
  }

  public set(key: string, value: any) {
    if (this.data.size >= this.maxSize) {
      const firstKey = this.data.keys().next().value;
      this.data.delete(firstKey);
    }
    this.data.set(key, value);
  }

  public clear() {
    this.data.clear();
  }
}
```

### 3. 定时器未清理
```javascript
// 问题代码
function startPolling() {
  setInterval(() => {
    // 轮询逻辑
  }, 5000);
}

// 修复方案
class Poller {
  start() {
    this.timer = setInterval(() => {
      // 轮询逻辑
    }, 5000);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
```

四、预防措施
    代码审查清单
        检查是否存在未清理的定时器
        检查事件监听器是否配对移除
        检查大对象是否及时释放
        检查缓存是否有大小限制
        检查是否存在循环引用
    监控建议
        设置合理的内存告警阈值
        定期生成堆快照进行对比
        监控关键业务接口的内存使用情况
        设置 OOM 自动重启机制
    最佳实践
        使用 WeakMap/WeakSet 存储对象引用
        实现 LRU 缓存替代简单的 Map 缓存
        大文件处理使用流式处理
        及时清理临时文件和缓存
        使用连接池管理数据库连接

五、内存泄漏会导致什么问题
一、直接影响
    性能下降
        内存占用持续增长，导致 GC（垃圾回收）频繁触发
        GC 过程会暂停 JavaScript 执行（Stop The World），造成服务响应延迟
        CPU 使用率升高，进一步影响服务性能
    服务不可用
        内存持续增长最终导致 OOM（Out Of Memory）
        Node.js 进程崩溃
        服务中断，需要重启恢复
    系统资源浪费
        无效内存占用导致其他进程可用内存减少
        服务器资源利用率下降
        可能需要增加服务器配置，造成不必要的成本支出

## 总结

Node.js 内存泄漏的检测和定位需要综合使用多种工具和方法。通过建立完善的监控系统、采用合适的分析工具，以及遵循最佳实践，我们可以及时发现和解决内存泄漏问题。关键是要建立起完整的检测、分析和修复流程，并在日常开发中注意预防。 