import Header from '@/components/header/header';
import st from './login.less'
import {Input, Button } from 'antd';
const login = () => {
  
}
const Login = () => {
  return <div>
    <Header />
    <div style={{height: 'calc(100vh - 50px)', display: 'flex', justifyContent:'center',alignItems:'center'}}>
      <div className={st.login}>
        <div><span>用户名:</span><Input placeholder="请输入用户名" /></div>
        <div><span>密码:</span><Input placeholder="请输入密码" /></div>
        <div className={st.btn}>
          <span></span><Button onClick={login} type="primary" style={{width: '100%'}}>登录</Button>
        </div>
      </div>
    </div>
  </div>
}
export default Login