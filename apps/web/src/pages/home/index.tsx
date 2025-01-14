import React from 'react';
import styled from 'styled-components';
import { Card, Typography } from 'antd';
import { withAutoFlexLayout, analyzeLayout, generateLayoutStructure } from '@eleme/ui';

const { Text } = Typography;

// 传统布局样式
const TraditionalLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  .section {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .card-group {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }

  .card-item {
    flex: 1;
    min-width: 240px;
  }

  .info-list {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .info-item {
      padding: 12px;
      border-bottom: 1px solid #f0f0f0;
      &:last-child {
        border-bottom: none;
      }
    }
  }

  .stats-group {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;

    .stats-item {
      min-width: 160px;
      
      .label {
        color: #666;
        margin-bottom: 4px;
      }
      
      .value {
        font-size: 24px;
        font-weight: 500;
        color: #333;
      }
    }
  }

  .value-container {
    .number {
      font-size: 24px;
      font-weight: 500;
      margin-right: 4px;
    }
    .unit {
      color: #666;
    }
  }
`;

// 传统布局组件
const TraditionalComponent: React.FC = () => {
  return (
    <div>
      <div className="section">
        <h2>数据概览</h2>
        <div className="card-group">
          {['总订单', '今日订单', '待处理订单'].map((title, index) => (
            <div key={index} className="card-item">
              <Card>
                <h3>{title}</h3>
                <div className="value-container">
                  <span className="number">{Math.floor(Math.random() * 1000)}</span>
                  <span className="unit">单</span>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h2>最新动态</h2>
        <div className="info-list">
          {[
            '新订单提醒：订单号 123456 待处理',
            '系统通知：新版本更新提醒',
            '异常提醒：部分商品库存不足',
            '任务提醒：每日数据统计待确认'
          ].map((info, index) => (
            <div key={index} className="info-item">
              {info}
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h2>统计数据</h2>
        <div className="stats-group">
          {[
            { label: '总销售额', value: '¥123,456' },
            { label: '订单完成率', value: '98.5%' },
            { label: '客户满意度', value: '4.8/5' },
            { label: '平均配送时间', value: '28分钟' }
          ].map((stat, index) => (
            <div key={index} className="stats-item">
              <div className="label">{stat.label}</div>
              <div className="value">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 包装后的传统布局组件（带样式）
const StyledTraditionalComponent: React.FC = () => {
  return (
    <TraditionalLayout>
      <TraditionalComponent />
    </TraditionalLayout>
  );
};

// 使用自动弹性布局包装传统组件
const AutoFlexLayoutComponent = withAutoFlexLayout(TraditionalComponent);

const LayoutAnalysisDemo = styled.div`
  margin-top: 24px;
`;

const HomePage: React.FC = () => {
  const traditionalComponent = (
    <TraditionalLayout>
      <div className="section">
        <Card title="基础信息">
          <div className="info-list">
            <div className="info-item">项目名称：饿了么后台管理系统</div>
            <div className="info-item">项目描述：基于 React + TypeScript 的现代化后台管理系统</div>
          </div>
        </Card>
      </div>

      <div className="section">
        <Card title="数据统计">
          <div className="stats-group">
            <div className="stats-item">
              <Card>总用户数：1,234</Card>
            </div>
            <div className="stats-item">
              <Card>活跃用户：567</Card>
            </div>
            <div className="stats-item">
              <Card>今日订单：89</Card>
            </div>
          </div>
        </Card>
      </div>
    </TraditionalLayout>
  );

  // 分析布局
  const layoutInfo = analyzeLayout(traditionalComponent);

  return (
    <div>
      {traditionalComponent}
      
      <LayoutAnalysisDemo>
        <Text strong>布局分析结果：</Text>
        <div dangerouslySetInnerHTML={{ __html: generateLayoutStructure(layoutInfo) }} />
      </LayoutAnalysisDemo>
    </div>
  );
};

export default HomePage; 