import { Menu } from 'antd';
import { Link, useLocation, useModel } from 'umi';
import { useEffect, useState } from 'react';
import { myGet } from '@/utils/request';

const mockData = [
  { name: '产品技术', url: '/main/products', id: 1 },
  { name: '解决方案', url: '/main/solutions', id: 5 },
  { name: '服务案例', url: '/main/cases', id: 2 },
  { name: '新闻中心', url: '/main/news', id: 3 },
  { name: '品牌战略', url: '/main/strategy', id: 6 },
  { name: '加入我们', url: '/main/joinus', id: 4 },
  { name: '其他其一', url: '/main/other1', id: 9 },
  { name: '其他其二', url: '/main/other2', id: 10 },
  { name: '技术咨询', url: '/main/help', id: 5 },
  { name: '数据管理', url: '/main/dataManagement', id: -1 },
  { name: '用户管理', url: '/main/userManagement', id: -1 },
  { name: '权限管理', url: '/main/authManagement', id: -1 },
];

import st from './navBar.less';
const Header = () => {
  const { user } = useModel('useAuthModel', (model) => ({
    user: model.user,
  }));
  const params = useLocation();
  const defaulActiveKey =
    mockData.findIndex((item) => item.url == params.pathname) + '';
  const [visitor, setVisitor] = useState<number[]>([]);
  useEffect(() => {
    myGet('/User/hasResourceFromUser', { id: user?.userId }).then((data) => {
      setVisitor(data.map((item: any) => item.id));
      data.forEach((item: any) => {
        const s = mockData.find((item2) => item2.id == item.id);
        s && (s.name = item.name);
      });
    });
  }, []);
  return (
    <div className={st.navBar}>
      <div className={st.box}>
        <Menu
          defaultSelectedKeys={[defaulActiveKey]}
          mode="horizontal"
          theme="dark"
          inlineIndent={12}
        >
          {mockData.map((item, idx) => {
            if (
              visitor.includes(item.id) ||
              (item.id == -1 && user.username == 'admin')
            ) {
              return (
                <Menu.Item key={idx} active={params.pathname == item.url}>
                  <Link to={item.url}>{item.name}</Link>
                </Menu.Item>
              );
            } else {
              return null;
            }
          })}
        </Menu>
      </div>
    </div>
  );
};
export default Header;
