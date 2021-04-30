import Header from '@/components/header/header';
import NavBar from '@/components/navBar/navBar';
import Footer from '@/components/footer/footer';
import { Switch, Route, Link } from 'umi';
import Home from './home/home';
import Products from './products/products';
import Solutions from './solutions/solutions';
import Cases from './cases/cases';
import News from './news/news';

export default function IndexPage() {
  return (
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
        <Route path="/main/strategy" component={Products} />
        <Route path="/main/joinus" component={Products} />
        <Route path="/main/help" component={Products} />
        <Route path="/main/dataManagement" component={Products} />
        <Route path="/main/authManagement" component={Products} />
      </Switch>
      <Footer />
    </div>
  );
}
