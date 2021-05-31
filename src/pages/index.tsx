import Header from '@/components/header/header';
import NavBar from '@/components/navBar/navBar';
import Footer from '@/components/footer/footer';
import { Switch, Route, Link, Redirect } from 'umi';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import Home from './home/home';
import Products from './products/products';
import Solutions from './solutions/solutions';
import Cases from './cases/cases';
import News from './news/news';
import JoinUs from './joinus/joinus';
import Strategy from './strategy/strategy';
import Consult from './consult/consult';
import DataManagement from './dataManagement/dataManagement';
import UserManagement from './userManagement/userManagement';
import AuthManagement from './authManagement/authManagement';
import Other1 from './other1/products';
import Other2 from './other2/products';
import { useModel } from 'umi';
import './index.less';

const styles: any = {
  width: '1200px',
  margin: 'auto',
  height: 'calc(100vh - 106px)',
  fontSize: '17px',
  justifyContent: 'center',
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
};

export default function IndexPage() {
  const { user } = useModel('useAuthModel', (model) => ({ user: model.user }));
  const withAuth = (component: any) => {
    if (user) {
      return component;
    } else {
      return null;
    }
  };
  return (
    <ConfigProvider locale={zhCN}>
      <div style={{ backgroundColor: '#f5f7fa' }}>
        <Header />
        {user ? (
          <>
            <NavBar />
            <Switch>
              <Route path="/" exact component={withAuth(Products)} />
              <Route path="/main" exact component={withAuth(Products)} />
              <Route path="/main/products" component={withAuth(Products)} />
              <Route path="/main/solutions" component={withAuth(Solutions)} />
              <Route path="/main/cases" component={withAuth(Cases)} />
              <Route path="/main/other1" component={withAuth(Other1)} />
              <Route path="/main/other2" component={withAuth(Other2)} />
              <Route path="/main/news" component={withAuth(News)} />
              <Route path="/main/strategy" component={withAuth(Strategy)} />
              <Route path="/main/joinus" component={withAuth(JoinUs)} />
              <Route path="/main/help" component={withAuth(Consult)} />
              <Route
                path="/main/dataManagement"
                component={withAuth(DataManagement)}
              />
              <Route
                path="/main/userManagement"
                component={withAuth(UserManagement)}
              />
              <Route
                path="/main/authManagement"
                component={withAuth(AuthManagement)}
              />
            </Switch>
          </>
        ) : (
          <Redirect to="/login" />
          // <div style={styles}>
          //   您没有权限，请<Link to="/login">登录</Link>！
          // </div>
        )}

        <Footer />
      </div>
    </ConfigProvider>
  );
}
