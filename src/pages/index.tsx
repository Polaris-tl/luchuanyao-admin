import Header from '@/components/header/header'
import NavBar from '@/components/navBar/navBar'
import Footer from '@/components/footer/footer'
import {Switch, Route ,Link} from 'umi'
import Home from './home/home'

export default function IndexPage() {
  return (
    <div style={{backgroundColor: '#f5f7fa'}}>
      <Header />
      <NavBar />
      <Switch>
        <Route path='/' exact component={Home} />
      </Switch>
      <Footer />
    </div>
  );
}
