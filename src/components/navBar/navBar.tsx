import { Menu } from 'antd';
import { Link, useLocation } from 'umi';

const mockData = [
  { name: '产品技术', url: '/main/products' },
  { name: '解决方案', url: '/main/solutions' },
  { name: '服务案例', url: '/main/cases' },
  { name: '新闻中心', url: '/main/news' },
  { name: '品牌战略', url: '/main/strategy' },
  { name: '加入我们', url: '/main/joinus' },
  { name: '技术咨询', url: '/main/help' },
  { name: '数据管理', url: '/main/dataManagement' },
  { name: '用户管理', url: '/main/userManagement' },
  { name: '权限管理', url: '/main/authManagement' },
];

import st from './navBar.less';
const Header = () => {
  const params = useLocation();
  const defaulActiveKey =
    mockData.findIndex((item) => item.url == params.pathname) + '';
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
            return (
              <Menu.Item key={idx} active={params.pathname == item.url}>
                <Link to={item.url}>{item.name}</Link>
              </Menu.Item>
            );
          })}
        </Menu>
      </div>
    </div>
  );
};
export default Header;
