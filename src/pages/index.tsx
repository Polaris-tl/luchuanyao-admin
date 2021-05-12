import Header from '@/components/header/header';
import NavBar from '@/components/navBar/navBar';
import Footer from '@/components/footer/footer';
import { Switch, Route, Link } from 'umi';
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
import AuthManagement from './authManegement/authManegement';
import './index.less';

export default function IndexPage() {
  return (
    <ConfigProvider locale={zhCN}>
      <div style={{ backgroundColor: '#f5f7fa' }}>
        <Header />
        <NavBar />
        <Switch>
          <Route path="/" exact component={Products} />
          <Route path="/main" exact component={Products} />
          <Route path="/main/products" component={Products} />
          <Route path="/main/solutions" component={Solutions} />
          <Route path="/main/cases" component={Cases} />
          <Route path="/main/news" component={News} />
          <Route path="/main/strategy" component={Strategy} />
          <Route path="/main/joinus" component={JoinUs} />
          <Route path="/main/help" component={Consult} />
          <Route path="/main/dataManagement" component={DataManagement} />
          <Route path="/main/userManagement" component={UserManagement} />
          <Route path="/main/authManagement" component={AuthManagement} />
        </Switch>
        <Footer />
      </div>
    </ConfigProvider>
  );
}
