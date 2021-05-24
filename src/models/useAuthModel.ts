import { useState, useCallback, useEffect } from 'react';
import { history } from 'umi';
import { message } from 'antd';
import { myPost } from '@/utils/request';
export default function useAuthModel() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const user2 = sessionStorage.getItem('user');
    if (user2) {
      setUser(JSON.parse(user2));
    }
  }, []);
  const signin = useCallback(async (username, password) => {
    const userInfo = await myPost('/User/login', {
      password,
      username,
    });
    if (userInfo && userInfo.status == 1) {
      message.success('登录成功！');
      userInfo.data.username = username
      sessionStorage.setItem('user', JSON.stringify(userInfo.data));
      setUser(userInfo.data);
      history.push('/main/news');
    } else {
      message.error('登录失败！');
      setUser(null);
    }
  }, []);

  const signout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('user');
  }, []);

  return {
    user,
    signin,
    signout,
  };
}
