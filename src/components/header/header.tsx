import { Link } from 'umi'
import img1 from '@/static/imgs/banner_product.jpg'

const mockData = [
  { name: '首页', url: '/'},
  { name: '产品技术', url: '/main/products'},
  { name: '解决方案', url: '/main/resolutions'},
  { name: '服务案例', url: '/main/cases'},
  { name: '新闻中心', url: '/main/news'},
  { name: '品牌战略', url: '/main/strategy'},
  { name: '加入我们', url: '/main/joinus'},
  { name: '技术咨询', url: '/main/help'},
]

import st from './header.less'
const Header = () => {
  return (
    <div className={st.header}>
        <div className={st.box}>
          <div className={st.logo}></div>
          <div className={st.left}>
            橹船摇后台管理系统
          </div>
          <div className={st.right}>
            <span className={st.time}>2021-03-27  星期六</span>
            <span>水手</span>
            <span className={st.avator}>
              <img src={img1} alt=""/>
            </span>
          </div>
      </div>
    </div>
  )
}
export default Header