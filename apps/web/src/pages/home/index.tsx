import { Button } from '@wbcz/ui';
import { useRequest } from '@wbcz/hooks';
import styled from 'styled-components';

const HomeContainer = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
`;

const StatusText = styled.div`
  color: #666;
  margin-top: 16px;
`;

interface UserInfo {
  name: string;
  age: number;
}

const mockFetchUserInfo = async (): Promise<{ code: number; data: UserInfo; message: string }> => {
  // 模拟 API 请求
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    code: 0,
    data: {
      name: '张三',
      age: 25
    },
    message: 'success'
  };
};

const Home = () => {
  const { data, loading, error, run } = useRequest<UserInfo>(mockFetchUserInfo);

  return (
    <HomeContainer>
      <Title>欢迎使用饿了么后台管理系统</Title>
      <Button type="primary" onClick={() => run()}>
        {loading ? '加载中...' : '获取用户信息'}
      </Button>
      <StatusText>
        {loading && '正在加载...'}
        {error && `加载失败: ${error.message}`}
        {data && `用户信息: ${data.name}, ${data.age}岁`}
      </StatusText>
    </HomeContainer>
  );
};

export default Home; 