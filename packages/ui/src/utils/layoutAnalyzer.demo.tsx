import React from 'react';
import { analyzeLayout } from './layoutAnalyzer';

const DemoComponent: React.FC = () => {
  const element = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 20 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>标题</h1>
        <nav style={{ display: 'flex', gap: 8 }}>
          <a href="#">链接1</a>
          <a href="#">链接2</a>
        </nav>
      </header>
      <main style={{ display: 'flex', gap: 16 }}>
        <aside style={{ width: 200 }}>侧边栏</aside>
        <section style={{ flex: 1 }}>主内容区</section>
      </main>
      <footer style={{ textAlign: 'center' }}>页脚</footer>
    </div>
  );

  // 分析布局
  const layoutInfo = analyzeLayout(element);

  // 打印分析结果
  console.log('Layout Analysis Result:', JSON.stringify(layoutInfo, null, 2));

  return element;
};

export default DemoComponent; 