import { useModel, history } from 'umi';
import Header from '@/components/header/header';
import { useState } from 'react';
import st from './login.less';
import { Input, Button } from 'antd';

const Login = () => {
  const [username, setName] = useState('');
  const [password, setPassword] = useState('');
  const { login, user } = useModel('useAuthModel', (model) => ({
    login: model.signin,
    user: model.user,
  }));
  if (user) {
    history.push('/');
  }
  return (
    <div>
      <Header />
      <div
        style={{
          height: 'calc(100vh - 50px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div className={st.login}>
          <div>
            <span>用户名:</span>
            <Input
              value={username}
              placeholder="请输入用户名"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <span>密码:</span>
            <Input
              value={password}
              placeholder="请输入密码"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className={st.btn}>
            <span></span>
            <Button
              onClick={() => {
                login(username, password);
              }}
              type="primary"
              style={{ width: '100%' }}
            >
              登录
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
