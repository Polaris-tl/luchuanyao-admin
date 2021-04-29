import { Link } from 'umi';
import img1 from '@/static/imgs/banner_product.jpg';

const date = new Date();
const weekMaps = ['日', '一', '二', '三', '四', '五', '六'];
const year = date.getFullYear();
const month = date.getMonth() + '';
const day = date.getDate() + '';

import st from './header.less';
const Header = () => {
  return (
    <div className={st.header}>
      <div className={st.box}>
        <div className={st.logo}></div>
        <div className={st.left}>橹船摇后台管理系统</div>
        <div className={st.right}>
          <span className={st.time}>
            {year + '-' + month.padStart(2, '0') + '-' + day.padStart(2, '0')}{' '}
            {'星期' + weekMaps[date.getDay()]}
          </span>
          <span>水手</span>
          <span className={st.avator}>
            <img src={img1} alt="" />
          </span>
        </div>
      </div>
    </div>
  );
};
export default Header;
